// Profile storage utilities — all data in localStorage
// All course-scoped data is keyed by courseId to prevent bleed between courses.

const PROFILES_KEY = 'exsci_profiles';
const ACTIVE_PROFILE_KEY = 'exsci_active_profile';
const MIGRATION_KEY = 'exsci_storage_v2_migrated';

// ─── Migration ──────────────────────────────────────────────────────────────
// Runs once: moves old un-namespaced course data into courseId = 'exercise-science' namespace.
export function runStorageMigrationIfNeeded() {
  if (localStorage.getItem(MIGRATION_KEY)) return;
  const LEGACY_COURSE_ID = 'exercise-science';
  try {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
    let changed = false;
    profiles.forEach(profile => {
      // Migrate progress
      if (profile.progress && !profile.progress[LEGACY_COURSE_ID]) {
        profile.progress = { [LEGACY_COURSE_ID]: profile.progress };
        changed = true;
      }
      // Migrate coldAttemptCounts
      if (profile.coldAttemptCounts && !profile.coldAttemptCounts[LEGACY_COURSE_ID]) {
        profile.coldAttemptCounts = { [LEGACY_COURSE_ID]: profile.coldAttemptCounts };
        changed = true;
      }
      // Migrate questionCriteria
      if (profile.questionCriteria && !profile.questionCriteria[LEGACY_COURSE_ID]) {
        profile.questionCriteria = { [LEGACY_COURSE_ID]: profile.questionCriteria };
        changed = true;
      }
      // Migrate bestTiers
      if (profile.bestTiers && !profile.bestTiers[LEGACY_COURSE_ID]) {
        profile.bestTiers = { [LEGACY_COURSE_ID]: profile.bestTiers };
        changed = true;
      }
      // Migrate flashcardTiers
      if (profile.flashcardTiers && !profile.flashcardTiers[LEGACY_COURSE_ID]) {
        profile.flashcardTiers = { [LEGACY_COURSE_ID]: profile.flashcardTiers };
        changed = true;
      }
      // Migrate encounteredTerms
      if (profile.encounteredTerms && !profile.encounteredTerms[LEGACY_COURSE_ID]) {
        profile.encounteredTerms = { [LEGACY_COURSE_ID]: profile.encounteredTerms };
        changed = true;
      }
      // Migrate openedModes
      if (profile.openedModes && !profile.openedModes[LEGACY_COURSE_ID]) {
        profile.openedModes = { [LEGACY_COURSE_ID]: profile.openedModes };
        changed = true;
      }
      // Migrate gauntletCriteria
      if (profile.gauntletCriteria && !profile.gauntletCriteria[LEGACY_COURSE_ID]) {
        profile.gauntletCriteria = { [LEGACY_COURSE_ID]: profile.gauntletCriteria };
        changed = true;
      }
      // Migrate gauntletPassedDates
      if (profile.gauntletPassedDates && !profile.gauntletPassedDates[LEGACY_COURSE_ID]) {
        profile.gauntletPassedDates = { [LEGACY_COURSE_ID]: profile.gauntletPassedDates };
        changed = true;
      }
      // Migrate absoluteGauntlet (course-scoped)
      if (profile.absoluteGauntlet && !profile.absoluteGauntlet[LEGACY_COURSE_ID]) {
        profile.absoluteGauntlet = { [LEGACY_COURSE_ID]: profile.absoluteGauntlet };
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    }
  } catch (e) {
    // Migration failed silently — don't block the app
  }
  localStorage.setItem(MIGRATION_KEY, '1');
}

// ─── Core profile helpers ────────────────────────────────────────────────────

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
    progress: {},
    coldAttemptCounts: {},
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

// ─── Progress helpers (course-scoped) ────────────────────────────────────────

export function getProfileProgress(profileId, courseId) {
  const profile = getProfileById(profileId);
  return profile?.progress?.[courseId] || {};
}

export function setProfileRootProgress(profileId, courseId, rootId, data) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].progress) profiles[idx].progress = {};
  if (!profiles[idx].progress[courseId]) profiles[idx].progress[courseId] = {};
  profiles[idx].progress[courseId][rootId] = { ...(profiles[idx].progress[courseId][rootId] || {}), ...data };
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
  if (!profiles[idx].coldAttemptCounts) profiles[idx].coldAttemptCounts = {};
  if (!profiles[idx].coldAttemptCounts[courseId]) profiles[idx].coldAttemptCounts[courseId] = {};
  const key = `${rootId}_${questionType}`;
  profiles[idx].coldAttemptCounts[courseId][key] = (profiles[idx].coldAttemptCounts[courseId][key] || 0) + 1;
  saveProfiles(profiles);
  return profiles[idx].coldAttemptCounts[courseId][key];
}

