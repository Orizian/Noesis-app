import React from 'react';
import { X, Zap, Star, RotateCcw, CheckCircle, Trophy } from 'lucide-react';
import { ROOTS } from '../courseData';
import {
  devMarkAllComplete, devMarkAllMastered, resetAllProgress,
  devMarkRootComplete, devMarkRootMastered, resetRootProgress,
  getActiveProfile,
} from '../profileStore';

export default function DevTools({ onClose, onRefresh }) {
  const profile = getActiveProfile();
  if (!profile) return null;

  const run = (fn) => { fn(); onRefresh(); };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-zinc-900 border-2 border-orange-600/60 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-orange-600/30 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">Dev Tools</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-zinc-800 flex items-center justify-center">
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Global actions */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Global Actions</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => run(() => devMarkAllComplete(profile.id))}
                className="flex flex-col items-center gap-1.5 p-3 bg-emerald-950/50 border border-emerald-800/50 
                  rounded-xl text-emerald-400 hover:bg-emerald-900/40 transition-colors text-xs font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                Mark All Complete
              </button>
              <button
                onClick={() => run(() => devMarkAllMastered(profile.id))}
                className="flex flex-col items-center gap-1.5 p-3 bg-amber-950/50 border border-amber-800/50 
                  rounded-xl text-amber-400 hover:bg-amber-900/40 transition-colors text-xs font-medium"
              >
                <Star className="w-5 h-5" />
                Mark All Mastered
              </button>
              <button
                onClick={() => run(() => resetAllProgress(profile.id))}
                className="flex flex-col items-center gap-1.5 p-3 bg-red-950/50 border border-red-800/50 
                  rounded-xl text-red-400 hover:bg-red-900/40 transition-colors text-xs font-medium"
              >
                <RotateCcw className="w-5 h-5" />
                Reset All
              </button>
            </div>
          </div>

          {/* Per-root */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Per Root</p>
            <div className="space-y-2">
              {ROOTS.map(root => (
                <div key={root.id} className="flex items-center gap-2 p-3 bg-zinc-800/50 rounded-xl">
                  <span className="text-xs font-mono text-zinc-500 w-6 flex-shrink-0">{String(root.id).padStart(2,'0')}</span>
                  <span className="text-xs text-zinc-300 flex-1 truncate">{root.title}</span>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => run(() => devMarkRootComplete(profile.id, root.id))}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 
                        hover:bg-emerald-900/40 transition-colors text-xs font-medium"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => run(() => devMarkRootMastered(profile.id, root.id))}
                      className="px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/50 
                        hover:bg-amber-900/40 transition-colors text-xs font-medium"
                    >
                      Master
                    </button>
                    <button
                      onClick={() => run(() => resetRootProgress(profile.id, root.id))}
                      className="px-2.5 py-1 rounded-lg bg-red-950/60 text-red-400 border border-red-800/50 
                        hover:bg-red-900/40 transition-colors text-xs font-medium"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}