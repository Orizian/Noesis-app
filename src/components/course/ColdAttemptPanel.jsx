import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, BookOpen } from 'lucide-react';
import { getQualityTier } from '../profiles/profileStorage';
import { ROOTS, BRANCH_RUBRICS } from '../courseData';

function parseRubricCriteria(rubricStr) {
  const matches = [...rubricStr.matchAll(/Criterion\s+\d+:\s*(.+?)(?=Criterion\s+\d+:|$)/gi)];
  return matches.map(m => m[1].trim());
}

function getRubricForQuestion(root, questionType) {
  if (questionType === 'root') return root.rubric;
  return BRANCH_RUBRICS[root.id]?.[questionType] || root.rubric;
}

const EVAL_STAGES = [
  { text: 'Reading your response...', duration: 1500 },
  { text: 'Checking against mastery criteria...', duration: 1500 },
  { text: 'Finalizing evaluation...', duration: 2000 },
];

// Parse evaluation, always rendering all rubric criteria rows
function parseEvaluation(text, rubricCriteria) {
  const passed = text.includes('[PASS]');
  const criteriaMatches = [...text.matchAll(/\[(CRITERIA:(met|unmet))\]\s*(.+)/gi)];
  const aiCriteria = criteriaMatches.map(m => ({ met: m[2].toLowerCase() === 'met', text: m[3].trim() }));

  // Always render one row per rubric criterion; fill from AI results, fallback if missing
  const rows = rubricCriteria.map((criterionText, i) => {
    if (i < aiCriteria.length) {
      return { met: aiCriteria[i].met, text: criterionText, evaluated: true };
    }
    return { met: false, text: criterionText, evaluated: false };
  });

  const metCount = rows.filter(r => r.evaluated && r.met).length;
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

const TIER_CONFIG = {
  excellent: { label: 'Excellent', className: 'bg-violet-950/60 border-violet-700 text-violet-300' },
  great:     { label: 'Great',     className: 'bg-teal-950/60 border-teal-700 text-teal-300' },
  pass:      { label: 'Pass',      className: 'bg-emerald-950/60 border-emerald-700 text-emerald-300' },
  incomplete:{ label: 'Incomplete',className: 'bg-zinc-800/60 border-zinc-700 text-zinc-500' },
};

export default function ColdAttemptPanel({
  result,
  root,
  questionType,
  attemptNumber,
  onContinue,
  onRetry,
  onTeachMe,
}) {
  const [stage, setStage] = useState(0); // 0,1,2 = loading stages; 3 = reveal
  const [revealed, setRevealed] = useState(false);
  const timerDone = useRef(false);
  const resultReady = useRef(false);
  const startTime = useRef(Date.now());

  const MIN_DURATION = 5000;

  useEffect(() => {
    let elapsed = 0;
    const stageTimers = [];
    EVAL_STAGES.forEach((s, i) => {
      const delay = elapsed;
      stageTimers.push(setTimeout(() => setStage(i), delay));
      elapsed += s.duration;
    });
    const doneTimer = setTimeout(() => {
      timerDone.current = true;
      if (resultReady.current) setRevealed(true);
    }, MIN_DURATION);
    stageTimers.push(doneTimer);
    return () => stageTimers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (result) {
      resultReady.current = true;
      if (timerDone.current) setRevealed(true);
    }
  }, [result]);

  const isRoot = questionType === 'root';

  // Build rubric criteria array from courseData
  const rubricStr = root ? getRubricForQuestion(root, questionType) : '';
  const rubricCriteria = rubricStr ? parseRubricCriteria(rubricStr) : [];
  const totalCriteria = isRoot ? 4 : 3;

  const parsed = result ? parseEvaluation(result, rubricCriteria.length > 0 ? rubricCriteria : Array(totalCriteria).fill('')) : null;
  const metCount = parsed?.metCount ?? 0;

  const tier = parsed ? getQualityTier(metCount, isRoot) : null;
  const tierConfig = tier ? TIER_CONFIG[tier] : null;

  if (!revealed || !parsed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] py-12">
        <div className="w-12 h-12 rounded-full border-2 border-zinc-700 flex items-center justify-center mb-8">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <p className="text-zinc-300 text-base font-medium text-center animate-pulse transition-all duration-500">
          {EVAL_STAGES[Math.min(stage, EVAL_STAGES.length - 1)].text}
        </p>
        <div className="flex gap-1.5 mt-6">
          {EVAL_STAGES.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i <= stage ? 'bg-emerald-600' : 'bg-zinc-700'}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-1 space-y-6 animate-in fade-in duration-500">
      {/* Pass/Fail badge + Quality Tier */}
      <div className="flex flex-col items-center gap-3">
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border text-lg font-bold
          transition-all duration-500 scale-100
          ${parsed.passed
            ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
            : 'bg-red-950/60 border-red-800 text-red-300'
          }`}>
          {parsed.passed
            ? <CheckCircle2 className="w-6 h-6" />
            : <XCircle className="w-6 h-6" />
          }
          {parsed.passed ? 'PASS' : 'FAIL'}
        </div>
        {/* Quality tier badge */}
        {tierConfig && (
          <div className={`px-4 py-1.5 rounded-xl border text-sm font-semibold ${tierConfig.className}`}>
            {tierConfig.label}
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">{metCount} of {totalCriteria} criteria met</span>
          <span className="text-xs text-zinc-600">· Attempt {attemptNumber}</span>
        </div>
      </div>

      {/* Criteria breakdown — always render all rubric rows */}
      {parsed.rows && parsed.rows.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Rubric Breakdown</p>
          {parsed.rows.map((c, i) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl border
              ${!c.evaluated
                ? 'bg-zinc-800/30 border-zinc-700/40'
                : c.met
                  ? 'bg-emerald-950/20 border-emerald-900/40'
                  : 'bg-red-950/20 border-red-900/40'
              }`}>
              {!c.evaluated
                ? <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-zinc-600 text-xs font-bold">?</span>
                : c.met
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              }
              <span className={`text-sm leading-relaxed ${!c.evaluated ? 'text-zinc-600' : c.met ? 'text-zinc-300' : 'text-zinc-400'}`}>
                {c.text}
                {!c.evaluated && <span className="block text-xs text-zinc-600 mt-0.5">Not evaluated — please resubmit.</span>}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Narrative */}
      {parsed.narrative && (
        <div className={`px-4 py-4 rounded-xl border text-sm leading-relaxed
          ${parsed.passed
            ? 'bg-zinc-800/40 border-zinc-700/50 text-zinc-300'
            : 'bg-zinc-800/40 border-zinc-700/50 text-zinc-400'
          }`}>
          {parsed.narrative}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {parsed.passed ? (
          <>
            <button
              onClick={onContinue}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onTeachMe}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Review in Teach Me
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <button
              onClick={onTeachMe}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Back to Teach Me
            </button>
          </>
        )}
      </div>
    </div>
  );
}