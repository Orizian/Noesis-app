import React, { useState, useRef, useEffect } from 'react';
import { useCourse } from '../components/course/CourseContext';
import { useProfile } from '../components/profiles/ProfileContext';
import {
  isAllGauntletsPassed,
  getAbsoluteGauntlet,
  setAbsoluteGauntletSession,
  isAbsoluteGauntletConquered,
  setGauntletCriteriaBulk,
  getTotalGauntletPoints,
  saveGauntletCheckpoint,
  loadGauntletCheckpoint,
  clearGauntletCheckpoint,
} from '../components/profiles/profileStorage';
import { CheckCircle2, XCircle, Trophy, ChevronRight, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import ProfileDropdown from '../components/profiles/ProfileDropdown';
import { format } from 'date-fns';
import { base44 } from '@/api/base44Client';
import { getQuestionsForRoot } from '../components/course/RootGauntletFlow';

// getQuestionsForRoot moved to RootGauntletFlow.jsx — import it if needed
// For AbsoluteGauntlet, construct questions dynamically per root

const TIER_CONFIG = {
  excellent:  { label: 'Excellent',  className: 'bg-violet-950/60 border-violet-700 text-violet-300' },
  great:      { label: 'Great',      className: 'bg-teal-950/60 border-teal-700 text-teal-300' },
  pass:       { label: 'Pass',       className: 'bg-emerald-950/60 border-emerald-700 text-emerald-300' },
  incomplete: { label: 'Incomplete', className: 'bg-zinc-800/60 border-zinc-700 text-zinc-500' },
};

function getBarColorDynamic(pts, max) {
  const pct = max > 0 ? pts / max : 0;
  if (pct < 0.31) return 'bg-zinc-500';
  if (pct < 0.69) return 'bg-emerald-500';
  if (pct < 1) return 'bg-teal-500';
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

function getRubricCriteria(root, key, branchRubrics) {
  const rubricStr = key === 'root' ? root.rubric : (branchRubrics[root.id]?.[key] || root.rubric);
  const matches = [...rubricStr.matchAll(/Criterion\s+\d+:\s*(.+?)(?=Criterion\s+\d+:|$)/gi)];
  return matches.map(m => m[1].trim());
}

// ── Evaluate one root (4 questions) ────────────────────────────────────────────
async function evaluateRoot(root, rootAnswers, branchRubrics) {
  // rootAnswers: array of 4 answer strings in order [root, branch_1, branch_2, branch_3]
  const sets = GAUNTLET_QUESTIONS.map((q, i) => {
    const question = getQuestionText(root, q.key);
    const criteria = getRubricCriteria(root, q.key, branchRubrics);
    return `${q.label}:\nQuestion: "${question}"\nCriteria (${q.maxCriteria}):\n${criteria.map((c, j) => `  ${j+1}. ${c}`).join('\n')}\nStudent response: "${rootAnswers[i]}"`;
  }).join('\n\n---\n\n');

  const prompt = `You are evaluating a student's performance on one root of a mechanistic learning course.
Evaluate each of the 4 responses independently against its specific rubric criteria.
Return ONLY a valid JSON array of 4 objects in exact order. No preamble, no markdown backticks, no explanation outside the JSON.

RUBRIC TIERS:
Root Question — 4 criteria, 1 point each, max 4 points. Tiers: 0-1 = Incomplete, 2 = Pass, 3 = Great, 4 = Excellent
Branch Questions — 3 criteria, 1 point each, max 3 points. Tiers: 0 = Incomplete, 1 = Pass, 2 = Great, 3 = Excellent

A criterion is met only if clearly demonstrated in the response. Evaluate understanding demonstrated, not specific vocabulary used.
If the student response is "[Skipped]", score it 0 across all criteria with feedback "Question skipped."

Return this exact structure for all 4 objects:
[
  {
    "question": "root or branch_1 or branch_2 or branch_3",
    "criteria_met": [true, false, true, true],
    "score": 3,
    "tier": "Great",
    "feedback": "1-2 sentences specific to what they wrote",
    "criteria_breakdown": ["Criterion 1 — Met", "Criterion 2 — Not Met"]
  }
]

Root: ${root.title}
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

  return GAUNTLET_QUESTIONS.map((q, i) => {
    const r = arr?.[i] || {};
    const criteria = getRubricCriteria(root, q.key, branchRubrics);
    const critMet = Array.isArray(r.criteria_met) ? r.criteria_met : criteria.map(() => false);
    const score = typeof r.score === 'number' ? r.score : critMet.filter(Boolean).length;
    const breakdown = Array.isArray(r.criteria_breakdown) && r.criteria_breakdown.length > 0
      ? r.criteria_breakdown
      : criteria.map((c, j) => `${c} — ${critMet[j] ? 'Met' : 'Not Met'}`);
    const tier = (r.tier || getTier(score, q.key === 'root')).toLowerCase();
    const passed = q.key === 'root' ? score >= 2 : score >= 1;
    const feedback = r.feedback || (rootAnswers[i] === '[Skipped]' ? 'Question skipped.' : 'Could not evaluate.');
    return { question: q.key, criteria_met: critMet, score, tier, feedback, criteria_breakdown: breakdown, passed };
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
          {getQuestionsForRoot(root).map((q, qi) => (
             <QuestionRow key={qi} result={rootResults[qi] || { score: 0, tier: 'incomplete', criteria_met: [], criteria_breakdown: [], feedback: '' }} qMeta={q} />
           ))}
        </div>
      )}
    </div>
  );
}

// ── Progress bar with 8 root ticks ────────────────────────────────────────────
function AbsoluteProgressBar({ rootIdx, qIdx, rootCount }) {
  const total = rootCount * 4;
  const done = rootIdx * 4 + qIdx;
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
      <p className="text-xs text-zinc-600 mt-1">Root {rootIdx + 1} of {rootCount} — Question {qIdx + 1} of 4</p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AbsoluteGauntletPage() {
  const { activeProfileId, refresh } = useProfile();
  const { roots, branchRubrics, meta } = useCourse();
  const courseId = meta.id;
  const navigate = useNavigate();

  const conquered = activeProfileId ? isAbsoluteGauntletConquered(activeProfileId, courseId) : false;
  const eligible = activeProfileId ? isAllGauntletsPassed(activeProfileId, courseId, roots.length) : false;
  const saved = activeProfileId ? getAbsoluteGauntlet(activeProfileId, courseId) : null;
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
  // All answers: flat array of variable length (sum of all root question counts)
  const totalQuestions = roots.reduce((sum, r) => sum + 1 + r.branches.length, 0);
  
  // Helper: compute flat index for a given (rootIdx, qIdx)
  const flatIndexForQuestion = (ri, qi) => {
    let idx = 0;
    for (let i = 0; i < ri; i++) {
      idx += 1 + roots[i].branches.length;
    }
    return idx + qi;
  };

  // Helper: compute the number of questions for a given root
  const questionsPerRoot = (ri) => 1 + roots[ri].branches.length;
  const [allAnswers, setAllAnswers] = useState(() => {
    if (hasSession && saved?.answers) return saved.answers;
    return Array(totalQuestions).fill('');
  });
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);
  const [finalResults, setFinalResults] = useState(null); // flat array of 32 results
  const [evalError, setEvalError] = useState(null);
  const [evalProgress, setEvalProgress] = useState(0);
  const [checkpointPrompt, setCheckpointPrompt] = useState(() => {
    if (!activeProfileId) return false;
    const cp = loadGauntletCheckpoint(activeProfileId, meta.id);
    return cp && (Date.now() - cp.savedAt < 86400000) ? cp : false;
  });

  const textareaRef = useRef(null);

  // Save state on page unload
  useEffect(() => {
    const handleUnload = () => {
      if (phase === 'run' || phase === 'root_transition') {
        if (activeProfileId) {
          setAbsoluteGauntletSession(activeProfileId, courseId, {
            inProgress: true,
            rootIdx,
            qIdx,
            answers: allAnswers,
          });
        }
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [phase, rootIdx, qIdx, allAnswers, activeProfileId, courseId]);

  if (!eligible && !conquered) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <Link to={createPageUrl('CourseOverview')} className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-8">
            <ArrowLeft className="w-4 h-4" /> Course Overview
          </Link>
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 p-8 text-center">
            <p className="text-zinc-500 text-sm">Pass all {roots.length} Root Gauntlets to unlock The Absolute Gauntlet.</p>
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

  const root = roots[rootIdx];

  const startFresh = () => {
    const newAnswers = Array(totalQuestions).fill('');
    setAllAnswers(newAnswers);
    setRootIdx(0); setQIdx(0); setCurrentAnswer('');
    if (activeProfileId) {
      setAbsoluteGauntletSession(activeProfileId, courseId, { inProgress: true, rootIdx: 0, qIdx: 0, answers: newAnswers, startedAt: Date.now() });
      clearGauntletCheckpoint(activeProfileId, courseId);
    }
    setCheckpointPrompt(false);
    setPhase('run');
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const saveProgress = () => {
    if (activeProfileId) setAbsoluteGauntletSession(activeProfileId, courseId, { inProgress: true, rootIdx, qIdx, answers: allAnswers });
  };

  const handleSubmitQ = async (answerOverride) => {
    const answer = answerOverride ?? currentAnswer;
    if (!answer.trim()) return;
    const answerIndex = flatIndexForQuestion(rootIdx, qIdx);
    const newAnswers = [...allAnswers];
    newAnswers[answerIndex] = answer;
    setAllAnswers(newAnswers);

    // Checkpoint every 8 answers — save answeredQuestions up to the current length
    // answeredQuestions.length naturally equals the next unanswered index
    const answeredCount = newAnswers.filter(a => a !== '').length;
    if (activeProfileId && answeredCount > 0 && answeredCount % 8 === 0) {
      saveGauntletCheckpoint(activeProfileId, courseId, newAnswers.slice(0, answeredCount));
    }

    setSavedFlash(true);
    await new Promise(r => setTimeout(r, 500));
    setSavedFlash(false);

    const qsPerRoot = questionsPerRoot(rootIdx);
    if (qIdx < qsPerRoot - 1) {
      const newQ = qIdx + 1;
      setQIdx(newQ);
      setCurrentAnswer('');
      if (activeProfileId) setAbsoluteGauntletSession(activeProfileId, courseId, { inProgress: true, rootIdx, qIdx: newQ, answers: newAnswers });
      setTimeout(() => textareaRef.current?.focus(), 50);
    } else {
      // End of this root
      if (rootIdx < roots.length - 1) {
        setPhase('root_transition');
        setCurrentAnswer('');
        if (activeProfileId) setAbsoluteGauntletSession(activeProfileId, courseId, { inProgress: true, rootIdx, qIdx: qsPerRoot - 1, answers: newAnswers });
      } else {
        // All done — sequential per-root evaluation
        setPhase('evaluating');
        setEvalProgress(0);
        try {
          const allResults = [];
          for (let ri = 0; ri < roots.length; ri++) {
            const qCount = questionsPerRoot(ri);
            let startIdx = 0;
            for (let i = 0; i < ri; i++) {
              startIdx += questionsPerRoot(i);
            }
            const rootAnswers = newAnswers.slice(startIdx, startIdx + qCount);
            const rootResults = await evaluateRoot(roots[ri], rootAnswers, branchRubrics);
            console.log(`Root ${ri + 1} evaluation:`, JSON.stringify(rootResults));
            allResults.push(...rootResults);
            setEvalProgress(ri + 1);
          }

          if (activeProfileId) {
            roots.forEach((r, ri) => {
              const bulk = {};
              const questions = getQuestionsForRoot(r);
              questions.forEach((q, qi) => {
                let resultIdx = 0;
                for (let i = 0; i < ri; i++) {
                  resultIdx += questionsPerRoot(i);
                }
                bulk[q.key] = allResults[resultIdx + qi]?.score || 0;
              });
              setGauntletCriteriaBulk(activeProfileId, courseId, r.id, bulk);
            });
            const allPassed = allResults.every(r => r.passed);
            if (allPassed) {
              setAbsoluteGauntletSession(activeProfileId, courseId, { conqueredAt: Date.now(), inProgress: false });
            } else {
              setAbsoluteGauntletSession(activeProfileId, courseId, { inProgress: false });
            }
            clearGauntletCheckpoint(activeProfileId, courseId);
            refresh();
          }
          setFinalResults(allResults);
          setPhase('grading');
        } catch (err) {
          console.error('Gauntlet evaluation failed:', err);
          setEvalError(err.message || 'Unknown error');
          setPhase('eval_error');
        }
      }
    }
  };

  const handleContinueRoot = () => {
    const newRootIdx = rootIdx + 1;
    setRootIdx(newRootIdx);
    setQIdx(0);
    setCurrentAnswer('');
    setPhase('run');
    if (activeProfileId) setAbsoluteGauntletSession(activeProfileId, courseId, { inProgress: true, rootIdx: newRootIdx, qIdx: 0, answers: allAnswers });
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleSaveAndExit = () => {
    saveProgress();
    navigate(createPageUrl('CourseOverview'));
  };

  // ── Checkpoint resume prompt ──
  if (checkpointPrompt && phase === 'caution') {
    const answeredCount = checkpointPrompt.answeredQuestions.filter(a => a !== '').length;
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-8">
            <Link to={createPageUrl('CourseOverview')} className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300">
              <ArrowLeft className="w-4 h-4" /> Course Overview
            </Link>
            <ProfileDropdown />
          </div>
          <div className="border border-amber-800/40 rounded-2xl bg-amber-950/10 p-8 space-y-4">
            <h1 className="text-xl font-bold text-amber-300">Saved Attempt Detected</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {(() => {
                const nextIdx = checkpointPrompt.answeredQuestions.length;
                const resumeRootIdx = Math.floor(nextIdx / 4);
                const resumeQIdx = nextIdx % 4;
                return `Resume from Root ${resumeRootIdx + 1}, Question ${resumeQIdx + 1} (${nextIdx} of ${totalQuestions} answered).`;
              })()}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const cp = checkpointPrompt;
                  // Restore answers — pad to full length
                  const restored = [...cp.answeredQuestions, ...Array(totalQuestions - cp.answeredQuestions.length).fill('')];
                  setAllAnswers(restored);
                  // Next index is always answeredQuestions.length — points to first unanswered slot
                  const nextIdx = cp.answeredQuestions.length;
                  // If nextIdx lands exactly on a root boundary (i.e. qIdx would be 0 but we just finished
                  // the previous root), that's fine — rootIdx * 4 + 0 is the first question of the next root.
                  const ri = Math.floor(nextIdx / 4);
                  const qi = nextIdx % 4;
                  // Guard: if somehow nextIdx >= totalQuestions we're done — shouldn't happen
                  setRootIdx(Math.min(ri, roots.length - 1));
                  setQIdx(qi < 4 ? qi : 0);
                  setCheckpointPrompt(false);
                  setPhase('run');
                  setTimeout(() => textareaRef.current?.focus(), 100);
                }}
                className="flex-1 py-3 rounded-xl bg-amber-800/60 hover:bg-amber-700/70 text-amber-200 font-bold text-sm transition-colors"
              >
                Resume
              </button>
              <button
                onClick={() => { clearGauntletCheckpoint(activeProfileId, courseId); setCheckpointPrompt(false); }}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              {roots.length} roots. {roots.length * 4} questions. No feedback mid-run. All results revealed at the end. One batch evaluation.
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
    const questions = getQuestionsForRoot(root);
    const qMeta = questions[qIdx];
    const isLastQ = rootIdx === roots.length - 1 && qIdx === questions.length - 1;
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 overflow-hidden">
            <AbsoluteProgressBar rootIdx={rootIdx} qIdx={qIdx} rootCount={roots.length} />
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
                    <button onClick={() => handleSubmitQ('[Skipped]')} disabled={savedFlash}
                       className="px-3 py-2 rounded-xl border border-zinc-700 text-zinc-600 text-xs hover:bg-zinc-800 transition-colors disabled:opacity-50">
                       Skip
                     </button>
                    <button onClick={handleSubmitQ} disabled={!currentAnswer.trim() || savedFlash}
                      className="px-6 py-2.5 rounded-xl bg-red-900/60 hover:bg-red-800/70 disabled:bg-zinc-700 disabled:text-zinc-500 text-red-200 text-sm font-semibold transition-colors">
                      {isLastQ ? 'Submit Final' : qIdx < questions.length - 1 ? 'Next' : 'Root Complete'}
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
          <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">Root {rootIdx + 1} of {roots.length} Complete</p>
          <p className="text-3xl font-bold text-zinc-100">{roots[rootIdx].title}</p>
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
    const progressPct = roots.length > 0 ? (evalProgress / roots.length) * 100 : 0;
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-12 h-12 rounded-full border-2 border-zinc-700 flex items-center justify-center mx-auto">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          </div>
          <p className="text-zinc-300 font-medium">Evaluating Root {evalProgress} of {roots.length}...</p>
          <div className="space-y-2">
            <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 h-full bg-red-600 transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-xs text-zinc-600">{evalProgress} of {roots.length} roots evaluated</p>
          </div>
          <p className="text-xs text-zinc-700 italic">Uses an advanced model for accuracy.</p>
        </div>
      </div>
    );
  }

  // ── Evaluation Error ──
  if (phase === 'eval_error') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <Link to={createPageUrl('CourseOverview')} className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-8">
            <ArrowLeft className="w-4 h-4" /> Course Overview
          </Link>
          <div className="border border-red-800/40 rounded-2xl bg-red-950/10 p-8 space-y-5">
            <h1 className="text-xl font-bold text-red-300">Evaluation Failed</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              This is usually a temporary issue. Your answers have been saved — tap Retry to try again.
            </p>
            {evalError && (
              <p className="text-xs text-zinc-600 font-mono bg-zinc-900/50 p-3 rounded border border-zinc-800">
                {evalError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                    setEvalError(null);
                    setEvalProgress(0);
                    setPhase('evaluating');
                    // Re-trigger evaluation with sequential per-root loop
                    (async () => {
                      try {
                        const allResults = [];
                        for (let ri = 0; ri < roots.length; ri++) {
                          const qCount = questionsPerRoot(ri);
                          let startIdx = 0;
                          for (let i = 0; i < ri; i++) {
                            startIdx += questionsPerRoot(i);
                          }
                          const rootAnswers = allAnswers.slice(startIdx, startIdx + qCount);
                          const rootResults = await evaluateRoot(roots[ri], rootAnswers, branchRubrics);
                          console.log(`Root ${ri + 1} evaluation (retry):`, JSON.stringify(rootResults));
                          allResults.push(...rootResults);
                          setEvalProgress(ri + 1);
                        }
                        if (activeProfileId) {
                          roots.forEach((r, ri) => {
                            const bulk = {};
                            const questions = getQuestionsForRoot(r);
                            questions.forEach((q, qi) => {
                              let resultIdx = 0;
                              for (let i = 0; i < ri; i++) {
                                resultIdx += questionsPerRoot(i);
                              }
                              bulk[q.key] = allResults[resultIdx + qi]?.score || 0;
                            });
                            setGauntletCriteriaBulk(activeProfileId, courseId, r.id, bulk);
                          });
                          const allPassed = allResults.every(r => r.passed);
                          if (allPassed) {
                            setAbsoluteGauntletSession(activeProfileId, courseId, { conqueredAt: Date.now(), inProgress: false });
                          } else {
                            setAbsoluteGauntletSession(activeProfileId, courseId, { inProgress: false });
                          }
                          clearGauntletCheckpoint(activeProfileId, courseId);
                          refresh();
                        }
                        setFinalResults(allResults);
                        setPhase('grading');
                      } catch (retryErr) {
                        console.error('Gauntlet evaluation retry failed:', retryErr);
                        setEvalError(retryErr.message || 'Unknown error');
                        setPhase('eval_error');
                      }
                    })();
                  }}
                className="flex-1 py-3 rounded-xl bg-red-800/70 hover:bg-red-700/80 text-white font-bold text-sm transition-colors"
              >
                Retry
              </button>
              <button
                onClick={handleSaveAndExit}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors"
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Grading sheet ──
  if (phase === 'grading' && finalResults) {
    const totalScore = finalResults.reduce((s, r) => s + (r.score || 0), 0);
    const allPassed = finalResults.every(r => r.passed);
    const dateStr = format(new Date(), 'MMM d, yyyy');
    const prevBest = activeProfileId ? getTotalGauntletPoints(activeProfileId, courseId, roots.length) : 0;
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
             {(() => {
               const maxPts = roots.reduce((sum, r) => sum + (4 + r.branches.length * 3), 0);
               return (
                 <>
                   <div className="flex items-center justify-between mb-1.5">
                     <span className="text-xs text-zinc-500">Total Score</span>
                     <span className="text-xs text-zinc-500 font-mono">{totalScore} / {maxPts}</span>
                   </div>
                   <div className="relative h-2.5 bg-zinc-800 rounded-full overflow-visible">
                     <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${getBarColorDynamic(totalScore, maxPts)}`}
                       style={{ width: `${(totalScore / maxPts) * 100}%` }} />
                   </div>
                   <p className="text-xs text-zinc-600 mt-1.5">Personal Best: {personalBest} / {maxPts}</p>
                 </>
               );
             })()}
            </div>

          {/* Root sections */}
          <div className="space-y-2">
            {roots.map((r, ri) => {
              let resultIdx = 0;
              for (let i = 0; i < ri; i++) {
                resultIdx += questionsPerRoot(i);
              }
              const qCount = questionsPerRoot(ri);
              return (
                <RootSection
                  key={r.id}
                  root={r}
                  rootResults={finalResults.slice(resultIdx, resultIdx + qCount)}
                  rootIndex={ri}
                />
              );
            })}
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