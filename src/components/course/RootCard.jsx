import React from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DifficultyBars from './DifficultyBars';
import { RootCardBars } from './MasteryBars';
import {
  getQuestionCriteria, deriveRootStatus, getGauntletRootPoints, isRootPerfected,
  isGauntletEligible, isRootGauntletPassed, getGauntletPassedDate,
} from '../profiles/profileStorage';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  not_started: { label: 'Not Started', badgeClass: 'bg-zinc-800 text-zinc-500 border-zinc-700', borderClass: 'border-l-zinc-700' },
  in_progress: { label: 'In Progress', badgeClass: 'bg-blue-950/50 text-blue-400 border-blue-800/50', borderClass: 'border-l-blue-500' },
  complete:    { label: 'Complete',    badgeClass: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50', borderClass: 'border-l-emerald-500' },
  mastered:    { label: 'Mastered',    badgeClass: 'bg-violet-950/50 text-violet-300 border-violet-800/50', borderClass: 'border-l-violet-500' },
};

// Derive tier label purely from total root points (0–13)
function getTierFromPoints(pts) {
  if (pts <= 1) return null;
  if (pts <= 5) return { label: 'Pass', className: 'text-emerald-400' };
  if (pts <= 12) return { label: 'Great', className: 'text-teal-400' };
  return { label: 'Excellent', className: 'text-violet-400' };
}

export default function RootCard({ root, profileId }) {
  const qc = profileId ? getQuestionCriteria(profileId, root.id) : { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  const rootPoints = (qc.root || 0) + (qc.branch_1 || 0) + (qc.branch_2 || 0) + (qc.branch_3 || 0);
  const status = deriveRootStatus(qc);
  const perfected = profileId ? isRootPerfected(profileId, root.id) : false;
  const gauntletPoints = profileId ? getGauntletRootPoints(profileId, root.id) : 0;
  const cfg = perfected
    ? { label: 'Perfected', badgeClass: 'bg-violet-950/60 text-violet-300 border-violet-700', borderClass: 'border-l-violet-500' }
    : STATUS_CONFIG[status];
  const tier = getTierFromPoints(rootPoints);

  const gauntletEligible = profileId ? isGauntletEligible(profileId, root.id) : false;
  const gauntletPassed = profileId ? isRootGauntletPassed(profileId, root.id) : false;
  const gauntletPassedDate = gauntletPassed ? getGauntletPassedDate(profileId, root.id) : null;
  const gauntletPerfected = gauntletPoints === 13;

  // Gauntlet status element
  let gauntletEl = null;
  if (gauntletPerfected && gauntletPassed) {
    gauntletEl = (
      <div className="mt-3 flex items-center gap-1.5">
        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        <span className="text-xs text-yellow-400 font-semibold">Perfected</span>
      </div>
    );
  } else if (gauntletPassed) {
    gauntletEl = (
      <div className="mt-3">
        <span className="text-xs text-yellow-400 font-medium">
          Gauntlet Passed {gauntletPassedDate ? '· ' + format(new Date(gauntletPassedDate), 'MMM d, yyyy') : ''}
        </span>
      </div>
    );
  } else if (gauntletEligible) {
    gauntletEl = (
      <Link
        to={createPageUrl('RootGauntletPage') + `?rootId=${root.id}`}
        onClick={e => e.stopPropagation()}
        className="mt-3 block w-full py-2 rounded-xl border text-xs font-semibold text-center
          border-amber-700/60 text-amber-400 bg-transparent gauntlet-glow transition-colors hover:bg-amber-950/20"
      >
        Enter Gauntlet
      </Link>
    );
  } else {
    gauntletEl = (
      <p className="mt-3 text-xs text-zinc-600">Complete all cold attempts to unlock Gauntlet.</p>
    );
  }

  // Perfected card gets gold border accent
  const cardBorder = (gauntletPerfected && gauntletPassed)
    ? 'border-l-[3px] border-l-yellow-700/60 border-yellow-800/30'
    : `border-l-[3px] ${cfg.borderClass}`;

  return (
    <Link to={createPageUrl('RootDetail') + `?rootId=${root.id}`}>
      <div
        className={`group relative border border-zinc-800 rounded-xl p-5 md:p-5 
          hover:border-zinc-700 transition-all duration-[600ms] cursor-pointer
          ${cardBorder} bg-zinc-900/80 hover:bg-zinc-900`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 
              flex items-center justify-center text-xs font-mono text-zinc-400 
              group-hover:border-zinc-600 transition-colors mt-0.5">
              {String(root.id).padStart(2, '0')}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-medium text-zinc-100 group-hover:text-white transition-colors leading-snug">
                {root.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border transition-all duration-[600ms] ${cfg.badgeClass}`}>
                  {cfg.label}
                </span>
                <DifficultyBars rootId={root.id} showLabel={true} size="sm" />
                {tier && (
                  <span className={`text-xs font-medium ${tier.className}`}>
                    {tier.label}
                  </span>
                )}
              </div>
              {/* Progress bars */}
              <div className="mt-3">
                <RootCardBars rootPoints={rootPoints} gauntletPoints={gauntletPoints} hasPerfected={perfected} />
              </div>
              {/* Gauntlet status */}
              {gauntletEl}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0 mt-1" />
        </div>
      </div>
    </Link>
  );
}