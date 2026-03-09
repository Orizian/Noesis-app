import React, { useState, useRef, useEffect } from 'react';
import { BookMarked, ChevronDown, HelpCircle, X, ChevronRight, ArrowLeft, GraduationCap, Swords, Lock, Zap } from 'lucide-react';
import { DICTIONARY, ROOTS } from '../courseData';
import { base44 } from '@/api/base44Client';
import { useProfile } from '../profiles/ProfileContext';
import { getFlashcardTier, setFlashcardTier } from '../profiles/profileStorage';

const TIER_CONFIG = {
  attempted: { label: 'Attempted', badgeClass: 'bg-zinc-800 border-zinc-700 text-zinc-500',       bigClass: 'bg-zinc-800/60 border-zinc-700 text-zinc-400' },
  pass:      { label: 'Pass',      badgeClass: 'bg-emerald-950/60 border-emerald-700 text-emerald-300', bigClass: 'bg-emerald-950/40 border-emerald-600 text-emerald-300' },
  great:     { label: 'Great',     badgeClass: 'bg-teal-950/60 border-teal-700 text-teal-300',     bigClass: 'bg-teal-950/40 border-teal-600 text-teal-300' },
  excellent: { label: 'Excellent', badgeClass: 'bg-violet-950/60 border-violet-700 text-violet-300', bigClass: 'bg-violet-950/40 border-violet-600 text-violet-200' },
};

const TIER_RUBRIC = [
  { tier: 'Attempted', className: 'text-zinc-500',    desc: 'Response does not contain a correct definition. Effort and length do not earn Pass — the correct meaning must be explicitly present.' },
  { tier: 'Pass',      className: 'text-emerald-400', desc: 'Correct definition restated in your own words. The core meaning of the term is accurately captured.' },
  { tier: 'Great',     className: 'text-teal-400',    desc: 'Correct definition plus functional explanation of what the term means in practice and how it is used in context.' },
  { tier: 'Excellent', className: 'text-violet-400',  desc: 'Correct definition plus mechanistic causal chain — direction of causation AND either downstream consequences OR what would change if absent.' },
];

const EVAL_PHRASES = [
  'Reading your definition...',
  'Checking depth of understanding...',
  'Finalizing evaluation...',
];

const EVAL_PROMPT_SUFFIX = `There are four possible tiers. Evaluate strictly against these definitions and nothing else.

Attempted — the response does not contain a correct definition. This includes 'idk', 'I don't know', blank or near-blank responses, completely incorrect definitions, vague gestures at the topic without actually defining it, or any response that does not explicitly demonstrate understanding of what the term means. Do not award Pass for effort, length, or partial correctness. If a correct definition is not explicitly present it is Attempted.

Pass — correct definition restated in the student's own words. The core meaning of the term is accurately captured. Nothing more is required.

Great — correct definition plus functional explanation of what the term means in practice and how it is used in context.

Excellent — correct definition plus mechanistic causal chain that includes the direction of causation AND either downstream consequences OR what would change if the mechanism were absent or impaired. Both downstream consequences AND the absent condition are not required simultaneously — either one alongside direction of causation satisfies Excellent. Evaluate the understanding demonstrated not the vocabulary used. Do not require specific terminology if the concept is clearly demonstrated in plain language. Do not add requirements beyond what is stated here.`;

function getVocabGauntletBarColor(excellent) {
  if (excellent < 3) return 'bg-zinc-600';
  if (excellent < 7) return 'bg-emerald-500';
  if (excellent < 10) return 'bg-teal-500';
  return 'bg-violet-500';
}

