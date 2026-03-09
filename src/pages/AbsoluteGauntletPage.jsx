import React, { useState, useRef } from 'react';
import { ROOTS } from '../components/courseData';
import { useProfile } from '../components/profiles/ProfileContext';
import {
  isAllGauntletsPassed,
  getAbsoluteGauntlet,
  setAbsoluteGauntletSession,
  clearAbsoluteGauntletSession,
  isAbsoluteGauntletConquered,
  getQualityTier,
  setGauntletCriteriaBulk,
} from '../components/profiles/profileStorage';
import { evaluateAnswer, GAUNTLET_QUESTIONS, } from '../components/course/RootGauntlet';
import { CheckCircle2, XCircle, ArrowRight, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import ProfileDropdown from '../components/profiles/ProfileDropdown';
import { format } from 'date-fns';

const TIER_CONFIG = {
  excellent:  { label: 'Excellent',  className: 'bg-violet-950/60 border-violet-700 text-violet-300' },
  great:      { label: 'Great',      className: 'bg-teal-950/60 border-teal-700 text-teal-300' },
  pass:       { label: 'Pass',       className: 'bg-emerald-950/60 border-emerald-700 text-emerald-300' },
  incomplete: { label: 'Incomplete', className: 'bg-zinc-800/60 border-zinc-700 text-zinc-500' },
};

const EVAL_PHASES = [
  'Reading your response...',
  'Checking against mastery criteria...',
  'Finalizing evaluation...',
];

function getBarColor104(pts) {
  if (pts < 32) return 'bg-zinc-500';
  if (pts < 72) return 'bg-violet-500';
  if (pts < 104) return 'bg-teal-500';
  return 'bg-violet-400';
}

function getBarColor13(pts) {
  if (pts <= 3) return 'bg-zinc-500';
  if (pts <= 8) return 'bg-emerald-500';
  if (pts <= 12) return 'bg-teal-500';
  return 'bg-violet-500';
}

function ProgressBar({ rootIdx, qIdx }) {
  const total = 32;
  const done = rootIdx * 4 + qIdx;
  return (
    <div className="border-b border-zinc-800">
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-xs font-semibold text-red-400 tracking-wide">
          Root {rootIdx + 1} of 8 — Question {qIdx + 1} of 4
        </span>
        <span className="text-xs text-zinc-600">{done} / {total}</span>
      </div>
      <div className="h-1 bg-zinc-800">
        <div className="h-full bg-red-700 transition-all duration-500" style={{ width: `${(done / total) * 100}%` }} />
      </div>
    </div>
  );
}

function EvalLoader({ phaseIdx }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 min-h-[220px]">
      <div className="w-10 h-10 rounded-full border-2 border-zinc-700 flex items-center justify-center mb-6">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
      </div>
      <p className="text-zinc-300 text-sm font-medium animate-pulse">{EVAL_PHASES[Math.min(phaseIdx, 2)]}</p>
      <div className="flex gap-1.5 mt-5">
        {EVAL_PHASES.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i <= phaseIdx ? 'bg-red-700' : 'bg-zinc-700'}`} />
        ))}
      </div>
    </div>
  );
}

export default function AbsoluteGauntletPage() {
  const { activeProfileId, refresh } = useProfile();
  const navigate = useNavigate();

  const conquered = activeProfileId ? isAbsoluteGauntletConquered(activeProfileId) : false;
  const eligible = activeProfileId ? isAllGauntletsPassed(activeProfileId) : false;

  // Load any in-progress session
  const saved = activeProfileId ? getAbsoluteGauntlet(activeProfileId) : null;
  const hasSession = saved?.inProgress && saved?.completedRoots;

  const [phase, setPhase] = useState(() => {
    if (hasSession) return 'resume';
    return 'caution';
  });

  // Active session state
  const [rootIdx, setRootIdx] = useState(() => {
    if (hasSession) {
      // Find first incomplete root
      for (let i = 0; i < 8; i++) {
        if (!saved.completedRoots?.[i + 1]) return i;
      }
      return 0;
    }
    return 0;
  });
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);
  const [rootResults, setRootResults] = useState([]); // current root's Q results
  const [completedRoots, setCompletedRoots] = useState(() => saved?.completedRoots || {}); // { rootId: { results, score } }
  const [rootTransition, setRootTransition] = useState(false);
  const [transitionTimer, setTransitionTimer] = useState(null);
  const evalTimers = useRef([]);

  if (!eligible && !conquered) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <Link to={createPageUrl('CourseOverview')}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-8">
            <ArrowLeft className="w-4 h-4" /> Course Overview
          </Link>
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 p-8 text-center">
            <p className="text-zinc-500 text-sm">Pass all 8 Root Gauntlets to unlock The Absolute Gauntlet.</p>
          </div>
        </div>
      </div>
    );
  }

  if (conquered) {
    const conqueredDate = format(new Date(saved?.conqueredAt || Date.now()), 'MMM d, yyyy');
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <Link to={createPageUrl('CourseOverview')}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-8">
            <ArrowLeft className="w-4 h-4" /> Course Overview
          </Link>
          <div className="border border-yellow-700/40 rounded-2xl bg-yellow-950/10 p-8 text-center space-y-4">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto" />
            <p className="text-yellow-400 font-bold text-2xl">The Absolute Gauntlet — Conquered</p>
            <p className="text-zinc-500 text-sm">{conqueredDate}</p>
          </div>
        </div>
      </div>
    );
  }

  const clearTimers = () => { evalTimers.current.forEach(clearTimeout); evalTimers.current = []; };

  const root = ROOTS[rootIdx];

  const startFresh = () => {
    const session = { inProgress: true, completedRoots: {}, startedAt: Date.now() };
    if (activeProfileId) setAbsoluteGauntletSession(activeProfileId, session);
    setCompletedRoots({});
    setRootIdx(0);
    setQIdx(0);
    setAnswer('');
    setRootResults([]);
    setCurrentResult(null);
    setPhase('active');
  };

  const resumeSession = () => {
    setPhase('active');
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    const qMeta = GAUNTLET_QUESTIONS[qIdx];
    clearTimers();
    setPhase('evaluating');
    setPhaseIdx(0);
    setCurrentResult(null);

    evalTimers.current.push(setTimeout(() => setPhaseIdx(1), 1500));
    evalTimers.current.push(setTimeout(() => setPhaseIdx(2), 3000));

    const minWait = new Promise(res => setTimeout(res, 5000));
    const evalPromise = evaluateAnswer({ root, qMeta, answer });
    const [result] = await Promise.all([evalPromise, minWait]);

    clearTimers();
    const newRootResults = [...rootResults, result];
    setRootResults(newRootResults);
    setCurrentResult(result);
    setPhase('result');

    // If last question of this root, save to storage
    if (qIdx === 3) {
      const rootScore = newRootResults.reduce((s, r) => s + r.metCount, 0);
      const bulk = {};
      newRootResults.forEach((r, i) => { bulk[GAUNTLET_QUESTIONS[i].key] = r.metCount; });
      if (activeProfileId) setGauntletCriteriaBulk(activeProfileId, root.id, bulk);

      const newCompleted = { ...completedRoots, [root.id]: { results: newRootResults, score: rootScore } };
      setCompletedRoots(newCompleted);
      if (activeProfileId) {
        setAbsoluteGauntletSession(activeProfileId, { completedRoots: newCompleted });
      }
    }
  };

  const handleContinueQ = () => {
    if (qIdx < 3) {
      setQIdx(q => q + 1);
      setAnswer('');
      setCurrentResult(null);
      setPhase('active');
    } else {
      // Show root transition
      setRootTransition(true);
      setPhase('root_transition');
    }
  };

  const handleContinueRoot = () => {
    if (rootIdx < 7) {
      const nextRootIdx = rootIdx + 1;
      setRootIdx(nextRootIdx);
      setQIdx(0);
      setAnswer('');
      setRootResults([]);
      setCurrentResult(null);
      setRootTransition(false);
      setPhase('active');
    } else {
      // All done — show final summary
      setPhase('final_summary');
    }
  };

  // Root transition screen
  if (phase === 'root_transition') {
    const rootScore = rootResults.reduce((s, r) => s + r.metCount, 0);
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-6 animate-in fade-in duration-500">
          <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">Root {rootIdx + 1} of 8 Complete</p>
          <p className="text-3xl font-bold text-zinc-100">{ROOTS[rootIdx].title}</p>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-amber-400">{rootScore} / 13</p>
            <p className="text-xs text-zinc-600">Root Gauntlet Score</p>
          </div>
          {rootIdx < 7 && (
            <button onClick={handleContinueRoot}
              className="w-full py-3 rounded-xl bg-red-900/60 hover:bg-red-800/70 text-red-200 font-semibold text-sm transition-colors mt-4">
              Continue to Root {rootIdx + 2}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Final summary
  if (phase === 'final_summary') {
    const totalScore = Object.values(completedRoots).reduce((s, r) => s + (r.score || 0), 0);
    const allPassed = Object.values(completedRoots).every(r => r.results?.every(q => q.passed));

    if (allPassed && activeProfileId) {
      const ts = Date.now();
      setAbsoluteGauntletSession(activeProfileId, { conqueredAt: ts, inProgress: false });
      refresh();
    }

    const conqueredDate = format(new Date(), 'MMM d, yyyy');

    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
          <h1 className="text-2xl font-bold text-zinc-100">Absolute Gauntlet — Results</h1>

          {allPassed && (
            <div className="border border-yellow-600/40 rounded-2xl bg-yellow-950/10 p-6 text-center">
              <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
              <p className="text-yellow-400 font-bold text-xl">The Absolute Gauntlet — Conquered</p>
              <p className="text-zinc-500 text-sm mt-1">{conqueredDate}</p>
            </div>
          )}

          {/* Per-root summary */}
          <div className="space-y-2">
            {ROOTS.map((r, i) => {
              const data = completedRoots[r.id];
              if (!data) return null;
              const passed = data.results?.every(q => q.passed);
              return (
                <div key={r.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center gap-2 min-w-0">
                    {passed ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                    <span className="text-sm text-zinc-400 truncate">{r.title}</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400 flex-shrink-0">{data.score} / 13</span>
                </div>
              );
            })}
          </div>

          {/* Total bar */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-xs text-zinc-500">Total Score</span>
              <span className="text-xs font-mono text-zinc-400">{totalScore} / 104</span>
            </div>
            <div className="relative h-2.5 bg-zinc-800 rounded-full overflow-visible">
              <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${getBarColor104(totalScore)}`}
                style={{ width: `${(totalScore / 104) * 100}%` }} />
              {[32, 72, 104].map(tick => (
                <div key={tick} className="absolute top-[-3px] bottom-[-3px] w-px bg-zinc-600 z-10"
                  style={{ left: `${(tick / 104) * 100}%` }} />
              ))}
            </div>
          </div>

          {!allPassed && (
            <div className="space-y-1">
              <p className="text-zinc-400 text-sm font-medium">Failed roots:</p>
              {ROOTS.map((r) => {
                const data = completedRoots[r.id];
                const passed = data?.results?.every(q => q.passed);
                if (passed) return null;
                return <p key={r.id} className="text-red-400 text-sm">Root {r.id}: {r.title} ({data?.score || 0} / 13)</p>;
              })}
            </div>
          )}

          <button onClick={() => { refresh(); navigate(createPageUrl('CourseOverview')); }}
            className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors">
            Return to Course Overview
          </button>
        </div>
      </div>
    );
  }

  // Caution
  if (phase === 'caution') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-8">
            <Link to={createPageUrl('CourseOverview')}
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300">
              <ArrowLeft className="w-4 h-4" /> Course Overview
            </Link>
            <ProfileDropdown />
          </div>

          <div className="border border-red-800/40 rounded-2xl bg-red-950/10 p-8 space-y-5">
            <h1 className="text-xl font-bold text-red-300">The Absolute Gauntlet</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              8 roots. 32 questions. No assistance. No skipping. No going back. Every mechanism. One sitting.
              This is the final verification of complete course mastery.
            </p>
            <div className="flex gap-3">
              <button onClick={startFresh}
                className="flex-1 py-3 rounded-xl bg-red-800/70 hover:bg-red-700/80 text-white font-bold text-sm transition-colors">
                Begin
              </button>
              <Link to={createPageUrl('CourseOverview')}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors text-center">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Resume screen
  if (phase === 'resume') {
    const completedCount = Object.keys(completedRoots).length;
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <Link to={createPageUrl('CourseOverview')}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-8">
            <ArrowLeft className="w-4 h-4" /> Course Overview
          </Link>
          <div className="border border-red-800/40 rounded-2xl bg-red-950/10 p-8 space-y-5">
            <h1 className="text-xl font-bold text-red-300">The Absolute Gauntlet — In Progress</h1>
            <p className="text-sm text-zinc-400">{completedCount} of 8 roots completed. Resume from Root {rootIdx + 1}.</p>
            <div className="flex gap-3">
              <button onClick={resumeSession}
                className="flex-1 py-3 rounded-xl bg-red-800/70 hover:bg-red-700/80 text-white font-bold text-sm transition-colors">
                Resume
              </button>
              <Link to={createPageUrl('CourseOverview')}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors text-center">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active / evaluating / result
  const qMeta = GAUNTLET_QUESTIONS[qIdx];
  const getQuestionText = (key) => {
    if (key === 'root') return root.rootQuestion;
    const idx2 = parseInt(key.split('_')[1]) - 1;
    return root.branches[idx2]?.question || root.rootQuestion;
  };

  if (phase === 'evaluating') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 overflow-hidden">
            <ProgressBar rootIdx={rootIdx} qIdx={qIdx} />
            <div className="p-6"><EvalLoader phaseIdx={phaseIdx} /></div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result' && currentResult) {
    const tier = getQualityTier(currentResult.metCount, qMeta.key === 'root');
    const tierCfg = TIER_CONFIG[tier];
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 overflow-hidden">
            <ProgressBar rootIdx={rootIdx} qIdx={qIdx} />
            <div className="p-5 space-y-4 animate-in fade-in duration-400">
              <div className="flex flex-col items-center gap-2">
                <div className={`flex items-center gap-2 px-5 py-2 rounded-2xl border text-sm font-bold
                  ${currentResult.passed ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300' : 'bg-red-950/60 border-red-800 text-red-300'}`}>
                  {currentResult.passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {currentResult.passed ? 'PASS' : 'FAIL'}
                </div>
                <span className={`text-xs px-3 py-1 rounded-xl border font-semibold ${tierCfg.className}`}>{tierCfg.label}</span>
                <span className="text-xs text-zinc-500">{currentResult.metCount} of {qMeta.maxCriteria} criteria met</span>
              </div>
              <div className="space-y-2">
                {currentResult.rows?.map((r, i) => (
                  <div key={i} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border text-sm
                    ${!r.evaluated ? 'bg-zinc-800/30 border-zinc-700/40 text-zinc-600' :
                      r.met ? 'bg-emerald-950/20 border-emerald-900/40 text-zinc-300' : 'bg-red-950/20 border-red-900/40 text-zinc-400'}`}>
                    {!r.evaluated
                      ? <span className="flex-shrink-0 text-zinc-600 text-xs mt-0.5">?</span>
                      : r.met
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                    {r.text}
                  </div>
                ))}
              </div>
              {currentResult.narrative && (
                <div className="px-4 py-3 rounded-xl border bg-zinc-800/40 border-zinc-700/50 text-sm text-zinc-400 leading-relaxed">
                  {currentResult.narrative}
                </div>
              )}
              <button onClick={handleContinueQ}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-sm transition-colors">
                {qIdx < 3 ? 'Next Question' : 'Root Complete'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active input
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 overflow-hidden">
          <ProgressBar rootIdx={rootIdx} qIdx={qIdx} />
          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs font-mono text-zinc-600 mb-1">ROOT {String(root.id).padStart(2, '0')} — {root.title}</p>
              <p className="text-xs font-semibold text-red-400 mb-1.5">{qMeta.label}</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{getQuestionText(qMeta.key)}</p>
            </div>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Answer from memory — no assistance..."
              rows={7}
              className="w-full resize-none bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200
                placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
            />
            <button
              onClick={submitAnswer}
              disabled={!answer.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                bg-red-900/60 hover:bg-red-800/70 disabled:bg-zinc-700 disabled:text-zinc-500
                text-red-200 font-medium text-sm transition-colors">
              Submit Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}