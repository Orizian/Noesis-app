import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { PROFILE_COLORS, PROFILE_EMOJIS, getColorConfig } from './ProfileAvatar';
import { updateProfile } from './profileStorage';
import PinPad from './PinPad';

export default function EditProfileModal({ profile, onSaved, onClose }) {
  const [name, setName] = useState(profile.name);
  const [color, setColor] = useState(profile.color);
  const [emoji, setEmoji] = useState(profile.emoji || '');
  const [usePIN, setUsePIN] = useState(!!profile.pin);
  const [pin, setPin] = useState('');
  const [step, setStep] = useState('form');
  const [error, setError] = useState('');

  const colorConfig = getColorConfig(color);
  const initials = name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

  const handleSave = () => {
    if (!name.trim()) { setError('Name is required'); return; }
    if (usePIN && !pin && !profile.pin) { setError('Enter a 4-digit PIN'); return; }
    updateProfile(profile.id, {
      name: name.trim(),
      color,
      emoji: emoji || null,
      pin: usePIN ? (pin || profile.pin) : null,
    });
    onSaved();
  };

  if (step === 'pin') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Set New PIN</h2>
            <button onClick={() => setStep('form')} className="text-zinc-500 hover:text-zinc-300"><X className="w-5 h-5" /></button>
          </div>
          <PinPad value={pin} onChange={setPin} onComplete={(val) => { setPin(val); }} />
          <button
            onClick={handleSave}
            disabled={pin.length !== 4}
            className="mt-5 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white ${colorConfig.bg}`}>
            {emoji || initials}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-zinc-400 mb-1.5 block">Name</label>
          <input
            type="text" value={name} onChange={e => { setName(e.target.value); setError(''); }}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs text-zinc-400 mb-2 block">Color</label>
          <div className="flex gap-2 flex-wrap">
            {PROFILE_COLORS.map(c => (
              <button key={c.id} onClick={() => setColor(c.id)}
                className={`w-8 h-8 rounded-full ${c.bg} transition-all ${color === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110' : ''}`} />
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="text-xs text-zinc-400 mb-2 block">Emoji (optional)</label>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setEmoji('')}
              className={`w-9 h-9 rounded-lg text-sm border flex items-center justify-center transition-all
                ${!emoji ? 'border-zinc-500 bg-zinc-700 text-zinc-200' : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'}`}>
              <span className="text-xs">AB</span>
            </button>
            {PROFILE_EMOJIS.map(e => (
              <button key={e} onClick={() => setEmoji(emoji === e ? '' : e)}
                className={`w-9 h-9 rounded-lg text-lg border transition-all
                  ${emoji === e ? 'border-zinc-500 bg-zinc-700' : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'}`}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <button
            onClick={() => setUsePIN(!usePIN)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-all text-sm
              ${usePIN ? 'border-emerald-700 bg-emerald-950/30 text-emerald-300' : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'}`}
          >
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>{usePIN ? (profile.pin ? 'Change PIN' : 'Protect with PIN') : 'Protect with PIN'}</span>
            <div className={`ml-auto w-8 h-4 rounded-full transition-colors ${usePIN ? 'bg-emerald-600' : 'bg-zinc-700'}`}>
              <div className={`w-3 h-3 bg-white rounded-full mt-0.5 transition-transform ${usePIN ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'}`} />
            </div>
          </button>
        </div>

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <button
          onClick={() => {
            if (!name.trim()) { setError('Name is required'); return; }
            if (usePIN && !profile.pin) { setStep('pin'); } else { handleSave(); }
          }}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}