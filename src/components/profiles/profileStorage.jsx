// Profile storage utilities — all data in localStorage
import { ROOTS } from '../courseData/index';

// Derived course dimensions — single source of truth, no hardcoded numbers
const ROOT_COUNT = ROOTS.length;                          // 8
const ROOT_QUESTION_CRITERIA = 4;
const BRANCH_CRITERIA = 3;
const ROOT_MAX_POINTS = ROOT_QUESTION_CRITERIA + BRANCH_CRITERIA * 3; // 13

const PROFILES_KEY = 'exsci_profiles';
const ACTIVE_PROFILE_KEY = 'exsci_active_profile';

export function getProfiles() {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getActiveProfileId() {
  return localStorage.getItem(ACTIVE_PROFILE_KEY) || null;
}

export function setActiveProfileId(id) {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

export function clearActiveProfile() {
  localStorage.removeItem(ACTIVE_PROFILE_KEY);
}

export function getProfileById(id) {
  return getProfiles().find(p => p.id === id) || null;
}

export function createProfile({ name, color, emoji, pin }) {
  const id = 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const profile = {
    id,
    name,
    color,
    emoji: emoji || null,
    pin: pin || null,
    createdAt: Date.now(),
    lastStudied: null,
    progress: {},    // { rootId: { status, root_question_passed, branch_1_passed, branch_2_passed, branch_3_passed } }
    coldAttemptCounts: {}, // { 'rootId_questionType': count }
  };
  const profiles = getProfiles();
  profiles.push(profile);
  saveProfiles(profiles);
  return profile;
}

export function updateProfile(id, updates) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === id);
  if (idx === -1) return null;
  profiles[idx] = { ...profiles[idx], ...updates };
  saveProfiles(profiles);
  return profiles[idx];
}

export function deleteProfile(id) {
  const profiles = getProfiles().filter(p => p.id !== id);
  saveProfiles(profiles);
  if (getActiveProfileId() === id) clearActiveProfile();
}

// Progress helpers scoped to a profile
export function getProfileProgress(profileId) {
  const profile = getProfileById(profileId);
  return profile?.progress || {};
}

export function setProfileRootProgress(profileId, rootId, data) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].progress) profiles[idx].progress = {};
  profiles[idx].progress[rootId] = { ...(profiles[idx].progress[rootId] || {}), ...data };
  profiles[idx].lastStudied = Date.now();
  saveProfiles(profiles);
}

export function getProfileRootProgress(profileId, rootId) {
  const progress = getProfileProgress(profileId);
  return progress[rootId] || null;
}

export function incrementColdAttempt(profileId, rootId, questionType) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return 1;
  if (!profiles[idx].coldAttemptCounts) profiles[idx].coldAttemptCounts = {};
  const key = `${rootId}_${questionType}`;
  profiles[idx].coldAttemptCounts[key] = (profiles[idx].coldAttemptCounts[key] || 0) + 1;
  saveProfiles(profiles);
  return profiles[idx].coldAttemptCounts[key];
}

export function getColdAttemptCount(profileId, rootId, questionType) {
  const profile = getProfileById(profileId);
  if (!profile?.coldAttemptCounts) return 0;
  return profile.coldAttemptCounts[`${rootId}_${questionType}`] || 0;
}

export function resetProfileProgress(profileId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  profiles[idx].progress = {};
  profiles[idx].coldAttemptCounts = {};
  profiles[idx].lastStudied = null;
  saveProfiles(profiles);
}

export function getProfileCompletionPercent(profileId) {
  const profile = getProfileById(profileId);
  if (!profile?.progress) return 0;
  const complete = Object.values(profile.progress).filter(p => p.status === 'complete' || p.status === 'mastered').length;
  return Math.round((complete / ROOT_COUNT) * 100);
}

export function markRootComplete(profileId, rootId) {
  const existing = getProfileRootProgress(profileId, rootId) || {};
  setProfileRootProgress(profileId, rootId, {
    ...existing,
    status: 'complete',
    root_question_passed: true,
    branch_1_passed: true,
    branch_2_passed: true,
    branch_3_passed: true,
    completedAt: existing.completedAt || Date.now(),
  });
}

