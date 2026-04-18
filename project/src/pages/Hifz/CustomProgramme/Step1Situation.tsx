import { Situation } from '../../../types/hifz';

interface Props {
  value: Situation | null;
  onChange: (value: 'debutant' | 'revision') => void;
}

export default function Step1Situation({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Quelle est ta situation actuelle ?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choisis l'option qui correspond le mieux à ton niveau actuel de mémorisation.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onChange('debutant')}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            value === 'debutant'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/25 ring-2 ring-green-200 dark:ring-green-800'
              : 'border-stone-200 dark:border-stone-700 bg-stone-50/80 dark:bg-gray-800/80 hover:border-stone-300 dark:hover:border-stone-600'
          }`}
        >
          <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
            Débutant
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Je commence tout juste ou j'ai mémorisé très peu de versets
          </div>
        </button>

        <button
          onClick={() => onChange('revision')}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            value === 'revision'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/25 ring-2 ring-green-200 dark:ring-green-800'
              : 'border-stone-200 dark:border-stone-700 bg-stone-50/80 dark:bg-gray-800/80 hover:border-stone-300 dark:hover:border-stone-600'
          }`}
        >
          <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
            Révision / Consolidation
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            J'ai déjà mémorisé une partie du Coran et je veux la consolider
          </div>
        </button>
      </div>
    </div>
  );
}
