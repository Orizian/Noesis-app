import React from 'react';

// difficulty: 'foundational' | 'applied' | 'mechanistic'
const DIFFICULTY_CONFIG = {
  foundational: { filled: 1, color: 'bg-emerald-500', label: 'Foundational' },
  applied:      { filled: 2, color: 'bg-amber-500',   label: 'Applied' },
  mechanistic:  { filled: 3, color: 'bg-violet-500',  label: 'Mechanistic' },
};

export const ROOT_DIFFICULTY = {
  1: 'mechanistic',
  2: 'mechanistic',
  3: 'mechanistic',
  4: 'mechanistic',
  5: 'mechanistic',
  6: 'mechanistic',
  7: 'applied',
  8: 'applied',
};

export default function DifficultyBars({ rootId, showLabel = false, size = 'sm' }) {
  const tier = ROOT_DIFFICULTY[rootId] || 'mechanistic';
  const { filled, color, label } = DIFFICULTY_CONFIG[tier];

  const barH = size === 'sm' ? 'h-[5px]' : 'h-[7px]';
  const barW = size === 'sm' ? 'w-3' : 'w-4';
  const gap  = size === 'sm' ? 'gap-0.5' : 'gap-1';

  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex items-end ${gap}`}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={`${barW} ${barH} rounded-sm transition-colors duration-300 ${
              i <= filled ? color : 'bg-zinc-700'
            }`}
          />
        ))}
      </div>
      {showLabel && (
        <span className={`text-xs ${
          tier === 'mechanistic' ? 'text-violet-400' :
          tier === 'applied'     ? 'text-amber-400'  : 'text-emerald-400'
        }`}>
          {label}
        </span>
      )}
    </div>
  );
}