// Profile storage utilities — all data in localStorage
// All course-specific data is namespaced under courseId to prevent cross-course bleed.

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
    // All course-specific data lives under courseData[courseId][...]
    courseData: {},
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

// ─── Course-scoped data accessor ──────────────────────────────────────────────
// Returns the courseData[courseId] sub-object for a profile (read-only).
function getCourseData(profile, courseId) {
  return profile?.courseData?.[courseId] || {};
}

// Ensures profile.courseData[courseId] exists and returns it on the mutable profiles array entry.
function ensureCourseData(profiles, idx, courseId) {
  if (!profiles[idx].courseData) profiles[idx].courseData = {};
  if (!profiles[idx].courseData[courseId]) profiles[idx].courseData[courseId] = {};
  return profiles[idx].courseData[courseId];
}

// ─── Progress helpers scoped to a profile + course ────────────────────────────

export function getProfileProgress(profileId, courseId) {
  const profile = getProfileById(profileId);
  return getCourseData(profile, courseId).progress || {};
}

export function setProfileRootProgress(profileId, courseId, rootId, data) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.progress) cd.progress = {};
  cd.progress[rootId] = { ...(cd.progress[rootId] || {}), ...data };
  profiles[idx].lastStudied = Date.now();
  saveProfiles(profiles);
}

export function getProfileRootProgress(profileId, courseId, rootId) {
  const progress = getProfileProgress(profileId, courseId);
  return progress[rootId] || null;
}

export function incrementColdAttempt(profileId, courseId, rootId, questionType) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return 1;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.coldAttemptCounts) cd.coldAttemptCounts = {};
  const key = `${rootId}_${questionType}`;
  cd.coldAttemptCounts[key] = (cd.coldAttemptCounts[key] || 0) + 1;
  saveProfiles(profiles);
  return cd.coldAttemptCounts[key];
}

export function getColdAttemptCount(profileId, courseId, rootId, questionType) {
  const profile = getProfileById(profileId);
  const cd = getCourseData(profile, courseId);
  return cd.coldAttemptCounts?.[`${rootId}_${questionType}`] || 0;
}

export function resetProfileProgress(profileId, courseId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  cd.progress = {};
  cd.coldAttemptCounts = {};
  profiles[idx].lastStudied = null;
  saveProfiles(profiles);
}

export function getProfileCompletionPercent(profileId, courseId, rootCount) {
  const profile = getProfileById(profileId);
  const cd = getCourseData(profile, courseId);
  if (!cd.progress) return 0;
  const complete = Object.values(cd.progress).filter(p => p.status === 'complete' || p.status === 'mastered').length;
  return Math.round((complete / rootCount) * 100);
}

export function markRootComplete(profileId, courseId, rootId) {
  const existing = getProfileRootProgress(profileId, courseId, rootId) || {};
  setProfileRootProgress(profileId, courseId, rootId, {
    ...existing,
    status: 'complete',
    root_question_passed: true,
    branch_1_passed: true,
    branch_2_passed: true,
    branch_3_passed: true,
    completedAt: existing.completedAt || Date.now(),
  });
}

