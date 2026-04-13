import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { SURAHS } from '../../data/surahs';

interface SurahSidebarProps {
  selectedSurah: number;
  onSelectSurah: (num: number) => void;
  isOpen: boolean;
  onClose: () => void;
  closeOnSelect?: boolean;
}

export default function SurahSidebar({
  selectedSurah,
  onSelectSurah,
  isOpen,
  onClose,
  closeOnSelect = true,
}: SurahSidebarProps) {
  const [search, setSearch] = useState('');

  const filtered = SURAHS.filter(
    (s) =>
      s.nameFrench.toLowerCase().includes(search.toLowerCase()) ||
      s.nameTranslit.toLowerCase().includes(search.toLowerCase()) ||
      String(s.number).includes(search)
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
          fixed md:relative inset-y-0 left-0 z-40 md:z-10
          w-72
          bg-white dark:bg-gray-900
          border-r border-beige-200 dark:border-gray-800
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen
            ? 'translate-x-0 md:w-64 lg:w-72 opacity-100'
            : '-translate-x-full md:translate-x-0 md:w-0 opacity-100 md:opacity-0 md:border-r-0'}
        `}
      >
        <div className="p-4 border-b border-beige-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Sourates</h2>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-lg hover:bg-beige-100 dark:hover:bg-gray-800 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-beige-50 dark:bg-gray-800 border border-beige-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-700 text-gray-700 dark:text-gray-200 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.map((s) => (
            <button
              key={s.number}
              onClick={() => {
                onSelectSurah(s.number);
                if (closeOnSelect) onClose();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left
                hover:bg-beige-50 dark:hover:bg-gray-800 transition-colors
                border-b border-beige-100 dark:border-gray-800/50
                ${selectedSurah === s.number ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-l-primary-500' : ''}
              `}
            >
              <span className={`
                w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold
                ${selectedSurah === s.number
                  ? 'bg-primary-500 text-white'
                  : 'bg-beige-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }
              `}>
                {s.number}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                    {s.nameTranslit}
                  </p>
                  <p className="font-arabic text-sm text-gray-600 dark:text-gray-300 flex-shrink-0">
                    {s.nameArabic}
                  </p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {s.nameFrench} · {s.verses}v
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
