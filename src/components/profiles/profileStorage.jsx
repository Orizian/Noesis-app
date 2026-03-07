// Profile storage utilities — all data in localStorage

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
  const total = 8;
  const complete = Object.values(profile.progress).filter(p => p.status === 'complete' || p.status === 'mastered').length;
  return Math.round((complete / total) * 100);
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