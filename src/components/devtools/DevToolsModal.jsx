import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
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
} from '../profiles/profileStorage';

// ── Helpers ───────────────────────────────────────────────────────────────────
const VOCAB_TIERS = ['unattempted', 'attempted', 'pass', 'great', 'excellent'];
const TIER_LABELS = { unattempted: '—', attempted: 'Attempted', pass: 'Pass', great: 'Great', excellent: 'Excellent' };

function masterAllRoots(profileId, roots) {
  roots.forEach(root => {
    ['root','branch_1','branch_2','branch_3'].forEach(k =>
      setQuestionCriteriaExact(profileId, root.id, k, k === 'root' ? 4 : 3)
    );
  });
}

function resetAllProgress(profileId) {
  resetProfileProgress(profileId);
}

function conquerAllGauntlets(profileId, roots) {
  const now = Date.now();
  roots.forEach(root => {
    ['root','branch_1','branch_2','branch_3'].forEach(k =>
      setGauntletCriteriaExact(profileId, root.id, k, k === 'root' ? 4 : 3)
    );
    setGauntletPassedDate(profileId, root.id, now);
  });
}

function conquerAbsoluteGauntlet(profileId) {
  const now = Date.now();
  const profiles = JSON.parse(localStorage.getItem('exsci_profiles') || '[]');
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx !== -1) {
    if (!profiles[idx].absoluteGauntlet) profiles[idx].absoluteGauntlet = {};
    profiles[idx].absoluteGauntlet.conqueredAt = now;
    profiles[idx].absoluteGauntlet.inProgress = false;
    localStorage.setItem('exsci_profiles', JSON.stringify(profiles));
  }
}

function resetAbsoluteGauntlet(profileId) {
  const profiles = JSON.parse(localStorage.getItem('exsci_profiles') || '[]');
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx !== -1) {
    profiles[idx].absoluteGauntlet = null;
    localStorage.setItem('exsci_profiles', JSON.stringify(profiles));
  }
}

function setAbsoluteGauntletInProgress(profileId, rootId) {
  const profiles = JSON.parse(localStorage.getItem('exsci_profiles') || '[]');
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx !== -1) {
    profiles[idx].absoluteGauntlet = { inProgress: true, currentRootId: rootId };
    localStorage.setItem('exsci_profiles', JSON.stringify(profiles));
  }
}

function maxAllVocabulary(profileId, dictionary) {
  Object.entries(dictionary).forEach(([rootId, terms]) => {
    terms.forEach(term => setFlashcardTierExact(profileId, parseInt(rootId), term.term, 'excellent'));
  });
}

