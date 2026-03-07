import React, { useState, useCallback } from 'react';
import { ROOTS } from '../components/courseData';
import RootCard from '../components/course/RootCard';
import ProfileDropdown from '../components/profiles/ProfileDropdown';
import DevToolsModal from '../components/devtools/DevToolsModal';
import { useProfile } from '../components/profiles/ProfileContext';
import { getProfileProgress } from '../components/profiles/profileStorage';
import { BookOpen } from 'lucide-react';

export default function CourseOverview() {
  const { activeProfileId, profilesVersion, refresh } = useProfile();
  const [titleTaps, setTitleTaps] = useState(0);
  const [showDevTools, setShowDevTools] = useState(false);
  const tapTimer = useRef(null);

  const progress = activeProfileId ? getProfileProgress(activeProfileId) : {};
  const completedCount = ROOTS.filter(r => progress[r.id]?.status === 'complete').length;

  const handleTitleTap = useCallback(() => {
    setTitleTaps(prev => {
      const next = prev + 1;
      if (next >= 7) {
        setShowDevTools(true);
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
        <div className="mb-12">
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

          <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
            Eight foundational concepts. Mastery-based progression. Understanding mechanism over memorizing facts.
            Complete each root by passing the cold attempt.
          </p>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
              <span>{completedCount} of {ROOTS.length} roots complete</span>
              <span>{Math.round((completedCount / ROOTS.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / ROOTS.length) * 100}%` }}
              />
            </div>
          </div>
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

// Need useRef
import { useRef } from 'react';