export function markRootMastered(profileId, rootId) {
  const existing = getProfileRootProgress(profileId, rootId) || {};
  setProfileRootProgress(profileId, rootId, {
    ...existing,
    status: 'mastered',
    root_question_passed: true,
    branch_1_passed: true,
    branch_2_passed: true,
    branch_3_passed: true,
    completedAt: existing.completedAt || Date.now(),
    masteredAt: existing.masteredAt || Date.now(),
  });
}

// Timestamps helpers
export function setRootStartedAt(profileId, rootId) {
  const existing = getProfileRootProgress(profileId, rootId) || {};
  if (!existing.startedAt) {
    setProfileRootProgress(profileId, rootId, { ...existing, startedAt: Date.now() });
  }
}

export function setRootCompletedAt(profileId, rootId) {
  const existing = getProfileRootProgress(profileId, rootId) || {};
  if (!existing.completedAt) {
    setProfileRootProgress(profileId, rootId, { ...existing, completedAt: Date.now() });
  }
}

// Encountered dictionary terms per profile per root
export function getEncounteredTerms(profileId, rootId) {
  const profile = getProfileById(profileId);
  return profile?.encounteredTerms?.[rootId] || [];
}

export function addEncounteredTerm(profileId, rootId, term) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].encounteredTerms) profiles[idx].encounteredTerms = {};
  if (!profiles[idx].encounteredTerms[rootId]) profiles[idx].encounteredTerms[rootId] = [];
  if (!profiles[idx].encounteredTerms[rootId].includes(term)) {
    profiles[idx].encounteredTerms[rootId].push(term);
    saveProfiles(profiles);
  }
}

// Mode open tracking (for Practice dot nudge)
export function getOpenedModes(profileId, rootId) {
  const profile = getProfileById(profileId);
  return profile?.openedModes?.[rootId] || [];
}

export function recordModeOpened(profileId, rootId, mode) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].openedModes) profiles[idx].openedModes = {};
  if (!profiles[idx].openedModes[rootId]) profiles[idx].openedModes[rootId] = [];
  if (!profiles[idx].openedModes[rootId].includes(mode)) {
    profiles[idx].openedModes[rootId].push(mode);
    saveProfiles(profiles);
  }
}

// ─── Criteria-based scoring (Patch 1) ─────────────────────────────────────────
// questionCriteria: { root: 0-4, branch_1: 0-3, branch_2: 0-3, branch_3: 0-3 }
// Stored as best score (highest ever achieved) per question.

const MAX_CRITERIA = { root: 4, branch_1: 3, branch_2: 3, branch_3: 3 };

export function getQuestionCriteria(profileId, rootId) {
  const profile = getProfileById(profileId);
  return profile?.questionCriteria?.[rootId] || { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
}

export function setQuestionCriteria(profileId, rootId, questionType, count) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].questionCriteria) profiles[idx].questionCriteria = {};
  if (!profiles[idx].questionCriteria[rootId]) profiles[idx].questionCriteria[rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  const current = profiles[idx].questionCriteria[rootId][questionType] || 0;
  // Always keep best (highest) score
  profiles[idx].questionCriteria[rootId][questionType] = Math.max(current, count);
  profiles[idx].lastStudied = Date.now();
  saveProfiles(profiles);
}

export function setQuestionCriteriaExact(profileId, rootId, questionType, count) {
  // Sets exact value (for dev tools)
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].questionCriteria) profiles[idx].questionCriteria = {};
  if (!profiles[idx].questionCriteria[rootId]) profiles[idx].questionCriteria[rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  profiles[idx].questionCriteria[rootId][questionType] = count;
  profiles[idx].lastStudied = Date.now();
  saveProfiles(profiles);
}

export function getRootPoints(profileId, rootId) {
  const qc = getQuestionCriteria(profileId, rootId);
  return (qc.root || 0) + (qc.branch_1 || 0) + (qc.branch_2 || 0) + (qc.branch_3 || 0);
}

export function getTotalPoints(profileId) {
  let total = 0;
  for (let i = 1; i <= ROOT_COUNT; i++) total += getRootPoints(profileId, i);
  return total;
}

