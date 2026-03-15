import React, { useState, useRef, useEffect } from 'react';
import { LogOut, BarChart2, Trash2, Edit2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useProfile } from './ProfileContext';
import ProfileAvatar from './ProfileAvatar';
import { deleteProfile, getProfiles } from './profileStorage';
import EditProfileModal from './EditProfileModal';

export default function ProfileDropdown() {
  const { activeProfile, deselectProfile, refresh } = useProfile();
  const [open, setOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!activeProfile) return null;

  const handleDelete = () => {
    if (deleteInput !== activeProfile.name) {
      setDeleteError('Name does not match');
      return;
    }
    deleteProfile(activeProfile.id);
    deselectProfile();
    refresh();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-150 active:scale-95"
      >
        <ProfileAvatar profile={activeProfile} size="sm" />
        <span className="text-sm text-zinc-300 hidden sm:block max-w-[100px] truncate">{activeProfile.name}</span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150">
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-sm font-medium text-zinc-200 truncate">{activeProfile.name}</p>
            <p className="text-xs text-zinc-500">Profile</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => { setOpen(false); deselectProfile(); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-all duration-150 text-left active:bg-zinc-700"
            >
              <LogOut className="w-4 h-4 text-zinc-500" />
              Switch Profile
            </button>
            <button
              onClick={() => { setOpen(false); setShowEdit(true); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-all duration-150 text-left active:bg-zinc-700"
            >
              <Edit2 className="w-4 h-4 text-zinc-500" />
              Edit Profile
            </button>
            <Link
              to={createPageUrl('Stats')}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-all duration-150 text-left active:bg-zinc-700"
            >
              <BarChart2 className="w-4 h-4 text-zinc-500" />
              My Stats
            </Link>
          </div>
          <div className="py-1 border-t border-zinc-800">
            <button
              onClick={() => { setOpen(false); setShowDelete(true); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 transition-all duration-150 text-left active:bg-zinc-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete My Profile
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Delete Profile</h3>
            <p className="text-sm text-zinc-400 mb-4">
              This will permanently delete <strong className="text-zinc-200">{activeProfile.name}</strong> and all progress. Type the profile name to confirm.
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={e => { setDeleteInput(e.target.value); setDeleteError(''); }}
              placeholder={activeProfile.name}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-700 mb-3"
            />
            {deleteError && <p className="text-red-400 text-xs mb-3">{deleteError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDelete(false); setDeleteInput(''); }}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-all duration-150 active:scale-[0.97]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white text-sm transition-all duration-150 active:scale-[0.97]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <EditProfileModal
          profile={activeProfile}
          onSaved={() => { refresh(); setShowEdit(false); }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}