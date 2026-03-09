import React, { useState, useRef, useEffect } from 'react';
import { BookMarked, HelpCircle, X, ChevronRight, ArrowLeft, GraduationCap, Star, ChevronDown, Lock, Zap } from 'lucide-react';
import { DICTIONARY } from '../courseData';
import { base44 } from '@/api/base44Client';
import { useProfile } from '../profiles/ProfileContext';
import { getFlashcardTier, setFlashcardTier } from '../profiles/profileStorage';

export const TIER_CONFIG = {
  attempted: { label: 'Attempted', badgeClass: 'bg-zinc-800 border-zinc-700 text-zinc-500',       bigClass: 'bg-zinc-800 border-zinc-600 text-zinc-400' },
  pass:      { label: 'Pass',      badgeClass: 'bg-emerald-950/60 border-emerald-700 text-emerald-300', bigClass: 'bg-emerald-950/40 border-emerald-600 text-emerald-300' },
  great:     { label: 'Great',     badgeClass: 'bg-teal-950/60 border-teal-700 text-teal-300',     bigClass: 'bg-teal-950/40 border-teal-600 text-teal-300' },
  excellent: { label: 'Excellent', badgeClass: 'bg-violet-950/60 border-violet-700 text-violet-300', bigClass: 'bg-violet-950/40 border-violet-600 text-violet-200' },
};

const TIER_RUBRIC = [
  { tier: 'Attempted', className: 'text-zinc-500',    desc: 'Response does not contain a correct definition.' },
  { tier: 'Pass',      className: 'text-emerald-400', desc: 'Correct definition restated in your own words.' },
  { tier: 'Great',     className: 'text-teal-400',    desc: 'Correct definition plus functional explanation of practical use.' },
  { tier: 'Excellent', className: 'text-violet-400',  desc: 'Correct definition plus mechanistic causal chain — direction of causation, downstream consequences or what would change if absent.' },
];

const EVAL_PHRASES = [
  'Reading your definition...',
  'Checking depth of understanding...',
  'Finalizing evaluation...',
];

const FLASHCARD_PROMPT = (term, answer) => `You are evaluating a learner's understanding of a specific exercise science term.

Term: "${term.term}"
Definition: "${term.definition}"
Why it matters: "${term.why}"

The learner's response: "${answer}"

Evaluate ONLY against this term. No cross-concept knowledge expected.

There are four possible tiers. Evaluate strictly against these definitions and nothing else.

Attempted — the response does not contain a correct definition. This includes 'idk', 'I don't know', blank or near-blank responses, completely incorrect definitions, vague gestures at the topic without actually defining it, or any response that does not explicitly demonstrate understanding of what the term means. Do not award Pass for effort, length, or partial correctness. If a correct definition is not explicitly present it is Attempted.

Pass — correct definition restated in the student's own words. The core meaning of the term is accurately captured. Nothing more is required.

Great — correct definition plus functional explanation of what the term means in practice and how it is used in context.

Excellent — correct definition plus mechanistic causal chain that includes the direction of causation AND either downstream consequences OR what would change if the mechanism were absent or impaired. Both downstream consequences AND the absent condition are not required simultaneously — either one alongside direction of causation satisfies Excellent. Evaluate the understanding demonstrated not the vocabulary used. Do not require specific terminology if the concept is clearly demonstrated in plain language. Do not add requirements beyond what is stated here.

Return JSON with:
- tier: "attempted" | "pass" | "great" | "excellent"
- feedback: 1-2 sentences specific to this answer — what was present and what would elevate to the next tier (or confirm excellent)
- excellent_standard: 2-3 sentences describing what Excellent looks like for this specific term — the causal chain and what must be explained. Show structure not exact wording.`;