export function markRootMastered(profileId, courseId, rootId) {
  const existing = getProfileRootProgress(profileId, courseId, rootId) || {};
  setProfileRootProgress(profileId, courseId, rootId, {
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

// Timestamp helpers
export function setRootStartedAt(profileId, courseId, rootId) {
  const existing = getProfileRootProgress(profileId, courseId, rootId) || {};
  if (!existing.startedAt) {
    setProfileRootProgress(profileId, courseId, rootId, { ...existing, startedAt: Date.now() });
  }
}

export function setRootCompletedAt(profileId, courseId, rootId) {
  const existing = getProfileRootProgress(profileId, courseId, rootId) || {};
  if (!existing.completedAt) {
    setProfileRootProgress(profileId, courseId, rootId, { ...existing, completedAt: Date.now() });
  }
}

// Encountered dictionary terms per profile per course per root
export function getEncounteredTerms(profileId, courseId, rootId) {
  const profile = getProfileById(profileId);
  return getCourseData(profile, courseId).encounteredTerms?.[rootId] || [];
}

export function addEncounteredTerm(profileId, courseId, rootId, term) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.encounteredTerms) cd.encounteredTerms = {};
  if (!cd.encounteredTerms[rootId]) cd.encounteredTerms[rootId] = [];
  if (!cd.encounteredTerms[rootId].includes(term)) {
    cd.encounteredTerms[rootId].push(term);
    saveProfiles(profiles);
  }
}

// Mode open tracking (for Practice dot nudge)
export function getOpenedModes(profileId, courseId, rootId) {
  const profile = getProfileById(profileId);
  return getCourseData(profile, courseId).openedModes?.[rootId] || [];
}

export function recordModeOpened(profileId, courseId, rootId, mode) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.openedModes) cd.openedModes = {};
  if (!cd.openedModes[rootId]) cd.openedModes[rootId] = [];
  if (!cd.openedModes[rootId].includes(mode)) {
    cd.openedModes[rootId].push(mode);
    saveProfiles(profiles);
  }
}

// ─── Criteria-based scoring ────────────────────────────────────────────────────

export function getQuestionCriteria(profileId, courseId, rootId) {
  const profile = getProfileById(profileId);
  return getCourseData(profile, courseId).questionCriteria?.[rootId] || { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
}

export function setQuestionCriteria(profileId, courseId, rootId, questionType, count) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.questionCriteria) cd.questionCriteria = {};
  if (!cd.questionCriteria[rootId]) cd.questionCriteria[rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  const current = cd.questionCriteria[rootId][questionType] || 0;
  cd.questionCriteria[rootId][questionType] = Math.max(current, count);
  profiles[idx].lastStudied = Date.now();
  saveProfiles(profiles);
}

export function setQuestionCriteriaExact(profileId, courseId, rootId, questionType, count) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.questionCriteria) cd.questionCriteria = {};
  if (!cd.questionCriteria[rootId]) cd.questionCriteria[rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  cd.questionCriteria[rootId][questionType] = count;
  profiles[idx].lastStudied = Date.now();
  saveProfiles(profiles);
}

export function getRootPoints(profileId, courseId, rootId) {
  const qc = getQuestionCriteria(profileId, courseId, rootId);
  return (qc.root || 0) + (qc.branch_1 || 0) + (qc.branch_2 || 0) + (qc.branch_3 || 0);
}

export function getTotalPoints(profileId, courseId, rootCount) {
  let total = 0;
  for (let i = 1; i <= rootCount; i++) total += getRootPoints(profileId, courseId, i);
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
  if (rootPts >= 4 && b1 >= 3 && b2 >= 3 && b3 >= 3) return 'mastered';
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
export function getBestTier(profileId, courseId, rootId, questionType) {
  const profile = getProfileById(profileId);
  return getCourseData(profile, courseId).bestTiers?.[rootId]?.[questionType] || null;
}

export function setBestTier(profileId, courseId, rootId, questionType, tier) {
  const TIER_RANK = { incomplete: 0, pass: 1, great: 2, excellent: 3 };
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.bestTiers) cd.bestTiers = {};
  if (!cd.bestTiers[rootId]) cd.bestTiers[rootId] = {};
  const current = cd.bestTiers[rootId][questionType] || 'incomplete';
  if ((TIER_RANK[tier] || 0) > (TIER_RANK[current] || 0)) {
    cd.bestTiers[rootId][questionType] = tier;
    saveProfiles(profiles);
  }
}

// ─── Vocabulary / Flashcard storage ───────────────────────────────────────────

const TIER_RANK = { incomplete: 0, attempted: 1, pass: 2, great: 3, excellent: 4 };

export function getFlashcardTier(profileId, courseId, rootId, termName) {
  const profile = getProfileById(profileId);
  return getCourseData(profile, courseId).flashcardTiers?.[rootId]?.[termName] || null;
}

