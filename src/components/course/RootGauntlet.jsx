import React, { useState } from 'react';
import { Swords, CheckCircle2, XCircle, ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { BRANCH_RUBRICS } from '../courseData';
import { useProfile } from '../profiles/ProfileContext';
import {
  isGauntletEligible,
  setGauntletCriteriaBulk,
  getGauntletCriteria,
  getGauntletRootPoints,
  isRootPerfected,
  getQualityTier,
} from '../profiles/profileStorage';
import { format } from 'date-fns';

const QUESTIONS = [
  { key: 'root', label: 'Root Question', maxCriteria: 4 },
  { key: 'branch_1', label: 'Branch 1', maxCriteria: 3 },
  { key: 'branch_2', label: 'Branch 2', maxCriteria: 3 },
  { key: 'branch_3', label: 'Branch 3', maxCriteria: 3 },
];

const EVAL_STAGES = [
  { text: 'Reading your response...', duration: 1500 },
  { text: 'Checking against mastery criteria...', duration: 1500 },
  { text: 'Finalizing evaluation...', duration: 2000 },
];

const TIER_CONFIG = {
  excellent: { label: 'Excellent', className: 'bg-violet-950/60 border-violet-700 text-violet-300' },
  great:     { label: 'Great',     className: 'bg-teal-950/60 border-teal-700 text-teal-300' },
  pass:      { label: 'Pass',      className: 'bg-emerald-950/60 border-emerald-700 text-emerald-300' },
  incomplete:{ label: 'Incomplete',className: 'bg-zinc-800/60 border-zinc-700 text-zinc-500' },
};

function getGauntletBarColor(pts) {
  if (pts <= 3) return 'bg-zinc-600';
  if (pts <= 8) return 'bg-emerald-500';
  if (pts <= 12) return 'bg-teal-500';
  return 'bg-violet-500';
}

function parseRubricCriteria(rubricStr) {
  const matches = [...rubricStr.matchAll(/Criterion\s+\d+:\s*(.+?)(?=Criterion\s+\d+:|$)/gi)];
  return matches.map(m => m[1].trim());
}

function parseEvaluation(text, rubricCriteria) {
  const passed = text.includes('[PASS]');
  const criteriaMatches = [...text.matchAll(/\[(CRITERIA:(met|unmet))\]\s*(.+)/gi)];
  const aiCriteria = criteriaMatches.map(m => ({ met: m[2].toLowerCase() === 'met', text: m[3].trim() }));

  // Always render all rubric criteria rows; fill from AI results, fallback if missing
  const rows = rubricCriteria.map((criterionText, i) => {
    if (i < aiCriteria.length) {
      return { met: aiCriteria[i].met, text: criterionText, evaluated: true };
    }
    return { met: false, text: criterionText, evaluated: false };
  });

  const metCount = rows.filter(r => r.met).length;
  const narrativeMatch = text.match(/\[NARRATIVE\]\s*([\s\S]+?)(?=\[CRITERIA|$)/i);
  let narrative = narrativeMatch ? narrativeMatch[1].trim() : '';
  if (!narrative) {
    narrative = text
      .replace(/\[PASS\]/gi, '').replace(/\[FAIL\]/gi, '')
      .replace(/\[(CRITERIA:(met|unmet))\]\s*.+/gi, '')
      .replace(/\[NARRATIVE\]/gi, '').trim();
  }
  return { passed, rows, metCount, narrative };
}

function EvalLoader({ stage }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 min-h-[240px]">
      <div className="w-12 h-12 rounded-full border-2 border-zinc-700 flex items-center justify-center mb-8">
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      <p className="text-zinc-300 text-base font-medium animate-pulse">
        {EVAL_STAGES[Math.min(stage, EVAL_STAGES.length - 1)].text}
      </p>
      <div className="flex gap-1.5 mt-6">
        {EVAL_STAGES.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i <= stage ? 'bg-emerald-600' : 'bg-zinc-700'}`} />
        ))}
      </div>
    </div>
  );
}

function QuestionResult({ result, questionMeta, onContinue, isLast }) {
  const { rows, metCount, narrative, passed } = result;
  const tier = getQualityTier(metCount, questionMeta.key === 'root');
  const tierConfig = TIER_CONFIG[tier];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-2">
        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-base font-bold
          ${passed ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300' : 'bg-red-950/60 border-red-800 text-red-300'}`}>
          {passed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {passed ? 'PASS' : 'FAIL'}
        </div>
        {tierConfig && (
          <div className={`px-3 py-1 rounded-xl border text-sm font-semibold ${tierConfig.className}`}>
            {tierConfig.label}
          </div>
        )}
        <span className="text-sm text-zinc-400">{metCount} of {questionMeta.maxCriteria} criteria met</span>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Rubric Breakdown</p>
        {rows.map((r, i) => (
          <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl border
            ${!r.evaluated ? 'bg-zinc-800/30 border-zinc-700/40' :
              r.met ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-red-950/20 border-red-900/40'}`}>
            {!r.evaluated
              ? <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-zinc-600 text-xs">?</span>
              : r.met
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            }
            <span className={`text-sm leading-relaxed ${!r.evaluated ? 'text-zinc-600' : r.met ? 'text-zinc-300' : 'text-zinc-400'}`}>
              {r.text}
              {!r.evaluated && <span className="block text-xs text-zinc-600 mt-0.5">Not evaluated — please resubmit.</span>}
            </span>
          </div>
        ))}
      </div>

      {narrative && (
        <div className="px-4 py-3 rounded-xl border bg-zinc-800/40 border-zinc-700/50 text-sm text-zinc-400 leading-relaxed">
          {narrative}
        </div>
      )}

      <button
        onClick={onContinue}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
      >
        {isLast ? 'See Gauntlet Results' : 'Next Question'} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function RootGauntlet({ root, profileId, onGauntletComplete }) {
  const { refresh } = useProfile();
  const [phase, setPhase] = useState('idle'); // idle | caution | active | evaluating | results | summary
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evalStage, setEvalStage] = useState(0);
  const [evalResult, setEvalResult] = useState(null);
  const [revealResult, setRevealResult] = useState(false);
  const [questionResults, setQuestionResults] = useState([]); // [{metCount, passed, tier}]

  const eligible = profileId ? isGauntletEligible(profileId, root.id) : false;
  const perfected = profileId ? isRootPerfected(profileId, root.id) : false;
  const gc = profileId ? getGauntletCriteria(profileId, root.id) : { root: 0, branch_1: 0, branch_2: 0, branch_3: 0 };
  const gauntletPoints = (gc.root || 0) + (gc.branch_1 || 0) + (gc.branch_2 || 0) + (gc.branch_3 || 0);

  const getQuestion = (qKey) => {
    if (qKey === 'root') return root.rootQuestion;
    const idx = parseInt(qKey.split('_')[1]) - 1;
    return root.branches[idx]?.question || root.rootQuestion;
  };

  const getRubric = (qKey) => {
    if (qKey === 'root') return root.rubric;
    return BRANCH_RUBRICS[root.id]?.[qKey] || root.rubric;
  };

  const startGauntlet = () => {
    setPhase('active');
    setCurrentQ(0);
    setAnswer('');
    setQuestionResults([]);
    setEvalResult(null);
    setRevealResult(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    const qMeta = QUESTIONS[currentQ];
    const rubricStr = getRubric(qMeta.key);
    const rubricCriteria = parseRubricCriteria(rubricStr);
    const totalCrit = qMeta.maxCriteria;

    setPhase('evaluating');
    setEvalStage(0);
    setEvalResult(null);
    setRevealResult(false);

    // Stage timers
    let elapsed = 0;
    const stageTimers = [];
    EVAL_STAGES.forEach((s, i) => {
      stageTimers.push(setTimeout(() => setEvalStage(i), elapsed));
      elapsed += s.duration;
    });

    // Track min 5s display time
    let timerDone = false;
    let pendingResult = null;
    const minTimer = setTimeout(() => {
      timerDone = true;
      if (pendingResult) setRevealResult(true);
    }, 5000);

    const strictInstructions = `Evaluate each criterion as a strict binary — met or not met. A criterion is met only if the answer explicitly and specifically demonstrates the required mechanism, prediction, or connection stated in that criterion. General correctness, directional accuracy, and implied understanding do not satisfy a criterion. You must be able to point to a specific sentence or phrase in the answer that satisfies the criterion. If you cannot, the criterion is not met. Do not be generous. Do not infer. Do not reward effort or length. Evaluate only what is explicitly present.`;

    const prompt = `You are evaluating a cold assessment answer for Root ${root.id}: "${root.title}".
Question (${qMeta.label}): "${getQuestion(qMeta.key)}"

${strictInstructions}

This rubric has exactly ${totalCrit} criteria. Evaluate ALL ${totalCrit} — no more, no fewer.

COLD ATTEMPT PROTOCOL — CRITICAL FORMAT:
First: [PASS] or [FAIL] based on whether the majority of criteria are met.
Then list EXACTLY ${totalCrit} criteria using this format, one per line:
[CRITERIA:met] Plain English criterion description
[CRITERIA:unmet] Plain English criterion description
Then: [NARRATIVE] 2-4 sentence assessment.

Criteria to evaluate (convert to plain English, do not copy verbatim):
${rubricStr}

Student answer: "${answer}"`;

    const response = await base44.integrations.Core.InvokeLLM({ prompt });
    stageTimers.forEach(clearTimeout);

    const parsed = parseEvaluation(response, rubricCriteria);
    const metCount = parsed.metCount;
    const isRootQ = qMeta.key === 'root';
    const tier = getQualityTier(metCount, isRootQ);
    const passed = response.includes('[PASS]');

    const newResult = { metCount, passed, tier, rows: parsed.rows, narrative: parsed.narrative };
    setQuestionResults(prev => [...prev, newResult]);
    setEvalResult(newResult);
    pendingResult = newResult;

    if (timerDone) {
      clearTimeout(minTimer);
      setRevealResult(true);
    }
    // else minTimer will trigger reveal
  };

  const handleContinue = (updatedResults) => {
    const results = updatedResults || questionResults;
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
      setAnswer('');
      setEvalResult(null);
      setRevealResult(false);
      setPhase('active');
    } else {
      // Save gauntlet results
      const bulk = {};
      results.forEach((r, i) => {
        if (QUESTIONS[i]) bulk[QUESTIONS[i].key] = r.metCount;
      });
      if (profileId) {
        setGauntletCriteriaBulk(profileId, root.id, bulk);
        refresh();
      }
      setPhase('summary');
      if (onGauntletComplete) onGauntletComplete();
    }
  };

  const totalScore = questionResults.reduce((sum, r) => sum + r.metCount, 0);
  const barColor = getGauntletBarColor(totalScore);
  const allPassed = questionResults.length === 4 && questionResults.every(r => r.passed);

  // ── IDLE — not eligible
  if (!eligible) {
    return (
      <div className="mt-4 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40 text-center">
        <p className="text-xs text-zinc-600">
          <Swords className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          Root Gauntlet — Complete all 4 cold attempts first
        </p>
      </div>
    );
  }

  // ── IDLE — eligible
  if (phase === 'idle') {
    return (
      <div className="mt-4">
        <button
          onClick={() => setPhase('caution')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl 
            bg-amber-950/30 hover:bg-amber-950/50 border border-amber-800/50 
            text-amber-400 font-medium text-sm transition-colors"
        >
          <Swords className="w-4 h-4" />
          Root Gauntlet — Take the full root in one sitting
          {perfected && <span className="ml-2 text-violet-400 text-xs font-semibold">Perfected</span>}
        </button>
        {gauntletPoints > 0 && (
          <div className="mt-2 px-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-zinc-500">Best Gauntlet Score</span>
              <span className="text-xs font-mono text-zinc-400">{gauntletPoints} / 13</span>
            </div>
            <div className="relative h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full rounded-full transition-all ${getGauntletBarColor(gauntletPoints)}`}
                style={{ width: `${(gauntletPoints / 13) * 100}%` }}
              />
              {[4, 9].map(tick => (
                <div key={tick} className="absolute top-[-2px] bottom-[-2px] w-px bg-zinc-600 z-10"
                  style={{ left: `${(tick / 13) * 100}%` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── CAUTION SCREEN
  if (phase === 'caution') {
    return (
      <div className="mt-4 border border-amber-800/40 rounded-xl bg-amber-950/10 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-semibold text-amber-300">Root Gauntlet: {root.title}</h3>
        </div>
        <div className="space-y-2 text-sm text-zinc-400">
          <p>Answer all 4 questions back to back.</p>
          <p>No assistance. No skipping. No returning to a previous answer once submitted.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={startGauntlet}
            className="flex-1 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-medium text-sm transition-colors">
            Begin
          </button>
          <button onClick={() => setPhase('idle')}
            className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── EVALUATING / RESULT
  if (phase === 'evaluating') {
    if (!revealResult || !evalResult) {
      return (
        <div className="mt-4 border border-zinc-800 rounded-xl bg-zinc-900/60 overflow-hidden">
          <GauntletProgressBar current={currentQ} total={4} />
          <div className="p-6">
            <EvalLoader stage={evalStage} />
          </div>
        </div>
      );
    }
    return (
      <div className="mt-4 border border-zinc-800 rounded-xl bg-zinc-900/60 overflow-hidden">
        <GauntletProgressBar current={currentQ} total={4} />
        <div className="p-6">
          <QuestionResult
            result={evalResult}
            questionMeta={QUESTIONS[currentQ]}
            onContinue={handleContinue}
            isLast={currentQ === QUESTIONS.length - 1}
          />
        </div>
      </div>
    );
  }

  // ── ACTIVE — answer input
  if (phase === 'active') {
    const qMeta = QUESTIONS[currentQ];
    const question = getQuestion(qMeta.key);
    return (
      <div className="mt-4 border border-zinc-800 rounded-xl bg-zinc-900/60 overflow-hidden">
        <GauntletProgressBar current={currentQ} total={4} />
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-amber-400 mb-1">{qMeta.label}</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{question}</p>
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
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-800/60 hover:bg-red-800/80
              disabled:bg-zinc-700 disabled:text-zinc-500 text-red-200 font-medium text-sm transition-colors"
          >
            Submit Answer
          </button>
        </div>
      </div>
    );
  }

  // ── SUMMARY
  if (phase === 'summary') {
    const perfectedNow = totalScore === 13;
    const completedDate = format(new Date(), 'MMM d, yyyy');
    return (
      <div className="mt-4 border border-zinc-800 rounded-xl bg-zinc-900/60 overflow-hidden">
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-zinc-200">Gauntlet Summary</h3>
          </div>

          {/* Per-question results */}
          <div className="space-y-2">
            {questionResults.map((r, i) => {
              const tier = getQualityTier(r.metCount, QUESTIONS[i].key === 'root');
              const cfg = TIER_CONFIG[tier] || TIER_CONFIG.incomplete;
              return (
                <div key={i} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-zinc-800/50">
                  <div className="flex items-center gap-2">
                    {r.passed
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    }
                    <span className="text-sm text-zinc-400">{QUESTIONS[i].label}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.className}`}>{cfg.label}</span>
                </div>
              );
            })}
          </div>

          {/* Total score bar */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-xs text-zinc-500">Total Score</span>
              <span className="text-xs font-mono text-zinc-400">{totalScore} / 13</span>
            </div>
            <div className="relative h-2 bg-zinc-800 rounded-full overflow-visible">
              <div
                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${(totalScore / 13) * 100}%` }}
              />
              {[4, 9, 13].map(tick => (
                <div key={tick} className="absolute top-[-3px] bottom-[-3px] w-px bg-zinc-600 z-10"
                  style={{ left: `${(tick / 13) * 100}%` }} />
              ))}
            </div>
          </div>

          {/* Pass / fail summary */}
          <div className="text-center">
            {perfectedNow ? (
              <p className="text-violet-300 font-bold text-base">✦ Perfected — {completedDate}</p>
            ) : allPassed ? (
              <p className="text-amber-400 font-semibold">Root Gauntlet Passed — {completedDate}</p>
            ) : (
              <div>
                <p className="text-zinc-400 text-sm mb-1">Failed questions:</p>
                {questionResults.map((r, i) => !r.passed && (
                  <p key={i} className="text-red-400 text-sm">{QUESTIONS[i].label}</p>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => { setPhase('idle'); }}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function GauntletProgressBar({ current, total }) {
  const pct = ((current) / total) * 100;
  return (
    <div className="border-b border-zinc-800">
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs font-medium text-amber-400">Question {current + 1} of {total}</span>
      </div>
      <div className="h-1 bg-zinc-800">
        <div
          className="h-full bg-amber-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}