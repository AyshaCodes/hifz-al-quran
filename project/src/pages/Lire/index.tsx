import { Menu } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { SURAHS } from '../../data/surahs';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { fetchSurahWithTranslation } from '../../lib/quranApi';
import { Bookmark } from '../../types';
import AudioPlayer from './AudioPlayer';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reciterId, setReciterId] = useState('ar.alafasy');
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('hifz-bookmarks', []);

  const loadSurah = useCallback(async (num: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSurahWithTranslation(num, reciterId);
      setVerses(data);
    } catch {
      setError('Impossible de charger la sourate. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }, [reciterId]);

  useEffect(() => {
    loadSurah(selectedSurah);
  }, [selectedSurah, loadSurah]);

  const handleToggleBookmark = (verse: Verse) => {
    const surah = SURAHS.find((s) => s.number === selectedSurah);
    if (!surah) return;

    const exists = bookmarks.some(
      (b) => b.surahNumber === selectedSurah && b.verseNumber === verse.numberInSurah
    );

    if (exists) {
      setBookmarks(bookmarks.filter(
        (b) => !(b.surahNumber === selectedSurah && b.verseNumber === verse.numberInSurah)
      ));
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

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-beige-100 dark:bg-gray-950">
      <SurahSidebar
        selectedSurah={selectedSurah}
        onSelectSurah={setSelectedSurah}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-beige-200 dark:border-gray-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-beige-100 dark:hover:bg-gray-800 text-gray-500"
          >
            <Menu className="w-5 h-5" />
          </button>
          {currentSurah && (
            <div>
              <h1 className="font-semibold text-gray-800 dark:text-gray-100">
                {currentSurah.nameTranslit}
              </h1>
              <p className="text-xs text-gray-400">{currentSurah.nameFrench} · {currentSurah.verses} versets</p>
            </div>
          )}
        </div>

        <VerseDisplay
          surahNumber={selectedSurah}
          verses={verses}
          loading={loading}
          error={error}
          bookmarks={bookmarks}
          onToggleBookmark={handleToggleBookmark}
        />

        <AudioPlayer
          surahNumber={selectedSurah}
          verseCount={currentSurah?.verses ?? 0}
          reciterId={reciterId}
          onReciterChange={setReciterId}
        />
      </div>
    </div>
  );
}
