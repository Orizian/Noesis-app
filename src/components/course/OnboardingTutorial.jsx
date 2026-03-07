import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    targetId: 'tutorial-root-list',
    title: 'Your Course',
    text: "There are 8 roots — each one is a foundational concept in exercise science. Work through them in order. Tap any root to open it.",
    position: 'below',
  },
  {
    targetId: 'tutorial-mode-selector',
    title: 'Three Learning Modes',
    text: "Each root has three modes. Start with Teach Me — the AI guides you through the concept using scenarios and questions. Use Practice to test yourself when ready. Take the Cold Attempt to officially complete the root.",
    position: 'below',
  },
  {
    targetId: 'tutorial-question-bank',
    title: 'Questions to Master',
    text: "Every root has one main question and three branch questions. These are what you're building toward. Don't worry about them now — Teach Me will get you there.",
    position: 'above',
  },
  {
    targetId: 'tutorial-progress-bar',
    title: 'Your Progress',
    text: "Your progress saves automatically to your profile. Complete a root by passing its Cold Attempt. Master it by passing all three branch questions too.",
    position: 'below',
  },
];

function getElementRect(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom };
}

export default function OnboardingTutorial({ onComplete, isReplay = false }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const [visible, setVisible] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  useEffect(() => {
    // Small delay for DOM to settle
    const t = setTimeout(() => {
      updateRect();
      setVisible(true);
    }, 300);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    const handler = () => updateRect();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [step]);

  const updateRect = () => {
    const r = getElementRect(current.targetId);
    setRect(r);
  };

  const handleNext = () => {
    if (isLast) return;
    setVisible(false);
    setTimeout(() => {
      setStep(s => s + 1);
    }, 150);
  };

  const handleDone = () => {
    onComplete();
  };

  const handleStartRoot1 = () => {
    onComplete();
    navigate(createPageUrl('RootDetail') + '?rootId=1');
  };

  const PADDING = 12;
  const tooltipWidth = 300;

  const getTooltipStyle = () => {
    if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top, left;

    if (current.position === 'below') {
      top = rect.bottom + PADDING + window.scrollY;
    } else {
      top = rect.top - PADDING + window.scrollY;
    }

    // Center horizontally on element
    left = rect.left + rect.width / 2 - tooltipWidth / 2;
    left = Math.max(12, Math.min(left, vw - tooltipWidth - 12));

    return { top, left, width: tooltipWidth, position: 'absolute' };
  };

  const spotlightStyle = rect ? {
    top: rect.top + window.scrollY - PADDING,
    left: rect.left - PADDING,
    width: rect.width + PADDING * 2,
    height: rect.height + PADDING * 2,
  } : null;

  return (
    <div className="fixed inset-0 z-[100]" style={{ pointerEvents: 'none' }}>
      {/* Dim overlay with cutout — four rectangles */}
      <div className="absolute inset-0" style={{ pointerEvents: 'all', background: 'rgba(0,0,0,0.75)' }}>
        {spotlightStyle && (
          <div
            className="absolute rounded-xl"
            style={{
              ...spotlightStyle,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.75)',
              background: 'transparent',
              border: '2px solid rgba(255,255,255,0.15)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        style={{ ...getTooltipStyle(), pointerEvents: 'all', opacity: visible ? 1 : 0, transition: 'opacity 0.2s' }}
        className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-5 z-[101]"
      >
        {/* Step dots */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === step ? 'bg-emerald-400' : 'bg-zinc-700'}`}
              />
            ))}
          </div>
          <button
            onClick={handleDone}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Skip Tutorial
          </button>
        </div>

        <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">{current.title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">{current.text}</p>

        {isLast ? (
          <div className="flex gap-2">
            {!isReplay && (
              <button
                onClick={handleStartRoot1}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl 
                  bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
              >
                Start Root 1
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleDone}
              className={`${isReplay ? 'flex-1' : ''} flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl 
                border border-zinc-700 text-zinc-300 hover:border-zinc-600 text-sm transition-colors`}
            >
              Got it
            </button>
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl 
              bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors"
          >
            Next
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}