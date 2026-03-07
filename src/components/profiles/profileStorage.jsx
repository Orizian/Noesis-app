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
  const complete = Object.values(profile.progress).filter(p => p.status === 'complete').length;
  return Math.round((complete / total) * 100);
}

export function markRootComplete(profileId, rootId) {
  setProfileRootProgress(profileId, rootId, {
    status: 'complete',
    root_question_passed: true,
    branch_1_passed: true,
    branch_2_passed: true,
    branch_3_passed: true,
  });
}

export function markRootMastered(profileId, rootId) {
  // Mastered = complete with all branches
  markRootComplete(profileId, rootId);
}