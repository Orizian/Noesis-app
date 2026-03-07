import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ROOTS, BRANCH_RUBRICS } from '../components/courseData';
import ModeSelector from '../components/course/ModeSelector';
import QuestionBank from '../components/course/QuestionBank';
import QuestionSelector from '../components/course/QuestionSelector';
import ChatInterface from '../components/course/ChatInterface';
import { ArrowLeft, Circle, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const statusConfig = {
  not_started: { icon: Circle, label: 'Not Started', className: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
  in_progress: { icon: Clock, label: 'In Progress', className: 'bg-amber-950/50 text-amber-400 border-amber-800/50' },
  complete: { icon: CheckCircle2, label: 'Complete', className: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50' },
};

export default function RootDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const rootId = parseInt(urlParams.get('rootId')) || 1;
  const root = ROOTS.find(r => r.id === rootId) || ROOTS[0];

  const [activeMode, setActiveMode] = useState('teach');
  const [selectedQuestion, setSelectedQuestion] = useState('root');
  const queryClient = useQueryClient();

  const { data: allProgress = [] } = useQuery({
    queryKey: ['rootProgress'],
    queryFn: () => base44.entities.RootProgress.list(),
  });

  const progress = allProgress.find(p => p.root_id === rootId);
  const status = progress?.status || 'not_started';
  const StatusIcon = statusConfig[status].icon;

  const updateProgressMutation = useMutation({
    mutationFn: async ({ questionType }) => {
      let existing = progress;
      
      if (!existing) {
        existing = await base44.entities.RootProgress.create({
          root_id: rootId,
          status: 'in_progress',
          root_question_passed: false,
          branch_1_passed: false,
          branch_2_passed: false,
          branch_3_passed: false,
        });
      }

      const updates = {};
      if (questionType === 'root') updates.root_question_passed = true;
      if (questionType === 'branch_1') updates.branch_1_passed = true;
      if (questionType === 'branch_2') updates.branch_2_passed = true;
      if (questionType === 'branch_3') updates.branch_3_passed = true;

      // Check if root question is now passed to mark complete
      const willBeComplete = (questionType === 'root' || existing.root_question_passed);
      if (willBeComplete) {
        updates.status = 'complete';
      } else {
        updates.status = 'in_progress';
      }

      await base44.entities.RootProgress.update(existing.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rootProgress'] });
    }
  });

  const handlePassColdAttempt = (questionType) => {
    updateProgressMutation.mutate({ questionType });
  };

  // Mark as in_progress when user first visits teach mode
  useEffect(() => {
    if (!progress && activeMode === 'teach') {
      base44.entities.RootProgress.create({
        root_id: rootId,
        status: 'in_progress',
        root_question_passed: false,
        branch_1_passed: false,
        branch_2_passed: false,
        branch_3_passed: false,
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['rootProgress'] });
      });
    }
  }, [rootId, activeMode]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
        {/* Back + Header */}
        <Link 
          to={createPageUrl('CourseOverview')} 
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Course Overview
        </Link>

        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-zinc-600 mb-1">ROOT {String(root.id).padStart(2, '0')}</div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{root.title}</h1>
            </div>
            <span className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${statusConfig[status].className}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {statusConfig[status].label}
            </span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mb-6">
          <ModeSelector activeMode={activeMode} onModeChange={setActiveMode} />
        </div>

        {/* Question Selector (for Practice and Cold modes) */}
        {(activeMode === 'practice' || activeMode === 'cold') && (
          <div className="mb-4">
            <label className="text-xs text-zinc-500 mb-2 block">Select question</label>
            <QuestionSelector
              root={root}
              progress={progress}
              selectedQuestion={selectedQuestion}
              onSelect={setSelectedQuestion}
            />
          </div>
        )}

        {/* Chat Area */}
        <div className="mb-10">
          <ChatInterface
            key={`${root.id}-${activeMode}-${selectedQuestion}`}
            root={root}
            mode={activeMode}
            questionType={activeMode === 'teach' ? 'root' : selectedQuestion}
            onPassColdAttempt={handlePassColdAttempt}
          />
        </div>

        {/* Question Bank */}
        <QuestionBank root={root} />
      </div>
    </div>
  );
}