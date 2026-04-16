import { DepartMemorisation, QualiteMemorisation } from '../../types/hifz';

interface Props {
  data: {
    departMemorisation: DepartMemorisation | null;
    juzArrive: number;
    qualiteMemorisation: QualiteMemorisation | null;
  };
  onChange: (field: string, value: unknown) => void;
}

export default function Step2Memorized({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Votre mémorisation actuelle
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Par où avez-vous commencé votre mémorisation ?
        </label>
        <div className="space-y-3">
          {[
            { value: 'debut' as DepartMemorisation, label: 'Début du Coran (Juz 1)' },
            { value: 'fin' as DepartMemorisation, label: 'Fin du Coran (Juz 30)' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onChange('departMemorisation', option.value)}
              className={`
                w-full text-left p-4 rounded-xl border-2 transition-all card
                ${data.departMemorisation === option.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-beige-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }
              `}
            >
              <div className="font-medium text-gray-800 dark:text-gray-200">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Jusqu'à quel Juz êtes-vous arrivé ?
        </label>
        <input
          type="number"
          min="1"
          max="30"
          value={data.juzArrive}
          onChange={(e) => onChange('juzArrive', parseInt(e.target.value) || 1)}
          className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 dark:border-gray-700 focus:border-primary-500 focus:outline-none card"
          placeholder="Numéro du Juz (1-30)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Comment évaluez-vous la qualité de votre mémorisation ?
        </label>
        <div className="space-y-3">
          {[
            { value: 'solide' as QualiteMemorisation, label: 'Solide', description: 'Je me souviens bien de ce que j\'ai mémorisé' },
            { value: 'partielle' as QualiteMemorisation, label: 'Partielle', description: 'J\'ai quelques oublis mais c\'est récupérable' },
            { value: 'oubliee' as QualiteMemorisation, label: 'Oubliée', description: 'J\'ai oublié la plupart de ce que j\'avais mémorisé' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onChange('qualiteMemorisation', option.value)}
              className={`
                w-full text-left p-4 rounded-xl border-2 transition-all card
                ${data.qualiteMemorisation === option.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-beige-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }
              `}
            >
              <div className="font-medium text-gray-800 dark:text-gray-200">{option.label}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
