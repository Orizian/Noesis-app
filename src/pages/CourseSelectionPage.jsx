import { useCourse } from '../components/course/CourseContext';
import ProfileDropdown from '../components/profiles/ProfileDropdown';
import CourseCard from '../components/course/CourseCard';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen } from 'lucide-react';

export default function CourseSelectionPage() {
  const { courses, setActiveCourse } = useCourse();
  const navigate = useNavigate();

  const handleEnterCourse = (course) => {
    setActiveCourse(course.id);
    navigate(createPageUrl('CourseOverview'));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">

        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-100 leading-none">Noesis</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Build Genuine Understanding</p>
            </div>
          </div>
          <ProfileDropdown />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-1">Choose Your Course</h2>
          <p className="text-sm text-zinc-500">Select a course to begin or continue your learning.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnter={() => handleEnterCourse(course)}
            />
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-600 text-center">
            Understanding mechanism is more valuable than memorizing facts.
          </p>
        </div>
      </div>
    </div>
  );
}