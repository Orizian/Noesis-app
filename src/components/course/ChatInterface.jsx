import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { BRANCH_RUBRICS } from '../courseData';
import MessageBubble from './MessageBubble';

export default function ChatInterface({ root, mode, questionType, onPassColdAttempt, onPracticeSubmit }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [coldSubmitted, setColdSubmitted] = useState(false);
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

  useEffect(() => {
    setMessages([]);
    setInitialized(false);
    setColdSubmitted(false);
    setInput('');
  }, [root.id, mode, questionType]);

  useEffect(() => {
    if (initialized) return;
    if (mode === 'teach') {
      initTeachMode();
    }
    setInitialized(true);
  }, [initialized, mode, root.id, questionType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initTeachMode = async () => {
    setLoading(true);
    const systemPrompt = buildSystemPrompt();
    const initPrompt = `Begin the teaching session for this root. The question we're working toward understanding is:\n\n"${getQuestion()}"\n\nStart by stating what this question is really asking, map what we'll build and why, then ask what my current understanding is. Remember: scenario first, no walls of text, 2-4 sentences max for your opening seed.`;
    
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${systemPrompt}\n\nUser: ${initPrompt}`
    });

    setMessages([{ role: 'assistant', content: response }]);
    setLoading(false);
  };

  const getRubric = () => {
    if (questionType === 'root') return root.rubric;
    const branchKey = questionType; // e.g. "branch_1"
    const branchRubrics = BRANCH_RUBRICS[root.id];
    return branchRubrics?.[branchKey] || root.rubric;
  };

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
      return `You are administering a cold assessment for Root ${root.id}: "${root.title}".

The question is: "${question}"

COLD ATTEMPT PROTOCOL:
1. Present the question
2. Wait for the learner's complete answer
3. Do NOT help, hint, or guide before they submit
4. After submission, evaluate BINARY — PASS or FAIL — against these criteria:
${rubric}

5. State explicitly which criteria were MET and which were NOT MET
6. If PASS: congratulate briefly and note which elements were strongest. Include the exact text "[PASS]" in your response.
7. If FAIL: state what was missing without re-teaching. Direct them to Teach Me mode for those concepts. Include the exact text "[FAIL]" in your response.
8. After evaluation, you may briefly explain any missed criteria but do not re-teach`;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    if (mode === 'cold' && !coldSubmitted) {
      setColdSubmitted(true);
    }

    const systemPrompt = buildSystemPrompt();
    const conversationContext = newMessages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');
    
    const fullPrompt = `${systemPrompt}\n\nConversation so far:\n${conversationContext}\n\nRespond as the assistant.${
      mode === 'cold' && !coldSubmitted 
        ? ' The student has just submitted their cold attempt answer. Evaluate it now following the Cold Attempt Protocol. Remember to include [PASS] or [FAIL] in your response.'
        : ''
    }`;

    const response = await base44.integrations.Core.InvokeLLM({ prompt: fullPrompt });
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    
    if (mode === 'cold' && response.includes('[PASS]')) {
      onPassColdAttempt(questionType);
    }
    
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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

  useEffect(() => {
    if (initialized && (mode === 'practice' || mode === 'cold') && messages.length === 0) {
      startPracticeOrCold();
    }
  }, [initialized, mode, questionType]);

  return (
    <div className="flex flex-col h-[500px] md:h-[560px] bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
      {mode === 'cold' && !coldSubmitted && (
        <div className="px-4 py-2.5 bg-red-950/30 border-b border-red-900/30">
          <p className="text-xs text-red-400 font-medium">
            Cold attempt active — answer from memory, no assistance until you submit
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
              mode === 'cold' && coldSubmitted
                ? "Ask about the evaluation..."
                : mode === 'cold'
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