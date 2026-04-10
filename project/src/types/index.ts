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

export interface UserProfile {
  prenom: string;
  juzActuel: number;
  objectif: string;
  tempsParJour: number;
  createdAt: string;
}

export interface DailyProgress {
  date: string;
  pagesDone: number;
  completed: boolean;
  lastReviewedAt?: string;
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
}

export type Page = 'home' | 'lire' | 'hifz' | 'signets';

export interface Reciter {
  id: string;
  name: string;
  nameArabic: string;
}
