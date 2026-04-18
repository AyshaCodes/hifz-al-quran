import { Moon, Sun, Menu, X, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '../hooks/useRouter';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
}

const navItems = [
  { label: 'Accueil', path: '/' },
  { label: 'Lire', path: '/lire' },
  { label: 'Mon Hifz', path: '/hifz' },
  { label: 'Ressources', path: '/ressources' },
  { label: 'Signets', path: '/signets' },
];

export default function Header({ isDark, onToggleDark }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { path: currentPath, navigate } = useRouter();

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-500">
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-stone-200/50 dark:border-white/5 shadow-sm" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="w-11 h-11 rounded-2xl green-gradient flex items-center justify-center shadow-lg shadow-primary-600/20 rotate-3 group-hover:rotate-0 transition-all duration-500">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-amiri text-2xl text-primary-900 dark:text-primary-50 font-bold tracking-tight">
                Hifz Al-Quran
              </span>
              <span className="text-[10px] text-accent-600 dark:text-accent-400 font-bold tracking-[0.2em] uppercase">
                حفظ القرآن
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center bg-stone-100/50 dark:bg-white/5 rounded-full p-1.5 border border-stone-200/50 dark:border-white/5">
            {navItems.map(({ label, path }) => (
              <button
                key={path}
                onClick={() => handleNav(path)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-500 relative ${
                  currentPath === path
                    ? 'text-white'
                    : 'text-stone-600 dark:text-stone-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {currentPath === path && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 green-gradient rounded-full shadow-lg shadow-primary-600/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleDark}
              className="p-3 rounded-2xl bg-stone-100/50 dark:bg-white/5 text-stone-500 dark:text-stone-400 hover:text-primary-600 dark:hover:text-primary-400 border border-stone-200/50 dark:border-white/5 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Basculer le mode sombre"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-3 rounded-2xl bg-stone-100/50 dark:bg-white/5 text-stone-500 hover:text-primary-600 border border-stone-200/50 dark:border-white/5 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 border-t border-stone-200 dark:border-white/5 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="px-6 py-8 space-y-3">
              {navItems.map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => handleNav(path)}
                  className={`w-full text-left px-6 py-4 rounded-2xl text-base font-semibold transition-all ${
                    currentPath === path
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