function TierLegend({ onClose }) {
  return (
    <div className="absolute right-0 top-8 z-30 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4">
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

function TierBadge({ tier, big }) {
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

async function runEvaluation(term, answer) {
  const prompt = `You are evaluating a learner's understanding of a specific exercise science term.

Term: "${term.term}"
Definition: "${term.definition}"
Why it matters: "${term.why}"

The learner's response: "${answer}"

Evaluate ONLY against this term. No cross-concept knowledge expected.

${EVAL_PROMPT_SUFFIX}

Return JSON with:
- tier: "attempted" | "pass" | "great" | "excellent"
- feedback: 1-2 sentences — specific to this answer: what was present and what would elevate to the next tier (or confirm excellent). If Attempted, note specifically what was missing.
- excellent_standard: 2-3 sentences describing the structural requirements for Excellent on this specific term — the causal chain and what must be explained. Show structure, not exact wording.`;

  const minDelay = new Promise(res => setTimeout(res, 3000));
  const [resp] = await Promise.all([
    base44.integrations.Core.InvokeLLM({
      prompt,
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
  return resp;
}

// ── Flashcard input screen ───────────────────────────────────────────────────
function FlashcardInputScreen({ term, termIndex, totalTerms, onResult, onBack, showBackLabel = 'Vocabulary', showProgress = true }) {
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState('input');
  const [evalPhraseIndex, setEvalPhraseIndex] = useState(0);
  const phraseTimer = useRef(null);

  const handleSubmit = async () => {
    if (phase === 'evaluating') return;
    setPhase('evaluating');
    setEvalPhraseIndex(0);
    let idx = 0;
    phraseTimer.current = setInterval(() => {
      idx = Math.min(idx + 1, EVAL_PHRASES.length - 1);
      setEvalPhraseIndex(idx);
    }, 1000);
    const resp = await runEvaluation(term, answer.trim() || '(no response)');
    clearInterval(phraseTimer.current);
    const tier = ['attempted','pass','great','excellent'].includes(resp.tier) ? resp.tier : 'attempted';
    onResult({ tier, feedback: resp.feedback || '', excellent_standard: resp.excellent_standard || '', submittedAnswer: answer });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  useEffect(() => () => clearInterval(phraseTimer.current), []);

  return (
    <div className="flex flex-col min-h-[320px]">
      {showProgress && (
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onBack} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> {showBackLabel}
            </button>
            <span className="text-xs text-zinc-600 font-mono">Term {termIndex + 1} of {totalTerms}</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-600 rounded-full transition-all duration-300" style={{ width: `${((termIndex + 1) / totalTerms) * 100}%` }} />
          </div>
        </div>
      )}
      {phase === 'evaluating' ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-5 py-10">
          <div className="flex gap-1.5 mb-2">
            {[0,1,2].map(i => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i <= evalPhraseIndex ? 'bg-zinc-300 scale-110' : 'bg-zinc-700'}`} />
            ))}
          </div>
          <p className="text-sm text-zinc-400 animate-pulse text-center">{EVAL_PHRASES[evalPhraseIndex]}</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col px-5 pb-5 pt-2">
          <p className="text-base font-semibold text-zinc-100 mb-1">{term.term}</p>
          <p className="text-xs text-zinc-500 italic mb-4 leading-relaxed">
            <span className="text-zinc-500 not-italic font-medium">Why it matters — </span>{term.why}
          </p>
          <label className="text-xs text-zinc-500 mb-1.5">Define and explain:</label>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your definition and explanation..."
            rows={4}
            className="w-full flex-1 resize-none bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200
              placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors mb-3"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600">⌘↵ to submit</span>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Flashcard result screen ──────────────────────────────────────────────────
function FlashcardResultScreen({ term, termIndex, totalTerms, result, onTryAgain, onNext, onBack, nextLabel, showProgress = true, showBackLabel = 'Vocabulary' }) {
  const [showExcellent, setShowExcellent] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setAnimate(true)); }, []);

  const tierCfg = TIER_CONFIG[result.tier] || TIER_CONFIG.attempted;

  return (
    <div className="flex flex-col px-5 py-5 min-h-[320px]">
      {showProgress && (
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {showBackLabel}
          </button>
          <span className="text-xs text-zinc-600 font-mono">Term {termIndex + 1} of {totalTerms}</span>
        </div>
      )}
      <p className="text-base font-semibold text-zinc-100 mb-5">{term.term}</p>
      <div className="flex justify-center mb-5">
        <span
          className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all duration-500
            ${tierCfg.bigClass} ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          {tierCfg.label}
        </span>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed mb-4 text-center">{result.feedback}</p>
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
      <div className="mt-auto flex gap-2.5">
        <button onClick={onTryAgain} className="flex-1 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors">
          Try Again
        </button>
        <button onClick={onNext} className="flex-1 py-2.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-100 text-sm font-medium transition-colors">
          {nextLabel || 'Next Term'}
        </button>
      </div>
    </div>
  );
}

// ── Flashcard Gauntlet ───────────────────────────────────────────────────────
function FlashcardGauntlet({ rootId, terms, profileId, onClose }) {
  // phase: 'caution' | 'question' | 'result' | 'summary'
  const [phase, setPhase] = useState('caution');
  const [termIndex, setTermIndex] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);
  const [sittingResults, setSittingResults] = useState([]); // tier per term, indexed
  const root = ROOTS.find(r => r.id === rootId);

  const handleResult = (result) => {
    const tier = result.tier;
    // Save to storage (best of)
    if (profileId) setFlashcardTier(profileId, rootId, terms[termIndex].term, tier);
    setCurrentResult(result);
    setPhase('result');
  };

  const handleTryAgain = () => {
    setCurrentResult(null);
    setPhase('question');
  };

  const handleContinue = () => {
    // Lock in this result
    const newResults = [...sittingResults];
    newResults[termIndex] = currentResult.tier;
    setSittingResults(newResults);
    setCurrentResult(null);
    if (termIndex < terms.length - 1) {
      setTermIndex(i => i + 1);
      setPhase('question');
    } else {
      setPhase('summary');
    }
  };

  if (phase === 'caution') {
    return (
      <div className="flex flex-col px-5 py-6 min-h-[320px]">
        <div className="flex items-center gap-2 mb-5">
          <Swords className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-zinc-100">Flashcard Gauntlet — {root?.title}</h3>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          All 10 terms. One sitting. No skipping. No going back once submitted.
        </p>
        <div className="mt-auto flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button onClick={() => setPhase('question')} className="flex-1 py-2.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold transition-colors">
            Begin
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'question') {
    return (
      <FlashcardInputScreen
        key={`gauntlet-input-${termIndex}`}
        term={terms[termIndex]}
        termIndex={termIndex}
        totalTerms={terms.length}
        onResult={handleResult}
        onBack={onClose}
        showBackLabel="Cancel Gauntlet"
        showProgress={true}
      />
    );
  }

  if (phase === 'result') {
    return (
      <FlashcardResultScreen
        key={`gauntlet-result-${termIndex}`}
        term={terms[termIndex]}
        termIndex={termIndex}
        totalTerms={terms.length}
        result={currentResult}
        onTryAgain={handleTryAgain}
        onNext={handleContinue}
        onBack={onClose}
        nextLabel={termIndex === terms.length - 1 ? 'Finish' : 'Continue'}
        showProgress={true}
        showBackLabel="Cancel Gauntlet"
      />
    );
  }

  // Summary
  const excellentCount = sittingResults.filter(t => t === 'excellent').length;
  const barColor = getVocabGauntletBarColor(excellentCount);
  const allExcellent = excellentCount === 10;

  return (
    <div className="flex flex-col px-5 py-5">
      <div className="flex items-center gap-2 mb-4">
        <Swords className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-zinc-200">Gauntlet Summary</h3>
      </div>

      {/* Score bar */}
      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-xs text-zinc-500">Excellent</span>
          <span className="text-xs font-mono text-zinc-500">{excellentCount} / 10</span>
        </div>
        <div className="relative h-2 bg-zinc-800 rounded-full overflow-visible">
          <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${(excellentCount / 10) * 100}%` }} />
          {[3, 7, 10].map(tick => (
            <div key={tick} className="absolute top-[-2px] bottom-[-2px] w-px bg-zinc-600 z-10" style={{ left: `${(tick / 10) * 100}%` }} />
          ))}
        </div>
      </div>

      {allExcellent ? (
        <p className="text-sm font-bold text-amber-400 mb-4 text-center">✦ Flashcard Gauntlet Complete — {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
      ) : (
        <p className="text-xs text-zinc-500 mb-3">Terms below Excellent:</p>
      )}

      <div className="space-y-2 mb-5 max-h-[240px] overflow-y-auto">
        {terms.map((term, i) => {
          const tier = sittingResults[i];
          if (allExcellent || tier !== 'excellent') {
            const cfg = TIER_CONFIG[tier] || TIER_CONFIG.attempted;
            return (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className="text-xs text-zinc-400 truncate flex-1">{term.term}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium flex-shrink-0 ${cfg.badgeClass}`}>
                  {cfg.label}
                </span>
              </div>
            );
          }
          return null;
        })}
      </div>

      <button onClick={onClose} className="w-full py-2.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-100 text-sm font-medium transition-colors">
        Return to Vocabulary
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FlashcardDictionary({ rootId, onVocabChanged, onLearnInTeachMe, initialFlashcardIndex, isLocked = false }) {
  const [open, setOpen] = useState(false);
  const [dictionaryMode, setDictionaryMode] = useState('reference'); // 'reference' | 'flashcard' | 'gauntlet'
  const [showHeaderLegend, setShowHeaderLegend] = useState(false);
  const [vocabVersion, setVocabVersion] = useState(0);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardPhase, setFlashcardPhase] = useState('input');
  const [flashcardResult, setFlashcardResult] = useState(null);
  const [pendingTiers, setPendingTiers] = useState({});

  const headerLegendRef = useRef(null);
  const { activeProfileId, profilesVersion } = useProfile();
  const terms = DICTIONARY[rootId] || [];

  // Lock: close and reset when locked
  useEffect(() => {
    if (isLocked) {
      setOpen(false);
      setDictionaryMode('reference');
      setFlashcardPhase('input');
      setFlashcardResult(null);
    }
  }, [isLocked]);

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
    const handler = (e) => {
      if (headerLegendRef.current && !headerLegendRef.current.contains(e.target)) setShowHeaderLegend(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getRowTier = (termName) => pendingTiers[termName] ?? (activeProfileId ? getFlashcardTier(activeProfileId, rootId, termName) : null);

  const attemptedCount = terms.filter(t => {
    const tier = getRowTier(t.term);
    return tier && tier !== 'incomplete';
  }).length;

  const handleTierUpdated = (termName, tier) => {
    setPendingTiers(prev => ({ ...prev, [termName]: tier }));
    setVocabVersion(v => v + 1);
    if (onVocabChanged) onVocabChanged();
  };

  const handleResult = (result) => {
    // Save to storage immediately
    if (activeProfileId) {
      const tier = result.tier;
      setFlashcardTier(activeProfileId, rootId, terms[flashcardIndex].term, tier);
      handleTierUpdated(terms[flashcardIndex].term, tier);
    }
    setFlashcardResult(result);
    setFlashcardPhase('result');
  };

  const handleTryAgain = () => {
    setFlashcardPhase('input');
    setFlashcardResult(null);
  };

  const handleNext = () => {
    if (flashcardIndex < terms.length - 1) {
      setFlashcardIndex(i => i + 1);
      setFlashcardPhase('input');
      setFlashcardResult(null);
    } else {
      setDictionaryMode('reference');
      setFlashcardPhase('input');
      setFlashcardResult(null);
    }
  };

  const handleBackToVocab = () => {
    setDictionaryMode('reference');
    setFlashcardPhase('input');
    setFlashcardResult(null);
  };

  const handleAttemptTerm = (index) => {
    setFlashcardIndex(index);
    setFlashcardPhase('input');
    setFlashcardResult(null);
    setDictionaryMode('flashcard');
  };

  const handleGauntletClose = () => {
    setDictionaryMode('reference');
    setFlashcardPhase('input');
    setFlashcardResult(null);
    setVocabVersion(v => v + 1);
    if (onVocabChanged) onVocabChanged();
  };

  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-zinc-800/50">
        <button
          onClick={() => !isLocked && setOpen(o => !o)}
          className={`flex items-center gap-2 flex-1 text-left transition-opacity ${isLocked ? 'cursor-default opacity-80' : 'hover:opacity-80'}`}
        >
          <BookMarked className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-300">Vocabulary</span>
          <span className="text-xs text-zinc-600">({terms.length} terms)</span>
          {!isLocked && <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />}
          {isLocked && <Lock className="w-3.5 h-3.5 text-zinc-600 ml-1" />}
        </button>

        {!isLocked && open && (
          <div className="flex items-center gap-1.5">
            {/* Flashcard Gauntlet button */}
            <button
              onClick={() => { setDictionaryMode('gauntlet'); }}
              title="Flashcard Gauntlet"
              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-amber-800/50 text-amber-500 hover:bg-amber-950/30 transition-colors text-xs whitespace-nowrap"
            >
              <Swords className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gauntlet</span>
            </button>
            {/* Mode toggle */}
            <div className="flex rounded-lg border border-zinc-700 overflow-hidden text-xs">
              <button
                onClick={() => { setDictionaryMode('reference'); setFlashcardPhase('input'); setFlashcardResult(null); }}
                className={`px-2.5 py-1 transition-colors ${dictionaryMode === 'reference' ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-500 hover:text-zinc-400'}`}
              >Reference</button>
              <button
                onClick={() => { setDictionaryMode('flashcard'); setFlashcardIndex(0); setFlashcardPhase('input'); setFlashcardResult(null); }}
                className={`px-2.5 py-1 transition-colors ${dictionaryMode === 'flashcard' ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-500 hover:text-zinc-400'}`}
              >Flashcard</button>
            </div>
            {/* Legend icon (reference mode only) */}
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

      {/* Locked state message */}
      {isLocked && (
        <div className="px-4 py-3 bg-zinc-900/30 border-b border-zinc-800/30">
          <p className="text-xs text-zinc-600">Vocabulary locked during evaluation.</p>
        </div>
      )}

      {!isLocked && open && (
        <>
          {/* Vocab progress bar (reference mode only) */}
          {dictionaryMode === 'reference' && (
            <div className="px-4 py-2.5 border-b border-zinc-800/30 bg-zinc-900/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-zinc-500">Vocabulary</span>
                <span className="text-xs text-zinc-600">{attemptedCount} of {terms.length} attempted</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                  style={{ width: terms.length > 0 ? `${(attemptedCount / terms.length) * 100}%` : '0%' }}
                />
              </div>
            </div>
          )}

          {/* Gauntlet mode */}
          {dictionaryMode === 'gauntlet' && (
            <FlashcardGauntlet
              key={`gauntlet-${rootId}-${vocabVersion}`}
              rootId={rootId}
              terms={terms}
              profileId={activeProfileId}
              onClose={handleGauntletClose}
            />
          )}

          {/* Reference mode */}
          {dictionaryMode === 'reference' && (
            <div className="divide-y divide-zinc-800/40">
              {terms.map((term, i) => {
                const rowTier = getRowTier(term.term);
                return (
                  <div key={`${i}-${vocabVersion}-${profilesVersion}`} className="px-4 py-3.5">
                    <div className="flex gap-2 items-start">
                      {/* Left: term info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-200 mb-1">{term.term}</p>
                        <p className="text-xs text-zinc-600 italic leading-relaxed">
                          <span className="text-zinc-500 not-italic font-medium">Why it matters — </span>
                          {term.why}
                        </p>
                      </div>
                      {/* Right: badge + buttons */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <TierBadge tier={rowTier} />
                        <div className="flex flex-col gap-1.5 items-end">
                          <button
                            onClick={() => handleAttemptTerm(i)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors text-xs whitespace-nowrap"
                            title="Attempt in Flashcard"
                          >
                            <Zap className="w-3 h-3 flex-shrink-0" />
                            <span className="hidden sm:inline">Flashcard</span>
                          </button>
                          {onLearnInTeachMe && (
                            <button
                              onClick={() => onLearnInTeachMe(term, i)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors text-xs whitespace-nowrap"
                              title="Learn in Teach Me"
                            >
                              <GraduationCap className="w-3 h-3 flex-shrink-0" />
                              <span className="hidden sm:inline">Teach Me</span>
                            </button>
                          )}
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
            <div>
              {flashcardPhase === 'input' && (
                <FlashcardInputScreen
                  key={`input-${flashcardIndex}-${vocabVersion}`}
                  term={terms[flashcardIndex]}
                  termIndex={flashcardIndex}
                  totalTerms={terms.length}
                  onResult={handleResult}
                  onBack={handleBackToVocab}
                  showBackLabel="Vocabulary"
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
                  onBack={handleBackToVocab}
                  nextLabel={flashcardIndex === terms.length - 1 ? 'Back to Vocabulary' : 'Next Term'}
                  showBackLabel="Vocabulary"
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}