import React from 'react';
import { ProfileProvider, useProfile } from './components/profiles/ProfileContext';
import { CourseProvider } from './components/course/CourseContext';
import ProfileSelect from './pages/ProfileSelect';
import CourseSelectionPage from './pages/CourseSelectionPage';
import BottomNav from './components/nav/BottomNav';
import SideNav from './components/nav/SideNav';


const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
};
const pageTransition = { duration: 0.18, ease: 'easeOut' };

function AppShell({ children, currentPageName }) {
  const { activeProfileId } = useProfile();
  const location = useLocation();

  const ALWAYS_RENDER_PAGES = ['AccountPage'];
  if (ALWAYS_RENDER_PAGES.includes(currentPageName)) {
    return <>{children}</>;
  }

  let content;
  let contentKey;

  if (!activeProfileId) {
    content = <ProfileSelect />;
    contentKey = 'profile-select';
  } else if (!currentPageName || currentPageName === 'Home') {
    content = <CourseSelectionPage />;
    contentKey = 'course-selection-home';
  } else {
    content = children;
    contentKey = location.pathname;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={contentKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{ willChange: 'opacity, transform' }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
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