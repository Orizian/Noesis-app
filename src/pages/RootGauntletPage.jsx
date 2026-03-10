import React from 'react';
import { useCourse } from '../components/course/CourseContext';
import { useProfile } from '../components/profiles/ProfileContext';
import { isGauntletEligible } from '../components/profiles/profileStorage';
import RootGauntletFlow from '../components/course/RootGauntletFlow';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import ProfileDropdown from '../components/profiles/ProfileDropdown';

export default function RootGauntletPage() {
  const { roots, meta } = useCourse();
  const courseId = meta?.id;
  const urlParams = new URLSearchParams(window.location.search);
  const rootId = parseInt(urlParams.get('rootId')) || 1;
  const root = roots.find(r => r.id === rootId) || roots[0];

  const { activeProfileId, refresh } = useProfile();
  const navigate = useNavigate();

  const eligible = (activeProfileId && courseId) ? isGauntletEligible(activeProfileId, courseId, rootId) : false;

  const handleComplete = (results) => {
    refresh();
    navigate(createPageUrl('CourseOverview'));
  };

  const handleCancel = () => {
    navigate(createPageUrl('CourseOverview'));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <Link
            to={createPageUrl('CourseOverview')}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Course Overview
          </Link>
          <ProfileDropdown />
        </div>

        <div className="mb-6">
          <div className="text-xs font-mono text-zinc-600 mb-1">ROOT {String(root.id).padStart(2, '0')} — GAUNTLET</div>
          <h1 className="text-xl font-bold text-zinc-100">{root.title}</h1>
        </div>

        {!eligible ? (
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 p-8 text-center">
            <p className="text-zinc-500 text-sm">Complete all 4 cold attempts to unlock the Gauntlet for this root.</p>
            <Link to={createPageUrl('RootDetail') + `?rootId=${rootId}`}
              className="inline-block mt-4 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors">
              Back to Root
            </Link>
          </div>
        ) : (
          <RootGauntletFlow
            root={root}
            profileId={activeProfileId}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}