export function getColdAttemptCount(profileId, courseId, rootId, questionType) {
  const profile = getProfileById(profileId);
  if (!profile?.coldAttemptCounts?.[courseId]) return 0;
  return profile.coldAttemptCounts[courseId][`${rootId}_${questionType}`] || 0;
}

export function resetProfileProgress(profileId, courseId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].progress) profiles[idx].progress = {};
  if (!profiles[idx].coldAttemptCounts) profiles[idx].coldAttemptCounts = {};
  profiles[idx].progress[courseId] = {};
  profiles[idx].coldAttemptCounts[courseId] = {};
  profiles[idx].lastStudied = null;
  saveProfiles(profiles);
}

export function getProfileCompletionPercent(profileId, courseId, rootCount) {
  const profile = getProfileById(profileId);
  if (!profile?.progress?.[courseId]) return 0;
  const complete = Object.values(profile.progress[courseId]).filter(p => p.status === 'complete' || p.status === 'mastered').length;
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

// ─── Encountered terms (course-scoped) ───────────────────────────────────────

export function getEncounteredTerms(profileId, courseId, rootId) {
  const profile = getProfileById(profileId);
  return profile?.encounteredTerms?.[courseId]?.[rootId] || [];
}

export function addEncounteredTerm(profileId, courseId, rootId, term) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].encounteredTerms) profiles[idx].encounteredTerms = {};
  if (!profiles[idx].encounteredTerms[courseId]) profiles[idx].encounteredTerms[courseId] = {};
  if (!profiles[idx].encounteredTerms[courseId][rootId]) profiles[idx].encounteredTerms[courseId][rootId] = [];
  if (!profiles[idx].encounteredTerms[courseId][rootId].includes(term)) {
    profiles[idx].encounteredTerms[courseId][rootId].push(term);
    saveProfiles(profiles);
  }
}

// ─── Mode open tracking (course-scoped) ──────────────────────────────────────

export function getOpenedModes(profileId, courseId, rootId) {
  const profile = getProfileById(profileId);
  return profile?.openedModes?.[courseId]?.[rootId] || [];
}

export function recordModeOpened(profileId, courseId, rootId, mode) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].openedModes) profiles[idx].openedModes = {};
  if (!profiles[idx].openedModes[courseId]) profiles[idx].openedModes[courseId] = {};
  if (!profiles[idx].openedModes[courseId][rootId]) profiles[idx].openedModes[courseId][rootId] = [];
  if (!profiles[idx].openedModes[courseId][rootId].includes(mode)) {
    profiles[idx].openedModes[courseId][rootId].push(mode);
    saveProfiles(profiles);
  }
}

// ─── Criteria-based scoring (course-scoped) ───────────────────────────────────

export function getQuestionCriteria(profileId, courseId, rootId) {
  const profile = getProfileById(profileId);
  return profile?.questionCriteria?.[courseId]?.[rootId] || { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
}

export function setQuestionCriteria(profileId, courseId, rootId, questionType, count) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].questionCriteria) profiles[idx].questionCriteria = {};
  if (!profiles[idx].questionCriteria[courseId]) profiles[idx].questionCriteria[courseId] = {};
  if (!profiles[idx].questionCriteria[courseId][rootId]) profiles[idx].questionCriteria[courseId][rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  const current = profiles[idx].questionCriteria[courseId][rootId][questionType] || 0;
  profiles[idx].questionCriteria[courseId][rootId][questionType] = Math.max(current, count);
  profiles[idx].lastStudied = Date.now();
  saveProfiles(profiles);
}

