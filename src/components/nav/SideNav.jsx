import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, BookMarked, Map, User, Settings } from 'lucide-react';

const TABS = [
  { label: 'Courses',    icon: BookOpen,   page: 'CourseSelectionPage' },
  { label: 'My Courses', icon: BookMarked, page: 'MyCourses' },
  { label: 'Roadmap',    icon: Map,        page: 'Roadmap' },
  { label: 'Profile',    icon: User,       page: 'ProfileSelect' },
  { label: 'Settings',   icon: Settings,   page: 'AccountPage' },
];

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-zinc-950 border-r border-zinc-800/60 py-6 px-3 flex-shrink-0">
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center">
          <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
        </div>
        <span className="text-sm font-semibold text-zinc-100">Noesis</span>
      </div>
      <nav className="space-y-1 flex-1">
        {TABS.map(({ label, icon: Icon, page }) => {
          const href = `/${page}`;
          const isActive = location.pathname === href || (page === 'CourseSelectionPage' && location.pathname === '/');
          return (
            <button
              key={page}
              onClick={() => navigate(createPageUrl(page))}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}