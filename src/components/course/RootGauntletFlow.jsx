import React, { useState, useRef } from 'react';
import { ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCourse } from './CourseContext';
import {
  setGauntletCriteriaBulk,
  setGauntletPassedDate,
  getGauntletRootPoints,
} from '../profiles/profileStorage';

import { format } from 'date-fns';

export function getQuestionsForRoot(root) {
  const qs = [{ key: 'root', label: 'Root Question', maxCriteria: 4 }];
  root.branches.forEach((_, i) => {
    qs.push({ key: `branch_${i + 1}`, label: `Branch ${i + 1}`, maxCriteria: 3 });
  });
  return qs;
}

const TIER_CONFIG = {
  excellent:  { label: 'Excellent',  className: 'bg-violet-950/60 border-violet-700 text-violet-300' },
  great:      { label: 'Great',      className: 'bg-teal-950/60 border-teal-700 text-teal-300' },
  pass:       { label: 'Pass',       className: 'bg-emerald-950/60 border-emerald-700 text-emerald-300' },
  incomplete: { label: 'Incomplete', className: 'bg-zinc-800/60 border-zinc-700 text-zinc-500' },
};

function getTier(score, isRoot) {
  if (isRoot) {
    if (score >= 4) return 'excellent';
    if (score >= 3) return 'great';
    if (score >= 2) return 'pass';
    return 'incomplete';
  } else {
    if (score >= 3) return 'excellent';
    if (score >= 2) return 'great';
    if (score >= 1) return 'pass';
    return 'incomplete';
  }
}

function getBarColor(pts, max) {
  const pct = pts / max;
  if (pct < 0.31) return 'bg-zinc-500';
  if (pct < 0.62) return 'bg-emerald-500';
  if (pct < 0.93) return 'bg-teal-500';
  return 'bg-violet-500';
}

function getQuestionText(root, key) {
  if (key === 'root') return root.rootQuestion;
  const idx = parseInt(key.split('_')[1]) - 1;
  return root.branches[idx]?.question || root.rootQuestion;
}

function getRubricCriteria(root, key, branchRubrics) {
  const rubricStr = key === 'root' ? root.rubric : (branchRubrics[root.id]?.[key] || root.rubric);
  const matches = [...rubricStr.matchAll(/Criterion\s+\d+:\s*(.+?)(?=Criterion\s+\d+:|$)/gi)];
  return matches.map(m => m[1].trim());
}

// ── Batch evaluate all questions for a root ────────────────────────────────────
async function batchEvaluateGauntlet(root, answers, branchRubrics) {
  const questions = getQuestionsForRoot(root);
  const sets = questions.map((q, i) => {
    const question = getQuestionText(root, q.key);
    const rubricStr = q.key === 'root' ? root.rubric : (branchRubrics[root.id]?.[q.key] || root.rubric);
    const criteria = getRubricCriteria(root, q.key, branchRubrics);
    return `Question ${i + 1} (${q.label}):\nQuestion text: "${question}"\nRubric criteria (${q.maxCriteria} criteria):\n${criteria.map((c, j) => `  Criterion ${j + 1}: ${c}`).join('\n')}\nStudent response: "${answers[i]}"`;
  }).join('\n\n---\n\n');

  const prompt = `You are evaluating a student's answers to a root question and ${root.branches.length} branch questions for a mechanistic learning platform.
Evaluate each response independently against its specific rubric criteria.
Return ONLY a valid JSON array of ${questions.length} objects in exact order. No preamble, no markdown backticks, no explanation outside the JSON.

RUBRIC TIERS:
Root Question — 4 criteria, 1 point each, max 4 points. Tiers: 0-1 = Incomplete, 2 = Pass, 3 = Great, 4 = Excellent
Branch Questions — 3 criteria, 1 point each, max 3 points. Tiers: 0 = Incomplete, 1 = Pass, 2 = Great, 3 = Excellent

A criterion is met only if clearly demonstrated in the response. Do not award partial credit for vague gestures toward the concept. Evaluate the understanding demonstrated not the specific vocabulary used.

Return this exact structure:
[
  {
    "question": "root or branch1 or branch2 or branch3",
    "criteria_met": [true, false, true, true],
    "score": 3,
    "tier": "Great",
    "feedback": "1-2 sentences of specific feedback referencing what they wrote",
    "criteria_breakdown": ["Criterion 1 text — Met", "Criterion 2 text — Not Met", "Criterion 3 text — Met"]
  }
]

Questions, criteria, and student responses:
${sets}`;

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
              question: { type: 'string' },
              criteria_met: { type: 'array', items: { type: 'boolean' } },
              score: { type: 'number' },
              tier: { type: 'string' },
              feedback: { type: 'string' },
              criteria_breakdown: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
  });

  let arr = null;
  if (Array.isArray(result)) arr = result;
  else if (result?.results && Array.isArray(result.results)) arr = result.results;
  if (!arr || arr.length === 0) {
    return questions.map(q => ({ question: q.key, criteria_met: [], score: 0, tier: 'Incomplete', feedback: 'Could not evaluate.', criteria_breakdown: [] }));
  }

  return questions.map((q, i) => {
    const r = arr[i] || {};
    const criteria = getRubricCriteria(root, q.key, branchRubrics);
    const critMet = Array.isArray(r.criteria_met) ? r.criteria_met : criteria.map(() => false);
    const score = typeof r.score === 'number' ? r.score : critMet.filter(Boolean).length;
    const breakdown = Array.isArray(r.criteria_breakdown) && r.criteria_breakdown.length > 0
      ? r.criteria_breakdown
      : criteria.map((c, j) => `${c} — ${critMet[j] ? 'Met' : 'Not Met'}`);
    return {
      question: q.key,
      criteria_met: critMet,
      score,
      tier: r.tier || getTier(score, q.key === 'root'),
      feedback: r.feedback || '',
      criteria_breakdown: breakdown,
      passed: q.key === 'root' ? score >= 2 : score >= 1,
    };
  });
}

