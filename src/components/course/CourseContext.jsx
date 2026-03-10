import React, { createContext, useContext } from 'react';
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

  // Points per root: root question = 4 criteria, each branch = 3 criteria (fixed)
  // Total per root = 4 + 3 + 3 + 3 = 13
  const ROOT_QUESTION_CRITERIA = 4;
  const BRANCH_CRITERIA = 3;
  const rootMaxPoints = ROOT_QUESTION_CRITERIA + BRANCH_CRITERIA * 3;

  // Course-wide totals
  const courseMaxPoints = rootCount * rootMaxPoints;                 // 104 for 8 roots
  const courseMaxGauntletPoints = courseMaxPoints;                   // same structure
  const courseMaxVocabScore = roots.reduce((sum, root) => {
    return sum + (dictionary[root.id]?.length || 0);
  }, 0);                                                             // 80 for 10 terms × 8 roots
  const courseQuestionCount = rootCount * 4;                        // 32 for 8 roots (root + 3 branches)

  // Per-root helpers
  const getRootTermCount = (rootId) => (dictionary[rootId]?.length || 0);

  return {
    // Raw data
    roots,
    dictionary,
    branchRubrics: course.branchRubrics || {},

    // Dimension values (replaces all hardcoded numbers)
    rootCount,
    rootMaxPoints,
    courseMaxPoints,
    courseMaxGauntletPoints,
    courseMaxVocabScore,
    courseQuestionCount,

    // Fixed criteria counts (branches always 3, root always 4)
    ROOT_QUESTION_CRITERIA,
    BRANCH_CRITERIA,

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
  const id = courseId || DEFAULT_COURSE_ID;
  const course = COURSES.find(c => c.id === id) || COURSES[0];
  const value = buildCourseHelpers(course);

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