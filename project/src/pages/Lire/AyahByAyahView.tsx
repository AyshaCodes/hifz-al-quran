import { Bookmark, BookmarkCheck, Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bookmark as BookmarkType } from '../../types';
import { buildVerseAudioUrl } from '../../lib/quranApi';
import { stripPrependedBismillahFromVerseOne } from '../../lib/bismillah';
import CompactSurahAudio, { CompactSurahAudioHandle } from './CompactSurahAudio';

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
  onReciterChange,
  onToggleBookmark,
}: AyahByAyahViewProps) {
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const compactSurahAudioRef = useRef<CompactSurahAudioHandle>(null);

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

    compactSurahAudioRef.current?.pause();

    if (currentPlayingVerse === verse.numberInSurah && isPlaying) {
      audio.pause();
      return;
    }

    audio.src = buildVerseAudioUrl(verse.number, reciterId);
    setCurrentPlayingVerse(verse.numberInSurah);
    audio.play().catch(() => setIsPlaying(false));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-stone-50 dark:bg-gray-950 transition-colors duration-500">
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentPlayingVerse(null);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="sticky top-0 z-20">
        <CompactSurahAudio
          ref={compactSurahAudioRef}
          surahNumber={surahNumber}
          verses={verses}
          reciterId={reciterId}
          onReciterChange={onReciterChange}
          otherAudioRef={audioRef}
          toolbarClassName="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-stone-200 dark:border-white/5"
        />
      </div>

      <div className="flex-1 overflow-y-visible">

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-8">
            {verses.map((verse) => {
              const displayArabic = stripPrependedBismillahFromVerseOne(
                surahNumber,
                verse.numberInSurah,
                verse.text
              );
              const verseRef = `${surahNumber}:${verse.numberInSurah}`;
              const isCurrent = currentPlayingVerse === verse.numberInSurah;

              return (
                <article 
                  key={verse.number} 
                  id={`ayah-${verse.numberInSurah}`}
                  className={`bg-white dark:bg-gray-900/50 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] transition-all duration-500 border border-stone-200 dark:border-white/5 scroll-mt-32 shadow-sm dark:shadow-2xl ${
                    isCurrent ? 'ring-2 ring-primary-500/50 bg-primary-50 dark:bg-[#1a1a1a] scale-[1.02]' : 'hover:scale-[1.01] group'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12">
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-stone-50 dark:bg-white/5 text-[9px] sm:text-[10px] font-bold text-stone-400 dark:text-gray-600 tracking-[0.1em] sm:tracking-[0.2em] uppercase border border-stone-100 dark:border-white/5">
                      Verset {verseRef}
                    </span>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => handlePlayVerse(verse)}
                        className={`p-2.5 sm:p-3 rounded-xl transition-all duration-500 ${
                          isCurrent && isPlaying 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 scale-110' 
                            : 'bg-stone-50 dark:bg-white/5 text-stone-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-white hover:bg-white/10'
                        }`}
                        title="Lire le verset"
                      >
                        {isCurrent && isPlaying ? (
                          <Pause className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                        ) : (
                          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleBookmark({ ...verse, text: displayArabic })}
                        className={`p-2.5 sm:p-3 rounded-xl transition-all duration-500 ${
                          isBookmarked(verse.numberInSurah)
                            ? 'bg-gold-100 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-200 dark:border-gold-500/20 scale-110 shadow-lg shadow-gold-500/10'
                            : 'bg-stone-50 dark:bg-white/5 text-stone-400 dark:text-gray-500 hover:text-gold-500 hover:bg-white/10'
                        }`}
                        title={isBookmarked(verse.numberInSurah) ? 'Retirer le signet' : 'Ajouter un signet'}
                      >
                        {isBookmarked(verse.numberInSurah) ? (
                          <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p
                    className="font-amiri text-2xl sm:text-4xl lg:text-5xl text-center text-stone-800 dark:text-gray-100 leading-[3] sm:leading-[4] mb-8 sm:mb-12 font-normal group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                    style={{ direction: 'rtl', wordSpacing: '0.25em' }}
                  >
                    {displayArabic}
                  </p>

                  <div className="w-24 sm:w-32 h-px bg-stone-100 dark:bg-white/5 mx-auto mb-8 sm:mb-12 rounded-full" />

                  <p className="font-amiri text-sm sm:text-base lg:text-lg text-stone-500 dark:text-gray-400 leading-[1.8] sm:leading-[2] italic text-center max-w-2xl mx-auto tracking-wide opacity-80 group-hover:opacity-100 transition-opacity px-2">
                    {verse.translation}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
