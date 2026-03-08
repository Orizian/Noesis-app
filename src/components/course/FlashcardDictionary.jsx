import React, { useState, useRef, useEffect } from 'react';
import { BookMarked, ChevronDown, HelpCircle, X, Loader2, CheckCircle2 } from 'lucide-react';
import { DICTIONARY } from '../courseData';
import { base44 } from '@/api/base44Client';
import { useProfile } from '../profiles/ProfileContext';
import { getFlashcardTier, setFlashcardTier, getVocabStats } from '../profiles/profileStorage';

const TIER_CONFIG = {
  pass:      { label: 'Pass',      badgeClass: 'bg-emerald-950/60 border-emerald-700 text-emerald-300' },
  great:     { label: 'Great',     badgeClass: 'bg-teal-950/60 border-teal-700 text-teal-300' },
  excellent: { label: 'Excellent', badgeClass: 'bg-violet-950/60 border-violet-700 text-violet-300' },
};

const TIER_RUBRIC = [
  {
    tier: 'Pass',
    className: 'text-emerald-400',
    desc: 'Correct definition restated in your own words. Basic understanding demonstrated.',
  },
  {
    tier: 'Great',
    className: 'text-teal-400',
    desc: 'Correct definition plus functional explanation of what the term means in practice and how it is used.',
  },
  {
    tier: 'Excellent',
    className: 'text-violet-400',
    desc: 'Correct definition plus mechanistic causal chain explaining why it works at the physiological or molecular level, including the direction of causation — why the mechanism works this way, what it produces downstream, and what would change if it were absent or impaired.',
  },
];

function TierLegend({ onClose }) {
  return (
    <div className="absolute right-0 top-8 z-30 w-72 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Flashcard Tiers</span>
        <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400">
          <X className="w-3.5 h-3.5" />
        </button>
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

function TierBadge({ tier, small }) {
  if (!tier) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-600 ${small ? 'text-xs' : 'text-xs'}`}>
        —
      </span>
    );
  }
  const cfg = TIER_CONFIG[tier];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.badgeClass}`}>
      {cfg.label}
    </span>
  );
}

