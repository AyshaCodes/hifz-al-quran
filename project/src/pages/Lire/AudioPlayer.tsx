import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { READ_RECITERS } from '../../data/reciters';
import { buildVerseAudioUrl } from '../../lib/quranApi';

interface Verse {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
}

interface AudioPlayerProps {
  surahNumber: number;
  verseCount: number;
  verses: Verse[];
  reciterId: string;
  onReciterChange: (id: string) => void;
}

export default function AudioPlayer({
  surahNumber,
  verseCount,
  verses,
  reciterId,
  onReciterChange,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseNumber, setCurrentVerseNumber] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const currentVerse = useMemo(
    () => verses.find((x) => x.number === currentVerseNumber) ?? verses[0],
    [verses, currentVerseNumber]
  );

  const getAudioUrl = (verseNumber: number) => {
    const v = verses.find((x) => x.number === verseNumber);
    if (!v) return '';
    return buildVerseAudioUrl(v.number, reciterId);
  };

  useEffect(() => {
    setIsPlaying(false);
    setCurrentVerseNumber(verses[0]?.number ?? null);
    setProgress(0);
  }, [surahNumber, verses]);

  useEffect(() => {
    if (verses.length && !verses.some((v) => v.number === currentVerseNumber)) {
      setCurrentVerseNumber(verses[0].number);
    }
  }, [verses, currentVerseNumber]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !currentVerse) return;
    if (isPlaying) {
      audio.pause();
    } else {
      const url = getAudioUrl(currentVerse.number);
      if (!url) return;
      audio.src = url;
      audio.play().catch(() => setIsPlaying(false));
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    if (!currentVerse) return;
    const idx = verses.findIndex((v) => v.number === currentVerse.number);
    if (idx > 0) {
      const prev = verses[idx - 1].number;
      setCurrentVerseNumber(prev);
      if (isPlaying && audioRef.current) {
        const url = getAudioUrl(prev);
        if (url) {
          audioRef.current.src = url;
          audioRef.current.play().catch(() => setIsPlaying(false));
        }
      }
    }
  };

  const handleNext = () => {
    if (!currentVerse) return;
    const idx = verses.findIndex((v) => v.number === currentVerse.number);
    if (idx >= 0 && idx < verses.length - 1) {
      const next = verses[idx + 1].number;
      setCurrentVerseNumber(next);
      if (isPlaying && audioRef.current) {
        const url = getAudioUrl(next);
        if (url) {
          audioRef.current.src = url;
          audioRef.current.play().catch(() => setIsPlaying(false));
        }
      }
    }
  };

  const handleEnded = () => {
    if (!currentVerse) return;
    const idx = verses.findIndex((v) => v.number === currentVerse.number);
    if (idx >= 0 && idx < verses.length - 1) {
      const next = verses[idx + 1].number;
      setCurrentVerseNumber(next);
      if (audioRef.current) {
        const url = getAudioUrl(next);
        if (url) {
          audioRef.current.src = url;
          audioRef.current.play().catch(() => setIsPlaying(false));
        }
      }
    } else {
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
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
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = ratio * audioRef.current.duration;
    }
  };

  const atStart = verses[0]?.number === currentVerse?.number;
  const atEnd = verses[verses.length - 1]?.number === currentVerse?.number;
  const disabled = verses.length === 0 || !currentVerse;

  return (
    <div className="shrink-0 z-10 border-t-2 border-t-gold-400 bg-white dark:bg-gray-900 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
      <div className="card p-4 border-0 rounded-none shadow-none bg-transparent">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-auto">
            <select
              value={reciterId}
              onChange={(e) => onReciterChange(e.target.value)}
              className="w-full sm:w-56 text-sm bg-beige-50 dark:bg-gray-800 border border-beige-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              {READ_RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={disabled || atStart}
                className="p-2 rounded-full hover:bg-beige-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handlePlayPause}
                disabled={disabled}
                className="w-10 h-10 rounded-full green-gradient text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm disabled:opacity-40"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={disabled || atEnd}
                className="p-2 rounded-full hover:bg-beige-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[100px] text-center font-mono tabular-nums">
                {currentVerse?.numberInSurah ? `${surahNumber}:${currentVerse.numberInSurah}` : `${surahNumber}:—`} ·{' '}
                {currentVerse ? verses.findIndex((v) => v.number === currentVerse.number) + 1 : 0}/{verseCount}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full max-w-sm">
              <span className="text-xs text-gray-400 w-8 text-right tabular-nums">
                {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}
              </span>
              <div
                className="flex-1 h-1.5 bg-beige-200 dark:bg-gray-700 rounded-full cursor-pointer group"
                onClick={handleProgressClick}
                role="presentation"
              >
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-100 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-xs text-gray-400 w-8 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 accent-primary-500"
            />
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-2">
          Lecture de la sourate entière — verset par verset
        </p>
      </div>
    </div>
  );
}
