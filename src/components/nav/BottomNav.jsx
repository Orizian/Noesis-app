import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, BookMarked, Map, User, Settings } from 'lucide-react';

const TABS = [
  { label: 'Courses',    icon: BookOpen,    page: 'CourseSelectionPage' },
  { label: 'My Courses', icon: BookMarked,  page: 'MyCourses' },
  { label: 'Roadmap',    icon: Map,         page: 'Roadmap' },
  { label: 'Profile',    icon: User,        page: 'ProfileSelect' },
  { label: 'Settings',   icon: Settings,    page: 'AccountPage' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-stretch">
        {TABS.map(({ label, icon: Icon, page }) => {
          const href = `/${page}`;
          const isActive = location.pathname === href || (page === 'CourseSelectionPage' && location.pathname === '/');
          return (
            <button
              key={page}
              onClick={() => navigate(createPageUrl(page))}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all duration-200 active:scale-95 ${
                isActive ? 'text-emerald-400' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </button>
          );
        })}
      </div>

    </nav>
  );
}