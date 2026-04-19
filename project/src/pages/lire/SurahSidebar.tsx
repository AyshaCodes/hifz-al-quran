import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { SURAHS } from '../../data/surahs';

interface SurahSidebarProps {
  selectedSurah: number;
  onSelectSurah: (num: number) => void;
  onSelectPage: (page: number) => void;
  onSelectAyah?: (ayah: number) => void;
  isOpen: boolean;
  onClose: () => void;
  closeOnSelect?: boolean;
}

type Tab = 'sourate' | 'ayah' | 'juz' | 'page';

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
  const surahsInJuz = SURAHS.filter((s) => s.juz === juzNum);
  return { juz: juzNum, firstSurah, surahsInJuz, startPage: JUZ_START_PAGES[juzNum] };
});

export default function SurahSidebar({
  selectedSurah,
  onSelectSurah,
  onSelectPage,
  onSelectAyah,
  isOpen,
  onClose,
  closeOnSelect = true,
}: SurahSidebarProps) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('sourate');

  const selectedSurahData = SURAHS.find((s) => s.number === selectedSurah) ?? SURAHS[0];
  const selectedJuz = selectedSurahData.juz ?? 1;

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

  const ayahs = Array.from({ length: selectedSurahData.verses }, (_, i) => i + 1);
  const filteredAyahs = ayahs.filter((a) => String(a).includes(search));

  const pages = Array.from({ length: 604 }, (_, i) => i + 1);
  const filteredPages = pages.filter((p) => String(p).includes(search));

  const tabs: { id: Tab; label: string }[] = [
    { id: 'sourate', label: 'Sourate' },
    { id: 'juz', label: 'Juz' },
    { id: 'page', label: 'Page' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:sticky md:top-32 inset-y-0 left-0 z-40 md:z-10
          w-[85vw] sm:w-80 md:h-[calc(100vh-128px)]
          bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl text-stone-600 dark:text-gray-300
          border-r border-stone-200 dark:border-white/5
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full md:translate-x-0 md:w-0 opacity-100 md:opacity-0 md:border-r-0 md:overflow-hidden'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-100 dark:border-white/5 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone-800 dark:text-white text-sm tracking-tight uppercase">Navigation</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 text-stone-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-stone-100 dark:bg-white/5 p-1 mb-4 border border-stone-200 dark:border-white/5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg transition-all ${
                  tab === t.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'text-stone-500 dark:text-stone-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 dark:text-stone-500 group-focus-within:text-primary-600 transition-colors" />
            <input
              type="text"
              placeholder={`Rechercher...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-white dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-stone-800 dark:text-gray-200 placeholder-stone-400 dark:placeholder-stone-600 transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-200 dark:scrollbar-thumb-white/10 hover:scrollbar-thumb-stone-300 dark:hover:scrollbar-thumb-white/20">
          {tab === 'sourate' && (
            <div className="py-2">
              {filteredSurahs.map((s) => {
                const isActive = selectedSurah === s.number;
                return (
                  <button
                    key={s.number}
                    onClick={() => {
                      onSelectSurah(s.number);
                      if (closeOnSelect) onClose();
                    }}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3 text-left
                      hover:bg-stone-50 dark:hover:bg-white/5 transition-all group
                      ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600' : 'border-l-4 border-l-transparent'}
                    `}
                  >
                    <span className={`
                      w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl text-xs font-bold transition-all
                      ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 rotate-3' : 'bg-stone-100 dark:bg-white/5 text-stone-400 dark:text-stone-500 group-hover:text-primary-600'}
                    `}>
                      {s.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-bold tracking-tight truncate ${isActive ? 'text-primary-700 dark:text-primary-400' : 'text-stone-700 dark:text-stone-300 group-hover:text-primary-600 dark:group-hover:text-primary-400'}`}>
                          {s.nameTranslit}
                        </p>
                        <p className={`font-arabic text-sm transition-opacity ${isActive ? 'text-primary-600 dark:text-primary-400 opacity-100' : 'text-stone-400 dark:text-stone-500 opacity-40 group-hover:opacity-70'}`}>
                          {s.nameArabic}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 group-hover:text-primary-500/70">{s.verses} versets</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {tab === 'juz' && (
            <div className="py-2">
              {filteredJuz.map(({ juz, surahsInJuz }) => {
                const isActive = selectedJuz === juz;
                return (
                  <button
                    key={juz}
                    onClick={() => {
                      onSelectPage(JUZ_START_PAGES[juz]);
                      if (closeOnSelect) onClose();
                    }}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3 text-left
                      hover:bg-stone-50 dark:hover:bg-white/5 transition-all group
                      ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600' : 'border-l-4 border-l-transparent'}
                    `}
                  >
                    <span className={`
                      w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl text-xs font-bold transition-all
                      ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 rotate-3' : 'bg-stone-100 dark:bg-white/5 text-stone-400 dark:text-stone-500 group-hover:text-primary-600'}
                    `}>
                      {juz}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold tracking-tight ${isActive ? 'text-primary-700 dark:text-primary-400' : 'text-stone-700 dark:text-stone-300 group-hover:text-primary-600 dark:group-hover:text-primary-400'}`}>
                        Juz {juz}
                      </p>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500 truncate group-hover:text-stone-500 transition-colors">
                        {surahsInJuz.map((s) => s.nameTranslit).join(', ')}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {tab === 'page' && (
            <div className="py-2">
              {filteredPages.map((p) => {
                const isActive = false; // À lier à la page courante si nécessaire
                return (
                  <button
                    key={p}
                    onClick={() => {
                      onSelectPage(p);
                      if (closeOnSelect) onClose();
                    }}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3 text-left
                      hover:bg-stone-50 dark:hover:bg-white/5 transition-all group
                      ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600' : 'border-l-4 border-l-transparent'}
                    `}
                  >
                    <span className={`
                      w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl text-xs font-bold transition-all
                      ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 rotate-3' : 'bg-stone-100 dark:bg-white/5 text-stone-400 dark:text-stone-500 group-hover:text-primary-600'}
                    `}>
                      {p}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold tracking-tight ${isActive ? 'text-primary-700 dark:text-primary-400' : 'text-stone-700 dark:text-stone-300 group-hover:text-primary-600 dark:group-hover:text-primary-400'}`}>
                        Page {p}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 group-hover:text-primary-500/70">
                          Mushaf Uthmani
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {tab === 'ayah' && onSelectAyah && (
            <div className="grid grid-cols-4 gap-2 p-4">
              {filteredAyahs.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    onSelectAyah(a);
                    if (closeOnSelect) onClose();
                  }}
                  className="h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-primary-500 hover:text-white text-xs font-bold transition-all border border-white/5"
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
