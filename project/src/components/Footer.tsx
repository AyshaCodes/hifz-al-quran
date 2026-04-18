import { BookOpen, Heart, Instagram } from 'lucide-react';

export default function Footer() {
  const INSTAGRAM_LINK = "https://www.instagram.com/somme_de_jours/";

  return (
    <footer className="bg-primary-950 dark:bg-gray-950 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl green-gradient flex items-center justify-center shadow-lg shadow-primary-600/20 rotate-3 group-hover:rotate-0 transition-all">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-amiri text-2xl text-white font-bold">Hifz Al-Quran</span>
            </div>
            <p className="text-primary-200/60 dark:text-gray-500 text-xs tracking-widest uppercase font-bold text-center md:text-left">
              Votre compagnon spirituel de mémorisation
            </p>
          </div>

          <div className="text-center space-y-4">
            <p className="font-arabic text-3xl text-gold-400 drop-shadow-sm">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <div className="flex flex-col items-center gap-1">
              <p className="text-primary-100 dark:text-gray-400 text-sm font-amiri italic">
                Qu'Allah facilite votre mémorisation
              </p>
              <Heart className="w-4 h-4 text-gold-500 fill-gold-500 animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center gap-3 group shadow-xl"
            >
              <Instagram className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col items-start">
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary-300">Une question ?</span>
                <span className="text-sm font-semibold">Contactez-nous</span>
              </div>
            </a>
            
            <div className="text-center md:text-right">
              <p className="text-primary-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                © {new Date().getFullYear()} Hifz Al-Quran • Tous droits réservés
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
