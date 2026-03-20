import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useCourse } from '../course/CourseContext';
import {
  setQuestionCriteriaExact,
  getQuestionCriteria,
  resetProfileProgress,
  setGauntletCriteriaExact,
  getGauntletCriteria,
  resetGauntletForRoot,
  setGauntletPassedDate,
  clearGauntletPassedDate,
  setFlashcardTierExact,
  clearAllFlashcardTiers,
  getFlashcardTier,
  buildQuestionKeys,
} from '../profiles/profileStorage';

// ── Helpers ───────────────────────────────────────────────────────────────────
const VOCAB_TIERS = ['unattempted', 'attempted', 'pass', 'great', 'excellent'];
const TIER_LABELS = { unattempted: '—', attempted: 'Attempted', pass: 'Pass', great: 'Great', excellent: 'Excellent' };

function masterAllRoots(profileId, courseId, roots) {
  roots.forEach(root => {
    buildQuestionKeys(root.branches.length).forEach(k =>
      setQuestionCriteriaExact(profileId, courseId, root.id, k, k === 'root' ? 4 : 3, root.branches.length)
    );
  });
}

function resetAllProgress(profileId, courseId) {
  resetProfileProgress(profileId, courseId);
}

function conquerAllGauntlets(profileId, courseId, roots) {
  const now = Date.now();
  roots.forEach(root => {
    buildQuestionKeys(root.branches.length).forEach(k =>
      setGauntletCriteriaExact(profileId, courseId, root.id, k, k === 'root' ? 4 : 3, root.branches.length)
    );
    setGauntletPassedDate(profileId, courseId, root.id, now);
  });
}

function conquerAbsoluteGauntlet(profileId, courseId) {
  const now = Date.now();
  const profiles = JSON.parse(localStorage.getItem('exsci_profiles') || '[]');
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx !== -1) {
    if (!profiles[idx].courseData) profiles[idx].courseData = {};
    if (!profiles[idx].courseData[courseId]) profiles[idx].courseData[courseId] = {};
    if (!profiles[idx].courseData[courseId].absoluteGauntlet) profiles[idx].courseData[courseId].absoluteGauntlet = {};
    profiles[idx].courseData[courseId].absoluteGauntlet.conqueredAt = now;
    profiles[idx].courseData[courseId].absoluteGauntlet.inProgress = false;
    localStorage.setItem('exsci_profiles', JSON.stringify(profiles));
  }
}

function resetAbsoluteGauntlet(profileId, courseId) {
  const profiles = JSON.parse(localStorage.getItem('exsci_profiles') || '[]');
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx !== -1) {
    if (!profiles[idx].courseData) profiles[idx].courseData = {};
    if (!profiles[idx].courseData[courseId]) profiles[idx].courseData[courseId] = {};
    profiles[idx].courseData[courseId].absoluteGauntlet = null;
    localStorage.setItem('exsci_profiles', JSON.stringify(profiles));
  }
}

function setAbsoluteGauntletInProgress(profileId, courseId, rootId) {
  const profiles = JSON.parse(localStorage.getItem('exsci_profiles') || '[]');
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx !== -1) {
    if (!profiles[idx].courseData) profiles[idx].courseData = {};
    if (!profiles[idx].courseData[courseId]) profiles[idx].courseData[courseId] = {};
    profiles[idx].courseData[courseId].absoluteGauntlet = { inProgress: true, currentRootId: rootId };
    localStorage.setItem('exsci_profiles', JSON.stringify(profiles));
  }
}

function maxAllVocabulary(profileId, courseId, dictionary) {
  Object.entries(dictionary).forEach(([rootId, terms]) => {
    terms.forEach(term => setFlashcardTierExact(profileId, courseId, parseInt(rootId), term.term, 'excellent'));
  });
}

function resetAllVocabulary(profileId, courseId) {
  clearAllFlashcardTiers(profileId, courseId);
}

// ── Stepper ───────────────────────────────────────────────────────────────────
function Stepper({ value, max, onChange }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(Math.max(0, value - 1))}
        className="w-6 h-6 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm flex items-center justify-center transition-colors">−</button>
      <span className="w-5 text-center text-xs font-mono text-zinc-300">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))}
        className="w-6 h-6 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm flex items-center justify-center transition-colors">+</button>
    </div>
  );
}

