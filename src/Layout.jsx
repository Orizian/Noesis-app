import React from 'react';
import { ProfileProvider, useProfile } from './components/profiles/ProfileContext';
import { CourseProvider } from './components/course/CourseContext';
import ProfileSelect from './pages/ProfileSelect';
import CourseSelectionPage from './pages/CourseSelectionPage.jsx';
import BottomNav from './components/nav/BottomNav';
import DesktopSidebar from './components/nav/DesktopSidebar';

const SIDEBAR_PAGES = ['CourseSelectionPage', 'MyCourses', 'Roadmap', 'ProfileSelect', 'AccountPage', 'Stats', 'CourseOverview', 'RootDetail', 'RootGauntletPage', 'AbsoluteGauntletPage'];

function AppShell({ children, currentPageName }) {
  const { activeProfileId } = useProfile();

  const ALWAYS_RENDER_PAGES = ['AccountPage'];
  if (ALWAYS_RENDER_PAGES.includes(currentPageName)) {
    return <>{children}</>;
  }

  if (!activeProfileId) {
    return <ProfileSelect />;
  }

  if (!currentPageName || currentPageName === 'Home') {
    return <CourseSelectionPage />;
  }

  return <>{children}</>;
}

function MainLayout({ children, currentPageName }) {
  const showSidebar = SIDEBAR_PAGES.includes(currentPageName) || !currentPageName;
  return (
    <div className="flex min-h-screen">
      {showSidebar && <DesktopSidebar />}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
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
            <MainLayout currentPageName={currentPageName}>
              {children}
            </MainLayout>
          </AppShell>
          <BottomNav />
        </div>
      </ProfileProvider>
    </CourseProvider>
  );
}