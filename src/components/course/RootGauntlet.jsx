import React, { useState, useRef } from 'react';
// NOTE: RootGauntletFlow has been moved to RootGauntletFlow.jsx
// This file is kept for the evaluateAnswer export used by other components
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCourse } from './CourseContext';
import {
  getQualityTier,
  setGauntletCriteriaBulk,
  setGauntletPassedDate,
  isRootGauntletPassed,
  getGauntletPassedDate,
  getGauntletRootPoints,
  getGauntletCriteria,
} from '../profiles/profileStorage';
import { format } from 'date-fns';


export const GAUNTLET_QUESTIONS = [
  { key: 'root',     label: 'Root Question', maxCriteria: 4 },
  { key: 'branch_1', label: 'Branch 1',      maxCriteria: 3 },
  { key: 'branch_2', label: 'Branch 2',      maxCriteria: 3 },
  { key: 'branch_3', label: 'Branch 3',      maxCriteria: 3 },
];

const EVAL_PHASES = [
  'Reading your response...',
  'Checking against mastery criteria...',
  'Finalizing evaluation...',
];

const TIER_CONFIG = {
  excellent:  { label: 'Excellent',  className: 'bg-violet-950/60 border-violet-700 text-violet-300' },
  great:      { label: 'Great',      className: 'bg-teal-950/60 border-teal-700 text-teal-300' },
  pass:       { label: 'Pass',       className: 'bg-emerald-950/60 border-emerald-700 text-emerald-300' },
  incomplete: { label: 'Incomplete', className: 'bg-zinc-800/60 border-zinc-700 text-zinc-500' },
};

function getBarColor(pts, max) {
  const pct = pts / max;
  if (pct < 0.31) return 'bg-zinc-500';
  if (pct < 0.62) return 'bg-emerald-500';
  if (pct < 0.93) return 'bg-teal-500';
  return 'bg-violet-500';
}

function parseRubricCriteria(rubricStr) {
  const matches = [...rubricStr.matchAll(/Criterion\s+\d+:\s*(.+?)(?=Criterion\s+\d+:|$)/gi)];
  return matches.map(m => m[1].trim());
}

