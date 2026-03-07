import React, { useState } from 'react';
import { ChevronDown, Beaker, Link2, Lightbulb, CheckCircle2, CheckSquare, Circle } from 'lucide-react';

const branchIcons = {
  'Edge Case': Beaker,
  'Cross-Root Integration': Link2,
  'Counterintuitive Prediction': Lightbulb,
};

const BRANCH_KEYS = ['branch_1', 'branch_2', 'branch_3'];

function QuestionCard({ title, label, question, isRoot, passed, onMarkPassed }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = !isRoot ? branchIcons[label] : null;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200
      ${isRoot
        ? 'border-l-[3px] border-l-emerald-500 border-zinc-800 bg-zinc-900/60'
        : passed
          ? 'border-l-[3px] border-l-emerald-500 border-zinc-800 bg-zinc-900/40'
          : 'border-l-[3px] border-l-zinc-700 border-zinc-800 bg-zinc-900/40'
      }`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Status indicator */}
          {passed
            ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            : <Circle className="w-4 h-4 text-zinc-600 flex-shrink-0" />
          }
          <div className="min-w-0">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{title}</span>
            {label && !isRoot && (
              <span className="text-xs text-zinc-600 ml-2">— {label}</span>
            )}
          </div>
          {passed && (
            <span className="text-xs text-emerald-600 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded-full hidden sm:inline">
              Passed
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800/50">
          <p className="text-sm text-zinc-300 leading-relaxed mt-3 mb-3">{question}</p>
          {!isRoot && !passed && onMarkPassed && (
            <button
              onClick={e => { e.stopPropagation(); onMarkPassed(); }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium 
                border border-zinc-700 text-zinc-400 hover:border-emerald-700 hover:text-emerald-400 
                hover:bg-emerald-950/30 transition-all"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Mark Branch Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function QuestionBank({ root, progress, onMarkBranchPassed }) {
  const rootPassed = progress?.root_question_passed || false;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Question Bank</h3>
      <QuestionCard
        title="Root Question"
        question={root.rootQuestion}
        isRoot={true}
        passed={rootPassed}
      />
      {root.branches.map((branch, i) => {
        const key = BRANCH_KEYS[i];
        const passed = progress?.[key] || false;
        return (
          <QuestionCard
            key={i}
            title={`Branch ${i + 1}`}
            label={branch.label}
            question={branch.question}
            isRoot={false}
            passed={passed}
            onMarkPassed={onMarkBranchPassed ? () => onMarkBranchPassed(key) : null}
          />
        );
      })}
    </div>
  );
}