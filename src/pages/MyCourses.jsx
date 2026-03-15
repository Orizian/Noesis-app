import React from 'react';
import { useCourse } from '../components/course/CourseContext';
import { useProfile } from '../components/profiles/ProfileContext';
import { getTotalPoints, isEnrolledInCourse } from '../components/profiles/profileStorage';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, ArrowRight, BookMarked } from 'lucide-react';

function CourseProgress({ course, profileId }) {
  const roots = course.roots || [];
  const courseId = course.id;
  const totalPoints = profileId ? getTotalPoints(profileId, courseId, roots) : 0;
  const courseMaxPoints = roots.reduce((sum, r) => sum + 4 + r.branches.length * 3, 0);
  const pct = courseMaxPoints > 0 ? Math.round((totalPoints / courseMaxPoints) * 100) : 0;

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-zinc-400">{totalPoints > 0 ? `${pct}% complete` : 'Not started'}</span>
        <span className="text-xs font-mono text-zinc-500">{totalPoints} / {courseMaxPoints} pts</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function MyCourses() {
  const { courses, setActiveCourse } = useCourse();
  const { activeProfileId, activeProfile } = useProfile();
  const navigate = useNavigate();

  const enrolledCourses = activeProfileId
    ? courses.filter(c => !c.comingSoon && isEnrolledInCourse(activeProfileId, c.id))
    : [];

  const handleEnter = (course) => {
    setActiveCourse(course.id);
    navigate(createPageUrl('CourseOverview'));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 md:pb-0">
      <div className="px-4 py-8 md:py-12 md:px-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100 mb-1">My Courses</h1>
          {activeProfile && (
            <p className="text-sm text-zinc-500">Progress for <span className="text-zinc-300">{activeProfile.name}</span></p>
          )}
        </div>

        {!activeProfileId ? (
          <div className="text-center py-16 text-zinc-600">
            <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Select a profile to see your courses.</p>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookMarked className="w-8 h-8 mx-auto mb-3 text-zinc-700" />
            <p className="text-sm text-zinc-500 mb-1">No enrolled courses yet.</p>
            <p className="text-xs text-zinc-600">Go to Courses and click Enroll to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {enrolledCourses.map(course => (
              <button
                key={course.id}
                onClick={() => handleEnter(course)}
                className="flex flex-col p-5 rounded-xl border border-emerald-800/40 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors text-left group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 leading-tight">{course.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{course.tag}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 transition-colors mt-0.5" />
                </div>
                <CourseProgress course={course} profileId={activeProfileId} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}