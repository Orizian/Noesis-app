import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getFlashcardTier, setFlashcardTierExact } from '../profiles/profileStorage';

const TIER_RANK = { incomplete: 0, attempted: 1, pass: 2, great: 3, excellent: 4 };

const TIER_CONFIG = {
  attempted: { label: 'Attempted', bigClass: 'bg-zinc-800 border-zinc-600 text-zinc-400' },
  pass:      { label: 'Pass',      bigClass: 'bg-emerald-950/40 border-emerald-600 text-emerald-300' },
  great:     { label: 'Great',     bigClass: 'bg-teal-950/40 border-teal-600 text-teal-300' },
  excellent: { label: 'Excellent', bigClass: 'bg-violet-950/40 border-violet-600 text-violet-200' },
};

function getScoreColor(score, total) {
  const r = score / total;
  if (r <= 0.2) return 'bg-zinc-600';
  if (r <= 0.6) return 'bg-emerald-500';
  if (r < 1)   return 'bg-teal-500';
  return 'bg-violet-500';
}

function TierBadge({ tier }) {
  if (!tier) return <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-600 text-xs">—</span>;
  const cfg = TIER_CONFIG[tier];
  if (!cfg) return null;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.bigClass}`}>{cfg.label}</span>;
}

// ── Batch evaluation ──────────────────────────────────────────────────────────
async function batchEvaluate(terms, answers) {
  const pairs = terms.map((t, i) => `Term ${i + 1}: "${t.term}"\nDefinition: "${t.definition}"\nWhy it matters: "${t.why}"\nStudent response: "${answers[i]}"`).join('\n\n---\n\n');

  const prompt = `You are evaluating a student's vocabulary definitions for a structured learning platform.
Evaluate each term-response pair independently against the rubric below.
Return ONLY a valid JSON array of ${terms.length} objects in exact order received.
No preamble, no markdown backticks, no explanation outside the JSON.

RUBRIC:
Attempted — response does not contain a correct definition. Includes 'idk', blank responses, completely incorrect definitions, or vague responses that do not explicitly define the term. Do not award Pass for effort or partial correctness. If a correct definition is not explicitly present it is Attempted.
Pass — correct definition restated in student's own words. Core meaning accurately captured. Nothing more required.
Great — correct definition plus functional explanation of what the term means in practice and how it is used in context.
Excellent — correct definition plus mechanistic causal chain including direction of causation AND either downstream consequences OR what would change if the mechanism were absent or impaired. Both are not required simultaneously — either one alongside direction of causation satisfies Excellent. Evaluate understanding demonstrated not vocabulary used. Do not require specific terminology if concept is clearly demonstrated in plain language. Do not add requirements beyond what is stated here.

Return this exact structure:
[
  {
    "term": "term name",
    "tier": "attempted or pass or great or excellent",
    "feedback": "1-2 sentences of specific feedback referencing what they wrote",
    "excellent_standard": "1 sentence describing what an Excellent answer looks like for this specific term"
  }
]