function TierLegend({ onClose }) {
  return (
    <div className="absolute right-0 top-8 z-30 w-72 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Flashcard Tiers</span>
        <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400"><X className="w-3.5 h-3.5" /></button>
      </div>
      <div className="space-y-3">
        {TIER_RUBRIC.map(t => (
          <div key={t.tier}>
            <span className={`text-xs font-semibold ${t.className}`}>{t.tier}</span>
            <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TierBadge({ tier, big }) {
  if (!tier) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-600 text-xs">—</span>;
  }
  const cfg = TIER_CONFIG[tier];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${big ? cfg.bigClass : cfg.badgeClass}`}>
      {cfg.label}
    </span>
  );
}

function RecommendedTag() {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  useEffect(() => {
    if (!showTooltip) return;
    const handler = (e) => { if (tooltipRef.current && !tooltipRef.current.contains(e.target)) setShowTooltip(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showTooltip]);
  return (
    <div className="flex items-center gap-2 mt-2.5 mb-0.5">
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-800/50 text-amber-400 text-xs font-medium">
        <Star className="w-3 h-3 fill-amber-400" />
        Recommended before questions
      </div>
      <div className="relative" ref={tooltipRef}>
        <button onClick={() => setShowTooltip(v => !v)} className="w-5 h-5 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors">
          <span className="text-xs font-semibold leading-none">?</span>
        </button>
        {showTooltip && (
          <div className="absolute left-0 top-7 z-40 w-72 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-zinc-300">Why complete vocabulary first?</span>
              <button onClick={() => setShowTooltip(false)} className="text-zinc-600 hover:text-zinc-400 flex-shrink-0"><X className="w-3.5 h-3.5" /></button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">Completing vocabulary first builds the foundation for the questions. Each term in this section appears directly in the root question and branch questions. Students who complete vocabulary before attempting questions score significantly higher on their first cold attempt.</p>
            <button onClick={() => setShowTooltip(false)} className="mt-3 w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-medium transition-colors">Got it</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared evaluation logic ───────────────────────────────────────────────────
async function runEvaluation(term, answer, profileId, rootId) {
  const minDelay = new Promise(res => setTimeout(res, 3000));
  const [resp] = await Promise.all([
    base44.integrations.Core.InvokeLLM({
      prompt: FLASHCARD_PROMPT(term, answer),
      response_json_schema: {
        type: 'object',
        properties: {
          tier: { type: 'string' },
          feedback: { type: 'string' },
          excellent_standard: { type: 'string' },
        },
      },
    }),
    minDelay,
  ]);
  const tier = ['attempted','pass','great','excellent'].includes(resp.tier) ? resp.tier : 'attempted';
  if (profileId) setFlashcardTier(profileId, rootId, term.term, tier);
  return { tier, feedback: resp.feedback || '', excellent_standard: resp.excellent_standard || '' };
}

// ── Eval loading animation ────────────────────────────────────────────────────
function EvalLoader({ phraseIndex }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 py-14">
      <div className="flex gap-2 mb-1">
        {[0,1,2].map(i => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= phraseIndex ? 'bg-zinc-300 scale-110' : 'bg-zinc-700'}`} />
        ))}
      </div>
      <p className="text-sm text-zinc-400 animate-pulse text-center">{EVAL_PHRASES[phraseIndex]}</p>
    </div>
  );
}

