import { X } from 'lucide-react';
import DotTagRow from './DotTagRow';
import { DURATION_CONFIG, LEARNING_MODE_CONFIG } from './courseTagConfig';

export default function CourseSummaryOverlay({ course, onClose, onEnter }) {
  const duration = DURATION_CONFIG[course.duration] || DURATION_CONFIG.medium;
  const learningMode = course.learningMode ? LEARNING_MODE_CONFIG[course.learningMode] : null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/95 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex justify-end mb-6">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              {course.tag}
            </span>
            {course.comingSoon && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/40">
                Coming Soon
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">{course.title}</h2>

          <div className="space-y-3 mb-4">
            <DotTagRow difficulty={course.difficulty} depth={course.depth} scope={course.scope} />
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border ${duration.colorClass}`}>
                {duration.label}
              </span>
              {learningMode && (
                <span className={`text-xs px-2.5 py-1 rounded-full border ${learningMode.colorClass}`}>
                  {learningMode.label}
                </span>
              )}
            </div>
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed">{course.description}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider">
            Course Contents
          </h3>
          {course.comingSoon || (!course.sections?.length && !course.rootSummaries?.length) ? (
            <p className="text-zinc-600 text-sm italic">
              Course contents will be revealed at launch.
            </p>
          ) : course.sections?.length ? (
            // Section-grouped view
            <div className="space-y-5">
              {course.sections.map((section, idx) => {
                const sectionRoots = course.rootSummaries?.filter(rs => section.rootIds.includes(rs.id)) || [];
                return (
                  <div key={section.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[13px] font-mono text-zinc-600 uppercase tracking-widest">
                        Section {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-zinc-300">{section.title}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-2 leading-relaxed">{section.summary}</p>
                    {sectionRoots.length > 0 && (
                      <div className="space-y-2 pl-2 border-l border-zinc-800">
                        {sectionRoots.map(rs => (
                          <div key={rs.id} className="flex gap-3 p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800/40">
                            <div className="text-xs font-mono text-zinc-600 mt-0.5 w-5 flex-shrink-0">
                              {String(rs.id).padStart(2, '0')}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-zinc-200 mb-0.5">{rs.title}</div>
                              <div className="text-xs text-zinc-500 leading-relaxed">{rs.summary}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // Flat view (no sections)
            <div className="space-y-3">
              {course.rootSummaries.map((rs) => (
                <div
                  key={rs.id}
                  className="flex gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/50"
                >
                  <div className="text-xs font-mono text-zinc-600 mt-0.5 w-5 flex-shrink-0">
                    {String(rs.id).padStart(2, '0')}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-200 mb-0.5">{rs.title}</div>
                    <div className="text-xs text-zinc-500 leading-relaxed">{rs.summary}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!course.comingSoon && onEnter && (
          <button
            onClick={() => { onEnter(); onClose(); }}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
          >
            Enter Course
          </button>
        )}
        {course.comingSoon && (
          <p className="text-center text-sm text-zinc-600">Coming Soon — Check Back Later</p>
        )}
      </div>
    </div>
  );
}