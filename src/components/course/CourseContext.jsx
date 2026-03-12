import React, { createContext, useContext, useState } from 'react';
import { COURSES } from '../courseData/index';

// Platform scoring constants
export const ROOT_CRITERIA_POINTS = 4;
export const BRANCH_CRITERIA_POINTS = 3;

const CourseContext = createContext(null);

// ─── Gauntlet scoring helpers ───────────────────────────────────────────────
export function getRootGauntletMaxPoints(root) {
  return ROOT_CRITERIA_POINTS + root.branches.length * BRANCH_CRITERIA_POINTS;
}

export function getCourseGauntletMaxPoints(roots) {
  return roots.reduce((sum, r) => sum + getRootGauntletMaxPoints(r), 0);
}

export function getGauntletTier(points, maxPoints) {
  const pct = points / maxPoints;
  if (pct >= 1.0) return 'excellent';
  if (pct >= 0.85) return 'great';
  if (pct >= 0.5) return 'pass';
  return 'incomplete';
}

// ── Derived dimension helpers ──────────────────────────────────────────────────
// These are computed from the active course data so no hardcoded numbers
// need to exist anywhere else in the app.

// ─── Section validation & helpers ─────────────────────────────────────────────
function buildSectionHelpers(course, roots) {
  const raw = course.sections;
  if (!raw || !Array.isArray(raw) || raw.length === 0) {
    return { orderedSections: null, rootsBySection: null, usesSections: false, sectionCount: 0 };
  }

  try {
    const validRootIds = new Set(roots.map(r => r.id));
    const seen = new Set();
    let expectedNext = roots.length > 0 ? roots[0].id : 1;

    for (const section of raw) {
      if (!Array.isArray(section.rootIds) || section.rootIds.length === 0) throw new Error('empty rootIds');
      for (const rid of section.rootIds) {
        if (!validRootIds.has(rid)) throw new Error(`invalid rootId: ${rid}`);
        if (seen.has(rid)) throw new Error(`duplicate rootId: ${rid}`);
        if (rid !== expectedNext) throw new Error(`non-sequential rootId: ${rid}, expected ${expectedNext}`);
        seen.add(rid);
        expectedNext = rid + 1;
      }
    }
    // Every root must be covered
    if (seen.size !== roots.length) throw new Error('sections do not cover all roots');

    const rootMap = Object.fromEntries(roots.map(r => [r.id, r]));
    const rootsBySection = {};
    for (const section of raw) {
      rootsBySection[section.id] = section.rootIds.map(rid => rootMap[rid]);
    }

    return { orderedSections: raw, rootsBySection, usesSections: true, sectionCount: raw.length };
  } catch (e) {
    console.warn('Noesis: sections config invalid, falling back to flat list.', e.message);
    return { orderedSections: null, rootsBySection: null, usesSections: false, sectionCount: 0 };
  }
}

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

  const sectionHelpers = buildSectionHelpers(course, roots);

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

    // Section helpers (null/false when course has no sections)
    ...sectionHelpers,

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
  const [activeCourseId, setActiveCourseId] = useState(courseId || null);
  const course = COURSES.find(c => c.id === activeCourseId) || null;
  const value = {
    ...(course ? buildCourseHelpers(course) : {
      roots: [],
      dictionary: {},
      branchRubrics: {},
      rootCount: 0,
      courseMaxPoints: 0,
      courseMaxGauntletPoints: 0,
      courseMaxVocabScore: 0,
      courseQuestionCount: 0,
      getRootMaxPoints: () => 0,
      getRootTermCount: () => 0,
      rootDifficultyMap: {},
      orderedSections: null,
      rootsBySection: null,
      usesSections: false,
      sectionCount: 0,
      meta: { id: null, title: '', description: '', tag: '' },
    }),
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