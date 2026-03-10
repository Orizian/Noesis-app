import React, { createContext, useContext, useState } from 'react';
import { COURSES } from '../courseData/index';

const CourseContext = createContext(null);

export function CourseProvider({ children }) {
  const [activeCourse, setActiveCourse] = useState(COURSES[0]);
  return (
    <CourseContext.Provider value={{ activeCourse, setActiveCourse, courses: COURSES }}>
      {children}
    </CourseContext.Provider>
  );
}

export const useCourse = () => useContext(CourseContext);