import { Bookmark, BookmarkCheck, Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bookmark as BookmarkType } from '../../types';
import { buildVerseAudioUrl } from '../../lib/quranApi';
import { stripPrependedBismillahFromVerseOne } from '../../lib/bismillah';
import CompactSurahAudio, { CompactSurahAudioHandle } from './CompactSurahAudio';
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
    <div className="flex-1 flex flex-col min-h-0 bg-stone-50/50 dark:bg-gray-950/50">
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentPlayingVerse(null);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
        <CompactSurahAudio
          ref={compactSurahAudioRef}
          surahNumber={surahNumber}
          verses={verses}
          reciterId={reciterId}
          onReciterChange={onReciterChange}
          otherAudioRef={audioRef}
          toolbarClassName="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-stone-200/50 dark:border-white/5"
        />
        <SurahIntro surahNumber={surahNumber} />

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-6">
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
                  className={`premium-card p-8 transition-all duration-500 ${
                    isCurrent ? 'ring-2 ring-primary-500/50 bg-primary-50/30 dark:bg-primary-900/10 shadow-xl scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-gray-800 text-[10px] font-bold text-stone-500 dark:text-stone-400 tracking-widest uppercase">
                      Verset {verseRef}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePlayVerse(verse)}
                        className={`p-2.5 rounded-xl transition-all duration-300 ${
                          isCurrent && isPlaying 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                            : 'bg-stone-100 dark:bg-gray-800 text-stone-600 dark:text-stone-400 hover:text-primary-600 dark:hover:text-primary-400'
                        }`}
                        title="Lire le verset"
                      >
                        {isCurrent && isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleBookmark({ ...verse, text: displayArabic })}
                        className={`p-2.5 rounded-xl transition-all duration-300 ${
                          isBookmarked(verse.numberInSurah)
                            ? 'bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400'
                            : 'bg-stone-100 dark:bg-gray-800 text-stone-600 dark:text-stone-400 hover:text-gold-500'
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
                  </div>

                  <p
                    className="font-arabic text-lg sm:text-xl text-center text-gray-900 dark:text-gray-50 leading-[3] mb-8 font-normal"
                    style={{ direction: 'rtl' }}
                  >
                    {displayArabic}
                  </p>

                  <div className="w-16 h-px bg-stone-100 dark:bg-gray-800 mx-auto mb-8 rounded-full" />

                  <p className="font-amiri text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic text-center max-w-2xl mx-auto">
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
