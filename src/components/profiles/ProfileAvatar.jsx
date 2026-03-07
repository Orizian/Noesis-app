import React from 'react';

export const PROFILE_COLORS = [
  { id: 'emerald', bg: 'bg-emerald-700', hex: '#047857', text: 'text-white' },
  { id: 'sky',     bg: 'bg-sky-700',     hex: '#0369a1', text: 'text-white' },
  { id: 'violet',  bg: 'bg-violet-700',  hex: '#6d28d9', text: 'text-white' },
  { id: 'rose',    bg: 'bg-rose-700',    hex: '#be123c', text: 'text-white' },
  { id: 'amber',   bg: 'bg-amber-600',   hex: '#d97706', text: 'text-white' },
  { id: 'cyan',    bg: 'bg-cyan-700',    hex: '#0e7490', text: 'text-white' },
  { id: 'fuchsia', bg: 'bg-fuchsia-700', hex: '#a21caf', text: 'text-white' },
  { id: 'slate',   bg: 'bg-slate-600',   hex: '#475569', text: 'text-white' },
];

export const PROFILE_EMOJIS = ['🏋️', '⚡', '🧠', '🔥', '⭐', '🏆', '⛰️', '🎯'];

export function getColorConfig(colorId) {
  return PROFILE_COLORS.find(c => c.id === colorId) || PROFILE_COLORS[0];
}

export default function ProfileAvatar({ profile, size = 'md' }) {
  const colorConfig = getColorConfig(profile.color);
  const sizes = {
    sm: 'w-8 h-8 text-base',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };
  const initials = profile.name
    ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 ${colorConfig.bg} ${colorConfig.text} ${sizes[size]}`}
    >
      {profile.emoji || initials}
    </div>
  );
}