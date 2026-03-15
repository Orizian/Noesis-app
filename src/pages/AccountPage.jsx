import React, { useState } from 'react';
import { ArrowLeft, Cloud, Check, Pencil, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getAccount,
  setAccountTier,
  setAccountDisplayName,
  exportAccountData,
  clearAllAccountData,
  getProfiles,
  getMobileUiSize,
  setMobileUiSize,
} from '../components/profiles/profileStorage';
import { createPageUrl } from '@/utils';

const TIERS = [
  { key: 'free',        label: 'Free',        maxProfiles: 1,  badgeClass: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
  { key: 'scholar',     label: 'Scholar',     maxProfiles: 3,  badgeClass: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50' },
  { key: 'institution', label: 'Institution', maxProfiles: 10, badgeClass: 'bg-violet-950/60 text-violet-400 border-violet-800/50' },
];

function TierBadge({ tierName }) {
  const tier = TIERS.find(t => t.key === tierName) || TIERS[0];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium ${tier.badgeClass}`}>
      {tier.label}
    </span>
  );
}

function SectionHeader({ title }) {
  return <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">{title}</h2>;
}

export default function AccountPage() {
  const navigate = useNavigate();
  const [account, setAccountState] = useState(() => getAccount());
  const [profiles] = useState(() => getProfiles());
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(account.displayName || '');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const refresh = () => setAccountState(getAccount());

  const handleSaveName = () => {
    setAccountDisplayName(nameInput);
    refresh();
    setEditingName(false);
  };

  const handleUpgrade = (tierKey) => {
    setAccountTier(tierKey);
    refresh();
  };

  const handleClearAll = () => {
    clearAllAccountData();
    navigate(createPageUrl('ProfileSelect'));
  };

  const currentTierIdx = TIERS.findIndex(t => t.key === account.tierName);
  const upgradableTiers = TIERS.slice(currentTierIdx + 1);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { navigate(createPageUrl('ProfileSelect')); }}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-lg font-semibold text-zinc-100">Account</h1>
        </div>

        {/* Section 1 — Identity */}
        <div>
          <SectionHeader title="Account Identity" />
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-5 space-y-3">
            {/* Display name */}
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
                  placeholder="Display name"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                />
                <button onClick={handleSaveName} className="p-2 rounded-lg bg-emerald-800/60 hover:bg-emerald-700/70 text-emerald-200 transition-colors">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setEditingName(false)} className="p-2 rounded-lg text-zinc-600 hover:text-zinc-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setNameInput(account.displayName || ''); setEditingName(true); }}
                className="group flex items-center gap-2 w-full text-left"
              >
                <span className={`text-sm flex-1 ${account.displayName ? 'text-zinc-200' : 'text-zinc-600'}`}>
                  {account.displayName || 'Add a display name'}
                </span>
                <Pencil className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            )}
            {/* Tier badge */}
            <div>
              <TierBadge tierName={account.tierName} />
            </div>
          </div>
        </div>

        {/* Section 2 — Plan */}
        <div>
          <SectionHeader title="Your Plan" />
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-5 space-y-4">
            <p className="text-sm text-zinc-500">
              {profiles.length} of {account.maxProfiles} profile{account.maxProfiles !== 1 ? 's' : ''} used
            </p>

            {/* Tier table */}
            <div className="grid grid-cols-3 gap-2">
              {TIERS.map(tier => {
                const isCurrent = tier.key === account.tierName;
                return (
                  <div
                    key={tier.key}
                    className={`rounded-xl border p-3 text-center transition-colors ${
                      isCurrent
                        ? 'border-emerald-800/50 bg-emerald-950/20'
                        : 'border-zinc-800 bg-zinc-900/30'
                    }`}
                  >
                    <p className={`text-xs font-semibold mb-1 ${isCurrent ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {tier.label}
                    </p>
                    <p className="text-lg font-bold text-zinc-200">{tier.maxProfiles}</p>
                    <p className="text-[10px] text-zinc-600">profile{tier.maxProfiles !== 1 ? 's' : ''}</p>
                    {isCurrent && (
                      <div className="mt-1.5 flex justify-center">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Upgrade buttons */}
            {upgradableTiers.length > 0 ? (
              <div className="space-y-2">
                {upgradableTiers.map(tier => (
                  <button
                    key={tier.key}
                    onClick={() => handleUpgrade(tier.key)}
                    className="w-full py-2.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-700/70 text-emerald-200 text-sm font-semibold transition-colors"
                  >
                    Upgrade to {tier.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-600 text-center">You're on our top plan</p>
            )}

            <p className="text-[11px] text-zinc-700 text-center">Paid upgrades coming soon — enjoy free access while it lasts.</p>
          </div>
        </div>

        {/* Section 3 — Data */}
        <div>
          <SectionHeader title="Your Data" />
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-5 space-y-3">
            <button
              onClick={exportAccountData}
              className="w-full py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-800 transition-colors"
            >
              Export Progress
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-2.5 rounded-xl border border-red-900/40 text-red-400 text-sm hover:bg-red-950/20 transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* Section 4 — Cloud Sync */}
        <div>
          <SectionHeader title="Cloud Sync" />
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/30 p-5 flex gap-4 items-start">
            <div className="w-9 h-9 rounded-xl bg-zinc-800/60 border border-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cloud className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium text-zinc-400">Cloud Sync</p>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Your progress is currently saved locally on this device. Cloud sync will allow you to access your progress across devices and keep it safe if you switch phones.
              </p>
              <button disabled className="mt-1 px-4 py-2 rounded-xl border border-zinc-800 text-zinc-700 text-xs cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 pb-4 space-y-1">
          <p className="text-xs text-zinc-700">Noesis — Build Genuine Understanding</p>
          <p className="text-xs text-zinc-800">v0.1.0</p>
        </div>
      </div>

      {/* Clear confirm modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-base font-semibold text-red-400">Clear All Data</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              This will permanently delete all profiles, progress, and account data on this device. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-2.5 rounded-xl bg-red-900/60 hover:bg-red-800/70 text-red-300 text-sm font-semibold transition-colors"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}