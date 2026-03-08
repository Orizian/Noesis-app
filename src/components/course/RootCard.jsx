import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DifficultyBars from './DifficultyBars';
import { RootCardBars } from './MasteryBars';
import { getQuestionCriteria, deriveRootStatus, getBestTier } from '../profiles/profileStorage';

const STATUS_CONFIG = {
  not_started: { label: 'Not Started', badgeClass: 'bg-zinc-800 text-zinc-500 border-zinc-700', borderClass: 'border-l-zinc-700' },
  in_progress: { label: 'In Progress', badgeClass: 'bg-blue-950/50 text-blue-400 border-blue-800/50', borderClass: 'border-l-blue-500' },
  complete:    { label: 'Complete',    badgeClass: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50', borderClass: 'border-l-emerald-500' },
  mastered:    { label: 'Mastered',    badgeClass: 'bg-violet-950/50 text-violet-300 border-violet-800/50', borderClass: 'border-l-violet-500' },
};

const TIER_LABEL = { excellent: 'Excellent', great: 'Great', pass: 'Pass', incomplete: null };
const TIER_CLASS = {
  excellent: 'text-violet-400',
  great:     'text-teal-400',
  pass:      'text-emerald-400',
};

export default function RootCard({ root, profileId }) {
  // Derive everything from criteria
  const qc = profileId ? getQuestionCriteria(profileId, root.id) : { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  const rootPoints = (qc.root || 0) + (qc.branch_1 || 0) + (qc.branch_2 || 0) + (qc.branch_3 || 0);
  const status = deriveRootStatus(qc);
  const cfg = STATUS_CONFIG[status];

  // Best tier for root question (shown on card once passed)
  const rootQTier = profileId ? getBestTier(profileId, root.id, 'root') : null;
  const showTierLabel = rootQTier && rootQTier !== 'incomplete' && qc.root >= 2;

  return (
    <Link to={createPageUrl('RootDetail') + `?rootId=${root.id}`}>
      <div
        className={`group relative border border-zinc-800 rounded-xl p-5 md:p-5 
          hover:border-zinc-700 transition-all duration-[600ms] cursor-pointer
          border-l-[3px] ${cfg.borderClass} bg-zinc-900/80 hover:bg-zinc-900`}
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
                {showTierLabel && (
                  <span className={`text-xs font-medium ${TIER_CLASS[rootQTier]}`}>
                    {TIER_LABEL[rootQTier]}
                  </span>
                )}
              </div>
              {/* Progress bars */}
              <div className="mt-3">
                <RootCardBars rootPoints={rootPoints} gauntletPoints={0} hasPerfected={false} />
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0 mt-1" />
        </div>
      </div>
    </Link>
  );
}