import React, { useState, useCallback } from 'react';
import { useCourse } from '../components/course/CourseContext';
import { useProfile } from '../components/profiles/ProfileContext';
import { isEnrolledInCourse, enrollInCourse } from '../components/profiles/profileStorage';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

function CourseCard({ course, profileId, onEnroll, onEnter }) {
  const enrolled = profileId ? isEnrolledInCourse(profileId, course.id) : false;
  const isComingSoon = !!course.comingSoon;

  return (
    <div className={`flex flex-col p-5 rounded-xl border transition-colors ${
      isComingSoon
        ? 'border-zinc-800/50 bg-zinc-900/20 opacity-60'
        : enrolled
          ? 'border-emerald-800/40 bg-zinc-900/50'
          : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
    }`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${
          enrolled ? 'bg-emerald-950/60 border-emerald-800/40' : 'bg-zinc-800/60 border-zinc-700'
        }`}>
          <BookOpen className={`w-4 h-4 ${enrolled ? 'text-emerald-500' : 'text-zinc-400'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-zinc-100">{course.title}</p>
            {enrolled && (
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                <CheckCircle2 className="w-2.5 h-2.5" /> Enrolled
              </span>
            )}
            {isComingSoon && (
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-500">
                <Lock className="w-2.5 h-2.5" /> Coming Soon
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">{course.tag}</p>
        </div>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed mb-4 flex-1">{course.description}</p>

      {!isComingSoon && (
        <button
          onClick={enrolled ? onEnter : onEnroll}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-colors ${
            enrolled
              ? 'bg-emerald-800/60 hover:bg-emerald-700/70 text-emerald-200'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
          }`}
        >
          {enrolled ? (
            <><ArrowRight className="w-4 h-4" /> Enter Course</>
          ) : (
            'Enroll'
          )}
        </button>
      )}
    </div>
  );
}

export default function CourseSelectionPage() {
  const { courses, setActiveCourse } = useCourse();
  const { activeProfileId, refresh } = useProfile();
  const navigate = useNavigate();
  const [, forceUpdate] = useState(0);

  const handleEnroll = useCallback((course) => {
    if (!activeProfileId) return;
    enrollInCourse(activeProfileId, course.id);
    forceUpdate(v => v + 1);
    refresh();
  }, [activeProfileId, refresh]);

  const handleEnter = useCallback((course) => {
    setActiveCourse(course.id);
    navigate(createPageUrl('CourseOverview'));
  }, [setActiveCourse, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 md:pb-0">
      <div className="px-4 py-8 md:py-12 md:px-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100 mb-1">Courses</h1>
          <p className="text-sm text-zinc-500">Browse all available courses and enroll to begin learning.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              profileId={activeProfileId}
              onEnroll={() => handleEnroll(course)}
              onEnter={() => handleEnter(course)}
            />
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-600">Understanding mechanism is more valuable than memorizing facts.</p>
        </div>
      </div>
    </div>
  );
}