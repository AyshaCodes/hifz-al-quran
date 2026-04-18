import { motion } from 'framer-motion';
import { QuestionnaireData } from '../../../types/hifz';

interface Props {
  data: QuestionnaireData;
  onChange: (updates: Partial<QuestionnaireData>) => void;
}

const OBJECTIF_OPTIONS = [
  { value: 'nombreJuz', label: 'Mémoriser un certain nombre de juz', sub: 'Je veux mémoriser X juz.' },
  { value: 'dateButoir', label: 'Avant une date précise', sub: 'J\'ai une deadline (Ramadan, mariage…).' },
  { value: 'revision', label: 'Révision complète', sub: 'Je veux consolider ma mémorisation actuelle.' },
] as const;

export default function Step3Objective({ data, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-xl font-bold text-stone-800">Quel est votre objectif ?</h2>
        <p className="text-sm text-stone-500 mt-1">Définissez ce que vous souhaitez accomplir.</p>
      </div>

      <div className="space-y-2">
        {OBJECTIF_OPTIONS.map((opt) => (
          <motion.button
            key={opt.value}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange({ objectif: opt.value })}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all
              ${data.objectif === opt.value
                ? 'border-green-700 bg-green-50'
                : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
          >
            <p className="font-semibold text-stone-800 text-sm">{opt.label}</p>
            <p className="text-xs text-stone-500 mt-0.5">{opt.sub}</p>
          </motion.button>
        ))}
      </div>

      {data.objectif === 'nombreJuz' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <label className="text-sm font-semibold text-stone-700 block mb-2">
            Nombre de juz à mémoriser (1–30)
          </label>
          <input
            type="number"
            min={1}
            max={30}
            value={data.nombreJuzObjectif}
            onChange={(e) => onChange({ nombreJuzObjectif: parseInt(e.target.value) || 1 })}
            className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:border-green-700 text-sm"
          />
        </motion.div>
      )}

      {data.objectif === 'dateButoir' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <label className="text-sm font-semibold text-stone-700 block">Date objectif</label>
          <input
            type="date"
            value={data.dateObjectif}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => onChange({ dateObjectif: e.target.value, aDateObjectif: true })}
            className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:border-green-700 text-sm"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
