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

export default function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-zinc-950 border-r border-zinc-800/60 py-6 flex-shrink-0">
      {/* Brand */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-950/70 border border-emerald-800/50 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-100 leading-none">Noesis</p>
            <p className="text-[10px] text-zinc-600 mt-0.5">Build Genuine Understanding</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5">
        {TABS.map(({ label, icon: Icon, page }) => {
          const href = `/${page}`;
          const isActive = location.pathname === href || (page === 'CourseSelectionPage' && location.pathname === '/');
          return (
            <button
              key={page}
              onClick={() => navigate(createPageUrl(page))}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 mt-4">
        <p className="text-[10px] text-zinc-700">v0.1.0</p>
      </div>
    </aside>
  );
}