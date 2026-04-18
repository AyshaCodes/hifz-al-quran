interface Props {
  data: {
    objectif: 'complete' | 'partial' | 'revision' | null;
    nombreJuzObjectif: number;
    aDateObjectif: boolean;
    dateObjectif: string;
    situation: 'debutant' | 'revision' | null;
    qualiteMemorisation: 'good' | 'partial' | 'forgotten' | null;
  };
  onChange: (field: string, value: any) => void;
}

export default function Step3Objective({ data, onChange }: Props) {
  const isRevision = data.situation === 'revision' || data.objectif === 'revision';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Ton objectif
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Que souhaites-tu accomplir avec ton programme ?
        </p>
      </div>

      {!isRevision && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Type d'objectif
          </label>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onChange('objectif', 'complete')}
              className={`w-full text-left rounded-xl border-2 p-3 transition-all ${
                data.objectif === 'complete'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/25 ring-2 ring-green-200 dark:ring-green-800'
                  : 'border-stone-200 dark:border-stone-700 bg-stone-50/80 dark:bg-gray-800/80 hover:border-stone-300 dark:hover:border-stone-600'
              }`}
            >
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Mémoriser le Coran en entier
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Programme complet pour mémoriser les 30 Juz
              </p>
            </button>

            <button
              type="button"
              onClick={() => onChange('objectif', 'partial')}
              className={`w-full text-left rounded-xl border-2 p-3 transition-all ${
                data.objectif === 'partial'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/25 ring-2 ring-green-200 dark:ring-green-800'
                  : 'border-stone-200 dark:border-stone-700 bg-stone-50/80 dark:bg-gray-800/80 hover:border-stone-300 dark:hover:border-stone-600'
              }`}
            >
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Mémoriser une partie spécifique
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Choisis combien de Juz tu veux mémoriser
              </p>
            </button>
          </div>
        </div>
      )}

      {data.objectif === 'partial' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Combien de Juz veux-tu mémoriser ?
          </label>
          <select
            value={data.nombreJuzObjectif}
            onChange={(e) => onChange('nombreJuzObjectif', Number(e.target.value))}
            className="w-full px-4 py-3 bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-stone-700 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700"
          >
            {Array.from({ length: 29 }, (_, i) => i + 1).map((j) => (
              <option key={j} value={j}>
                {j} Juz{j > 1 ? 'z' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          As-tu une date limite ?
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.aDateObjectif}
              onChange={(e) => onChange('aDateObjectif', e.target.checked)}
              className="w-4 h-4 text-green-600 border-stone-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Je veux me fixer une date limite
            </span>
          </label>

          {data.aDateObjectif && (
            <input
              type="date"
              value={data.dateObjectif}
              onChange={(e) => onChange('dateObjectif', e.target.value)}
              min={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-stone-700 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700"
            />
          )}
        </div>
      </div>

      {isRevision && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4">
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>Mode révision activé</strong> : Ton programme sera optimisé pour consolider ce que tu as déjà mémorisé.
            {data.qualiteMemorisation === 'forgotten' && (
              <> Les 30 premiers jours seront consacrés exclusivement à la révision intensive.</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
