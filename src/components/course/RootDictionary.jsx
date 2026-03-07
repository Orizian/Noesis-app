import React, { useState } from 'react';
import { ChevronDown, BookMarked } from 'lucide-react';
import { DICTIONARY } from '../courseData';
import { useProfile } from '../profiles/ProfileContext';
import { getEncounteredTerms } from '../profiles/profileStorage';

export default function RootDictionary({ rootId }) {
  const [open, setOpen] = useState(false);
  const { activeProfileId, profilesVersion } = useProfile();

  const terms = DICTIONARY[rootId] || [];
  const encountered = activeProfileId ? getEncounteredTerms(activeProfileId, rootId) : [];

  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-300">Dictionary</span>
          <span className="text-xs text-zinc-600">({terms.length} terms)</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-zinc-800/50 divide-y divide-zinc-800/40">
          {terms.map((term, i) => {
            const isEncountered = encountered.includes(term.term);
            return (
              <div
                key={i}
                className={`px-4 py-3.5 transition-colors ${isEncountered ? 'bg-amber-950/10 border-l-2 border-l-amber-700/50' : ''}`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold mb-1 ${isEncountered ? 'text-amber-300' : 'text-zinc-200'}`}>
                      {term.term}
                      {isEncountered && (
                        <span className="ml-2 text-xs text-amber-600 font-normal">✓ encountered</span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-1.5">{term.definition}</p>
                    <p className="text-xs text-zinc-600 italic leading-relaxed">
                      <span className="text-zinc-500 not-italic font-medium">Why it matters — </span>
                      {term.why}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}