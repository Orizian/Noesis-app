import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { ROOTS } from '../courseData';
import {
  setQuestionCriteriaExact,
  resetProfileProgress,
  getQuestionCriteria,
} from '../profiles/profileStorage';

function Stepper({ value, max, onChange }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-6 h-6 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm flex items-center justify-center transition-colors"
      >−</button>
      <span className="w-5 text-center text-xs font-mono text-zinc-300">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-6 h-6 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm flex items-center justify-center transition-colors"
      >+</button>
    </div>
  );
}

function RootRow({ root, profileId, onChanged }) {
  const qc = getQuestionCriteria(profileId, root.id);
  const [vals, setVals] = useState({
    root: qc.root || 0,
    branch_1: qc.branch_1 || 0,
    branch_2: qc.branch_2 || 0,
    branch_3: qc.branch_3 || 0,
  });

  const set = (key, val) => {
    setQuestionCriteriaExact(profileId, root.id, key, val);
    setVals(prev => ({ ...prev, [key]: val }));
    onChanged();
  };

  const setAllMax = () => {
    ['root', 'branch_1', 'branch_2', 'branch_3'].forEach(k => {
      const m = k === 'root' ? 4 : 3;
      setQuestionCriteriaExact(profileId, root.id, k, m);
    });
    setVals({ root: 4, branch_1: 3, branch_2: 3, branch_3: 3 });
    onChanged();
  };

  const setMinPass = () => {
    setQuestionCriteriaExact(profileId, root.id, 'root', 2);
    setQuestionCriteriaExact(profileId, root.id, 'branch_1', 1);
    setQuestionCriteriaExact(profileId, root.id, 'branch_2', 1);
    setQuestionCriteriaExact(profileId, root.id, 'branch_3', 1);
    setVals({ root: 2, branch_1: 1, branch_2: 1, branch_3: 1 });
    onChanged();
  };

  const reset = () => {
    ['root', 'branch_1', 'branch_2', 'branch_3'].forEach(k => {
      setQuestionCriteriaExact(profileId, root.id, k, 0);
    });
    setVals({ root: 0, branch_1: 0, branch_2: 0, branch_3: 0 });
    onChanged();
  };

  const setRootTier = (tierVal) => {
    setQuestionCriteriaExact(profileId, root.id, 'root', tierVal);
    setVals(prev => ({ ...prev, root: tierVal }));
    onChanged();
  };

  return (
    <div className="py-3 border-b border-zinc-800/50 last:border-0 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-zinc-500 w-5 flex-shrink-0">{String(root.id).padStart(2,'0')}</span>
        <span className="text-xs text-zinc-400 flex-1 truncate">{root.title}</span>
      </div>

      {/* Criterion steppers */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pl-7">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-zinc-500">Root Q</span>
          <Stepper value={vals.root} max={4} onChange={v => set('root', v)} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-zinc-500">Branch 1</span>
          <Stepper value={vals.branch_1} max={3} onChange={v => set('branch_1', v)} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-zinc-500">Branch 2</span>
          <Stepper value={vals.branch_2} max={3} onChange={v => set('branch_2', v)} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-zinc-500">Branch 3</span>
          <Stepper value={vals.branch_3} max={3} onChange={v => set('branch_3', v)} />
        </div>
      </div>

      {/* Quick-set buttons */}
      <div className="flex gap-1.5 pl-7 flex-wrap">
        <button onClick={setAllMax} className="px-2 py-1 rounded bg-violet-900/40 hover:bg-violet-900/60 border border-violet-800/50 text-violet-300 text-xs transition-colors">
          Set All Max
        </button>
        <button onClick={setMinPass} className="px-2 py-1 rounded bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 text-xs transition-colors">
          Set Min Pass
        </button>
        <button onClick={reset} className="px-2 py-1 rounded bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-xs transition-colors">
          Reset
        </button>
      </div>

      {/* Root tier buttons */}
      <div className="flex items-center gap-1.5 pl-7">
        <span className="text-xs text-zinc-600 mr-1">Root Tier:</span>
        <button onClick={() => setRootTier(2)} className="px-2 py-0.5 rounded bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-400 text-xs transition-colors">Pass</button>
        <button onClick={() => setRootTier(3)} className="px-2 py-0.5 rounded bg-teal-900/30 hover:bg-teal-900/50 border border-teal-800/40 text-teal-400 text-xs transition-colors">Great</button>
        <button onClick={() => setRootTier(4)} className="px-2 py-0.5 rounded bg-violet-900/30 hover:bg-violet-900/50 border border-violet-800/40 text-violet-400 text-xs transition-colors">Excellent</button>
      </div>
    </div>
  );
}

export default function DevToolsModal({ profileId, onClose, onChanged }) {
  const handleResetAll = () => {
    resetProfileProgress(profileId);
    // Also clear criteria
    ROOTS.forEach(r => {
      ['root', 'branch_1', 'branch_2', 'branch_3'].forEach(k => {
        setQuestionCriteriaExact(profileId, r.id, k, 0);
      });
    });
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
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global reset */}
        <div className="px-6 py-3 border-b border-zinc-800">
          <button onClick={handleResetAll}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-sm transition-colors">
            <RotateCcw className="w-4 h-4" />Reset All Progress
          </button>
        </div>

        {/* Per-root controls */}
        <div className="px-6 py-2 max-h-[60vh] overflow-y-auto">
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