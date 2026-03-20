import { X } from 'lucide-react';
import DotTagRow from './DotTagRow';
import { DURATION_CONFIG, LEARNING_MODE_CONFIG } from './courseTagConfig';

export default function CourseSummaryOverlay({ course, onClose, onEnter }) {
  const duration = DURATION_CONFIG[course.duration] || DURATION_CONFIG.medium;
  const learningMode = course.learningMode ? LEARNING_MODE_CONFIG[course.learningMode] : null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-lg animate-in fade-in-0 duration-200 flex flex-col">
      {/* Sheet container — full screen on mobile, centered card on desktop */}
      <div className="flex-1 md:flex md:items-center md:justify-center md:p-6 overflow-hidden">
        <div className="flex flex-col bg-zinc-950 md:bg-zinc-900 md:border md:border-zinc-800 md:rounded-2xl w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl animate-in slide-in-from-bottom-4 duration-300">

          {/* Sticky header — always visible */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 pt-4 pb-3 md:px-6 md:pt-5 border-b border-zinc-800/60">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                {course.tag}
              </span>
              {course.comingSoon && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/40">
                  Coming Soon
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-all duration-150 active:scale-90 flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">{course.title}</h2>

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

            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{course.description}</p>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider">
                Course Contents
              </h3>
              {course.comingSoon || (!course.sections?.length && !course.rootSummaries?.length) ? (
                <p className="text-zinc-600 text-sm italic">
                  Course contents will be revealed at launch.
                </p>
              ) : course.sections?.length ? (
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
                <div className="space-y-3">
                  {course.rootSummaries.map((rs) => (
                    <div key={rs.id} className="flex gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/50">
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
          </div>

          {/* Sticky footer CTA */}
          {(!course.comingSoon && onEnter) || course.comingSoon ? (
            <div className="flex-shrink-0 px-4 pb-6 pt-3 md:px-6 border-t border-zinc-800/60">
              {!course.comingSoon && onEnter ? (
                <button
                  onClick={() => { onEnter(); onClose(); }}
                  className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm transition-all duration-150 active:scale-[0.98]"
                >
                  Enter Course
                </button>
              ) : (
                <p className="text-center text-sm text-zinc-600">Coming Soon — Check Back Later</p>
              )}
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
}