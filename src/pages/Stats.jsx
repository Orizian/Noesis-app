import React from 'react';
import { ArrowLeft, Star, CheckCircle2, Zap, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useProfile } from '../components/profiles/ProfileContext';
import {
  getProfileStats,
  getTotalPoints,
  getTotalGauntletPoints,
  getTotalVocabScore,
  getQuestionCriteria,
  deriveRootStatus,
  isRootPerfected,
} from '../components/profiles/profileStorage';
import { useCourse } from '../components/course/CourseContext';

const STATUS_COLORS = {
  mastered:   'bg-violet-500',
  complete:   'bg-emerald-500',
  in_progress:'bg-blue-500',
  not_started:'bg-zinc-700',
  perfected:  'bg-yellow-500',
};

const STATUS_ICONS = {
  mastered:    Star,
  complete:    CheckCircle2,
  in_progress: Zap,
  not_started: Circle,
  perfected:   Star,
};

function StatRow({ label, value, sub }) {
  return (
    <div className="flex justify-between items-baseline text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className="text-zinc-200 font-medium font-mono">{value}{sub && <span className="text-zinc-500 text-xs font-normal ml-1">{sub}</span>}</span>
    </div>
  );
}

function MiniBar({ value, max, color = 'bg-emerald-500' }) {
  const pct = max > 0 ? Math.min(value / max, 1) * 100 : 0;
  return (
    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1.5">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Stats() {
  const { roots, courseMaxPoints, courseMaxGauntletPoints, courseMaxVocabScore, meta } = useCourse();
  const courseId = meta?.id;
  const { activeProfileId, activeProfile } = useProfile();

  const stats = (activeProfileId && courseId) ? getProfileStats(activeProfileId, courseId, roots.length) : null;

  // Compute derived values from useCourse() dimensions
  const totalMasteryPoints = (activeProfileId && courseId) ? getTotalPoints(activeProfileId, courseId, roots.length) : 0;
  const totalGauntletPoints = (activeProfileId && courseId) ? getTotalGauntletPoints(activeProfileId, courseId, roots.length) : 0;
  const totalVocabScore = (activeProfileId && courseId) ? getTotalVocabScore(activeProfileId, courseId) : 0;

  // Per-root status breakdown (including perfected)
  const rootStatusCounts = { not_started: 0, in_progress: 0, complete: 0, mastered: 0, perfected: 0 };
  roots.forEach(r => {
    const qc = (activeProfileId && courseId) ? getQuestionCriteria(activeProfileId, courseId, r.id) : {};
    const perfected = (activeProfileId && courseId) ? isRootPerfected(activeProfileId, courseId, r.id) : false;
    if (perfected) {
      rootStatusCounts.perfected++;
    } else {
      const status = deriveRootStatus(qc);
      rootStatusCounts[status] = (rootStatusCounts[status] || 0) + 1;
    }
  });

  const completionPercent = roots.length > 0
    ? Math.round(((rootStatusCounts.complete + rootStatusCounts.mastered + rootStatusCounts.perfected) / roots.length) * 100)
    : 0;

  const strongestRoot = stats?.strongestRootId ? roots.find(r => r.id === stats.strongestRootId) : null;

  if (!stats) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-500">No profile active.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-14">
        <div className="mb-8">
          <Link
            to={createPageUrl('CourseOverview')}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Course Overview
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">My Stats</h1>
          {activeProfile && (
            <p className="text-zinc-500 text-sm mt-1">{activeProfile.name}</p>
          )}
        </div>

        {/* Score bars */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4 space-y-4">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Scores</p>

          <div>
            <StatRow label="Mastery" value={`${totalMasteryPoints} / ${courseMaxPoints}`} />
            <MiniBar value={totalMasteryPoints} max={courseMaxPoints} color="bg-emerald-500" />
          </div>

          <div>
            <StatRow label="Gauntlet" value={`${totalGauntletPoints} / ${courseMaxGauntletPoints}`} />
            <MiniBar value={totalGauntletPoints} max={courseMaxGauntletPoints} color="bg-amber-500" />
          </div>

          <div>
            <StatRow label="Vocabulary (Excellent)" value={`${totalVocabScore} / ${courseMaxVocabScore}`} />
            <MiniBar value={totalVocabScore} max={courseMaxVocabScore} color="bg-violet-500" />
          </div>
        </div>

        {/* Root status breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4 space-y-3">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Root Breakdown</p>
          <StatRow label="Not Started" value={rootStatusCounts.not_started} />
          <StatRow label="In Progress" value={rootStatusCounts.in_progress} />
          <StatRow label="Complete" value={rootStatusCounts.complete} />
          <StatRow label="Mastered" value={rootStatusCounts.mastered} />
          <StatRow label="Perfected (Gauntlet)" value={rootStatusCounts.perfected} />
          <div className="pt-1 border-t border-zinc-800">
            <StatRow label="Overall Completion" value={`${completionPercent}%`} sub={`(${rootStatusCounts.complete + rootStatusCounts.mastered + rootStatusCounts.perfected} of ${roots.length} roots done)`} />
            <MiniBar value={completionPercent} max={100} color="bg-emerald-500" />
          </div>
        </div>

        {/* Additional stats */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4 space-y-3">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Activity</p>
          <StatRow label="Days since first session" value={stats.firstSession} />
          <StatRow label="Total cold attempts" value={stats.totalAttempts} />
          {strongestRoot && (
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Strongest root</span>
              <span className="text-zinc-200 font-medium text-right max-w-[60%] truncate">Root {strongestRoot.id} — {strongestRoot.title}</span>
            </div>
          )}
        </div>

        {/* Root grid */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">All Roots</p>
          <div className="grid grid-cols-4 gap-3">
            {roots.map(root => {
              const qc = (activeProfileId && courseId) ? getQuestionCriteria(activeProfileId, courseId, root.id) : {};
              const perfected = (activeProfileId && courseId) ? isRootPerfected(activeProfileId, courseId, root.id) : false;
              const status = perfected ? 'perfected' : deriveRootStatus(qc);
              const Icon = STATUS_ICONS[status] || Circle;
              const color = STATUS_COLORS[status] || 'bg-zinc-700';
              return (
                <div key={root.id} className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-zinc-500 text-center leading-tight">Root {root.id}</p>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-zinc-800">
            {[
              { label: 'Perfected', color: 'bg-yellow-500' },
              { label: 'Mastered', color: 'bg-violet-500' },
              { label: 'Complete', color: 'bg-emerald-500' },
              { label: 'In Progress', color: 'bg-blue-500' },
              { label: 'Not Started', color: 'bg-zinc-700' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-xs text-zinc-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}