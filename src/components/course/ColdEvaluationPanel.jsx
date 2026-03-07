import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, BookOpen, RotateCcw, ArrowRight, Check, X } from 'lucide-react';

const EVAL_PHRASES = [
  "Reading your response...",
  "Checking against mastery criteria...",
  "Finalizing evaluation...",
];

const MIN_EVAL_MS = 4500;

// Parse the structured JSON from the AI cold evaluation response
function parseEvalResult(raw) {
  try {
    // The AI returns JSON — find the JSON block
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  // Fallback parse: look for [PASS] or [FAIL]
  const passed = raw.includes('[PASS]');
  return {
    passed,
    criteria_results: [],
    narrative: raw.replace(/\[PASS\]|\[FAIL\]/g, '').trim(),
  };
}

export default function ColdEvaluationPanel({
  isEvaluating,      // bool — AI request in flight
  evalResult,        // raw string from AI (or null)
  questionType,      // 'root' | 'branch_1' etc.
  attemptNumber,     // int
  onDismiss,         // (passed: bool) => void — close panel, update state
  onTryAgain,        // () => void
  onTeachMe,         // () => void
}) {
  const [phase, setPhase] = useState('animating'); // 'animating' | 'results'
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [parsed, setParsed] = useState(null);
  const startTimeRef = useRef(Date.now());
  const resultReadyRef = useRef(false);
  const timerRef = useRef(null);

  // Advance phrases every 1.5s
  useEffect(() => {
    if (phase !== 'animating') return;
    const iv = setInterval(() => {
      setPhraseIndex(i => (i + 1) % EVAL_PHRASES.length);
    }, 1500);
    return () => clearInterval(iv);
  }, [phase]);

  // When evalResult arrives, wait for minimum time then show results
  useEffect(() => {
    if (!evalResult) return;
    resultReadyRef.current = true;
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, MIN_EVAL_MS - elapsed);
    timerRef.current = setTimeout(() => {
      setParsed(parseEvalResult(evalResult));
      setPhase('results');
    }, remaining);
    return () => clearTimeout(timerRef.current);
  }, [evalResult]);

  const totalCriteria = questionType === 'root' ? 4 : 3;
  const passed = parsed?.passed ?? false;
  const metCount = parsed?.criteria_results?.filter(c => c.met).length ?? 0;

  if (phase === 'animating') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12 px-6">
        {/* Pulsing dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <p className="text-sm text-zinc-400 text-center transition-all duration-500">
          {EVAL_PHRASES[phraseIndex]}
        </p>
        {attemptNumber > 1 && (
          <p className="text-xs text-zinc-600">Attempt {attemptNumber}</p>
        )}
      </div>
    );
  }

  // Results phase
  return (
    <div className="flex flex-col gap-5 p-5 md:p-6">
      {/* Pass / Fail badge */}
      <div className="flex flex-col items-center gap-2 py-4">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center
            ${passed ? 'bg-emerald-950/60 border-2 border-emerald-500' : 'bg-red-950/60 border-2 border-red-500'}
            animate-[scale-in_0.3s_ease-out]`}
          style={{ animation: 'scaleIn 0.35s cubic-bezier(0.175,0.885,0.32,1.275) both' }}
        >
          {passed
            ? <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            : <XCircle className="w-8 h-8 text-red-400" />
          }
        </div>
        <span className={`text-xl font-bold ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
          {passed ? 'Pass' : 'Fail'}
        </span>
        <span className="text-sm text-zinc-500">
          {parsed?.criteria_results?.length > 0
            ? `${metCount} of ${totalCriteria} criteria met`
            : questionType === 'root' ? `Root question — ${totalCriteria} criteria` : `Branch question — ${totalCriteria} criteria`
          }
        </span>
        <span className="text-xs text-zinc-600">Attempt {attemptNumber}</span>
      </div>

      {/* Rubric breakdown */}
      {parsed?.criteria_results?.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Criteria Breakdown</p>
          {parsed.criteria_results.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5
                ${c.met ? 'bg-emerald-950/60 border border-emerald-700' : 'bg-red-950/60 border border-red-800'}`}>
                {c.met
                  ? <Check className="w-3 h-3 text-emerald-400" />
                  : <X className="w-3 h-3 text-red-400" />
                }
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Narrative */}
      {parsed?.narrative && (
        <div className={`rounded-xl p-4 text-sm leading-relaxed border
          ${passed
            ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
            : 'bg-zinc-900 border-zinc-800 text-zinc-300'
          }`}>
          {parsed.narrative}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        {passed ? (
          <>
            <button
              onClick={() => onDismiss(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 
                hover:bg-emerald-500 text-white font-medium text-sm transition-colors"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onTeachMe}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-700 
                text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 text-sm transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Review</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onTryAgain}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-700 
                text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/60 font-medium text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={onTeachMe}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-800 
                hover:bg-zinc-700 text-zinc-200 font-medium text-sm transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Teach Me
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}