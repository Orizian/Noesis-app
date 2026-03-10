import React from 'react';
import { ProfileProvider, useProfile } from './components/profiles/ProfileContext';
import { CourseProvider } from './components/course/CourseContext';
import ProfileSelect from './pages/ProfileSelect';
import CourseSelectionPage from './pages/CourseSelectionPage';
import { createPageUrl } from '@/utils';

function AppShell({ children, currentPageName }) {
  const { activeProfileId } = useProfile();

  if (!activeProfileId) {
    return <ProfileSelect />;
  }

  if (currentPageName === 'Home' || currentPageName === 'CourseOverview' && window.location.search === '') {
    // Allow direct navigation to CourseOverview (e.g. from RootDetail back link)
  }

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
        </div>
      </ProfileProvider>
    </CourseProvider>
  );
}