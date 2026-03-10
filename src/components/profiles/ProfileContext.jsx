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
  // courseId is passed in via setter; components get it from useCourse()
  // We store it here so ProfileContext can proxy storage calls correctly.
  const [activeCourseId, setActiveCourseId] = useState(null);

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
  const progress = activeProfileId && activeCourseId ? getProfileProgress(activeProfileId, activeCourseId) : {};

  const getRootProgress = useCallback((rootId) => {
    if (!activeProfileId || !activeCourseId) return null;
    return getProfileRootProgress(activeProfileId, activeCourseId, rootId);
  }, [activeProfileId, activeCourseId, profilesVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  const setRootProgress = useCallback((rootId, data) => {
    if (!activeProfileId || !activeCourseId) return;
    setProfileRootProgress(activeProfileId, activeCourseId, rootId, data);
    refresh();
  }, [activeProfileId, activeCourseId, refresh]);

  return (
    <ProfileContext.Provider value={{
      activeProfileId,
      activeProfile,
      progress,
      profilesVersion,
      activeCourseId,
      setActiveCourseId,
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