// ── Tier Cycler for vocab ─────────────────────────────────────────────────────
function TierCycler({ value, onChange }) {
  const idx = VOCAB_TIERS.indexOf(value);
  const prev = () => onChange(VOCAB_TIERS[Math.max(0, idx - 1)]);
  const next = () => onChange(VOCAB_TIERS[Math.min(VOCAB_TIERS.length - 1, idx + 1)]);
  const colorMap = {
    unattempted: 'text-zinc-600',
    attempted: 'text-zinc-400',
    pass: 'text-emerald-400',
    great: 'text-teal-400',
    excellent: 'text-violet-400',
  };
  return (
    <div className="flex items-center gap-1">
      <button onClick={prev} className="w-5 h-5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-400 text-xs flex items-center justify-center">‹</button>
      <span className={`w-16 text-center text-xs font-medium ${colorMap[value] || 'text-zinc-500'}`}>{TIER_LABELS[value]}</span>
      <button onClick={next} className="w-5 h-5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-400 text-xs flex items-center justify-center">›</button>
    </div>
  );
}

// ── Per-Root Section ──────────────────────────────────────────────────────────
function RootSection({ root, profileId, courseId, onChanged, dictionary }) {
  const [expanded, setExpanded] = useState(false);

  // Cold attempt state
  const initQC = () => { const qc = getQuestionCriteria(profileId, courseId, root.id, root.branches.length); const obj = {}; buildQuestionKeys(root.branches.length).forEach(k => obj[k] = qc[k] || 0); return obj; };
  const [coldVals, setColdVals] = useState(initQC);

  // Gauntlet state
  const initGC = () => { const gc = getGauntletCriteria(profileId, courseId, root.id, root.branches.length); const obj = {}; buildQuestionKeys(root.branches.length).forEach(k => obj[k] = gc[k] || 0); return obj; };
  const [gauntletVals, setGauntletVals] = useState(initGC);

  // Vocab state — { termName: tier }
  const terms = dictionary[root.id] || [];
  const initVocab = () => {
    const obj = {};
    terms.forEach(t => { const tier = getFlashcardTier(profileId, courseId, root.id, t.term); obj[t.term] = tier || 'unattempted'; });
    return obj;
  };
  const [vocabVals, setVocabVals] = useState(initVocab);

  const setC = (key, val) => { setQuestionCriteriaExact(profileId, courseId, root.id, key, val, root.branches.length); setColdVals(p => ({ ...p, [key]: val })); onChanged(); };
  const setG = (key, val) => { setGauntletCriteriaExact(profileId, courseId, root.id, key, val, root.branches.length); setGauntletVals(p => ({ ...p, [key]: val })); onChanged(); };

  const masterRoot = () => {
    buildQuestionKeys(root.branches.length).forEach(k => setQuestionCriteriaExact(profileId, courseId, root.id, k, k==='root'?4:3, root.branches.length));
    const maxVals = {}; buildQuestionKeys(root.branches.length).forEach(k => maxVals[k] = k === 'root' ? 4 : 3); setColdVals(maxVals);
    onChanged();
  };
  const resetRoot = () => {
    buildQuestionKeys(root.branches.length).forEach(k => setQuestionCriteriaExact(profileId, courseId, root.id, k, 0, root.branches.length));
    const zeroVals = {}; buildQuestionKeys(root.branches.length).forEach(k => zeroVals[k] = 0); setColdVals(zeroVals);
    onChanged();
  };
  const setGMax = () => {
    buildQuestionKeys(root.branches.length).forEach(k => setGauntletCriteriaExact(profileId, courseId, root.id, k, k==='root'?4:3, root.branches.length));
    setGauntletPassedDate(profileId, courseId, root.id, Date.now());
    const maxVals = {}; buildQuestionKeys(root.branches.length).forEach(k => maxVals[k] = k === 'root' ? 4 : 3); setGauntletVals(maxVals);
    onChanged();
  };
  const setGMinPass = () => {
    setGauntletCriteriaExact(profileId, courseId, root.id, 'root', 2, root.branches.length);
    buildQuestionKeys(root.branches.length).filter(k => k !== 'root').forEach(k => setGauntletCriteriaExact(profileId, courseId, root.id, k, 1, root.branches.length));
    setGauntletPassedDate(profileId, courseId, root.id, Date.now());
    const minPassVals = {}; buildQuestionKeys(root.branches.length).forEach(k => minPassVals[k] = k === 'root' ? 2 : 1); setGauntletVals(minPassVals);
    onChanged();
  };
  const resetGauntlet = () => {
    resetGauntletForRoot(profileId, courseId, root.id, root.branches.length);
    clearGauntletPassedDate(profileId, courseId, root.id);
    const zeroVals = {}; buildQuestionKeys(root.branches.length).forEach(k => zeroVals[k] = 0); setGauntletVals(zeroVals);
    onChanged();
  };

  const setVocabTier = (termName, tier) => {
    if (tier === 'unattempted') {
      const profiles = JSON.parse(localStorage.getItem('exsci_profiles') || '[]');
      const idx = profiles.findIndex(p => p.id === profileId);
      if (idx !== -1 && profiles[idx].courseData?.[courseId]?.flashcardTiers?.[root.id]) {
        delete profiles[idx].courseData[courseId].flashcardTiers[root.id][termName];
        localStorage.setItem('exsci_profiles', JSON.stringify(profiles));
      }
    } else {
      setFlashcardTierExact(profileId, courseId, root.id, termName, tier);
    }
    setVocabVals(p => ({ ...p, [termName]: tier }));
    onChanged();
  };
  const setAllExcellent = () => {
    terms.forEach(t => setFlashcardTierExact(profileId, courseId, root.id, t.term, 'excellent'));
    const newVals = {};
    terms.forEach(t => { newVals[t.term] = 'excellent'; });
    setVocabVals(newVals);
    onChanged();
  };
  const setAllPass = () => {
    terms.forEach(t => setFlashcardTierExact(profileId, courseId, root.id, t.term, 'pass'));
    const newVals = {};
    terms.forEach(t => { newVals[t.term] = 'pass'; });
    setVocabVals(newVals);
    onChanged();
  };
  const resetVocab = () => {
    const profiles = JSON.parse(localStorage.getItem('exsci_profiles') || '[]');
    const idx = profiles.findIndex(p => p.id === profileId);
    if (idx !== -1) {
      if (!profiles[idx].courseData) profiles[idx].courseData = {};
      if (!profiles[idx].courseData[courseId]) profiles[idx].courseData[courseId] = {};
      profiles[idx].courseData[courseId].flashcardTiers = { [root.id]: {} };
      localStorage.setItem('exsci_profiles', JSON.stringify(profiles));
    }
    const newVals = {};
    terms.forEach(t => { newVals[t.term] = 'unattempted'; });
    setVocabVals(newVals);
    onChanged();
  };

  return (
    <div className="border-b border-zinc-800/50 last:border-0">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-zinc-800/30 transition-colors"
      >
        <span className="text-xs font-mono text-zinc-600 w-5 flex-shrink-0">{String(root.id).padStart(2,'0')}</span>
        <span className="text-xs text-zinc-400 flex-1 min-w-0 truncate">{root.title}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-600 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-5">
          {/* Cold Attempts */}
          <div>
            <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider mb-2">Cold Attempts</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-2">
              {[['root', 'Root Q', 4], ...root.branches.map((_, i) => [`branch_${i+1}`, `Branch ${i+1}`, 3])].map(([k,label,max]) => (
                <div key={k} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-zinc-500">{label}</span>
                  <Stepper value={coldVals[k]} max={max} onChange={v => setC(k, v)} />
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={masterRoot} className="px-2 py-1 rounded bg-violet-900/40 hover:bg-violet-900/60 border border-violet-800/50 text-violet-300 text-xs transition-colors">Master Root</button>
              <button onClick={resetRoot} className="px-2 py-1 rounded bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-xs transition-colors">Reset Root</button>
            </div>
          </div>

          {/* Gauntlet */}
          <div>
            <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider mb-2">Gauntlet</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-2">
              {[['root', 'Root Q', 4], ...root.branches.map((_, i) => [`branch_${i+1}`, `Branch ${i+1}`, 3])].map(([k,label,max]) => (
                <div key={k} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-zinc-500">{label}</span>
                  <Stepper value={gauntletVals[k]} max={max} onChange={v => setG(k, v)} />
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={setGMax} className="px-2 py-1 rounded bg-amber-900/40 hover:bg-amber-900/60 border border-amber-800/50 text-amber-300 text-xs transition-colors">Set Gauntlet Max</button>
              <button onClick={setGMinPass} className="px-2 py-1 rounded bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 text-xs transition-colors">Set Min Pass</button>
              <button onClick={resetGauntlet} className="px-2 py-1 rounded bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-xs transition-colors">Reset Gauntlet</button>
            </div>
          </div>

          {/* Vocabulary */}
          <div>
            <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider mb-2">Vocabulary</p>
            <div className="space-y-1.5 mb-2">
              {terms.map(t => (
                <div key={t.term} className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 flex-1 min-w-0 truncate">{t.term}</span>
                  <TierCycler value={vocabVals[t.term] || 'unattempted'} onChange={tier => setVocabTier(t.term, tier)} />
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={setAllExcellent} className="px-2 py-1 rounded bg-violet-900/40 hover:bg-violet-900/60 border border-violet-800/50 text-violet-300 text-xs transition-colors">Set All Excellent</button>
              <button onClick={setAllPass} className="px-2 py-1 rounded bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 text-xs transition-colors">Set All Pass</button>
              <button onClick={resetVocab} className="px-2 py-1 rounded bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-xs transition-colors">Reset Vocabulary</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function DevToolsModal({ profileId, onClose, onChanged, roots, dictionary }) {
  const { meta } = useCourse();
  const courseId = meta.id;
  const [inProgressRoot, setInProgressRoot] = useState(roots[0]?.id ?? 1);

  const act = (fn) => { fn(); onChanged(); };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col md:items-start md:justify-center md:p-4 overflow-hidden">
      <div className="flex flex-col bg-zinc-900 border-2 border-orange-600/60 md:rounded-2xl w-full h-full md:h-auto md:max-h-[95vh] md:max-w-lg md:my-4">
        {/* Sticky Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-orange-950/20 md:rounded-t-2xl">
          <div>
            <span className="text-orange-500 font-bold text-base tracking-wider uppercase">&#9888; Dev Tools</span>
            <p className="text-xs text-orange-600/70 mt-0.5">Current profile only — not a user feature</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

        {/* Global Controls */}
        <div className="px-5 py-4 border-b border-zinc-800">
          <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider mb-3">Global Controls</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => act(() => { masterAllRoots(profileId, courseId, roots); conquerAllGauntlets(profileId, courseId, roots); conquerAbsoluteGauntlet(profileId, courseId); maxAllVocabulary(profileId, courseId, dictionary); })}
              className="px-3 py-2 rounded-lg bg-violet-900/50 hover:bg-violet-900/70 border border-violet-700/60 text-violet-300 text-xs font-semibold transition-colors">
              Max Everything
            </button>
            <button onClick={() => act(() => { resetAllProgress(profileId, courseId); roots.forEach(r => { resetGauntletForRoot(profileId, courseId, r.id, r.branches.length); clearGauntletPassedDate(profileId, courseId, r.id); }); resetAbsoluteGauntlet(profileId, courseId); clearAllFlashcardTiers(profileId, courseId); })}
              className="px-3 py-2 rounded-lg bg-red-950/60 hover:bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-semibold transition-colors">
              Reset Everything
            </button>
            <button onClick={() => act(() => masterAllRoots(profileId, courseId, roots))}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs transition-colors">
              Master All Roots
            </button>
            <button onClick={() => act(() => resetAllProgress(profileId, courseId))}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs transition-colors">
              Reset All Progress
            </button>
            <button onClick={() => act(() => conquerAllGauntlets(profileId, courseId, roots))}
              className="px-3 py-2 rounded-lg bg-amber-950/50 hover:bg-amber-950/70 border border-amber-800/50 text-amber-400 text-xs transition-colors">
              Conquer All Gauntlets
            </button>
            <button onClick={() => act(() => conquerAbsoluteGauntlet(profileId, courseId))}
              className="px-3 py-2 rounded-lg bg-amber-950/50 hover:bg-amber-950/70 border border-amber-800/50 text-amber-400 text-xs transition-colors">
              Conquer Absolute Gauntlet
            </button>
            <button onClick={() => act(() => maxAllVocabulary(profileId, courseId, dictionary))}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs transition-colors">
              Max All Vocabulary
            </button>
            <button onClick={() => act(() => resetAllVocabulary(profileId, courseId))}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs transition-colors">
              Reset All Vocabulary
            </button>
          </div>
        </div>

        {/* Per-Root Controls */}
        <div className="border-b border-zinc-800">
          <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider px-5 py-3">Per Root — tap to expand</p>
          <div>
            {roots.map(root => (
              <RootSection key={root.id} root={root} profileId={profileId} courseId={courseId} onChanged={onChanged} dictionary={dictionary} />
            ))}
          </div>
        </div>

        {/* Absolute Gauntlet Controls */}
        <div className="px-5 py-4 border-b border-zinc-800">
          <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider mb-3">Absolute Gauntlet</p>
          <div className="space-y-2">
            <button onClick={() => act(() => conquerAbsoluteGauntlet(profileId, courseId))}
              className="w-full px-3 py-2 rounded-lg bg-amber-950/50 hover:bg-amber-950/70 border border-amber-800/50 text-amber-400 text-xs font-semibold transition-colors">
              Conquer Absolute Gauntlet
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 whitespace-nowrap">Set In Progress — Root:</span>
              <select
                value={inProgressRoot}
                onChange={e => setInProgressRoot(Number(e.target.value))}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300"
              >
                {roots.map(r => <option key={r.id} value={r.id}>Root {r.id}</option>)}
              </select>
              <button onClick={() => act(() => setAbsoluteGauntletInProgress(profileId, courseId, inProgressRoot))}
                className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 text-zinc-300 text-xs transition-colors whitespace-nowrap">
                Set
              </button>
            </div>
            <button onClick={() => act(() => resetAbsoluteGauntlet(profileId, courseId))}
              className="w-full px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-xs transition-colors">
              Reset Absolute Gauntlet
            </button>
          </div>
        </div>

        </div>{/* end scrollable body */}

        {/* Sticky footer */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-zinc-800">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}