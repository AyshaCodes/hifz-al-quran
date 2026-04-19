import { SURAHS } from '../../data/surahs';
import {
  BISMILLAH_STANDALONE_ARABIC,
  shouldShowStandaloneBismillah,
} from '../../lib/bismillah';

export default function SurahIntro({ surahNumber }: { surahNumber: number }) {
  const surah = SURAHS.find((s) => s.number === surahNumber);
  if (!surah) return null;

  return (
    <div className="bg-[#121212] border-b border-white/5">
      <div className="max-w-5xl mx-auto text-center py-16 px-4">
        <p className="font-amiri text-4xl sm:text-5xl text-quran-400 mb-4 transition-all duration-700">
          {surah.nameArabic}
        </p>
        <p className="text-base sm:text-lg text-gray-200 font-medium mb-1">{surah.nameFrench}</p>
        <p className="text-[11px] text-gray-600 font-bold uppercase tracking-[0.3em]">{surah.nameTranslit}</p>

        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 text-gray-500 px-4 py-1.5 rounded-full border border-white/5">
            {surah.verses} versets
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 text-gray-500 px-4 py-1.5 rounded-full border border-white/5 capitalize">
            {surah.revelationType}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 text-gray-500 px-4 py-1.5 rounded-full border border-white/5">
            Juz {surah.juz}
          </span>
        </div>
      </div>

      {shouldShowStandaloneBismillah(surahNumber) && (
        <div className="text-center py-10 px-6 bg-black/20 border-t border-white/5">
          <p className="font-arabic text-2xl sm:text-3xl text-gray-200 leading-[2] tracking-wide mb-3">
            {BISMILLAH_STANDALONE_ARABIC}
          </p>
          <p className="text-[11px] italic text-gray-500 max-w-md mx-auto leading-relaxed">
            Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.
          </p>
        </div>
      )}
    </div>
  );
}
