// Proxy CORS temporaire pour le développement
const PROXY = 'https://api.allorigins.win/raw?url=';
const BASE_URL = '/api/v1';

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


// Retry optimisé pour gérer les erreurs 429 et CORS
async function fetchWithRetry(url: string, maxRetries = 2): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      // Si c'est une erreur 429, on attend moins longtemps
      if (response.status === 429) {
        if (attempt === maxRetries) throw new Error('Rate limit exceeded after retries');
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      if (response.ok) return response;
      
      // Pour les erreurs CORS, on essaie direct
      if (response.status === 0 || response.type === 'opaque') {
        console.warn('CORS detected, trying direct API...');
        const directUrl = url.replace(PROXY, '');
        const directResponse = await fetch(directUrl);
        if (directResponse.ok) return directResponse;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Max retries exceeded');
}

export interface ApiVerse {
  number: number;
  numberInSurah: number;
  text: string;
  translation?: string;
  audio?: string;
  surahNumber?: number;
  juz?: number;
  hizbQuarter?: number;
  page?: number;
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

export async function fetchSurahFromNewAPI(surahNumber: number): Promise<ApiVerse[]> {
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Invalid surah number: ${surahNumber}`);
  }
  
  try {
    // Utiliser les fichiers JSON statiques hébergés sur jsdelivr (pas de CORS)
    const [arResponse, frResponse] = await Promise.all([
      fetch('https://cdn.jsdelivr.net/npm/quran-json@3.0.0/dist/data/quran_ar.json'),
      fetch('https://cdn.jsdelivr.net/npm/quran-json@3.0.0/dist/data/quran_fr.json')
    ]);
    
    const arabicData = await arResponse.json();
    const frenchData = await frResponse.json();
    
    const surahAr = arabicData.surahs.find((s: any) => s.index === surahNumber);
    const surahFr = frenchData.surahs.find((s: any) => s.index === surahNumber);
    
    if (!surahAr || !surahFr) {
      throw new Error(`Surah ${surahNumber} not found`);
    }
    
    // Combiner les versets arabe et français
    return surahAr.verses.map((v: any, i: number) => ({
      number: v.index,
      numberInSurah: v.indexInSurah,
      text: v.text,
      translation: surahFr?.verses[i]?.text || '',
      surahNumber,
      juz: Math.ceil((v.index + 1) / 20),
      hizbQuarter: Math.ceil((v.index + 1) / 5),
      page: Math.floor((v.index + 1) / 6) + 1,
    }));
  } catch (error) {
    console.error('Error loading quran data:', error);
    // Fallback simple si jsdelivr échoue
    return [
      {
        number: 1,
        numberInSurah: 1,
        text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        translation: 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux',
        surahNumber,
        juz: 1,
        hizbQuarter: 1,
        page: 1,
      }
    ];
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
