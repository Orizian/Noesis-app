import React from 'react';
import { getRootGauntletMaxPoints, getCourseGauntletMaxPoints } from './CourseContext';

// Percentage-based color logic — no hardcoded thresholds
function getMasteryColor(score, max) {
  if (!max || max <= 0) return 'bg-zinc-600';
  const pct = score / max;
  if (pct >= 1.0) return 'bg-violet-500';
  if (pct >= 0.85) return 'bg-teal-500';
  if (pct >= 0.5) return 'bg-emerald-500';
  if (pct >= 0.15) return 'bg-orange-500';
  return 'bg-zinc-600';
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

// Percentage-based gauntlet color — no hardcoded thresholds
function getGauntletBarColor(score, max) {
  if (!max || max <= 0) return 'bg-zinc-600';
  const pct = score / max;
  if (pct >= 1.0) return 'bg-violet-500';
  if (pct >= 0.85) return 'bg-teal-500';
  if (pct >= 0.5) return 'bg-emerald-500';
  if (pct >= 0.15) return 'bg-orange-500';
  return 'bg-zinc-600';
}

// Global overview bar — dynamic based on all roots
export function GlobalMasteryBar({ roots, totalPoints, completeCount, masteredCount, perfectedCount }) {
  const max = getCourseGauntletMaxPoints(roots);
  return (
    <div className="space-y-2">
      <ThinBar
        value={totalPoints}
        max={max}
        label="Mastery"
        rightLabel={`${totalPoints} / ${max}`}
        height="h-2"
      />
      <p className="text-xs text-zinc-500">
        {completeCount === 0 && masteredCount === 0 && perfectedCount === 0
          ? <span>0 Complete · 0 Mastered · 0 Perfected</span>
          : <>
              <span>{completeCount} Complete</span>
              <span className="mx-1">·</span>
              <span>{masteredCount} Mastered</span>
              <span className="mx-1">·</span>
              <span>{perfectedCount} Perfected</span>
            </>
        }
      </p>
    </div>
  );
}

// Global gauntlet bar — only shown if any gauntlet attempted
export function GlobalGauntletBar({ totalPoints, rootCount }) {
  const max = rootCount * 13;
  const color = getGauntletBarColor(totalPoints, max);
  return (
    <ThinBar
      value={totalPoints}
      max={max}
      color={color}
      label="Gauntlet"
      rightLabel={`${totalPoints} / ${max}`}
      height="h-2"
    />
  );
}

// Vocabulary bar color — based on excellent score out of 80
function getVocabBarColor(score) {
  if (score <= 0) return 'bg-zinc-600';
  if (score < 20) return 'bg-zinc-500';
  if (score < 50) return 'bg-emerald-500';
  if (score < 80) return 'bg-teal-500';
  return 'bg-violet-500';
}

// Vocabulary bar — score = count of Excellent tiers, max = courseMaxVocabScore (from CourseContext)
export function VocabBar({ excellentScore, courseMaxVocabScore }) {
  const score = excellentScore || 0;
  const max = courseMaxVocabScore || 0;
  return (
    <ThinBar
      value={score}
      max={max}
      color={getVocabBarColor(score)}
      label="Vocabulary"
      rightLabel={`${score} / ${max} Excellent`}
      height="h-2"
    />
  );
}

// Per-root card bars (compact)
export function RootCardBars({ rootPoints, gauntletPoints, hasPerfected }) {
  const gPts = gauntletPoints || 0;
  return (
    <div className="space-y-1.5 mt-2">
      <ThinBar
        value={rootPoints}
        max={13}
        ticks={[2, 4]}
        rightLabel={`${rootPoints} / 13`}
        height="h-1.5"
      />
      {(gPts > 0 || hasPerfected) && (
        <ThinBar
          value={gPts}
          max={13}
          ticks={[4, 9]}
          color={getGauntletBarColor(gPts, 13)}
          label="G"
          rightLabel={`${gPts} / 13`}
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
          ticks={[4, 9]}
          color={getGauntletBarColor(gauntletPoints || 0, 13)}
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