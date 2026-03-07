import React, { useState } from 'react';
import { ChevronDown, Beaker, Link2, Lightbulb } from 'lucide-react';

const branchIcons = {
  'Edge Case': Beaker,
  'Cross-Root Integration': Link2,
  'Counterintuitive Prediction': Lightbulb
};

function QuestionCard({ title, label, question, accentColor, isRoot }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = !isRoot ? branchIcons[label] : null;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200
      ${isRoot 
        ? 'border-l-[3px] border-l-emerald-500 border-zinc-800 bg-zinc-900/60' 
        : 'border-l-[3px] border-l-zinc-600 border-zinc-800 bg-zinc-900/40'
      }`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          {Icon && <Icon className="w-4 h-4 text-zinc-500 flex-shrink-0" />}
          <div className="min-w-0">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{title}</span>
            {label && !isRoot && (
              <span className="text-xs text-zinc-600 ml-2">— {label}</span>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800/50">
          <p className="text-sm text-zinc-300 leading-relaxed mt-3">{question}</p>
        </div>
      )}
    </div>
  );
}

export default function QuestionBank({ root }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Question Bank</h3>
      <QuestionCard
        title="Root Question"
        question={root.rootQuestion}
        isRoot={true}
      />
      {root.branches.map((branch, i) => (
        <QuestionCard
          key={i}
          title={`Branch ${i + 1}`}
          label={branch.label}
          question={branch.question}
          isRoot={false}
        />
      ))}
    </div>
  );
}