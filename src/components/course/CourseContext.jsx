import React, { createContext, useContext, useState } from 'react';
import { COURSES } from '../courseData/index';

// Default to the first course (exercise-science / Human Performance Physiology)
const DEFAULT_COURSE_ID = 'exercise-science';

const CourseContext = createContext(null);

// ── Derived dimension helpers ──────────────────────────────────────────────────
// These are computed from the active course data so no hardcoded numbers
// need to exist anywhere else in the app.

function buildCourseHelpers(course) {
  const roots = course.roots || [];
  const dictionary = course.dictionary || {};
  const rootCount = roots.length;

  // Points per root: root question = 4 criteria (fixed), each branch = 3 criteria (fixed)
  // Total per root is variable — depends on root.branches.length
  const getRootMaxPoints = (root) => 4 + root.branches.length * 3;

  // Course-wide totals — computed dynamically
  const courseMaxPoints = roots.reduce((sum, r) => sum + getRootMaxPoints(r), 0);
  const courseMaxGauntletPoints = courseMaxPoints;
  const courseMaxVocabScore = roots.reduce((sum, root) => {
    return sum + (dictionary[root.id]?.length || 0);
  }, 0);
  const courseQuestionCount = roots.reduce((sum, r) => sum + 1 + r.branches.length, 0);

  // Per-root helpers
  const getRootTermCount = (rootId) => (dictionary[rootId]?.length || 0);

  return {
    // Raw data
    roots,
    dictionary,
    branchRubrics: course.branchRubrics || {},

    // Dimension values (replaces all hardcoded numbers)
    rootCount,
    courseMaxPoints,
    courseMaxGauntletPoints,
    courseMaxVocabScore,
    courseQuestionCount,

    // Dynamic per-root points function
    getRootMaxPoints,

    // Per-root helpers
    getRootTermCount,

    // Per-root difficulty map (keyed by root id)
    rootDifficultyMap: course.rootDifficultyMap || {},

    // Course metadata
    meta: {
      id: course.id,
      title: course.title,
      description: course.description,
      tag: course.tag,
    },
  };
}

export function CourseProvider({ children, courseId }) {
  const [activeCourseId, setActiveCourseId] = useState(courseId || DEFAULT_COURSE_ID);
  const course = COURSES.find(c => c.id === activeCourseId) || COURSES[0];
  const value = {
    ...buildCourseHelpers(course),
    activeCourse: course,
    courses: COURSES,
    setActiveCourse: (id) => setActiveCourseId(id),
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourse must be used inside CourseProvider');
  return ctx;
}