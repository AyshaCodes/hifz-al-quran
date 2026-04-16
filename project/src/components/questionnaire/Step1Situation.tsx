import { Situation } from '../../types/hifz';

interface Props {
  value: Situation | null;
  onChange: (value: Situation) => void;
}

export default function Step1Situation({ value, onChange }: Props) {
  const options: { value: Situation; label: string; description: string }[] = [
    {
      value: 'debutant',
      label: 'Débutant',
      description: 'Je n\'ai jamais mémorisé le Coran',
    },
    {
      value: 'peu_avance',
      label: 'Peu avancé',
      description: 'J\'ai mémorisé moins de 3 Juz',
    },
    {
      value: 'plusieurs_juz',
      label: 'Plusieurs Juz',
      description: 'J\'ai mémorisé 3 Juz ou plus',
    },
    {
      value: 'revision',
      label: 'Révision',
      description: 'J\'ai déjà mémorisé tout le Coran',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Quelle est votre situation actuelle ?
      </h2>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              w-full text-left p-4 rounded-xl border-2 transition-all card
              ${value === option.value
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
  );
}
