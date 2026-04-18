const BASE_URL = 'https://api.alquran.cloud/v1';
const NEW_API_BASE = 'https://quranapi.pages.dev/api';

// Cache simple en mémoire pour éviter les requêtes répétées
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(endpoint: string, params?: string): string {
  return `${endpoint}${params ? `_${params}` : ''}`;
}

function getFromCache(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Rate limiting équilibré pour éviter le 429 tout en restant rapide
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 800; // 800ms entre les requêtes (réduit pour plus de rapidité)

async function rateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
}

// Retry optimisé pour gérer les erreurs 429 et CORS
async function fetchWithRetry(url: string, maxRetries = 2): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // await rateLimit(); // Désactivé temporairement pour tester
      const response = await fetch(url);
      
      // Si c'est une erreur 429, on attend moins longtemps
      if (response.status === 429) {
        if (attempt === maxRetries) throw new Error('Rate limit exceeded after retries');
        const waitTime = 500 + (attempt * 500); // 500ms, 1s (plus court)
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // Si c'est une erreur CORS, on réessaie rapidement
      if (response.type === 'opaque' && attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 300));
        continue;
      }
      
      return response;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  throw new Error('Max retries exceeded');
}

export interface ApiVerse {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
}

export interface ApiPageVerse extends ApiVerse {
  surahNumber: number;
  translation: string;
  juz: number;
  hizbQuarter: number;
}

export interface ApiSurah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  ayahs: ApiVerse[];
}

export async function fetchSurahFromNewAPI(surahNumber: number) {
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Invalid surah number: ${surahNumber}`);
  }
  
  // 1. Vérifier d'abord les données locales
  const { isSurahAvailableLocally, getLocalVerses } = await import('../data/localQuranData');
  if (isSurahAvailableLocally(surahNumber)) {
    const localVerses = getLocalVerses(surahNumber);
    if (localVerses) {
      console.log(`Using local data for surah ${surahNumber}`);
      return localVerses.map(verse => ({
        number: verse.number,
        numberInSurah: verse.numberInSurah,
        text: verse.text,
        translation: verse.translation,
        audio: verse.audio || '',
      }));
    }
  }
  
  // 2. Vérifier le cache
  const cacheKey = getCacheKey('new_surah', String(surahNumber));
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  // 3. Essayer l'API seulement si les données locales ne sont pas disponibles
  try {
    console.log(`Fetching surah ${surahNumber} from API`);
    const response = await fetch(`${NEW_API_BASE}/${surahNumber}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch surah ${surahNumber}`);
    }

    const data = await response.json();

    // Transformer les données au format attendu par l'application
    const verses: ApiVerse[] = data.arabic1.map((text: string, index: number) => ({
      number: index + 1,
      numberInSurah: index + 1,
      text: text,
      translation: data.english[index] || '',
      audio: data.audio?.['1']?.url || '', // Audio de Mishary Rashid Al Afasy (premier récitateur)
    }));

    setCache(cacheKey, verses);
    return verses;
  } catch (error) {
    console.error('Error with new API, falling back to old API:', error);
    // Fallback vers l'ancienne API en cas d'erreur
    return fetchSurahWithTranslation(surahNumber);
  }
}

export async function fetchSurahWithTranslation(surahNumber: number, reciterId = 'ar.alafasy') {
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Invalid surah number: ${surahNumber}`);
  }
  
  const cacheKey = getCacheKey('surah', `${surahNumber}_${reciterId}`);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;
  
  // Requêtes parallèles pour la rapidité
  const [arabicRes, frenchRes, audioRes] = await Promise.all([
    fetchWithRetry(`${BASE_URL}/surah/${surahNumber}`),
    fetchWithRetry(`${BASE_URL}/surah/${surahNumber}/fr.hamidullah`),
    fetchWithRetry(`${BASE_URL}/surah/${surahNumber}/${reciterId}`),
  ]);

  if (!arabicRes.ok || !frenchRes.ok) {
    throw new Error('Failed to fetch surah data');
  }

  const arabicData = await arabicRes.json();
  const frenchData = await frenchRes.json();
  const audioData = audioRes.ok ? await audioRes.json() : null;

  const arabicAyahs: ApiVerse[] = arabicData.data.ayahs;
  const frenchAyahs: any[] = frenchData.data.ayahs ?? [];
  const audioAyahs: ApiVerse[] = audioData?.data?.ayahs ?? [];

  const result = arabicAyahs.map((ayah, i) => ({
    number: ayah.number,
    numberInSurah: ayah.numberInSurah,
    text: ayah.text,
    translation: frenchAyahs[i]?.text ?? '',
    audio: audioAyahs[i]?.audio ?? undefined,
  }));
  
  setCache(cacheKey, result);
  return result;
}

