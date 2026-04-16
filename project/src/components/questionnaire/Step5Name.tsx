interface Props {
  prenom: string;
  onChange: (value: string) => void;
}

export default function Step5Name({ prenom, onChange }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Comment vous appelez-vous ?
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Votre prénom
        </label>
        <input
          type="text"
          value={prenom}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 dark:border-gray-700 focus:border-primary-500 focus:outline-none card"
          placeholder="Entrez votre prénom"
          autoFocus
        />
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Ce sera utilisé pour personnaliser votre expérience Hifz
        </p>
      </div>
    </div>
  );
}
