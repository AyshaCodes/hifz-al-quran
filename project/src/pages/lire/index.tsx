import { ChevronUp, ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { SURAHS } from '../../data/surahs';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  fetchSurahFromNewAPI,
  fetchPageWithTranslation,
  fetchFirstPageForSurah,
} from '../../lib/quranApi';
import { Bookmark } from '../../types';
import AyahByAyahView from './AyahByAyahView';
import { ReadMode } from './ReadModeToggle';
import SurahSidebar from './SurahSidebar';
import VerseDisplay from './VerseDisplay';
import ReadingHeader from './ReadingHeader';

interface Verse {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
}

interface MushafPageData {
  pageNumber: number;
  verses: any[];
  juz: number;
  hizbQuarter: number;
}

export default function LirePage() {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [lecturePages, setLecturePages] = useState<MushafPageData[]>([]);
  const [mushafPage, setMushafPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);
  const [loadingMorePages, setLoadingMorePages] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [reachedSurahEnd, setReachedSurahEnd] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [languageMode, setLanguageMode] = useState<'arabic' | 'both'>('arabic');
  const [reciterId, setReciterId] = useState('ar.alafasy');
  const [readMode, setReadMode] = useState<ReadMode>('lecture');
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('hifz-bookmarks', []);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelectAyah = (ayahNumber: number) => {
    const element = document.getElementById(`ayah-${ayahNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-quran-500', 'ring-opacity-50');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-quran-500', 'ring-opacity-50');
      }, 2000);
    }
  };

  // Détecter si on est sur mobile pour fermer le sidebar par défaut
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadSurah = useCallback(async (num: number, signal?: AbortSignal) => {
    try {
      const data = await fetchSurahFromNewAPI(num);
      if (signal?.aborted) return;
      setVerses(data.map((v) => ({ ...v, translation: v.translation ?? '' })));
    } catch (err) {
      if (signal?.aborted) return;
    } finally {
    }
  }, []);

  useEffect(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    loadSurah(selectedSurah, controller.signal);
    return () => controller.abort();
  }, [selectedSurah, loadSurah]);

  useEffect(() => {
    if (readMode !== 'lecture') return;
    let cancelled = false;
    const updatePage = async () => {
      try {
        const firstPage = await fetchFirstPageForSurah(selectedSurah);
        if (!cancelled) setMushafPage(firstPage);
      } catch (err) {}
    };
    updatePage();
    return () => { cancelled = true; };
  }, [selectedSurah, readMode]);

  useEffect(() => {
    if (readMode !== 'lecture' || !selectedSurah || !mushafPage) return;
    let cancelled = false;
    const loadPage = async () => {
      setPageLoading(true);
      setPageError(null);
      setReachedSurahEnd(false);
      try {
        const pageData = await fetchPageWithTranslation(mushafPage);
        if (cancelled) return;
        const filteredAyahs = pageData.ayahs.filter((ayah: any) => ayah.surahNumber === selectedSurah);
        if (filteredAyahs.length === 0) {
          setReachedSurahEnd(true);
          return;
        }
        setLecturePages([{
          pageNumber: mushafPage,
          verses: filteredAyahs,
          juz: pageData.juz,
          hizbQuarter: pageData.hizbQuarter,
        }]);
      } catch (err) {
        if (!cancelled) setPageError('Erreur de chargement de la page.');
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    };
    loadPage();
    return () => { cancelled = true; };
  }, [mushafPage, readMode, selectedSurah]);

  const loadNextLecturePage = async () => {
    if (readMode !== 'lecture' || loadingMorePages || pageLoading || reachedSurahEnd) return;
    const lastPage = lecturePages[lecturePages.length - 1]?.pageNumber ?? mushafPage;
    if (lastPage >= 604) return;
    setLoadingMorePages(true);
    try {
      const nextPageNumber = lastPage + 1;
      const pageData = await fetchPageWithTranslation(nextPageNumber);
      const filteredAyahs = pageData.ayahs.filter((ayah: any) => ayah.surahNumber === selectedSurah);
      if (filteredAyahs.length === 0) {
        setReachedSurahEnd(true);
        return;
      }
      setLecturePages((prev) => [...prev, {
        pageNumber: nextPageNumber,
        verses: filteredAyahs,
        juz: pageData.juz,
        hizbQuarter: pageData.hizbQuarter,
      }]);
    } catch {
    } finally {
      setLoadingMorePages(false);
    }
  };

  const handleToggleBookmark = (verse: Verse, note?: string, category?: string) => {
    const surah = SURAHS.find((s) => s.number === selectedSurah);
    const existing = bookmarks.find(
      (b) => b.surahNumber === selectedSurah && b.verseNumber === verse.numberInSurah
    );
    if (existing && !note && !category) {
      setBookmarks(bookmarks.filter((b) => b !== existing));
    } else if (existing) {
      // Update existing
      setBookmarks(bookmarks.map(b => 
        (b.surahNumber === selectedSurah && b.verseNumber === verse.numberInSurah)
          ? { ...b, note: note || b.note, category: category || b.category }
          : b
      ));
    } else {
      setBookmarks([
        ...bookmarks,
        {
          surahNumber: selectedSurah,
          surahName: surah?.nameTranslit ?? '',
          surahNameArabic: surah?.nameArabic ?? '',
          verseNumber: verse.numberInSurah,
          verseText: verse.text,
          savedAt: new Date().toISOString(),
          note,
          category
        },
      ]);
    }
  };

  const currentJuz = lecturePages[0]?.juz ?? 1;
  const currentHizb = Math.ceil((lecturePages[0]?.hizbQuarter ?? 1) / 4);

  return (
    <div className="flex flex-col bg-stone-50 dark:bg-gray-950 transition-colors duration-500">
      {/* Tool Header (ReadingHeader) */}
      <ReadingHeader
        selectedSurah={selectedSurah}
        onSelectSurah={setSelectedSurah}
        currentPage={mushafPage}
        currentJuz={currentJuz}
        currentHizb={currentHizb}
        readMode={readMode}
        onModeChange={setReadMode}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex min-h-[calc(100vh-128px)] relative">
        {/* Sidebar */}
        <SurahSidebar
          selectedSurah={selectedSurah}
          onSelectSurah={setSelectedSurah}
          onSelectPage={setMushafPage}
          onSelectAyah={handleSelectAyah}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          closeOnSelect={isMobile}
        />

        {/* Content Area */}
        <main className="flex-1 flex flex-col relative bg-stone-50 dark:bg-gray-950 transition-colors duration-500 overflow-y-auto scroll-smooth">
          {/* Progress bar at the top of content */}
          <div className="h-0.5 w-full bg-stone-200 dark:bg-white/5 sticky top-0 z-40">
            <div 
              className="absolute top-0 left-0 h-full bg-primary-500 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              style={{ width: `${(mushafPage / 604) * 100}%` }}
            />
          </div>

          <div ref={containerRef} className="flex-1">
            {readMode === 'lecture' ? (
              <VerseDisplay
                surahNumber={selectedSurah}
                pages={lecturePages}
                loading={pageLoading}
                error={pageError}
                textMode={languageMode}
                onTextModeChange={setLanguageMode}
                audioVerses={verses.map(v => ({ ...v, audio: '' }))} 
                reciterId={reciterId}
                onReciterChange={setReciterId}
                onLoadNextPage={loadNextLecturePage}
                canLoadMore={!reachedSurahEnd && !loadingMorePages}
                loadingMore={loadingMorePages}
              />
            ) : (
              <AyahByAyahView
                surahNumber={selectedSurah}
                verses={verses}
                bookmarks={bookmarks}
                reciterId={reciterId}
                onReciterChange={setReciterId}
                onToggleBookmark={handleToggleBookmark}
              />
            )}
          </div>

          {/* Floating Navigation Buttons */}
          <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 flex flex-col gap-2 sm:gap-3 z-20">
            <button
              onClick={() => setMushafPage(Math.max(1, mushafPage - 1))}
              className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border border-stone-200 dark:border-white/10 text-stone-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-stone-50 dark:hover:bg-[#2a2a2a] hover:border-primary-500/50 transition-all shadow-xl group active:scale-95"
              title="Page précédente"
            >
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setMushafPage(Math.min(604, mushafPage + 1))}
              className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border border-stone-200 dark:border-white/10 text-stone-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-stone-50 dark:hover:bg-[#2a2a2a] hover:border-primary-500/50 transition-all shadow-xl group active:scale-95"
              title="Page suivante"
            >
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