// ── Flashcard input screen ────────────────────────────────────────────────────
function FlashcardInputScreen({ term, termIndex, totalTerms, rootId, profileId, onResult, onBack }) {
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const phraseTimer = useRef(null);

  const handleSubmit = async () => {
    if (!answer.trim() || evaluating) return;
    setEvaluating(true);
    setPhraseIndex(0);
    let idx = 0;
    phraseTimer.current = setInterval(() => { idx = Math.min(idx + 1, 2); setPhraseIndex(idx); }, 1000);
    const result = await runEvaluation(term, answer, profileId, rootId);
    clearInterval(phraseTimer.current);
    onResult({ ...result, submittedAnswer: answer });
  };

  useEffect(() => () => clearInterval(phraseTimer.current), []);

  return (
    <div className="flex flex-col min-h-[360px]">
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Vocabulary
          </button>
          <span className="text-xs text-zinc-600 font-mono">Term {termIndex + 1} of {totalTerms}</span>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-zinc-500 rounded-full transition-all duration-300" style={{ width: `${((termIndex + 1) / totalTerms) * 100}%` }} />
        </div>
      </div>
      {evaluating ? <EvalLoader phraseIndex={phraseIndex} /> : (
        <div className="flex-1 flex flex-col px-5 pb-6">
          <p className="text-lg font-semibold text-zinc-100 mb-1 leading-snug">{term.term}</p>
          <p className="text-xs text-zinc-500 mb-3 mt-0.5">Define and explain:</p>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
            placeholder="Write your definition and explanation..."
            rows={5}
            className="w-full resize-none bg-zinc-900/80 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors mb-4 leading-relaxed"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600">⌘↵ to submit</span>
            <button onClick={handleSubmit} disabled={!answer.trim()}
              className="px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 text-sm font-semibold transition-colors">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Flashcard result screen ───────────────────────────────────────────────────
function FlashcardResultScreen({ term, termIndex, totalTerms, result, onTryAgain, onNext, isLast, nextLabel }) {
  const [showExcellent, setShowExcellent] = useState(false);
  const [animate, setAnimate] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setAnimate(true)); }, []);
  const tierCfg = TIER_CONFIG[result.tier] || TIER_CONFIG.attempted;
  return (
    <div className="flex flex-col px-5 py-5 min-h-[360px]">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-zinc-600 font-mono">Term {termIndex + 1} of {totalTerms}</span>
      </div>
      <p className="text-lg font-semibold text-zinc-100 mb-5 leading-snug">{term.term}</p>
      <div className="flex justify-center mb-5">
        <span className={`px-6 py-2 rounded-full border text-sm font-semibold transition-all duration-500 ${tierCfg.bigClass} ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          {tierCfg.label}
        </span>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed mb-5 text-center">{result.feedback}</p>
      {result.excellent_standard && result.tier !== 'excellent' && (
        <div className="mb-5">
          <button onClick={() => setShowExcellent(v => !v)} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-400 transition-colors">
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showExcellent ? 'rotate-90' : ''}`} />
            What Excellent looks like
          </button>
          {showExcellent && (
            <div className="mt-2 px-3 py-2.5 rounded-lg bg-violet-950/20 border border-violet-900/30">
              <p className="text-xs text-zinc-400 leading-relaxed">{result.excellent_standard}</p>
            </div>
          )}
        </div>
      )}
      <div className="mt-auto flex gap-3">
        <button onClick={onTryAgain} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors">
          Try Again
        </button>
        <button onClick={onNext} className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-semibold transition-colors">
          {nextLabel || (isLast ? 'Back to Vocabulary' : 'Next Term')}
        </button>
      </div>
    </div>
  );
}

