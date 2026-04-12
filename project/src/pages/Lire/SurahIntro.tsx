import { SURAHS } from '../../data/surahs';
import {
  BISMILLAH_STANDALONE_ARABIC,
  shouldShowStandaloneBismillah,
} from '../../lib/bismillah';

export default function SurahIntro({ surahNumber }: { surahNumber: number }) {
  const surah = SURAHS.find((s) => s.number === surahNumber);
  if (!surah) return null;

  return (
    <>
      <div className="green-gradient text-white text-center py-8 px-4 mb-2">
        <p className="font-arabic text-4xl mb-2">{surah.nameArabic}</p>
        <p className="font-amiri text-xl text-gold-300 mb-1">{surah.nameTranslit}</p>
        <p className="text-primary-200 text-sm">{surah.nameFrench}</p>
        <div className="flex justify-center gap-4 mt-3">
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
            {surah.verses} versets
          </span>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full capitalize">
            {surah.revelationType}
          </span>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full">Juz {surah.juz}</span>
        </div>
      </div>

      {shouldShowStandaloneBismillah(surahNumber) && (
        <div className="text-center pt-10 pb-12 px-6 mb-2 font-arabic text-3xl sm:text-4xl text-gray-700 dark:text-gray-200 leading-[2] tracking-wide bg-beige-50/80 dark:bg-gray-900/40">
          {BISMILLAH_STANDALONE_ARABIC}
        </div>
      )}
    </>
  );
}
