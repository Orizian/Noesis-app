import React from 'react';

const STAGES = [
  { level: 1, label: 'Building Foundation', color: 'bg-zinc-500' },
  { level: 2, label: 'Analogy Solid', color: 'bg-blue-500' },
  { level: 3, label: 'Mechanism Clear', color: 'bg-blue-400' },
  { level: 4, label: 'Scenario Ready', color: 'bg-emerald-500' },
  { level: 5, label: 'Ready to Attempt', color: 'bg-amber-400' },
];

export default function CompetencyMeter({ stage }) {
  const current = STAGES.find(s => s.level === stage) || STAGES[0];
  const filledSegments = stage - 1; // stage 1 = 0 filled, stage 5 = 4 filled

  return (
    <div className="mb-4 px-1">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-zinc-400 font-medium">{current.label}</span>
        <span className="text-xs text-zinc-600">Stage {stage} / 5</span>
      </div>
      <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-zinc-800">
        {STAGES.map((s, i) => (
          <div
            key={s.level}
            className={`flex-1 transition-all duration-600 ${i < filledSegments ? current.color : 'bg-zinc-800'}`}
            style={{ transition: 'all 0.6s ease' }}
          />
        ))}
      </div>
    </div>
  );
}