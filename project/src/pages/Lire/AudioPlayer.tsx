import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { RECITERS } from '../../data/surahs';

interface AudioPlayerProps {
  surahNumber: number;
  verseCount: number;
  reciterId: string;
  onReciterChange: (id: string) => void;
}

export default function AudioPlayer({ surahNumber, verseCount, reciterId, onReciterChange }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const getAudioUrl = (verse: number) => {
    const verseKey = surahNumber * 1000 + verse;
    const reciterPaths: Record<string, string> = {
      'ar.alafasy': 'ar.alafasy',
      'ar.abdullahbasfar': 'ar.abdullahbasfar',
      'ar.abdurrahmaansudais': 'ar.abdurrahmaansudais',
      'ar.minshawi': 'ar.minshawi',
      'ar.husary': 'ar.husary',
    };
    const reciter = reciterPaths[reciterId] ?? 'ar.alafasy';
    return `https://cdn.islamic.network/quran/audio/128/${reciter}/${verseKey}.mp3`;
  };

  useEffect(() => {
    setIsPlaying(false);
    setCurrentVerse(1);
    setProgress(0);
  }, [surahNumber]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.src = getAudioUrl(currentVerse);
      audio.play().catch(() => setIsPlaying(false));
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    if (currentVerse > 1) {
      const newVerse = currentVerse - 1;
      setCurrentVerse(newVerse);
      if (isPlaying && audioRef.current) {
        audioRef.current.src = getAudioUrl(newVerse);
        audioRef.current.play();
      }
    }
  };

  const handleNext = () => {
    if (currentVerse < verseCount) {
      const newVerse = currentVerse + 1;
      setCurrentVerse(newVerse);
      if (isPlaying && audioRef.current) {
        audioRef.current.src = getAudioUrl(newVerse);
        audioRef.current.play();
      }
    }
  };

  const handleEnded = () => {
    if (currentVerse < verseCount) {
      const next = currentVerse + 1;
      setCurrentVerse(next);
      if (audioRef.current) {
        audioRef.current.src = getAudioUrl(next);
        audioRef.current.play();
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

  return (
    <div className="card p-4 border-t-2 border-t-gold-400">
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
            className="w-full sm:w-48 text-sm bg-beige-50 dark:bg-gray-800 border border-beige-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 flex flex-col items-center gap-2 w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentVerse === 1}
              className="p-2 rounded-full hover:bg-beige-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handlePlayPause}
              className="w-10 h-10 rounded-full green-gradient text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              disabled={currentVerse === verseCount}
              className="p-2 rounded-full hover:bg-beige-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[80px] text-center">
              Verset {currentVerse}/{verseCount}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full max-w-sm">
            <span className="text-xs text-gray-400 w-8 text-right">
              {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}
            </span>
            <div
              className="flex-1 h-1.5 bg-beige-200 dark:bg-gray-700 rounded-full cursor-pointer group"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-100 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-xs text-gray-400 w-8">{formatTime(duration)}</span>
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
    </div>
  );
}
