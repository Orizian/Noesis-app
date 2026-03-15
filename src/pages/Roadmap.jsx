import React from 'react';
import { BookOpen, FlaskConical, Dumbbell, Brain, Heart, Leaf, Clock, CheckCircle2, Sparkles } from 'lucide-react';

const ACTIVE_COURSES = [
  {
    icon: Dumbbell,
    title: 'Human Performance Physiology',
    tag: 'Exercise Science',
    status: 'live',
    description: 'Mechanisms of exercise adaptation, energy systems, cardiovascular and neuromuscular physiology.',
    color: 'emerald',
  },
  {
    icon: Leaf,
    title: 'Human Nutrition',
    tag: 'Nutrition Science',
    status: 'live',
    description: 'Macronutrient metabolism, micronutrient function, dietary strategy, and metabolic regulation.',
    color: 'emerald',
  },
];

const IN_DEVELOPMENT = [
  {
    icon: Dumbbell,
    title: 'Applied Personal Training',
    tag: 'Personal Training',
    description: 'Evidence-based training design, client assessment, movement coaching, and programming for personal trainers.',
    eta: 'Coming Soon',
    color: 'amber',
  },
  {
    icon: Brain,
    title: 'Sports Psychology',
    tag: 'Performance Psychology',
    description: 'Mental performance, motivation, focus, arousal regulation, and psychological resilience for athletes.',
    eta: 'Planned',
    color: 'violet',
  },
  {
    icon: Heart,
    title: 'Clinical Exercise Physiology',
    tag: 'Clinical Science',
    description: 'Exercise as medicine — cardiac rehab, metabolic disease, chronic conditions, and clinical protocols.',
    eta: 'Planned',
    color: 'violet',
  },
  {
    icon: FlaskConical,
    title: 'Biochemistry of Sport',
    tag: 'Biochemistry',
    description: 'Deep dive into cellular metabolism, enzymatic pathways, and molecular adaptations to training.',
    eta: 'Planned',
    color: 'violet',
  },
];

const PLATFORM_FEATURES = [
  { title: 'Cloud Sync', description: 'Access your progress across all your devices seamlessly.', status: 'In Development' },
  { title: 'Collaborative Profiles', description: 'Share profiles with coaches or study partners to track progress together.', status: 'Planned' },
  { title: 'Adaptive Difficulty', description: 'The platform adjusts question complexity based on your demonstrated understanding.', status: 'Planned' },
  { title: 'Spaced Repetition Engine', description: 'Intelligent review scheduling to maximize long-term retention.', status: 'Planned' },
  { title: 'Mobile App (iOS & Android)', description: 'Native mobile experience for learning on the go.', status: 'Planned' },
  { title: 'Certification Prep Mode', description: 'Targeted question banks mapped to NASM, ACSM, NSCA, and other certifications.', status: 'Planned' },
];

const COLOR_MAP = {
  emerald: { badge: 'bg-emerald-950/60 border-emerald-800/40 text-emerald-400', icon: 'bg-emerald-950/60 border-emerald-800/40 text-emerald-500', dot: 'bg-emerald-500' },
  amber: { badge: 'bg-amber-950/40 border-amber-800/30 text-amber-400', icon: 'bg-amber-950/40 border-amber-800/30 text-amber-500', dot: 'bg-amber-400' },
  violet: { badge: 'bg-violet-950/40 border-violet-800/30 text-violet-400', icon: 'bg-violet-950/40 border-violet-800/30 text-violet-500', dot: 'bg-violet-400' },
};

function CourseItem({ course, showEta }) {
  const c = COLOR_MAP[course.color];
  const Icon = course.icon;
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${c.icon}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-semibold text-zinc-100">{course.title}</span>
          {course.status === 'live' && (
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
              <CheckCircle2 className="w-2.5 h-2.5" /> Live
            </span>
          )}
          {showEta && course.eta && (
            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${c.badge}`}>
              <Clock className="w-2.5 h-2.5" /> {course.eta}
            </span>
          )}
        </div>
        <p className="text-[11px] text-zinc-500 mb-1">{course.tag}</p>
        <p className="text-xs text-zinc-400 leading-relaxed">{course.description}</p>
      </div>
    </div>
  );
}

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-14">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Platform Roadmap</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Where Noesis is Heading</h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
            Noesis is growing into a comprehensive learning platform for health and performance science. Here's what's live, what's in development, and what's coming.
          </p>
        </div>

        {/* Live Courses */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Live Now</h2>
          </div>
          <div className="space-y-3">
            {ACTIVE_COURSES.map(c => <CourseItem key={c.title} course={c} showEta={false} />)}
          </div>
        </section>

        {/* In Development */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">In Development & Planned</h2>
          </div>
          <div className="space-y-3">
            {IN_DEVELOPMENT.map(c => <CourseItem key={c.title} course={c} showEta={true} />)}
          </div>
        </section>

        {/* Platform Features */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Platform Features</h2>
          </div>
          <div className="border border-zinc-800 rounded-xl bg-zinc-900/40 divide-y divide-zinc-800">
            {PLATFORM_FEATURES.map(f => (
              <div key={f.title} className="flex items-start gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-zinc-200">{f.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      f.status === 'In Development'
                        ? 'bg-amber-950/40 border-amber-800/30 text-amber-400'
                        : 'bg-zinc-800/60 border-zinc-700 text-zinc-500'
                    }`}>{f.status}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 pt-6 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-600 text-center">Noesis — Building the science of genuine understanding, one domain at a time.</p>
        </div>
      </div>
    </div>
  );
}