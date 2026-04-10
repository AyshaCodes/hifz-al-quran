const BASE_URL = 'https://api.alquran.cloud/v1';

export interface ApiVerse {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
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

export function buildAudioUrl(surahNumber: number, verseNumber: number, reciterId = 'ar.alafasy') {
  const paddedSurah = String(surahNumber).padStart(3, '0');
  const paddedVerse = String(verseNumber).padStart(3, '0');
  const reciterMap: Record<string, string> = {
    'ar.alafasy': 'https://cdn.islamic.network/quran/audio/128/ar.alafasy',
    'ar.abdullahbasfar': 'https://cdn.islamic.network/quran/audio/128/ar.abdullahbasfar',
    'ar.abdurrahmaansudais': 'https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais',
    'ar.minshawi': 'https://cdn.islamic.network/quran/audio/128/ar.minshawi',
    'ar.husary': 'https://cdn.islamic.network/quran/audio/128/ar.husary',
  };
  const base = reciterMap[reciterId] ?? reciterMap['ar.alafasy'];
  const verseKey = parseInt(paddedSurah) * 1000 + parseInt(paddedVerse);
  return `${base}/${verseKey}.mp3`;
}