// ── Grading Row ───────────────────────────────────────────────────────────────
function GradingRow({ result, qMeta, index }) {
  const [expanded, setExpanded] = useState(false);
  const tier = result.tier?.toLowerCase() || getTier(result.score, qMeta.key === 'root');
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.incomplete;
  return (
    <div className="border-b border-zinc-800/40 last:border-0">
      <button onClick={() => setExpanded(e => !e)} className="w-full flex items-center gap-2 py-3 text-left hover:bg-zinc-800/20 transition-colors px-1">
        <ChevronRight className={`w-3.5 h-3.5 text-zinc-600 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-zinc-200">{qMeta.label}</span>
          <p className="text-xs text-zinc-600">{result.score} / {qMeta.maxCriteria}</p>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.className}`}>{cfg.label}</span>
      </button>
      {expanded && (
        <div className="px-6 pb-4 space-y-2">
          {result.criteria_breakdown?.map((line, j) => {
            const met = result.criteria_met?.[j];
            return (
              <div key={j} className={`flex items-start gap-2 px-3 py-2 rounded-xl border text-xs leading-relaxed
                ${met ? 'bg-emerald-950/20 border-emerald-900/30 text-zinc-300' : 'bg-red-950/20 border-red-900/30 text-zinc-400'}`}>
                {met
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  : <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />}
                {line}
              </div>
            );
          })}
          {result.feedback && (
            <div className="px-3 py-2 rounded-xl border bg-zinc-800/40 border-zinc-700/50 text-xs text-zinc-400 leading-relaxed mt-1">
              {result.feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main RootGauntletFlow ─────────────────────────────────────────────────────
export default function RootGauntletFlow({ root, profileId, onComplete, onCancel }) {
  const { branchRubrics, getRootMaxPoints, meta } = useCourse();
  const courseId = meta.id;
  const [phase, setPhase] = useState('caution'); // caution | run | evaluating | grading | summary-legacy
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState(() => Array(root.branches.length + 1).fill(''));
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);
  const [results, setResults] = useState([]);

  const textareaRef = useRef(null);

  const handleSubmitQ = async () => {
    if (!currentAnswer.trim()) return;
    const newAnswers = [...answers];
    newAnswers[qIdx] = currentAnswer;
    setAnswers(newAnswers);

    setSavedFlash(true);
    await new Promise(r => setTimeout(r, 500));
    setSavedFlash(false);

    const questions = getQuestionsForRoot(root);
    if (qIdx < questions.length - 1) {
      setCurrentAnswer('');
      setQIdx(q => q + 1);
      setTimeout(() => textareaRef.current?.focus(), 50);
    } else {
      // Batch evaluate
       setPhase('evaluating');
       const evalResults = await batchEvaluateGauntlet(root, newAnswers, branchRubrics);
       // Save to storage
       if (profileId) {
         const bulk = {};
         const questions = getQuestionsForRoot(root);
         evalResults.forEach((r, i) => { bulk[questions[i].key] = r.score; });
         setGauntletCriteriaBulk(profileId, courseId, root.id, bulk);
         const allPassed = evalResults.every(r => r.passed);
         if (allPassed) setGauntletPassedDate(profileId, courseId, root.id, Date.now());
       }
       setResults(evalResults);
       setPhase('grading');
    }
  };

  const handleRetake = () => {
    setPhase('caution');
    setQIdx(0);
    setAnswers(Array(root.branches.length + 1).fill(''));
    setCurrentAnswer('');
    setResults([]);
  };

  // ── Caution ──
  if (phase === 'caution') {
    return (
      <div className="border border-amber-800/40 rounded-2xl bg-amber-950/10 p-6 space-y-5">
        <div>
           <h2 className="text-lg font-bold text-amber-300 mb-1">Root Gauntlet — {root.title}</h2>
           <p className="text-sm text-zinc-400 leading-relaxed">
             Answer all {root.branches.length + 1} questions back to back without feedback. Results revealed at the end.
           </p>
         </div>
        <div className="flex gap-3">
          <button onClick={() => { setPhase('run'); setQIdx(0); setCurrentAnswer(''); setTimeout(() => textareaRef.current?.focus(), 100); }}
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

  // ── Run ──
  if (phase === 'run') {
    const questions = getQuestionsForRoot(root);
    const qMeta = questions[qIdx];
    const progress = (qIdx / questions.length) * 100;
    return (
      <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 overflow-hidden">
         <div className="border-b border-zinc-800">
           <div className="flex items-center justify-between px-4 py-2.5">
             <span className="text-xs font-semibold text-amber-400 tracking-wide">{qMeta.label}</span>
             <span className="text-xs text-zinc-600 font-mono">Question {qIdx + 1} of {questions.length}</span>
           </div>
           <div className="h-1 bg-zinc-800">
             <div className="h-full bg-violet-600 transition-all duration-500" style={{ width: `${progress}%` }} />
           </div>
         </div>
         <div className="p-5 space-y-4">
           <p className="text-sm text-zinc-300 leading-relaxed">{getQuestionText(root, qMeta.key)}</p>
           <textarea
             ref={textareaRef}
             value={currentAnswer}
             onChange={e => setCurrentAnswer(e.target.value)}
             onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmitQ(); }}
             placeholder="Answer from memory — no assistance..."
             rows={6}
             className="w-full resize-none bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
           />
           <div className="flex items-center justify-between">
             <span className="text-xs text-zinc-600">
               {savedFlash ? <span className="text-zinc-500">Answer saved</span> : '⌘↵ to submit'}
             </span>
             <button onClick={handleSubmitQ} disabled={!currentAnswer.trim() || savedFlash}
               className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-semibold transition-colors">
               {qIdx < questions.length - 1 ? 'Next' : 'Submit'}
             </button>
           </div>
         </div>
       </div>
     );
   }

  // ── Evaluating ──
   if (phase === 'evaluating') {
     const questionCount = root.branches.length + 1;
     return (
       <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 p-6 flex flex-col items-center justify-center gap-4 min-h-[220px]">
         <div className="w-10 h-10 rounded-full border-2 border-zinc-700 flex items-center justify-center">
           <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
         </div>
         <p className="text-zinc-300 text-sm font-medium animate-pulse">Evaluating your answers...</p>
         <p className="text-xs text-zinc-600">All {questionCount} questions at once</p>
       </div>
     );
   }

  // ── Grading sheet ──
   if (phase === 'grading') {
     const rootMax = getRootMaxPoints(root);
     const questions = getQuestionsForRoot(root);
     const totalScore = results.reduce((s, r) => s + (r.score || 0), 0);
     const allPassed = results.every(r => r.passed);
     const dateStr = format(new Date(), 'MMM d, yyyy');
     const prevBest = profileId ? getGauntletRootPoints(profileId, courseId, root.id) : 0;
     const personalBest = Math.max(prevBest, totalScore);

    return (
      <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 p-5 space-y-4">
        {/* Header */}
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-0.5">
            {allPassed ? 'Gauntlet Passed' : 'Gauntlet Results'}
          </p>
          <p className={`text-base font-semibold ${allPassed ? 'text-amber-400' : 'text-zinc-100'}`}>
            {allPassed ? `Gauntlet Passed — ${dateStr}` : `${root.title} — ${dateStr}`}
          </p>
        </div>

        {/* Score bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-zinc-500">Score</span>
            <span className="text-xs text-zinc-500 font-mono">{totalScore} / {rootMax}</span>
          </div>
          <div className="relative h-2 bg-zinc-800 rounded-full overflow-visible">
            <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${getBarColor(totalScore, rootMax)}`}
              style={{ width: `${(totalScore / rootMax) * 100}%` }} />
            {[4, ...root.branches.map((_, i) => 4 + (i + 1) * 3)].map(tick => (
              <div key={tick} className="absolute top-[-3px] bottom-[-3px] w-px bg-zinc-600 z-10" style={{ left: `${(tick / rootMax) * 100}%` }} />
            ))}
          </div>
          <p className="text-xs text-zinc-600 mt-1.5">Personal Best: {personalBest} / {rootMax}</p>
        </div>

        {/* Question rows */}
        <div>
          {results.map((r, i) => (
            <GradingRow key={i} result={r} qMeta={questions[i]} index={i} />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button onClick={handleRetake} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors">
            Retake
          </button>
          <button onClick={() => onComplete(results)} className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors">
            Return to Course
          </button>
        </div>
      </div>
    );
  }

  return null;
}