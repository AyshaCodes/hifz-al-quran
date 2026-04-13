const BASE_URL = 'https://api.alquran.cloud/v1';

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

export async function fetchSurahWithTranslation(surahNumber: number, reciterId = 'ar.alafasy') {
  const [arabicRes, frenchRes, audioRes] = await Promise.all([
    fetch(`${BASE_URL}/surah/${surahNumber}`),
    fetch(`${BASE_URL}/surah/${surahNumber}/fr.hamidullah`),
    fetch(`${BASE_URL}/surah/${surahNumber}/${reciterId}`),
  ]);

  if (!arabicRes.ok || !frenchRes.ok) {
    throw new Error('Failed to fetch surah data');
  }

  const arabicData = await arabicRes.json();
  const frenchData = await frenchRes.json();
  const audioData = audioRes.ok ? await audioRes.json() : null;

  const arabicAyahs: ApiVerse[] = arabicData.data.ayahs;
  const frenchAyahs: ApiVerse[] = frenchData.data.ayahs;
  const audioAyahs: ApiVerse[] = audioData?.data?.ayahs ?? [];

  return arabicAyahs.map((ayah, i) => ({
    number: ayah.number,
    numberInSurah: ayah.numberInSurah,
    text: ayah.text,
    translation: frenchAyahs[i]?.text ?? '',
    audio: audioAyahs[i]?.audio ?? undefined,
  }));
}

export async function fetchPageWithTranslation(pageNumber: number) {
  const [arabicRes, frenchRes] = await Promise.all([
    fetch(`${BASE_URL}/page/${pageNumber}/ar.uthmani`),
    fetch(`${BASE_URL}/page/${pageNumber}/fr.hamidullah`),
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

  return {
    ayahs,
    juz: ayahs[0]?.juz ?? 0,
    hizbQuarter: ayahs[0]?.hizbQuarter ?? 0,
  };
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
  'ar.saadghamdi': 'https://cdn.islamic.network/quran/audio/128/ar.saadghamdi/',
  'ar.abdulsamad': 'https://cdn.islamic.network/quran/audio/64/ar.abdulsamad/',
};
