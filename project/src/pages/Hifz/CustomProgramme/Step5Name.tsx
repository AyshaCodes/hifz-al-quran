interface Props {
  prenom: string;
  onChange: (value: string) => void;
}

export default function Step5Name({ prenom, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Dernière étape
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Comment t'appelles-tu ? Cela nous permettra de personnaliser ton expérience.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ton prénom
        </label>
        <input
          type="text"
          value={prenom}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Entre ton prénom..."
          className="w-full px-4 py-3 bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-stone-700 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700 transition-all"
        />
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700/50">
        <p className="text-sm text-green-900 dark:text-green-200 leading-relaxed">
          <strong>Parfait !</strong> Une fois que tu auras entré ton prénom, nous pourrons créer ton programme personnalisé
          adapté à tes objectifs, ta disponibilité et ton niveau actuel.
        </p>
      </div>
    </div>
  );
}
