const API_PREPENDED_BISMILLAH_PREFIXES = [
  '\u0628\u0650\u0633\u06e1\u0645\u0650 \u0671\u0644\u0644\u0651\u064e\u0647\u0650 \u0671\u0644\u0631\u0651\u064e\u062d\u06e1\u0645\u064e\u0640\u0670\u0646\u0650 \u0671\u0644\u0631\u0651\u064e\u062d\u0650\u06cc\u0645\u0650 ',
  'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ',
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ',
] as const;

/** Shown above the ayahs; matches the segment removed from API verse 1. */
export const BISMILLAH_STANDALONE_ARABIC = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

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
  for (const prefix of API_PREPENDED_BISMILLAH_PREFIXES) {
    if (trimmed.startsWith(prefix)) {
      const stripped = trimmed.slice(prefix.length).trimStart();
      // Safety: never hide a full verse if API text shape differs.
      return stripped.length > 1 ? stripped : text;
    }
    const withoutSpace = prefix.trimEnd();
    if (trimmed.startsWith(withoutSpace)) {
      const stripped = trimmed.slice(withoutSpace.length).trimStart();
      // Safety: never hide a full verse if API text shape differs.
      return stripped.length > 1 ? stripped : text;
    }
  }
  return text;
}
