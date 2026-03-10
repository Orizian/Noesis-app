import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  getActiveProfileId,
  setActiveProfileId,
  clearActiveProfile,
  getProfileById,
  getProfileRootProgress,
  setProfileRootProgress,
} from './profileStorage';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [activeProfileId, setActiveProfileIdState] = useState(() => getActiveProfileId());
  // profilesVersion gates re-reads of profile data after explicit mutations only
  const [profilesVersion, setProfilesVersion] = useState(0);

  const refresh = useCallback(() => setProfilesVersion(v => v + 1), []);

  const selectProfile = useCallback((id) => {
    setActiveProfileId(id);
    setActiveProfileIdState(id);
  }, []);

  const deselectProfile = useCallback(() => {
    clearActiveProfile();
    setActiveProfileIdState(null);
  }, []);

  // Memoized — only re-reads storage when activeProfileId or profilesVersion changes,
  // not on every render of any consumer.
  const activeProfile = useMemo(
    () => (activeProfileId ? getProfileById(activeProfileId) : null),
    [activeProfileId, profilesVersion] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // getRootProgress is lazy — reads storage only when a component explicitly calls it.
  // No eager progress scan on context render.
  const getRootProgress = useCallback((rootId) => {
    if (!activeProfileId) return null;
    return getProfileRootProgress(activeProfileId, rootId);
  }, [activeProfileId, profilesVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  const setRootProgress = useCallback((rootId, data) => {
    if (!activeProfileId) return;
    setProfileRootProgress(activeProfileId, rootId, data);
    refresh();
  }, [activeProfileId, refresh]);

  // Memoize the context value object itself so consumers only re-render
  // when something they actually use changes.
  const value = useMemo(() => ({
    activeProfileId,
    activeProfile,
    profilesVersion,
    refresh,
    selectProfile,
    deselectProfile,
    getRootProgress,
    setRootProgress,
  }), [activeProfileId, activeProfile, profilesVersion, refresh, selectProfile, deselectProfile, getRootProgress, setRootProgress]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}