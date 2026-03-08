import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DifficultyBars from './DifficultyBars';
import { RootCardBars } from './MasteryBars';
import { getQuestionCriteria, deriveRootStatus, getBestTier } from '../profiles/profileStorage';

const statusConfig = {
  not_started: {
    icon: Circle,
    label: 'Not Started',
    badgeClass: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    borderClass: 'border-l-zinc-600',
    cardClass: '',
    dotClass: 'bg-zinc-500',
  },
  in_progress: {
    icon: Zap,
    label: 'In Progress',
    badgeClass: 'bg-blue-950/50 text-blue-400 border-blue-800/50',
    borderClass: 'border-l-blue-500',
    cardClass: '',
    dotClass: 'bg-blue-500',
  },
  complete: {
    icon: CheckCircle2,
    label: 'Complete',
    badgeClass: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50',
    borderClass: 'border-l-emerald-500',
    cardClass: '',
    dotClass: 'bg-emerald-500',
  },
  mastered: {
    icon: Star,
    label: 'Mastered',
    badgeClass: 'bg-violet-950/50 text-violet-300 border-violet-800/50',
    borderClass: 'border-l-violet-500',
    cardClass: 'bg-violet-950/10',
    dotClass: 'bg-violet-500',
  },
};

export default function RootCard({ root, progress }) {
  const status = progress?.status || 'not_started';
  const config = statusConfig[status] || statusConfig.not_started;
  const Icon = config.icon;

  const completedDate = progress?.completedAt
    ? format(new Date(progress.completedAt), 'MMM d, yyyy')
    : null;
  const masteredDate = progress?.masteredAt
    ? format(new Date(progress.masteredAt), 'MMM d, yyyy')
    : null;

  return (
    <Link to={createPageUrl('RootDetail') + `?rootId=${root.id}`}>
      <div
        className={`group relative border border-zinc-800 rounded-xl p-5 md:p-6 
          hover:border-zinc-700 transition-all duration-[600ms] cursor-pointer
          border-l-[3px] ${config.borderClass} ${config.cardClass}
          ${status === 'mastered' ? 'bg-zinc-900/80' : 'bg-zinc-900/80 hover:bg-zinc-900'}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 
              flex items-center justify-center text-sm font-mono text-zinc-400 
              group-hover:border-zinc-600 transition-colors">
              {String(root.id).padStart(2, '0')}
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-medium text-zinc-100 truncate group-hover:text-white transition-colors">
                {root.title}
              </h3>
              {(status === 'complete' && completedDate) && (
                <p className="text-xs text-zinc-600 mt-0.5">Completed {completedDate}</p>
              )}
              {(status === 'mastered' && masteredDate) && (
                <p className="text-xs text-zinc-600 mt-0.5">Mastered {masteredDate}</p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full border transition-all duration-[600ms] ${config.badgeClass}`}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </span>
                {progress && (
                  <span className="text-xs text-zinc-500">
                    {[progress.root_question_passed, progress.branch_1_passed, progress.branch_2_passed, progress.branch_3_passed].filter(Boolean).length}/4 passed
                  </span>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}