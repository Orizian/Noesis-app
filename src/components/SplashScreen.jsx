import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { getActiveProfileId, getProfileById } from './profiles/profileStorage';

// Duration in ms before the splash exits
const SPLASH_DURATION = 3000;

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('logo');   // 'logo' | 'welcome' | 'done'
  const [profileName, setProfileName] = useState(null);

  useEffect(() => {
    const id = getActiveProfileId();
    if (id) {
      const profile = getProfileById(id);
      if (profile?.name) setProfileName(profile.name);
    }

    // Show logo, then optionally welcome, then exit
    const t1 = setTimeout(() => {
      setPhase('welcome');
    }, SPLASH_DURATION * 0.55);

    const t2 = setTimeout(() => {
      setPhase('done');
      setTimeout(onDone, 300); // let exit animation finish
    }, SPLASH_DURATION);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[999] bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">

        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center"
        >
          <BookOpen className="w-7 h-7 text-emerald-500" />
        </motion.div>

        {/* Wordmark + slogan */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="text-xl font-semibold text-zinc-100 tracking-tight">Noesis</p>
          <p className="text-sm text-zinc-500 mt-1">Build Genuine Understanding</p>
        </motion.div>

        {/* Welcome back message */}
        <AnimatePresence>
          {phase === 'welcome' && profileName && (
            <motion.p
              key="welcome"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-sm text-zinc-400 mt-1"
            >
              Welcome back, <span className="text-zinc-200 font-medium">{profileName}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}