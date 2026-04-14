import { BookOpen, Heart, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-700 dark:bg-gray-950 border-t border-primary-800 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-amiri text-lg text-white font-bold">Hifz Al-Quran</span>
          </div>

          <div className="text-center">
            <p className="font-arabic text-lg text-gold-300 mb-1">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-primary-200 dark:text-gray-400 text-sm flex items-center gap-1 justify-center">
              Qu'Allah facilite votre mémorisation
              <Heart className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
            </p>
          </div>

          <div className="text-right">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-primary-100 hover:text-gold-300 text-xs mb-1 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              Une question ? Contactez-nous
            </a>
            <p className="text-primary-300 dark:text-gray-500 text-xs">
              © {new Date().getFullYear()} Hifz Al-Quran
            </p>
            <p className="text-primary-400 dark:text-gray-600 text-xs mt-0.5">
              Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
