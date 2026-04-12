import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Pause, Play, Repeat } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bookmark as BookmarkType } from '../../types';
import { READ_RECITERS } from '../../data/reciters';
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
  onReciterChange,
  onToggleBookmark,
}: AyahByAyahViewProps) {
  const [verseInSurah, setVerseInSurah] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoChain, setAutoChain] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playAfterLoadRef = useRef(false);

  const verse = verses.find((v) => v.numberInSurah === verseInSurah);
  const verseCount = verses.length;

  useEffect(() => {
    setVerseInSurah(1);
    setIsPlaying(false);
    setAutoChain(false);
  }, [surahNumber]);

  const isBookmarked = useCallback(
    (n: number) => bookmarks.some((b) => b.surahNumber === surahNumber && b.verseNumber === n),
    [bookmarks, surahNumber]
  );

  const displayArabic = verse
    ? stripPrependedBismillahFromVerseOne(surahNumber, verse.numberInSurah, verse.text)
    : '';

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !verse) return;
    audio.src = buildVerseAudioUrl(verse.number, reciterId);
    audio.load();
    if (playAfterLoadRef.current) {
      playAfterLoadRef.current = false;
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [verse?.number, reciterId]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !verse) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setIsPlaying(false));
    }
    setIsPlaying(!isPlaying);
  };

  const goPrev = () => {
    const idx = verses.findIndex((v) => v.numberInSurah === verseInSurah);
    if (idx > 0) {
      setIsPlaying(false);
      setVerseInSurah(verses[idx - 1].numberInSurah);
    }
  };

  const goNext = () => {
    const idx = verses.findIndex((v) => v.numberInSurah === verseInSurah);
    if (idx >= 0 && idx < verses.length - 1) {
      setIsPlaying(false);
      setVerseInSurah(verses[idx + 1].numberInSurah);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    const idx = verses.findIndex((v) => v.numberInSurah === verseInSurah);
    if (autoChain && idx >= 0 && idx < verses.length - 1) {
      playAfterLoadRef.current = true;
      setVerseInSurah(verses[idx + 1].numberInSurah);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio?.duration) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio?.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  if (!verse || verseCount === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        Aucun verset à afficher.
      </div>
    );
  }

  const atStart = verses[0]?.numberInSurah === verseInSurah;
  const atEnd = verses[verses.length - 1]?.numberInSurah === verseInSurah;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-beige-50/50 dark:bg-gray-950/50">
      <div className="flex-1 overflow-y-auto min-h-0">
        <SurahIntro surahNumber={surahNumber} />

        <div className="max-w-3xl mx-auto px-4 py-10 pb-6">
          <div className="flex items-start justify-between gap-3 mb-6">
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400 tabular-nums pt-1">
              {surahNumber}:{verse.numberInSurah}
            </span>
            <button
              type="button"
              onClick={() => verse && onToggleBookmark({ ...verse, text: displayArabic })}
              className={`p-2 rounded-lg transition-colors ${
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
            className="font-arabic text-3xl sm:text-4xl md:text-5xl text-center text-gray-900 dark:text-gray-50 leading-[2.2] mb-10"
            style={{ direction: 'rtl' }}
          >
            {displayArabic}
          </p>

          <p className="text-center text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed italic border-t border-beige-200 dark:border-gray-800 pt-8 px-2">
            {verse.translation}
          </p>

          <div className="flex justify-center items-center gap-6 mt-12 mb-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={atStart}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-beige-300 dark:border-gray-600 text-primary-600 dark:text-primary-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-beige-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Verset précédent
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={atEnd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-beige-300 dark:border-gray-600 text-primary-600 dark:text-primary-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-beige-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Verset suivant
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t-2 border-gold-400 bg-white dark:bg-gray-900 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-4 space-y-4">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <select
            value={reciterId}
            onChange={(e) => onReciterChange(e.target.value)}
            className="w-full sm:max-w-xs text-sm bg-beige-50 dark:bg-gray-800 border border-beige-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            {READ_RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setAutoChain((v) => !v)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
              autoChain
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-beige-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-beige-200 dark:border-gray-700'
            }`}
          >
            <Repeat className="w-4 h-4" />
            Lecture automatique
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={atStart}
              className="p-2 rounded-full hover:bg-beige-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={handlePlayPause}
              className="w-12 h-12 rounded-full green-gradient text-white flex items-center justify-center hover:opacity-90 shadow-md"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={atEnd}
              className="p-2 rounded-full hover:bg-beige-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="text-xs text-gray-400 w-9 text-right tabular-nums">
              {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}
            </span>
            <div
              className="flex-1 h-1.5 bg-beige-200 dark:bg-gray-700 rounded-full cursor-pointer"
              onClick={handleProgressClick}
              role="presentation"
            >
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-9 tabular-nums">{formatTime(duration)}</span>
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-500 shrink-0">
            Vol.
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 accent-primary-500"
            />
          </label>
        </div>

        <p className="text-center text-xs text-gray-400">
          Audio : verset {surahNumber}:{verse.numberInSurah} · récitateur sélectionné
        </p>
      </div>
    </div>
  );
}
