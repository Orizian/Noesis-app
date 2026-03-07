// ─── Profile & Progress Store (localStorage) ───────────────────────────────
// Shape: { profiles: Profile[], activeProfileId: string | null }
//
// Profile shape: { id, name, color, emoji, createdAt, lastStudiedAt,
//   streak, longestStreak, lastStreakDate, totalColdAttempts,
//   totalColdPasses, totalPracticeAttempts, roots: { [rootId]: RootData } }
//
// RootData: { status, root_question_passed, branch_1_passed,
//   branch_2_passed, branch_3_passed, startedAt, completedAt, masteredAt }

const STORE_KEY = 'exsci_profiles';

export const AVATAR_COLORS = [
  '#6366f1','#ec4899','#f59e0b','#10b981',
  '#3b82f6','#ef4444','#8b5cf6','#14b8a6',
];

export const AVATAR_EMOJIS = [
  '🏋️','⚡','🧠','🔥','⭐','🎯','💪','🚀',
  '🧬','⚙️','📊','🏃','🩺','🌊','🦁','🎓',
];

function getStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { profiles: [], activeProfileId: null };
    return JSON.parse(raw);
  } catch { return { profiles: [], activeProfileId: null }; }
}

function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function defaultRootData() {
  return {
    status: 'not_started',
    root_question_passed: false,
    branch_1_passed: false,
    branch_2_passed: false,
    branch_3_passed: false,
    startedAt: null,
    completedAt: null,
    masteredAt: null,
  };
}

function computeRootStatus(root) {
  const allBranches = root.branch_1_passed && root.branch_2_passed && root.branch_3_passed;
  if (root.root_question_passed && allBranches) return 'mastered';
  if (root.root_question_passed) return 'complete';
  if (root.status === 'in_progress') return 'in_progress';
  return 'not_started';
}

