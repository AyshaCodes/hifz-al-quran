import { SURAHS } from '../../data/surahs';
import {
  BISMILLAH_STANDALONE_ARABIC,
  shouldShowStandaloneBismillah,
} from '../../lib/bismillah';

export default function SurahIntro({ surahNumber }: { surahNumber: number }) {
  const surah = SURAHS.find((s) => s.number === surahNumber);
  if (!surah) return null;

  return (
    <div className="bg-white/90 dark:bg-gray-900/90 border-b border-beige-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto text-center py-9 px-4">
        <p className="font-arabic text-3xl sm:text-4xl text-primary-700 dark:text-primary-300 mb-2">
          {surah.nameArabic}
        </p>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200">{surah.nameFrench}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{surah.nameTranslit}</p>

        <div className="flex justify-center gap-2 sm:gap-3 mt-4 flex-wrap">
          <span className="text-xs bg-beige-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
            {surah.verses} versets
          </span>
          <span className="text-xs bg-beige-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full capitalize">
            {surah.revelationType}
          </span>
          <span className="text-xs bg-beige-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
            Juz {surah.juz}
          </span>
        </div>
      </div>

      {shouldShowStandaloneBismillah(surahNumber) && (
        <div className="text-center py-7 px-6 bg-beige-50/80 dark:bg-gray-900/40 border-t border-beige-200/70 dark:border-gray-800">
          <p className="font-arabic text-2xl sm:text-3xl text-gray-700 dark:text-gray-200 leading-[2] tracking-wide">
            {BISMILLAH_STANDALONE_ARABIC}
          </p>
          <p className="mt-2 text-xs italic text-gray-500 dark:text-gray-400">
            Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.
          </p>
        </div>
      )}
    </div>
  );
}
