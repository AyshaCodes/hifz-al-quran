import { Menu } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { SURAHS } from '../../data/surahs';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { fetchSurahWithTranslation } from '../../lib/quranApi';
import { Bookmark } from '../../types';
import AudioPlayer from './AudioPlayer';
import AyahByAyahView from './AyahByAyahView';
import ReadModeToggle, { ReadMode } from './ReadModeToggle';
import SurahSidebar from './SurahSidebar';
import VerseDisplay from './VerseDisplay';

interface Verse {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
}

export default function LirePage() {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [desktopSidebarVisible, setDesktopSidebarVisible] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lectureTextMode, setLectureTextMode] = useState<'arabic' | 'both'>('arabic');
  const [reciterId, setReciterId] = useState('ar.alafasy');
  const [readMode, setReadMode] = useState<ReadMode>('lecture');
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('hifz-bookmarks', []);

  const loadSurah = useCallback(async (num: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSurahWithTranslation(num);
      setVerses(data);
    } catch {
      setError('Impossible de charger la sourate. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSurah(selectedSurah);
  }, [selectedSurah, loadSurah]);

  useEffect(() => {
    const syncViewport = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setMobileSidebarOpen(false);
      }
    };
    syncViewport();
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  const handleToggleBookmark = (verse: Verse) => {
    const surah = SURAHS.find((s) => s.number === selectedSurah);
    if (!surah) return;

    const exists = bookmarks.some(
      (b) => b.surahNumber === selectedSurah && b.verseNumber === verse.numberInSurah
    );

    if (exists) {
      setBookmarks(
        bookmarks.filter(
          (b) => !(b.surahNumber === selectedSurah && b.verseNumber === verse.numberInSurah)
        )
      );
    } else {
      const newBookmark: Bookmark = {
        surahNumber: selectedSurah,
        verseNumber: verse.numberInSurah,
        surahName: surah.nameFrench,
        surahNameArabic: surah.nameArabic,
        verseText: verse.text,
        savedAt: new Date().toISOString(),
      };
      setBookmarks([...bookmarks, newBookmark]);
    }
  };

  const currentSurah = SURAHS.find((s) => s.number === selectedSurah);

  const showContent = !loading && !error && verses.length > 0;
  const sidebarOpen = isMobile ? mobileSidebarOpen : desktopSidebarVisible;
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setDesktopSidebarVisible((prev) => !prev);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-beige-100 dark:bg-gray-950">
      <SurahSidebar
        selectedSurah={selectedSurah}
        onSelectSurah={setSelectedSurah}
        isOpen={sidebarOpen}
        onClose={() => (isMobile ? setMobileSidebarOpen(false) : setDesktopSidebarVisible(false))}
        closeOnSelect={isMobile}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-beige-200 dark:border-gray-800 shrink-0">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-beige-100 dark:hover:bg-gray-800 text-gray-500"
            title={sidebarOpen ? 'Cacher la sidebar' : 'Afficher la sidebar'}
          >
            <Menu className="w-5 h-5" />
          </button>
          {currentSurah && (
            <div>
              <h1 className="font-semibold text-gray-800 dark:text-gray-100">
                {currentSurah.nameTranslit}
              </h1>
              <p className="text-xs text-gray-400">
                {currentSurah.nameFrench} · {currentSurah.verses} versets
              </p>
            </div>
          )}
        </div>

        <ReadModeToggle mode={readMode} onModeChange={setReadMode} />
        {readMode === 'lecture' && (
          <div className="flex justify-center gap-2 px-4 py-3 bg-white/90 dark:bg-gray-900/90 border-b border-beige-200 dark:border-gray-800 shrink-0">
            <button
              type="button"
              onClick={() => setLectureTextMode('arabic')}
              className={`px-4 py-1.5 rounded-full text-sm ${lectureTextMode === 'arabic' ? 'bg-primary-500 text-white' : 'bg-beige-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
            >
              Arabe
            </button>
            <button
              type="button"
              onClick={() => setLectureTextMode('both')}
              className={`px-4 py-1.5 rounded-full text-sm ${lectureTextMode === 'both' ? 'bg-primary-500 text-white' : 'bg-beige-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
            >
              Arabe + Traduction
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {loading || error ? (
            <VerseDisplay
              surahNumber={selectedSurah}
              verses={[]}
              loading={loading}
              error={error}
              showTranslation={lectureTextMode === 'both'}
            />
          ) : readMode === 'lecture' ? (
            <VerseDisplay
              surahNumber={selectedSurah}
              verses={verses}
              loading={false}
              error={null}
              showTranslation={lectureTextMode === 'both'}
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

        {showContent && (
          <AudioPlayer
            surahNumber={selectedSurah}
            verseCount={currentSurah?.verses ?? 0}
            verses={verses}
            reciterId={reciterId}
            onReciterChange={setReciterId}
          />
        )}
      </div>
    </div>
  );
}
