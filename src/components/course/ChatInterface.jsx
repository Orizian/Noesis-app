import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { BRANCH_RUBRICS } from '../courseData';
import MessageBubble from './MessageBubble';
import ColdEvaluationPanel from './ColdEvaluationPanel';
import {
  getActiveProfile, getColdAttemptCount, incrementColdAttemptCount,
  getRootData,
} from '../profileStore';

export default function ChatInterface({
  root,
  mode,
  questionType,
  onPassColdAttempt,
  onPracticeSubmit,
  isFirstVisit, // bool — root has never been opened before for this profile
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Cold attempt state
  const [coldPhase, setColdPhase] = useState('answering'); // 'answering' | 'evaluating' | 'results'
  const [coldEvalRaw, setColdEvalRaw] = useState(null);
  const [coldAttemptNum, setColdAttemptNum] = useState(1);
  const [coldPassed, setColdPassed] = useState(false);

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

  // Reset when mode/question/root changes
  useEffect(() => {
    setMessages([]);
    setInitialized(false);
    setColdPhase('answering');
    setColdEvalRaw(null);
    setInput('');
    const profile = getActiveProfile();
    if (profile) {
      const count = getColdAttemptCount(profile.id, root.id, questionType);
      setColdAttemptNum(count + 1);
    }
  }, [root.id, mode, questionType]);

  useEffect(() => {
    if (initialized) return;
    if (mode === 'teach') initTeachMode();
    setInitialized(true);
  }, [initialized, mode, root.id, questionType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, coldPhase]);

  useEffect(() => {
    if (initialized && (mode === 'practice' || mode === 'cold') && messages.length === 0) {
      startPracticeOrCold();
    }
  }, [initialized, mode, questionType]);

  const getRubric = () => {
    if (questionType === 'root') return root.rubric;
    const branchRubrics = BRANCH_RUBRICS[root.id];
    return branchRubrics?.[questionType] || root.rubric;
  };

  const getCriteriaCount = () => questionType === 'root' ? 4 : 3;

  const buildSystemPrompt = () => {
    const question = getQuestion();
    const rubric = getRubric();

    if (mode === 'teach') {
      return `You are a mastery-based exercise science instructor. You are teaching Root ${root.id}: "${root.title}".

The target question is: "${question}"

TEACHING PROTOCOL — follow this exactly:
1. Open by stating what the question is really asking beneath the surface
2. Map the session — what concepts will be built and why
3. Ask what the learner's current understanding is
4. Build understanding: SCENARIO FIRST, then mechanism, then terminology. Never reverse this order.
5. After every explanation ask "Does that click, or do you want more depth?"
6. Follow every cross-domain connection the learner raises
7. Never lecture unprompted. Never ask multiple questions simultaneously.
8. Seed explanation for zero prior knowledge: 2-4 sentences maximum, then scenario immediately
9. When asked to "go deeper," approach from a DIFFERENT angle — never repeat at the same depth
10. Do NOT reveal mastery rubric criteria in advance

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
      const n = getCriteriaCount();
      return `You are administering a cold assessment for Root ${root.id}: "${root.title}".

The question is: "${question}"

Rubric (${n} criteria — DO NOT SHARE WITH LEARNER):
${rubric}

COLD ATTEMPT EVALUATION PROTOCOL:
After the learner submits their answer, evaluate it and return ONLY valid JSON in this exact format (no markdown, no extra text):

{
  "passed": true or false,
  "criteria_results": [
    { "label": "Plain-language description of what this criterion assessed", "met": true or false },
    ... (${n} items total)
  ],
  "narrative": "2-4 sentences. For pass: affirm what was strong without being sycophantic. For fail: specific and actionable — name exactly what was missing and where to focus."
}

PASS = ${n === 4 ? '3 or more' : '2 or more'} criteria met.
FAIL = fewer than ${n === 4 ? '3' : '2'} criteria met.

Write criterion labels in plain conversational language — e.g. "Identified the specific structural mechanism" not internal rubric jargon.`;
    }
  };

  const initTeachMode = async () => {
    setLoading(true);
    const systemPrompt = buildSystemPrompt();

    let initPrompt;
    if (isFirstVisit) {
      // Warm orienting message for first-ever visit to this root
      initPrompt = `Begin the teaching session for Root ${root.id}: "${root.title}". 
      
Since this is the learner's first time here, start with a brief orienting message: tell them "We're going to build your understanding of [Root Name] together. I'll start with a scenario rather than definitions — just respond with whatever comes to mind and we'll build from there." Then immediately transition into your opening teaching move. Keep the whole opening under 5 sentences total.`;
    } else {
      initPrompt = `Begin the teaching session for this root. The question we're working toward understanding is:\n\n"${getQuestion()}"\n\nStart by stating what this question is really asking, map what we'll build and why, then ask what my current understanding is. Remember: scenario first, no walls of text, 2-4 sentences max for your opening seed.`;
    }

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${systemPrompt}\n\nUser: ${initPrompt}`
    });

    setMessages([{ role: 'assistant', content: response }]);
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

    if (mode === 'practice') {
      onPracticeSubmit?.();
    }

    const systemPrompt = buildSystemPrompt();
    const conversationContext = newMessages
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    if (mode === 'cold' && coldPhase === 'answering') {
      // Transition to evaluation phase
      setColdPhase('evaluating');
      setColdEvalRaw(null);

      // Increment attempt counter
      const profile = getActiveProfile();
      let attemptNum = 1;
      if (profile) {
        attemptNum = incrementColdAttemptCount(profile.id, root.id, questionType);
        setColdAttemptNum(attemptNum);
      }

      const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationContext}\n\nThe student has just submitted their answer. Evaluate it now and return the JSON result as specified. No markdown fences, no extra text — pure JSON only.`;

      const response = await base44.integrations.Core.InvokeLLM({ prompt: fullPrompt });
      setColdEvalRaw(response);
      setLoading(false);
      return;
    }

    const fullPrompt = `${systemPrompt}\n\nConversation so far:\n${conversationContext}\n\nRespond as the assistant.`;
    const response = await base44.integrations.Core.InvokeLLM({ prompt: fullPrompt });
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Cold attempt panel handlers
  const handleColdDismiss = (passed) => {
    if (passed) onPassColdAttempt?.(questionType);
    setColdPhase('dismissed');
  };

  const handleTryAgain = () => {
    // Reset to answering phase with same attempt counter already incremented
    setColdPhase('answering');
    setColdEvalRaw(null);
    startPracticeOrCold();
  };

  const handleTeachMe = () => {
    // The parent page handles mode switching via prop — we signal via a custom event
    window.dispatchEvent(new CustomEvent('switchToTeachMe'));
  };

  const isColdEvaluating = mode === 'cold' && (coldPhase === 'evaluating' || coldPhase === 'results');
  const showColdPanel = mode === 'cold' && (coldPhase === 'evaluating' || (coldPhase === 'results' && coldEvalRaw));

  // After dismiss, show messages normally with count
  const alreadyAttempted = getColdAttemptCount(getActiveProfile()?.id, root.id, questionType);

  return (
    <div className="flex flex-col bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden"
      style={{ minHeight: showColdPanel ? 'auto' : '500px', maxHeight: showColdPanel ? 'none' : undefined }}>

      {/* Cold attempt active banner */}
      {mode === 'cold' && coldPhase === 'answering' && (
        <div className="px-4 py-2.5 bg-red-950/30 border-b border-red-900/30 flex items-center justify-between">
          <p className="text-xs text-red-400 font-medium">
            Cold attempt active — answer from memory, no assistance until you submit
          </p>
          {alreadyAttempted > 0 && (
            <span className="text-xs text-zinc-600">Attempt {alreadyAttempted + 1}</span>
          )}
        </div>
      )}

      {/* Evaluation panel overlay */}
      {showColdPanel ? (
        <ColdEvaluationPanel
          isEvaluating={coldPhase === 'evaluating' && !coldEvalRaw}
          evalResult={coldEvalRaw}
          questionType={questionType}
          attemptNumber={coldAttemptNum}
          onDismiss={handleColdDismiss}
          onTryAgain={handleTryAgain}
          onTeachMe={handleTeachMe}
        />
      ) : (
        <>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
            style={{ minHeight: '400px', maxHeight: '520px' }}
          >
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
                  mode === 'cold' && coldPhase === 'dismissed'
                    ? "Ask about the evaluation..."
                    : mode === 'cold'
                      ? "Type your complete answer..."
                      : "Type your message..."
                }
                rows={1}
                disabled={loading}
                className="flex-1 resize-none bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 
                  placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600
                  min-h-[44px] max-h-[140px] disabled:opacity-50"
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
        </>
      )}
    </div>
  );
}