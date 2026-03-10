import React, { useState, useCallback, useRef } from 'react';
import { useCourse } from '../components/course/CourseContext';
import RootCard from '../components/course/RootCard';
import ProfileDropdown from '../components/profiles/ProfileDropdown';
import DevToolsModal from '../components/devtools/DevToolsModal';
import GauntletBoard from '../components/course/GauntletBoard';
import { useProfile } from '../components/profiles/ProfileContext';
import { getQuestionCriteria, deriveRootStatus, getTotalPoints, getTotalGauntletPoints, getGauntletRootPoints, isRootPerfected, getTotalVocabScore } from '../components/profiles/profileStorage';
import { GlobalMasteryBar, GlobalGauntletBar, VocabBar } from '../components/course/MasteryBars';
import { BookOpen } from 'lucide-react';

function ProgressSection({ profileId }) {
  const { roots } = useCourse();
  let totalPoints = 0;
  let completeCount = 0, masteredCount = 0, perfectedCount = 0;

  roots.forEach(r => {
    const qc = profileId ? getQuestionCriteria(profileId, r.id) : {};
    const rPts = (qc.root || 0) + (qc.branch_1 || 0) + (qc.branch_2 || 0) + (qc.branch_3 || 0);
    totalPoints += rPts;
    const status = deriveRootStatus(qc);
    if (status === 'mastered') masteredCount++;
    else if (status === 'complete') completeCount++;
    if (profileId && isRootPerfected(profileId, r.id)) perfectedCount++;
  });

  const gauntletTotal = profileId ? getTotalGauntletPoints(profileId) : 0;
  const anyGauntlet = gauntletTotal > 0;

  const vocabScore = profileId ? getTotalVocabScore(profileId) : 0;

  return (
    <div className="mb-10 space-y-3">
      <GlobalMasteryBar
        totalPoints={totalPoints}
        completeCount={completeCount}
        masteredCount={masteredCount}
        perfectedCount={perfectedCount}
      />
      {anyGauntlet && (
        <GlobalGauntletBar totalPoints={gauntletTotal} />
      )}
      <VocabBar excellentScore={vocabScore} />
    </div>
  );
}

export default function CourseOverview() {
  const { activeProfileId, refresh } = useProfile();
  const [titleTaps, setTitleTaps] = useState(0);
  const [showDevTools, setShowDevTools] = useState(false);
  const tapTimer = useRef(null);

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
                Human Performance Physiology
              </h1>
            </div>
            <ProfileDropdown />
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mb-6">
            Eight foundational mechanisms. Mastery-based progression. This course builds a causal model of how the body produces force, generates energy, adapts to stress, and recovers from exercise — so you can explain and predict performance, not just follow training rules.
          </p>

          {/* Progress section */}
          <ProgressSection profileId={activeProfileId} />
        </div>

        {/* Root list */}
        <div className="space-y-3">
          {ROOTS.map((root) => (
            <RootCard
              key={root.id}
              root={root}
              profileId={activeProfileId}
            />
          ))}
        </div>

        {/* Gauntlet Board */}
        <GauntletBoard profileId={activeProfileId} />

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