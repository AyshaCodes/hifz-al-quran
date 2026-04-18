import { motion } from 'framer-motion';
import { QuestionnaireData } from '../../../types/hifz';

interface Props {
  data: QuestionnaireData;
  onChange: (updates: Partial<QuestionnaireData>) => void;
}

const OPTIONS = [
  { value: 'debutant', label: 'Débutant', sub: 'Je commence à mémoriser le Coran.' },
  { value: 'intermediaire', label: 'Intermédiaire', sub: 'J\'ai déjà mémorisé quelques sourates ou juz.' },
  { value: 'avance', label: 'Avancé', sub: 'J\'ai mémorisé plusieurs juz et je continue.' },
  { value: 'revision', label: 'Révision uniquement', sub: 'Je souhaite consolider ce que j\'ai déjà mémorisé.' },
] as const;

export default function Step1Situation({ data, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-xl font-bold text-stone-800">Quelle est votre situation actuelle ?</h2>
        <p className="text-sm text-stone-500 mt-1">
          Cela nous permettra de calibrer votre programme personnalisé.
        </p>
      </div>
      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <motion.button
            key={opt.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange({ situation: opt.value })}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all
              ${data.situation === opt.value
                ? 'border-green-700 bg-green-50'
                : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
          >
            <p className="font-semibold text-stone-800 text-sm">{opt.label}</p>
            <p className="text-xs text-stone-500 mt-0.5">{opt.sub}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
