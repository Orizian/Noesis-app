import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronDown, RefreshCw, BarChart2, RotateCcw, Pencil, HelpCircle } from 'lucide-react';
import AvatarCircle from '../profiles/AvatarCircle';
import ConfirmModal from '../profiles/ConfirmModal';
import ProfileModal from '../profiles/ProfileModal';
import { getActiveProfile, setActiveProfile, updateProfile, resetAllProgress } from '../profileStore';

export default function ProfileDropdown({ onProfileChange, onReplayTutorial }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(() => getActiveProfile());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSwitchProfile = () => {
    setOpen(false);
    setActiveProfile(null);
    navigate(createPageUrl('ProfileSelect'));
  };

  const handleStats = () => {
    setOpen(false);
    navigate(createPageUrl('StatsPage'));
  };

  const handleResetConfirm = () => {
    resetAllProgress(profile.id);
    setShowResetConfirm(false);
    onProfileChange?.();
  };

  const handleEditSave = ({ name, color, emoji }) => {
    updateProfile(profile.id, { name, color, emoji });
    setProfile(getActiveProfile());
    setShowEditModal(false);
    onProfileChange?.();
  };

  if (!profile) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50 
          hover:border-zinc-600 transition-all"
      >
        <AvatarCircle profile={profile} size="sm" />
        <span className="text-sm text-zinc-300 hidden sm:block max-w-[100px] truncate">{profile.name}</span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-sm font-medium text-zinc-200 truncate">{profile.name}</p>
            <p className="text-xs text-zinc-500">Active profile</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => { setOpen(false); setShowEditModal(true); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <Pencil className="w-4 h-4 text-zinc-500" />
              Edit Profile
            </button>
            <button
              onClick={handleStats}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <BarChart2 className="w-4 h-4 text-zinc-500" />
              My Stats
            </button>
            <button
              onClick={handleSwitchProfile}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-zinc-500" />
              Switch Profile
            </button>
            <div className="border-t border-zinc-800 my-1" />
            <button
              onClick={() => { setOpen(false); setShowResetConfirm(true); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/40 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset My Progress
            </button>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <ConfirmModal
          title={`Reset all progress for ${profile.name}?`}
          message="Your profile will remain but all root and branch completion will be cleared. This cannot be undone."
          confirmLabel="Reset Progress"
          onConfirm={handleResetConfirm}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
      {showEditModal && (
        <ProfileModal
          title="Edit Profile"
          profile={profile}
          onSave={handleEditSave}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}