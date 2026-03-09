import React, { useState, useRef, useEffect } from 'react';
import { BookMarked, ChevronDown, HelpCircle, X, ChevronRight, ArrowLeft, GraduationCap } from 'lucide-react';
import { DICTIONARY } from '../courseData';
import { base44 } from '@/api/base44Client';
import { useProfile } from '../profiles/ProfileContext';
import { getFlashcardTier, setFlashcardTier } from '../profiles/profileStorage';

const TIER_CONFIG = {
  pass:      { label: 'Pass',      badgeClass: 'bg-emerald-950/60 border-emerald-700 text-emerald-300', bigClass: 'bg-emerald-950/40 border-emerald-600 text-emerald-300' },
  great:     { label: 'Great',     badgeClass: 'bg-teal-950/60 border-teal-700 text-teal-300',     bigClass: 'bg-teal-950/40 border-teal-600 text-teal-300' },
  excellent: { label: 'Excellent', badgeClass: 'bg-violet-950/60 border-violet-700 text-violet-300', bigClass: 'bg-violet-950/40 border-violet-600 text-violet-200' },
};

const TIER_RUBRIC = [
  { tier: 'Pass',      className: 'text-emerald-400', desc: 'Correct definition restated in your own words.' },
  { tier: 'Great',     className: 'text-teal-400',    desc: 'Correct definition plus functional explanation of what the term means in practice.' },
  { tier: 'Excellent', className: 'text-violet-400',  desc: 'Correct definition plus full mechanistic causal chain — direction of causation, downstream consequences, what would change if absent.' },
];

const EVAL_PHRASES = [
  'Reading your definition...',
  'Checking depth of understanding...',
  'Finalizing evaluation...',
];

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

function TierBadge({ tier, big }) {
  if (!tier) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-600 text-xs">—</span>
    );
  }
  const cfg = TIER_CONFIG[tier];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${big ? cfg.bigClass : cfg.badgeClass}`}>
      {cfg.label}
    </span>
  );
}

// ── Flashcard input screen (one term, full width) ────────────────────────────
function FlashcardInputScreen({ term, termIndex, totalTerms, rootId, profileId, onResult, onBack }) {
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState('input'); // 'input' | 'evaluating'
  const [evalPhraseIndex, setEvalPhraseIndex] = useState(0);
  const phraseTimer = useRef(null);

  const handleSubmit = async () => {
    if (!answer.trim() || phase === 'evaluating') return;
    setPhase('evaluating');
    setEvalPhraseIndex(0);

    // Phrase cycling
    let idx = 0;
    phraseTimer.current = setInterval(() => {
      idx = Math.min(idx + 1, EVAL_PHRASES.length - 1);
      setEvalPhraseIndex(idx);
    }, 1000);

    const minDelay = new Promise(res => setTimeout(res, 3000));

    const prompt = `You are evaluating a learner's understanding of a specific exercise science term.

Term: "${term.term}"
Definition: "${term.definition}"
Why it matters: "${term.why}"

The learner's response: "${answer}"

Evaluate ONLY against this term. No cross-concept knowledge expected.

Award exactly one tier based solely on what is explicitly present:
- pass: Correct definition in own words. Basic understanding.
- great: Correct definition AND functional explanation of practical use.
- excellent: Correct definition AND full mechanistic causal chain — direction of causation, downstream consequences, what would change if absent or impaired. Naming the mechanism without causal direction does NOT reach excellent.

Be strict. Do not reward length or effort. Evaluate only what is explicitly present.

