import React from 'react';
import { useCourse } from '../components/course/CourseContext';
import { useProfile } from '../components/profiles/ProfileContext';
import { getTotalPoints, getEnrolledCourseIds } from '../components/profiles/profileStorage';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, ArrowRight } from 'lucide-react';

function CourseProgress({ course, profileId }) {
  const roots = course.roots || [];
  const courseId = course.id;

  const totalPoints = profileId ? getTotalPoints(profileId, courseId, roots) : 0;
  const courseMaxPoints = roots.reduce((sum, r) => sum + 4 + r.branches.length * 3, 0);
  const pct = courseMaxPoints > 0 ? Math.round((totalPoints / courseMaxPoints) * 100) : 0;

  const started = totalPoints > 0;

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-zinc-400">{started ? `${pct}% complete` : 'Not started'}</span>
        <span className="text-xs font-mono text-zinc-500">{totalPoints} / {courseMaxPoints} pts</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function MyCourses() {
  const { courses, setActiveCourse } = useCourse();
  const { activeProfileId, activeProfile } = useProfile();
  const navigate = useNavigate();

  const activeCourses = courses.filter(c => !c.comingSoon);

  const handleEnter = (course) => {
    setActiveCourse(course.id);
    navigate(createPageUrl('CourseOverview'));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-14">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100 mb-1">My Courses</h1>
          {activeProfile && (
            <p className="text-sm text-zinc-500">Progress for <span className="text-zinc-300">{activeProfile.name}</span></p>
          )}
        </div>

        {!activeProfileId ? (
          <div className="text-center py-16 text-zinc-600">
            <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Select a profile to see your progress.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeCourses.map(course => (
              <button
                key={course.id}
                onClick={() => handleEnter(course)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/50 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-zinc-100 leading-tight">{course.title}</p>
                    <p className="text-xs text-zinc-500">{course.tag}</p>
                  </div>
                  <CourseProgress course={course} profileId={activeProfileId} />
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}