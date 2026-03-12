// components/courseData/index.js
import { COURSE_META as HPP_META, ROOTS as HPP_ROOTS, DICTIONARY as HPP_DICTIONARY, BRANCH_RUBRICS as HPP_BRANCH_RUBRICS } from './humanPerformancePhysiology';
import { COURSE_META as HN_META, ROOTS as HN_ROOTS, DICTIONARY as HN_DICTIONARY, BRANCH_RUBRICS as HN_BRANCH_RUBRICS } from './humanNutrition'; // New import

export const COURSES = [
  {
    ...HPP_META,
    roots: HPP_ROOTS,
    dictionary: HPP_DICTIONARY,
    branchRubrics: HPP_BRANCH_RUBRICS,
  },
  {
    ...HN_META, // New course
    roots: HN_ROOTS,
    dictionary: HN_DICTIONARY,
    branchRubrics: HN_BRANCH_RUBRICS,
  },
  {
    id: 'applied-personal-training',
    title: 'Applied Personal Training',
    description: 'A comprehensive certification-level course covering exercise programming, client assessment, movement coaching, and evidence-based training design for personal trainers and serious coaches.',
    tag: 'Personal Training',
    difficulty: 2,
    depth: 2,
    scope: 4,
    duration: 'marathon',
    comingSoon: true,
    rootSummaries: [],
    roots: [],
    dictionary: {},
    branchRubrics: {},
  },
];