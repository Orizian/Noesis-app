import React from 'react';
import { ArrowLeft, Star, CheckCircle2, Zap, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useProfile } from '../components/profiles/ProfileContext';
import { getProfileStats } from '../components/profiles/profileStorage';
import { useCourse } from '../components/course/CourseContext';

const STATUS_COLORS = {
  mastered: 'bg-violet-500',
  complete: 'bg-emerald-500',
  in_progress: 'bg-blue-500',
  not_started: 'bg-zinc-700',
};

const STATUS_ICONS = {
  mastered: Star,
  complete: CheckCircle2,
  in_progress: Zap,
  not_started: Circle,
};

export default function Stats() {
  const { roots } = useCourse();
  const { activeProfileId, activeProfile } = useProfile();
  const stats = activeProfileId ? getProfileStats(activeProfileId) : null;

  if (!stats) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-500">No profile active.</p>
      </div>
    );
  }

  const passRate = stats.totalAttempts > 0
    ? Math.round((stats.totalPassed / stats.totalAttempts) * 100)
    : 0;

  const strongestRoot = stats.strongestRootId ? ROOTS.find(r => r.id === stats.strongestRootId) : null;

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

        {/* Key numbers */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-3xl font-bold text-zinc-100">{stats.totalAttempts}</p>
            <p className="text-xs text-zinc-500 mt-1">Total cold attempts</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-3xl font-bold text-zinc-100">{passRate}%</p>
            <p className="text-xs text-zinc-500 mt-1">Overall pass rate</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-3xl font-bold text-violet-400">{stats.mastered}</p>
            <p className="text-xs text-zinc-500 mt-1">Roots mastered</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-3xl font-bold text-emerald-400">{stats.complete}</p>
            <p className="text-xs text-zinc-500 mt-1">Roots complete</p>
          </div>
        </div>

        {/* More stats */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Days since first session</span>
            <span className="text-zinc-200 font-medium">{stats.firstSession}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Roots in progress</span>
            <span className="text-zinc-200 font-medium">{stats.inProgress}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Roots not started</span>
            <span className="text-zinc-200 font-medium">{stats.notStarted}</span>
          </div>
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
            {ROOTS.map(root => {
              const p = stats.progress?.[root.id];
              const status = p?.status || 'not_started';
              const Icon = STATUS_ICONS[status];
              return (
                <div key={root.id} className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${STATUS_COLORS[status]}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-zinc-500 text-center leading-tight">Root {root.id}</p>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-zinc-800">
            {[
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