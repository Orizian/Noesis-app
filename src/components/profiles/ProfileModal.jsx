import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AVATAR_COLORS, AVATAR_EMOJIS } from '../profileStore';

export default function ProfileModal({ profile, onSave, onClose, title }) {
  const [name, setName] = useState(profile?.name || '');
  const [color, setColor] = useState(profile?.color || AVATAR_COLORS[0]);
  const [emoji, setEmoji] = useState(profile?.emoji || null);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), color, emoji });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-100">{title || 'Create Profile'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-zinc-800 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Preview */}
        <div className="flex justify-center mb-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-semibold text-white select-none shadow-lg"
            style={{ backgroundColor: color }}
          >
            {emoji || (name ? name.slice(0,2).toUpperCase() : '??')}
          </div>
        </div>

        {/* Name input */}
        <div className="mb-4">
          <label className="text-xs text-zinc-400 uppercase tracking-wider mb-1.5 block">Name</label>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Enter name..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 
              placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
          />
        </div>

        {/* Color picker */}
        <div className="mb-4">
          <label className="text-xs text-zinc-400 uppercase tracking-wider mb-2 block">Avatar Color</label>
          <div className="flex gap-2 flex-wrap">
            {AVATAR_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-all ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Emoji picker */}
        <div className="mb-6">
          <label className="text-xs text-zinc-400 uppercase tracking-wider mb-2 block">Avatar Emoji (optional)</label>
          <div className="flex gap-1.5 flex-wrap">
            {emoji && (
              <button
                onClick={() => setEmoji(null)}
                className="px-2.5 py-1 rounded-lg text-xs bg-red-950/50 text-red-400 border border-red-900/50 hover:bg-red-900/40 transition-colors"
              >
                Clear
              </button>
            )}
            {AVATAR_EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => setEmoji(emoji === e ? null : e)}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all
                  ${emoji === e ? 'bg-zinc-700 ring-2 ring-white/30' : 'bg-zinc-800 hover:bg-zinc-700'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 
            disabled:text-zinc-500 text-white font-medium text-sm transition-colors"
        >
          {profile ? 'Save Changes' : 'Create Profile'}
        </button>
      </div>
    </div>
  );
}