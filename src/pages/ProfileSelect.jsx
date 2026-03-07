import React, { useState, useCallback } from 'react';
import { BookOpen, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  getProfiles, setActiveProfile, createProfile,
  updateProfile, deleteProfile, resetProfilePinAndProgress,
} from '../components/profileStore';
import ProfileCard from '../components/profiles/ProfileCard';
import ProfileModal from '../components/profiles/ProfileModal';
import ConfirmModal from '../components/profiles/ConfirmModal';
import PinEntry from '../components/profiles/PinEntry';

export default function ProfileSelect() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState(() => getProfiles());
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [deletingProfile, setDeletingProfile] = useState(null);
  const [pinProfile, setPinProfile] = useState(null); // profile requiring PIN
  const [forgotPinProfile, setForgotPinProfile] = useState(null);

  const reload = () => setProfiles(getProfiles());

  const handleSelect = (id) => {
    const profile = profiles.find(p => p.id === id);
    if (profile?.pin) {
      setPinProfile(profile);
    } else {
      setActiveProfile(id);
      navigate(createPageUrl('CourseOverview'));
    }
  };

  const handlePinSuccess = () => {
    setActiveProfile(pinProfile.id);
    setPinProfile(null);
    navigate(createPageUrl('CourseOverview'));
  };

  const handleForgotPin = () => {
    setForgotPinProfile(pinProfile);
    setPinProfile(null);
  };

  const handleConfirmForgotPin = () => {
    resetProfilePinAndProgress(forgotPinProfile.id);
    reload();
    setForgotPinProfile(null);
  };

  const handleCreate = ({ name, color, emoji, pin }) => {
    createProfile({ name, color, emoji, pin });
    reload();
    setShowCreate(false);
    navigate(createPageUrl('CourseOverview'));
  };

  const handleEdit = ({ name, color, emoji, pin }) => {
    updateProfile(editingProfile.id, { name, color, emoji, pin });
    reload();
    setEditingProfile(null);
  };

  const handleDelete = () => {
    deleteProfile(deletingProfile.id);
    reload();
    setDeletingProfile(null);
  };

  const filtered = profiles.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-start px-4 py-12 md:py-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Principles of Exercise Science</h1>
      </div>
      <p className="text-zinc-500 text-sm mb-10">Who's studying?</p>

      {/* Search */}
      {profiles.length > 3 && (
        <div className="relative w-full max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Find a profile..."
            className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-sm 
              text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>
      )}

      {/* Grid */}
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filtered.map(profile => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSelect={handleSelect}
              onEdit={p => setEditingProfile(p)}
              onDelete={p => setDeletingProfile(p)}
            />
          ))}

          {/* Add Profile card */}
          <button
            onClick={() => setShowCreate(true)}
            className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
              border-2 border-dashed border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50
              text-zinc-500 hover:text-zinc-300 transition-all duration-200 min-h-[160px] group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-zinc-600 group-hover:border-zinc-500 
              flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">Add Profile</span>
          </button>
        </div>
      </div>

      {/* Empty state */}
      {profiles.length === 0 && (
        <p className="text-zinc-600 text-sm mt-8">No profiles yet — create one to get started.</p>
      )}

      {/* PIN Entry overlay */}
      {pinProfile && (
        <PinEntry
          profile={pinProfile}
          onSuccess={handlePinSuccess}
          onForgotPin={handleForgotPin}
        />
      )}

      {/* Forgot PIN confirmation */}
      {forgotPinProfile && (
        <ConfirmModal
          title={`Reset "${forgotPinProfile.name}"?`}
          message="Resetting via Forgot PIN removes the PIN and clears all progress for this profile. This cannot be undone."
          confirmLabel="Reset Profile"
          onConfirm={handleConfirmForgotPin}
          onCancel={() => { setForgotPinProfile(null); setPinProfile(forgotPinProfile); }}
        />
      )}

      {/* Create modal */}
      {showCreate && (
        <ProfileModal
          title="Create Profile"
          onSave={handleCreate}
          onClose={() => setShowCreate(false)}
        />
      )}
      {editingProfile && (
        <ProfileModal
          title="Edit Profile"
          profile={editingProfile}
          onSave={handleEdit}
          onClose={() => setEditingProfile(null)}
        />
      )}
      {deletingProfile && (
        <ConfirmModal
          title={`Delete "${deletingProfile.name}"?`}
          message="This will permanently remove this profile and all its progress. This cannot be undone."
          confirmLabel="Delete Profile"
          onConfirm={handleDelete}
          onCancel={() => setDeletingProfile(null)}
        />
      )}
    </div>
  );
}