import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { Bookmark as BookmarkType } from '../../types';
import { SURAHS } from '../../data/surahs';

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
  const surah = SURAHS.find((s) => s.number === surahNumber);
  const isBookmarked = (verseNum: number) =>
    bookmarks.some((b) => b.surahNumber === surahNumber && b.verseNumber === verseNum);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
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
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="card p-8 text-center max-w-sm">
          <p className="text-red-500 mb-2 font-medium">Erreur de chargement</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {surah && (
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
            <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
              Juz {surah.juz}
            </span>
          </div>
        </div>
      )}

      {surahNumber !== 1 && surahNumber !== 9 && (
        <div className="text-center py-4 font-arabic text-xl text-gray-600 dark:text-gray-300 border-b border-beige-200 dark:border-gray-800 bg-beige-50 dark:bg-gray-900/50">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
      )}

      <div className="divide-y divide-beige-100 dark:divide-gray-800">
        {verses.map((verse) => (
          <div key={verse.number} className="p-5 hover:bg-beige-50 dark:hover:bg-gray-900/30 transition-colors group animate-fade-in">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-bold flex-shrink-0">
                  {verse.numberInSurah}
                </span>
              </div>
              <button
                onClick={() => onToggleBookmark(verse)}
                className={`p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                  isBookmarked(verse.numberInSurah)
                    ? 'text-gold-500 opacity-100'
                    : 'text-gray-300 dark:text-gray-600 hover:text-gold-400'
                }`}
                title={isBookmarked(verse.numberInSurah) ? 'Retirer le signet' : 'Ajouter un signet'}
              >
                {isBookmarked(verse.numberInSurah) ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>

            <p
              className="font-arabic text-2xl text-right text-gray-800 dark:text-gray-100 leading-loose mb-4"
              style={{ direction: 'rtl' }}
            >
              {verse.text}
            </p>

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-l-2 border-gold-300 pl-3 italic">
              {verse.translation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