export function setQuestionCriteriaExact(profileId, courseId, rootId, questionType, count) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].questionCriteria) profiles[idx].questionCriteria = {};
  if (!profiles[idx].questionCriteria[courseId]) profiles[idx].questionCriteria[courseId] = {};
  if (!profiles[idx].questionCriteria[courseId][rootId]) profiles[idx].questionCriteria[courseId][rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  profiles[idx].questionCriteria[courseId][rootId][questionType] = count;
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

export function getBestTier(profileId, courseId, rootId, questionType) {
  const profile = getProfileById(profileId);
  return profile?.bestTiers?.[courseId]?.[rootId]?.[questionType] || null;
}

export function setBestTier(profileId, courseId, rootId, questionType, tier) {
  const TIER_RANK = { incomplete: 0, pass: 1, great: 2, excellent: 3 };
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].bestTiers) profiles[idx].bestTiers = {};
  if (!profiles[idx].bestTiers[courseId]) profiles[idx].bestTiers[courseId] = {};
  if (!profiles[idx].bestTiers[courseId][rootId]) profiles[idx].bestTiers[courseId][rootId] = {};
  const current = profiles[idx].bestTiers[courseId][rootId][questionType] || 'incomplete';
  if ((TIER_RANK[tier] || 0) > (TIER_RANK[current] || 0)) {
    profiles[idx].bestTiers[courseId][rootId][questionType] = tier;
    saveProfiles(profiles);
  }
}

// ─── Vocabulary / Flashcard storage (course-scoped) ───────────────────────────

const TIER_RANK = { incomplete: 0, attempted: 1, pass: 2, great: 3, excellent: 4 };

export function getFlashcardTier(profileId, courseId, rootId, termName) {
  const profile = getProfileById(profileId);
  return profile?.flashcardTiers?.[courseId]?.[rootId]?.[termName] || null;
}

export function setFlashcardTier(profileId, courseId, rootId, termName, tier) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].flashcardTiers) profiles[idx].flashcardTiers = {};
  if (!profiles[idx].flashcardTiers[courseId]) profiles[idx].flashcardTiers[courseId] = {};
  if (!profiles[idx].flashcardTiers[courseId][rootId]) profiles[idx].flashcardTiers[courseId][rootId] = {};
  const current = profiles[idx].flashcardTiers[courseId][rootId][termName] || 'incomplete';
  if ((TIER_RANK[tier] || 0) > (TIER_RANK[current] || 0)) {
    profiles[idx].flashcardTiers[courseId][rootId][termName] = tier;
    saveProfiles(profiles);
  }
}

export function setFlashcardTierExact(profileId, courseId, rootId, termName, tier) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].flashcardTiers) profiles[idx].flashcardTiers = {};
  if (!profiles[idx].flashcardTiers[courseId]) profiles[idx].flashcardTiers[courseId] = {};
  if (!profiles[idx].flashcardTiers[courseId][rootId]) profiles[idx].flashcardTiers[courseId][rootId] = {};
  profiles[idx].flashcardTiers[courseId][rootId][termName] = tier;
  saveProfiles(profiles);
}

export function clearAllFlashcardTiers(profileId, courseId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].flashcardTiers) profiles[idx].flashcardTiers = {};
  profiles[idx].flashcardTiers[courseId] = {};
  saveProfiles(profiles);
}

export function getVocabStats(profileId, courseId) {
  const profile = getProfileById(profileId);
  const allTiers = profile?.flashcardTiers?.[courseId] || {};
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
  const rootTiers = profile?.flashcardTiers?.[courseId]?.[rootId] || {};
  return Object.values(rootTiers).filter(t => t === 'excellent').length;
}

// ─── Gauntlet storage (course-scoped) ─────────────────────────────────────────

export function getGauntletCriteria(profileId, courseId, rootId) {
  const profile = getProfileById(profileId);
  return profile?.gauntletCriteria?.[courseId]?.[rootId] || { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
}

export function setGauntletCriteria(profileId, courseId, rootId, questionType, count) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].gauntletCriteria) profiles[idx].gauntletCriteria = {};
  if (!profiles[idx].gauntletCriteria[courseId]) profiles[idx].gauntletCriteria[courseId] = {};
  if (!profiles[idx].gauntletCriteria[courseId][rootId]) profiles[idx].gauntletCriteria[courseId][rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  const current = profiles[idx].gauntletCriteria[courseId][rootId][questionType] || 0;
  profiles[idx].gauntletCriteria[courseId][rootId][questionType] = Math.max(current, count);
  profiles[idx].lastStudied = Date.now();
  saveProfiles(profiles);
}

