import React, { useState } from 'react';
import { X, Lock, Delete } from 'lucide-react';
import { AVATAR_COLORS, AVATAR_EMOJIS } from '../profileStore';

const NUMPAD = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export default function ProfileModal({ profile, onSave, onClose, title }) {
  const [name, setName] = useState(profile?.name || '');
  const [color, setColor] = useState(profile?.color || AVATAR_COLORS[0]);
  const [emoji, setEmoji] = useState(profile?.emoji || null);
  const [step, setStep] = useState('profile'); // 'profile' | 'pin'

  // PIN state
  const [pinMode, setPinMode] = useState(profile?.pin ? 'has_pin' : 'none'); // 'none' | 'setting' | 'has_pin' | 'changing' | 'verify_old'
  const [pinInput, setPinInput] = useState('');
  const [oldPinInput, setOldPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [newPin, setNewPin] = useState(null); // confirmed new pin

  const handleSave = () => {
    if (!name.trim()) return;
    const pinToSave = newPin !== null ? newPin : (profile?.pin || null);
    onSave({ name: name.trim(), color, emoji, pin: pinToSave });
  };

  // Skip PIN step
  const handleSkipPin = () => {
    onSave({ name: name.trim(), color, emoji, pin: null });
  };

  const handleNumpad = (d, target) => {
    if (d === '⌫') {
      if (target === 'old') setOldPinInput(p => p.slice(0, -1));
      else setPinInput(p => p.slice(0, -1));
      setPinError('');
      return;
    }
    if (!d) return;
    if (target === 'old') {
      const next = oldPinInput + d;
      if (next.length > 4) return;
      setOldPinInput(next);
      if (next.length === 4) {
        if (next === profile.pin) {
          setOldPinInput('');
          setPinMode('setting');
          setPinError('');
        } else {
          setPinError('Incorrect PIN');
          setTimeout(() => { setOldPinInput(''); setPinError(''); }, 700);
        }
      }
    } else {
      const next = pinInput + d;
      if (next.length > 4) return;
      setPinInput(next);
      setPinError('');
      if (next.length === 4) {
        setNewPin(next);
        setPinMode('confirmed');
      }
    }
  };

  const renderNumpad = (target) => (
    <div className="grid grid-cols-3 gap-2.5 mt-4">
      {NUMPAD.map((d, i) => (
        <button
          key={i}
          onClick={() => handleNumpad(d, target)}
          disabled={!d && d !== '0'}
          type="button"
          className={`h-14 rounded-xl text-lg font-medium transition-all active:scale-95
            ${!d && d !== '0' ? 'invisible' :
              d === '⌫' ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 flex items-center justify-center' :
              'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'}`}
        >
          {d === '⌫' ? <Delete className="w-4 h-4 mx-auto" /> : d}
        </button>
      ))}
    </div>
  );

  const renderDots = (val) => (
    <div className="flex gap-3 justify-center my-3">
      {[0,1,2,3].map(i => (
        <div key={i} className={`w-3.5 h-3.5 rounded-full border-2 transition-all
          ${i < val.length ? 'bg-emerald-400 border-emerald-400' : 'border-zinc-600'}`}
        />
      ))}
    </div>
  );

  if (step === 'pin') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-zinc-100">
              {pinMode === 'has_pin' ? 'PIN Settings' :
               pinMode === 'setting' ? 'Set a PIN' :
               pinMode === 'confirmed' ? 'PIN Set!' :
               pinMode === 'verify_old' ? 'Enter Current PIN' :
               'Set a PIN (optional)'}
            </h2>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-zinc-800 flex items-center justify-center">
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          {pinMode === 'none' && (
            <>
              <p className="text-sm text-zinc-400 mb-6 text-center">
                Add a 4-digit PIN to protect this profile on shared devices. You can skip this.
              </p>
              {renderDots(pinInput)}
              <p className="text-xs text-red-400 text-center h-4">{pinError}</p>
              {renderNumpad('new')}
              <button
                onClick={handleSkipPin}
                className="w-full mt-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-600 transition-colors"
              >
                Skip — No PIN
              </button>
            </>
          )}

          {pinMode === 'has_pin' && (
            <>
              <p className="text-sm text-zinc-400 mb-4 text-center">This profile has a PIN.</p>
              <div className="space-y-2">
                <button
                  onClick={() => setPinMode('verify_old')}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm transition-colors"
                >
                  Change PIN
                </button>
                <button
                  onClick={() => { setNewPin(null); onSave({ name: name.trim(), color, emoji, pin: null }); }}
                  className="w-full py-2.5 rounded-xl border border-red-900/50 text-red-400 text-sm hover:bg-red-950/30 transition-colors"
                >
                  Remove PIN
                </button>
              </div>
              <button
                onClick={() => onSave({ name: name.trim(), color, emoji, pin: profile?.pin })}
                className="w-full mt-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
              >
                Save Profile
              </button>
            </>
          )}

          {pinMode === 'verify_old' && (
            <>
              <p className="text-sm text-zinc-400 mb-2 text-center">Enter your current PIN to change it</p>
              {renderDots(oldPinInput)}
              <p className="text-xs text-red-400 text-center h-4">{pinError}</p>
              {renderNumpad('old')}
            </>
          )}

          {pinMode === 'setting' && (
            <>
              <p className="text-sm text-zinc-400 mb-2 text-center">Enter a new 4-digit PIN</p>
              {renderDots(pinInput)}
              {renderNumpad('new')}
            </>
          )}

          {pinMode === 'confirmed' && (
            <>
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-700 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-sm text-zinc-300">PIN set successfully</p>
              </div>
              <button
                onClick={handleSave}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors"
              >
                {profile ? 'Save Changes' : 'Create Profile'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Profile step
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
            onKeyDown={e => e.key === 'Enter' && name.trim() && setStep('pin')}
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

        <div className="flex gap-2">
          {!profile && (
            <button
              onClick={() => { if (name.trim()) setStep('pin'); }}
              disabled={!name.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-700 
                text-zinc-300 hover:border-zinc-600 disabled:opacity-40 text-sm transition-colors"
            >
              <Lock className="w-4 h-4" />
              Set PIN
            </button>
          )}
          <button
            onClick={profile ? () => onSave({ name: name.trim(), color, emoji, pin: profile?.pin }) : handleSkipPin}
            disabled={!name.trim()}
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 
              disabled:text-zinc-500 text-white font-medium text-sm transition-colors"
          >
            {profile ? 'Save Changes' : 'Create Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}