Return JSON with:
- tier: "pass" | "great" | "excellent"
- feedback: 1-2 sentences — specific to this answer: what was present and what would elevate to the next tier (or confirm excellent)
- excellent_standard: 2-3 sentences describing the structural requirements for Excellent on this specific term — the causal chain and what must be explained. Show structure, not exact wording.`;

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

    clearInterval(phraseTimer.current);
    const tier = resp.tier || 'pass';
    if (profileId) setFlashcardTier(profileId, rootId, term.term, tier);
    onResult({ tier, feedback: resp.feedback || '', excellent_standard: resp.excellent_standard || '', submittedAnswer: answer });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  useEffect(() => {
    return () => clearInterval(phraseTimer.current);
  }, []);

  return (
    <div className="flex flex-col min-h-[320px]">
      {/* Progress bar */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Vocabulary
          </button>
          <span className="text-xs text-zinc-600 font-mono">Term {termIndex + 1} of {totalTerms}</span>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-600 rounded-full transition-all duration-300"
            style={{ width: `${((termIndex + 1) / totalTerms) * 100}%` }}
          />
        </div>
      </div>

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
        <div className="flex-1 flex flex-col px-5 pb-5">
          <p className="text-base font-semibold text-zinc-100 mb-1">{term.term}</p>
          <p className="text-xs text-zinc-500 italic mb-4 leading-relaxed">
            <span className="text-zinc-500 not-italic font-medium">Why it matters — </span>{term.why}
          </p>
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
              disabled={!answer.trim()}
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-500
                text-white text-sm font-medium transition-colors"
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
function FlashcardResultScreen({ term, termIndex, totalTerms, result, onTryAgain, onNext, onBack }) {
  const [showExcellent, setShowExcellent] = useState(false);
  const [animate, setAnimate] = useState(false);
  const isLast = termIndex === totalTerms - 1;

  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  const tierCfg = TIER_CONFIG[result.tier];

  return (
    <div className="flex flex-col px-5 py-5 min-h-[320px]">
      {/* Top progress / back */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Vocabulary
        </button>
        <span className="text-xs text-zinc-600 font-mono">Term {termIndex + 1} of {totalTerms}</span>
      </div>

      {/* Term name */}
      <p className="text-base font-semibold text-zinc-100 mb-5">{term.term}</p>

      {/* Big tier badge — centerpiece */}
      <div className="flex justify-center mb-5">
        <span
          className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all duration-500
            ${tierCfg.bigClass}
            ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          {tierCfg.label}
        </span>
      </div>

      {/* Feedback */}
      <p className="text-sm text-zinc-400 leading-relaxed mb-4 text-center">{result.feedback}</p>

      {/* Expandable excellent standard */}
      {result.excellent_standard && result.tier !== 'excellent' && (
        <div className="mb-5">
          <button
            onClick={() => setShowExcellent(v => !v)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
          >
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

      {/* Buttons */}
      <div className="mt-auto flex gap-2.5">
        <button
          onClick={onTryAgain}
          className="flex-1 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-2.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-100 text-sm font-medium transition-colors"
        >
          {isLast ? 'Back to Vocabulary' : 'Next Term'}
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FlashcardDictionary({ rootId, onVocabChanged, onLearnInTeachMe, initialFlashcardIndex }) {
  const [open, setOpen] = useState(false);
  const [dictionaryMode, setDictionaryMode] = useState('reference'); // 'reference' | 'flashcard'
  const [showHeaderLegend, setShowHeaderLegend] = useState(false);
  const [vocabVersion, setVocabVersion] = useState(0);
  // Flashcard navigation state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardPhase, setFlashcardPhase] = useState('input'); // 'input' | 'result'
  const [flashcardResult, setFlashcardResult] = useState(null);
  // Pending tier update (only show on row after result dismissed)
  const [pendingTiers, setPendingTiers] = useState({});

  const headerLegendRef = useRef(null);
  const { activeProfileId, profilesVersion } = useProfile();

  const terms = DICTIONARY[rootId] || [];

  // Open in flashcard mode at a specific index (from "Learn in Teach Me" via parent)
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

  // Attempted count for this root's progress bar
  const attemptedCount = terms.filter(t => {
    const tier = pendingTiers[t.term] ?? (activeProfileId ? getFlashcardTier(activeProfileId, rootId, t.term) : null);
    return tier && tier !== 'incomplete';
  }).length;

  const handleTierUpdated = (termName, tier) => {
    setPendingTiers(prev => ({ ...prev, [termName]: tier }));
    setVocabVersion(v => v + 1);
    if (onVocabChanged) onVocabChanged();
  };

  const handleResult = (result) => {
    setFlashcardResult(result);
    setFlashcardPhase('result');
    // Update tier badge on row only after result screen is dismissed
  };

  const handleTryAgain = () => {
    setFlashcardPhase('input');
    setFlashcardResult(null);
  };

  const handleNext = () => {
    // Now update tier badge for this term
    if (flashcardResult) {
      handleTierUpdated(terms[flashcardIndex].term, flashcardResult.tier);
    }
    if (flashcardIndex < terms.length - 1) {
      setFlashcardIndex(i => i + 1);
      setFlashcardPhase('input');
      setFlashcardResult(null);
    } else {
      // Last term — back to vocabulary list
      setDictionaryMode('reference');
      setFlashcardPhase('input');
      setFlashcardResult(null);
    }
  };

  const handleBackToVocab = () => {
    if (flashcardResult) {
      handleTierUpdated(terms[flashcardIndex].term, flashcardResult.tier);
    }
    setDictionaryMode('reference');
    setFlashcardPhase('input');
    setFlashcardResult(null);
  };

  const handleStartFlashcard = (index) => {
    setFlashcardIndex(index);
    setFlashcardPhase('input');
    setFlashcardResult(null);
    setDictionaryMode('flashcard');
  };

  const getRowTier = (termName) => {
    return pendingTiers[termName] ?? (activeProfileId ? getFlashcardTier(activeProfileId, rootId, termName) : null);
  };

  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-zinc-800/50">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 flex-1 text-left hover:opacity-80 transition-opacity"
        >
          <BookMarked className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-300">Vocabulary</span>
          <span className="text-xs text-zinc-600">({terms.length} terms)</span>
          <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="flex items-center gap-1.5">
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
                <button
                  onClick={() => setShowHeaderLegend(v => !v)}
                  className="text-zinc-600 hover:text-zinc-400 transition-colors"
                  title="Tier rubric"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                {showHeaderLegend && <TierLegend onClose={() => setShowHeaderLegend(false)} />}
              </div>
            )}
          </div>
        )}
      </div>

      {open && (
        <>
          {/* Vocab progress bar */}
          <div className="px-4 py-2.5 border-b border-zinc-800/30 bg-zinc-900/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-zinc-500">Vocabulary</span>
              <span className="text-xs text-zinc-600">{attemptedCount} of {terms.length} terms attempted</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                style={{ width: terms.length > 0 ? `${(attemptedCount / terms.length) * 100}%` : '0%' }}
              />
            </div>
          </div>

          {/* Reference mode */}
          {dictionaryMode === 'reference' && (
            <div className="divide-y divide-zinc-800/40">
              {terms.map((term, i) => {
                const rowTier = getRowTier(term.term);
                return (
                  <div key={`${i}-${vocabVersion}-${profilesVersion}`} className="px-4 py-3.5">
                    {/* Desktop: single row. Mobile: stacked */}
                    <div className="flex gap-2">
                      {/* Left: term info — 60% */}
                      <div className="flex-1 min-w-0" style={{ flex: '0 0 60%', maxWidth: '60%' }}>
                        <p className="text-sm font-semibold text-zinc-200 mb-1">{term.term}</p>
                        <p className="text-xs text-zinc-600 italic leading-relaxed">
                          <span className="text-zinc-500 not-italic font-medium">Why it matters — </span>
                          {term.why}
                        </p>
                      </div>
                      {/* Right: badge + button — 40% */}
                      <div className="flex flex-col items-end justify-center gap-2" style={{ flex: '0 0 40%', maxWidth: '40%' }}>
                        <TierBadge tier={rowTier} />
                        {onLearnInTeachMe && (
                          <button
                            onClick={() => onLearnInTeachMe(term, i)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors text-xs whitespace-nowrap"
                            title="Learn in Teach Me"
                          >
                            <GraduationCap className="w-3 h-3 flex-shrink-0" />
                            <span className="hidden sm:inline">Learn in Teach Me</span>
                          </button>
                        )}
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
                  onBack={handleBackToVocab}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}