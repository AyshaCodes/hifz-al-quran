import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { QuestionnaireData } from '../../../types/hifz';

interface Props {
  data: QuestionnaireData;
  onChange: (updates: Partial<QuestionnaireData>) => void;
}

export default function Step5Name({ data, onChange }: Props) {
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

      {data.prenom && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 rounded-xl border border-green-200 text-center"
        >
          <p className="text-green-800 font-semibold text-sm">
            Bismillah, {data.prenom} ! Que Allah facilite votre Hifz.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
