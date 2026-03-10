import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourse, getRootGauntletMaxPoints, getCourseGauntletMaxPoints } from './CourseContext';
import { createPageUrl } from '@/utils';
import {
  isGauntletEligible,
  isRootGauntletPassed,
  getGauntletPassedDate,
  getTotalGauntletPoints,
  isAllGauntletsPassed,
  isAbsoluteGauntletConquered,
  getAbsoluteGauntlet,
  getGauntletRootPoints,
} from '../profiles/profileStorage';

import { Star, Trophy, Swords } from 'lucide-react';
import { format } from 'date-fns';

function getBarColorDynamic(pts, max) {
  const pct = max > 0 ? pts / max : 0;
  if (pct < 0.31) return 'bg-zinc-500';
  if (pct < 0.69) return 'bg-emerald-500';
  if (pct < 1) return 'bg-teal-500';
  return 'bg-violet-400';
}

function GauntletTile({ root, profileId, courseId }) {
  const eligible = profileId ? isGauntletEligible(profileId, courseId, root.id, root.branches.length) : false;
  const passed = profileId ? isRootGauntletPassed(profileId, courseId, root.id) : false;
  const passedDate = passed ? getGauntletPassedDate(profileId, courseId, root.id) : null;
  const points = profileId ? getGauntletRootPoints(profileId, courseId, root.id, root.branches.length) : 0;
  // "Perfected" = 13/13
  const perfected = points === 13;

  let tileClass = 'border-zinc-800 bg-zinc-900/50 cursor-default';
  let statusEl = null;

  if (perfected && passed) {
    tileClass = 'border-yellow-700/50 bg-yellow-950/10 cursor-pointer';
    statusEl = (
      <div className="flex items-center gap-1 text-xs text-yellow-400 font-semibold">
        <Star className="w-3 h-3 fill-yellow-400" />
        Perfected
      </div>
    );
  } else if (passed) {
    tileClass = 'border-yellow-700/40 bg-yellow-950/10 cursor-pointer';
    statusEl = <p className="text-xs text-yellow-400 font-medium">Passed</p>;
  } else if (eligible) {
    tileClass = 'border-zinc-600 bg-zinc-900/60 cursor-pointer gauntlet-glow-tile';
    statusEl = <p className="text-xs text-amber-400 font-medium">Eligible</p>;
  } else {
    statusEl = <p className="text-xs text-zinc-600">Locked</p>;
  }

  const content = (
    <div className={`border rounded-xl p-3 space-y-1 transition-all ${tileClass}`}>
      <p className="text-lg font-bold text-zinc-200">{String(root.id).padStart(2, '0')}</p>
      <p className="text-xs text-zinc-500 leading-snug line-clamp-2">{root.title}</p>
      {statusEl}
    </div>
  );

  if ((passed || eligible) && profileId) {
    return (
      <Link to={createPageUrl('RootGauntletPage') + `?rootId=${root.id}`}>
        {content}
      </Link>
    );
  }
  return content;
}

function AbsoluteGauntletButton({ profileId, roots, courseId }) {
  const navigate = useNavigate();
  const eligible = profileId ? isAllGauntletsPassed(profileId, courseId, roots.length) : false;
  const conquered = profileId ? isAbsoluteGauntletConquered(profileId, courseId) : false;
  const saved = profileId ? getAbsoluteGauntlet(profileId, courseId) : null;
  const inProgress = !conquered && saved?.inProgress;

  const passedCount = profileId
    ? roots.filter(r => isRootGauntletPassed(profileId, courseId, r.id)).length
    : 0;

  if (conquered) {
    const date = saved?.conqueredAt ? format(new Date(saved.conqueredAt), 'MMM d, yyyy') : '';
    return (
      <div className="w-full rounded-2xl border border-yellow-700/40 bg-yellow-950/10 p-6 text-center space-y-2">
        <Trophy className="w-8 h-8 text-yellow-400 mx-auto" />
        <p className="text-yellow-400 font-bold text-xl">The Absolute Gauntlet — Conquered</p>
        {date && <p className="text-zinc-500 text-sm">{date}</p>}
      </div>
    );
  }

  if (!eligible) {
    return (
      <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-5 text-center">
        <p className="text-zinc-200 font-bold text-lg">The Absolute Gauntlet</p>
        <p className="text-zinc-500 text-sm mt-1">All {roots.length} roots. {roots.reduce((sum, r) => sum + 1 + r.branches.length, 0)} questions. One sitting.</p>
        <p className="text-zinc-600 text-xs mt-3">{roots.length - passedCount} of {roots.length} Gauntlets remaining</p>
      </div>
    );
  }

  const handleClick = () => navigate(createPageUrl('AbsoluteGauntletPage'));

  return (
    <button
      onClick={handleClick}
      className="w-full rounded-2xl border px-6 py-6 text-center transition-all
        border-red-700/60 bg-red-950/20 hover:bg-red-950/30 absolute-glow cursor-pointer"
    >
      <p className="text-red-200 font-bold text-xl">
        {inProgress ? `Resume — Root ${Object.keys(saved?.completedRoots || {}).length + 1} of ${roots.length}` : 'The Absolute Gauntlet'}
      </p>
      <p className="text-zinc-500 text-sm mt-1">All {roots.length} roots. {roots.reduce((sum, r) => sum + 1 + r.branches.length, 0)} questions. One sitting.</p>
      {inProgress && (
        <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-700 transition-all"
            style={{ width: `${(Object.keys(saved?.completedRoots || {}).length / roots.length) * 100}%` }}
          />
        </div>
      )}
    </button>
  );
}

export default function GauntletBoard({ profileId }) {
  const { roots, meta } = useCourse();
  const courseId = meta.id;
  const totalPoints = profileId ? getTotalGauntletPoints(profileId, courseId, roots) : 0;

  return (
    <div className="mt-10 border border-zinc-800 rounded-2xl bg-zinc-900/30 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-1">
          <Swords className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-zinc-100">The Gauntlet</h2>
        </div>
        <p className="text-sm text-zinc-500">Test every root. No assistance. No going back.</p>
      </div>

      <div className="p-5 space-y-5">
        {/* root grid */}
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
          {roots.map(root => (
            <GauntletTile key={root.id} root={root} profileId={profileId} courseId={courseId} />
          ))}
        </div>

        {/* Cumulative bar — always visible */}
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-xs text-zinc-500">Gauntlet Total</span>
            <span className="text-xs font-mono text-zinc-400">{totalPoints} / {roots.length * 13}</span>
          </div>
          <div className="relative h-2 bg-zinc-800 rounded-full overflow-visible">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${getBarColorDynamic(totalPoints, roots.length * 13)}`}
              style={{ width: `${Math.min((totalPoints / (roots.length * 13)) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Absolute Gauntlet button */}
        <AbsoluteGauntletButton profileId={profileId} roots={roots} courseId={courseId} />
      </div>
    </div>
  );
}