export function setFlashcardTier(profileId, courseId, rootId, termName, tier) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.flashcardTiers) cd.flashcardTiers = {};
  if (!cd.flashcardTiers[rootId]) cd.flashcardTiers[rootId] = {};
  const current = cd.flashcardTiers[rootId][termName] || 'incomplete';
  if ((TIER_RANK[tier] || 0) > (TIER_RANK[current] || 0)) {
    cd.flashcardTiers[rootId][termName] = tier;
    saveProfiles(profiles);
  }
}

export function setFlashcardTierExact(profileId, courseId, rootId, termName, tier) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.flashcardTiers) cd.flashcardTiers = {};
  if (!cd.flashcardTiers[rootId]) cd.flashcardTiers[rootId] = {};
  cd.flashcardTiers[rootId][termName] = tier;
  saveProfiles(profiles);
}

export function clearAllFlashcardTiers(profileId, courseId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  cd.flashcardTiers = {};
  saveProfiles(profiles);
}

export function getVocabStats(profileId, courseId) {
  const profile = getProfileById(profileId);
  const allTiers = getCourseData(profile, courseId).flashcardTiers || {};
  let attempted = 0, pass = 0, great = 0, excellent = 0;
  Object.values(allTiers).forEach(rootTerms => {
    Object.values(rootTerms).forEach(tier => {
      if (tier && tier !== null) {
        attempted++;
        if (tier === 'pass') pass++;
        if (tier === 'great') great++;
        if (tier === 'excellent') excellent++;
      }
    });
  });
  return { attempted, pass, great, excellent, excellentScore: excellent };
}

export function getTotalVocabScore(profileId, courseId) {
  const { excellent } = getVocabStats(profileId, courseId);
  return excellent;
}

export function getRootVocabScore(profileId, courseId, rootId) {
  const profile = getProfileById(profileId);
  const rootTiers = getCourseData(profile, courseId).flashcardTiers?.[rootId] || {};
  return Object.values(rootTiers).filter(t => t === 'excellent').length;
}

// ─── Gauntlet storage ─────────────────────────────────────────────────────────

export function getGauntletCriteria(profileId, courseId, rootId) {
  const profile = getProfileById(profileId);
  return getCourseData(profile, courseId).gauntletCriteria?.[rootId] || { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
}

export function setGauntletCriteria(profileId, courseId, rootId, questionType, count) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.gauntletCriteria) cd.gauntletCriteria = {};
  if (!cd.gauntletCriteria[rootId]) cd.gauntletCriteria[rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  const current = cd.gauntletCriteria[rootId][questionType] || 0;
  cd.gauntletCriteria[rootId][questionType] = Math.max(current, count);
  profiles[idx].lastStudied = Date.now();
  saveProfiles(profiles);
}

export function setGauntletCriteriaExact(profileId, courseId, rootId, questionType, count) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.gauntletCriteria) cd.gauntletCriteria = {};
  if (!cd.gauntletCriteria[rootId]) cd.gauntletCriteria[rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  cd.gauntletCriteria[rootId][questionType] = count;
  saveProfiles(profiles);
}

export function setGauntletCriteriaBulk(profileId, courseId, rootId, data) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.gauntletCriteria) cd.gauntletCriteria = {};
  const existing = cd.gauntletCriteria[rootId] || { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  cd.gauntletCriteria[rootId] = {
    root: Math.max(existing.root || 0, data.root || 0),
    branch_1: Math.max(existing.branch_1 || 0, data.branch_1 || 0),
    branch_2: Math.max(existing.branch_2 || 0, data.branch_2 || 0),
    branch_3: Math.max(existing.branch_3 || 0, data.branch_3 || 0),
  };
  profiles[idx].lastStudied = Date.now();
  saveProfiles(profiles);
}

export function resetGauntletForRoot(profileId, courseId, rootId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.gauntletCriteria) cd.gauntletCriteria = {};
  cd.gauntletCriteria[rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  saveProfiles(profiles);
}

export function getGauntletRootPoints(profileId, courseId, rootId) {
  const gc = getGauntletCriteria(profileId, courseId, rootId);
  return (gc.root || 0) + (gc.branch_1 || 0) + (gc.branch_2 || 0) + (gc.branch_3 || 0);
}

