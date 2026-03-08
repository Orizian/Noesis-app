import React, { useState, useEffect } from 'react';
import { ROOTS } from '../components/courseData';
import ModeSelector from '../components/course/ModeSelector';
import QuestionBank from '../components/course/QuestionBank';
import QuestionSelector from '../components/course/QuestionSelector';
import ChatInterface from '../components/course/ChatInterface';
import ProfileDropdown from '../components/profiles/ProfileDropdown';
import RootDictionary from '../components/course/RootDictionary';
import CompetencyMeter from '../components/course/CompetencyMeter';
import DifficultyBars from '../components/course/DifficultyBars';
import { RootDetailBars } from '../components/course/MasteryBars';
import { useProfile } from '../components/profiles/ProfileContext';
import { ArrowLeft, Circle, Zap, CheckCircle2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  getColdAttemptCount,
  getOpenedModes,
  recordModeOpened,
  getQuestionCriteria,
  deriveRootStatus,
  setQuestionCriteria,
  setBestTier,
  getQualityTier,
} from '../components/profiles/profileStorage';
import { format } from 'date-fns';

const statusConfig = {
  not_started: { label: 'Not Started', className: 'bg-zinc-800 text-zinc-500 border-zinc-700' },
  in_progress:  { label: 'In Progress',  className: 'bg-blue-950/50 text-blue-400 border-blue-800/50' },
  complete:     { label: 'Complete',     className: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50' },
  mastered:     { label: 'Mastered',     className: 'bg-violet-950/50 text-violet-300 border-violet-800/50' },
};

// Ring removed — replaced by MasteryBars

export default function RootDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const rootId = parseInt(urlParams.get('rootId')) || 1;
  const root = ROOTS.find(r => r.id === rootId) || ROOTS[0];

  const [activeMode, setActiveMode] = useState(null); // null = no mode selected yet
  const [selectedQuestion, setSelectedQuestion] = useState('root');
  const [competencyStage, setCompetencyStage] = useState(1);
  const [dictKey, setDictKey] = useState(0); // force re-render of dictionary on term encountered

  const { activeProfileId, getRootProgress, setRootProgress, refresh } = useProfile();

  const progress = getRootProgress(rootId);

  // Criteria-based data
  const qc = activeProfileId ? getQuestionCriteria(activeProfileId, rootId) : { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  const rootPoints = (qc.root || 0) + (qc.branch_1 || 0) + (qc.branch_2 || 0) + (qc.branch_3 || 0);
  const status = deriveRootStatus(qc);
  const cfg = statusConfig[status] || statusConfig.not_started;

  // Determine initial competency stage based on derived status
  useEffect(() => {
    if (status === 'complete' || status === 'mastered') {
      setCompetencyStage(4);
    } else {
      setCompetencyStage(1);
    }
  }, [rootId]);

  // Mode open tracking for practice dot
  const openedModes = activeProfileId ? getOpenedModes(activeProfileId, rootId) : [];
  const hasOpenedTeach = openedModes.includes('teach');
  const hasOpenedPractice = openedModes.includes('practice');
  const showPracticeDot = hasOpenedTeach && !hasOpenedPractice;

  const handleModeChange = (newMode) => {
    setActiveMode(newMode);
    if (activeProfileId) {
      recordModeOpened(activeProfileId, rootId, newMode);
    }
    // Mark in_progress when teach mode first opened
    if (newMode === 'teach' && activeProfileId && !progress) {
      setRootProgress(rootId, {
        status: 'in_progress',
        root_question_passed: false,
        branch_1_passed: false,
        branch_2_passed: false,
        branch_3_passed: false,
        startedAt: Date.now(),
      });
    } else if (newMode === 'teach' && activeProfileId && progress && !progress.startedAt) {
      setRootProgress(rootId, { ...progress, startedAt: Date.now() });
    }
  };

  const handlePassColdAttempt = (questionType, earnedCount) => {
    // Criteria are already stored by ChatInterface before calling this.
    // Here we just keep the legacy progress store in sync (for timestamps etc.)
    if (!activeProfileId) return;
    const current = progress || { startedAt: Date.now() };
    const updates = { ...current };
    if (questionType === 'root') { updates.root_question_passed = true; }
    if (questionType === 'branch_1') { updates.branch_1_passed = true; }
    if (questionType === 'branch_2') { updates.branch_2_passed = true; }
    if (questionType === 'branch_3') { updates.branch_3_passed = true; }
    updates.status = updates.root_question_passed ? 'complete' : 'in_progress';
    if (updates.root_question_passed && !updates.completedAt) updates.completedAt = Date.now();
    setRootProgress(rootId, updates);
  };

  const handleCompetencyChange = (stage) => {
    setCompetencyStage(prev => Math.max(prev, stage));
  };

  const handleTermEncountered = () => {
    setDictKey(k => k + 1);
  };

  // Attempt counts
  const attemptCounts = activeProfileId ? {
    root: getColdAttemptCount(activeProfileId, rootId, 'root'),
    branch_1: getColdAttemptCount(activeProfileId, rootId, 'branch_1'),
    branch_2: getColdAttemptCount(activeProfileId, rootId, 'branch_2'),
    branch_3: getColdAttemptCount(activeProfileId, rootId, 'branch_3'),
  } : { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };

  const hasAnyAttempts = Object.values(attemptCounts).some(c => c > 0);

  const fmt = (ts) => ts ? format(new Date(ts), 'MMM d, yyyy') : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to={createPageUrl('CourseOverview')}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Course Overview
          </Link>
          <ProfileDropdown />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="min-w-0">
              <div className="text-xs font-mono text-zinc-600 mb-1">ROOT {String(root.id).padStart(2, '0')}</div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{root.title}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full border transition-all duration-[600ms] ${cfg.className}`}>
                  {cfg.label}
                </span>
                <DifficultyBars rootId={rootId} showLabel={true} size="sm" />
              </div>
            </div>
          </div>

          {/* Timestamps */}
          {(progress?.startedAt || progress?.completedAt || progress?.masteredAt) && (
            <div className="mb-3 flex flex-wrap gap-3">
              {progress?.startedAt && (
                <span className="text-xs text-zinc-600">Started {fmt(progress.startedAt)}</span>
              )}
              {progress?.completedAt && (
                <span className="text-xs text-zinc-600">· Completed {fmt(progress.completedAt)}</span>
              )}
              {progress?.masteredAt && (
                <span className="text-xs text-zinc-600">· Mastered {fmt(progress.masteredAt)}</span>
              )}
            </div>
          )}

          {/* Progress bars */}
          <div className="mt-4 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
            <RootDetailBars
              rootPoints={rootPoints}
              gauntletPoints={0}
              hasPerfected={false}
              questionPoints={qc}
            />
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mb-6">
          <ModeSelector
            activeMode={activeMode || ''}
            onModeChange={handleModeChange}
            showPracticeDot={showPracticeDot}
          />
        </div>

        {/* Empty state — no mode selected yet and root not started */}
        {!activeMode && (
          <div className="mb-10 py-12 text-center">
            <p className="text-zinc-500 text-sm">Start with Teach Me to build your understanding of this concept.</p>
          </div>
        )}

        {/* Competency meter — Teach Me only */}
        {activeMode === 'teach' && (
          <CompetencyMeter stage={competencyStage} />
        )}

        {/* Question Selector (for Practice and Cold modes) */}
        {activeMode && (activeMode === 'practice' || activeMode === 'cold') && (
          <div className="mb-4">
            <label className="text-xs text-zinc-500 mb-2 block">Select question</label>
            <QuestionSelector
              root={root}
              progress={progress}
              selectedQuestion={selectedQuestion}
              onSelect={setSelectedQuestion}
            />
          </div>
        )}

        {/* Chat Area */}
        {activeMode && (
          <div className="mb-10">
            <ChatInterface
              key={`${root.id}-${activeMode}-${selectedQuestion}`}
              root={root}
              mode={activeMode}
              questionType={activeMode === 'teach' ? 'root' : selectedQuestion}
              onPassColdAttempt={handlePassColdAttempt}
              onSwitchMode={handleModeChange}
              onCompetencyChange={handleCompetencyChange}
              onTermEncountered={handleTermEncountered}
            />
          </div>
        )}

        {/* Dictionary */}
        <div className="mb-6">
          <RootDictionary key={dictKey} rootId={rootId} />
        </div>

        {/* Question Bank */}
        <QuestionBank root={root} progress={progress} />
      </div>
    </div>
  );
}