interface Props {
  data: {
    departMemorisation: string;
    juzArrive: number;
    qualiteMemorisation: 'good' | 'partial' | 'forgotten' | null;
  };
  onChange: (field: string, value: any) => void;
}

export default function Step2Memorized({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Ta mémorisation actuelle
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Dis-nous où tu en es et comment tu évalues ta mémorisation.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Point de départ de ta mémorisation
        </label>
        <select
          value={data.departMemorisation}
          onChange={(e) => onChange('departMemorisation', e.target.value)}
          className="w-full px-4 py-3 bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-stone-700 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700"
        >
          <option value="debut">Depuis le début (Al-Fatiha)</option>
          <option value="milieu">Au milieu du Coran</option>
          <option value="fin">Vers la fin du Coran</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Juz actuel (là où tu en es)
        </label>
        <select
          value={data.juzArrive}
          onChange={(e) => onChange('juzArrive', Number(e.target.value))}
          className="w-full px-4 py-3 bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-stone-700 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700"
        >
          {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
            <option key={j} value={j}>
              Juz {j} {j === 30 ? '(Al-Amma)' : j === 1 ? '(Al-Fatiha)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Comment évalues-tu ta mémorisation des Juz déjà acquis ?
        </label>
        <div className="space-y-2">
          {[
            {
              value: 'good' as const,
              emoji: '',
              title: 'Je me souviens bien',
              desc: 'Révision légère : viser environ 1 Juz tous les 3 jours dans ton planning.',
            },
            {
              value: 'partial' as const,
              emoji: '',
              title: 'Je me souviens partiellement',
              desc: 'Révision intensive : 1 Juz par jour en cible, la moitié du temps quotidien réservée à la révision.',
            },
            {
              value: 'forgotten' as const,
              emoji: '',
              title: "J'ai beaucoup oublié",
              desc: 'Phase de consolidation : 1 mois de révision uniquement, sans nouvelle mémorisation.',
            },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange('qualiteMemorisation', opt.value)}
              className={`w-full text-left rounded-xl border-2 p-3 transition-all ${
                data.qualiteMemorisation === opt.value
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/25 ring-2 ring-green-200 dark:ring-green-800'
                  : 'border-stone-200 dark:border-stone-700 bg-stone-50/80 dark:bg-gray-800/80 hover:border-stone-300 dark:hover:border-stone-600'
              }`}
            >
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {opt.emoji} {opt.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                {opt.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
