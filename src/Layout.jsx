import React, { useState } from 'react';
import { ProfileProvider, useProfile } from './components/profiles/ProfileContext';
import { CourseProvider } from './components/course/CourseContext';
import ProfileSelect from './pages/ProfileSelect';
import CourseSelectionPage from './pages/CourseSelectionPage';
import BottomNav from './components/nav/BottomNav';
import SideNav from './components/nav/SideNav';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import { getActiveProfileId } from './components/profiles/profileStorage';

const ALWAYS_RENDER_PAGES = ['AccountPage'];

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

function LayoutInner({ children, currentPageName }) {
  const [splashDone, setSplashDone] = useState(false);
  const navigate = useNavigate();

  const handleSplashDone = () => {
    const hasProfile = !!getActiveProfileId();
    if (hasProfile) {
      navigate('/MyCourses', { replace: true });
    }
    setSplashDone(true);
  };

  if (!splashDone) {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <style>{`
        body { background-color: #09090b; color: #fafafa; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
      <div className="flex min-h-screen">
        <SideNav />
        {/* pb-nav reserves space for the fixed bottom nav on mobile so content is never hidden */}
        <div className="flex-1 min-w-0 pb-nav md:pb-0">
          <AppShell currentPageName={currentPageName}>
            {children}
          </AppShell>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <CourseProvider>
      <ProfileProvider>
        <LayoutInner currentPageName={currentPageName}>{children}</LayoutInner>
      </ProfileProvider>
    </CourseProvider>
  );
}