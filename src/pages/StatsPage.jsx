import React from 'react';
import { ArrowLeft, Flame, Target, Clock, TrendingUp, Star, Circle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ROOTS } from '../components/courseData';
import {
  getActiveProfile, getAllRootData, getTotalScore,
  getStatusCounts, getDaysSinceFirst, getStrongestRoot, getScoreForStatus,
} from '../components/profileStore';

const STATUS_COLORS = {
  not_started: 'bg-zinc-700',
  in_progress: 'bg-blue-500',
  complete: 'bg-emerald-500',
  mastered: 'bg-amber-400',
};

const STATUS_LABELS = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  complete: 'Complete',
  mastered: 'Mastered',
};

export default function StatsPage() {
  const navigate = useNavigate();
  const profile = getActiveProfile();

  if (!profile) {
    navigate(createPageUrl('ProfileSelect'));
    return null;
  }

  const roots = getAllRootData(profile.id);
  const score = getTotalScore(profile.id);
  const counts = getStatusCounts(profile.id);
  const daysSince = getDaysSinceFirst(profile);
  const strongestRootId = getStrongestRoot(profile.id);
  // eslint-disable-next-line no-unused-vars
  const strongestRoot = ROOTS.find(r => r.id === strongestRootId);
  const passRate = profile.totalColdAttempts > 0
    ? Math.round((profile.totalColdPasses / profile.totalColdAttempts) * 100)
    : 0;

  const statCards = [
    { label: 'Cold Attempts', value: profile.totalColdAttempts || 0, icon: Target, color: 'text-blue-400' },
    { label: 'Pass Rate', value: `${passRate}%`, icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Practice Sessions', value: profile.totalPracticeAttempts || 0, icon: Circle, color: 'text-violet-400' },
    { label: 'Days Active', value: daysSince, icon: Clock, color: 'text-zinc-400' },
    { label: 'Current Streak', value: `${profile.streak || 0}d`, icon: Flame, color: 'text-orange-400' },
    { label: 'Best Streak', value: `${profile.longestStreak || 0}d`, icon: Star, color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          to={createPageUrl('CourseOverview')}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Course Overview
        </Link>

        <h1 className="text-2xl font-semibold mb-1">{profile.name}'s Stats</h1>
        <p className="text-zinc-500 text-sm mb-8">{score}/48 points · {Math.round((score/48)*100)}% through the course</p>

        {/* Score overview */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-zinc-400">Total Score</span>
            <span className="text-xl font-bold text-zinc-100">{score} <span className="text-zinc-500 text-base font-normal">/ 48</span></span>
          </div>
          <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(score/48)*100}%` }} />
          </div>
          <div className="flex gap-4 mt-3 flex-wrap">
            {Object.entries(counts).map(([s, c]) => (
              <div key={s} className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[s]}`} />
                {c} {STATUS_LABELS[s]}
              </div>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <Icon className={`w-5 h-5 mb-2 ${color}`} />
              <p className="text-xl font-bold text-zinc-100">{value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Strongest root */}
        {strongestRoot && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Strongest Root</p>
            <p className="text-sm font-medium text-zinc-200">{strongestRoot.title}</p>
            <p className="text-xs text-zinc-500 mt-0.5 capitalize">{roots[strongestRootId]?.status?.replace('_', ' ') || ''}</p>
          </div>
        )}

        {/* Root breakdown */}
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Root Breakdown</p>
          <div className="space-y-2">
            {ROOTS.map(root => {
              const rd = roots[root.id];
              const status = rd?.status || 'not_started';
              return (
                <div key={root.id} className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${STATUS_COLORS[status]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-300 truncate">{root.title}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    status === 'mastered' ? 'bg-amber-950/60 text-amber-400' :
                    status === 'complete' ? 'bg-emerald-950/60 text-emerald-400' :
                    status === 'in_progress' ? 'bg-blue-950/60 text-blue-400' :
                    'bg-zinc-800 text-zinc-500'
                  }`}>
                    {STATUS_LABELS[status]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}