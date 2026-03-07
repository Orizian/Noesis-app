import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getProfiles,
  getActiveProfileId,
  setActiveProfileId,
  clearActiveProfile,
  getProfileById,
  getProfileProgress,
  getProfileRootProgress,
  setProfileRootProgress,
} from './profileStorage';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [activeProfileId, setActiveProfileIdState] = useState(() => getActiveProfileId());
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

  const activeProfile = activeProfileId ? getProfileById(activeProfileId) : null;
  const progress = activeProfileId ? getProfileProgress(activeProfileId) : {};

  const getRootProgress = useCallback((rootId) => {
    if (!activeProfileId) return null;
    return getProfileRootProgress(activeProfileId, rootId);
  }, [activeProfileId, profilesVersion]);

  const setRootProgress = useCallback((rootId, data) => {
    if (!activeProfileId) return;
    setProfileRootProgress(activeProfileId, rootId, data);
    refresh();
  }, [activeProfileId, refresh]);

  return (
    <ProfileContext.Provider value={{
      activeProfileId,
      activeProfile,
      progress,
      profilesVersion,
      refresh,
      selectProfile,
      deselectProfile,
      getRootProgress,
      setRootProgress,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}