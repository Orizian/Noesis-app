import React, { useState } from 'react';
import { Plus, Lock, Pencil, BookOpen, Trash2, X } from 'lucide-react';
import {
  getProfiles,
  createProfile,
  deleteProfile,
  updateProfile,
  canAddProfile,
  getAccount,
} from '../components/profiles/profileStorage';
import { useProfile } from '../components/profiles/ProfileContext';
import { createPageUrl } from '@/utils';

// ── Color helper ──────────────────────────────────────────────────────────────
function getProfileColor(name) {
  const colors = [
    'bg-emerald-700', 'bg-violet-700', 'bg-amber-700',
    'bg-sky-700', 'bg-rose-700', 'bg-teal-700',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name) {
  return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() || '').slice(0, 2).join('');
}

function getUpgradePrompt(tierName) {
  if (tierName === 'free') return 'Upgrade to Scholar for up to 3 profiles';
  if (tierName === 'scholar') return 'Upgrade to Institution for up to 10 profiles';
  return 'Contact us for custom profile allocations';
}

// ── Subcomponents ─────────────────────────────────────────────────────────────

function ProfileCard({ profile, onSelect, onEdit }) {
  const initials = profile.initials || getInitials(profile.name);
  const colorClass = getProfileColor(profile.name);
  return (
    <div className="relative group">
      <button
        onClick={() => onSelect(profile)}
        className="w-full flex flex-col items-center gap-3 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-200"
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white ${colorClass}`}>
          {initials}
        </div>
        <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate w-full text-center">
          {profile.name}
        </p>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(profile); }}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-zinc-800/80 text-zinc-500 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Edit profile"
      >
        <Pencil className="w-3 h-3" />
      </button>
    </div>
  );
}

function AddProfileCard({ canAdd, account, onClick }) {
  if (canAdd) {
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 text-zinc-600 hover:text-zinc-400 transition-all duration-200"
      >
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center">
          <Plus className="w-6 h-6" />
        </div>
        <p className="text-sm">Add Profile</p>
      </button>
    );
  }
  return (
    <div className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-dashed border-zinc-800 text-zinc-700 opacity-60 cursor-default">
      <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center">
        <Lock className="w-5 h-5" />
      </div>
      <p className="text-xs text-center leading-snug">{getUpgradePrompt(account.tierName)}</p>
    </div>
  );
}

function AddProfileSheet({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const trimmed = name.trim();

  const handleConfirm = () => {
    if (!trimmed) return;
    const profile = createProfile({ name: trimmed, color: getProfileColor(trimmed) });
    onCreated(profile);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-100">New Profile</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <input
          autoFocus
          type="text"
          placeholder="Profile name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleConfirm(); }}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!trimmed}
            className="flex-1 py-2.5 rounded-xl bg-emerald-800/70 hover:bg-emerald-700/80 disabled:bg-zinc-700 disabled:text-zinc-500 text-emerald-200 text-sm font-semibold transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function EditProfileSheet({ profile, onClose, onDeleted, onRenamed }) {
  const [view, setView] = useState('menu'); // 'menu' | 'rename' | 'confirmDelete'
  const [name, setName] = useState(profile.name);
  const [deleteError, setDeleteError] = useState('');
  const trimmed = name.trim();

  const handleRename = () => {
    if (!trimmed || trimmed === profile.name) return;
    updateProfile(profile.id, {
      name: trimmed,
      initials: trimmed.split(/\s+/).map(w => w[0]?.toUpperCase() || '').slice(0, 2).join(''),
    });
    onRenamed();
  };

  const handleDelete = () => {
    const result = deleteProfile(profile.id);
    if (result === false) {
      setDeleteError('You need at least one profile.');
      return;
    }
    onDeleted();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        {view === 'menu' && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-100">{profile.name}</h2>
              <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setView('rename')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-sm transition-colors"
              >
                <Pencil className="w-4 h-4" /> Rename
              </button>
              <button
                onClick={() => setView('confirmDelete')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-900/40 hover:bg-red-950/30 text-red-400 text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete Profile
              </button>
            </div>
          </>
        )}

        {view === 'rename' && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-100">Rename Profile</h2>
              <button onClick={() => setView('menu')} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleRename(); }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            <div className="flex gap-3">
              <button onClick={() => setView('menu')} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleRename}
                disabled={!trimmed || trimmed === profile.name}
                className="flex-1 py-2.5 rounded-xl bg-emerald-800/70 hover:bg-emerald-700/80 disabled:bg-zinc-700 disabled:text-zinc-500 text-emerald-200 text-sm font-semibold transition-colors"
              >
                Save
              </button>
            </div>
          </>
        )}

        {view === 'confirmDelete' && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-red-400">Delete Profile</h2>
              <button onClick={() => setView('menu')} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              This will permanently erase all progress for <span className="text-zinc-200 font-medium">{profile.name}</span>. This cannot be undone.
            </p>
            {deleteError && <p className="text-xs text-amber-400">{deleteError}</p>}
            <div className="flex gap-3">
              <button onClick={() => setView('menu')} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-900/60 hover:bg-red-800/70 text-red-300 text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ProfileSelect() {
  const { selectProfile } = useProfile();
  const [profiles, setProfiles] = useState(() => {
    const p = getProfiles();
    return Array.isArray(p) ? p : [];
  });
  const [account, setAccountState] = useState(() => getAccount());
  const [showAdd, setShowAdd] = useState(false);
  const [editProfile, setEditProfile] = useState(null);

  const refreshProfiles = () => {
    const p = getProfiles();
    setProfiles(Array.isArray(p) ? p : []);
    setAccountState(getAccount());
  };

  const handleSelect = (profile) => {
    selectProfile(profile.id);
    window.location.href = createPageUrl('CourseSelectionPage');
  };

  const handleCreated = (profile) => {
    setShowAdd(false);
    refreshProfiles();
    handleSelect(profile);
  };

  const handleDeleted = () => {
    setEditProfile(null);
    refreshProfiles();
  };

  const handleRenamed = () => {
    setEditProfile(null);
    refreshProfiles();
  };

  const canAdd = canAddProfile();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header — matches CourseSelectionPage */}
      <div className="pt-14 pb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-zinc-100">Noesis</span>
        </div>
        <p className="text-zinc-600 text-xs tracking-wide">Mechanistic learning, from first principles</p>
      </div>

      {/* Title */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-2xl font-bold text-zinc-100">Who's learning today?</h1>
      </div>

      {/* Grid */}
      <div className="flex-1 flex items-start justify-center px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-lg">
          {profiles.map(profile => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSelect={handleSelect}
              onEdit={setEditProfile}
            />
          ))}
          <AddProfileCard
            canAdd={canAdd}
            account={account}
            onClick={() => setShowAdd(true)}
          />
        </div>
      </div>

      {showAdd && (
        <AddProfileSheet
          onClose={() => setShowAdd(false)}
          onCreated={handleCreated}
        />
      )}

      {editProfile && (
        <EditProfileSheet
          profile={editProfile}
          onClose={() => setEditProfile(null)}
          onDeleted={handleDeleted}
          onRenamed={handleRenamed}
        />
      )}
    </div>
  );
}