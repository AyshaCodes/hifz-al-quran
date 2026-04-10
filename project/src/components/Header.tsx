import { Moon, Sun, Menu, X, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

const navItems: { label: string; page: Page }[] = [
  { label: 'Accueil', page: 'home' },
  { label: 'Lire', page: 'lire' },
  { label: 'Mon Hifz', page: 'hifz' },
  { label: 'Signets', page: 'signets' },
];

export default function Header({ currentPage, onNavigate, isDark, onToggleDark }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-beige-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-full green-gradient flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-amiri text-xl text-primary-600 dark:text-primary-400 font-bold">
                Hifz Al-Quran
              </span>
              <span className="text-[10px] text-gold-500 font-medium tracking-wide uppercase">
                حفظ القرآن
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => handleNav(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-beige-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDark}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-beige-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Basculer le mode sombre"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-beige-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-beige-200 dark:border-gray-800 bg-white dark:bg-gray-950 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => handleNav(page)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-beige-100 dark:hover:bg-gray-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
