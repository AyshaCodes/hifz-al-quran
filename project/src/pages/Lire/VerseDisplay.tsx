import { Loader2 } from 'lucide-react';
import { stripPrependedBismillahFromVerseOne, shouldShowStandaloneBismillah, BISMILLAH_STANDALONE_ARABIC } from '../../lib/bismillah';
import { ApiPageVerse } from '../../lib/quranApi';
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
  showTranslation: boolean;
  onLoadNextPage: () => void;
  canLoadMore: boolean;
  loadingMore: boolean;
}

export default function VerseDisplay({
  surahNumber,
  pages,
  loading,
  error,
  showTranslation,
  onLoadNextPage,
  canLoadMore,
  loadingMore,
}: VerseDisplayProps) {
  const toArabicIndicDigits = (value: number) =>
    value
      .toString()
      .split('')
      .map((digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)] ?? digit)
      .join('');

  const formatAyahMarker = (ayahNumber: number) => `﴿${toArabicIndicDigits(ayahNumber)}﴾`;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!canLoadMore || loadingMore) return;
    const target = e.currentTarget;
    const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 280;
    if (nearBottom) {
      onLoadNextPage();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 min-h-0">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full green-gradient flex items-center justify-center animate-spin">
            <Loader2 className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Chargement de la sourate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 min-h-0">
        <div className="card p-8 text-center max-w-sm">
          <p className="text-red-500 mb-2 font-medium">Erreur de chargement</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
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

  return (
    <div className="flex-1 overflow-y-auto min-h-0 bg-[#f8f6e9] dark:bg-gray-950" onScroll={handleScroll}>
      {surahNumber && <SurahIntro surahNumber={surahNumber} />}

      <div className="max-w-[650px] mx-auto px-3 py-4 sm:py-5">
        {pages.map((page, pageIndex) => {
          const pageSurahGroups = groupPageVersesBySurah(page.verses);
          return (
            <div key={page.pageNumber} className="mb-6">
              <div className="rounded-lg border border-beige-200/70 dark:border-gray-800/80 bg-[#f8f6e9] dark:bg-gray-900/70 px-4 sm:px-5 py-4">
                <div className="flex items-center justify-end text-[10px] text-gray-500/80 dark:text-gray-400 mb-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-beige-200/60 dark:bg-gray-800/80">
                    Page {page.pageNumber}
                  </span>
                </div>
                <div className="space-y-4">
                  {pageSurahGroups.map((group) => {
                    const showBismillah =
                      shouldShowStandaloneBismillah(group.surahNumber) &&
                      group.verses.some((v) => v.numberInSurah === 1);
                    return (
                      <div key={`${page.pageNumber}-${group.surahNumber}-${group.verses[0]?.number ?? 0}`}>
                        <p className="text-[10px] text-gray-500/85 dark:text-gray-400 mb-1.5">
                          Sourate {group.surahNumber}
                        </p>
                        {showBismillah && (
                          <div className="text-center mb-4 pt-1">
                            <p
                              className="font-arabic text-[1.9rem] text-gray-700 dark:text-gray-200 leading-[2.1]"
                              style={{ direction: 'rtl', fontFamily: "'Scheherazade New', 'Amiri', serif" }}
                            >
                              {BISMILLAH_STANDALONE_ARABIC}
                            </p>
                          </div>
                        )}

                        {!showTranslation ? (
                          <p
                            className="text-[1.6rem] leading-[2] text-gray-900 dark:text-gray-100"
                            style={{ direction: 'rtl', textAlign: 'justify', fontFamily: "'Scheherazade New', 'Amiri', serif" }}
                          >
                            {group.verses.map((verse) => {
                              const cleanText = stripPrependedBismillahFromVerseOne(
                                verse.surahNumber,
                                verse.numberInSurah,
                                verse.text
                              );
                              return (
                                <span key={verse.number}>
                                  {cleanText}{' '}
                                  <span className="text-[0.95rem] text-gold-700 dark:text-gold-400 align-middle">
                                    {formatAyahMarker(verse.numberInSurah)}
                                  </span>{' '}
                                </span>
                              );
                            })}
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {group.verses.map((verse) => {
                              const cleanText = stripPrependedBismillahFromVerseOne(
                                verse.surahNumber,
                                verse.numberInSurah,
                                verse.text
                              );
                              return (
                                <div key={verse.number} className="pb-1.5 last:pb-0">
                                  <p
                                    className="text-[1.6rem] leading-[2] text-gray-900 dark:text-gray-100"
                                    style={{ direction: 'rtl', textAlign: 'justify', fontFamily: "'Scheherazade New', 'Amiri', serif" }}
                                  >
                                    {cleanText}{' '}
                                    <span className="text-[0.95rem] text-gold-700 dark:text-gold-400 align-middle">
                                      {formatAyahMarker(verse.numberInSurah)}
                                    </span>
                                  </p>
                                  <p className="text-[0.86rem] italic text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">
                                    {verse.translation}
                                  </p>
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

              {pageIndex < pages.length - 1 && (
                <div className="flex items-center justify-center my-4 gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-beige-200/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {page.pageNumber}
                  </span>
                  <div className="h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent w-full max-w-sm" />
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                    {pages[pageIndex + 1].pageNumber}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {loadingMore && (
          <div className="flex justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
          </div>
        )}
      </div>
    </div>
  );
}
