import React, { useState } from 'react';
import { Delete } from 'lucide-react';
import AvatarCircle from './AvatarCircle';
import { getTotalScore } from '../profileStore';

const DIGITS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export default function PinEntry({ profile, onSuccess, onForgotPin }) {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);

  const score = getTotalScore(profile.id);
  const pct = Math.round((score / 48) * 100);

  const handleDigit = (d) => {
    if (d === '⌫') {
      setPin(p => p.slice(0, -1));
      setError(false);
      return;
    }
    if (!d) return;
    const next = pin + d;
    if (next.length > 4) return;
    setPin(next);
    setError(false);

    if (next.length === 4) {
      if (next === profile.pin) {
        onSuccess();
      } else {
        setShake(true);
        setError(true);
        setTimeout(() => {
          setPin('');
          setShake(false);
        }, 600);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xs flex flex-col items-center gap-6">
        {/* Profile */}
        <div className="flex flex-col items-center gap-2">
          <AvatarCircle profile={profile} size="xl" showRing ringPercent={pct} />
          <p className="text-base font-semibold text-zinc-100">{profile.name}</p>
          <p className="text-sm text-zinc-500">Enter PIN to continue</p>
        </div>

        {/* Dots */}
        <div className={`flex gap-4 ${shake ? 'animate-[shake_0.5s_ease-out]' : ''}`}>
          {[0,1,2,3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                i < pin.length
                  ? error
                    ? 'bg-red-500 border-red-500'
                    : 'bg-emerald-400 border-emerald-400'
                  : 'border-zinc-600 bg-transparent'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-400 -mt-2">Incorrect PIN</p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {DIGITS.map((d, i) => (
            <button
              key={i}
              onClick={() => handleDigit(d)}
              disabled={!d && d !== '0'}
              className={`h-16 rounded-2xl text-xl font-medium transition-all duration-100 active:scale-95
                ${!d && d !== '0'
                  ? 'invisible'
                  : d === '⌫'
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 flex items-center justify-center'
                    : 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
                }
              `}
            >
              {d === '⌫' ? <Delete className="w-5 h-5 mx-auto" /> : d}
            </button>
          ))}
        </div>

        {/* Forgot PIN */}
        <button
          onClick={onForgotPin}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Forgot PIN? (resets all progress)
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}