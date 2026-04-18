import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Compass, Sparkles, BookOpen, Moon } from 'lucide-react';
import MotivationalQuote from './shared/MotivationalQuote';


export default function HifzChoice() {
  const navigate = useNavigate();
  const [hasExistingProfile, setHasExistingProfile] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem('hifz-profile');
    setHasExistingProfile(!!profile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-blue-950 dark:via-gray-900 dark:to-blue-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec rappel spirituel */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-green-800 dark:text-green-400 mb-4 border border-stone-200 dark:border-stone-700">
            <Moon className="w-4 h-4" />
            <span>بسم الله الرحمن الرحيم</span>
          </div>
          <h1 className="font-amiri text-4xl md:text-5xl text-green-800 dark:text-green-400 mb-3">
            Mon Hifz
          </h1>
          <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
            Choisissez la voie qui vous correspond. Que vous ayez besoin d’un programme sur mesure ou d’un chemin simple et progressif, nous vous accompagnons.
          </p>
        </motion.div>

        {/* Citation motivante */}
        <MotivationalQuote />

        {/* Deux cartes de choix */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Carte Programme personnalisé */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-stone-200 dark:border-stone-700 hover:shadow-2xl transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5">
              <Target className="w-7 h-7 text-green-700 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Programme personnalisé</h2>
            <p className="text-stone-500 dark:text-stone-400 mb-4">
              Basé sur votre niveau, votre disponibilité et votre objectif (date butoir, nombre de Juz). Calculez votre rythme idéal.
            </p>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-300 mb-6">
              <li className="flex items-center gap-2">✓ Questionnaire détaillé (5 étapes)</li>
              <li className="flex items-center gap-2">✓ Planning adapté à votre emploi du temps</li>
              <li className="flex items-center gap-2">✓ Révision intelligente</li>
            </ul>
            <button
              onClick={() => navigate('/hifz/custom')}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Créer mon programme
            </button>
          </motion.div>

          {/* Carte Suivi guidé */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-stone-200 dark:border-stone-700 hover:shadow-2xl transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-5">
              <Compass className="w-7 h-7 text-blue-700 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Suivi guidé pas à pas</h2>
            <p className="text-stone-500 dark:text-stone-400 mb-4">
              Une méthode progressive, clé en main. Idéal pour les débutants, les non-arabophones, ou ceux qui veulent simplement avancer sereinement.
            </p>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-300 mb-6">
              <li className="flex items-center gap-2">✓ Questionnaire simplifié (1 écran)</li>
              <li className="flex items-center gap-2">✓ Rythme flexible (lent, modéré, soutenu)</li>
              <li className="flex items-center gap-2">✓ Translittération pour non-arabophones</li>
              <li className="flex items-center gap-2">✓ Rappels de révision basés sur 3 jours</li>
            </ul>
            <button
              onClick={() => navigate('/hifz/guided')}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Démarrer le guidage
            </button>
          </motion.div>
        </div>

        {/* Si un profil existe déjà, proposer de continuer */}
        {hasExistingProfile && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-stone-500 dark:text-stone-400 mb-3">Vous avez déjà un programme en cours.</p>
            <button
              onClick={() => navigate('/hifz/dashboard')}
              className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 hover:underline"
            >
              Reprendre là où vous en étiez →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}