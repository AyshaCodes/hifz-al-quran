import { Loader2, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { stripPrependedBismillahFromVerseOne } from '../../lib/bismillah';
import { ApiPageVerse } from '../../lib/quranApi';
import CompactSurahAudio, { CompactSurahAudioVerse } from './CompactSurahAudio';

interface MushafPageData {
  pageNumber: number;
  verses: ApiPageVerse[];
  juz: number;
  hizbQuarter: number;
}

interface VerseDisplayProps {
  surahNumber: number | null;
  pages: MushafPageData[];
  loading: boolean;
  error: string | null;
  textMode: 'arabic' | 'both';
  onTextModeChange: (mode: 'arabic' | 'both') => void;
  audioVerses: CompactSurahAudioVerse[];
  reciterId: string;
  onReciterChange: (id: string) => void;
  onLoadNextPage: () => void;
  canLoadMore: boolean;
  loadingMore: boolean;
}

export default function VerseDisplay({
  surahNumber,
  pages,
  loading,
  error,
  textMode,
  onTextModeChange,
  audioVerses,
  reciterId,
  onReciterChange,
  onLoadNextPage,
  canLoadMore,
  loadingMore,
}: VerseDisplayProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver pour charger la page suivante quand le sentinel est visible
  useEffect(() => {
    if (!canLoadMore || loadingMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadNextPage();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [canLoadMore, loadingMore, onLoadNextPage]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 min-h-0 bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center animate-spin shadow-lg shadow-primary-500/10">
            <Loader2 className="w-8 h-8 text-primary-500" />
          </div>
          <p className="text-gray-500 font-medium animate-pulse">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 min-h-0 bg-[#0a0a0a]">
        <div className="bg-[#1a1a1a] p-10 text-center max-w-md mx-4 rounded-2xl border border-white/5">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-xl font-bold text-white mb-2">Oups !</p>
          <p className="text-gray-400 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  const groupPageVersesBySurah = (pageVerses: ApiPageVerse[]) => {
    const groups: { surahNumber: number; verses: ApiPageVerse[] }[] = [];
    for (const verse of pageVerses) {
      const last = groups[groups.length - 1];
      if (!last || last.surahNumber !== verse.surahNumber) {
        groups.push({ surahNumber: verse.surahNumber, verses: [verse] });
      } else {
        last.verses.push(verse);
      }
    }
    return groups;
  };

  const textModeToggle = (
    <div
      className="inline-flex items-center p-1 bg-stone-100 dark:bg-gray-800 rounded-xl"
      role="group"
      aria-label="Affichage du texte"
    >
      <button
        type="button"
        onClick={() => onTextModeChange('arabic')}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          textMode === 'arabic'
            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
        }`}
      >
        AR
      </button>
      <button
        type="button"
        onClick={() => onTextModeChange('both')}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          textMode === 'both'
            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
        }`}
      >
        AR + FR
      </button>
    </div>
  );

  const showTranslation = textMode === 'both';
  const toArabicIndicDigits = (value: number) =>
    value
      .toString()
      .split('')
      .map((digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)] ?? digit)
      .join('');
  const formatAyahMarker = (ayahNumber: number) => `﴿${toArabicIndicDigits(ayahNumber)}﴾`;

  return (
    <div className="flex-1 min-h-0 bg-stone-50 dark:bg-gray-950 transition-colors duration-500">
      <div className="sticky top-0 z-20">
        <CompactSurahAudio
          surahNumber={surahNumber ?? 0}
          verses={audioVerses}
          reciterId={reciterId}
          onReciterChange={onReciterChange}
          leadingControls={textModeToggle}
          toolbarClassName="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-stone-200 dark:border-white/5"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {pages.map((page) => {
            const pageSurahGroups = groupPageVersesBySurah(page.verses);
            return (
              <motion.div
                key={page.pageNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="mb-8 sm:mb-16"
              >
                <div className="bg-white dark:bg-gray-900/50 p-5 sm:p-16 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm dark:shadow-2xl border border-stone-200 dark:border-white/5 relative overflow-hidden transition-colors duration-500">
                  <div className="flex items-center justify-between mb-6 sm:mb-12 border-b border-stone-100 dark:border-white/5 pb-4 sm:pb-8">
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-stone-400 dark:text-gray-600">
                      Juz {page.juz} • Hizb {Math.ceil(page.hizbQuarter / 4)}
                    </span>
                    <span className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary-50 dark:bg-primary-500/5 text-[8px] sm:text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest border border-primary-100 dark:border-primary-500/10">
                      Page {page.pageNumber}
                    </span>
                  </div>
                  
                  <div className="space-y-8 sm:space-y-16">
                    {pageSurahGroups.map((group) => {
                      return (
                        <div key={`${page.pageNumber}-${group.surahNumber}-${group.verses[0]?.number ?? 0}`}>
                          <div className="flex items-center gap-3 sm:gap-6 mb-6 sm:mb-12">
                            <div className="h-px flex-1 bg-stone-100 dark:bg-white/5" />
                            <p className="text-[8px] sm:text-[10px] font-bold text-stone-400 dark:text-gray-700 uppercase tracking-[0.15em] sm:tracking-[0.25em] bg-white dark:bg-gray-900 px-2 sm:px-4">
                              Sourate {group.surahNumber}
                            </p>
                            <div className="h-px flex-1 bg-stone-100 dark:bg-white/5" />
                          </div>

                          {!showTranslation ? (
                            <p
                              className="text-xl sm:text-2xl lg:text-3xl leading-[3] sm:leading-[4.5] text-stone-800 dark:text-gray-100 font-amiri font-normal"
                              style={{ direction: 'rtl', textAlign: 'center', wordSpacing: '0.2em' }}
                            >
                              {group.verses.map((verse) => {
                                const cleanText = stripPrependedBismillahFromVerseOne(
                                  verse.surahNumber,
                                  verse.numberInSurah,
                                  verse.text
                                );
                                return (
                                 <span 
                                   key={verse.number} 
                                   id={`ayah-${verse.numberInSurah}`}
                                   className="hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 cursor-default inline scroll-mt-32 rounded transition-all"
                                 >
                                   {cleanText}{' '}
                                   <span className="text-base sm:text-lg text-gold-600/40 dark:text-gold-500/30 align-middle mx-1.5 sm:mx-2 font-amiri select-none">
                                     {formatAyahMarker(verse.numberInSurah)}
                                   </span>{' '}
                                 </span>
                               );
                               })}
                            </p>
                          ) : (
                            <div className="space-y-16 sm:space-y-24">
                              {group.verses.map((verse) => {
                                const cleanText = stripPrependedBismillahFromVerseOne(
                                  verse.surahNumber,
                                  verse.numberInSurah,
                                  verse.text
                                );
                                return (
                                  <div 
                                    key={verse.number} 
                                    id={`ayah-${verse.numberInSurah}`}
                                    className="group text-center scroll-mt-32 p-2 sm:p-4 rounded-xl transition-all"
                                  >
                                    <p
                                      className="text-xl sm:text-3xl lg:text-4xl leading-[3.5] sm:leading-[6] text-stone-800 dark:text-gray-100 font-amiri font-normal mb-6 sm:mb-12 transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400"
                                      style={{ direction: 'rtl', wordSpacing: '0.4em' }}
                                    >
                                      {cleanText}
                                      <span className="text-lg sm:text-xl text-gold-600/40 dark:text-gold-500/30 align-middle mx-4 sm:mx-6 font-amiri select-none">
                                        {formatAyahMarker(verse.numberInSurah)}
                                      </span>
                                    </p>
                                    <p className="font-amiri text-xs sm:text-lg lg:text-xl text-stone-500 dark:text-gray-400 italic leading-[1.6] sm:leading-[2] tracking-wide max-w-3xl mx-auto opacity-70 group-hover:opacity-100 transition-opacity px-2">
                                      {verse.translation}
                                    </p>
                                    {verse !== group.verses[group.verses.length - 1] && (
                                      <div className="w-24 sm:w-48 h-px bg-stone-100 dark:bg-white/5 mt-8 sm:mt-20 mx-auto" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {canLoadMore && (
          <div ref={sentinelRef} className="py-12 flex justify-center">
            {loadingMore && (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Chargement de la suite...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
