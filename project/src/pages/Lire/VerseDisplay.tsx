import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { Bookmark as BookmarkType } from '../../types';
import {
  stripPrependedBismillahFromVerseOne,
} from '../../lib/bismillah';
import SurahIntro from './SurahIntro';

interface Verse {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
}

interface VerseDisplayProps {
  surahNumber: number;
  verses: Verse[];
  loading: boolean;
  error: string | null;
  bookmarks: BookmarkType[];
  onToggleBookmark: (verse: Verse) => void;
}

export default function VerseDisplay({
  surahNumber,
  verses,
  loading,
  error,
  bookmarks,
  onToggleBookmark,
}: VerseDisplayProps) {
  const isBookmarked = (verseNum: number) =>
    bookmarks.some((b) => b.surahNumber === surahNumber && b.verseNumber === verseNum);

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

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <SurahIntro surahNumber={surahNumber} />

      <div className="divide-y divide-beige-100 dark:divide-gray-800">
        {verses.map((verse) => {
          const displayArabic = stripPrependedBismillahFromVerseOne(
            surahNumber,
            verse.numberInSurah,
            verse.text
          );
          return (
            <div
              key={verse.number}
              className="p-5 hover:bg-beige-50 dark:hover:bg-gray-900/30 transition-colors group animate-fade-in"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="text-[11px] sm:text-xs font-mono text-gray-500 dark:text-gray-400 tabular-nums pt-0.5">
                  {surahNumber}:{verse.numberInSurah}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleBookmark({ ...verse, text: displayArabic })}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isBookmarked(verse.numberInSurah)
                      ? 'text-gold-500'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gold-400'
                  }`}
                  title={isBookmarked(verse.numberInSurah) ? 'Retirer le signet' : 'Ajouter un signet'}
                >
                  {isBookmarked(verse.numberInSurah) ? (
                    <BookmarkCheck className="w-5 h-5" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
              </div>

              <p
                className="font-arabic text-2xl text-right text-gray-800 dark:text-gray-100 leading-loose mb-4"
                style={{ direction: 'rtl' }}
              >
                {displayArabic}
              </p>

              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-l-2 border-gold-300 pl-3 italic">
                {verse.translation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
