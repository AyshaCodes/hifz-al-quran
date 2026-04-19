import { ChevronDown, Pause, Volume2 } from 'lucide-react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { READ_RECITERS } from '../../data/reciters';
import { buildVerseAudioUrl } from '../../lib/quranApi';

export type CompactSurahAudioVerse = { number: number; numberInSurah: number };

export type CompactSurahAudioHandle = { pause: () => void };

export interface CompactSurahAudioProps {
  surahNumber: number;
  verses: CompactSurahAudioVerse[];
  reciterId: string;
  onReciterChange: (id: string) => void;
  /** Affiché à gauche des contrôles (ex. AR | AR+FR). */
  leadingControls?: React.ReactNode;
  /** Autre lecteur audio à interrompre au démarrage (ex. verset par verset). */
  otherAudioRef?: React.RefObject<HTMLAudioElement | null>;
  /** Classes pour la barre sous la progression (fond du bandeau). */
  toolbarClassName?: string;
}

const CompactSurahAudio = forwardRef<CompactSurahAudioHandle, CompactSurahAudioProps>(
  function CompactSurahAudio(
    {
      surahNumber,
      verses,
      reciterId,
      onReciterChange,
      leadingControls,
      otherAudioRef,
      toolbarClassName = 'bg-[#121212]/95',
    },
    ref
  ) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVerseNumber, setCurrentVerseNumber] = useState<number | null>(null);
    const [currentDuration, setCurrentDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const currentReciter = useMemo(
      () => READ_RECITERS.find((r) => r.id === reciterId) ?? READ_RECITERS[0],
      [reciterId]
    );

    const getAudioUrl = useCallback(
      (verseNumber: number) => {
        const v = verses.find((x) => x.number === verseNumber);
        if (!v) return '';
        return buildVerseAudioUrl(v.number, reciterId);
      },
      [verses, reciterId]
    );

    const currentVerse = useMemo(
      () => verses.find((x) => x.number === currentVerseNumber) ?? verses[0],
      [verses, currentVerseNumber]
    );

    useEffect(() => {
      setIsPlaying(false);
      setCurrentVerseNumber(verses[0]?.number ?? null);
      setCurrentTime(0);
      setCurrentDuration(0);
    }, [surahNumber, verses]);

    useEffect(() => {
      if (
        verses.length &&
        currentVerseNumber != null &&
        !verses.some((v) => v.number === currentVerseNumber)
      ) {
        setCurrentVerseNumber(verses[0].number);
      }
    }, [verses, currentVerseNumber]);

    useImperativeHandle(
      ref,
      () => ({
        pause: () => {
          audioRef.current?.pause();
        },
      }),
      []
    );

    useEffect(() => {
      if (!menuOpen) return;
      const close = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setMenuOpen(false);
        }
      };
      document.addEventListener('mousedown', close);
      return () => document.removeEventListener('mousedown', close);
    }, [menuOpen]);

    const handlePlayPause = () => {
      const audio = audioRef.current;
      if (!audio || !currentVerse || verses.length === 0) return;
      if (isPlaying) {
        audio.pause();
        return;
      }
      otherAudioRef?.current?.pause();
      const url = getAudioUrl(currentVerse.number);
      if (!url) return;
      audio.src = url;
      audio.play().catch(() => setIsPlaying(false));
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
      const audio = audioRef.current;
      if (audio?.duration) {
        setCurrentTime(audio.currentTime);
        setCurrentDuration(audio.duration);
      }
    };

    const handleLoadedMetadata = () => {
      const audio = audioRef.current;
      if (audio?.duration) {
        setCurrentDuration(audio.duration);
      }
    };

    const surahProgressPercent = useMemo(() => {
      if (verses.length === 0) return 0;
      if (!currentVerseNumber) return 0;
      const idx = verses.findIndex((v) => v.number === currentVerseNumber);
      if (idx < 0) return 0;
      const verseFraction = currentDuration > 0 ? currentTime / currentDuration : 0;
      return ((idx + verseFraction) / verses.length) * 100;
    }, [verses, currentVerseNumber, currentDuration, currentTime]);

    const disabled = verses.length === 0 || !currentVerse;

    return (
      <>
        <div className="sticky top-0 z-30 w-full shadow-[0_1px_0_rgba(255,255,255,0.03)]">
          <div className="h-[2px] w-full bg-white/5">
            <div
              className="h-full bg-primary-500 transition-[width] duration-150 ease-linear"
              style={{ width: `${Math.min(100, surahProgressPercent)}%` }}
            />
          </div>
          <div
            className={`flex items-center justify-between sm:justify-end gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 backdrop-blur-[10px] border-b border-white/5 ${toolbarClassName}`}
          >
            {leadingControls}
            <div
              className="flex items-center gap-0 shrink-0 rounded-xl border border-stone-200 dark:border-white/5 bg-stone-100/50 dark:bg-black/20 px-1 sm:px-1.5 py-0.5 sm:py-1"
              title="Lecture audio de la sourate"
            >
              <button
                type="button"
                onClick={handlePlayPause}
                disabled={disabled}
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary-600/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 hover:bg-primary-600/20 dark:hover:bg-primary-500/30 disabled:opacity-35 disabled:pointer-events-none transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Lire la sourate'}
              >
                {isPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              </button>
              <div className="w-px h-4 sm:h-5 bg-stone-200 dark:bg-white/10 mx-1 shrink-0" aria-hidden />
              <div className="relative pr-0.5" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-1 text-[9px] sm:text-[11px] text-stone-500 dark:text-gray-400 font-bold uppercase tracking-wider hover:text-stone-800 dark:hover:text-white max-w-[100px] xs:max-w-[148px] sm:max-w-[200px] py-1 pl-1"
                  aria-expanded={menuOpen}
                  aria-haspopup="listbox"
                  aria-label="Choisir le récitateur"
                >
                  <span className="truncate">{currentReciter.shortName}</span>
                  <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-70" />
                </button>
                {menuOpen && (
                  <ul
                    className="absolute right-0 top-full mt-2 py-1 min-w-[200px] rounded-xl border border-white/10 bg-[#1e1e1e] shadow-2xl z-50 text-[11px]"
                    role="listbox"
                  >
                    {READ_RECITERS.map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={r.id === reciterId}
                          className={`w-full text-left px-4 py-2 hover:bg-white/5 transition-colors ${
                            r.id === reciterId
                              ? 'text-primary-400 font-bold'
                              : 'text-gray-400'
                          }`}
                          onClick={() => {
                            onReciterChange(r.id);
                            setMenuOpen(false);
                          }}
                        >
                          {r.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </>
    );
  }
);

export default CompactSurahAudio;
