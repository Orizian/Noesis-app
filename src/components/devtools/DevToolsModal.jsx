import React from 'react';
import { X, CheckCheck, RotateCcw } from 'lucide-react';
import { ROOTS } from '../courseData';
import {
  markRootComplete,
  markRootMastered,
  resetProfileProgress,
  setProfileRootProgress,
} from '../profiles/profileStorage';

export default function DevToolsModal({ profileId, onClose, onChanged }) {
  const handleMarkAllComplete = () => {
    ROOTS.forEach(r => markRootComplete(profileId, r.id));
    onChanged();
  };

  const handleMarkAllMastered = () => {
    ROOTS.forEach(r => markRootMastered(profileId, r.id));
    onChanged();
  };

  const handleResetAll = () => {
    resetProfileProgress(profileId);
    onChanged();
  };

  const handleRootAction = (rootId, action) => {
    if (action === 'complete') markRootComplete(profileId, rootId);
    else if (action === 'mastered') markRootMastered(profileId, rootId);
    else if (action === 'reset') setProfileRootProgress(profileId, rootId, {
      status: 'not_started',
      root_question_passed: false,
      branch_1_passed: false,
      branch_2_passed: false,
      branch_3_passed: false,
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

        {/* Global actions */}
        <div className="px-6 py-4 border-b border-zinc-800 space-y-2">
          <button onClick={handleMarkAllComplete}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 text-sm transition-colors">
            <CheckCheck className="w-4 h-4" />Mark All Complete
          </button>
          <button onClick={handleMarkAllMastered}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-sky-900/40 hover:bg-sky-900/60 border border-sky-800/50 text-sky-300 text-sm transition-colors">
            <CheckCheck className="w-4 h-4" />Mark All Mastered
          </button>
          <button onClick={handleResetAll}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-sm transition-colors">
            <RotateCcw className="w-4 h-4" />Reset All Progress
          </button>
        </div>

        {/* Per-root controls */}
        <div className="px-6 py-4 space-y-2 max-h-80 overflow-y-auto">
          {ROOTS.map(root => (
            <div key={root.id} className="flex items-center gap-2 py-2 border-b border-zinc-800/50 last:border-0">
              <span className="text-xs font-mono text-zinc-500 w-6 flex-shrink-0">{String(root.id).padStart(2,'0')}</span>
              <span className="text-xs text-zinc-400 flex-1 min-w-0 truncate">{root.title}</span>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => handleRootAction(root.id, 'complete')}
                  className="px-2 py-1 rounded-lg bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-400 text-xs border border-emerald-800/50 transition-colors">
                  ✓
                </button>
                <button onClick={() => handleRootAction(root.id, 'mastered')}
                  className="px-2 py-1 rounded-lg bg-sky-900/40 hover:bg-sky-900/60 text-sky-400 text-xs border border-sky-800/50 transition-colors">
                  ★
                </button>
                <button onClick={() => handleRootAction(root.id, 'reset')}
                  className="px-2 py-1 rounded-lg bg-red-950/40 hover:bg-red-950/60 text-red-400 text-xs border border-red-900/50 transition-colors">
                  ↺
                </button>
              </div>
            </div>
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