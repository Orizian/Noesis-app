import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { ROOTS, DICTIONARY } from '../courseData';
import {
  setQuestionCriteriaExact,
  resetProfileProgress,
  getQuestionCriteria,
  setGauntletCriteriaExact,
  getGauntletCriteria,
  resetGauntletForRoot,
  setGauntletPassedDate,
  clearGauntletPassedDate,
  setFlashcardTierExact,
  clearAllFlashcardTiers,
  getVocabStats,
} from '../profiles/profileStorage';

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

function ColdRow({ root, profileId, onChanged }) {
  const qc = getQuestionCriteria(profileId, root.id);
  const [vals, setVals] = useState({ root: qc.root || 0, branch_1: qc.branch_1 || 0, branch_2: qc.branch_2 || 0, branch_3: qc.branch_3 || 0 });

  const set = (key, val) => {
    setQuestionCriteriaExact(profileId, root.id, key, val);
    setVals(p => ({ ...p, [key]: val }));
    onChanged();
  };
  const setAllMax = () => {
    ['root', 'branch_1', 'branch_2', 'branch_3'].forEach(k => setQuestionCriteriaExact(profileId, root.id, k, k === 'root' ? 4 : 3));
    setVals({ root: 4, branch_1: 3, branch_2: 3, branch_3: 3 });
    onChanged();
  };
  const setMinPass = () => {
    setQuestionCriteriaExact(profileId, root.id, 'root', 2);
    ['branch_1','branch_2','branch_3'].forEach(k => setQuestionCriteriaExact(profileId, root.id, k, 1));
    setVals({ root: 2, branch_1: 1, branch_2: 1, branch_3: 1 });
    onChanged();
  };
  const reset = () => {
    ['root','branch_1','branch_2','branch_3'].forEach(k => setQuestionCriteriaExact(profileId, root.id, k, 0));
    setVals({ root: 0, branch_1: 0, branch_2: 0, branch_3: 0 });
    onChanged();
  };

  return (
    <div className="space-y-1.5">
      <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider pl-0">Cold Attempts</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {[['root','Root Q',4],['branch_1','Branch 1',3],['branch_2','Branch 2',3],['branch_3','Branch 3',3]].map(([k,label,max]) => (
          <div key={k} className="flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-500">{label}</span>
            <Stepper value={vals[k]} max={max} onChange={v => set(k, v)} />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <button onClick={setAllMax} className="px-2 py-1 rounded bg-violet-900/40 hover:bg-violet-900/60 border border-violet-800/50 text-violet-300 text-xs">Set All Max</button>
        <button onClick={setMinPass} className="px-2 py-1 rounded bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 text-xs">Set Min Pass</button>
        <button onClick={reset} className="px-2 py-1 rounded bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-xs">Reset</button>
      </div>
      {/* Root tier shortcuts */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-zinc-600 mr-1">Root Tier:</span>
        <button onClick={() => set('root', 2)} className="px-2 py-0.5 rounded bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-400 text-xs">Pass</button>
        <button onClick={() => set('root', 3)} className="px-2 py-0.5 rounded bg-teal-900/30 hover:bg-teal-900/50 border border-teal-800/40 text-teal-400 text-xs">Great</button>
        <button onClick={() => set('root', 4)} className="px-2 py-0.5 rounded bg-violet-900/30 hover:bg-violet-900/50 border border-violet-800/40 text-violet-400 text-xs">Excellent</button>
      </div>
    </div>
  );
}

function GauntletRow({ root, profileId, onChanged }) {
  const gc = getGauntletCriteria(profileId, root.id);
  const [vals, setVals] = useState({ root: gc.root || 0, branch_1: gc.branch_1 || 0, branch_2: gc.branch_2 || 0, branch_3: gc.branch_3 || 0 });

  const set = (key, val) => {
    setGauntletCriteriaExact(profileId, root.id, key, val);
    setVals(p => ({ ...p, [key]: val }));
    onChanged();
  };
  const setMax = () => {
    ['root','branch_1','branch_2','branch_3'].forEach(k => setGauntletCriteriaExact(profileId, root.id, k, k === 'root' ? 4 : 3));
    setGauntletPassedDate(profileId, root.id, Date.now());
    setVals({ root: 4, branch_1: 3, branch_2: 3, branch_3: 3 });
    onChanged();
  };
  const setMinPass = () => {
    setGauntletCriteriaExact(profileId, root.id, 'root', 2);
    ['branch_1','branch_2','branch_3'].forEach(k => setGauntletCriteriaExact(profileId, root.id, k, 1));
    setGauntletPassedDate(profileId, root.id, Date.now());
    setVals({ root: 2, branch_1: 1, branch_2: 1, branch_3: 1 });
    onChanged();
  };
  const reset = () => {
    resetGauntletForRoot(profileId, root.id);
    clearGauntletPassedDate(profileId, root.id);
    setVals({ root: 0, branch_1: 0, branch_2: 0, branch_3: 0 });
    onChanged();
  };

  return (
    <div className="space-y-1.5">
      <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider">Gauntlet</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {[['root','Root Q',4],['branch_1','Branch 1',3],['branch_2','Branch 2',3],['branch_3','Branch 3',3]].map(([k,label,max]) => (
          <div key={k} className="flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-500">{label}</span>
            <Stepper value={vals[k]} max={max} onChange={v => set(k, v)} />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <button onClick={setMax} className="px-2 py-1 rounded bg-amber-900/40 hover:bg-amber-900/60 border border-amber-800/50 text-amber-300 text-xs">Set Gauntlet Max</button>
        <button onClick={setMinPass} className="px-2 py-1 rounded bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 text-xs">Set Gauntlet Min Pass</button>
        <button onClick={reset} className="px-2 py-1 rounded bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-xs">Reset Gauntlet</button>
      </div>
    </div>
  );
}

function RootRow({ root, profileId, onChanged }) {
  return (
    <div className="py-3 border-b border-zinc-800/50 last:border-0 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-zinc-500 w-5 flex-shrink-0">{String(root.id).padStart(2,'0')}</span>
        <span className="text-xs text-zinc-400 flex-1 truncate">{root.title}</span>
      </div>
      <div className="pl-7 space-y-3">
        <ColdRow root={root} profileId={profileId} onChanged={onChanged} />
        <div className="border-t border-zinc-800/40 pt-3">
          <GauntletRow root={root} profileId={profileId} onChanged={onChanged} />
        </div>
      </div>
    </div>
  );
}

function VocabSection({ profileId, onChanged }) {
  const stats = getVocabStats(profileId);

  const markAllPass = () => {
    Object.entries(DICTIONARY).forEach(([rootId, terms]) => {
      terms.forEach(term => {
        setFlashcardTierExact(profileId, parseInt(rootId), term.term, 'pass');
      });
    });
    onChanged();
  };

  const clearAll = () => {
    clearAllFlashcardTiers(profileId);
    onChanged();
  };

  return (
    <div className="px-6 py-3 border-b border-zinc-800">
      <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">Vocabulary</p>
      <p className="text-xs text-zinc-600 mb-2">{stats.attempted} / 80 attempted · {stats.excellent} Excellent · {stats.great} Great · {stats.pass} Pass</p>
      <div className="flex gap-2">
        <button onClick={markAllPass}
          className="flex-1 px-3 py-2 rounded-lg bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 text-xs transition-colors">
          Mark All Terms Pass
        </button>
        <button onClick={clearAll}
          className="flex-1 px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-xs transition-colors">
          Clear All Vocabulary
        </button>
      </div>
    </div>
  );
}

export default function DevToolsModal({ profileId, onClose, onChanged }) {
  const handleResetAll = () => {
    resetProfileProgress(profileId);
    clearAllFlashcardTiers(profileId);
    onChanged();
  };

  const handleConquerAbsolute = () => {
    const now = Date.now();
    ROOTS.forEach(root => {
      ['root','branch_1','branch_2','branch_3'].forEach(k =>
        setGauntletCriteriaExact(profileId, root.id, k, k === 'root' ? 4 : 3)
      );
      setGauntletPassedDate(profileId, root.id, now);
    });
    // Mark absolute gauntlet conquered directly in localStorage
    const profiles = JSON.parse(localStorage.getItem('exsci_profiles') || '[]');
    const idx = profiles.findIndex(p => p.id === profileId);
    if (idx !== -1) {
      if (!profiles[idx].absoluteGauntlet) profiles[idx].absoluteGauntlet = {};
      profiles[idx].absoluteGauntlet.conqueredAt = now;
      profiles[idx].absoluteGauntlet.inProgress = false;
      localStorage.setItem('exsci_profiles', JSON.stringify(profiles));
    }
    onChanged();
  };

  const handleResetAllGauntlets = () => {
    ROOTS.forEach(root => resetGauntletForRoot(profileId, root.id));
    // Clear gauntlet passed dates and absolute
    const profiles = JSON.parse(localStorage.getItem('exsci_profiles') || '[]');
    const idx = profiles.findIndex(p => p.id === profileId);
    if (idx !== -1) {
      profiles[idx].gauntletPassedDates = {};
      profiles[idx].absoluteGauntlet = null;
      localStorage.setItem('exsci_profiles', JSON.stringify(profiles));
    }
    onChanged();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border-2 border-orange-600/60 rounded-2xl w-full max-w-lg my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-orange-950/20">
          <div>
            <span className="text-orange-500 font-bold text-lg tracking-wider uppercase">⚠ DEV TOOLS</span>
            <p className="text-xs text-orange-600/70 mt-0.5">Not a user feature — affects current profile only</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X className="w-5 h-5" /></button>
        </div>

        {/* Global reset */}
        <div className="px-6 py-3 border-b border-zinc-800 space-y-2">
          <button onClick={handleResetAll}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-sm transition-colors">
            <RotateCcw className="w-4 h-4" />Reset All Progress
          </button>
          <button onClick={handleConquerAbsolute}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-yellow-950/40 hover:bg-yellow-950/60 border border-yellow-800/50 text-yellow-400 text-sm transition-colors">
            ★ Conquer Absolute Gauntlet
          </button>
          <button onClick={handleResetAllGauntlets}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700 text-zinc-400 text-sm transition-colors">
            Reset All Gauntlets
          </button>
        </div>

        {/* Vocabulary section */}
        <VocabSection profileId={profileId} onChanged={onChanged} />

        {/* Per-root controls */}
        <div className="px-6 py-2 max-h-[55vh] overflow-y-auto">
          {ROOTS.map(root => (
            <RootRow key={root.id} root={root} profileId={profileId} onChanged={onChanged} />
          ))}
        </div>

        <div className="px-6 py-4 border-t border-zinc-800">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors">
            Close Dev Tools
          </button>
        </div>
      </div>
    </div>
  );
}