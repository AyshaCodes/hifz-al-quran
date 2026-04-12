/**
 * Prepended Bismillah on verse 1 from api.alquran.cloud default Uthmani text,
 * including the trailing space before the rest of the ayah.
 */
const API_PREPENDED_BISMILLAH_PREFIX =
  '\u0628\u0650\u0633\u06e1\u0645\u0650 \u0671\u0644\u0644\u0651\u064e\u0647\u0650 \u0671\u0644\u0631\u0651\u064e\u062d\u06e1\u0645\u064e\u0640\u0670\u0646\u0650 \u0671\u0644\u0631\u0651\u064e\u062d\u0650\u06cc\u0645\u0650 ';

/** Shown above the ayahs; matches the segment removed from API verse 1. */
export const BISMILLAH_STANDALONE_ARABIC = API_PREPENDED_BISMILLAH_PREFIX.trimEnd();

export function shouldShowStandaloneBismillah(surahNumber: number): boolean {
  return surahNumber >= 2 && surahNumber <= 114 && surahNumber !== 9;
}

export function stripPrependedBismillahFromVerseOne(
  surahNumber: number,
  verseNumberInSurah: number,
  text: string
): string {
  if (verseNumberInSurah !== 1 || !shouldShowStandaloneBismillah(surahNumber)) {
    return text;
  }
  const trimmed = text.trimStart();
  if (trimmed.startsWith(API_PREPENDED_BISMILLAH_PREFIX)) {
    return trimmed.slice(API_PREPENDED_BISMILLAH_PREFIX.length).trimStart();
  }
  const withoutSpace = API_PREPENDED_BISMILLAH_PREFIX.trimEnd();
  if (trimmed.startsWith(withoutSpace)) {
    return trimmed.slice(withoutSpace.length).trimStart();
  }
  return text;
}
