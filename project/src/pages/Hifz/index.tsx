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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Moon size={28} className="text-green-700" />
            <h1 className="text-3xl font-bold text-stone-800 tracking-tight">Mon Hifz</h1>
          </div>
          <p className="text-stone-500 text-sm max-w-sm mx-auto leading-relaxed">
            Votre compagnon de mémorisation du Saint Coran. Choisissez votre parcours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MotivationalQuote variant="green" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.03, boxShadow: '0 24px 48px rgba(0,0,0,0.12)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onSelectCustom}
            className="relative bg-white/90 border-2 border-stone-200 rounded-2xl p-6 text-left
              shadow-xl transition-all group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -translate-y-8 translate-x-8" />
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-green-700" />
            </div>
            <h2 className="text-lg font-bold text-stone-800 mb-1">Programme Personnalisé</h2>
            <p className="text-sm text-stone-500 leading-relaxed mb-4">
              Questionnaire en 5 étapes pour un programme sur-mesure selon votre niveau et vos objectifs.
            </p>
            <div className="flex items-center gap-2">
              {hasCustomProfile ? (
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                  Reprendre
                </span>
              ) : (
                <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-full">
                  Commencer
                </span>
              )}
              <ChevronRight size={16} className="text-stone-400 group-hover:text-green-700 transition-colors ml-auto" />
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03, boxShadow: '0 24px 48px rgba(0,0,0,0.12)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onSelectGuided}
            className="relative bg-white/90 border-2 border-stone-200 rounded-2xl p-6 text-left
              shadow-xl transition-all group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-8 translate-x-8" />
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <Compass size={24} className="text-blue-700" />
            </div>
            <h2 className="text-lg font-bold text-stone-800 mb-1">Programme Guidé</h2>
            <p className="text-sm text-stone-500 leading-relaxed mb-4">
              Démarrez en 1 minute. Rythme préétabli, translittération disponible pour les non-arabophones.
            </p>
            <div className="flex items-center gap-2">
              {hasGuidedProfile ? (
                <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full">
                  Reprendre
                </span>
              ) : (
                <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-full">
                  Commencer
                </span>
              )}
              <ChevronRight size={16} className="text-stone-400 group-hover:text-blue-700 transition-colors ml-auto" />
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-xs text-stone-400">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Toutes vos données sont sauvegardées localement sur votre appareil.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
