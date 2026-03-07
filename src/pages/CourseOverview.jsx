import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ROOTS } from '../components/courseData';
import RootCard from '../components/course/RootCard';
import { BookOpen } from 'lucide-react';

export default function CourseOverview() {
  const { data: progressData = [] } = useQuery({
    queryKey: ['rootProgress'],
    queryFn: () => base44.entities.RootProgress.list(),
  });

  const progressMap = {};
  progressData.forEach(p => { progressMap[p.root_id] = p; });

  const completedCount = ROOTS.filter(r => progressMap[r.id]?.status === 'complete').length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Principles of Exercise Science
              </h1>
            </div>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mt-3">
            Eight foundational concepts. Mastery-based progression. Understanding mechanism over memorizing facts. 
            Complete each root by passing the cold attempt.
          </p>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
              <span>{completedCount} of {ROOTS.length} roots complete</span>
              <span>{Math.round((completedCount / ROOTS.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / ROOTS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Root list */}
        <div className="space-y-3">
          {ROOTS.map((root) => (
            <RootCard 
              key={root.id} 
              root={root} 
              progress={progressMap[root.id]}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-600 text-center">
            Understanding mechanism is more valuable than memorizing facts.
          </p>
        </div>
      </div>
    </div>
  );
}