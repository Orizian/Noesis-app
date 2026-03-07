import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, Flame } from 'lucide-react';
import { ROOTS } from '../components/courseData';
import RootCard from '../components/course/RootCard';
import ProfileDropdown from '../components/course/ProfileDropdown';
import DevTools from '../components/course/DevTools';
import {
  getActiveProfile, getAllRootData, getTotalScore,
  getStatusCounts, getScoreForStatus,
} from '../components/profileStore';

export default function CourseOverview() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getActiveProfile());
  const [titleTaps, setTitleTaps] = useState(0);
  const [showDevTools, setShowDevTools] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!getActiveProfile()) navigate(createPageUrl('ProfileSelect'), { replace: true });
  }, []);

  if (!profile) return null;

  const refresh = useCallback(() => {
    setProfile(getActiveProfile());
    setRefreshKey(k => k + 1);
  }, []);

  const roots = getAllRootData(profile.id);
  const score = getTotalScore(profile.id);
  const counts = getStatusCounts(profile.id);
  const pct = Math.round((score / 48) * 100);

  // Score bar segments
  const masteredPct = (counts.mastered * 6 / 48) * 100;
  const completePct = (counts.complete * 3 / 48) * 100;
  const inProgressPct = (counts.in_progress * 1 / 48) * 100;

  const handleTitleTap = () => {
    const next = titleTaps + 1;
    setTitleTaps(next);
    if (next >= 7) {
      setTitleTaps(0);
      setShowDevTools(true);
    }
    setTimeout(() => setTitleTaps(0), 2000);
  };

  const streak = profile.streak || 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <button
              onClick={handleTitleTap}
              className="text-left select-none"
            >
              <h1 className="text-lg md:text-xl font-semibold tracking-tight leading-tight">
                Principles of Exercise Science
              </h1>
            </button>
          </div>
          <ProfileDropdown onProfileChange={refresh} />
        </div>

        {/* Progress Section */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 md:p-6 mb-8">
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="text-3xl font-bold text-zinc-100">{score}</span>
              <span className="text-zinc-500 text-lg ml-1">/ 48</span>
            </div>
            <span className="text-sm text-zinc-400">{pct}% through the course</span>
          </div>

          {/* Segmented progress bar */}
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden flex mb-3">
            {masteredPct > 0 && (
              <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${masteredPct}%` }} />
            )}
            {completePct > 0 && (
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${completePct}%` }} />
            )}
            {inProgressPct > 0 && (
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${inProgressPct}%` }} />
            )}
          </div>

          {/* Breakdown */}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-xs text-zinc-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              {counts.mastered} Mastered
            </span>
            <span className="text-xs text-zinc-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {counts.complete} Complete
            </span>
            <span className="text-xs text-zinc-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              {counts.in_progress} In Progress
            </span>
            <span className="text-xs text-zinc-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-600 inline-block" />
              {counts.not_started} Not Started
            </span>
          </div>

          {/* Streak */}
          {streak >= 2 && (
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-zinc-800">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs text-zinc-500">{streak} day streak</span>
            </div>
          )}
        </div>

        {/* Root list */}
        <div className="space-y-3">
          {ROOTS.map((root) => (
            <RootCard
              key={root.id}
              root={root}
              progress={roots[root.id]}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-600 text-center">
            Understanding mechanism is more valuable than memorizing facts.
          </p>
        </div>
      </div>

      {showDevTools && (
        <DevTools
          onClose={() => setShowDevTools(false)}
          onRefresh={refresh}
        />
      )}
    </div>
  );
}