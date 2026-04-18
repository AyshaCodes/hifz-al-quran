import { motion } from 'framer-motion';
import { QuestionnaireData } from '../../../types/hifz';

interface Props {
  data: QuestionnaireData;
  onChange: (updates: Partial<QuestionnaireData>) => void;
}

const DEPART_OPTIONS = [
  { value: 'debut', label: 'Depuis le début (Juz 1)', sub: 'J\'ai commencé par Al-Fatiha.' },
  { value: 'milieu', label: 'Depuis le milieu', sub: 'J\'ai commencé par les dernières sourates.' },
  { value: 'juzPrecis', label: 'Juz précis', sub: 'Indiquez le juz où vous en êtes.' },
] as const;

const QUALITE_OPTIONS = [
  { value: 'solide', label: 'Solide', sub: 'Je récite avec fluidité et confiance.' },
  { value: 'partielle', label: 'Partielle', sub: 'Quelques hésitations, besoin de renforcer.' },
  { value: 'oubliee', label: 'Oubliée en partie', sub: 'J\'ai besoin de révisions intensives.' },
] as const;

export default function Step2Memorized({ data, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-stone-800">Ce que vous avez déjà mémorisé</h2>
        <p className="text-sm text-stone-500 mt-1">Partagez votre progression actuelle.</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-stone-700 mb-2">Par où avez-vous commencé ?</p>
        <div className="space-y-2">
          {DEPART_OPTIONS.map((opt) => (
            <motion.button
              key={opt.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange({ departMemorisation: opt.value })}
              className={`w-full text-left p-3.5 rounded-xl border-2 transition-all
                ${data.departMemorisation === opt.value
                  ? 'border-green-700 bg-green-50'
                  : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
            >
              <p className="font-semibold text-stone-800 text-sm">{opt.label}</p>
              <p className="text-xs text-stone-500 mt-0.5">{opt.sub}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {data.departMemorisation === 'juzPrecis' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <label className="text-sm font-semibold text-stone-700 block mb-2">
            Juz actuel (1–30)
          </label>
          <input
            type="number"
            min={1}
            max={30}
            value={data.juzArrive}
            onChange={(e) => onChange({ juzArrive: parseInt(e.target.value) || 1 })}
            className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:border-green-700 text-sm"
          />
        </motion.div>
      )}

      <div>
        <p className="text-sm font-semibold text-stone-700 mb-2">Qualité de mémorisation</p>
        <div className="space-y-2">
          {QUALITE_OPTIONS.map((opt) => (
            <motion.button
              key={opt.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange({ qualiteMemorisation: opt.value })}
              className={`w-full text-left p-3.5 rounded-xl border-2 transition-all
                ${data.qualiteMemorisation === opt.value
                  ? 'border-green-700 bg-green-50'
                  : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
            >
              <p className="font-semibold text-stone-800 text-sm">{opt.label}</p>
              <p className="text-xs text-stone-500 mt-0.5">{opt.sub}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
