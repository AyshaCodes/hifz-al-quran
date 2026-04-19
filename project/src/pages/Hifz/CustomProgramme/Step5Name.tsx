import { motion } from 'framer-motion';
import { Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { QuestionnaireData } from '../../../types/hifz';

interface Props {
  data: QuestionnaireData;
  onChange: (updates: Partial<QuestionnaireData>) => void;
}

export default function Step5Name({ data, onChange }: Props) {
  // Calcul d'estimation réaliste : environ 60 minutes par page pour une mémorisation de qualité
  const pagesTotal = data.objectif === 'nombreJuz' ? data.nombreJuzObjectif * 20 : 604;
  const pagesPerDay = Math.max(0.5, Math.round((data.minutesParJour / 60) * 2) / 2);
  const totalDays = Math.ceil(pagesTotal / pagesPerDay);
  const totalMonths = Math.ceil(totalDays / 30);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles size={28} className="text-green-700" />
        </motion.div>
        <h2 className="text-xl font-bold text-stone-800">Dernière étape !</h2>
        <p className="text-sm text-stone-500 mt-1">
          Comment souhaitez-vous être appelé dans votre tableau de bord ?
        </p>
      </div>

      <div>
        <label className="text-sm font-semibold text-stone-700 block mb-2">Votre prénom</label>
        <input
          type="text"
          placeholder="Ex : Mohammed, Fatima, Youssef…"
          value={data.prenom}
          onChange={(e) => onChange({ prenom: e.target.value })}
          maxLength={30}
          className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-stone-800
            focus:outline-none focus:border-green-700 text-sm placeholder:text-stone-400 transition-colors"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-700" />
          </div>
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-widest">Estimation de votre parcours</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-xl border border-stone-100">
            <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">Rythme</p>
            <p className="text-sm font-bold text-stone-800">~{pagesPerDay.toFixed(1)} p/jour</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-stone-100">
            <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">Durée</p>
            <p className="text-sm font-bold text-stone-800">~{totalMonths} mois</p>
          </div>
        </div>

        {data.prenom && (
          <p className="text-xs text-center text-stone-500 italic mt-2">
            "Bismillah, {data.prenom} ! Que Allah facilite votre Hifz."
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
