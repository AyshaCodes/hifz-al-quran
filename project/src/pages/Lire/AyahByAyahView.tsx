import { Bookmark, BookmarkCheck, Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bookmark as BookmarkType } from '../../types';
import { buildVerseAudioUrl } from '../../lib/quranApi';
import { stripPrependedBismillahFromVerseOne } from '../../lib/bismillah';
import SurahIntro from './SurahIntro';

interface Verse {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
}

interface AyahByAyahViewProps {
  surahNumber: number;
  verses: Verse[];
  bookmarks: BookmarkType[];
  reciterId: string;
  onReciterChange: (id: string) => void;
  onToggleBookmark: (verse: Verse) => void;
}

export default function AyahByAyahView({
  surahNumber,
  verses,
  bookmarks,
  reciterId,
  onReciterChange: _onReciterChange,
  onToggleBookmark,
}: AyahByAyahViewProps) {
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setCurrentPlayingVerse(null);
    setIsPlaying(false);
  }, [surahNumber]);

  const isBookmarked = useCallback(
    (n: number) => bookmarks.some((b) => b.surahNumber === surahNumber && b.verseNumber === n),
    [bookmarks, surahNumber]
  );

  const handlePlayVerse = (verse: Verse) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentPlayingVerse === verse.numberInSurah && isPlaying) {
      audio.pause();
      return;
    }

    audio.src = buildVerseAudioUrl(verse.number, reciterId);
    setCurrentPlayingVerse(verse.numberInSurah);
    audio.play().catch(() => setIsPlaying(false));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#faf8f1] dark:bg-gray-950/50">
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentPlayingVerse(null);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex-1 overflow-y-auto min-h-0">
        <SurahIntro surahNumber={surahNumber} />

        <div className="max-w-5xl mx-auto px-4 py-6 bg-white/80 dark:bg-gray-900/80">
          {verses.map((verse) => {
            const displayArabic = stripPrependedBismillahFromVerseOne(
              surahNumber,
              verse.numberInSurah,
              verse.text
            );
            const verseRef = `${surahNumber}:${verse.numberInSurah}`;
            const isCurrent = currentPlayingVerse === verse.numberInSurah;

            return (
              <article key={verse.number} className="py-10 sm:py-12 border-b border-beige-200/80 dark:border-gray-800/80 last:border-b-0">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500 tabular-nums">
                    {verseRef}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePlayVerse(verse)}
                      className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-beige-100 dark:hover:bg-gray-800 transition-colors"
                      title="Lire le verset"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleBookmark({ ...verse, text: displayArabic })}
                      className={`p-1.5 rounded-md transition-colors ${
                        isBookmarked(verse.numberInSurah)
                          ? 'text-gold-500'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gold-400 hover:bg-beige-100 dark:hover:bg-gray-800'
                      }`}
                      title={isBookmarked(verse.numberInSurah) ? 'Retirer le signet' : 'Ajouter un signet'}
                    >
                      {isBookmarked(verse.numberInSurah) ? (
                        <BookmarkCheck className="w-3.5 h-3.5" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <p
                  className="font-arabic text-3xl sm:text-[2.2rem] text-center text-gray-900 dark:text-gray-50 leading-[2.1] mb-4"
                  style={{ direction: 'rtl' }}
                >
                  {displayArabic}
                </p>

                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed italic text-center">
                  {verse.translation}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