function parseEvaluation(text, rubricCriteria) {
  const criteriaMatches = [...text.matchAll(/\[(CRITERIA:(met|unmet))\]\s*(.+)/gi)];
  const aiCriteria = criteriaMatches.map(m => ({ met: m[2].toLowerCase() === 'met', text: m[3].trim() }));
  const rows = rubricCriteria.map((criterionText, i) => {
    if (i < aiCriteria.length) return { met: aiCriteria[i].met, text: criterionText, evaluated: true };
    return { met: false, text: criterionText, evaluated: false };
  });
  const metCount = rows.filter(r => r.met).length;
  const narrativeMatch = text.match(/\[NARRATIVE\]\s*([\s\S]+?)(?=\[CRITERIA|$)/i);
  let narrative = narrativeMatch ? narrativeMatch[1].trim() : text
    .replace(/\[PASS\]/gi, '').replace(/\[FAIL\]/gi, '')
    .replace(/\[(CRITERIA:(met|unmet))\]\s*.+/gi, '')
    .replace(/\[NARRATIVE\]/gi, '').trim();
  return { rows, metCount, narrative };
}

function ProgressBar({ current, total }) {
  return (
    <div className="border-b border-zinc-800">
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-xs font-semibold text-amber-400 tracking-wide">Question {current + 1} of {total}</span>
      </div>
      <div className="h-1 bg-zinc-800">
        <div className="h-full bg-amber-600 transition-all duration-500" style={{ width: `${(current / total) * 100}%` }} />
      </div>
    </div>
  );
}

function EvalLoader({ phaseIdx }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 min-h-[220px]">
      <div className="w-10 h-10 rounded-full border-2 border-zinc-700 flex items-center justify-center mb-6">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
      </div>
      <p className="text-zinc-300 text-sm font-medium animate-pulse">{EVAL_PHASES[Math.min(phaseIdx, 2)]}</p>
      <div className="flex gap-1.5 mt-5">
        {EVAL_PHASES.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i <= phaseIdx ? 'bg-amber-600' : 'bg-zinc-700'}`} />
        ))}
      </div>
    </div>
  );
}

function ResultPanel({ result, qMeta, onContinue, continueLabel }) {
  const tier = getQualityTier(result.metCount, qMeta.key === 'root');
  const tierCfg = TIER_CONFIG[tier];
  const passed = result.passed;
  return (
    <div className="space-y-4 animate-in fade-in duration-400">
      <div className="flex flex-col items-center gap-2">
        <div className={`flex items-center gap-2 px-5 py-2 rounded-2xl border text-sm font-bold
          ${passed ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300' : 'bg-red-950/60 border-red-800 text-red-300'}`}>
          {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {passed ? 'PASS' : 'FAIL'}
        </div>
        <span className={`text-xs px-3 py-1 rounded-xl border font-semibold ${tierCfg.className}`}>{tierCfg.label}</span>
        <span className="text-xs text-zinc-500">{result.metCount} of {qMeta.maxCriteria} criteria met</span>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Rubric</p>
        {result.rows.map((r, i) => (
          <div key={i} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border text-sm leading-relaxed
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
      {result.narrative && (
        <div className="px-4 py-3 rounded-xl border bg-zinc-800/40 border-zinc-700/50 text-sm text-zinc-400 leading-relaxed">
          {result.narrative}
        </div>
      )}
      <button onClick={onContinue}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-sm transition-colors">
        {continueLabel} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Main exported hook-based evaluator ────────────────────────────────────────
// Exported so AbsoluteGauntlet can reuse evaluation logic
export async function evaluateAnswer({ root, qMeta, answer, branchRubrics = {} }) {
  const getRubric = (key) => key === 'root' ? root.rubric : (branchRubrics[root.id]?.[key] || root.rubric);
  const getQuestion = (key) => {
    if (key === 'root') return root.rootQuestion;
    const idx = parseInt(key.split('_')[1]) - 1;
    return root.branches[idx]?.question || root.rootQuestion;
  };

  const rubricStr = getRubric(qMeta.key);
  const rubricCriteria = parseRubricCriteria(rubricStr);
  const totalCrit = qMeta.maxCriteria;

  const strictInstructions = `Evaluate each criterion as a strict binary — met or not met. A criterion is met only if the answer explicitly and specifically demonstrates the required mechanism, prediction, or connection stated in that criterion. General correctness, directional accuracy, and implied understanding do not satisfy a criterion. You must be able to point to a specific sentence or phrase in the answer that satisfies the criterion. If you cannot, the criterion is not met. Do not be generous. Do not infer. Do not reward effort or length. Evaluate only what is explicitly present.`;

  const prompt = `You are evaluating a gauntlet answer for Root ${root.id}: "${root.title}".
Question (${qMeta.label}): "${getQuestion(qMeta.key)}"

${strictInstructions}

This rubric has exactly ${totalCrit} criteria. Evaluate ALL ${totalCrit} — no more, no fewer.

GAUNTLET PROTOCOL — CRITICAL FORMAT:
First: [PASS] or [FAIL] based on whether the majority of criteria are met.
Then list EXACTLY ${totalCrit} criteria using this format, one per line:
[CRITERIA:met] Plain English criterion description
[CRITERIA:unmet] Plain English criterion description
Then: [NARRATIVE] 2-4 sentence assessment.

Criteria to evaluate (convert to plain English, do not copy verbatim):
${rubricStr}

Student answer: "${answer}"`;

  const response = await base44.integrations.Core.InvokeLLM({ prompt });
  const parsed = parseEvaluation(response, rubricCriteria);
  const passed = response.includes('[PASS]');
  return { ...parsed, passed };
}

// ── Root Gauntlet Flow component ───────────────────────────────────────────────
// Used inside RootGauntletPage
export default function RootGauntletFlow({ root, profileId, onComplete, onCancel }) {
  const { branchRubrics } = useCourse();
  const [phase, setPhase] = useState('caution'); // caution | active | evaluating | result | summary
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const evalTimers = useRef([]);

  const clearTimers = () => { evalTimers.current.forEach(clearTimeout); evalTimers.current = []; };

  const startGauntlet = () => {
    setCurrentQ(0);
    setAnswer('');
    setAllResults([]);
    setCurrentResult(null);
    setPhase('active');
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    const qMeta = GAUNTLET_QUESTIONS[currentQ];
    clearTimers();
    setPhase('evaluating');
    setPhaseIdx(0);
    setCurrentResult(null);

    // Phase animation timers
    evalTimers.current.push(setTimeout(() => setPhaseIdx(1), 1500));
    evalTimers.current.push(setTimeout(() => setPhaseIdx(2), 3000));

    // Run AI + enforce min 5s wait via Promise.all
    const minWait = new Promise(res => setTimeout(res, 5000));
    const evalPromise = evaluateAnswer({ root, qMeta, answer });
    const [result] = await Promise.all([evalPromise, minWait]);

    clearTimers();
    const newResults = [...allResults, result];
    setAllResults(newResults);
    setCurrentResult(result);
    setPhase('result');
  };

  const handleContinue = () => {
    if (currentQ < GAUNTLET_QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
      setAnswer('');
      setCurrentResult(null);
      setPhase('active');
    } else {
      // Save results
      const bulk = {};
      allResults.forEach((r, i) => { bulk[GAUNTLET_QUESTIONS[i].key] = r.metCount; });
      if (profileId) {
        setGauntletCriteriaBulk(profileId, root.id, bulk);
        const allPassed = allResults.every(r => r.passed);
        if (allPassed) setGauntletPassedDate(profileId, root.id, Date.now());
      }
      setPhase('summary');
    }
  };

  if (phase === 'caution') {
    return (
      <div className="border border-amber-800/40 rounded-2xl bg-amber-950/10 p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-amber-300 mb-1">Root Gauntlet — {root.title}</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Answer all 4 questions back to back. No assistance. No skipping. No returning to a previous answer once submitted.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={startGauntlet}
            className="flex-1 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-semibold text-sm transition-colors">
            Begin
          </button>
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'active') {
    const qMeta = GAUNTLET_QUESTIONS[currentQ];
    const getRootQuestion = (key) => {
      if (key === 'root') return root.rootQuestion;
      const idx = parseInt(key.split('_')[1]) - 1;
      return root.branches[idx]?.question || root.rootQuestion;
    };
    return (
      <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 overflow-hidden">
        <ProgressBar current={currentQ} total={4} />
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-amber-400 mb-1.5">{qMeta.label}</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{getRootQuestion(qMeta.key)}</p>
          </div>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Answer from memory — no assistance..."
            rows={6}
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
    );
  }

  if (phase === 'evaluating') {
    return (
      <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 overflow-hidden">
        <ProgressBar current={currentQ} total={4} />
        <div className="p-6"><EvalLoader phaseIdx={phaseIdx} /></div>
      </div>
    );
  }

  if (phase === 'result' && currentResult) {
    return (
      <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 overflow-hidden">
        <ProgressBar current={currentQ} total={4} />
        <div className="p-5">
          <ResultPanel
            result={currentResult}
            qMeta={GAUNTLET_QUESTIONS[currentQ]}
            onContinue={handleContinue}
            continueLabel={currentQ < 3 ? 'Next Question' : 'See Results'}
          />
        </div>
      </div>
    );
  }

  if (phase === 'summary') {
    const totalScore = allResults.reduce((s, r) => s + r.metCount, 0);
    const allPassed = allResults.every(r => r.passed);
    const completedDate = format(new Date(), 'MMM d, yyyy');
    return (
      <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 p-5 space-y-5">
        <h3 className="text-base font-bold text-zinc-200">Gauntlet Summary</h3>

        <div className="space-y-2">
          {allResults.map((r, i) => {
            const tier = getQualityTier(r.metCount, GAUNTLET_QUESTIONS[i].key === 'root');
            const cfg = TIER_CONFIG[tier];
            return (
              <div key={i} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-zinc-800/50">
                <div className="flex items-center gap-2">
                  {r.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  <span className="text-sm text-zinc-400">{GAUNTLET_QUESTIONS[i].label}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.className}`}>{cfg.label}</span>
              </div>
            );
          })}
        </div>

        {/* Score bar */}
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-xs text-zinc-500">Total Score</span>
            <span className="text-xs font-mono text-zinc-400">{totalScore} / 13</span>
          </div>
          <div className="relative h-2 bg-zinc-800 rounded-full overflow-visible">
            <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${getBarColor(totalScore, 13)}`}
              style={{ width: `${(totalScore / 13) * 100}%` }} />
            {[4, 9, 13].map(tick => (
              <div key={tick} className="absolute top-[-3px] bottom-[-3px] w-px bg-zinc-600 z-10"
                style={{ left: `${(tick / 13) * 100}%` }} />
            ))}
          </div>
        </div>

        <div className="text-center py-1">
          {allPassed
            ? <p className="text-amber-400 font-semibold text-base">Root Gauntlet Passed — {completedDate}</p>
            : <div className="space-y-1">
                <p className="text-zinc-400 text-sm">Failed questions:</p>
                {allResults.map((r, i) => !r.passed && (
                  <p key={i} className="text-red-400 text-sm">{GAUNTLET_QUESTIONS[i].label}</p>
                ))}
              </div>
          }
        </div>

        <button onClick={() => onComplete(allResults)}
          className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors">
          Return to Course Overview
        </button>
      </div>
    );
  }

  return null;
}