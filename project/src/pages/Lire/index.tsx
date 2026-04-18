import { Menu } from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SURAHS } from '../../data/surahs';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getCurrentTargetPage } from '../../lib/hifzSchedule';
import {
  ApiPageVerse,
  fetchSurahFromNewAPI,
  fetchPageWithTranslation,
  fetchSurahForMushafPage,
  fetchFirstPageForSurah,
} from '../../lib/quranApi';
import { Bookmark, DailyProgress, UserProfile } from '../../types';
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

interface MushafPageData {
  pageNumber: number;
  verses: ApiPageVerse[];
  juz: number;
  hizbQuarter: number;
}

export default function LirePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lecturePages, setLecturePages] = useState<MushafPageData[]>([]);
  const [mushafPage, setMushafPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);
  const [loadingMorePages, setLoadingMorePages] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [reachedSurahEnd, setReachedSurahEnd] = useState(false);
  const [desktopSidebarVisible, setDesktopSidebarVisible] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lectureTextMode, setLectureTextMode] = useState<'arabic' | 'both'>('arabic');
  const [reciterId, setReciterId] = useState('ar.alafasy');
  const [readMode, setReadMode] = useState<ReadMode>('lecture');
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('hifz-bookmarks', []);
  const [memorizingSurahNumber, setMemorizingSurahNumber] = useState<number | null>(null);

  const fromHifz = searchParams.get('from') === 'hifz';
  const targetPageParam = Number(searchParams.get('page') ?? '0');
  const targetPage = Number.isFinite(targetPageParam) && targetPageParam > 0 ? targetPageParam : null;
  const quickPages = (searchParams.get('pages') ?? '')
    .split(',')
    .map((p) => Number(p))
    .filter((p) => Number.isFinite(p) && p > 0);

  // Ref pour annuler les requêtes
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentSurahRef = useRef(selectedSurah);

  // Lire le paramètre surah depuis l'URL et initialiser l'état
  useEffect(() => {
    const surahParam = searchParams.get('surah');
    if (surahParam) {
      const newSurah = parseInt(surahParam, 10);
      if (!isNaN(newSurah) && newSurah !== selectedSurah) {
        setSelectedSurah(newSurah);
        // Réinitialiser les pages et autres états
        setLecturePages([]);
        setReachedSurahEnd(false);
        // Nettoyer l'URL pour éviter les boucles
        const params = new URLSearchParams(searchParams);
        params.delete('surah');
        navigate(`/lire?${params.toString()}`, { replace: true });
      }
    }
  }, [searchParams, selectedSurah, navigate]);

  const loadSurah = useCallback(async (num: number, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      // Utiliser la nouvelle API sans rate limit
      const data = await fetchSurahFromNewAPI(num);
      if (signal?.aborted) return;
      setVerses(data.map((v) => ({ ...v, translation: v.translation ?? '' })));
    } catch (err) {
      if (signal?.aborted) return;
      console.error('Error loading surah:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('429') || errorMessage.includes('CORS')) {
        setError('Service temporairement indisponible. Veuillez réessayer dans quelques minutes.');
      } else {
        setError('Impossible de charger la sourate. Vérifiez votre connexion.');
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  // Charger la sourate quand elle change
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    currentSurahRef.current = selectedSurah;
    loadSurah(selectedSurah, controller.signal);
    return () => {
      controller.abort();
    };
  }, [selectedSurah, loadSurah]);

  // Initialisation depuis targetPage (paramètre URL)
  useEffect(() => {
    if (targetPage) {
      setMushafPage(Math.min(604, Math.max(1, targetPage)));
      let cancelled = false;
      fetchSurahForMushafPage(targetPage)
        .then((surahNum) => {
          if (!cancelled && surahNum !== selectedSurah) {
            setSelectedSurah(surahNum);
            setReadMode('lecture');
          }
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }
  }, [targetPage]); // Ne pas inclure selectedSurah ici pour éviter boucle

  // Mise à jour de mushafPage lorsque la sourate change (en mode lecture)
  useEffect(() => {
    if (readMode !== 'lecture') return;
    let cancelled = false;
    const updatePage = async () => {
      try {
        const firstPage = await fetchFirstPageForSurah(selectedSurah);
        if (!cancelled) {
          setMushafPage(Math.min(604, Math.max(1, firstPage)));
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de la première page', err);
      }
    };
    updatePage();
    return () => {
      cancelled = true;
    };
  }, [selectedSurah, readMode]); // Déclenché quand la sourate change en mode lecture

  // Chargement de la page du Mushaf
  useEffect(() => {
    if (readMode !== 'lecture') return;
    if (!selectedSurah) return;
    if (!mushafPage || isNaN(mushafPage)) return;

    let cancelled = false;
    const loadPage = async () => {
      setPageLoading(true);
      setPageError(null);
      setReachedSurahEnd(false);
      try {
        const pageData = await fetchPageWithTranslation(mushafPage);
        if (cancelled) return;
        const filteredAyahs = pageData.ayahs.filter((ayah: ApiPageVerse) => ayah.surahNumber === selectedSurah);
        setLecturePages([
          {
            pageNumber: mushafPage,
            verses: filteredAyahs,
            juz: pageData.juz,
            hizbQuarter: pageData.hizbQuarter,
          },
        ]);
      } catch (err) {
        if (!cancelled) {
          console.error('Error loading page:', err);
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          if (errorMessage.includes('429') || errorMessage.includes('CORS')) {
            setPageError('Service temporairement indisponible. Veuillez réessayer dans quelques minutes.');
          } else {
            setPageError('Impossible de charger la page du Mushaf.');
          }
        }
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    };
    loadPage();
    return () => {
      cancelled = true;
    };
  }, [mushafPage, readMode, selectedSurah]);

  const loadNextLecturePage = async () => {
    if (readMode !== 'lecture' || loadingMorePages || pageLoading || reachedSurahEnd) return;
    const lastPage = lecturePages[lecturePages.length - 1]?.pageNumber ?? mushafPage;
    if (lastPage >= 604) return;
    setLoadingMorePages(true);
    try {
      const nextPageNumber = lastPage + 1;
      const pageData = await fetchPageWithTranslation(nextPageNumber);
      const containsSelectedSurah = pageData.ayahs.some((ayah: ApiPageVerse) => ayah.surahNumber === selectedSurah);
      if (!containsSelectedSurah) {
        setReachedSurahEnd(true);
        return;
      }
      const filteredAyahs = pageData.ayahs.filter((ayah: ApiPageVerse) => ayah.surahNumber === selectedSurah);
      setLecturePages((prev) => {
        if (prev.some((p) => p.pageNumber === nextPageNumber)) return prev;
        return [
          ...prev,
          {
            pageNumber: nextPageNumber,
            verses: filteredAyahs,
            juz: pageData.juz,
            hizbQuarter: pageData.hizbQuarter,
          },
        ];
      });
    } catch {
      // ignore
    } finally {
      setLoadingMorePages(false);
    }
  };

  useEffect(() => {
    const rawProfile = localStorage.getItem('hifz-profile');
    if (!rawProfile) {
      setMemorizingSurahNumber(null);
      return;
    }
    try {
      const profile = JSON.parse(rawProfile) as UserProfile;
      const rawProgress = localStorage.getItem('hifz-progress');
      const progress: DailyProgress[] = rawProgress ? JSON.parse(rawProgress) : [];
      const page = getCurrentTargetPage(profile, progress);
      fetchSurahForMushafPage(page)
        .then((surahNum) => setMemorizingSurahNumber(surahNum))
        .catch(() => setMemorizingSurahNumber(null));
    } catch {
      setMemorizingSurahNumber(null);
    }
  }, []);

  useEffect(() => {
    const syncViewport = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setMobileSidebarOpen(false);
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
      setBookmarks(bookmarks.filter((b) => !(b.surahNumber === selectedSurah && b.verseNumber === verse.numberInSurah)));
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
  const sidebarOpen = isMobile ? mobileSidebarOpen : desktopSidebarVisible;
  const toggleSidebar = () => {
    if (isMobile) setMobileSidebarOpen((prev) => !prev);
    else setDesktopSidebarVisible((prev) => !prev);
  };

  const handleSelectSurah = (surahNumber: number) => {
    if (surahNumber === selectedSurah) return;
    // Rediriger vers la même page avec un paramètre `surah` dans l'URL
    navigate(`/lire?surah=${surahNumber}&mode=${readMode}`);
  };

  useEffect(() => {
    if (!selectedSurah || readMode !== 'lecture') return;
    const params = new URLSearchParams(searchParams);
    params.set('page', String(mushafPage));
    if (!params.get('from')) params.set('from', 'reader');
    navigate(`/lire?${params.toString()}`, { replace: true });
  }, [mushafPage, readMode, selectedSurah, navigate, searchParams]);

  useEffect(() => {
    if (!selectedSurah) return;
    localStorage.setItem(
      'lire-last-position',
      JSON.stringify({
        surahNumber: selectedSurah,
        page: mushafPage,
        readMode,
        savedAt: new Date().toISOString(),
      })
    );
  }, [selectedSurah, mushafPage, readMode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-blue-950 dark:via-gray-900 dark:to-blue-950">
      <div className="relative flex flex-col lg:flex-row h-screen overflow-hidden">
        <SurahSidebar
          selectedSurah={selectedSurah}
          onSelectSurah={handleSelectSurah}
          isOpen={sidebarOpen}
          onClose={() => (isMobile ? setMobileSidebarOpen(false) : setDesktopSidebarVisible(false))}
          closeOnSelect={isMobile}
          memorizingSurahNumber={memorizingSurahNumber}
        />

        <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
          {fromHifz && (
            <div className="px-4 py-2 bg-green-800 text-white text-sm flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate('/hifz')}
                className="font-medium hover:underline flex items-center gap-1"
              >
                ← Retour à Mon Hifz — Page {mushafPage} en cours
              </button>
              {quickPages.length > 1 && (
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  {quickPages.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setMushafPage(p)}
                      className={`px-2 py-0.5 rounded-full transition ${
                        p === mushafPage ? 'bg-white text-green-800' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      Page {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 flex-shrink-0">
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition"
                title={sidebarOpen ? 'Cacher la sidebar' : 'Afficher la sidebar'}
              >
                <Menu className="w-5 h-5" />
              </button>
              {currentSurah && (
                <div>
                  <h1 className="font-semibold text-gray-800 dark:text-gray-100">
                    {currentSurah.nameTranslit}
                  </h1>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {currentSurah.nameFrench} · {currentSurah.verses} versets
                  </p>
                </div>
              )}
            </div>
          </div>

          <ReadModeToggle mode={readMode} onModeChange={setReadMode} />

          <div className="py-6 px-4">
            {readMode === 'lecture' ? (
              <VerseDisplay
                surahNumber={selectedSurah}
                pages={lecturePages}
                loading={pageLoading}
                error={pageError}
                textMode={lectureTextMode}
                onTextModeChange={setLectureTextMode}
                audioVerses={verses}
                reciterId={reciterId}
                onReciterChange={setReciterId}
                onLoadNextPage={loadNextLecturePage}
                canLoadMore={
                  !reachedSurahEnd &&
                  (lecturePages[lecturePages.length - 1]?.pageNumber ?? mushafPage) < 604
                }
                loadingMore={loadingMorePages}
              />
            ) : loading || error ? (
              <div className="flex items-center justify-center py-20 text-stone-500 text-sm">
                {loading ? 'Chargement de la sourate...' : error}
              </div>
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
        </div>
      </div>
    </div>
  );
}