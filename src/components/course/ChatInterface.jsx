import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCourse } from './CourseContext';
import MessageBubble from './MessageBubble';
import ColdAttemptPanel from './ColdAttemptPanel';
import { useProfile } from '../profiles/ProfileContext';
import { incrementColdAttempt, getColdAttemptCount, addEncounteredTerm, setQuestionCriteria, setBestTier, getQualityTier } from '../profiles/profileStorage';

export default function ChatInterface({ root, mode, questionType, onPassColdAttempt, onSwitchMode, onCompetencyChange, onTermEncountered, dictFocusedTerm }) {
  const { activeProfileId } = useProfile();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Cold attempt state
  const [coldPhase, setColdPhase] = useState('input'); // 'input' | 'evaluating' | 'results'
  const [coldResult, setColdResult] = useState(null);
  const [coldAttemptNum, setColdAttemptNum] = useState(1);
  const [pendingColdResult, setPendingColdResult] = useState(null);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const getQuestion = () => {
    if (questionType === 'root') return root.rootQuestion;
    const branchIndex = parseInt(questionType.split('_')[1]) - 1;
    return root.branches[branchIndex]?.question || root.rootQuestion;
  };

  const getQuestionLabel = () => {
    if (questionType === 'root') return 'Root Question';
    const branchIndex = parseInt(questionType.split('_')[1]) - 1;
    return `Branch ${branchIndex + 1} — ${root.branches[branchIndex]?.label}`;
  };

  const getRubric = () => {
    if (questionType === 'root') return root.rubric;
    const branchKey = questionType;
    const branchRubrics = BRANCH_RUBRICS[root.id];
    return branchRubrics?.[branchKey] || root.rubric;
  };

  useEffect(() => {
    setMessages([]);
    setInitialized(false);
    setColdPhase('input');
    setColdResult(null);
    setPendingColdResult(null);
    setInput('');
    if (activeProfileId && mode === 'cold') {
      const count = getColdAttemptCount(activeProfileId, root.id, questionType);
      setColdAttemptNum(count + 1);
    }
  }, [root.id, mode, questionType, dictFocusedTerm?.term]);

  useEffect(() => {
    if (initialized) return;
    if (mode === 'teach') {
      if (dictFocusedTerm) initDictFocusedMode();
      else initTeachMode();
    } else if (mode === 'practice' || mode === 'cold') {
      startPracticeOrCold();
    }
    setInitialized(true);
  }, [initialized]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, coldPhase]);

  const buildSystemPrompt = () => {
    const question = getQuestion();
    const rubric = getRubric();

    // Dictionary focused mode — separate system prompt
    if (mode === 'teach' && dictFocusedTerm) {
      return `You are a mastery-based exercise science instructor. The student has asked to deeply understand one specific term: "${dictFocusedTerm.term}".

Definition: "${dictFocusedTerm.definition}"
Why it matters: "${dictFocusedTerm.why}"

YOUR ONLY JOB in this session is to teach this ONE term toward the Excellent flashcard tier. Do not pivot to the broader root mechanism, other terms, or cold attempt suggestions under any circumstances.

The three flashcard tier levels:
- Pass: correct definition in own words
- Great: definition plus functional explanation of practical use and how it is used
- Excellent: correct definition plus full mechanistic causal chain — direction of causation, downstream consequences, AND what would change if the mechanism were absent or impaired. Naming the mechanism without causal direction does NOT reach Excellent.

TEACHING APPROACH for this term:
1. Open by acknowledging the specific term by name. Ask what the student currently understands about it.
2. Listen carefully. Diagnose their foundation.
3. Teach via analogy first — make the mechanism physically intuitive.
4. Build toward the causal chain: what causes what, in what direction, with what downstream effects.
5. Explicitly tell the student which tier their current understanding would reach and what is missing for the next tier.
6. When the student demonstrates Excellent level understanding, say: "That's an Excellent level answer. Go test it in the flashcard." Say this once only — do not repeat or push further.

Stay on this term for the entire session. Never suggest practice mode or cold attempt.
Keep responses short and conversational. Ask one question at a time.`;
    }

    if (mode === 'teach') {
      const dictTerms = (DICTIONARY[root.id] || []).map(t => t.term).join(', ');
      return `You are a mastery-based exercise science instructor. You are teaching Root ${root.id}: "${root.title}".

The target question is: "${question}"

COMPETENCY SIGNALING — CRITICAL:
After every response in teach mode, include a competency signal on its own line at the end:
[COMPETENCY:1] — if the learner has not yet demonstrated understanding of the analogy
[COMPETENCY:2] — when the learner correctly extends the analogy or predicts a change within the analogy framework
[COMPETENCY:3] — when the learner correctly answers two or more consecutive prediction questions about the actual mechanism
[COMPETENCY:4] — when the learner works through a simplified scenario correctly without significant guidance
[COMPETENCY:5] — when the learner works through the full root scenario with mechanistically correct reasoning
Only advance the stage when genuinely earned. Never retreat to a lower number once advanced.

DICTIONARY TERM SIGNALING:
The available dictionary terms for this root are: ${dictTerms}
When you introduce or use one of these terms for the first time in your explanation, include a hidden tag at the end of your response: [TERM:exact term name]
Only signal a term the first time you introduce it. Multiple terms can be signaled in one response: [TERM:term1][TERM:term2]

TEACHING PROTOCOL — follow this exactly:

ORIENTATION PHASE:
1. Open by stating what the question is really asking beneath the surface
2. Map the session — what concepts will be built and why
3. Ask what the learner's current understanding is
4. Listen carefully to diagnose their actual foundation

ANALOGY FIRST:
5. Before any technical content, introduce the core mechanism through a concrete real-world analogy that makes it physically intuitive
6. Stay with the analogy until the learner can extend it themselves — predict a change or explain a difference
7. Only move to formal mechanism explanation after the analogy is solid
8. Connect every mechanism piece back to the analogy
9. Check understanding with PREDICTION questions only — never definition questions. Never "what is X" — always "what would happen if X changed"
10. Only move to the root scenario after simpler versions of the mechanism are solid. Build up gradually.

IF UNDERSTANDING BREAKS DOWN:
- Never repeat the same explanation at the same depth
- Find a different analogy, different entry point, different physical intuition
- Never signal impatience. Never treat any question as too basic.

BUILD understanding: SCENARIO FIRST, then mechanism, then terminology. Never reverse this order.
After every explanation: "Does that click, or do you want more depth?"
Follow every cross-domain connection the learner raises.
Never lecture unprompted. Never ask multiple questions simultaneously.
Seed explanation for zero prior knowledge: 2-4 sentences maximum, then scenario immediately.
When asked to "go deeper," approach from a DIFFERENT angle — never repeat at the same depth.
Do NOT reveal mastery rubric criteria in advance.

FLASHCARD TERM TEACHING:
If the learner explicitly asks to understand a specific dictionary term more deeply — for example "explain mTORC1 to me," "I want to understand leucine threshold better," "help me get to Excellent on stroke volume" — shift into a focused term explanation mode for that term. Follow the same teaching protocol: analogy first, mechanism second, causal chain third, direction of causation fourth — but targeted entirely at that term.
You are aware of the three flashcard tier levels:
- Pass: correct definition in own words
- Great: definition plus functional explanation of practical use
- Excellent: definition plus full mechanistic causal chain including direction of causation, downstream consequences, and what would change if absent or impaired
When teaching toward a specific term, explicitly tell the learner which tier their current understanding would reach and what is missing to reach the next tier. When the learner demonstrates Excellent level understanding, say: "That's an Excellent level answer. Go test it in the flashcard." This is the only prompt toward the flashcard — natural, earned, not pushy. Never interrupt normal sessions to suggest flashcard study unprompted.

TRANSITION SUGGESTIONS (make each once only, never repeat):
- If learner demonstrates strong reasoning on simplified scenarios but hasn't worked through the full root scenario: suggest "You're reasoning through this really well. Practice mode lets you try the actual question with feedback before committing to a cold attempt — worth a go." Say this once only. If they want to keep talking, continue.
- If learner has worked through the full root scenario with mechanistically correct reasoning: suggest "You've built a solid model of this. Practice mode is a good warmup if you want it, or go straight to the cold attempt if you're feeling ready." Say this once only.

AFTER FAILED COLD ATTEMPT (if learner returns):
- Acknowledge briefly without dwelling
- Rebuild specific missing pieces using NEW analogies and NEW scenarios — never repeat the same explanations from the first session

Keep responses conversational. No walls of text. Short paragraphs. Use concrete examples.`;
    }

    if (mode === 'practice') {
      return `You are evaluating exercise science understanding for Root ${root.id}: "${root.title}".

The question being practiced is: "${question}"

PRACTICE MODE PROTOCOL:
1. Present the question clearly
2. After the learner answers, evaluate against these criteria (do not share these criteria with the learner):
${rubric}

3. Give DIAGNOSTIC feedback — not just right/wrong. Identify specifically:
   - Which elements were present and well-explained
   - Which elements were missing or incomplete
   - Which elements were incorrect
4. After feedback, you can discuss and explain to help them improve
5. They can attempt multiple times
6. Be encouraging but honest — precision matters in science`;
    }

    if (mode === 'cold') {
      const isRootQ = questionType === 'root';
      const totalCrit = isRootQ ? 4 : 3;
      return `You are administering a cold assessment for Root ${root.id}: "${root.title}".

The question is: "${question}"

STRICT EVALUATION INSTRUCTIONS:
Evaluate each criterion as a strict binary — met or not met. A criterion is met only if the answer explicitly and specifically demonstrates the required mechanism, prediction, or connection stated in that criterion. General correctness, directional accuracy, and implied understanding do not satisfy a criterion. You must be able to point to a specific sentence or phrase in the answer that satisfies the criterion. If you cannot, the criterion is not met. Do not be generous. Do not infer. Do not reward effort or length. Evaluate only what is explicitly present.

This rubric has exactly ${totalCrit} criteria. You MUST evaluate ALL ${totalCrit} — no more, no fewer.

COLD ATTEMPT PROTOCOL — CRITICAL FORMAT INSTRUCTIONS:
After the learner submits their answer, you MUST evaluate it and format your response EXACTLY as follows:

First: [PASS] or [FAIL] on its own line. PASS requires the majority of criteria met.

Then list EXACTLY ${totalCrit} criteria using this format, one per line:
[CRITERIA:met] Plain English description of this criterion — was met
[CRITERIA:unmet] Plain English description of this criterion — was not met

Then: [NARRATIVE] Your 2-4 sentence assessment. For pass: specific and affirming without sycophancy. For fail: specific and actionable.

The criteria to evaluate against (convert each into a clear readable plain English statement):
${rubric}

Rules:
- Do NOT help, hint, or guide before they submit
- After evaluation you may briefly discuss but do not re-teach in this mode`;
    }
  };

  const initTeachMode = async () => {
    setLoading(true);
    const systemPrompt = buildSystemPrompt();
    const initPrompt = `Begin the teaching session for Root ${root.id}: "${root.title}". The question we're working toward is:\n\n"${getQuestion()}"\n\nStart with the orientation: state what this question is really asking beneath the surface, map what we'll build, then ask about their current understanding. Keep it to 2-4 sentences and one question. No walls of text.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${systemPrompt}\n\nUser: ${initPrompt}`
    });
    // Parse competency signal from init
    const competencyMatch = response.match(/\[COMPETENCY:([1-5])\]/);
    if (competencyMatch && onCompetencyChange) {
      onCompetencyChange(parseInt(competencyMatch[1]));
    }
    const termMatches = [...response.matchAll(/\[TERM:([^\]]+)\]/g)];
    if (termMatches.length > 0 && activeProfileId) {
      termMatches.forEach(m => addEncounteredTerm(activeProfileId, root.id, m[1].trim()));
    }
    const cleanResponse = response
      .replace(/\[COMPETENCY:[1-5]\]/g, '')
      .replace(/\[TERM:[^\]]+\]/g, '')
      .trim();
    setMessages([{ role: 'assistant', content: cleanResponse }]);
    setLoading(false);
  };

  const initDictFocusedMode = async () => {
    setLoading(true);
    const systemPrompt = buildSystemPrompt();
    const initPrompt = `Begin the session. Acknowledge the term "${dictFocusedTerm.term}" by name and ask the student what they currently understand about it. Keep it to 2-3 sentences and one question.`;
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${systemPrompt}\n\nUser: ${initPrompt}`
    });
    const cleanResponse = response
      .replace(/\[COMPETENCY:[1-5]\]/g, '')
      .replace(/\[TERM:[^\]]+\]/g, '')
      .trim();
    setMessages([{ role: 'assistant', content: cleanResponse }]);
    setLoading(false);
  };

  const startPracticeOrCold = () => {
    const question = getQuestion();
    if (mode === 'practice') {
      setMessages([{
        role: 'assistant',
        content: `**${getQuestionLabel()}**\n\nHere's your question:\n\n> ${question}\n\nTake your time and answer as thoroughly as you can. I'll give you detailed feedback on what's strong and what's missing.`
      }]);
    } else {
      setMessages([{
        role: 'assistant',
        content: `**Cold Attempt — ${getQuestionLabel()}**\n\n> ${question}\n\nThis is a cold attempt. Answer from memory with no assistance. I will not help until you submit your answer.`
      }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    // Cold attempt: switch to evaluating phase
    if (mode === 'cold' && coldPhase === 'input') {
      // Increment attempt counter
      const newCount = activeProfileId
        ? incrementColdAttempt(activeProfileId, root.id, questionType)
        : coldAttemptNum;
      setColdAttemptNum(newCount);
      setColdPhase('evaluating');
      setColdResult(null);
    }

    const systemPrompt = buildSystemPrompt();
    const conversationContext = newMessages.map(m =>
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n\n');

    const isColdSubmit = mode === 'cold' && coldPhase === 'input';

    const fullPrompt = `${systemPrompt}\n\nConversation so far:\n${conversationContext}\n\nRespond as the assistant.${
      isColdSubmit
        ? ' The student has just submitted their cold attempt answer. Evaluate it now following the COLD ATTEMPT PROTOCOL exactly, using the [PASS]/[FAIL], [CRITERIA:met]/[CRITERIA:unmet], and [NARRATIVE] tags as specified.'
        : ''
    }`;

    const response = await base44.integrations.Core.InvokeLLM({ prompt: fullPrompt });

    if (mode === 'cold' && isColdSubmit) {
      // Don't add to messages — show in panel instead
      setColdResult(response);
      // Count criteria met and store best score
      const isRootQ = questionType === 'root';
      const totalCrit = isRootQ ? 4 : 3;
      const criteriaMatches = [...response.matchAll(/\[CRITERIA:(met|unmet)\]/gi)];
      const metCount = criteriaMatches.filter(m => m[1].toLowerCase() === 'met').length;
      const earnedCount = Math.min(metCount, totalCrit);
      if (activeProfileId) {
        setQuestionCriteria(activeProfileId, root.id, questionType, earnedCount);
        const tier = getQualityTier(earnedCount, isRootQ);
        setBestTier(activeProfileId, root.id, questionType, tier);
      }
      if (response.includes('[PASS]')) {
        onPassColdAttempt(questionType, earnedCount);
      }
    } else {
      // Parse competency signal
      if (mode === 'teach') {
        const competencyMatch = response.match(/\[COMPETENCY:([1-5])\]/);
        if (competencyMatch && onCompetencyChange) {
          onCompetencyChange(parseInt(competencyMatch[1]));
        }
        // Parse term signals
        const termMatches = [...response.matchAll(/\[TERM:([^\]]+)\]/g)];
        if (termMatches.length > 0 && activeProfileId) {
          termMatches.forEach(m => {
            const term = m[1].trim();
            addEncounteredTerm(activeProfileId, root.id, term);
            if (onTermEncountered) onTermEncountered(term);
          });
        }
      }
      // Strip hidden tags from displayed content
      const cleanResponse = response
        .replace(/\[COMPETENCY:[1-5]\]/g, '')
        .replace(/\[TERM:[^\]]+\]/g, '')
        .trim();
      setMessages(prev => [...prev, { role: 'assistant', content: cleanResponse }]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleColdContinue = () => {
    // Dismiss panel — parent will update status (already done via onPassColdAttempt)
    setColdPhase('done');
  };

  const handleColdRetry = () => {
    setColdPhase('input');
    setColdResult(null);
    setMessages([{
      role: 'assistant',
      content: `**Cold Attempt — ${getQuestionLabel()}** (Attempt ${coldAttemptNum + 1})\n\n> ${getQuestion()}\n\nTry again. Answer from memory — no assistance until you submit.`
    }]);
    if (activeProfileId) {
      const count = getColdAttemptCount(activeProfileId, root.id, questionType);
      setColdAttemptNum(count + 1);
    }
  };

  const handleTeachMe = () => {
    if (onSwitchMode) onSwitchMode('teach');
  };

  // Cold attempt — show evaluation / results view
  if (mode === 'cold' && coldPhase === 'evaluating') {
    return (
      <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="px-4 py-2.5 bg-red-950/30 border-b border-red-900/30">
          <p className="text-xs text-red-400 font-medium">Evaluating your response</p>
        </div>
        <div className="p-6">
          <ColdAttemptPanel
            result={coldResult}
            root={root}
            questionType={questionType}
            attemptNumber={coldAttemptNum}
            onContinue={handleColdContinue}
            onRetry={handleColdRetry}
            onTeachMe={handleTeachMe}
          />
        </div>
      </div>
    );
  }

  if (mode === 'cold' && coldPhase === 'done') {
    return (
      <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-6 text-center">
        <div className="text-emerald-500 text-lg mb-2">✓</div>
        <p className="text-zinc-300 font-medium">Root question passed.</p>
        <p className="text-zinc-500 text-sm mt-1">Status updated. You can continue to the next root.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] md:h-[560px] bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
      {mode === 'cold' && coldPhase === 'input' && (
        <div className="px-4 py-2.5 bg-red-950/30 border-b border-red-900/30">
          <p className="text-xs text-red-400 font-medium">
            Cold attempt active — answer from memory, no assistance until you submit
            {coldAttemptNum > 1 && <span className="text-red-600 ml-2">· Attempt {coldAttemptNum}</span>}
          </p>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
            </div>
            <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 md:p-4 border-t border-zinc-800">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === 'cold'
                ? "Type your complete answer..."
                : "Type your message..."
            }
            rows={1}
            className="flex-1 resize-none bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200
              placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600
              min-h-[44px] max-h-[140px]"
            style={{ height: 'auto', minHeight: '44px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700
              disabled:text-zinc-500 text-white flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}