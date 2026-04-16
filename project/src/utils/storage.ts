import { HifzProfile, HifzProgress } from '../types/hifz';

const STORAGE_KEYS = {
  PROFILE: 'hifz-profile',
  PROGRESS: 'hifz-progress',
} as const;

export const loadProfile = (): HifzProfile | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const saveProfile = (profile: HifzProfile): void => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

export const loadProgress = (): HifzProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return stored ? JSON.parse(stored) : {
      jours: [],
      joursConsecutifs: 0,
      pagesCompletees: 0,
      juzCompletes: 0,
      derniereRevision: {},
    };
  } catch {
    return {
      jours: [],
      joursConsecutifs: 0,
      pagesCompletees: 0,
      juzCompletes: 0,
      derniereRevision: {},
    };
  }
};

export const saveProgress = (progress: HifzProgress): void => {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
};
