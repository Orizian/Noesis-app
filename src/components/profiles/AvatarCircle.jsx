import React from 'react';

export default function AvatarCircle({ profile, size = 'md', showRing = false, ringPercent = 0 }) {
  const sizes = {
    sm: { outer: 'w-8 h-8', text: 'text-xs', ring: 28, stroke: 2 },
    md: { outer: 'w-14 h-14', text: 'text-lg', ring: 52, stroke: 3 },
    lg: { outer: 'w-20 h-20', text: 'text-2xl', ring: 76, stroke: 3.5 },
    xl: { outer: 'w-24 h-24', text: 'text-3xl', ring: 88, stroke: 4 },
  };

  const s = sizes[size] || sizes.md;
  const r = s.ring / 2 - s.stroke;
  const circumference = 2 * Math.PI * r;
  const dash = (ringPercent / 100) * circumference;
  const initials = profile?.emoji || (profile?.name ? profile.name.slice(0, 2).toUpperCase() : '??');

  return (
    <div className={`relative flex-shrink-0 ${s.outer}`}>
      {showRing && (
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox={`0 0 ${s.ring} ${s.ring}`}>
          <circle cx={s.ring/2} cy={s.ring/2} r={r} fill="none" stroke="#27272a" strokeWidth={s.stroke} />
          {ringPercent > 0 && (
            <circle
              cx={s.ring/2} cy={s.ring/2} r={r}
              fill="none" stroke="#10b981" strokeWidth={s.stroke}
              strokeDasharray={`${dash} ${circumference}`}
              strokeLinecap="round"
            />
          )}
        </svg>
      )}
      <div
        className={`${showRing ? 'absolute' : ''} ${showRing ? `inset-[${s.stroke * 2}px]` : 'w-full h-full'} 
          rounded-full flex items-center justify-center font-semibold ${s.text} text-white select-none`}
        style={{
          backgroundColor: profile?.color || '#6366f1',
          ...(showRing ? { inset: s.stroke * 2 + 2 } : {}),
          ...(showRing ? { position: 'absolute' } : {}),
        }}
      >
        {initials}
      </div>
    </div>
  );
}