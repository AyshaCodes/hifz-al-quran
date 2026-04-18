import { motion } from 'framer-motion';
import { QuestionnaireData } from '../../../types/hifz';

interface Props {
  data: QuestionnaireData;
  onChange: (updates: Partial<QuestionnaireData>) => void;
}

const HEURES = [
  { value: 'fajr', label: 'Fajr (avant l\'aube)' },
  { value: 'matin', label: 'Matin' },
  { value: 'midi', label: 'Midi' },
  { value: 'aprem', label: 'Après-midi' },
  { value: 'asr', label: 'Asr' },
  { value: 'soir', label: 'Soir / Isha' },
  { value: 'nuit', label: 'Nuit (Tahajjud)' },
];

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const JOURS_VALS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

const MINUTES = [15, 20, 30, 45, 60, 90, 120];

export default function Step4Availability({ data, onChange }: Props) {
  const toggleHeure = (h: string) => {
    const list = data.heuresDisponibles.includes(h)
      ? data.heuresDisponibles.filter((x) => x !== h)
      : [...data.heuresDisponibles, h];
    onChange({ heuresDisponibles: list });
  };

  const toggleJour = (j: string) => {
    const list = data.joursParSemaine.includes(j)
      ? data.joursParSemaine.filter((x) => x !== j)
      : [...data.joursParSemaine, j];
    onChange({ joursParSemaine: list });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-stone-800">Votre disponibilité</h2>
        <p className="text-sm text-stone-500 mt-1">Configurez votre emploi du temps pour le Hifz.</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-stone-700 mb-2">Moments disponibles</p>
        <div className="flex flex-wrap gap-2">
          {HEURES.map((h) => (
            <motion.button
              key={h.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleHeure(h.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                ${data.heuresDisponibles.includes(h.value)
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                }`}
            >
              {h.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-stone-700 mb-2">Jours par semaine</p>
        <div className="flex gap-2">
          {JOURS.map((j, i) => (
            <motion.button
              key={j}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleJour(JOURS_VALS[i])}
              className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all
                ${data.joursParSemaine.includes(JOURS_VALS[i])
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                }`}
            >
              {j}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-stone-700 mb-2">
          Temps par jour : <span className="text-green-700">{data.minutesParJour} min</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {MINUTES.map((m) => (
            <motion.button
              key={m}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange({ minutesParJour: m })}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all
                ${data.minutesParJour === m
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                }`}
            >
              {m} min
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
