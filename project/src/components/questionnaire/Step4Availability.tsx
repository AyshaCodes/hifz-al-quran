import { HeureDisponible, JourSemaine } from '../../types/hifz';

interface Props {
  data: {
    heuresDisponibles: HeureDisponible[];
    minutesParJour: number;
    joursParSemaine: JourSemaine[];
  };
  onChange: (field: string, value: unknown) => void;
}

export default function Step4Availability({ data, onChange }: Props) {
  const heures: { value: HeureDisponible; label: string; icon: string }[] = [
    { value: 'fajr', label: 'Fajr', icon: '🌅' },
    { value: 'matin', label: 'Matin', icon: '☀️' },
    { value: 'apres-midi', label: 'Après-midi', icon: '🌤️' },
    { value: 'soir', label: 'Soir', icon: '🌆' },
    { value: 'nuit', label: 'Nuit', icon: '🌙' },
  ];

  const jours: { value: JourSemaine; label: string }[] = [
    { value: 'L', label: 'Lundi' },
    { value: 'M', label: 'Mardi' },
    { value: 'Me', label: 'Mercredi' },
    { value: 'J', label: 'Jeudi' },
    { value: 'V', label: 'Vendredi' },
    { value: 'S', label: 'Samedi' },
    { value: 'D', label: 'Dimanche' },
  ];

  const tempsOptions = [15, 30, 45, 60, 90, 120];

  const handleHeureToggle = (heure: HeureDisponible) => {
    const nouvellesHeures = data.heuresDisponibles.includes(heure)
      ? data.heuresDisponibles.filter(h => h !== heure)
      : [...data.heuresDisponibles, heure];
    onChange('heuresDisponibles', nouvellesHeures);
  };

  const handleJourToggle = (jour: JourSemaine) => {
    const nouveauxJours = data.joursParSemaine.includes(jour)
      ? data.joursParSemaine.filter(j => j !== jour)
      : [...data.joursParSemaine, jour];
    onChange('joursParSemaine', nouveauxJours);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Vos disponibilités
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quelles sont vos heures préférées pour le Hifz ?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {heures.map((heure) => (
            <button
              key={heure.value}
              onClick={() => handleHeureToggle(heure.value)}
              className={`
                p-3 rounded-xl border-2 transition-all text-center card
                ${data.heuresDisponibles.includes(heure.value)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-beige-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }
              `}
            >
              <div className="text-2xl mb-1">{heure.icon}</div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{heure.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Combien de temps par jour ?
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {tempsOptions.map((temps) => (
            <button
              key={temps}
              onClick={() => onChange('minutesParJour', temps)}
              className={`
                p-3 rounded-xl border-2 transition-all text-center card
                ${data.minutesParJour === temps
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-beige-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }
              `}
            >
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {temps < 60 ? `${temps} min` : temps === 60 ? '1h' : '2h'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quels jours de la semaine ?
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {jours.map((jour) => (
            <button
              key={jour.value}
              onClick={() => handleJourToggle(jour.value)}
              className={`
                p-3 rounded-xl border-2 transition-all text-center card
                ${data.joursParSemaine.includes(jour.value)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-beige-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }
              `}
            >
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{jour.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
