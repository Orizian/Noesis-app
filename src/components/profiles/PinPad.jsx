import React from 'react';
import { Delete } from 'lucide-react';

export default function PinPad({ value, onChange, onComplete }) {
  const digits = Array(4).fill('');

  const handleDigit = (d) => {
    if (value.length >= 4) return;
    const next = value + d;
    onChange(next);
    if (next.length === 4 && onComplete) onComplete(next);
  };

  const handleDelete = () => {
    onChange(value.slice(0, -1));
  };

  return (
    <div>
      {/* Dots */}
      <div className="flex justify-center gap-4 mb-8">
        {digits.map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-200
              ${i < value.length
                ? 'bg-emerald-500 border-emerald-500 scale-110'
                : 'bg-transparent border-zinc-600'
              }`}
          />
        ))}
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button
            key={n}
            onClick={() => handleDigit(String(n))}
            className="h-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xl font-medium transition-colors active:scale-95"
          >
            {n}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleDigit('0')}
          className="h-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xl font-medium transition-colors active:scale-95"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="h-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 flex items-center justify-center transition-colors active:scale-95"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}