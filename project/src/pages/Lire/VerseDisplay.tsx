import { Loader2, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { stripPrependedBismillahFromVerseOne } from '../../lib/bismillah';
import { ApiPageVerse } from '../../lib/quranApi';
import CompactSurahAudio, { CompactSurahAudioVerse } from './CompactSurahAudio';
import SurahIntro from './SurahIntro';

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
      <div className="flex-1 flex items-center justify-center py-20 min-h-0 bg-stone-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl green-gradient flex items-center justify-center animate-spin shadow-lg shadow-primary-600/20">
            <Loader2 className="w-8 h-8 text-white" />
          </div>
          <p className="text-stone-500 dark:text-stone-400 font-medium animate-pulse">Chargement de la sourate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 min-h-0 bg-stone-50 dark:bg-gray-950">
        <div className="premium-card p-10 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-xl font-bold text-gray-800 dark:text-white mb-2">Oups ! Une erreur est survenue</p>
          <p className="text-stone-500 dark:text-stone-400 leading-relaxed">{error}</p>
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
    <div className="flex-1 min-h-0 bg-stone-50 dark:bg-gray-950/50 custom-scrollbar overflow-y-auto">
      <CompactSurahAudio
        surahNumber={surahNumber ?? 0}
        verses={audioVerses}
        reciterId={reciterId}
        onReciterChange={onReciterChange}
        leadingControls={textModeToggle}
        toolbarClassName="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-stone-200/50 dark:border-white/5"
      />

      {surahNumber && <SurahIntro surahNumber={surahNumber} />}

      <div className="max-w-3xl mx-auto px-4 py-8">
        {pages.map((page, pageIndex) => {
          const pageSurahGroups = groupPageVersesBySurah(page.verses);
          return (
            <div key={page.pageNumber} className="mb-12">
              <div className="premium-card p-8 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 border-b border-stone-100 dark:border-white/5 pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Juz {page.juz} • Hizb {Math.ceil(page.hizbQuarter / 4)}
                  </span>
                  <span className="px-4 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                    Page {page.pageNumber}
                  </span>
                </div>
                
                <div className="space-y-10">
                  {pageSurahGroups.map((group) => {
                    return (
                      <div key={`${page.pageNumber}-${group.surahNumber}-${group.verses[0]?.number ?? 0}`}>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="h-px flex-1 bg-stone-100 dark:bg-white/5" />
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                            Sourate {group.surahNumber}
                          </p>
                          <div className="h-px flex-1 bg-stone-100 dark:bg-white/5" />
                        </div>

                        {!showTranslation ? (
                          <p
                            className="text-lg sm:text-xl leading-[3] text-gray-900 dark:text-gray-100 font-arabic font-normal"
                            style={{ direction: 'rtl', textAlign: 'justify' }}
                          >
                            {group.verses.map((verse) => {
                              const cleanText = stripPrependedBismillahFromVerseOne(
                                verse.surahNumber,
                                verse.numberInSurah,
                                verse.text
                              );
                              return (
                                <span key={verse.number} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-default">
                                  {cleanText}{' '}
                                  <span className="text-sm text-gold-600 dark:text-gold-400 align-middle mx-1 font-arabic opacity-70">
                                    {formatAyahMarker(verse.numberInSurah)}
                                  </span>{' '}
                                </span>
                              );
                            })}
                          </p>
                        ) : (
                          <div className="space-y-12">
                            {group.verses.map((verse) => {
                              const cleanText = stripPrependedBismillahFromVerseOne(
                                verse.surahNumber,
                                verse.numberInSurah,
                                verse.text
                              );
                              return (
                                <div key={verse.number} className="group">
                                  <p
                                    className="text-lg sm:text-xl leading-[2.5] text-gray-900 dark:text-gray-50 font-arabic font-normal mb-6"
                                    style={{ direction: 'rtl' }}
                                  >
                                    {cleanText}
                                    <span className="text-sm text-gold-600 dark:text-gold-400 align-middle mx-2 font-arabic opacity-70">
                                      {formatAyahMarker(verse.numberInSurah)}
                                    </span>
                                  </p>
                                  <p className="font-amiri text-xs sm:text-sm text-stone-500 dark:text-stone-400 italic leading-relaxed">
                                    {verse.translation}
                                  </p>
                                  {verse !== group.verses[group.verses.length - 1] && (
                                    <div className="w-12 h-px bg-stone-100 dark:bg-white/5 mt-8 mx-auto" />
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
            </div>
          );
        })}

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
