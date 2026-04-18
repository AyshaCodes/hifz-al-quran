import { BookOpen, Calendar, ChevronRight, Clock, Star } from 'lucide-react';
import { useState } from 'react';
import {
  formatPagesFr,
  formatTempsCourt,
  getPagesPerDayFromMinutes,
  TEMPS_JOUR_STEPS,
} from '../../../lib/hifzPace';
import { addDaysISO, getTodayStr } from '../../../lib/hifzSchedule';
import { MemorizationQuality, UserProfile } from '../../../types';

interface ProfilFormProps {
  onSubmit: (profile: UserProfile) => void;
}

const MEMO_OPTIONS: {
  value: MemorizationQuality;
  emoji: string;
  title: string;
  desc: string;
}[] = [
  {
    value: 'good',
    emoji: '🟢',
    title: 'Je me souviens bien',
    desc: 'Révision légère : viser environ 1 Juz tous les 3 jours dans votre planning.',
  },
  {
    value: 'partial',
    emoji: '🟡',
    title: 'Je me souviens partiellement',
    desc: 'Révision intensive : 1 Juz par jour en cible, la moitié du temps quotidien réservée à la révision des Juz appris.',
  },
  {
    value: 'forgotten',
    emoji: '🔴',
    title: "J'ai beaucoup oublié",
    desc: 'Phase de consolidation : 1 mois de révision uniquement, sans nouvelle mémorisation.',
  },
];

export default function ProfilForm({ onSubmit }: ProfilFormProps) {
  const [prenom, setPrenom] = useState('');
  const [juzActuel, setJuzActuel] = useState(1);
  const [objectif, setObjectif] = useState('');
  const [tempsParJour, setTempsParJour] = useState<number>(30);
  const [memorizationQuality, setMemorizationQuality] = useState<MemorizationQuality>('good');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom.trim() || !objectif) return;

    const today = getTodayStr();
    const revisionOnlyUntil =
      memorizationQuality === 'forgotten' ? addDaysISO(today, 30) : undefined;

    const profile: UserProfile = {
      prenom: prenom.trim(),
      juzActuel,
      objectif,
      tempsParJour,
      createdAt: new Date().toISOString(),
      memorizationQuality,
      revisionOnlyUntil,
      urgentReviewPages: [],
    };
    onSubmit(profile);
  };

  const minDate = new Date();
  minDate.setMonth(minDate.getMonth() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const pagesPreview = getPagesPerDayFromMinutes(tempsParJour);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-blue-950 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-stone-200 dark:border-stone-700 animate-slide-up">
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-8 text-center text-white">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-green-100" />
            </div>
            <h1 className="font-arabic text-3xl mb-2">بِرْنَامَجُ الْحِفْظ</h1>
            <p className="font-amiri text-xl text-green-100 mb-1">Programme de Mémorisation</p>
            <p className="text-green-100 text-sm">Créez votre programme personnalisé</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prénom
              </label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Votre prénom..."
                required
                className="w-full px-4 py-3 bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-stone-700 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Star className="w-4 h-4 inline mr-1 text-green-600 dark:text-green-400" />
                Juz actuel (là où vous en êtes)
              </label>
              <select
                value={juzActuel}
                onChange={(e) => setJuzActuel(Number(e.target.value))}
                className="w-full px-4 py-3 bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-stone-700 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700 transition-all"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                  <option key={j} value={j}>
                    Juz {j} {j === 30 ? '(Al-Amma)' : j === 1 ? '(Al-Fatiha)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comment évaluez-vous votre mémorisation des Juz déjà acquis ?
              </p>
              <div className="space-y-2">
                {MEMO_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMemorizationQuality(opt.value)}
                    className={`w-full text-left rounded-xl border-2 p-3 transition-all ${
                      memorizationQuality === opt.value
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
              {memorizationQuality === 'forgotten' && (
                <div className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 p-3 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  L&apos;Ustadh conseille : consolide d&apos;abord ce que tu as, c&apos;est plus précieux
                  que d&apos;avancer sur du fragile 🤍
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1 text-green-600 dark:text-green-400" />
                Objectif — Date de fin souhaitée
              </label>
              <input
                type="date"
                value={objectif}
                onChange={(e) => setObjectif(e.target.value)}
                min={minDateStr}
                required
                className="w-full px-4 py-3 bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-stone-700 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Clock className="w-4 h-4 inline mr-1 text-green-600 dark:text-green-400" />
                Temps disponible par jour :{' '}
                <span className="text-green-700 dark:text-green-400 font-semibold">
                  {formatTempsCourt(tempsParJour)}
                </span>
              </label>
              <input
                type="range"
                min={TEMPS_JOUR_STEPS[0]}
                max={TEMPS_JOUR_STEPS[TEMPS_JOUR_STEPS.length - 1]}
                step={15}
                value={tempsParJour}
                onChange={(e) => setTempsParJour(Number(e.target.value))}
                className="w-full accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                {TEMPS_JOUR_STEPS.map((m) => (
                  <span key={m} className={m === tempsParJour ? 'text-primary-600 font-semibold' : ''}>
                    {m < 60 ? `${m}m` : m === 60 ? '1h' : m === 90 ? '1h30' : '2h'}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 leading-relaxed bg-beige-50 dark:bg-gray-800/80 rounded-lg p-3 border border-beige-200 dark:border-gray-700">
                Ce temps inclut <strong>mémorisation et révision</strong>. La révision est aussi
                importante que la mémorisation — ne jamais l&apos;oublier.
              </p>
            </div>

            <div className="bg-beige-50 dark:bg-gray-800 rounded-xl p-4 border border-beige-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                Avec <strong className="text-primary-600 dark:text-primary-400">{formatTempsCourt(tempsParJour)}</strong> par jour, rythme indicatif : environ{' '}
                <strong className="text-primary-600 dark:text-primary-400">{formatPagesFr(pagesPreview)}</strong> du Mushaf par jour
                {memorizationQuality === 'partial' ? (
                  <>
                    {' '}
                    pour la <strong>nouvelle</strong> mémorisation (la moitié du temps reste pour la
                    révision des Juz appris).
                  </>
                ) : memorizationQuality === 'forgotten' ? (
                  <> pendant la phase normale — les 30 premiers jours seront consacrés à la révision.</>
                ) : (
                  <> (mémorisation et révision comprises dans le même créneau).</>
                )}
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 text-base shadow-lg"
            >
              Créer mon programme
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