function _updateStreak(profile) {
  const today = new Date().toISOString().slice(0, 10);
  if (profile.lastStreakDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (profile.lastStreakDate === yesterday) {
    profile.streak = (profile.streak || 0) + 1;
  } else {
    profile.streak = 1;
  }
  profile.longestStreak = Math.max(profile.longestStreak || 0, profile.streak);
  profile.lastStreakDate = today;
}

// ─── Profile CRUD ─────────────────────────────────────────────────────────
export function getProfiles() { return getStore().profiles; }
export function getActiveProfileId() { return getStore().activeProfileId; }
export function getActiveProfile() {
  const s = getStore();
  return s.profiles.find(p => p.id === s.activeProfileId) || null;
}
export function setActiveProfile(id) {
  const s = getStore(); s.activeProfileId = id; saveStore(s);
}

export function createProfile({ name, color, emoji, pin }) {
  const s = getStore();
  const id = `p_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  const profile = {
    id, name,
    color: color || AVATAR_COLORS[0],
    emoji: emoji || null,
    pin: pin || null,
    hasSeenTutorial: false,
    createdAt: new Date().toISOString(),
    lastStudiedAt: null,
    streak: 0, longestStreak: 0, lastStreakDate: null,
    totalColdAttempts: 0, totalColdPasses: 0, totalPracticeAttempts: 0,
    coldAttemptCounts: {}, // { "rootId_questionType": number }
    roots: {},
  };
  s.profiles.push(profile);
  s.activeProfileId = id;
  saveStore(s);
  return profile;
}

export function updateProfile(id, updates) {
  const s = getStore();
  const idx = s.profiles.findIndex(p => p.id === id);
  if (idx === -1) return;
  s.profiles[idx] = { ...s.profiles[idx], ...updates };
  saveStore(s);
}

export function deleteProfile(id) {
  const s = getStore();
  s.profiles = s.profiles.filter(p => p.id !== id);
  if (s.activeProfileId === id) s.activeProfileId = null;
  saveStore(s);
}

// ─── Root / Progress ───────────────────────────────────────────────────────
export function getRootData(profileId, rootId) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  return p?.roots?.[rootId] || defaultRootData();
}

export function getAllRootData(profileId) {
  const s = getStore();
  return s.profiles.find(x => x.id === profileId)?.roots || {};
}

export function markRootInProgress(profileId, rootId) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return;
  if (!p.roots[rootId]) p.roots[rootId] = defaultRootData();
  const r = p.roots[rootId];
  if (r.status === 'not_started') {
    r.status = 'in_progress';
    r.startedAt = new Date().toISOString();
  }
  p.lastStudiedAt = new Date().toISOString();
  _updateStreak(p);
  saveStore(s);
}

export function markQuestionPassed(profileId, rootId, questionType) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return;
  if (!p.roots[rootId]) p.roots[rootId] = defaultRootData();
  const r = p.roots[rootId];
  const prev = r.status;
  if (questionType === 'root') r.root_question_passed = true;
  if (questionType === 'branch_1') r.branch_1_passed = true;
  if (questionType === 'branch_2') r.branch_2_passed = true;
  if (questionType === 'branch_3') r.branch_3_passed = true;
  r.status = computeRootStatus(r);
  if (!r.startedAt) r.startedAt = new Date().toISOString();
  const now = new Date().toISOString();
  if ((r.status === 'complete' || r.status === 'mastered') && prev !== 'complete' && prev !== 'mastered') r.completedAt = now;
  if (r.status === 'mastered' && prev !== 'mastered') r.masteredAt = now;
  p.totalColdAttempts = (p.totalColdAttempts || 0) + 1;
  p.totalColdPasses = (p.totalColdPasses || 0) + 1;
  p.lastStudiedAt = now;
  _updateStreak(p);
  saveStore(s);
}

export function recordColdAttemptStat(profileId, passed) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return;
  p.totalColdAttempts = (p.totalColdAttempts || 0) + 1;
  if (passed) p.totalColdPasses = (p.totalColdPasses || 0) + 1;
  p.lastStudiedAt = new Date().toISOString();
  _updateStreak(p);
  saveStore(s);
}

export function recordPracticeAttemptStat(profileId) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return;
  p.totalPracticeAttempts = (p.totalPracticeAttempts || 0) + 1;
  p.lastStudiedAt = new Date().toISOString();
  _updateStreak(p);
  saveStore(s);
}

export function markRootComplete(profileId, rootId) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return;
  if (!p.roots[rootId]) p.roots[rootId] = defaultRootData();
  const r = p.roots[rootId];
  r.root_question_passed = true;
  r.status = computeRootStatus(r);
  if (!r.startedAt) r.startedAt = new Date().toISOString();
  if (!r.completedAt) r.completedAt = new Date().toISOString();
  if (r.status === 'mastered' && !r.masteredAt) r.masteredAt = new Date().toISOString();
  saveStore(s);
}

export function markBranchPassed(profileId, rootId, branchKey) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return;
  if (!p.roots[rootId]) p.roots[rootId] = defaultRootData();
  const r = p.roots[rootId];
  r[branchKey] = true;
  r.status = computeRootStatus(r);
  if (!r.startedAt) r.startedAt = new Date().toISOString();
  if (r.status === 'mastered' && !r.masteredAt) r.masteredAt = new Date().toISOString();
  saveStore(s);
}

export function resetRootProgress(profileId, rootId) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return;
  p.roots[rootId] = defaultRootData();
  saveStore(s);
}

export function resetAllProgress(profileId) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return;
  p.roots = {};
  p.streak = 0; p.longestStreak = 0; p.lastStreakDate = null;
  p.totalColdAttempts = 0; p.totalColdPasses = 0; p.totalPracticeAttempts = 0;
  p.lastStudiedAt = null;
  saveStore(s);
}

// ─── Tutorial ─────────────────────────────────────────────────────────────
export function markTutorialSeen(profileId) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return;
  p.hasSeenTutorial = true;
  saveStore(s);
}

// ─── Cold Attempt Counts ──────────────────────────────────────────────────
export function getColdAttemptCount(profileId, rootId, questionType) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return 0;
  const key = `${rootId}_${questionType}`;
  return p.coldAttemptCounts?.[key] || 0;
}

export function incrementColdAttemptCount(profileId, rootId, questionType) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return 1;
  if (!p.coldAttemptCounts) p.coldAttemptCounts = {};
  const key = `${rootId}_${questionType}`;
  p.coldAttemptCounts[key] = (p.coldAttemptCounts[key] || 0) + 1;
  saveStore(s);
  return p.coldAttemptCounts[key];
}

// ─── PIN management ────────────────────────────────────────────────────────
export function setProfilePin(profileId, pin) {
  updateProfile(profileId, { pin: pin || null });
}

export function resetProfilePinAndProgress(profileId) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return;
  p.pin = null;
  p.roots = {};
  p.streak = 0; p.longestStreak = 0; p.lastStreakDate = null;
  p.totalColdAttempts = 0; p.totalColdPasses = 0; p.totalPracticeAttempts = 0;
  p.coldAttemptCounts = {};
  p.lastStudiedAt = null;
  saveStore(s);
}

// ─── Dev tools ────────────────────────────────────────────────────────────
export function devMarkAllComplete(profileId) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return;
  const now = new Date().toISOString();
  for (let i = 1; i <= 8; i++) {
    if (!p.roots[i]) p.roots[i] = defaultRootData();
    p.roots[i].root_question_passed = true;
    p.roots[i].status = 'complete';
    if (!p.roots[i].startedAt) p.roots[i].startedAt = now;
    if (!p.roots[i].completedAt) p.roots[i].completedAt = now;
  }
  saveStore(s);
}

export function devMarkAllMastered(profileId) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return;
  const now = new Date().toISOString();
  for (let i = 1; i <= 8; i++) {
    p.roots[i] = {
      status: 'mastered', root_question_passed: true,
      branch_1_passed: true, branch_2_passed: true, branch_3_passed: true,
      startedAt: now, completedAt: now, masteredAt: now,
    };
  }
  saveStore(s);
}

export function devMarkRootComplete(profileId, rootId) {
  markRootComplete(profileId, rootId);
}

export function devMarkRootMastered(profileId, rootId) {
  const s = getStore();
  const p = s.profiles.find(x => x.id === profileId);
  if (!p) return;
  const now = new Date().toISOString();
  p.roots[rootId] = {
    status: 'mastered', root_question_passed: true,
    branch_1_passed: true, branch_2_passed: true, branch_3_passed: true,
    startedAt: now, completedAt: now, masteredAt: now,
  };
  saveStore(s);
}

// ─── Scoring ──────────────────────────────────────────────────────────────
export function getScoreForStatus(status) {
  if (status === 'mastered') return 6;
  if (status === 'complete') return 3;
  if (status === 'in_progress') return 1;
  return 0;
}

export function getTotalScore(profileId) {
  const roots = getAllRootData(profileId);
  let total = 0;
  for (let i = 1; i <= 8; i++) total += getScoreForStatus(roots[i]?.status || 'not_started');
  return total;
}

export function getStatusCounts(profileId) {
  const roots = getAllRootData(profileId);
  const counts = { not_started: 0, in_progress: 0, complete: 0, mastered: 0 };
  for (let i = 1; i <= 8; i++) counts[roots[i]?.status || 'not_started']++;
  return counts;
}

export function getDaysSinceFirst(profile) {
  if (!profile?.createdAt) return 0;
  return Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / 86400000);
}

export function getLastStudiedDays(profile) {
  if (!profile?.lastStudiedAt) return null;
  return Math.floor((Date.now() - new Date(profile.lastStudiedAt).getTime()) / 86400000);
}

export function getStrongestRoot(profileId) {
  const roots = getAllRootData(profileId);
  let best = null, bestScore = -1;
  for (let i = 1; i <= 8; i++) {
    const score = getScoreForStatus(roots[i]?.status || 'not_started');
    if (score > bestScore || (score === bestScore && best !== null)) {
      if (score > bestScore) { bestScore = score; best = i; }
    }
  }
  return best;
}