import React from 'react';
import { ProfileProvider, useProfile } from './components/profiles/ProfileContext';
import { CourseProvider } from './components/course/CourseContext';
import ProfileSelect from './pages/ProfileSelect';
import CourseSelectionPage from './pages/CourseSelectionPage';
import BottomNav from './components/nav/BottomNav';
import DesktopSidebar from './components/nav/DesktopSidebar';

function AppShell({ children, currentPageName }) {
  const { activeProfileId } = useProfile();

  // Pages that should always render regardless of profile state
  const ALWAYS_RENDER_PAGES = ['AccountPage'];
  if (ALWAYS_RENDER_PAGES.includes(currentPageName)) {
    return <>{children}</>;
  }

  if (!activeProfileId) {
    return <ProfileSelect />;
  }

  // Default landing: go to course selection if profile already selected
  if (!currentPageName || currentPageName === 'Home') {
    return <CourseSelectionPage />;
  }

  return <>{children}</>;
}

export default function Layout({ children, currentPageName }) {
  return (
    <CourseProvider>
      <ProfileProvider>
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
          <BottomNav />
        </div>
      </ProfileProvider>
    </CourseProvider>
  );
}