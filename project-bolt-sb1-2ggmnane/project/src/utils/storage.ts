import { HifzProfile, HifzProgress, JourProgress } from '../types/hifz';

const PROFILE_KEY = 'hifz_profile';
const PROGRESS_KEY = 'hifz_progress';

export const saveProfile = (profile: HifzProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const loadProfile = (): HifzProfile | null => {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearProfile = (): void => {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(PROGRESS_KEY);
};

export const saveProgress = (progress: HifzProgress): void => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const loadProgress = (): HifzProgress => {
  const data = localStorage.getItem(PROGRESS_KEY);
  if (data) return JSON.parse(data);
  return {
    jours: [],
    joursConsecutifs: 0,
    pagesCompletees: 0,
    juzCompletes: 0,
    derniereRevision: {},
  };
};

export const getTodayKey = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getTodayProgress = (progress: HifzProgress): JourProgress | null => {
  const today = getTodayKey();
  return progress.jours.find(j => j.date === today) || null;
};

export const markTodayDone = (progress: HifzProgress, pageActuelle: number): HifzProgress => {
  const today = getTodayKey();
  const existing = progress.jours.find(j => j.date === today);
  const updatedJour: JourProgress = existing
    ? { ...existing, pageFaite: true }
    : { date: today, pageFaite: true, pageRevisee: false, dureeSession: 0 };

  const jours = existing
    ? progress.jours.map(j => j.date === today ? updatedJour : j)
    : [...progress.jours, updatedJour];

  const joursConsecutifs = calculateConsecutiveDays(jours);
  const pagesCompletees = progress.pagesCompletees + 1;

  return {
    ...progress,
    jours,
    joursConsecutifs,
    pagesCompletees,
    juzCompletes: Math.floor(pagesCompletees / 20),
    derniereRevision: { ...progress.derniereRevision, [pageActuelle]: today },
  };
};

export const markTodayRevised = (progress: HifzProgress, pageActuelle: number): HifzProgress => {
  const today = getTodayKey();
  const existing = progress.jours.find(j => j.date === today);
  const updatedJour: JourProgress = existing
    ? { ...existing, pageRevisee: true }
    : { date: today, pageFaite: false, pageRevisee: true, dureeSession: 0 };

  const jours = existing
    ? progress.jours.map(j => j.date === today ? updatedJour : j)
    : [...progress.jours, updatedJour];

  return {
    ...progress,
    jours,
    derniereRevision: { ...progress.derniereRevision, [pageActuelle]: today },
  };
};

export const addSessionDuration = (progress: HifzProgress, seconds: number): HifzProgress => {
  const today = getTodayKey();
  const existing = progress.jours.find(j => j.date === today);
  const updatedJour: JourProgress = existing
    ? { ...existing, dureeSession: existing.dureeSession + seconds }
    : { date: today, pageFaite: false, pageRevisee: false, dureeSession: seconds };

  const jours = existing
    ? progress.jours.map(j => j.date === today ? updatedJour : j)
    : [...progress.jours, updatedJour];

  return { ...progress, jours };
};

const calculateConsecutiveDays = (jours: JourProgress[]): number => {
  const today = new Date();
  let count = 0;
  let current = new Date(today);

  while (true) {
    const key = current.toISOString().split('T')[0];
    const jour = jours.find(j => j.date === key);
    if (!jour || (!jour.pageFaite && !jour.pageRevisee)) break;
    count++;
    current.setDate(current.getDate() - 1);
  }

  return count;
};

export const getWeekDays = (): { date: string; label: string; isFriday: boolean; isToday: boolean; isFuture: boolean }[] => {
  const days = [];
  const today = new Date();
  const dayNames = ['D', 'L', 'M', 'Me', 'J', 'V', 'S'];

  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      label: dayNames[d.getDay()],
      isFriday: d.getDay() === 5,
      isToday: i === 0,
      isFuture: i > 0,
    });
  }
  return days;
};

export const getPagesNotRevisedSince = (
  progress: HifzProgress,
  pageActuelle: number,
  days: number
): number[] => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  const unrevised: number[] = [];
  for (let p = 1; p <= pageActuelle; p++) {
    const lastRevision = progress.derniereRevision[p];
    if (!lastRevision || lastRevision < cutoffStr) {
      unrevised.push(p);
    }
  }
  return unrevised;
};

export const getMonthlyStats = (progress: HifzProgress): { semaine: string; pages: number }[] => {
  const stats: { semaine: string; pages: number }[] = [];
  const today = new Date();

  for (let w = 5; w >= 0; w--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - w * 7 - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const startStr = weekStart.toISOString().split('T')[0];
    const endStr = weekEnd.toISOString().split('T')[0];

    const pages = progress.jours.filter(
      j => j.date >= startStr && j.date <= endStr && j.pageFaite
    ).length;

    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    stats.push({
      semaine: `${monthNames[weekStart.getMonth()]} S${Math.ceil(weekStart.getDate() / 7)}`,
      pages,
    });
  }
  return stats;
};
