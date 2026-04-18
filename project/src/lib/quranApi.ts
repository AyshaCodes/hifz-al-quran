// Utilisation de l'API directe par défaut pour éviter les problèmes de proxy
const DIRECT_API = 'https://api.alquran.cloud/v1';

// Retry optimisé pour gérer les erreurs 429 et CORS
async function fetchWithRetry(path: string, maxRetries = 3): Promise<Response> {
  // On essaie d'abord l'API directe car elle est plus fiable que le proxy local
  const url = `${DIRECT_API}${path}`;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (response.status === 429) {
        const waitTime = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      if (response.ok) return response;
      
      // Fallback vers le proxy /api/quran si on est sur Vercel et que le direct échoue
      if (attempt === maxRetries && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
        const proxyRes = await fetch(`/api/quran${path}`);
        if (proxyRes.ok) return proxyRes;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Fetch failed');
}

export async function fetchSurahFromNewAPI(surahNumber: number): Promise<ApiVerse[]> {
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Invalid surah number: ${surahNumber}`);
  }

  const cacheKey = getCacheKey('surah-new', String(surahNumber));
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const [arabicRes, frenchRes] = await Promise.all([
      fetchWithRetry(`/surah/${surahNumber}/ar.uthmani`),
      fetchWithRetry(`/surah/${surahNumber}/fr.hamidullah`),
    ]);

    const arabicData = await arabicRes.json();
    const frenchData = await frenchRes.json();

    const arabicAyahs: any[] = arabicData.data.ayahs ?? [];
    const frenchAyahs: any[] = frenchData.data.ayahs ?? [];

    const result: ApiVerse[] = arabicAyahs.map((ayah: any, i: number) => ({
      number: ayah.number,
      numberInSurah: ayah.numberInSurah,
      text: ayah.text,
      translation: frenchAyahs[i]?.text ?? '',
      surahNumber,
      juz: ayah.juz ?? 0,
      hizbQuarter: ayah.hizbQuarter ?? 0,
      page: ayah.page ?? 0,
    }));

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error loading surah data:', error);
    throw error; // On laisse le composant gérer l'erreur
  }
}

export async function fetchSurahWithTranslation(surahNumber: number, reciterId = 'ar.alafasy') {
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Invalid surah number: ${surahNumber}`);
  }
  
  const cacheKey = getCacheKey('surah', `${surahNumber}_${reciterId}`);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;
  
  const [arabicRes, frenchRes, audioRes] = await Promise.all([
    fetchWithRetry(`/surah/${surahNumber}`),
    fetchWithRetry(`/surah/${surahNumber}/fr.hamidullah`),
    fetchWithRetry(`/surah/${surahNumber}/${reciterId}`),
  ]);

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
  
  const [arabicRes, frenchRes] = await Promise.all([
    fetchWithRetry(`/page/${pageNumber}/ar.uthmani`),
    fetchWithRetry(`/page/${pageNumber}/fr.hamidullah`),
  ]);

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
  const res = await fetchWithRetry(`/page/${pageNumber}/ar.uthmani`);
  const data = await res.json();
  return data?.data?.ayahs?.[0]?.surah?.number ?? 1;
}

export async function fetchFirstPageForSurah(surahNumber: number): Promise<number> {
  const res = await fetchWithRetry(`/surah/${surahNumber}/ar.uthmani`);
  const data = await res.json();
  return data?.data?.ayahs?.[0]?.page ?? 1;
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
