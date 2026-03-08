import React from 'react';

// Color — pure function of points earned, never derived from tier labels
function getMasteryColor(value, max) {
  if (max === 104) {
    if (value <= 15) return 'bg-zinc-600';
    if (value <= 39) {
      // green interpolating: emerald-400 approaching emerald-600
      const t = (value - 16) / (39 - 16);
      return t < 0.5 ? 'bg-emerald-400' : 'bg-emerald-500';
    }
    if (value < 104) {
      // teal interpolating
      const t = (value - 40) / (103 - 40);
      return t < 0.5 ? 'bg-teal-400' : 'bg-teal-500';
    }
    return 'bg-violet-500'; // 104
  }
  if (max === 13) {
    if (value <= 1) return 'bg-zinc-600';
    if (value <= 5) {
      const t = (value - 2) / (5 - 2);
      return t < 0.5 ? 'bg-emerald-400' : 'bg-emerald-500';
    }
    if (value <= 12) {
      const t = (value - 6) / (12 - 6);
      return t < 0.5 ? 'bg-teal-400' : 'bg-teal-500';
    }
    return 'bg-violet-500'; // 13
  }
  // per-question bars (max 4 or 3)
  if (max === 4) {
    if (value < 2) return 'bg-zinc-600';
    if (value < 3) return 'bg-emerald-500';
    if (value < 4) return 'bg-teal-500';
    return 'bg-violet-500';
  }
  if (max === 3) {
    if (value < 1) return 'bg-zinc-600';
    if (value < 2) return 'bg-emerald-500';
    if (value < 3) return 'bg-teal-500';
    return 'bg-violet-500';
  }
  return 'bg-emerald-500';
}

// Single thin horizontal bar with tick marks
function ThinBar({ value, max, ticks = [], color, label, rightLabel, height = 'h-1.5' }) {
  const pct = max > 0 ? Math.min(value / max, 1) * 100 : 0;
  const barColor = color || getMasteryColor(value, max);

  return (
    <div className="w-full">
      {(label || rightLabel) && (
        <div className="flex justify-between items-baseline mb-1">
          {label && <span className="text-xs text-zinc-500">{label}</span>}
          {rightLabel && <span className="text-xs font-mono text-zinc-500">{rightLabel}</span>}
        </div>
      )}
      <div className={`relative w-full ${height} bg-zinc-800 rounded-full overflow-visible`}>
        {/* Filled portion */}
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
        {/* Tick marks */}
        {ticks.map(tick => {
          const tickPct = (tick / max) * 100;
          return (
            <div
              key={tick}
              className="absolute top-[-2px] bottom-[-2px] w-px bg-zinc-600 z-10"
              style={{ left: `${tickPct}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

// Global overview bar — 0 to 104
export function GlobalMasteryBar({ totalPoints, completeCount, masteredCount, perfectedCount }) {
  return (
    <div className="space-y-2">
      <ThinBar
        value={totalPoints}
        max={104}
        ticks={[16, 32]}
        label="Mastery"
        rightLabel={`${totalPoints} / 104`}
        height="h-2"
      />
      <p className="text-xs text-zinc-500">
        {completeCount > 0 && <span>{completeCount} Complete</span>}
        {completeCount > 0 && masteredCount > 0 && <span className="mx-1">·</span>}
        {masteredCount > 0 && <span>{masteredCount} Mastered</span>}
        {(completeCount > 0 || masteredCount > 0) && perfectedCount > 0 && <span className="mx-1">·</span>}
        {perfectedCount > 0 && <span>{perfectedCount} Perfected</span>}
        {completeCount === 0 && masteredCount === 0 && perfectedCount === 0 && (
          <span>0 Complete · 0 Mastered · 0 Perfected</span>
        )}
      </p>
    </div>
  );
}

// Per-root card bars (compact)
export function RootCardBars({ rootPoints, gauntletPoints, hasPerfected }) {
  return (
    <div className="space-y-1.5 mt-2">
      <ThinBar
        value={rootPoints}
        max={13}
        ticks={[2, 4]}
        rightLabel={`${rootPoints} / 13`}
        height="h-1.5"
      />
      {(gauntletPoints > 0 || hasPerfected) && (
        <ThinBar
          value={gauntletPoints || 0}
          max={13}
          ticks={[2, 4]}
          color="bg-cyan-500"
          rightLabel={`${gauntletPoints || 0} / 13`}
          height="h-1.5"
        />
      )}
    </div>
  );
}

// Per-root detail page bars (larger + per-question mini bars)
export function RootDetailBars({ rootPoints, gauntletPoints, hasPerfected, questionPoints }) {
  // questionPoints: { root: 0-4, branch_1: 0-3, branch_2: 0-3, branch_3: 0-3 }
  return (
    <div className="space-y-3">
      {/* Main mastery bar */}
      <ThinBar
        value={rootPoints}
        max={13}
        ticks={[2, 4]}
        label="Mastery"
        rightLabel={`${rootPoints} / 13`}
        height="h-2.5"
      />
      {/* Gauntlet bar — only if attempted */}
      {(gauntletPoints > 0 || hasPerfected) && (
        <ThinBar
          value={gauntletPoints || 0}
          max={13}
          ticks={[2, 4]}
          color="bg-cyan-500"
          label="Gauntlet"
          rightLabel={`${gauntletPoints || 0} / 13`}
          height="h-2.5"
        />
      )}
      {/* Per-question mini bars */}
      <div className="space-y-2 pt-1 border-t border-zinc-800/60">
        <ThinBar
          value={questionPoints?.root || 0}
          max={4}
          ticks={[2]}
          label="Root Question"
          rightLabel={`${questionPoints?.root || 0} / 4`}
          height="h-1.5"
        />
        <ThinBar
          value={questionPoints?.branch_1 || 0}
          max={3}
          ticks={[1]}
          label="Branch 1"
          rightLabel={`${questionPoints?.branch_1 || 0} / 3`}
          height="h-1.5"
        />
        <ThinBar
          value={questionPoints?.branch_2 || 0}
          max={3}
          ticks={[1]}
          label="Branch 2"
          rightLabel={`${questionPoints?.branch_2 || 0} / 3`}
          height="h-1.5"
        />
        <ThinBar
          value={questionPoints?.branch_3 || 0}
          max={3}
          ticks={[1]}
          label="Branch 3"
          rightLabel={`${questionPoints?.branch_3 || 0} / 3`}
          height="h-1.5"
        />
      </div>
    </div>
  );
}