// Derive status from criteria points (display only)
export function deriveRootStatus(qc) {
  const rootPts = qc?.root || 0;
  const b1 = qc?.branch_1 || 0;
  const b2 = qc?.branch_2 || 0;
  const b3 = qc?.branch_3 || 0;
  const total = rootPts + b1 + b2 + b3;
  if (total === 0) return 'not_started';
  if (rootPts >= 2 && b1 >= 1 && b2 >= 1 && b3 >= 1 && rootPts >= 4 && b1 >= 3 && b2 >= 3 && b3 >= 3) return 'mastered';
  if (rootPts >= 2) return 'complete';
  return 'in_progress';
}

// Quality tier for a question result
export function getQualityTier(metCount, isRoot) {
  if (isRoot) {
    if (metCount >= 4) return 'excellent';
    if (metCount >= 3) return 'great';
    if (metCount >= 2) return 'pass';
    return 'incomplete';
  } else {
    if (metCount >= 3) return 'excellent';
    if (metCount >= 2) return 'great';
    if (metCount >= 1) return 'pass';
    return 'incomplete';
  }
}

// Best tier storage per question
export function getBestTier(profileId, rootId, questionType) {
  const profile = getProfileById(profileId);
  return profile?.bestTiers?.[rootId]?.[questionType] || null;
}

export function setBestTier(profileId, rootId, questionType, tier) {
  const TIER_RANK = { incomplete: 0, pass: 1, great: 2, excellent: 3 };
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].bestTiers) profiles[idx].bestTiers = {};
  if (!profiles[idx].bestTiers[rootId]) profiles[idx].bestTiers[rootId] = {};
  const current = profiles[idx].bestTiers[rootId][questionType] || 'incomplete';
  if ((TIER_RANK[tier] || 0) > (TIER_RANK[current] || 0)) {
    profiles[idx].bestTiers[rootId][questionType] = tier;
    saveProfiles(profiles);
  }
}

// ─── End criteria scoring ──────────────────────────────────────────────────────

// ─── Vocabulary / Flashcard storage ───────────────────────────────────────────
// flashcardTiers: { [rootId]: { [termName]: 'attempted' | 'pass' | 'great' | 'excellent' } }

const TIER_RANK = { incomplete: 0, attempted: 1, pass: 2, great: 3, excellent: 4 };

export function getFlashcardTier(profileId, rootId, termName) {
  const profile = getProfileById(profileId);
  return profile?.flashcardTiers?.[rootId]?.[termName] || null;
}

export function setFlashcardTier(profileId, rootId, termName, tier) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].flashcardTiers) profiles[idx].flashcardTiers = {};
  if (!profiles[idx].flashcardTiers[rootId]) profiles[idx].flashcardTiers[rootId] = {};
  const current = profiles[idx].flashcardTiers[rootId][termName] || 'incomplete';
  if ((TIER_RANK[tier] || 0) > (TIER_RANK[current] || 0)) {
    profiles[idx].flashcardTiers[rootId][termName] = tier;
    saveProfiles(profiles);
  }
}

export function setFlashcardTierExact(profileId, rootId, termName, tier) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].flashcardTiers) profiles[idx].flashcardTiers = {};
  if (!profiles[idx].flashcardTiers[rootId]) profiles[idx].flashcardTiers[rootId] = {};
  profiles[idx].flashcardTiers[rootId][termName] = tier;
  saveProfiles(profiles);
}

export function clearAllFlashcardTiers(profileId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  profiles[idx].flashcardTiers = {};
  saveProfiles(profiles);
}

// Count how many terms have been attempted (any tier) across all roots
// "attempted" = any tier including 'attempted' tier
// "excellentScore" = count of 'excellent' tiers (1 point each toward vocab score)
export function getVocabStats(profileId) {
  const profile = getProfileById(profileId);
  const allTiers = profile?.flashcardTiers || {};
  let attempted = 0, pass = 0, great = 0, excellent = 0;
  Object.values(allTiers).forEach(rootTerms => {
    Object.values(rootTerms).forEach(tier => {
      if (tier && tier !== null) {
        // 'attempted' tier still counts toward attempted count
        attempted++;
        if (tier === 'pass') pass++;
        if (tier === 'great') great++;
        if (tier === 'excellent') excellent++;
      }
    });
  });
  return { attempted, pass, great, excellent, excellentScore: excellent };
}

