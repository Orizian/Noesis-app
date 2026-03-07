import React from 'react';
import { BookOpen, Target, Shield } from 'lucide-react';

const modes = [
  { id: 'teach', label: 'Teach Me', icon: BookOpen, description: 'Guided learning' },
  { id: 'practice', label: 'Practice', icon: Target, description: 'Diagnostic feedback' },
  { id: 'cold', label: 'Cold Attempt', icon: Shield, description: 'Assessment' }
];

export default function ModeSelector({ activeMode, onModeChange }) {
  return (
    <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = activeMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive
                ? mode.id === 'cold'
                  ? 'bg-red-950/50 text-red-300 border border-red-800/50 shadow-lg shadow-red-950/20'
                  : mode.id === 'practice'
                    ? 'bg-amber-950/50 text-amber-300 border border-amber-800/50 shadow-lg shadow-amber-950/20'
                    : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 shadow-lg shadow-emerald-950/20'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 border border-transparent'
              }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{mode.label}</span>
            <span className="sm:hidden">{mode.label.split(' ')[0]}</span>
          </button>
        );
      })}
    </div>
  );
}