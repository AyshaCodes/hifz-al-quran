export interface Surah {
  number: number;
  nameArabic: string;
  nameFrench: string;
  nameTranslit: string;
  verses: number;
  revelationType: 'mecquoise' | 'médinoise';
  pages: number;
  juz: number;
}

export interface Verse {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  audio?: string;
}

export type MemorizationQuality = 'good' | 'partial' | 'forgotten';

export interface UserProfile {
  prenom: string;
  juzActuel: number;
  objectif: string;
  tempsParJour: number;
  createdAt: string;
  /** État des Juz déjà acquis (pédagogie) — absent sur anciens profils = bon */
  memorizationQuality?: MemorizationQuality;
  /** Fin (inclusive, format YYYY-MM-DD) : pas de nouvelle mémorisation, révision seule */
  revisionOnlyUntil?: string;
  /** Pages à revoir très vite (ex. après évaluation « hésitations ») */
  urgentReviewPages?: number[];
  /** L'utilisateur a masqué la carte « 10 Juz » sans activer le mode */
  tenJuzDismissed?: boolean;
}

export type PageQuality = 'fluent' | 'hesitant' | 'hard';

export interface DailyProgress {
  date: string;
  pagesDone: number;
  completed: boolean;
  lastReviewedAt?: string;
  /** Ressenti après la page mémorisée ce jour-là */
  pageQuality?: PageQuality;
  /** Temps de session (chrono) ce jour, en secondes */
  sessionSeconds?: number;
  surahNumber?: number;
  verseFrom?: number;
  verseTo?: number;
}

export interface Bookmark {
  surahNumber: number;
  verseNumber: number;
  surahName: string;
  surahNameArabic: string;
  verseText: string;
  savedAt: string;
  note?: string;
  category?: string;
}

export type Page = 'home' | 'lire' | 'hifz' | 'signets';

export interface Reciter {
  id: string;
  name: string;
  nameArabic: string;
}
