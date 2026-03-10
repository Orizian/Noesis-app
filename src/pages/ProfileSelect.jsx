import React, { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { getProfiles, getProfileCompletionPercent } from '../components/profiles/profileStorage';
import ProfileAvatar, { getColorConfig } from '../components/profiles/ProfileAvatar';
import { useCourse } from '../components/course/CourseContext';
import ProgressRing from '../components/profiles/ProgressRing';
import CreateProfileModal from '../components/profiles/CreateProfileModal';
import PinEntryOverlay from '../components/profiles/PinEntryOverlay';
import { useProfile } from '../components/profiles/ProfileContext';
import { createPageUrl } from '@/utils';

function timeAgo(ts) {
  if (!ts) return 'Not started yet';
  const diff = Date.now() - ts;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Last studied today';
  if (days === 1) return 'Last studied yesterday';
  return `Last studied ${days} days ago`;
}

export default function ProfileSelect({ onNavigate }) {
  const { selectProfile } = useProfile();
  const { rootCount } = useCourse();
  const [profiles, setProfiles] = useState(() => {
    const p = getProfiles();
    return Array.isArray(p) ? p : [];
  });
  const [showCreate, setShowCreate] = useState(false);
  const [pinProfile, setPinProfile] = useState(null);

  const navigate = (id) => {
    selectProfile(id);
    window.location.href = createPageUrl('CourseOverview');
  };

  const handleProfileClick = (profile) => {
    if (profile.pin) {
      setPinProfile(profile);
    } else {
      navigate(profile.id);
    }
  };

  const handleCreated = (profile) => {
    const p = getProfiles();
    setProfiles(Array.isArray(p) ? p : []);
    setShowCreate(false);
    navigate(profile.id);
  };

  const handlePinSuccess = () => {
    navigate(pinProfile.id);
    setPinProfile(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <div className="pt-16 pb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Principles of Exercise Science</h1>
        </div>
        <p className="text-zinc-500 text-sm">Who's studying?</p>
      </div>

      {/* Profiles grid */}
      <div className="flex-1 flex items-start justify-center px-6 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 w-full max-w-2xl">
          {profiles.map(profile => {
            const pct = getProfileCompletionPercent(profile.id, rootCount);
            return (
              <button
                key={profile.id}
                onClick={() => handleProfileClick(profile)}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-200 cursor-pointer"
              >
                {/* Avatar + ring */}
                <div className="relative">
                  <ProgressRing percent={pct} size={72} stroke={3} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ProfileAvatar profile={profile} size="md" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate max-w-[100px]">
                    {profile.name}
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5">{timeAgo(profile.lastStudied)}</p>
                </div>
              </button>
            );
          })}

          {/* Add profile card */}
          <button
            onClick={() => setShowCreate(true)}
            className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 text-zinc-600 hover:text-zinc-400 transition-all duration-200 cursor-pointer"
          >
            <div className="w-[72px] h-[72px] rounded-full border-2 border-dashed border-current flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-sm">Add Profile</p>
          </button>
        </div>
      </div>

      {showCreate && (
        <CreateProfileModal
          onCreated={handleCreated}
          onClose={() => setShowCreate(false)}
        />
      )}

      {pinProfile && (
        <PinEntryOverlay
          profile={pinProfile}
          onSuccess={handlePinSuccess}
          onBack={() => setPinProfile(null)}
        />
      )}
    </div>
  );
}