// Vocabulary score = count of 'excellent' tiers across all roots (max 80)
export function getTotalVocabScore(profileId) {
  const { excellent } = getVocabStats(profileId);
  return excellent;
}

// Per-root vocab score (max 10)
export function getRootVocabScore(profileId, rootId) {
  const profile = getProfileById(profileId);
  const rootTiers = profile?.flashcardTiers?.[rootId] || {};
  return Object.values(rootTiers).filter(t => t === 'excellent').length;
}

// ─── Gauntlet storage ─────────────────────────────────────────────────────────
// gauntletCriteria: { [rootId]: { root: 0-4, branch_1: 0-3, branch_2: 0-3, branch_3: 0-3 } }
// Stored as best sitting score (highest ever per criterion per root).

export function getGauntletCriteria(profileId, rootId) {
  const profile = getProfileById(profileId);
  return profile?.gauntletCriteria?.[rootId] || { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
}

export function setGauntletCriteria(profileId, rootId, questionType, count) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].gauntletCriteria) profiles[idx].gauntletCriteria = {};
  if (!profiles[idx].gauntletCriteria[rootId]) profiles[idx].gauntletCriteria[rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  const current = profiles[idx].gauntletCriteria[rootId][questionType] || 0;
  profiles[idx].gauntletCriteria[rootId][questionType] = Math.max(current, count);
  profiles[idx].lastStudied = Date.now();
  saveProfiles(profiles);
}

export function setGauntletCriteriaExact(profileId, rootId, questionType, count) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].gauntletCriteria) profiles[idx].gauntletCriteria = {};
  if (!profiles[idx].gauntletCriteria[rootId]) profiles[idx].gauntletCriteria[rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  profiles[idx].gauntletCriteria[rootId][questionType] = count;
  saveProfiles(profiles);
}

export function setGauntletCriteriaBulk(profileId, rootId, data) {
  // data: { root, branch_1, branch_2, branch_3 } — stores best of each
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].gauntletCriteria) profiles[idx].gauntletCriteria = {};
  const existing = profiles[idx].gauntletCriteria[rootId] || { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  profiles[idx].gauntletCriteria[rootId] = {
    root: Math.max(existing.root || 0, data.root || 0),
    branch_1: Math.max(existing.branch_1 || 0, data.branch_1 || 0),
    branch_2: Math.max(existing.branch_2 || 0, data.branch_2 || 0),
    branch_3: Math.max(existing.branch_3 || 0, data.branch_3 || 0),
  };
  profiles[idx].lastStudied = Date.now();
  saveProfiles(profiles);
}

export function resetGauntletForRoot(profileId, rootId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].gauntletCriteria) profiles[idx].gauntletCriteria = {};
  profiles[idx].gauntletCriteria[rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  saveProfiles(profiles);
}

export function getGauntletRootPoints(profileId, rootId) {
  const gc = getGauntletCriteria(profileId, rootId);
  return (gc.root || 0) + (gc.branch_1 || 0) + (gc.branch_2 || 0) + (gc.branch_3 || 0);
}

export function getTotalGauntletPoints(profileId) {
  let total = 0;
  for (let i = 1; i <= ROOT_COUNT; i++) total += getGauntletRootPoints(profileId, i);
  return total;
}

export function isRootPerfected(profileId, rootId) {
  const gc = getGauntletCriteria(profileId, rootId);
  return (gc.root || 0) >= 4 && (gc.branch_1 || 0) >= 3 && (gc.branch_2 || 0) >= 3 && (gc.branch_3 || 0) >= 3;
}

// Check if all 4 cold attempts have been passed at any tier (eligible for gauntlet)
export function isGauntletEligible(profileId, rootId) {
  const qc = getQuestionCriteria(profileId, rootId);
  return (qc.root || 0) >= 2 && (qc.branch_1 || 0) >= 1 && (qc.branch_2 || 0) >= 1 && (qc.branch_3 || 0) >= 1;
}
// ─── End Gauntlet storage ──────────────────────────────────────────────────────

