import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { getActiveProfile } from './components/profileStore';

const PUBLIC_PAGES = ['ProfileSelect'];

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (PUBLIC_PAGES.includes(currentPageName)) return;
    const profile = getActiveProfile();
    if (!profile) {
      navigate(createPageUrl('ProfileSelect'), { replace: true });
    }
  }, [currentPageName]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <style>{`
        body { background-color: #09090b; color: #fafafa; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
      {children}
    </div>
  );
}