import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ROOTS } from '../components/courseData';
import ModeSelector from '../components/course/ModeSelector';
import QuestionBank from '../components/course/QuestionBank';
import QuestionSelector from '../components/course/QuestionSelector';
import ChatInterface from '../components/course/ChatInterface';
import ProfileDropdown from '../components/course/ProfileDropdown';
import ConfirmModal from '../components/profiles/ConfirmModal';
import {
  getActiveProfile, getRootData, markRootInProgress,
  markQuestionPassed, markRootComplete, markBranchPassed,
  resetRootProgress, recordPracticeAttemptStat, getColdAttemptCount,
} from '../components/profileStore';
import {
  ArrowLeft, Circle, Clock, CheckCircle2, Star, RotateCcw, CheckSquare,
} from 'lucide-react';

const STATUS_CONFIG = {
  not_started: { label: 'Not Started', badgeClass: 'bg-zinc-800 text-zinc-400 border-zinc-700', Icon: Circle },
  in_progress: { label: 'In Progress', badgeClass: 'bg-blue-950/50 text-blue-400 border-blue-800/50', Icon: Clock },
  complete: { label: 'Complete', badgeClass: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50', Icon: CheckCircle2 },
  mastered: { label: 'Mastered', badgeClass: 'bg-amber-950/50 text-amber-400 border-amber-800/50', Icon: Star },
};

function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function RootDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const rootId = parseInt(urlParams.get('rootId')) || 1;
  const root = ROOTS.find(r => r.id === rootId) || ROOTS[0];

  const [profile, setProfile] = useState(() => getActiveProfile());
  const [rootData, setRootData] = useState(() => {
    const p = getActiveProfile();
    return p ? getRootData(p.id, rootId) : null;
  });
  const [activeMode, setActiveMode] = useState('teach');
  const [selectedQuestion, setSelectedQuestion] = useState('root');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  // Track first visit for teach-me opening message
  const [wasFirstVisit] = useState(() => {
    const p = getActiveProfile();
    if (!p) return false;
    const rd = getRootData(p.id, rootId);
    return rd.status === 'not_started' && !rd.startedAt;
  });

  const refresh = useCallback(() => {
    const p = getActiveProfile();
    setProfile(p);
    if (p) setRootData(getRootData(p.id, rootId));
    setRefreshKey(k => k + 1);
  }, [rootId]);

  useEffect(() => {
    if (!getActiveProfile()) {
      navigate(createPageUrl('ProfileSelect'), { replace: true });
    }
  }, []);

  useEffect(() => { refresh(); }, [rootId]);

  useEffect(() => {
    const p = getActiveProfile();
    if (activeMode === 'teach' && p) {
      markRootInProgress(p.id, rootId);
      refresh();
    }
  }, [rootId, activeMode]);

  const handlePassColdAttempt = useCallback((questionType) => {
    const p = getActiveProfile();
    if (!p) return;
    markQuestionPassed(p.id, rootId, questionType);
    refresh();
  }, [rootId, refresh]);

  const handlePracticeSubmit = useCallback(() => {
    const p = getActiveProfile();
    if (p) recordPracticeAttemptStat(p.id);
  }, []);

  const handleMarkRootComplete = () => {
    const p = getActiveProfile();
    if (!p) return;
    markRootComplete(p.id, rootId);
    refresh();
  };

  const handleMarkBranchPassed = (branchKey) => {
    const p = getActiveProfile();
    if (!p) return;
    markBranchPassed(p.id, rootId, branchKey);
    refresh();
  };

  const handleResetRoot = () => {
    const p = getActiveProfile();
    if (!p) return;
    resetRootProgress(p.id, rootId);
    refresh();
    setShowResetConfirm(false);
  };

  if (!profile) return null;

  const status = rootData?.status || 'not_started';
  const cfg = STATUS_CONFIG[status];
  const StatusIcon = cfg.Icon;
  const progressCompat = rootData || {};

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <Link
            to={createPageUrl('CourseOverview')}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Course Overview</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <ProfileDropdown onProfileChange={refresh} />
        </div>

        {/* Root header */}
        <div className="mb-7">
          <div className="text-xs font-mono text-zinc-600 mb-1">ROOT {String(root.id).padStart(2, '0')}</div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight flex-1">{root.title}</h1>
            <span className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${cfg.badgeClass}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {cfg.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2">
            {rootData?.startedAt && (
              <span className="text-xs text-zinc-600">Started: {fmtDate(rootData.startedAt)}</span>
            )}
            {rootData?.completedAt && (
              <span className="text-xs text-zinc-600">Completed: {fmtDate(rootData.completedAt)}</span>
            )}
            {rootData?.masteredAt && (
              <span className="text-xs text-amber-700">Mastered: {fmtDate(rootData.masteredAt)}</span>
            )}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mb-5">
          <ModeSelector activeMode={activeMode} onModeChange={setActiveMode} />
        </div>

        {/* Question Selector */}
        {(activeMode === 'practice' || activeMode === 'cold') && (
          <div className="mb-4">
            <label className="text-xs text-zinc-500 mb-2 block">Select question</label>
            <QuestionSelector
              root={root}
              progress={progressCompat}
              selectedQuestion={selectedQuestion}
              onSelect={setSelectedQuestion}
            />
          </div>
        )}

        {/* Chat */}
        <div className="mb-6">
          <ChatInterface
            key={`${root.id}-${activeMode}-${selectedQuestion}-${refreshKey}`}
            root={root}
            mode={activeMode}
            questionType={activeMode === 'teach' ? 'root' : selectedQuestion}
            onPassColdAttempt={handlePassColdAttempt}
            onPracticeSubmit={handlePracticeSubmit}
          />
        </div>

        {/* Manual completion buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {!rootData?.root_question_passed && (
            <button
              onClick={handleMarkRootComplete}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium 
                border border-zinc-700 text-zinc-400 hover:border-emerald-700 hover:text-emerald-400 
                hover:bg-emerald-950/30 transition-all"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Mark Root Complete
            </button>
          )}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium 
              border border-zinc-800 text-zinc-600 hover:border-red-900 hover:text-red-400 
              hover:bg-red-950/20 transition-all ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset This Root
          </button>
        </div>

        {/* Question Bank */}
        <QuestionBank
          root={root}
          progress={progressCompat}
          onMarkBranchPassed={handleMarkBranchPassed}
        />
      </div>

      {showResetConfirm && (
        <ConfirmModal
          title={`Reset ${root.title}?`}
          message="This clears completion status for this root and all its branches. Other roots are not affected."
          confirmLabel="Reset Root"
          onConfirm={handleResetRoot}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  );
}