// ─── Gauntlet passed dates ─────────────────────────────────────────────────────
// gauntletPassedDates: { [rootId]: timestamp } — set when all 4 questions passed

export function getGauntletPassedDate(profileId, rootId) {
  const profile = getProfileById(profileId);
  return profile?.gauntletPassedDates?.[rootId] || null;
}

export function setGauntletPassedDate(profileId, rootId, ts) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].gauntletPassedDates) profiles[idx].gauntletPassedDates = {};
  if (!profiles[idx].gauntletPassedDates[rootId]) {
    profiles[idx].gauntletPassedDates[rootId] = ts;
    saveProfiles(profiles);
  }
}

export function clearGauntletPassedDate(profileId, rootId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].gauntletPassedDates) return;
  delete profiles[idx].gauntletPassedDates[rootId];
  saveProfiles(profiles);
}

export function isRootGauntletPassed(profileId, rootId) {
  return !!getGauntletPassedDate(profileId, rootId);
}

export function isAllGauntletsPassed(profileId) {
  for (let i = 1; i <= ROOT_COUNT; i++) {
    if (!isRootGauntletPassed(profileId, i)) return false;
  }
  return true;
}

// ─── Absolute Gauntlet storage ────────────────────────────────────────────────
// absoluteGauntlet: { inProgress: bool, completedRoots: { [rootId]: {results, score} }, conqueredAt: timestamp }

export function getAbsoluteGauntlet(profileId) {
  const profile = getProfileById(profileId);
  return profile?.absoluteGauntlet || null;
}

export function setAbsoluteGauntletSession(profileId, data) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  profiles[idx].absoluteGauntlet = { ...(profiles[idx].absoluteGauntlet || {}), ...data };
  saveProfiles(profiles);
}

export function clearAbsoluteGauntletSession(profileId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  // Preserve conqueredAt if set
  const existing = profiles[idx].absoluteGauntlet || {};
  profiles[idx].absoluteGauntlet = existing.conqueredAt ? { conqueredAt: existing.conqueredAt } : null;
  saveProfiles(profiles);
}

export function isAbsoluteGauntletConquered(profileId) {
  const profile = getProfileById(profileId);
  return !!(profile?.absoluteGauntlet?.conqueredAt);
}

// ─── End Absolute Gauntlet storage ────────────────────────────────────────────

// Stats helpers
export function getProfileStats(profileId) {
  const profile = getProfileById(profileId);
  if (!profile) return null;
  const progress = profile.progress || {};
  const counts = profile.coldAttemptCounts || {};

  let totalAttempts = 0;
  let totalPassed = 0;
  Object.keys(counts).forEach(key => { totalAttempts += counts[key]; });
  // passed = roots/branches that are passed
  const allProgress = Object.values(progress);
  allProgress.forEach(p => {
    if (p.root_question_passed) totalPassed++;
    if (p.branch_1_passed) totalPassed++;
    if (p.branch_2_passed) totalPassed++;
    if (p.branch_3_passed) totalPassed++;
  });

  const complete = allProgress.filter(p => p.status === 'complete').length;
  const mastered = allProgress.filter(p => p.status === 'mastered').length;
  const inProgress = allProgress.filter(p => p.status === 'in_progress').length;
  const notStarted = 8 - complete - mastered - inProgress;

  const firstSession = profile.createdAt ? Math.floor((Date.now() - profile.createdAt) / (1000 * 60 * 60 * 24)) : 0;

  // Strongest root: highest status then earliest completion
  const statusRank = { mastered: 3, complete: 2, in_progress: 1, not_started: 0 };
  let strongestRootId = null;
  let bestRank = -1;
  let bestDate = Infinity;
  for (let i = 1; i <= 8; i++) {
    const p = progress[i];
    if (!p) continue;
    const rank = statusRank[p.status] || 0;
    const date = p.completedAt || Infinity;
    if (rank > bestRank || (rank === bestRank && date < bestDate)) {
      bestRank = rank;
      bestDate = date;
      strongestRootId = i;
    }
  }

  return { totalAttempts, totalPassed, complete, mastered, inProgress, notStarted, firstSession, strongestRootId, progress };
}