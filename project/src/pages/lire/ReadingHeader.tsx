import { ChevronDown, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { SURAHS } from '../../data/surahs';
import { ReadMode } from './ReadModeToggle';

interface ReadingHeaderProps {
  selectedSurah: number;
  onSelectSurah: (num: number) => void;
  currentPage: number;
  currentJuz: number;
  currentHizb: number;
  readMode: ReadMode;
  onModeChange: (mode: ReadMode) => void;
  onToggleSidebar: () => void;
}

export default function ReadingHeader({
  selectedSurah,
  onSelectSurah,
  currentPage,
  currentJuz,
  currentHizb,
  readMode,
  onModeChange,
  onToggleSidebar,
}: ReadingHeaderProps) {
  const [isSurahOpen, setIsSurahOpen] = useState(false);
  const currentSurah = SURAHS.find((s) => s.number === selectedSurah) ?? SURAHS[0];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSurahOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-16 md:top-20 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-stone-200 dark:border-white/5 h-12 flex items-center px-2 md:px-4 gap-2 md:gap-4 text-stone-600 dark:text-gray-300 transition-colors duration-500">
      {/* Left: Sidebar Toggle & Surah Selector */}
      <div className="flex items-center gap-1 md:gap-3 shrink-0" ref={dropdownRef}>
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 text-stone-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-white transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>

        <button
          onClick={() => setIsSurahOpen(!isSurahOpen)}
          className="flex items-center gap-1 md:gap-2 px-1.5 md:px-2 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors text-[10px] md:text-xs font-bold uppercase tracking-tight max-w-[120px] sm:max-w-none"
        >
          <span className="text-stone-400 dark:text-gray-500 hidden xs:inline">{currentSurah.number}.</span>
          <span className="text-stone-800 dark:text-white truncate">{currentSurah.nameTranslit}</span>
          <ChevronDown className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-300 ${isSurahOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isSurahOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-12 left-2 md:left-4 w-60 md:w-64 bg-white dark:bg-[#1e1e1e] border border-stone-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[70vh] flex flex-col z-50"
            >
              <div className="p-2 border-b border-stone-100 dark:border-white/5">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-white"
                  autoFocus
                />
              </div>
              <div className="overflow-y-auto py-1">
                {SURAHS.map((s) => (
                  <button
                    key={s.number}
                    onClick={() => {
                      onSelectSurah(s.number);
                      setIsSurahOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 hover:bg-stone-50 dark:hover:bg-white/5 text-sm transition-colors ${
                      s.number === selectedSurah ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-stone-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-stone-400 dark:text-gray-500 w-5">{s.number}</span>
                      <span className="font-medium">{s.nameTranslit}</span>
                    </div>
                    <span className="font-arabic text-xs opacity-60">{s.nameArabic}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-6 w-px bg-stone-200 dark:bg-white/10 mx-1 md:mx-2 shrink-0 hidden sm:block" />

      {/* Center: Info */}
      <div className="flex-1 flex justify-center items-center gap-2 md:gap-6 text-[8px] md:text-[10px] font-bold tracking-[0.05em] md:tracking-[0.15em] uppercase text-stone-400 dark:text-gray-500 truncate">
        <div className="flex items-center gap-1 md:gap-2 group cursor-default">
          <BookOpen className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover:text-primary-500 transition-colors" />
          <span className="group-hover:text-stone-700 dark:group-hover:text-gray-300 transition-colors">P. {currentPage}</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2 group cursor-default">
          <Layers className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover:text-primary-500 transition-colors" />
          <span className="group-hover:text-stone-700 dark:group-hover:text-gray-300 transition-colors">
            <span className="hidden xs:inline">Juz</span> {currentJuz} <span className="hidden sm:inline">/ Hizb {currentHizb}</span>
          </span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        {/* Read Mode Toggle */}
        <div className="flex bg-stone-100 dark:bg-black/40 p-0.5 md:p-1 rounded-lg gap-0.5 md:gap-1 border border-stone-200 dark:border-white/5">
          <button
            onClick={() => onModeChange('ayah')}
            className={`px-2 md:px-3 py-1 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all ${
              readMode === 'ayah' ? 'bg-white dark:bg-[#2a2a2a] text-primary-600 dark:text-primary-400 shadow-sm' : 'text-stone-500 hover:text-stone-800 dark:hover:text-white'
            }`}
          >
            Verset
          </button>
          <button
            onClick={() => onModeChange('lecture')}
            className={`px-2 md:px-3 py-1 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all ${
              readMode === 'lecture' ? 'bg-white dark:bg-[#2a2a2a] text-primary-600 dark:text-primary-400 shadow-sm' : 'text-stone-500 hover:text-stone-800 dark:hover:text-white'
            }`}
          >
            Lecture
          </button>
        </div>
      </div>
    </header>
  );
}
