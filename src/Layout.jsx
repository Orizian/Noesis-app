import React from 'react';
import { ProfileProvider, useProfile } from './components/profiles/ProfileContext';
import ProfileSelect from './pages/ProfileSelect';

function AppShell({ children, currentPageName }) {
  const { activeProfileId, selectProfile } = useProfile();

  // Always show profile select first
  if (!activeProfileId) {
    return <ProfileSelect onNavigate={(id) => selectProfile(id)} />;
  }

  return <>{children}</>;
}

export default function Layout({ children, currentPageName }) {
  return (
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
  );
}