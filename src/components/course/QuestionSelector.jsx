import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export default function QuestionSelector({ root, progress, selectedQuestion, onSelect }) {
  const questions = [
    { id: 'root', label: 'Root Question', passed: progress?.root_question_passed },
    ...root.branches.map((branch, i) => ({
      id: `branch_${i + 1}`,
      label: `Branch ${i + 1} — ${branch.label}`,
      passed: progress?.[`branch_${i + 1}_passed`],
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q) => (
        <button
          key={q.id}
          onClick={() => onSelect(q.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border
            ${selectedQuestion === q.id
              ? 'bg-zinc-800 border-zinc-600 text-zinc-200'
              : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
            }`}
        >
          {q.passed 
            ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            : <Circle className="w-3.5 h-3.5" />
          }
          <span className="hidden sm:inline">{q.label}</span>
          <span className="sm:hidden">{q.id === 'root' ? 'Root' : `B${q.id.split('_')[1]}`}</span>
        </button>
      ))}
    </div>
  );
}