export function setGauntletCriteriaExact(profileId, courseId, rootId, questionType, count) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].gauntletCriteria) profiles[idx].gauntletCriteria = {};
  if (!profiles[idx].gauntletCriteria[courseId]) profiles[idx].gauntletCriteria[courseId] = {};
  if (!profiles[idx].gauntletCriteria[courseId][rootId]) profiles[idx].gauntletCriteria[courseId][rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  profiles[idx].gauntletCriteria[courseId][rootId][questionType] = count;
  saveProfiles(profiles);
}

export function setGauntletCriteriaBulk(profileId, courseId, rootId, data) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].gauntletCriteria) profiles[idx].gauntletCriteria = {};
  if (!profiles[idx].gauntletCriteria[courseId]) profiles[idx].gauntletCriteria[courseId] = {};
  const existing = profiles[idx].gauntletCriteria[courseId][rootId] || { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  profiles[idx].gauntletCriteria[courseId][rootId] = {
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
  if (!profiles[idx].gauntletCriteria) profiles[idx].gauntletCriteria = {};
  if (!profiles[idx].gauntletCriteria[courseId]) profiles[idx].gauntletCriteria[courseId] = {};
  profiles[idx].gauntletCriteria[courseId][rootId] = { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
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

// ─── Gauntlet passed dates (course-scoped) ─────────────────────────────────────

export function getGauntletPassedDate(profileId, courseId, rootId) {
  const profile = getProfileById(profileId);
  return profile?.gauntletPassedDates?.[courseId]?.[rootId] || null;
}

export function setGauntletPassedDate(profileId, courseId, rootId, ts) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].gauntletPassedDates) profiles[idx].gauntletPassedDates = {};
  if (!profiles[idx].gauntletPassedDates[courseId]) profiles[idx].gauntletPassedDates[courseId] = {};
  if (!profiles[idx].gauntletPassedDates[courseId][rootId]) {
    profiles[idx].gauntletPassedDates[courseId][rootId] = ts;
    saveProfiles(profiles);
  }
}

export function clearGauntletPassedDate(profileId, courseId, rootId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].gauntletPassedDates?.[courseId]) return;
  delete profiles[idx].gauntletPassedDates[courseId][rootId];
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

// ─── Absolute Gauntlet storage (course-scoped) ────────────────────────────────

export function getAbsoluteGauntlet(profileId, courseId) {
  const profile = getProfileById(profileId);
  return profile?.absoluteGauntlet?.[courseId] || null;
}

export function setAbsoluteGauntletSession(profileId, courseId, data) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  if (!profiles[idx].absoluteGauntlet) profiles[idx].absoluteGauntlet = {};
  profiles[idx].absoluteGauntlet[courseId] = { ...(profiles[idx].absoluteGauntlet[courseId] || {}), ...data };
  saveProfiles(profiles);
}

export function clearAbsoluteGauntletSession(profileId, courseId) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const existing = profiles[idx].absoluteGauntlet?.[courseId] || {};
  if (!profiles[idx].absoluteGauntlet) profiles[idx].absoluteGauntlet = {};
  profiles[idx].absoluteGauntlet[courseId] = existing.conqueredAt ? { conqueredAt: existing.conqueredAt } : null;
  saveProfiles(profiles);
}

export function isAbsoluteGauntletConquered(profileId, courseId) {
  const profile = getProfileById(profileId);
  return !!(profile?.absoluteGauntlet?.[courseId]?.conqueredAt);
}

// ─── Stats helpers (course-scoped) ───────────────────────────────────────────

export function getProfileStats(profileId, courseId, rootCount) {
  const profile = getProfileById(profileId);
  if (!profile) return null;
  const progress = profile.progress?.[courseId] || {};
  const counts = profile.coldAttemptCounts?.[courseId] || {};

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