export function getTotalGauntletPoints(profileId, courseId, rootCount) {
  let total = 0;
  for (let i = 1; i <= rootCount; i++) total += getGauntletRootPoints(profileId, courseId, i);
  return total;
}

export function isRootPerfected(profileId, courseId, rootId) {
  const gc = getGauntletCriteria(profileId, courseId, rootId);
  return (gc.root || 0) >= 4 && (gc.branch_1 || 0) >= 3 && (gc.branch_2 || 0) >= 3 && (gc.branch_3 || 0) >= 3;
}

export function isGauntletEligible(profileId, courseId, rootId) {
  const qc = getQuestionCriteria(profileId, courseId, rootId);
  return (qc.root || 0) >= 2 && (qc.branch_1 || 0) >= 1 && (qc.branch_2 || 0) >= 1 && (qc.branch_3 || 0) >= 1;
}

// ─── Gauntlet passed dates ─────────────────────────────────────────────────────

export function getGauntletPassedDate(profileId, courseId, rootId) {
  const profile = getProfileById(profileId);
  return getCourseData(profile, courseId).gauntletPassedDates?.[rootId] || null;
}

export function setGauntletPassedDate(profileId, courseId, rootId, ts) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.gauntletPassedDates) cd.gauntletPassedDates = {};
  if (!cd.gauntletPassedDates[rootId]) {
    cd.gauntletPassedDates[rootId] = ts;
    saveProfiles(profiles);
  }
}

export function clearGauntletPassedDate(profileId, courseId, rootId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  if (!cd.gauntletPassedDates) return;
  delete cd.gauntletPassedDates[rootId];
  saveProfiles(profiles);
}

export function isRootGauntletPassed(profileId, courseId, rootId) {
  return !!getGauntletPassedDate(profileId, courseId, rootId);
}

export function isAllGauntletsPassed(profileId, courseId, rootCount) {
  for (let i = 1; i <= rootCount; i++) {
    if (!isRootGauntletPassed(profileId, courseId, i)) return false;
  }
  return true;
}

// ─── Absolute Gauntlet storage ────────────────────────────────────────────────

export function getAbsoluteGauntlet(profileId, courseId) {
  const profile = getProfileById(profileId);
  return getCourseData(profile, courseId).absoluteGauntlet || null;
}

export function setAbsoluteGauntletSession(profileId, courseId, data) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  cd.absoluteGauntlet = { ...(cd.absoluteGauntlet || {}), ...data };
  saveProfiles(profiles);
}

export function clearAbsoluteGauntletSession(profileId, courseId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const cd = ensureCourseData(profiles, idx, courseId);
  const existing = cd.absoluteGauntlet || {};
  cd.absoluteGauntlet = existing.conqueredAt ? { conqueredAt: existing.conqueredAt } : null;
  saveProfiles(profiles);
}

export function isAbsoluteGauntletConquered(profileId, courseId) {
  const profile = getProfileById(profileId);
  return !!(getCourseData(profile, courseId).absoluteGauntlet?.conqueredAt);
}

// ─── Stats helpers ────────────────────────────────────────────────────────────

export function getProfileStats(profileId, courseId, rootCount) {
  const profile = getProfileById(profileId);
  if (!profile) return null;
  const cd = getCourseData(profile, courseId);
  const progress = cd.progress || {};
  const counts = cd.coldAttemptCounts || {};

  let totalAttempts = 0;
  let totalPassed = 0;
  Object.keys(counts).forEach(key => { totalAttempts += counts[key]; });
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
  const notStarted = rootCount - complete - mastered - inProgress;

  const firstSession = profile.createdAt ? Math.floor((Date.now() - profile.createdAt) / (1000 * 60 * 60 * 24)) : 0;

  const statusRank = { mastered: 3, complete: 2, in_progress: 1, not_started: 0 };
  let strongestRootId = null;
  let bestRank = -1;
  let bestDate = Infinity;
  for (let i = 1; i <= rootCount; i++) {
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