function resetAllVocabulary(profileId) {
  clearAllFlashcardTiers(profileId);
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
function RootSection({ root, profileId, onChanged, dictionary }) {
  const [expanded, setExpanded] = useState(false);

  // Cold attempt state
  const initQC = () => { const qc = getQuestionCriteria(profileId, root.id); return { root: qc.root||0, branch_1: qc.branch_1||0, branch_2: qc.branch_2||0, branch_3: qc.branch_3||0 }; };
  const [coldVals, setColdVals] = useState(initQC);

  // Gauntlet state
  const initGC = () => { const gc = getGauntletCriteria(profileId, root.id); return { root: gc.root||0, branch_1: gc.branch_1||0, branch_2: gc.branch_2||0, branch_3: gc.branch_3||0 }; };
  const [gauntletVals, setGauntletVals] = useState(initGC);

  // Vocab state — { termName: tier }
  const terms = dictionary[root.id] || [];
  const initVocab = () => {
    const obj = {};
    terms.forEach(t => { const tier = getFlashcardTier(profileId, root.id, t.term); obj[t.term] = tier || 'unattempted'; });
    return obj;
  };
  const [vocabVals, setVocabVals] = useState(initVocab);

  const setC = (key, val) => { setQuestionCriteriaExact(profileId, root.id, key, val); setColdVals(p => ({ ...p, [key]: val })); onChanged(); };
  const setG = (key, val) => { setGauntletCriteriaExact(profileId, root.id, key, val); setGauntletVals(p => ({ ...p, [key]: val })); onChanged(); };

  const masterRoot = () => {
    ['root','branch_1','branch_2','branch_3'].forEach(k => setQuestionCriteriaExact(profileId, root.id, k, k==='root'?4:3));
    setColdVals({ root:4, branch_1:3, branch_2:3, branch_3:3 });
    onChanged();
  };
  const resetRoot = () => {
    ['root','branch_1','branch_2','branch_3'].forEach(k => setQuestionCriteriaExact(profileId, root.id, k, 0));
    setColdVals({ root:0, branch_1:0, branch_2:0, branch_3:0 });
    onChanged();
  };
  const setGMax = () => {
    ['root','branch_1','branch_2','branch_3'].forEach(k => setGauntletCriteriaExact(profileId, root.id, k, k==='root'?4:3));
    setGauntletPassedDate(profileId, root.id, Date.now());
    setGauntletVals({ root:4, branch_1:3, branch_2:3, branch_3:3 });
    onChanged();
  };
  const setGMinPass = () => {
    setGauntletCriteriaExact(profileId, root.id, 'root', 2);
    ['branch_1','branch_2','branch_3'].forEach(k => setGauntletCriteriaExact(profileId, root.id, k, 1));
    setGauntletPassedDate(profileId, root.id, Date.now());
    setGauntletVals({ root:2, branch_1:1, branch_2:1, branch_3:1 });
    onChanged();
  };
  const resetGauntlet = () => {
    resetGauntletForRoot(profileId, root.id);
    clearGauntletPassedDate(profileId, root.id);
    setGauntletVals({ root:0, branch_1:0, branch_2:0, branch_3:0 });
    onChanged();
  };

  const setVocabTier = (termName, tier) => {
    if (tier === 'unattempted') {
      // Clear this term
      const profiles = JSON.parse(localStorage.getItem('exsci_profiles') || '[]');
      const idx = profiles.findIndex(p => p.id === profileId);
      if (idx !== -1 && profiles[idx].flashcardTiers?.[root.id]) {
        delete profiles[idx].flashcardTiers[root.id][termName];
        localStorage.setItem('exsci_profiles', JSON.stringify(profiles));
      }
    } else {
      setFlashcardTierExact(profileId, root.id, termName, tier);
    }
    setVocabVals(p => ({ ...p, [termName]: tier }));
    onChanged();
  };
  const setAllExcellent = () => {
    terms.forEach(t => setFlashcardTierExact(profileId, root.id, t.term, 'excellent'));
    const newVals = {};
    terms.forEach(t => { newVals[t.term] = 'excellent'; });
    setVocabVals(newVals);
    onChanged();
  };
  const setAllPass = () => {
    terms.forEach(t => setFlashcardTierExact(profileId, root.id, t.term, 'pass'));
    const newVals = {};
    terms.forEach(t => { newVals[t.term] = 'pass'; });
    setVocabVals(newVals);
    onChanged();
  };
  const resetVocab = () => {
    const profiles = JSON.parse(localStorage.getItem('exsci_profiles') || '[]');
    const idx = profiles.findIndex(p => p.id === profileId);
    if (idx !== -1) {
      if (!profiles[idx].flashcardTiers) profiles[idx].flashcardTiers = {};
      profiles[idx].flashcardTiers[root.id] = {};
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
              {[['root','Root Q',4],['branch_1','Branch 1',3],['branch_2','Branch 2',3],['branch_3','Branch 3',3]].map(([k,label,max]) => (
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
              {[['root','Root Q',4],['branch_1','Branch 1',3],['branch_2','Branch 2',3],['branch_3','Branch 3',3]].map(([k,label,max]) => (
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
export default function DevToolsModal({ profileId, onClose, onChanged }) {
  const [inProgressRoot, setInProgressRoot] = useState(1);

  const act = (fn) => { fn(); onChanged(); };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border-2 border-orange-600/60 rounded-2xl w-full max-w-lg my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-orange-950/20">
          <div>
            <span className="text-orange-500 font-bold text-base tracking-wider uppercase">⚠ Dev Tools</span>
            <p className="text-xs text-orange-600/70 mt-0.5">Current profile only — not a user feature</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X className="w-5 h-5" /></button>
        </div>

        {/* Global Controls */}
        <div className="px-5 py-4 border-b border-zinc-800">
          <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider mb-3">Global Controls</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => act(() => { masterAllRoots(profileId); conquerAllGauntlets(profileId); conquerAbsoluteGauntlet(profileId); maxAllVocabulary(profileId); })}
              className="px-3 py-2 rounded-lg bg-violet-900/50 hover:bg-violet-900/70 border border-violet-700/60 text-violet-300 text-xs font-semibold transition-colors">
              Max Everything
            </button>
            <button onClick={() => act(() => { resetAllProgress(profileId); ROOTS.forEach(r => { resetGauntletForRoot(profileId, r.id); clearGauntletPassedDate(profileId, r.id); }); resetAbsoluteGauntlet(profileId); clearAllFlashcardTiers(profileId); })}
              className="px-3 py-2 rounded-lg bg-red-950/60 hover:bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-semibold transition-colors">
              Reset Everything
            </button>
            <button onClick={() => act(() => masterAllRoots(profileId))}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs transition-colors">
              Master All Roots
            </button>
            <button onClick={() => act(() => resetAllProgress(profileId))}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs transition-colors">
              Reset All Progress
            </button>
            <button onClick={() => act(() => conquerAllGauntlets(profileId))}
              className="px-3 py-2 rounded-lg bg-amber-950/50 hover:bg-amber-950/70 border border-amber-800/50 text-amber-400 text-xs transition-colors">
              Conquer All Gauntlets
            </button>
            <button onClick={() => act(() => conquerAbsoluteGauntlet(profileId))}
              className="px-3 py-2 rounded-lg bg-amber-950/50 hover:bg-amber-950/70 border border-amber-800/50 text-amber-400 text-xs transition-colors">
              Conquer Absolute Gauntlet
            </button>
            <button onClick={() => act(() => maxAllVocabulary(profileId))}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs transition-colors">
              Max All Vocabulary
            </button>
            <button onClick={() => act(() => resetAllVocabulary(profileId))}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs transition-colors">
              Reset All Vocabulary
            </button>
          </div>
        </div>

        {/* Per-Root Controls */}
        <div className="border-b border-zinc-800">
          <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider px-5 py-3">Per Root — tap to expand</p>
          <div className="max-h-[45vh] overflow-y-auto">
            {ROOTS.map(root => (
              <RootSection key={root.id} root={root} profileId={profileId} onChanged={onChanged} />
            ))}
          </div>
        </div>

        {/* Absolute Gauntlet Controls */}
        <div className="px-5 py-4 border-b border-zinc-800">
          <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider mb-3">Absolute Gauntlet</p>
          <div className="space-y-2">
            <button onClick={() => act(() => conquerAbsoluteGauntlet(profileId))}
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
                {ROOTS.map(r => <option key={r.id} value={r.id}>Root {r.id}</option>)}
              </select>
              <button onClick={() => act(() => setAbsoluteGauntletInProgress(profileId, inProgressRoot))}
                className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 text-zinc-300 text-xs transition-colors whitespace-nowrap">
                Set
              </button>
            </div>
            <button onClick={() => act(() => resetAbsoluteGauntlet(profileId))}
              className="w-full px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-xs transition-colors">
              Reset Absolute Gauntlet
            </button>
          </div>
        </div>

        <div className="px-5 py-4">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}