// ── Gauntlet Result Screen (extracted to avoid hooks-in-conditionals) ────────
function GauntletResultScreen({ term, termIndex, totalTerms, result, onContinue }) {
  const [showExcellent, setShowExcellent] = useState(false);
  const [animate, setAnimate] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setAnimate(true)); }, []);
  const tierCfg = TIER_CONFIG[result.tier] || TIER_CONFIG.attempted;
  const isLast = termIndex === totalTerms - 1;
  return (
    <div className="flex flex-col px-5 py-5 min-h-[360px]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-500">Flashcard Gauntlet</span>
        <span className="text-xs text-zinc-600 font-mono">Term {termIndex + 1} of {totalTerms}</span>
      </div>
      <p className="text-lg font-semibold text-zinc-100 mb-5 leading-snug">{term.term}</p>
      <div className="flex justify-center mb-5">
        <span className={`px-6 py-2 rounded-full border text-sm font-semibold transition-all duration-500 ${tierCfg.bigClass} ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          {tierCfg.label}
        </span>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed mb-5 text-center">{result.feedback}</p>
      {result.excellent_standard && result.tier !== 'excellent' && (
        <div className="mb-5">
          <button onClick={() => setShowExcellent(v => !v)} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-400 transition-colors">
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showExcellent ? 'rotate-90' : ''}`} />
            What Excellent looks like
          </button>
          {showExcellent && (
            <div className="mt-2 px-3 py-2.5 rounded-lg bg-violet-950/20 border border-violet-900/30">
              <p className="text-xs text-zinc-400 leading-relaxed">{result.excellent_standard}</p>
            </div>
          )}
        </div>
      )}
      <div className="mt-auto">
        <button onClick={onContinue} className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-semibold transition-colors">
          {isLast ? 'See Results' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

// ── Flashcard Gauntlet ────────────────────────────────────────────────────────
function FlashcardGauntlet({ rootId, rootTitle, profileId, terms, onExit, onTiersUpdated }) {
  const [phase, setPhase] = useState('caution'); // 'caution' | 'term' | 'result' | 'summary'
  const [termIndex, setTermIndex] = useState(0);
  const [evaluating, setEvaluating] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [currentResult, setCurrentResult] = useState(null);
  const [results, setResults] = useState([]); // [{term, tier, feedback, excellent_standard}]
  const phraseTimer = useRef(null);

  const currentTerm = terms[termIndex];
  const excellentCount = results.filter(r => r.tier === 'excellent').length;

  const handleSubmitTerm = async () => {
    if (!answer.trim() || evaluating) return;
    setEvaluating(true);
    setPhraseIndex(0);
    let idx = 0;
    phraseTimer.current = setInterval(() => { idx = Math.min(idx + 1, 2); setPhraseIndex(idx); }, 1000);
    const result = await runEvaluation(currentTerm, answer, profileId, rootId);
    clearInterval(phraseTimer.current);
    setCurrentResult({ ...result, term: currentTerm });
    setEvaluating(false);
    setPhase('result');
  };

  const handleContinue = () => {
    const newResults = [...results, { term: currentTerm, ...currentResult }];
    setResults(newResults);
    setCurrentResult(null);
    setAnswer('');
    if (termIndex < terms.length - 1) {
      setTermIndex(i => i + 1);
      setPhase('term');
    } else {
      // Notify parent to refresh tier badges
      if (onTiersUpdated) onTiersUpdated();
      setPhase('summary');
    }
  };

  const getScoreColor = (score) => {
    if (score <= 2) return 'bg-zinc-600';
    if (score <= 6) return 'bg-emerald-500';
    if (score <= 9) return 'bg-teal-500';
    return 'bg-violet-500';
  };

  useEffect(() => () => clearInterval(phraseTimer.current), []);

  // Caution screen
  if (phase === 'caution') {
    return (
      <div className="px-5 py-6 flex flex-col gap-5">
        <div>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Flashcard Gauntlet</p>
          <p className="text-base font-semibold text-zinc-100">{rootTitle}</p>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          All {terms.length} terms. One sitting. No skipping. No going back once submitted.
        </p>
        <div className="flex gap-3">
          <button onClick={onExit} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={() => setPhase('term')} className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-semibold transition-colors">Begin</button>
        </div>
      </div>
    );
  }

  // Term input
  if (phase === 'term') {
    return (
      <div className="flex flex-col min-h-[360px]">
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500">Flashcard Gauntlet</span>
            <span className="text-xs text-zinc-600 font-mono">Term {termIndex + 1} of {terms.length}</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-600 rounded-full transition-all duration-300" style={{ width: `${((termIndex + 1) / terms.length) * 100}%` }} />
          </div>
        </div>
        {evaluating ? <EvalLoader phraseIndex={phraseIndex} /> : (
          <div className="flex-1 flex flex-col px-5 pb-6">
            <p className="text-lg font-semibold text-zinc-100 mb-1 leading-snug">{currentTerm.term}</p>
            <p className="text-xs text-zinc-500 mb-3 mt-0.5">Define and explain:</p>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmitTerm(); }}
              placeholder="Write your definition and explanation..."
              rows={5}
              className="w-full resize-none bg-zinc-900/80 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors mb-4 leading-relaxed"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600">⌘↵ to submit</span>
              <button onClick={handleSubmitTerm} disabled={!answer.trim()}
                className="px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 text-sm font-semibold transition-colors">
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Result screen — extracted to avoid hooks-in-conditionals
  if (phase === 'result' && currentResult) {
    return (
      <GauntletResultScreen
        term={currentTerm}
        termIndex={termIndex}
        totalTerms={terms.length}
        result={currentResult}
        onContinue={handleContinue}
      />
    );
  }

  // Summary screen
  if (phase === 'summary') {
    const score = results.filter(r => r.tier === 'excellent').length;
    const scoreColor = getScoreColor(score);
    const allExcellent = score === terms.length;
    return (
      <div className="px-5 py-5">
        <div className="mb-5">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Flashcard Gauntlet Complete</p>
          {allExcellent ? (
            <p className="text-base font-semibold text-amber-400">Flashcard Gauntlet Complete — {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          ) : (
            <p className="text-base font-semibold text-zinc-100">{score} / {terms.length} Excellent</p>
          )}
        </div>
        {/* Score bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-zinc-500">Score</span>
            <span className="text-xs text-zinc-500 font-mono">{score} / {terms.length} Excellent</span>
          </div>
          <div className="relative h-2 bg-zinc-800 rounded-full overflow-visible">
            <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${scoreColor}`} style={{ width: `${(score / terms.length) * 100}%` }} />
            {[3, 7, 10].map(t => (
              <div key={t} className="absolute top-[-2px] bottom-[-2px] w-px bg-zinc-600 z-10" style={{ left: `${(t / terms.length) * 100}%` }} />
            ))}
          </div>
        </div>
        {/* Term list */}
        <div className="space-y-1.5 mb-6 max-h-64 overflow-y-auto">
          {results.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-zinc-800/40 last:border-0">
              <span className="text-xs text-zinc-400 flex-1 min-w-0 truncate">{r.term.term}</span>
              <TierBadge tier={r.tier} />
            </div>
          ))}
        </div>
        <button onClick={onExit} className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors">
          Return to Vocabulary
        </button>
      </div>
    );
  }

  return null;
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FlashcardDictionary({ rootId, rootTitle, onVocabChanged, onLearnInTeachMe, initialFlashcardIndex, lockedForColdAttempt }) {
  const [open, setOpen] = useState(true);
  const [preLockedOpen, setPreLockedOpen] = useState(true); // remember state before lock
  const [dictionaryMode, setDictionaryMode] = useState('reference'); // 'reference' | 'flashcard' | 'gauntlet'
  const [showHeaderLegend, setShowHeaderLegend] = useState(false);
  const [vocabVersion, setVocabVersion] = useState(0);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardPhase, setFlashcardPhase] = useState('input');
  const [flashcardResult, setFlashcardResult] = useState(null);
  const [pendingTiers, setPendingTiers] = useState({});

  const headerLegendRef = useRef(null);
  const prevLockedRef = useRef(false);
  const { activeProfileId, profilesVersion } = useProfile();

  const terms = DICTIONARY[rootId] || [];

  // Handle lock/unlock
  useEffect(() => {
    if (lockedForColdAttempt && !prevLockedRef.current) {
      setPreLockedOpen(open);
      setOpen(false);
    } else if (!lockedForColdAttempt && prevLockedRef.current) {
      setOpen(preLockedOpen);
    }
    prevLockedRef.current = !!lockedForColdAttempt;
  }, [lockedForColdAttempt]);

  useEffect(() => {
    if (initialFlashcardIndex !== undefined && initialFlashcardIndex !== null) {
      setOpen(true);
      setDictionaryMode('flashcard');
      setFlashcardIndex(initialFlashcardIndex);
      setFlashcardPhase('input');
      setFlashcardResult(null);
    }
  }, [initialFlashcardIndex]);

  useEffect(() => {
    const handler = (e) => { if (headerLegendRef.current && !headerLegendRef.current.contains(e.target)) setShowHeaderLegend(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getRowTier = (termName) => pendingTiers[termName] ?? (activeProfileId ? getFlashcardTier(activeProfileId, rootId, termName) : null);

  const attemptedCount = terms.filter(t => { const tier = getRowTier(t.term); return tier && tier !== null; }).length;
  const allAttemptedAtPass = terms.every(t => { const tier = getRowTier(t.term); return tier === 'pass' || tier === 'great' || tier === 'excellent'; });

  const handleTierUpdated = (termName, tier) => {
    setPendingTiers(prev => ({ ...prev, [termName]: tier }));
    setVocabVersion(v => v + 1);
    if (onVocabChanged) onVocabChanged();
  };

  const handleGauntletTiersUpdated = () => {
    // Re-read all tiers from storage for this root
    setVocabVersion(v => v + 1);
    if (onVocabChanged) onVocabChanged();
  };

  const handleResult = (result) => { setFlashcardResult(result); setFlashcardPhase('result'); };
  const handleTryAgain = () => { setFlashcardPhase('input'); setFlashcardResult(null); };

  const handleNext = () => {
    if (flashcardResult) handleTierUpdated(terms[flashcardIndex].term, flashcardResult.tier);
    if (flashcardIndex < terms.length - 1) {
      setFlashcardIndex(i => i + 1); setFlashcardPhase('input'); setFlashcardResult(null);
    } else {
      setDictionaryMode('reference'); setFlashcardPhase('input'); setFlashcardResult(null);
    }
  };

  const handleBackToVocab = () => {
    if (flashcardResult) handleTierUpdated(terms[flashcardIndex].term, flashcardResult.tier);
    setDictionaryMode('reference'); setFlashcardPhase('input'); setFlashcardResult(null);
  };

  const handleStartFlashcard = (index) => {
    setFlashcardIndex(index); setFlashcardPhase('input'); setFlashcardResult(null); setDictionaryMode('flashcard');
  };

  const handleToggle = () => { if (!lockedForColdAttempt) setOpen(o => !o); };

  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40">
      {/* Header */}
      <div className="px-4 pt-3.5 pb-3 border-b border-zinc-800/50">
        <div className="flex items-center justify-between gap-2">
          {/* Title + chevron — tappable to toggle */}
          <button onClick={handleToggle} className="flex items-center gap-2 flex-1 text-left min-w-0">
            <span className="text-sm font-bold text-zinc-200">Vocabulary</span>
            {lockedForColdAttempt ? (
              <Lock className="w-3.5 h-3.5 text-zinc-600 ml-1 flex-shrink-0" />
            ) : (
              <ChevronDown className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Controls — always visible but disabled when locked */}
          {!lockedForColdAttempt && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Flashcard Gauntlet button */}
              <button
                onClick={() => { setDictionaryMode('gauntlet'); setOpen(true); }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg border border-amber-800/50 bg-amber-950/30 text-amber-400 hover:bg-amber-950/50 transition-colors text-xs whitespace-nowrap"
                title="Flashcard Gauntlet"
              >
                <Zap className="w-3 h-3" />
                <span className="hidden sm:inline">Gauntlet</span>
              </button>
              {/* Mode toggle */}
              <div className="flex rounded-lg border border-zinc-700 overflow-hidden text-xs">
                <button
                  onClick={() => { setDictionaryMode('reference'); setFlashcardPhase('input'); setFlashcardResult(null); setOpen(true); }}
                  className={`px-2.5 py-1 transition-colors ${dictionaryMode === 'reference' ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-500 hover:text-zinc-400'}`}
                >Ref</button>
                <button
                  onClick={() => { setDictionaryMode('flashcard'); setFlashcardIndex(0); setFlashcardPhase('input'); setFlashcardResult(null); setOpen(true); }}
                  className={`px-2.5 py-1 transition-colors ${dictionaryMode === 'flashcard' ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-500 hover:text-zinc-400'}`}
                >Flash</button>
              </div>
              {dictionaryMode === 'reference' && (
                <div className="relative" ref={headerLegendRef}>
                  <button onClick={() => setShowHeaderLegend(v => !v)} className="text-zinc-600 hover:text-zinc-400 transition-colors" title="Tier rubric">
                    <HelpCircle className="w-4 h-4" />
                  </button>
                  {showHeaderLegend && <TierLegend onClose={() => setShowHeaderLegend(false)} />}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress bar — always visible */}
        <div className="mt-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-zinc-500">{attemptedCount} of {terms.length} terms attempted</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-700 rounded-full transition-all duration-500" style={{ width: terms.length > 0 ? `${(attemptedCount / terms.length) * 100}%` : '0%' }} />
          </div>
        </div>

        {/* Locked notice */}
        {lockedForColdAttempt && (
          <p className="text-xs text-zinc-600 mt-2">Vocabulary locked during evaluation.</p>
        )}

        {/* Recommended tag */}
        {!lockedForColdAttempt && !allAttemptedAtPass && <RecommendedTag />}
      </div>

      {/* Body — collapsible */}
      {open && !lockedForColdAttempt && (
        <>
          {/* Gauntlet mode */}
          {dictionaryMode === 'gauntlet' && (
            <div className="bg-zinc-900/60">
              <FlashcardGauntlet
                rootId={rootId}
                rootTitle={rootTitle || `Root ${rootId}`}
                profileId={activeProfileId}
                terms={terms}
                onExit={() => { setDictionaryMode('reference'); handleGauntletTiersUpdated(); }}
                onTiersUpdated={handleGauntletTiersUpdated}
              />
            </div>
          )}

          {/* Reference mode */}
          {dictionaryMode === 'reference' && (
            <div className="divide-y divide-zinc-800/40">
              {terms.map((term, i) => {
                const rowTier = getRowTier(term.term);
                return (
                  <div key={`${i}-${vocabVersion}-${profilesVersion}`} className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <div className="flex-1 min-w-0" style={{ flex: '0 0 55%', maxWidth: '55%' }}>
                        <p className="text-sm font-semibold text-zinc-200 mb-1">{term.term}</p>
                        <p className="text-xs text-zinc-600 italic leading-relaxed">
                          <span className="text-zinc-500 not-italic font-medium">Why — </span>{term.why}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-center gap-2" style={{ flex: '0 0 45%', maxWidth: '45%' }}>
                        <TierBadge tier={rowTier} />
                        <div className="flex flex-col gap-1 items-end">
                          {onLearnInTeachMe && (
                            <button onClick={() => onLearnInTeachMe(term, i)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors text-xs whitespace-nowrap">
                              <GraduationCap className="w-3 h-3 flex-shrink-0" />
                              <span>Teach Me</span>
                            </button>
                          )}
                          <button onClick={() => handleStartFlashcard(i)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors text-xs whitespace-nowrap">
                            <BookMarked className="w-3 h-3 flex-shrink-0" />
                            <span>Attempt</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Flashcard mode */}
          {dictionaryMode === 'flashcard' && (
            <div className="bg-zinc-900/60">
              {flashcardPhase === 'input' && (
                <FlashcardInputScreen
                  key={`input-${flashcardIndex}-${vocabVersion}`}
                  term={terms[flashcardIndex]}
                  termIndex={flashcardIndex}
                  totalTerms={terms.length}
                  rootId={rootId}
                  profileId={activeProfileId}
                  onResult={handleResult}
                  onBack={handleBackToVocab}
                />
              )}
              {flashcardPhase === 'result' && flashcardResult && (
                <FlashcardResultScreen
                  key={`result-${flashcardIndex}`}
                  term={terms[flashcardIndex]}
                  termIndex={flashcardIndex}
                  totalTerms={terms.length}
                  result={flashcardResult}
                  onTryAgain={handleTryAgain}
                  onNext={handleNext}
                  isLast={flashcardIndex === terms.length - 1}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}