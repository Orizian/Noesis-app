import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, BookOpen } from 'lucide-react';

const EVAL_STAGES = [
  { text: 'Reading your response...', duration: 1500 },
  { text: 'Checking against mastery criteria...', duration: 1500 },
  { text: 'Finalizing evaluation...', duration: 2000 },
];

// Parse [RUBRIC_BREAKDOWN] from AI response
// Expected AI format in response:
// [CRITERIA:met] criterion text
// [CRITERIA:unmet] criterion text
// [NARRATIVE] narrative text
// [PASS] or [FAIL]
function parseEvaluation(text) {
  const passed = text.includes('[PASS]');
  const criteriaMatches = [...text.matchAll(/\[(CRITERIA:(met|unmet))\]\s*(.+)/gi)];
  const criteria = criteriaMatches.map(m => ({
    met: m[2].toLowerCase() === 'met',
    text: m[3].trim(),
  }));
  const narrativeMatch = text.match(/\[NARRATIVE\]\s*([\s\S]+?)(?=\[CRITERIA|$)/i);
  let narrative = narrativeMatch ? narrativeMatch[1].trim() : '';
  // Fallback: strip all tags and use remainder as narrative
  if (!narrative) {
    narrative = text
      .replace(/\[PASS\]/gi, '').replace(/\[FAIL\]/gi, '')
      .replace(/\[(CRITERIA:(met|unmet))\]\s*.+/gi, '')
      .replace(/\[NARRATIVE\]/gi, '')
      .trim();
  }
  return { passed, criteria, narrative };
}

export default function ColdAttemptPanel({
  result,
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
  const totalCriteria = isRoot ? 4 : 3;

  const parsed = result ? parseEvaluation(result) : null;
  const metCount = parsed?.criteria?.length
    ? parsed.criteria.filter(c => c.met).length
    : (parsed?.passed ? totalCriteria : 0);

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
      {/* Pass/Fail badge */}
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">{metCount} of {totalCriteria} criteria met</span>
          <span className="text-xs text-zinc-600">· Attempt {attemptNumber}</span>
        </div>
      </div>

      {/* Criteria breakdown */}
      {parsed.criteria.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Rubric Breakdown</p>
          {parsed.criteria.map((c, i) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl border
              ${c.met
                ? 'bg-emerald-950/20 border-emerald-900/40'
                : 'bg-red-950/20 border-red-900/40'
              }`}>
              {c.met
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              }
              <span className={`text-sm leading-relaxed ${c.met ? 'text-zinc-300' : 'text-zinc-400'}`}>{c.text}</span>
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