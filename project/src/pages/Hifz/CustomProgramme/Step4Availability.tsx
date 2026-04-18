interface Props {
  data: {
    heuresDisponibles: string[];
    minutesParJour: number;
    joursParSemaine: string[];
  };
  onChange: (field: string, value: any) => void;
}

export default function Step4Availability({ data, onChange }: Props) {
  const HEURES_OPTIONS = [
    { value: 'fajr', label: 'Fajr (avant lever du soleil)', icon: '' },
    { value: 'dhuhr', label: 'Dhuhr (midi)', icon: '' },
    { value: 'asr', label: 'Asr (après-midi)', icon: '' },
    { value: 'maghrib', label: 'Maghrib (coucher du soleil)', icon: '' },
    { value: 'isha', label: 'Isha (soir)', icon: '' },
    { value: 'night', label: 'Nuit tardive', icon: '' },
  ];

  const JOURS_OPTIONS = [
    { value: 'L', label: 'Lundi' },
    { value: 'M', label: 'Mardi' },
    { value: 'Me', label: 'Mercredi' },
    { value: 'J', label: 'Jeudi' },
    { value: 'V', label: 'Vendredi' },
    { value: 'S', label: 'Samedi' },
    { value: 'D', label: 'Dimanche' },
  ];

  const TEMPS_OPTIONS = [15, 30, 45, 60, 90, 120];

  const handleHeureToggle = (heure: string) => {
    const updated = data.heuresDisponibles.includes(heure)
      ? data.heuresDisponibles.filter(h => h !== heure)
      : [...data.heuresDisponibles, heure];
    onChange('heuresDisponibles', updated);
  };

  const handleJourToggle = (jour: string) => {
    const updated = data.joursParSemaine.includes(jour)
      ? data.joursParSemaine.filter(j => j !== jour)
      : [...data.joursParSemaine, jour];
    onChange('joursParSemaine', updated);
  };

  const formatTemps = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    if (minutes === 60) return '1h';
    if (minutes === 90) return '1h30';
    return `${minutes / 60}h`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Ta disponibilité
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Quand peux-tu étudier et combien de temps par jour ?
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quelles heures te conviennent ?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {HEURES_OPTIONS.map((heure) => (
            <button
              key={heure.value}
              type="button"
              onClick={() => handleHeureToggle(heure.value)}
              className={`p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                data.heuresDisponibles.includes(heure.value)
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/25 text-green-800 dark:text-green-200'
                  : 'border-stone-200 dark:border-stone-700 bg-stone-50/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:border-stone-300 dark:hover:border-stone-600'
              }`}
            >
              {heure.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quels jours de la semaine ?
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {JOURS_OPTIONS.map((jour) => (
            <button
              key={jour.value}
              type="button"
              onClick={() => handleJourToggle(jour.value)}
              className={`p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                data.joursParSemaine.includes(jour.value)
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/25 text-green-800 dark:text-green-200'
                  : 'border-stone-200 dark:border-stone-700 bg-stone-50/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:border-stone-300 dark:hover:border-stone-600'
              }`}
            >
              {jour.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Temps par jour : <span className="text-green-700 dark:text-green-400 font-semibold">{formatTemps(data.minutesParJour)}</span>
        </label>
        <input
          type="range"
          min={TEMPS_OPTIONS[0]}
          max={TEMPS_OPTIONS[TEMPS_OPTIONS.length - 1]}
          step={15}
          value={data.minutesParJour}
          onChange={(e) => onChange('minutesParJour', Number(e.target.value))}
          className="w-full accent-green-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          {TEMPS_OPTIONS.map((m) => (
            <span key={m} className={m === data.minutesParJour ? 'text-green-600 font-semibold' : ''}>
              {formatTemps(m)}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-beige-50 dark:bg-gray-800 rounded-xl p-4 border border-beige-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
          Avec <strong className="text-green-700 dark:text-green-400">{formatTemps(data.minutesParJour)}</strong> par jour,{' '}
          {data.joursParSemaine.length} jour{data.joursParSemaine.length > 1 ? 's' : ''} par semaine
          {' '}soit environ <strong className="text-green-700 dark:text-green-400">
            {Math.round((data.minutesParJour * data.joursParSemaine.length) / 60)}h
          </strong> par semaine.
        </p>
      </div>
    </div>
  );
}