Terms and student responses:
${pairs}`;

  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: 'object',
      properties: {
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              term: { type: 'string' },
              tier: { type: 'string' },
              feedback: { type: 'string' },
              excellent_standard: { type: 'string' },
            },
          },
        },
      },
    },
  });

  // The LLM might return a top-level array or wrapped. Try to extract.
  let arr = null;
  if (Array.isArray(result)) arr = result;
  else if (result?.results && Array.isArray(result.results)) arr = result.results;
  else if (typeof result === 'string') {
    try { const p = JSON.parse(result); arr = Array.isArray(p) ? p : p?.results; } catch {}
  }
  if (!arr || arr.length === 0) {
    // fallback: mark all attempted
    return terms.map(t => ({ term: t.term, tier: 'attempted', feedback: 'Could not evaluate.', excellent_standard: '' }));
  }
  const VALID = ['attempted','pass','great','excellent'];
  return arr.map((r, i) => ({
    term: terms[i]?.term || r.term || '',
    tier: VALID.includes(r.tier?.toLowerCase()) ? r.tier.toLowerCase() : 'attempted',
    feedback: r.feedback || '',
    excellent_standard: r.excellent_standard || '',
  }));
}

// ── Grading Sheet Row ─────────────────────────────────────────────────────────
function GradingRow({ result, isNewBest }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b border-zinc-800/40 last:border-0">
      <button onClick={() => setExpanded(e => !e)} className="w-full flex items-center gap-2 py-3 text-left hover:bg-zinc-800/20 transition-colors px-1">
        <ChevronRight className={`w-3.5 h-3.5 text-zinc-600 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-zinc-200">{result.term}</span>
          {isNewBest && <span className="ml-2 text-xs font-semibold text-amber-400">New Best!</span>}
        </div>
        <TierBadge tier={result.tier} />
      </button>
      {expanded && (
        <div className="px-6 pb-3 space-y-2">
          <p className="text-xs text-zinc-400 leading-relaxed">{result.feedback}</p>
          {result.excellent_standard && result.tier !== 'excellent' && (
            <div className="px-3 py-2 rounded-lg bg-violet-950/20 border border-violet-900/30">
              <p className="text-xs text-zinc-500 mb-0.5 font-medium">Excellent looks like:</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{result.excellent_standard}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FlashcardGauntlet({ rootId, rootTitle, profileId, terms, onExit, onTiersUpdated }) {
  const [phase, setPhase] = useState('caution'); // caution | run | evaluating | grading
  const [termIndex, setTermIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(terms.length).fill(''));
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [savedFlash, setSavedFlash] = useState(false); // "Answer saved" flash
  const [results, setResults] = useState([]);
  const [newBests, setNewBests] = useState({}); // { termName: bool }
  const [prevBests] = useState(() => {
    const obj = {};
    if (profileId) terms.forEach(t => { obj[t.term] = getFlashcardTier(profileId, rootId, t.term) || null; });
    return obj;
  });

  const textareaRef = useRef(null);

  // Focus textarea on term change
  useEffect(() => {
    if (phase === 'run') {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [phase, termIndex]);

  const handleSubmitTerm = async () => {
    if (!currentAnswer.trim()) return;
    const newAnswers = [...answers];
    newAnswers[termIndex] = currentAnswer;
    setAnswers(newAnswers);

    // Show 500ms "Answer saved" flash then advance
    setSavedFlash(true);
    await new Promise(r => setTimeout(r, 500));
    setSavedFlash(false);

    if (termIndex < terms.length - 1) {
      setCurrentAnswer('');
      setTermIndex(i => i + 1);
    } else {
      // All done — batch evaluate
      setPhase('evaluating');
      const evalResults = await batchEvaluate(terms, newAnswers);
      // Determine new bests and save
      const nb = {};
      evalResults.forEach((r, i) => {
        const termName = terms[i].term;
        const prev = prevBests[termName];
        const prevRank = TIER_RANK[prev] || 0;
        const newRank = TIER_RANK[r.tier] || 0;
        if (newRank > prevRank) {
          nb[termName] = true;
          if (profileId) setFlashcardTierExact(profileId, rootId, termName, r.tier);
        } else if (!prev && newRank >= 0) {
          // first attempt — always save
          if (profileId) setFlashcardTierExact(profileId, rootId, termName, r.tier);
        }
      });
      setNewBests(nb);
      setResults(evalResults);
      if (onTiersUpdated) onTiersUpdated();
      setPhase('grading');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmitTerm();
  };

  const handleRetake = () => {
    setPhase('caution');
    setTermIndex(0);
    setAnswers(Array(terms.length).fill(''));
    setCurrentAnswer('');
    setResults([]);
    setNewBests({});
  };

  // ── Caution ──
  if (phase === 'caution') {
    return (
      <div className="px-5 py-6 flex flex-col gap-5">
        <div>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Flashcard Gauntlet</p>
          <p className="text-base font-semibold text-zinc-100">{rootTitle}</p>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          All {terms.length} terms. One sitting. Answer every term without feedback. Results revealed at the end.
        </p>
        <div className="flex gap-3">
          <button onClick={onExit} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={() => { setPhase('run'); setTermIndex(0); setCurrentAnswer(''); }} className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-semibold transition-colors">Begin</button>
        </div>
      </div>
    );
  }

  // ── Run ──
  if (phase === 'run') {
    const progress = (termIndex / terms.length) * 100;
    return (
      <div className="flex flex-col min-h-[360px]">
        {/* Progress bar */}
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500">Flashcard Gauntlet</span>
            <span className="text-xs text-zinc-600 font-mono">Term {termIndex + 1} of {terms.length}</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex-1 flex flex-col px-5 pb-6">
          <p className="text-lg font-semibold text-zinc-100 mb-1 leading-snug">{terms[termIndex].term}</p>
          <p className="text-xs text-zinc-500 mb-3 mt-0.5">Define and explain:</p>
          <textarea
            ref={textareaRef}
            value={currentAnswer}
            onChange={e => setCurrentAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your definition and explanation..."
            rows={5}
            className="w-full resize-none bg-zinc-900/80 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors mb-4 leading-relaxed"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600">
              {savedFlash ? <span className="text-zinc-500">Answer saved</span> : '⌘↵ to submit'}
            </span>
            <button
              onClick={handleSubmitTerm}
              disabled={!currentAnswer.trim() || savedFlash}
              className="px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 text-sm font-semibold transition-colors"
            >
              {termIndex < terms.length - 1 ? 'Next' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Evaluating ──
  if (phase === 'evaluating') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-5 py-16">
        <div className="w-10 h-10 rounded-full border-2 border-zinc-700 flex items-center justify-center mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
        </div>
        <p className="text-sm text-zinc-300 font-medium animate-pulse text-center">Evaluating your definitions...</p>
        <p className="text-xs text-zinc-600 text-center">All {terms.length} terms at once</p>
      </div>
    );
  }

  // ── Grading sheet ──
  if (phase === 'grading') {
    const excellentCount = results.filter(r => r.tier === 'excellent').length;
    const allExcellent = excellentCount === terms.length;
    const scoreColor = getScoreColor(excellentCount, terms.length);

    // Personal best = max excellent we've ever had for this root
    const storedBestNow = terms.filter(t => (getFlashcardTier(profileId, rootId, t.term) === 'excellent')).length;
    const prevBestCount = terms.filter(t => (prevBests[t.term] === 'excellent')).length;
    const personalBest = Math.max(storedBestNow, prevBestCount, excellentCount);

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
      <div className="px-5 py-5">
        {/* Header */}
        <div className="mb-4">
          {allExcellent && <Star className="w-5 h-5 text-amber-400 fill-amber-400 mb-2" />}
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-0.5">
            {allExcellent ? 'Flashcard Gauntlet Complete' : 'Flashcard Gauntlet Results'}
          </p>
          <p className={`text-base font-semibold ${allExcellent ? 'text-amber-400' : 'text-zinc-100'}`}>
            {allExcellent
              ? `Flashcard Gauntlet Complete — ${dateStr}`
              : `${rootTitle} — ${dateStr}`
            }
          </p>
        </div>

        {/* Score bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-zinc-500">Score</span>
            <span className="text-xs text-zinc-500 font-mono">{excellentCount} / {terms.length} Excellent</span>
          </div>
          <div className="relative h-2 bg-zinc-800 rounded-full overflow-visible">
            <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${scoreColor}`}
              style={{ width: `${(excellentCount / terms.length) * 100}%` }} />
            {(() => {
              const n = terms.length;
              if (n <= 1) return null;
              return [1, 2, 3].map(i => {
                const tick = Math.round((i / 4) * n);
                if (tick <= 0 || tick >= n) return null;
                return (
                  <div key={tick} className="absolute top-[-2px] bottom-[-2px] w-px bg-zinc-600 z-10" style={{ left: `${(tick / n) * 100}%` }} />
                );
              });
            })()}
          </div>
        </div>
        <p className="text-xs text-zinc-600 mb-5">Personal Best: {personalBest} / {terms.length} Excellent</p>

        {/* Term rows */}
        <div className="mb-6">
          {results.map((r, i) => (
            <GradingRow key={i} result={r} isNewBest={!!newBests[r.term]} />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={handleRetake} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors">
            Retake
          </button>
          <button onClick={() => { onExit(); }} className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors">
            Return to Vocabulary
          </button>
        </div>
      </div>
    );
  }

  return null;
}