export async function fetchPageWithTranslation(pageNumber: number) {
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > 604) {
    throw new Error(`Invalid page number: ${pageNumber}`);
  }
  
  const cacheKey = getCacheKey('page', String(pageNumber));
  const cached = getFromCache(cacheKey);
  if (cached) return cached;
  
  // Requêtes parallèles pour la rapidité
  const [arabicRes, frenchRes] = await Promise.all([
    fetchWithRetry(`${BASE_URL}/page/${pageNumber}/ar.uthmani`),
    fetchWithRetry(`${BASE_URL}/page/${pageNumber}/fr.hamidullah`),
  ]);

  if (!arabicRes.ok || !frenchRes.ok) {
    throw new Error('Failed to fetch mushaf page');
  }

  const arabicData = await arabicRes.json();
  const frenchData = await frenchRes.json();

  const arabicAyahs: any[] = arabicData.data.ayahs ?? [];
  const frenchAyahs: any[] = frenchData.data.ayahs ?? [];

  const ayahs: ApiPageVerse[] = arabicAyahs.map((ayah, i) => ({
    number: ayah.number,
    numberInSurah: ayah.numberInSurah,
    surahNumber: ayah.surah?.number ?? 0,
    text: ayah.text,
    translation: frenchAyahs[i]?.text ?? '',
    juz: ayah.juz ?? 0,
    hizbQuarter: ayah.hizbQuarter ?? 0,
  }));

  const result = {
    ayahs,
    juz: ayahs[0]?.juz ?? 0,
    hizbQuarter: ayahs[0]?.hizbQuarter ?? 0,
  };
  
  setCache(cacheKey, result);
  return result;
}

export async function fetchSurahForMushafPage(pageNumber: number): Promise<number> {
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > 604) {
    throw new Error(`Invalid page number: ${pageNumber}`);
  }
  
  const res = await fetch(`${BASE_URL}/page/${pageNumber}/ar.uthmani`);
  if (!res.ok) {
    throw new Error('Failed to fetch page surah');
  }
  const data = await res.json();
  const firstAyah = data?.data?.ayahs?.[0];
  return firstAyah?.surah?.number ?? 1;
}

export async function fetchFirstPageForSurah(surahNumber: number): Promise<number> {
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Invalid surah number: ${surahNumber}`);
  }
  
  const res = await fetch(`${BASE_URL}/surah/${surahNumber}/ar.uthmani`);
  if (!res.ok) {
    throw new Error('Failed to fetch surah first page');
  }
  const data = await res.json();
  const firstAyah = data?.data?.ayahs?.[0];
  return firstAyah?.page ?? 1;
}

/**
 * URL audio par verset : le CDN islamic.network utilise le numéro global d’ayah (alquran.cloud),
 * pas surah×1000 + verset dans la sourate.
 */
export function buildVerseAudioUrl(globalAyahNumber: number, reciterId: string): string {
  const path = VERSE_AUDIO_PATH[reciterId] ?? VERSE_AUDIO_PATH['ar.alafasy'];
  return `${path}${globalAyahNumber}.mp3`;
}

const VERSE_AUDIO_PATH: Record<string, string> = {
  'ar.alafasy': 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/',
  'ar.husary': 'https://cdn.islamic.network/quran/audio/128/ar.husary/',
  'ar.abdulsamad': 'https://cdn.islamic.network/quran/audio/64/ar.abdulsamad/',
};
