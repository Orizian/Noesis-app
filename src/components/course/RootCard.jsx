import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Circle, Clock, CheckCircle2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const STATUS_CONFIG = {
  not_started: {
    Icon: Circle,
    label: 'Not Started',
    badgeClass: 'bg-zinc-800 text-zinc-500 border-zinc-700',
    borderClass: 'border-l-zinc-700',
    cardClass: '',
  },
  in_progress: {
    Icon: Clock,
    label: 'In Progress',
    badgeClass: 'bg-blue-950/50 text-blue-400 border-blue-800/50',
    borderClass: 'border-l-blue-500',
    cardClass: '',
  },
  complete: {
    Icon: CheckCircle2,
    label: 'Complete',
    badgeClass: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50',
    borderClass: 'border-l-emerald-500',
    cardClass: '',
  },
  mastered: {
    Icon: Star,
    label: 'Mastered',
    badgeClass: 'bg-amber-950/50 text-amber-400 border-amber-900/50',
    borderClass: 'border-l-amber-500',
    cardClass: 'bg-amber-950/10',
  },
};

function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function RootCard({ root, progress }) {
  const status = progress?.status || 'not_started';
  const cfg = STATUS_CONFIG[status];
  const StatusIcon = cfg.Icon;

  // Animate status transitions
  const prevStatusRef = useRef(status);
  const [displayStatus, setDisplayStatus] = useState(status);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (status !== prevStatusRef.current) {
      setAnimating(true);
      const t = setTimeout(() => {
        setDisplayStatus(status);
        prevStatusRef.current = status;
        setAnimating(false);
      }, 600);
      return () => clearTimeout(t);
    } else {
      setDisplayStatus(status);
      prevStatusRef.current = status;
    }
  }, [status]);

  const safeDisplayStatus = STATUS_CONFIG[displayStatus] ? displayStatus : status;
  const displayCfg = STATUS_CONFIG[safeDisplayStatus];
  const DisplayIcon = displayCfg.Icon;

  const passedCount = [
    progress?.root_question_passed,
    progress?.branch_1_passed,
    progress?.branch_2_passed,
    progress?.branch_3_passed,
  ].filter(Boolean).length;

  return (
    <Link to={createPageUrl('RootDetail') + `?rootId=${root.id}`}>
      <div
        className={`group relative bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 
          hover:bg-zinc-900 hover:border-zinc-700 cursor-pointer
          border-l-[3px] ${displayCfg.borderClass} ${displayCfg.cardClass}`}
        style={{ transition: 'border-color 0.6s ease, background-color 0.6s ease' }}
      >
        {/* Transition flash overlay */}
        {animating && (
          <div
            className={`absolute inset-0 rounded-xl opacity-20 pointer-events-none
              ${status === 'mastered' ? 'bg-amber-400' : status === 'complete' ? 'bg-emerald-500' : 'bg-blue-400'}`}
            style={{ animation: 'statusFlash 0.6s ease-out forwards' }}
          />
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 
              flex items-center justify-center text-sm font-mono text-zinc-400 
              group-hover:border-zinc-600 transition-colors">
              {String(root.id).padStart(2, '0')}
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-medium text-zinc-100 group-hover:text-white transition-colors leading-snug">
                {root.title}
              </h3>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full border ${displayCfg.badgeClass}`}
                  style={{ transition: 'all 0.6s ease' }}
                >
                  <DisplayIcon className="w-3 h-3" />
                  {displayCfg.label}
                </span>
                {passedCount > 0 && (
                  <span className="text-xs text-zinc-600">{passedCount}/4 passed</span>
                )}
                {displayStatus === 'complete' && progress?.completedAt && (
                  <span className="text-xs text-zinc-600">Completed {fmtDate(progress.completedAt)}</span>
                )}
                {displayStatus === 'mastered' && progress?.masteredAt && (
                  <span className="text-xs text-amber-700/70">Mastered {fmtDate(progress.masteredAt)}</span>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
        </div>
      </div>
      <style>{`
        @keyframes statusFlash {
          0% { opacity: 0.3; }
          50% { opacity: 0.15; }
          100% { opacity: 0; }
        }
      `}</style>
    </Link>
  );
}