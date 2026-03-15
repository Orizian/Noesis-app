import React from 'react';
import { ProfileProvider, useProfile } from './components/profiles/ProfileContext';
import { CourseProvider } from './components/course/CourseContext';
import ProfileSelect from './pages/ProfileSelect';
import CourseSelectionPage from './pages/CourseSelectionPage';
import BottomNav from './components/nav/BottomNav';
import SideNav from './components/nav/SideNav';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';


function AppShell({ children, currentPageName }) {
  const { activeProfileId } = useProfile();
  const location = useLocation();

  let content;
  if (ALWAYS_RENDER_PAGES.includes(currentPageName)) {
    content = children;
  } else if (!activeProfileId) {
    content = <ProfileSelect />;
  } else if (!currentPageName || currentPageName === 'Home') {
    content = <CourseSelectionPage />;
  } else {
    content = children;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}

const ALWAYS_RENDER_PAGES = ['AccountPage'];

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
          <div className="flex min-h-screen">
            <SideNav />
            <div className="flex-1 min-w-0">
              <AppShell currentPageName={currentPageName}>
                {children}
              </AppShell>
            </div>
          </div>
          <BottomNav />
        </div>
      </ProfileProvider>
    </CourseProvider>
  );
}