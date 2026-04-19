import { Bookmark, BookmarkCheck, Pause, Play, StickyNote, X, Check, Tag } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bookmark as BookmarkType } from '../../types';
import { buildVerseAudioUrl } from '../../lib/quranApi';
import { stripPrependedBismillahFromVerseOne } from '../../lib/bismillah';
import CompactSurahAudio, { CompactSurahAudioHandle } from './CompactSurahAudio';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Mémorisation', 'Révision', 'Inspiration', 'Tajwid', 'Dua'];

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
  onToggleBookmark: (verse: Verse, note?: string, category?: string) => void;
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
  const [noteFormVerse, setNoteFormVerse] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const compactSurahAudioRef = useRef<CompactSurahAudioHandle>(null);

  useEffect(() => {
    setCurrentPlayingVerse(null);
    setIsPlaying(false);
    setNoteFormVerse(null);
  }, [surahNumber]);

  const getBookmark = useCallback(
    (n: number) => bookmarks.find((b) => b.surahNumber === surahNumber && b.verseNumber === n),
    [bookmarks, surahNumber]
  );

  const isBookmarked = (n: number) => !!getBookmark(n);

  const openNoteForm = (verse: Verse) => {
    const existing = getBookmark(verse.numberInSurah);
    setNoteFormVerse(verse.numberInSurah);
    setNoteText(existing?.note || '');
    setSelectedCategory(existing?.category || '');
  };

  const handleSaveNote = (verse: Verse) => {
    onToggleBookmark(verse, noteText, selectedCategory);
    setNoteFormVerse(null);
  };

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

                      <button
                        type="button"
                        onClick={() => openNoteForm({ ...verse, text: displayArabic })}
                        className={`p-2.5 sm:p-3 rounded-xl transition-all duration-500 ${
                          getBookmark(verse.numberInSurah)?.note 
                            ? 'bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-500/20 scale-110 shadow-lg shadow-primary-500/10' 
                            : 'bg-stone-50 dark:bg-white/5 text-stone-400 dark:text-gray-500 hover:text-primary-600 hover:bg-white/10'
                        }`}
                        title="Ajouter une note"
                      >
                        <StickyNote className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {noteFormVerse === verse.numberInSurah && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 overflow-hidden"
                      >
                        <div className="bg-stone-50 dark:bg-black/40 p-6 rounded-2xl border border-stone-200 dark:border-white/10 space-y-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                              <StickyNote className="w-3 h-3" /> Note personnelle
                            </h4>
                            <button onClick={() => setNoteFormVerse(null)} className="text-stone-400 hover:text-stone-600 dark:hover:text-white transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea 
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Ajouter une réflexion, un point de Tajwid..."
                            className="w-full p-4 bg-white dark:bg-gray-900 border border-stone-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none dark:text-white"
                            rows={3}
                            autoFocus
                          />
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Catégorie</label>
                            <div className="flex flex-wrap gap-2">
                              {CATEGORIES.map(cat => (
                                <button 
                                  key={cat}
                                  onClick={() => setSelectedCategory(cat)}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${selectedCategory === cat ? 'bg-primary-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-stone-500 border border-stone-200 dark:border-white/10'}`}
                                >
                                  <Tag className="w-3 h-3" />
                                  {cat}
                                </button>
                              ))}
                              <button 
                                onClick={() => setSelectedCategory('')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${selectedCategory === '' ? 'bg-red-50 text-red-500' : 'bg-white dark:bg-gray-800 text-stone-500 border border-stone-200 dark:border-white/10'}`}
                              >
                                Aucune
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button 
                              onClick={() => setNoteFormVerse(null)}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-200 dark:hover:bg-gray-800 transition-all"
                            >
                              Annuler
                            </button>
                            <button 
                              onClick={() => handleSaveNote({ ...verse, text: displayArabic })}
                              className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-all flex items-center gap-2 shadow-lg shadow-primary-600/20"
                            >
                              <Check className="w-4 h-4" /> Enregistrer
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p
                    className="font-amiri text-xl sm:text-2xl lg:text-3xl text-center text-stone-800 dark:text-gray-100 leading-[3.5] sm:leading-[4.5] mb-8 sm:mb-12 font-normal group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                    style={{ direction: 'rtl', wordSpacing: '0.4em' }}
                  >
                    {displayArabic}
                  </p>

                  {getBookmark(verse.numberInSurah)?.note && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 p-4 bg-primary-50/50 dark:bg-primary-900/10 rounded-2xl border border-primary-100/50 dark:border-primary-800/20 relative"
                    >
                      <StickyNote className="w-3 h-3 text-primary-600 dark:text-primary-400 absolute -top-1.5 -left-1.5 bg-white dark:bg-gray-900 rounded-full p-0.5" />
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 italic text-center leading-relaxed">
                        "{getBookmark(verse.numberInSurah)?.note}"
                      </p>
                    </motion.div>
                  )}

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
