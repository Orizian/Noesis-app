import React, { useEffect } from 'react';
import { ProfileProvider, useProfile } from './components/profiles/ProfileContext';
import { CourseProvider, useCourse } from './components/course/CourseContext';
import ProfileSelect from './pages/ProfileSelect';
import { runStorageMigrationIfNeeded } from './components/profiles/profileStorage';

// Run once on app load — migrates old un-namespaced data to courseId-scoped format
runStorageMigrationIfNeeded();

// Bridges the active courseId from CourseContext into ProfileContext
function CourseBridge() {
  const { meta } = useCourse();
  const { setActiveCourseId } = useProfile();
  useEffect(() => {
    if (meta?.id) setActiveCourseId(meta.id);
  }, [meta?.id]);
  return null;
}

function AppShell({ children, currentPageName }) {
  const { activeProfileId } = useProfile();

  if (!activeProfileId) {
    return <ProfileSelect />;
  }

  return <>{children}</>;
}

export default function Layout({ children, currentPageName }) {
  return (
    <CourseProvider>
      <ProfileProvider>
        <CourseBridge />
        <div className="min-h-screen bg-zinc-950">
          <style>{`
            body {
              background-color: #09090b;
              color: #fafafa;
            }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
            ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
          `}</style>
          <AppShell currentPageName={currentPageName}>
            {children}
          </AppShell>
        </div>
      </ProfileProvider>
    </CourseProvider>
  );
}