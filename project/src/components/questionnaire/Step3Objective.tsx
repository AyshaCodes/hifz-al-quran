import { ObjectifHifz, Situation, QualiteMemorisation } from '../../types/hifz';

interface Props {
  data: {
    objectif: ObjectifHifz | null;
    nombreJuzObjectif: number;
    aDateObjectif: boolean;
    dateObjectif: string;
    situation: Situation | null;
    qualiteMemorisation: QualiteMemorisation | null;
  };
  onChange: (field: string, value: unknown) => void;
}

export default function Step3Objective({ data, onChange }: Props) {
  const isRevisionOnly = data.qualiteMemorisation === 'oubliee' || data.situation === 'revision';

  const objectifs = isRevisionOnly
    ? [{ value: 'revision' as ObjectifHifz, label: 'Révision', description: 'Je veux revoir ce que j\'ai déjà mémorisé' }]
    : [
        { value: 'complet' as ObjectifHifz, label: 'Coran complet', description: 'Je veux mémoriser les 30 Juz' },
        { value: 'quelques_juz' as ObjectifHifz, label: 'Quelques Juz', description: 'Je vise un objectif spécifique' },
        { value: 'revision' as ObjectifHifz, label: 'Révision', description: 'Je veux revoir ce que j\'ai déjà mémorisé' },
      ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Quel est votre objectif ?
      </h2>

      <div className="space-y-3">
        {objectifs.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange('objectif', option.value)}
            className={`
              w-full text-left p-4 rounded-xl border-2 transition-all card
              ${data.objectif === option.value
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

      {data.objectif === 'quelques_juz' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Combien de Juz voulez-vous mémoriser ?
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={data.nombreJuzObjectif}
            onChange={(e) => onChange('nombreJuzObjectif', parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 dark:border-gray-700 focus:border-primary-500 focus:outline-none card"
            placeholder="Nombre de Juz"
          />
        </div>
      )}

      {!isRevisionOnly && data.objectif && data.objectif !== 'revision' && (
        <div>
          <label className="flex items-center space-x-3 mb-3">
            <input
              type="checkbox"
              checked={data.aDateObjectif}
              onChange={(e) => onChange('aDateObjectif', e.target.checked)}
              className="w-4 h-4 text-primary-500 border-beige-300 dark:border-gray-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              J'ai une date limite pour mon objectif
            </span>
          </label>

          {data.aDateObjectif && (
            <input
              type="date"
              value={data.dateObjectif}
              onChange={(e) => onChange('dateObjectif', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 dark:border-gray-700 focus:border-primary-500 focus:outline-none card"
              min={new Date().toISOString().split('T')[0]}
            />
          )}
        </div>
      )}
    </div>
  );
}
