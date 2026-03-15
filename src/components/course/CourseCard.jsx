import { useState } from 'react';
import { Lock } from 'lucide-react';
import DotTagRow from './DotTagRow';
import CourseSummaryOverlay from './CourseSummaryOverlay';
import { DURATION_CONFIG } from './courseTagConfig';
import { useProfile } from '../profiles/ProfileContext';
import { getTotalPoints, getTotalVocabScore, getGauntletRootPoints, isEnrolledInCourse, enrollInCourse } from '../profiles/profileStorage';

function MiniProgressBar({ label, value, max, colorClass }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-500">
        <span>{label}</span>
        <span>{value}<span className="text-zinc-700">/{max}</span></span>
      </div>
      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function CourseCard({ course, onEnter }) {
  const [showSummary, setShowSummary] = useState(false);
  const { activeProfileId } = useProfile();
  const duration = DURATION_CONFIG[course.duration] || DURATION_CONFIG.medium;
  const isActive = !course.comingSoon;

  // Compute max points directly from this card's course data — never from context
  // (context may have a different or null active course at selection screen)
  const cardRoots = course.roots || [];
  const courseMaxPoints = cardRoots.reduce((sum, r) => sum + 4 + r.branches.length * 3, 0);
  const courseMaxGauntletPoints = courseMaxPoints;
  const courseMaxVocabScore = cardRoots.reduce((sum, r) => sum + (course.dictionary?.[r.id]?.length || 0), 0);

  const masteryPoints = isActive && activeProfileId
    ? getTotalPoints(activeProfileId, course.id, cardRoots) : 0;
  const gauntletPoints = isActive && activeProfileId && cardRoots.length > 0
    ? cardRoots.reduce((sum, r) => sum + getGauntletRootPoints(activeProfileId, course.id, r.id, r.branches.length), 0) : 0;
  const vocabScore = isActive && activeProfileId
    ? getTotalVocabScore(activeProfileId, course.id) : 0;

  return (
    <>
      <div className={`relative rounded-2xl border bg-zinc-900/60 p-5 flex flex-col gap-4 transition-all ${
        course.comingSoon ? 'border-zinc-800/40' : 'border-zinc-800 hover:border-zinc-700'
      }`}>

        {course.comingSoon && (
          <div className="absolute inset-0 rounded-2xl bg-zinc-950/50 z-10 flex items-center justify-center pointer-events-none">
            <div className="w-9 h-9 rounded-full bg-zinc-800/80 flex items-center justify-center">
              <Lock className="w-4 h-4 text-zinc-500" />
            </div>
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
            {course.tag}
          </span>
          {course.comingSoon && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/40 flex-shrink-0">
              Coming Soon
            </span>
          )}
        </div>

        <div>
          <h3 className="text-base font-semibold text-zinc-100 mb-1">{course.title}</h3>
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{course.description}</p>
        </div>

        <DotTagRow difficulty={course.difficulty} depth={course.depth} scope={course.scope} />

        <div>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${duration.colorClass}`}>
            {duration.label}
          </span>
        </div>

        {isActive && (
          <div className="space-y-2 pt-1 border-t border-zinc-800/50">
            <MiniProgressBar label="Mastery" value={masteryPoints} max={courseMaxPoints} colorClass="bg-emerald-500" />
            <MiniProgressBar label="Gauntlet" value={gauntletPoints} max={courseMaxGauntletPoints} colorClass="bg-violet-500" />
            <MiniProgressBar label="Vocabulary" value={vocabScore} max={courseMaxVocabScore} colorClass="bg-amber-500" />
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={() => setShowSummary(true)}
            className="flex-1 py-2 rounded-xl border border-zinc-700 bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 text-xs font-medium transition-colors"
          >
            View Summary
          </button>
          {isActive ? (
            <button
              onClick={onEnter}
              className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
            >
              Enter Course
            </button>
          ) : (
            <button
              disabled
              className="flex-1 py-2 rounded-xl bg-zinc-800/40 text-zinc-600 text-xs font-medium cursor-not-allowed"
            >
              Coming Soon
            </button>
          )}
        </div>
      </div>

      {showSummary && (
        <CourseSummaryOverlay
          course={course}
          onClose={() => setShowSummary(false)}
          onEnter={isActive ? onEnter : null}
        />
      )}
    </>
  );
}