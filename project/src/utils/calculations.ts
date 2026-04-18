import { QuestionnaireData, ProgrammeHifz } from '../types/hifz';
import { TOTAL_PAGES, PAGES_PAR_JUZ } from '../data/juz';

export const minutesToPagesPerDay = (minutes: number): number => {
  if (minutes <= 15) return 0.25;
  if (minutes <= 30) return 0.5;
  if (minutes <= 45) return 0.5;
  if (minutes <= 60) return 1;
  if (minutes <= 90) return 1;
  return 1.5;
};

export const minutesToLabel = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  if (minutes === 60) return '1h';
  if (minutes === 90) return '1h30';
  return '2h';
};

export const calculateProgramme = (data: QuestionnaireData): ProgrammeHifz => {
  const pagesParJour = minutesToPagesPerDay(data.minutesParJour);

  let juzDepart = 1;
  let pagesDejaMemori = 0;

  if (data.situation !== 'debutant' && data.situation !== null) {
    // Note: departMemorisation type is 'debut' | 'milieu' | 'juzPrecis' | null
    juzDepart = data.juzArrive;
    pagesDejaMemori = (data.juzArrive - 1) * PAGES_PAR_JUZ;
  }

  let pagesRestantes = TOTAL_PAGES - pagesDejaMemori;
  let pagesTotal = TOTAL_PAGES;

  if (data.objectif === 'nombreJuz') {
    pagesTotal = data.nombreJuzObjectif * PAGES_PAR_JUZ;
    pagesRestantes = Math.max(0, pagesTotal - pagesDejaMemori);
  } else if (data.objectif === 'revision') {
    pagesRestantes = pagesDejaMemori;
    pagesTotal = pagesDejaMemori;
  }

  const revisionPureRequise = data.qualiteMemorisation === 'oubliee';

  const phase =
    revisionPureRequise
      ? 'revision_pure'
      : data.objectif === 'revision'
      ? 'revision'
      : 'memorisation';

  const joursActifs = data.joursParSemaine.length || 5;
  const pagesParSemaine = pagesParJour * joursActifs;
  const joursTotal = pagesParSemaine > 0 ? pagesRestantes / pagesParSemaine * 7 : 0;
  const dureeEstimeeMois = Math.ceil(joursTotal / 30);

  return {
    pagesParJour,
    dureeEstimeeMois,
    phase,
    revisionPureRequise,
    juzDepart,
    pagesTotal,
    pagesRestantes,
  };
};

export const isFriday = (): boolean => {
  return new Date().getDay() === 5;
};

export const getDaysUntilObjectif = (dateObjectif: string): number => {
  if (!dateObjectif) return 0;
  const target = new Date(dateObjectif);
  const today = new Date();
  const diff = target.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const formatDuration = (seconds: number): string => {
  const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
  const ss = (seconds % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
};

export const getPagesThisMonth = (jours: { date: string; pageFaite: boolean }[]): number => {
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  return jours.filter(j => j.date >= monthStart && j.pageFaite).length;
};
