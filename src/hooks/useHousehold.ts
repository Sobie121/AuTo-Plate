// src/hooks/useHousehold.ts
import { useState, useEffect } from 'react';
import { HouseholdProfile } from '../types';

const STORAGE_KEY = 'family_culinary_profile_v1';

export function useHousehold() {
  const [profile, setProfile] = useState<HouseholdProfile | null>(null);
  const [isFirstRun, setIsFirstRun] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check if profile exists in localStorage (or Firebase doc)
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setProfile(JSON.parse(raw));
        setIsFirstRun(false);
      } catch (e) {
        setIsFirstRun(true);
      }
    } else {
      // Clean start state
      setIsFirstRun(true);
    }
    setLoading(false);
  }, []);

  const saveProfile = async (newProfile: HouseholdProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    setProfile(newProfile);
    setIsFirstRun(false);
    
    // If sharing via Firebase Firestore:
    // await setDoc(doc(db, "households", newProfile.id), newProfile);
  };

  const resetToFactorySettings = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
    setIsFirstRun(true);
  };

  return { profile, isFirstRun, loading, saveProfile, resetToFactorySettings };
}