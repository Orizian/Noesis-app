import React, { useState, useRef } from 'react';
import { useCourse } from '../components/course/CourseContext';
import { useProfile } from '../components/profiles/ProfileContext';
import {
  isAllGauntletsPassed,
  getAbsoluteGauntlet,
  setAbsoluteGauntletSession,
  isAbsoluteGauntletConquered,
  setGauntletCriteriaBulk,
  getTotalGauntletPoints,
} from '../components/profiles/profileStorage';
import { CheckCircle2, XCircle, Trophy, ChevronRight, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import ProfileDropdown from '../components/profiles/ProfileDropdown';
import { format } from 'date-fns';
import { base44 } from '@/api/base44Client';

const GAUNTLET_QUESTIONS = [
  { key: 'root',     label: 'Root Question', maxCriteria: 4 },
  { key: 'branch_1', label: 'Branch 1',      maxCriteria: 3 },
  { key: 'branch_2', label: 'Branch 2',      maxCriteria: 3 },
  { key: 'branch_3', label: 'Branch 3',      maxCriteria: 3 },
];

const TIER_CONFIG = {
  excellent:  { label: 'Excellent',  className: 'bg-violet-950/60 border-violet-700 text-violet-300' },
  great:      { label: 'Great',      className: 'bg-teal-950/60 border-teal-700 text-teal-300' },
  pass:       { label: 'Pass',       className: 'bg-emerald-950/60 border-emerald-700 text-emerald-300' },
  incomplete: { label: 'Incomplete', className: 'bg-zinc-800/60 border-zinc-700 text-zinc-500' },
};

function getBarColor104(pts) {
  if (pts < 32) return 'bg-zinc-500';
  if (pts < 72) return 'bg-emerald-500';
  if (pts < 104) return 'bg-teal-500';
  return 'bg-violet-500';
}

function getBarColor13(pts) {
  if (pts <= 3) return 'bg-zinc-500';
  if (pts <= 8) return 'bg-emerald-500';
  if (pts <= 12) return 'bg-teal-500';
  return 'bg-violet-500';
}

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

function getQuestionText(root, key) {
  if (key === 'root') return root.rootQuestion;
  const idx = parseInt(key.split('_')[1]) - 1;
  return root.branches[idx]?.question || root.rootQuestion;
}

function getRubricCriteria(root, key) {
  const rubricStr = key === 'root' ? root.rubric : (BRANCH_RUBRICS[root.id]?.[key] || root.rubric);
  const matches = [...rubricStr.matchAll(/Criterion\s+\d+:\s*(.+?)(?=Criterion\s+\d+:|$)/gi)];
  return matches.map(m => m[1].trim());
}

// ── Batch evaluate all 32 questions ──────────────────────────────────────────
async function batchEvaluateAll(allQuestions) {
  // allQuestions: [{root, qMeta, answer, rootIndex}]
  const sets = allQuestions.map((q, i) => {
    const question = getQuestionText(q.root, q.qMeta.key);
    const criteria = getRubricCriteria(q.root, q.qMeta.key);
    return `Question ${i + 1} (Root ${q.root.id} — ${q.qMeta.label}):\nQuestion: "${question}"\nCriteria (${q.qMeta.maxCriteria}):\n${criteria.map((c, j) => `  ${j + 1}. ${c}`).join('\n')}\nStudent response: "${q.answer}"`;
  }).join('\n\n---\n\n');

  const prompt = `You are evaluating a student's complete Absolute Gauntlet performance — 32 questions spanning 8 roots of a mechanistic learning course.
Evaluate each response independently against its specific rubric criteria.
Return ONLY a valid JSON array of 32 objects in exact order received. No preamble, no markdown backticks, no explanation outside the JSON.

RUBRIC TIERS:
Root Question — 4 criteria, 1 point each, max 4 points. Tiers: 0-1 = Incomplete, 2 = Pass, 3 = Great, 4 = Excellent
Branch Questions — 3 criteria, 1 point each, max 3 points. Tiers: 0 = Incomplete, 1 = Pass, 2 = Great, 3 = Excellent

A criterion is met only if clearly demonstrated in the response. Do not award partial credit for vague gestures toward the concept. Evaluate understanding demonstrated not specific vocabulary used. Apply criteria consistently across all 32 questions.

Return this exact structure for all 32 objects:
[
  {
    "root_index": 0,
    "question": "root or branch1 or branch2 or branch3",
    "criteria_met": [true, false, true, true],
    "score": 3,
    "tier": "Great",
    "feedback": "1-2 sentences specific to what they wrote",
    "criteria_breakdown": ["Criterion 1 — Met", "Criterion 2 — Not Met"]
  }
]

All 32 questions, criteria, and student responses in order:
${sets}`;

  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    model: 'claude_sonnet_4_6',
    response_json_schema: {
      type: 'object',
      properties: {
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              root_index: { type: 'number' },
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
    return allQuestions.map((q, i) => ({ root_index: q.rootIndex, question: q.qMeta.key, criteria_met: [], score: 0, tier: 'Incomplete', feedback: 'Could not evaluate.', criteria_breakdown: [], passed: false }));
  }

  return allQuestions.map((q, i) => {
    const r = arr[i] || {};
    const criteria = getRubricCriteria(q.root, q.qMeta.key);
    const critMet = Array.isArray(r.criteria_met) ? r.criteria_met : criteria.map(() => false);
    const score = typeof r.score === 'number' ? r.score : critMet.filter(Boolean).length;
    const breakdown = Array.isArray(r.criteria_breakdown) && r.criteria_breakdown.length > 0
      ? r.criteria_breakdown
      : criteria.map((c, j) => `${c} — ${critMet[j] ? 'Met' : 'Not Met'}`);
    const tier = (r.tier || getTier(score, q.qMeta.key === 'root')).toLowerCase();
    const passed = q.qMeta.key === 'root' ? score >= 2 : score >= 1;
    return { root_index: q.rootIndex, question: q.qMeta.key, criteria_met: critMet, score, tier, feedback: r.feedback || '', criteria_breakdown: breakdown, passed };
  });
}

// ── Grading components ────────────────────────────────────────────────────────
function QuestionRow({ result, qMeta }) {
  const [expanded, setExpanded] = useState(false);
  const tier = result.tier || getTier(result.score, qMeta.key === 'root');
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.incomplete;
  return (
    <div className="border-b border-zinc-800/30 last:border-0">
      <button onClick={() => setExpanded(e => !e)} className="w-full flex items-center gap-2 py-2.5 text-left hover:bg-zinc-800/20 transition-colors px-2">
        <ChevronRight className={`w-3 h-3 text-zinc-600 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold text-zinc-300">{qMeta.label}</span>
          <span className="text-xs text-zinc-600 ml-2">{result.score} / {qMeta.maxCriteria}</span>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.className}`}>{cfg.label}</span>
      </button>
      {expanded && (
        <div className="px-6 pb-3 space-y-1.5">
          {result.criteria_breakdown?.map((line, j) => {
            const met = result.criteria_met?.[j];
            return (
              <div key={j} className={`flex items-start gap-2 px-2.5 py-1.5 rounded-lg border text-xs leading-relaxed
                ${met ? 'bg-emerald-950/20 border-emerald-900/30 text-zinc-300' : 'bg-red-950/20 border-red-900/30 text-zinc-400'}`}>
                {met ? <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> : <XCircle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />}
                {line}
              </div>
            );
          })}
          {result.feedback && (
            <div className="px-2.5 py-1.5 rounded-lg border bg-zinc-800/40 border-zinc-700/50 text-xs text-zinc-400 leading-relaxed">
              {result.feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RootSection({ root, rootResults, rootIndex }) {
  const [expanded, setExpanded] = useState(false);
  const rootScore = rootResults.reduce((s, r) => s + (r.score || 0), 0);
  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(e => !e)} className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-zinc-800/20 transition-colors">
        <ChevronRight className={`w-4 h-4 text-zinc-600 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-zinc-200">Root {root.id} — {root.title}</span>
        </div>
        <span className="text-xs font-mono text-zinc-400 flex-shrink-0">{rootScore} / 13</span>
      </button>
      {expanded && (
        <div className="border-t border-zinc-800/50 bg-zinc-900/30">
          {GAUNTLET_QUESTIONS.map((q, qi) => (
            <QuestionRow key={qi} result={rootResults[qi] || { score: 0, tier: 'incomplete', criteria_met: [], criteria_breakdown: [], feedback: '' }} qMeta={q} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Progress bar with root ticks ────────────────────────────────────────────
function AbsoluteProgressBar({ rootIdx, qIdx, rootCount, questionsPerRoot }) {
  const total = rootCount * questionsPerRoot;
  const done = rootIdx * questionsPerRoot + qIdx;
  return (
    <div className="border-b border-zinc-800 px-4 pt-3 pb-2">
      {/* Tick labels */}
      <div className="relative h-4 mb-1">
        {Array.from({ length: rootCount }, (_, i) => i + 1).map(n => (
          <span key={n} className="absolute text-[10px] text-zinc-600 font-mono -translate-x-1/2" style={{ left: `${((n-1) / rootCount) * 100}%` }}>{n}</span>
        ))}
      </div>
      {/* Bar */}
      <div className="relative h-1.5 bg-zinc-800 rounded-full overflow-visible mb-1">
        <div className="h-full bg-red-700 rounded-full transition-all duration-500" style={{ width: `${(done / total) * 100}%` }} />
        {Array.from({ length: rootCount - 1 }, (_, i) => i + 1).map(n => (
          <div key={n} className="absolute top-[-3px] bottom-[-3px] w-px bg-zinc-600 z-10" style={{ left: `${(n / rootCount) * 100}%` }} />
        ))}
      </div>
      <p className="text-xs text-zinc-600 mt-1">Root {rootIdx + 1} of {rootCount} — Question {qIdx + 1} of {questionsPerRoot}</p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AbsoluteGauntletPage() {
  const { activeProfileId, refresh } = useProfile();
  const { activeCourse } = useCourse();
  const ROOTS = activeCourse.roots;
  const BRANCH_RUBRICS = activeCourse.branchRubrics;
  const navigate = useNavigate();

  const conquered = activeProfileId ? isAbsoluteGauntletConquered(activeProfileId) : false;
  const eligible = activeProfileId ? isAllGauntletsPassed(activeProfileId) : false;
  const saved = activeProfileId ? getAbsoluteGauntlet(activeProfileId) : null;
  const hasSession = saved?.inProgress && saved?.answers;

  // Session state
  const [phase, setPhase] = useState(() => {
    if (hasSession) return 'resume';
    return 'caution';
  });
  const [rootIdx, setRootIdx] = useState(() => {
    if (hasSession && saved?.rootIdx != null) return saved.rootIdx;
    return 0;
  });
  const [qIdx, setQIdx] = useState(() => {
    if (hasSession && saved?.qIdx != null) return saved.qIdx;
    return 0;
  });
  // All answers: flat array of 32 (rootIdx*4 + qIdx)
  const totalQuestions = ROOTS.reduce((sum, r) => sum + 1 + r.branches.length, 0);
  const questionsPerRoot = GAUNTLET_QUESTIONS.length;

  const [allAnswers, setAllAnswers] = useState(() => {
    if (hasSession && saved?.answers) return saved.answers;
    return Array(totalQuestions).fill('');
  });
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);
  const [finalResults, setFinalResults] = useState(null); // flat array of 32 results

  const textareaRef = useRef(null);

  if (!eligible && !conquered) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <Link to={createPageUrl('CourseOverview')} className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-8">
            <ArrowLeft className="w-4 h-4" /> Course Overview
          </Link>
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 p-8 text-center">
            <p className="text-zinc-500 text-sm">Pass all 8 Root Gauntlets to unlock The Absolute Gauntlet.</p>
          </div>
        </div>
      </div>
    );
  }

  if (conquered && phase === 'caution') {
    const conqueredDate = format(new Date(saved?.conqueredAt || Date.now()), 'MMM d, yyyy');
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <Link to={createPageUrl('CourseOverview')} className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-8">
            <ArrowLeft className="w-4 h-4" /> Course Overview
          </Link>
          <div className="border border-yellow-700/40 rounded-2xl bg-yellow-950/10 p-8 text-center space-y-4">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto" />
            <p className="text-yellow-400 font-bold text-2xl">The Absolute Gauntlet — Conquered</p>
            <p className="text-zinc-500 text-sm">{conqueredDate}</p>
            <button onClick={() => setPhase('caution_retake')} className="mt-2 px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors">
              Retake
            </button>
          </div>
        </div>
      </div>
    );
  }

  const root = ROOTS[rootIdx];

  const startFresh = () => {
    const newAnswers = Array(totalQuestions).fill('');
    setAllAnswers(newAnswers);
    setRootIdx(0); setQIdx(0); setCurrentAnswer('');
    if (activeProfileId) setAbsoluteGauntletSession(activeProfileId, { inProgress: true, rootIdx: 0, qIdx: 0, answers: newAnswers, startedAt: Date.now() });
    setPhase('run');
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const saveProgress = () => {
    if (activeProfileId) setAbsoluteGauntletSession(activeProfileId, { inProgress: true, rootIdx, qIdx, answers: allAnswers });
  };

  const handleSubmitQ = async () => {
    if (!currentAnswer.trim()) return;
    const answerIndex = rootIdx * 4 + qIdx;
    const newAnswers = [...allAnswers];
    newAnswers[answerIndex] = currentAnswer;
    setAllAnswers(newAnswers);

    setSavedFlash(true);
    await new Promise(r => setTimeout(r, 500));
    setSavedFlash(false);

    if (qIdx < questionsPerRoot - 1) {
      const newQ = qIdx + 1;
      setQIdx(newQ);
      setCurrentAnswer('');
      if (activeProfileId) setAbsoluteGauntletSession(activeProfileId, { inProgress: true, rootIdx, qIdx: newQ, answers: newAnswers });
      setTimeout(() => textareaRef.current?.focus(), 50);
    } else {
      // End of this root
      if (rootIdx < ROOTS.length - 1) {
        setPhase('root_transition');
        setCurrentAnswer('');
        if (activeProfileId) setAbsoluteGauntletSession(activeProfileId, { inProgress: true, rootIdx, qIdx: questionsPerRoot - 1, answers: newAnswers });
      } else {
        // All questions done — batch evaluate
        setPhase('evaluating');
        const allQ = [];
        ROOTS.forEach((r, ri) => {
          GAUNTLET_QUESTIONS.forEach((q, qi) => {
            allQ.push({ root: r, qMeta: q, answer: newAnswers[ri * questionsPerRoot + qi], rootIndex: ri });
          });
        });
        const results = await batchEvaluateAll(allQ);
        // Save to storage
        if (activeProfileId) {
          ROOTS.forEach((r, ri) => {
            const bulk = {};
            GAUNTLET_QUESTIONS.forEach((q, qi) => { bulk[q.key] = results[ri * questionsPerRoot + qi]?.score || 0; });
            setGauntletCriteriaBulk(activeProfileId, r.id, bulk);
          });
          const allPassed = results.every(r => r.passed);
          if (allPassed) {
            const ts = Date.now();
            setAbsoluteGauntletSession(activeProfileId, { conqueredAt: ts, inProgress: false });
          } else {
            setAbsoluteGauntletSession(activeProfileId, { inProgress: false });
          }
          refresh();
        }
        setFinalResults(results);
        setPhase('grading');
      }
    }
  };

  const handleContinueRoot = () => {
    const newRootIdx = rootIdx + 1;
    setRootIdx(newRootIdx);
    setQIdx(0);
    setCurrentAnswer('');
    setPhase('run');
    if (activeProfileId) setAbsoluteGauntletSession(activeProfileId, { inProgress: true, rootIdx: newRootIdx, qIdx: 0, answers: allAnswers });
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleSaveAndExit = () => {
    saveProgress();
    navigate(createPageUrl('CourseOverview'));
  };

  // ── Caution ──
  if (phase === 'caution' || phase === 'caution_retake') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-8">
            <Link to={createPageUrl('CourseOverview')} className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300">
              <ArrowLeft className="w-4 h-4" /> Course Overview
            </Link>
            <ProfileDropdown />
          </div>
          <div className="border border-red-800/40 rounded-2xl bg-red-950/10 p-8 space-y-5">
            <h1 className="text-xl font-bold text-red-300">The Absolute Gauntlet</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              8 roots. 32 questions. No feedback mid-run. All results revealed at the end. One batch evaluation.
            </p>
            <div className="flex gap-3">
              <button onClick={startFresh} className="flex-1 py-3 rounded-xl bg-red-800/70 hover:bg-red-700/80 text-white font-bold text-sm transition-colors">Begin</button>
              <Link to={createPageUrl('CourseOverview')} className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors text-center">Cancel</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Resume ──
  if (phase === 'resume') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <Link to={createPageUrl('CourseOverview')} className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-8">
            <ArrowLeft className="w-4 h-4" /> Course Overview
          </Link>
          <div className="border border-red-800/40 rounded-2xl bg-red-950/10 p-8 space-y-5">
            <h1 className="text-xl font-bold text-red-300">The Absolute Gauntlet — In Progress</h1>
            <p className="text-sm text-zinc-400">Saved at Root {rootIdx + 1}, Question {qIdx + 1}. Resume from here.</p>
            <div className="flex gap-3">
              <button onClick={() => { setPhase('run'); setTimeout(() => textareaRef.current?.focus(), 100); }} className="flex-1 py-3 rounded-xl bg-red-800/70 hover:bg-red-700/80 text-white font-bold text-sm transition-colors">Resume</button>
              <button onClick={startFresh} className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors">Start Fresh</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Run ──
  if (phase === 'run') {
    const qMeta = GAUNTLET_QUESTIONS[qIdx];
    const isLastQ = rootIdx === ROOTS.length - 1 && qIdx === questionsPerRoot - 1;
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 overflow-hidden">
            <AbsoluteProgressBar rootIdx={rootIdx} qIdx={qIdx} rootCount={ROOTS.length} questionsPerRoot={questionsPerRoot} />
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-mono text-zinc-600 mb-1">ROOT {String(root.id).padStart(2,'0')} — {root.title}</p>
                <p className="text-xs font-semibold text-red-400 mb-1.5">{qMeta.label}</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{getQuestionText(root, qMeta.key)}</p>
              </div>
              <textarea
                ref={textareaRef}
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmitQ(); }}
                placeholder="Answer from memory — no assistance..."
                rows={7}
                className="w-full resize-none bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">
                  {savedFlash ? <span className="text-zinc-500">Answer saved</span> : '⌘↵ to submit'}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveAndExit} className="px-3 py-2 rounded-xl border border-zinc-700 text-zinc-500 text-xs hover:bg-zinc-800 transition-colors">
                    Save & Exit
                  </button>
                  <button onClick={handleSubmitQ} disabled={!currentAnswer.trim() || savedFlash}
                    className="px-6 py-2.5 rounded-xl bg-red-900/60 hover:bg-red-800/70 disabled:bg-zinc-700 disabled:text-zinc-500 text-red-200 text-sm font-semibold transition-colors">
                    {isLastQ ? 'Submit Final' : qIdx < 3 ? 'Next' : 'Root Complete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Root transition ──
  if (phase === 'root_transition') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-6 animate-in fade-in duration-500">
          <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">Root {rootIdx + 1} of {ROOTS.length} Complete</p>
          <p className="text-3xl font-bold text-zinc-100">{ROOTS[rootIdx].title}</p>
          <p className="text-xs text-zinc-600">Continuing to next root. No scores during the run.</p>
          <button onClick={handleContinueRoot}
            className="w-full py-3 rounded-xl bg-red-900/60 hover:bg-red-800/70 text-red-200 font-semibold text-sm transition-colors">
            Continue to Root {rootIdx + 2}
          </button>
          <button onClick={handleSaveAndExit} className="w-full py-2 rounded-xl text-zinc-600 text-xs hover:text-zinc-400 transition-colors">
            Save & Exit
          </button>
        </div>
      </div>
    );
  }

  // ── Evaluating ──
  if (phase === 'evaluating') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-5">
          <div className="w-12 h-12 rounded-full border-2 border-zinc-700 flex items-center justify-center mx-auto">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          </div>
          <p className="text-zinc-300 font-medium animate-pulse">Evaluating your complete performance...</p>
          <p className="text-xs text-zinc-600">All {totalQuestions} questions. This takes a moment.</p>
          <p className="text-xs text-zinc-700 italic">Uses an advanced model for accuracy.</p>
        </div>
      </div>
    );
  }

  // ── Grading sheet ──
  if (phase === 'grading' && finalResults) {
    const totalScore = finalResults.reduce((s, r) => s + (r.score || 0), 0);
    const maxScore = ROOTS.reduce((sum, root) => sum + 4 + root.branches.length * 3, 0);
    const allPassed = finalResults.every(r => r.passed);
    const dateStr = format(new Date(), 'MMM d, yyyy');
    const prevBest = activeProfileId ? getTotalGauntletPoints(activeProfileId) : 0;
    const personalBest = Math.max(prevBest, totalScore);

    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
          {/* Header */}
          <div>
            {allPassed && <Star className="w-6 h-6 text-amber-400 fill-amber-400 mb-2" />}
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-0.5">
              {allPassed ? 'Absolute Gauntlet Conquered' : 'Absolute Gauntlet Results'}
            </p>
            <h1 className={`text-2xl font-bold ${allPassed ? 'text-amber-400' : 'text-zinc-100'}`}>
              {allPassed ? `Absolute Gauntlet Conquered — ${dateStr}` : `Absolute Gauntlet Results — ${dateStr}`}
            </h1>
          </div>

          {/* Master score bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-zinc-500">Total Score</span>
              <span className="text-xs text-zinc-500 font-mono">{totalScore} / {maxScore}</span>
            </div>
            <div className="relative h-2.5 bg-zinc-800 rounded-full overflow-visible">
              <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${getBarColor104(totalScore)}`}
                style={{ width: `${(totalScore / maxScore) * 100}%` }} />
              {[Math.round(maxScore * 0.3), Math.round(maxScore * 0.69), maxScore].map(tick => (
                <div key={tick} className="absolute top-[-3px] bottom-[-3px] w-px bg-zinc-600 z-10" style={{ left: `${(tick / maxScore) * 100}%` }} />
              ))}
            </div>
            <p className="text-xs text-zinc-600 mt-1.5">Personal Best: {personalBest} / {maxScore}</p>
          </div>

          {/* Root sections */}
          <div className="space-y-2">
            {ROOTS.map((r, ri) => (
              <RootSection
                key={r.id}
                root={r}
                rootResults={finalResults.slice(ri * questionsPerRoot, ri * questionsPerRoot + questionsPerRoot)}
                rootIndex={ri}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button onClick={startFresh} className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors">
              Retake
            </button>
            <button onClick={() => { refresh(); navigate(createPageUrl('CourseOverview')); }}
              className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors">
              Return to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}