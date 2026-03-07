import React, { useState } from 'react';
import AvatarCircle from './AvatarCircle';
import { Pencil, Trash2, Lock } from 'lucide-react';
import { getLastStudiedDays, getTotalScore } from '../profileStore';

export default function ProfileCard({ profile, onSelect, onEdit, onDelete }) {
  const [hovering, setHovering] = useState(false);
  const score = getTotalScore(profile.id);
  const pct = Math.round((score / 48) * 100);
  const lastDays = getLastStudiedDays(profile);
  let lastLabel = 'Not started yet';
  if (lastDays === 0) lastLabel = 'Studied today';
  else if (lastDays === 1) lastLabel = 'Last studied yesterday';
  else if (lastDays !== null) lastLabel = `Last studied ${lastDays}d ago`;

  // Pulsing ring for recently active profiles (within 24 hours)
  const isRecentlyActive = lastDays === 0 || lastDays === 1;

  return (
    <div
      className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-zinc-900 border 
        hover:border-zinc-600 hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer group
        ${isRecentlyActive ? 'border-zinc-700' : 'border-zinc-800'}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => onSelect(profile.id)}
    >
      {/* Pulsing active ring */}
      {isRecentlyActive && (
        <div
          className="absolute inset-0 rounded-2xl border-2 border-emerald-500/30 pointer-events-none"
          style={{ animation: 'pulseRing 2.5s ease-in-out infinite' }}
        />
      )}

      {/* Edit/Delete hover controls */}
      {hovering && (
        <div className="absolute top-2.5 right-2.5 flex gap-1 z-10">
          <button
            onClick={e => { e.stopPropagation(); onEdit(profile); }}
            className="w-7 h-7 rounded-lg bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors"
          >
            <Pencil className="w-3.5 h-3.5 text-zinc-300" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(profile); }}
            className="w-7 h-7 rounded-lg bg-zinc-700 hover:bg-red-900 flex items-center justify-center transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-zinc-300" />
          </button>
        </div>
      )}

      <div className="relative">
        <AvatarCircle profile={profile} size="xl" showRing={true} ringPercent={pct} />
        {profile.pin && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 text-zinc-400" />
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="font-semibold text-zinc-100 text-sm">{profile.name}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{score}/48 pts · {pct}%</p>
        <p className="text-xs text-zinc-600 mt-0.5">{lastLabel}</p>
      </div>

      <style>{`
        @keyframes pulseRing {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.01); }
        }
      `}</style>
    </div>
  );
}