function FlashcardItem({ term, rootId, profileId, onTierUpdated }) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { tier, feedback }
  const [showLegend, setShowLegend] = useState(false);
  const legendRef = useRef(null);
  const bestTier = profileId ? getFlashcardTier(profileId, rootId, term.term) : null;

  useEffect(() => {
    const handler = (e) => {
      if (legendRef.current && !legendRef.current.contains(e.target)) setShowLegend(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = async () => {
    if (!answer.trim() || loading) return;
    setLoading(true);
    setResult(null);

    const prompt = `You are evaluating a learner's understanding of a specific exercise science term for a flashcard system.

Term: "${term.term}"
Definition: "${term.definition}"
Why it matters: "${term.why}"

The learner's response: "${answer}"

Evaluate ONLY against this term. No cross-concept knowledge expected or rewarded.

Award exactly one of these tiers based solely on what is explicitly present in the response:
- pass: The response contains a correct definition in the learner's own words. Basic understanding demonstrated.
- great: The response contains a correct definition AND a functional explanation of what the term means in practice and how it is used.
- excellent: The response contains a correct definition AND a full mechanistic causal chain including direction of causation — why this mechanism works this way, what it produces downstream, AND what would change if the mechanism were absent or impaired. A response that names the mechanism without explaining direction of causation does NOT reach excellent. A response that explains what something does without explaining why it works that way and what depends on it does NOT reach excellent.

Be strict. Do not reward length or effort. Evaluate only what is explicitly present.

Respond in this exact JSON format:
{
  "tier": "pass" | "great" | "excellent",
  "feedback": "One sentence: what was present and what would elevate to the next tier (or confirm excellent)."
}`;

    const resp = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          tier: { type: 'string' },
          feedback: { type: 'string' },
        },
      },
    });

    const tier = resp.tier || 'pass';
    const feedback = resp.feedback || '';
    if (profileId) {
      setFlashcardTier(profileId, rootId, term.term, tier);
    }
    setResult({ tier, feedback });
    setAnswer('');
    if (onTierUpdated) onTierUpdated();
    setLoading(false);
  };

  return (
    <div className="px-4 py-4 border-b border-zinc-800/40 last:border-0">
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-semibold text-zinc-100">{term.term}</p>
        <TierBadge tier={bestTier} small />
      </div>
      <p className="text-xs text-zinc-500 italic leading-relaxed mb-3">{term.why}</p>

      <div className="relative">
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Write your definition and explanation..."
          rows={3}
          className="w-full resize-none bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 pr-10 text-sm text-zinc-200
            placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
        />
        <div className="absolute top-2 right-2" ref={legendRef}>
          <button
            onClick={() => setShowLegend(v => !v)}
            className="text-zinc-600 hover:text-zinc-400 transition-colors"
            title="Tier rubric"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          {showLegend && <TierLegend onClose={() => setShowLegend(false)} />}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={handleSubmit}
          disabled={!answer.trim() || loading}
          className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-500
            text-white text-sm font-medium transition-colors flex items-center gap-1.5"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Submit
        </button>
      </div>

      {result && (
        <div className={`mt-3 flex items-start gap-3 px-3 py-2.5 rounded-xl border
          ${result.tier === 'excellent' ? 'bg-violet-950/20 border-violet-900/40' :
            result.tier === 'great' ? 'bg-teal-950/20 border-teal-900/40' :
            'bg-emerald-950/20 border-emerald-900/40'}`}
        >
          <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5
            ${result.tier === 'excellent' ? 'text-violet-400' :
              result.tier === 'great' ? 'text-teal-400' : 'text-emerald-400'}`}
          />
          <div>
            <TierBadge tier={result.tier} />
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{result.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlashcardDictionary({ rootId, onVocabChanged }) {
  const [open, setOpen] = useState(false);
  const [dictionaryMode, setDictionaryMode] = useState('reference'); // 'reference' | 'flashcard'
  const [showHeaderLegend, setShowHeaderLegend] = useState(false);
  const [vocabVersion, setVocabVersion] = useState(0);
  const headerLegendRef = useRef(null);
  const { activeProfileId, profilesVersion } = useProfile();

  const terms = DICTIONARY[rootId] || [];

  useEffect(() => {
    const handler = (e) => {
      if (headerLegendRef.current && !headerLegendRef.current.contains(e.target)) setShowHeaderLegend(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleTierUpdated = () => {
    setVocabVersion(v => v + 1);
    if (onVocabChanged) onVocabChanged();
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
          <span className="text-sm font-medium text-zinc-300">Dictionary</span>
          <span className="text-xs text-zinc-600">({terms.length} terms)</span>
          <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="flex items-center gap-1.5">
            {/* Mode toggle */}
            <div className="flex rounded-lg border border-zinc-700 overflow-hidden text-xs">
              <button
                onClick={() => setDictionaryMode('reference')}
                className={`px-2.5 py-1 transition-colors ${dictionaryMode === 'reference' ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-500 hover:text-zinc-400'}`}
              >Reference</button>
              <button
                onClick={() => setDictionaryMode('flashcard')}
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

      {open && dictionaryMode === 'reference' && (
        <div className="divide-y divide-zinc-800/40">
          {terms.map((term, i) => {
            const bestTier = activeProfileId ? getFlashcardTier(activeProfileId, rootId, term.term) : null;
            return (
              <div key={i} className="px-4 py-3.5">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-semibold text-zinc-200">{term.term}</p>
                      <TierBadge tier={bestTier} small />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-1.5">{term.definition}</p>
                    <p className="text-xs text-zinc-600 italic leading-relaxed">
                      <span className="text-zinc-500 not-italic font-medium">Why it matters — </span>
                      {term.why}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {open && dictionaryMode === 'flashcard' && (
        <div>
          {terms.map((term, i) => (
            <FlashcardItem
              key={`${i}-${vocabVersion}-${profilesVersion}`}
              term={term}
              rootId={rootId}
              profileId={activeProfileId}
              onTierUpdated={handleTierUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}