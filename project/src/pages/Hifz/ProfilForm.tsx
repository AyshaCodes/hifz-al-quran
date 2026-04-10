import { BookOpen, Calendar, ChevronRight, Clock, Star } from 'lucide-react';
import { useState } from 'react';
import { UserProfile } from '../../types';

interface ProfilFormProps {
  onSubmit: (profile: UserProfile) => void;
}

export default function ProfilForm({ onSubmit }: ProfilFormProps) {
  const [prenom, setPrenom] = useState('');
  const [juzActuel, setJuzActuel] = useState(1);
  const [objectif, setObjectif] = useState('');
  const [tempsParJour, setTempsParJour] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom.trim() || !objectif) return;

    const profile: UserProfile = {
      prenom: prenom.trim(),
      juzActuel,
      objectif,
      tempsParJour,
      createdAt: new Date().toISOString(),
    };
    onSubmit(profile);
  };

  const formatTime = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`;
  };

  const minDate = new Date();
  minDate.setMonth(minDate.getMonth() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-beige-100 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="card overflow-hidden animate-slide-up">
          <div className="green-gradient p-8 text-center text-white">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gold-300" />
            </div>
            <h1 className="font-arabic text-3xl mb-2">بِرْنَامَجُ الْحِفْظ</h1>
            <p className="font-amiri text-xl text-gold-300 mb-1">Programme de Mémorisation</p>
            <p className="text-primary-200 text-sm">
              Créez votre programme personnalisé
            </p>
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
                className="w-full px-4 py-3 bg-beige-50 dark:bg-gray-800 border border-beige-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-700 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Star className="w-4 h-4 inline mr-1 text-gold-400" />
                Juz actuel (là où vous en êtes)
              </label>
              <select
                value={juzActuel}
                onChange={(e) => setJuzActuel(Number(e.target.value))}
                className="w-full px-4 py-3 bg-beige-50 dark:bg-gray-800 border border-beige-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-700 transition-all"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                  <option key={j} value={j}>
                    Juz {j} {j === 30 ? '(Al-Amma)' : j === 1 ? '(Al-Fatiha)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1 text-primary-500" />
                Objectif — Date de fin souhaitée
              </label>
              <input
                type="date"
                value={objectif}
                onChange={(e) => setObjectif(e.target.value)}
                min={minDateStr}
                required
                className="w-full px-4 py-3 bg-beige-50 dark:bg-gray-800 border border-beige-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-700 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Clock className="w-4 h-4 inline mr-1 text-primary-500" />
                Temps disponible par jour:{' '}
                <span className="text-primary-600 dark:text-primary-400 font-semibold">
                  {formatTime(tempsParJour)}
                </span>
              </label>
              <input
                type="range"
                min={15}
                max={120}
                step={15}
                value={tempsParJour}
                onChange={(e) => setTempsParJour(Number(e.target.value))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>15 min</span>
                <span>30 min</span>
                <span>45 min</span>
                <span>1h</span>
                <span>1h30</span>
                <span>2h</span>
              </div>
            </div>

            <div className="bg-beige-50 dark:bg-gray-800 rounded-xl p-4 border border-beige-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Avec <strong className="text-primary-600 dark:text-primary-400">{formatTime(tempsParJour)}</strong> par jour,
                vous pouvez mémoriser environ{' '}
                <strong className="text-primary-600 dark:text-primary-400">
                  {Math.max(1, Math.floor(tempsParJour / 20))} page{tempsParJour >= 20 ? 's' : ''}
                </strong>{' '}
                du Coran par jour.
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
