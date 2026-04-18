import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { SURAHS } from '../../data/surahs';

interface SurahSidebarProps {
  selectedSurah: number;
  onSelectSurah: (num: number) => void;
  isOpen: boolean;
  onClose: () => void;
  closeOnSelect?: boolean;
  memorizingSurahNumber?: number | null;
}

type Tab = 'sourates' | 'juz';

// Page de début de chaque juz (données fixes du Mushaf Uthmani)
const JUZ_START_PAGES: Record<number, number> = {
  1: 1, 2: 22, 3: 42, 4: 62, 5: 82, 6: 102, 7: 121, 8: 142, 9: 162, 10: 182,
  11: 201, 12: 222, 13: 242, 14: 262, 15: 282, 16: 302, 17: 322, 18: 342,
  19: 362, 20: 382, 21: 402, 22: 422, 23: 442, 24: 462, 25: 482, 26: 502,
  27: 522, 28: 542, 29: 562, 30: 582,
};

// Première sourate de chaque juz (numéro de sourate)
const JUZ_FIRST_SURAH: Record<number, number> = {
  1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8,
  11: 9, 12: 10, 13: 12, 14: 15, 15: 17, 16: 18, 17: 21, 18: 23,
  19: 25, 20: 27, 21: 29, 22: 33, 23: 36, 24: 39, 25: 41, 26: 46,
  27: 51, 28: 58, 29: 67, 30: 78,
};

const JUZ_LIST = Array.from({ length: 30 }, (_, i) => {
  const juzNum = i + 1;
  const firstSurahNum = JUZ_FIRST_SURAH[juzNum];
  const firstSurah = SURAHS.find((s) => s.number === firstSurahNum) ?? SURAHS[0];
  // Sourates qui débutent dans ce juz (approximation visuelle)
  const surahsInJuz = SURAHS.filter((s) => s.juz === juzNum);
  return { juz: juzNum, firstSurah, surahsInJuz, startPage: JUZ_START_PAGES[juzNum] };
});

export default function SurahSidebar({
  selectedSurah,
  onSelectSurah,
  isOpen,
  onClose,
  closeOnSelect = true,
  memorizingSurahNumber = null,
}: SurahSidebarProps) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('sourates');

  const selectedJuz = SURAHS.find((s) => s.number === selectedSurah)?.juz ?? 1;

  const filteredSurahs = SURAHS.filter(
    (s) =>
      s.nameFrench.toLowerCase().includes(search.toLowerCase()) ||
      s.nameTranslit.toLowerCase().includes(search.toLowerCase()) ||
      String(s.number).includes(search)
  );

  const filteredJuz = JUZ_LIST.filter(
    ({ juz, firstSurah }) =>
      String(juz).includes(search) ||
      firstSurah.nameTranslit.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:sticky md:top-0 inset-y-0 left-0 z-40 md:z-10
          w-72 md:h-screen
          bg-white dark:bg-gray-900
          border-r border-stone-200 dark:border-gray-800
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full md:translate-x-0 md:w-0 opacity-100 md:opacity-0 md:border-r-0 md:overflow-hidden'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Navigation</h2>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-gray-800 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg bg-stone-100 dark:bg-gray-800 p-0.5 mb-3">
            <button
              type="button"
              onClick={() => setTab('sourates')}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                tab === 'sourates'
                  ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Sourates
            </button>
            <button
              type="button"
              onClick={() => setTab('juz')}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                tab === 'juz'
                  ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Juz
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder={tab === 'sourates' ? 'Rechercher une sourate...' : 'Rechercher un juz...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-gray-800 border border-stone-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-700 text-gray-700 dark:text-gray-200 placeholder-gray-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {tab === 'sourates' ? (
            filteredSurahs.map((s) => {
              const isActive = selectedSurah === s.number;
              return (
                <button
                  key={s.number}
                  onClick={() => {
                    onSelectSurah(s.number);
                    if (closeOnSelect) onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 text-left
                    hover:bg-stone-50 dark:hover:bg-gray-800/60 transition-colors
                    border-b border-stone-100 dark:border-gray-800/50
                    ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-l-primary-500' : ''}
                  `}
                >
                  {/* Number badge */}
                  <span className={`
                    w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-[11px] font-bold
                    ${isActive
                      ? 'bg-primary-500 text-white'
                      : 'bg-stone-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}
                  `}>
                    {s.number}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-gray-100'}`}>
                        {s.nameTranslit}
                      </p>
                      <p className="font-arabic text-sm text-gray-600 dark:text-gray-300 flex-shrink-0">
                        {s.nameArabic}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0 rounded-full font-medium ${
                        s.revelationType === 'mecquoise'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}>
                        {s.revelationType === 'mecquoise' ? 'Mecque' : 'Médine'}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">{s.verses}v</span>
                      {memorizingSurahNumber === s.number && (
                        <span className="text-[10px] px-1.5 py-0 rounded-full bg-primary-500 text-white font-medium">
                          En cours
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            filteredJuz.map(({ juz, firstSurah, surahsInJuz }) => {
              const isActive = selectedJuz === juz;
              return (
                <button
                  key={juz}
                  onClick={() => {
                    onSelectSurah(firstSurah.number);
                    if (closeOnSelect) onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 text-left
                    hover:bg-stone-50 dark:hover:bg-gray-800/60 transition-colors
                    border-b border-stone-100 dark:border-gray-800/50
                    ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-l-primary-500' : ''}
                  `}
                >
                  {/* Juz number badge */}
                  <span className={`
                    w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-[11px] font-bold
                    ${isActive
                      ? 'bg-primary-500 text-white'
                      : 'bg-stone-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}
                  `}>
                    {juz}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-gray-100'}`}>
                      Juz {juz}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                      {surahsInJuz.length > 0
                        ? surahsInJuz.map((s) => s.nameTranslit).join(', ')
                        : `Commence p. ${JUZ_START_PAGES[juz]}`}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}
