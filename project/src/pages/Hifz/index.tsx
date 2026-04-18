import { motion } from 'framer-motion';
import { BookOpen, Compass, ChevronRight, Moon } from 'lucide-react';
import MotivationalQuote from './shared/MotivationalQuote';

interface Props {
  onSelectCustom: () => void;
  onSelectGuided: () => void;
  hasCustomProfile: boolean;
  hasGuidedProfile: boolean;
}

export default function HifzChoice({
  onSelectCustom,
  onSelectGuided,
  hasCustomProfile,
  hasGuidedProfile,
}: Props) {
  return (
    <div className="min-h-[calc(100-80px)] bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="section-container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl green-gradient flex items-center justify-center shadow-lg shadow-primary-600/20">
              <Moon size={24} className="text-white" />
            </div>
            <h1 className="section-title mb-0">Mon Hifz</h1>
          </div>
          <p className="section-subtitle max-w-md mx-auto">
            Votre compagnon de mémorisation du Saint Coran. Choisissez votre parcours pour commencer.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <MotivationalQuote variant="green" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -8 }}
            onClick={onSelectCustom}
            className="premium-card p-8 text-left group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-900/20 rounded-full -translate-y-16 translate-x-16 transition-transform group-hover:scale-110" />
            
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-3 transition-transform">
              <BookOpen size={28} className="text-primary-700 dark:text-primary-400" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Programme Personnalisé</h2>
            <p className="text-stone-500 dark:text-stone-400 leading-relaxed mb-8">
              Un programme sur-mesure établi selon votre niveau actuel, vos objectifs et votre temps disponible.
            </p>
            
            <div className="flex items-center justify-between">
              {hasCustomProfile ? (
                <span className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/40 px-4 py-2 rounded-full">
                  Reprendre le suivi
                </span>
              ) : (
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 bg-stone-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                  Commencer
                </span>
              )}
              <div className="w-10 h-10 rounded-full bg-stone-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -8 }}
            onClick={onSelectGuided}
            className="premium-card p-8 text-left group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-50 dark:bg-gold-900/20 rounded-full -translate-y-16 translate-x-16 transition-transform group-hover:scale-110" />
            
            <div className="w-14 h-14 bg-gold-100 dark:bg-gold-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-3 transition-transform">
              <Compass size={28} className="text-gold-700 dark:text-gold-400" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Programme Guidé</h2>
            <p className="text-stone-500 dark:text-stone-400 leading-relaxed mb-8">
              Démarrez immédiatement avec un rythme préétabli. Idéal pour une approche structurée et rapide.
            </p>
            
            <div className="flex items-center justify-between">
              {hasGuidedProfile ? (
                <span className="text-xs font-bold uppercase tracking-wider text-gold-700 dark:text-gold-400 bg-gold-50 dark:bg-gold-900/40 px-4 py-2 rounded-full">
                  Reprendre le suivi
                </span>
              ) : (
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 bg-stone-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                  Commencer
                </span>
              )}
              <div className="w-10 h-10 rounded-full bg-stone-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gold-600 group-hover:text-white transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="font-arabic text-xl text-stone-400 mb-2">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-xs text-stone-400 uppercase tracking-widest">
            Vos données sont sauvegardées localement
          </p>
        </motion.div>
      </div>
    </div>
  );
}
