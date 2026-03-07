import React, { useState } from 'react';
import ProfileAvatar from './ProfileAvatar';
import PinPad from './PinPad';
import { resetProfileProgress, updateProfile } from './profileStorage';

export default function PinEntryOverlay({ profile, onSuccess, onBack }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotConfirm, setForgotConfirm] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handlePin = (val) => {
    setPin(val);
    setError('');
  };

  const handleComplete = (val) => {
    if (val === profile.pin) {
      onSuccess();
    } else {
      setError('Incorrect PIN');
      setTimeout(() => setPin(''), 400);
    }
  };

  const handleForgot = () => {
    if (forgotConfirm.toLowerCase() !== 'reset') {
      setForgotError('Type "reset" to confirm');
      return;
    }
    resetProfileProgress(profile.id);
    updateProfile(profile.id, { pin: null });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col items-center justify-center p-6">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
      >
        ← Back
      </button>

      <div className="w-full max-w-xs">
        <div className="flex flex-col items-center mb-8">
          <ProfileAvatar profile={profile} size="lg" />
          <p className="mt-3 text-lg font-semibold text-zinc-100">{profile.name}</p>
          <p className="text-sm text-zinc-500 mt-1">Enter your PIN</p>
        </div>

        {!showForgot ? (
          <>
            <PinPad value={pin} onChange={handlePin} onComplete={handleComplete} />
            {error && (
              <p className="text-red-400 text-sm text-center mt-4 animate-pulse">{error}</p>
            )}
            <button
              onClick={() => setShowForgot(true)}
              className="mt-6 w-full text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Forgot PIN
            </button>
          </>
        ) : (
          <div className="mt-4">
            <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-4 mb-4">
              <p className="text-red-400 text-sm font-medium mb-1">Warning</p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                This will reset <strong>all progress</strong> for this profile and remove the PIN. This cannot be undone.
              </p>
            </div>
            <p className="text-xs text-zinc-500 mb-2">Type <span className="text-zinc-300 font-mono">reset</span> to confirm</p>
            <input
              type="text"
              value={forgotConfirm}
              onChange={e => { setForgotConfirm(e.target.value); setForgotError(''); }}
              placeholder="reset"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-700 mb-3"
            />
            {forgotError && <p className="text-red-400 text-xs mb-3">{forgotError}</p>}
            <button
              onClick={handleForgot}
              className="w-full py-3 rounded-xl bg-red-800 hover:bg-red-700 text-white text-sm font-medium transition-colors mb-2"
            >
              Reset Progress & Remove PIN
            </button>
            <button
              onClick={() => { setShowForgot(false); setForgotConfirm(''); }}
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}