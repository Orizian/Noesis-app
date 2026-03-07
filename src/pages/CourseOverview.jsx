import React, { useState, useCallback, useRef } from 'react';
import { ROOTS } from '../components/courseData';
import RootCard from '../components/course/RootCard';
import ProfileDropdown from '../components/profiles/ProfileDropdown';
import DevToolsModal from '../components/devtools/DevToolsModal';
import { useProfile } from '../components/profiles/ProfileContext';
import { getProfileProgress, getProfileById } from '../components/profiles/profileStorage';
import { BookOpen } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const STATUS_POINTS = { not_started: 0, in_progress: 1, complete: 3, mastered: 6 };
const MAX_POINTS = 48;

function ProgressSection({ progress, profileId }) {
  const roots = ROOTS;
  let totalPoints = 0;
  let masteredCount = 0, completeCount = 0, inProgressCount = 0, notStartedCount = 0;

  roots.forEach(r => {
    const p = progress[r.id];
    const status = p?.status || 'not_started';
    totalPoints += STATUS_POINTS[status] || 0;
    if (status === 'mastered') masteredCount++;
    else if (status === 'complete') completeCount++;
    else if (status === 'in_progress') inProgressCount++;
    else notStartedCount++;
  });

  const pct = Math.round((totalPoints / MAX_POINTS) * 100);

  // Welcome back message
  let welcomeMsg = null;
  const profile = profileId ? getProfileById(profileId) : null;
  if (profile?.lastStudied) {
    const days = differenceInDays(new Date(), new Date(profile.lastStudied));
    if (days === 0) {
      welcomeMsg = `Welcome back, ${profile.name}`;
    } else {
      welcomeMsg = `Last studied ${days === 1 ? 'yesterday' : `${days} days ago`}`;
    }
  }

  // Progress bar segments
  const masteredPct = (masteredCount * 6 / MAX_POINTS) * 100;
  const completePct = (completeCount * 3 / MAX_POINTS) * 100;
  const inProgressPct = (inProgressCount * 1 / MAX_POINTS) * 100;

  return (
    <div className="mb-10">
      {/* Progress bar */}
      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden flex mb-3">
        <div className="bg-violet-500 transition-all duration-500" style={{ width: `${masteredPct}%` }} />
        <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${completePct}%` }} />
        <div className="bg-blue-500 transition-all duration-500" style={{ width: `${inProgressPct}%` }} />
      </div>

      {/* Score */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-bold text-zinc-100">{totalPoints}</span>
        <span className="text-zinc-500 text-sm">/ {MAX_POINTS}</span>
      </div>

      {/* Counts */}
      <p className="text-xs text-zinc-500 mb-1">
        {masteredCount > 0 && <span className="text-violet-400">{masteredCount} Mastered</span>}
        {masteredCount > 0 && (completeCount > 0 || inProgressCount > 0 || notStartedCount > 0) && <span className="mx-1">·</span>}
        {completeCount > 0 && <span className="text-emerald-400">{completeCount} Complete</span>}
        {completeCount > 0 && (inProgressCount > 0 || notStartedCount > 0) && <span className="mx-1">·</span>}
        {inProgressCount > 0 && <span className="text-blue-400">{inProgressCount} In Progress</span>}
        {inProgressCount > 0 && notStartedCount > 0 && <span className="mx-1">·</span>}
        {notStartedCount > 0 && <span>{notStartedCount} Not Started</span>}
      </p>

      <p className="text-xs text-zinc-600">{pct}% complete</p>

      {/* Welcome back */}
      {welcomeMsg && (
        <p className="text-xs text-zinc-600 mt-3">{welcomeMsg}</p>
      )}
    </div>
  );
}

export default function CourseOverview() {
  const { activeProfileId, refresh } = useProfile();
  const [titleTaps, setTitleTaps] = useState(0);
  const [showDevTools, setShowDevTools] = useState(false);
  const tapTimer = useRef(null);

  const progress = activeProfileId ? getProfileProgress(activeProfileId) : {};

  const handleTitleTap = useCallback(() => {
    setTitleTaps(prev => {
      const next = prev + 1;
      if (next >= 7) {
        setShowDevTools(true);
        clearTimeout(tapTimer.current);
        return 0;
      }
      clearTimeout(tapTimer.current);
      tapTimer.current = setTimeout(() => setTitleTaps(0), 2000);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
        {/* Header row */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-emerald-500" />
              </div>
              <h1
                className="text-2xl md:text-3xl font-semibold tracking-tight cursor-default select-none"
                onClick={handleTitleTap}
              >
                Principles of Exercise Science
              </h1>
            </div>
            <ProfileDropdown />
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mb-6">
            Eight foundational concepts. Mastery-based progression. Understanding mechanism over memorizing facts.
            Complete each root by passing the cold attempt.
          </p>

          {/* Progress section */}
          <ProgressSection progress={progress} profileId={activeProfileId} />
        </div>

        {/* Root list */}
        <div className="space-y-3">
          {ROOTS.map((root) => (
            <RootCard
              key={root.id}
              root={root}
              progress={progress[root.id]}
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
        <DevToolsModal
          profileId={activeProfileId}
          onClose={() => setShowDevTools(false)}
          onChanged={() => { refresh(); }}
        />
      )}
    </div>
  );
}