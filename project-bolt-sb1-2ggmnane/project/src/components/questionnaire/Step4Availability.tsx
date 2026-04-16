import { HeureDisponible, JourSemaine, QuestionnaireData } from '../../types/hifz';
import { minutesToLabel, minutesToPagesPerDay } from '../../utils/calculations';

interface Props {
  data: Pick<QuestionnaireData, 'heuresDisponibles' | 'minutesParJour' | 'joursParSemaine'>;
  onChange: (field: string, value: unknown) => void;
}

const HEURES: { value: HeureDisponible; icon: string; label: string; sub: string }[] = [
  { value: 'fajr', icon: '🌅', label: 'Après Fajr', sub: '5h – 7h' },
  { value: 'matin', icon: '☀️', label: 'Matin', sub: '7h – 12h' },
  { value: 'apres-midi', icon: '🌤️', label: 'Après-midi', sub: '12h – 17h' },
  { value: 'soir', icon: '🌙', label: 'Soir', sub: 'Après Maghrib' },
  { value: 'nuit', icon: '🌃', label: 'Nuit', sub: 'Après Icha' },
];

const JOURS: { value: JourSemaine; label: string }[] = [
  { value: 'L', label: 'L' },
  { value: 'M', label: 'M' },
  { value: 'Me', label: 'Me' },
  { value: 'J', label: 'J' },
  { value: 'V', label: 'V ⭐' },
  { value: 'S', label: 'S' },
  { value: 'D', label: 'D' },
];

const MINUTES_STEPS = [15, 30, 45, 60, 90, 120];

export default function Step4Availability({ data, onChange }: Props) {
  const toggleHeure = (h: HeureDisponible) => {
    const current = data.heuresDisponibles;
    const updated = current.includes(h) ? current.filter(x => x !== h) : [...current, h];
    onChange('heuresDisponibles', updated);
  };

  const toggleJour = (j: JourSemaine) => {
    const current = data.joursParSemaine;
    const updated = current.includes(j) ? current.filter(x => x !== j) : [...current, j];
    onChange('joursParSemaine', updated);
  };

  const pages = minutesToPagesPerDay(data.minutesParJour);

  const minutesIndex = MINUTES_STEPS.findIndex(m => m === data.minutesParJour);
  const sliderVal = minutesIndex >= 0 ? minutesIndex : 2;

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-semibold text-[#2c3e2d] text-center mb-2">
        Votre disponibilité
      </h2>
      <p className="text-center text-[#7a8c7b] mb-8 text-sm">
        Planifiez votre programme selon votre rythme
      </p>

      <div className="max-w-lg mx-auto space-y-7">
        <div>
          <p className="font-medium text-[#2c3e2d] mb-3 text-sm">
            À quelle(s) heure(s) êtes-vous disponible ?
          </p>
          <div className="space-y-2">
            {HEURES.map(h => (
              <button
                key={h.value}
                onClick={() => toggleHeure(h.value)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 text-left ${
                  data.heuresDisponibles.includes(h.value)
                    ? 'border-[#2c6e3c] bg-[#2c6e3c]/5'
                    : 'border-[#e0dccf] bg-white hover:border-[#d4a345]/50'
                }`}
              >
                <span className="text-xl">{h.icon}</span>
                <div className="flex-1">
                  <span
                    className={`text-sm font-medium ${
                      data.heuresDisponibles.includes(h.value) ? 'text-[#2c6e3c]' : 'text-[#2c3e2d]'
                    }`}
                  >
                    {h.label}
                  </span>
                  <span className="text-xs text-[#9a9688] ml-2">{h.sub}</span>
                </div>
                {data.heuresDisponibles.includes(h.value) && (
                  <div className="w-5 h-5 rounded-full bg-[#2c6e3c] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#f8f6e9] rounded-2xl p-5 border border-[#e8e4d4]">
          <p className="font-medium text-[#2c3e2d] mb-4 text-sm">Combien de temps par jour ?</p>
          <div className="px-1">
            <input
              type="range"
              min={0}
              max={MINUTES_STEPS.length - 1}
              value={sliderVal}
              onChange={e => onChange('minutesParJour', MINUTES_STEPS[Number(e.target.value)])}
              className="w-full accent-[#2c6e3c] h-2 cursor-pointer"
            />
            <div className="flex justify-between mt-2">
              {MINUTES_STEPS.map((m, i) => (
                <span
                  key={m}
                  className={`text-[10px] ${
                    i === sliderVal ? 'text-[#2c6e3c] font-bold' : 'text-[#b0a898]'
                  }`}
                >
                  {minutesToLabel(m)}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 bg-white rounded-xl p-3 border border-[#e0dccf] text-center">
            <p className="text-xs text-[#7a8c7b]">
              Avec{' '}
              <span className="font-bold text-[#2c6e3c]">{minutesToLabel(data.minutesParJour)}</span>
              /jour vous pouvez mémoriser environ{' '}
              <span className="font-bold text-[#d4a345]">{pages} page{pages > 1 ? 's' : ''}</span>
              /jour
            </p>
          </div>
        </div>

        <div>
          <p className="font-medium text-[#2c3e2d] mb-3 text-sm">Combien de jours par semaine ?</p>
          <div className="flex gap-2 flex-wrap">
            {JOURS.map(j => (
              <button
                key={j.value}
                onClick={() => toggleJour(j.value)}
                className={`flex-1 min-w-[36px] py-2.5 rounded-xl border-2 text-xs font-semibold transition-all duration-200 ${
                  data.joursParSemaine.includes(j.value)
                    ? j.value === 'V'
                      ? 'border-[#d4a345] bg-[#d4a345] text-white'
                      : 'border-[#2c6e3c] bg-[#2c6e3c] text-white'
                    : 'border-[#e0dccf] bg-white text-[#6b7c6c] hover:border-[#d4a345]/50'
                }`}
              >
                {j.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[#9a9688] mt-2 text-center">
            ⭐ Le vendredi : pas de nouvelle page — Al-Kahf recommandée
          </p>
        </div>
      </div>
    </div>
  );
}
