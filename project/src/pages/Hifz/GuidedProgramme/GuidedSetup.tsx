import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Calendar, User } from 'lucide-react';

interface GuidedProfile {
  name: string;
  level: 'non-arabic' | 'beginner' | 'intermediate' | 'advanced' | 'hafiz';
  pace: 'slow' | 'moderate' | 'intense' | 'custom';
  daysPerWeek: number;
  customPagesPerDay?: number;
  mode: 'guided';
  needsTransliteration: boolean;
  createdAt: string;
}

const LEVELS = [
  {
    value: 'non-arabic' as const,
    label: 'Je ne sais pas lire l\'arabe',
    description: 'Débutant complet, j\'ai besoin d\'apprendre l\'alphabet et la lecture',
    icon: '🔤'
  },
  {
    value: 'beginner' as const,
    label: 'Débutant (lecture)',
    description: 'Je peux lire l\'arabe mais je débute dans la mémorisation',
    icon: '📖'
  },
  {
    value: 'intermediate' as const,
    label: 'Intermédiaire',
    description: 'J\'ai déjà mémorisé quelques pages ou sourates',
    icon: '📚'
  },
  {
    value: 'advanced' as const,
    label: 'Avancé',
    description: 'J\'ai une bonne base de mémorisation',
    icon: '🎯'
  },
  {
    value: 'hafiz' as const,
    label: 'Hafiz (révision)',
    description: 'J\'ai déjà mémorisé le Coran, je veux le réviser',
    icon: '💎'
  }
];

const PACES = [
  {
    value: 'slow' as const,
    label: 'Lent',
    description: '¼ page par jour - Idéal pour les débutants',
    pagesPerDay: 0.25,
    icon: '🐌'
  },
  {
    value: 'moderate' as const,
    label: 'Modéré',
    description: '½ page par jour - Équilibre parfait',
    pagesPerDay: 0.5,
    icon: '🚶'
  },
  {
    value: 'intense' as const,
    label: 'Soutenu',
    description: '1 page par jour - Progression rapide',
    pagesPerDay: 1,
    icon: '🏃'
  },
  {
    value: 'custom' as const,
    label: 'Personnalisé',
    description: 'Choisissez votre propre rythme',
    pagesPerDay: 0,
    icon: '⚙️'
  }
];

export default function GuidedSetup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<GuidedProfile>>({
    name: '',
    level: 'beginner',
    pace: 'moderate',
    daysPerWeek: 5,
    customPagesPerDay: 0.5,
    mode: 'guided',
    needsTransliteration: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profile: GuidedProfile = {
      ...formData as GuidedProfile,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('hifz-guided-profile', JSON.stringify(profile));
    
    // Navigate to guided dashboard
    navigate('/hifz/guided/dashboard');
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-blue-950 dark:via-gray-900 dark:to-blue-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/hifz')}
            className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au choix
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            Configuration du Suivi Guidé
          </h1>
          <p className="text-stone-600 dark:text-stone-300">
            Quelques informations pour personnaliser votre parcours
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name */}
          <div className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200 dark:border-stone-700">
            <label className="flex items-center gap-2 text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">
              <User className="w-5 h-5 text-green-600 dark:text-green-400" />
              Votre prénom
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Entrez votre prénom"
              required
            />
          </div>

          {/* Level Selection */}
          <div className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200 dark:border-stone-700">
            <label className="flex items-center gap-2 text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">
              <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
              Votre niveau actuel
            </label>
            <div className="space-y-3">
              {LEVELS.map((level) => (
                <label
                  key={level.value}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.level === level.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="level"
                    value={level.value}
                    checked={formData.level === level.value}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      level: e.target.value as GuidedProfile['level'],
                      needsTransliteration: e.target.value === 'non-arabic'
                    })}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{level.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-stone-800 dark:text-stone-100">
                        {level.label}
                      </div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        {level.description}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Pace Selection */}
          <div className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200 dark:border-stone-700">
            <label className="flex items-center gap-2 text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              Rythme de mémorisation
            </label>
            <div className="space-y-3">
              {PACES.map((pace) => (
                <label
                  key={pace.value}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.pace === pace.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="pace"
                    value={pace.value}
                    checked={formData.pace === pace.value}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      pace: e.target.value as GuidedProfile['pace']
                    })}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{pace.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-stone-800 dark:text-stone-100">
                        {pace.label}
                      </div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        {pace.description}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Custom pages per day */}
            {formData.pace === 'custom' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Pages par jour (personnalisé)
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0.25"
                  max="5"
                  value={formData.customPagesPerDay}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    customPagesPerDay: parseFloat(e.target.value)
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            )}
          </div>

          {/* Days per week */}
          <div className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200 dark:border-stone-700">
            <label className="flex items-center gap-2 text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              Jours d'étude par semaine
            </label>
            <div className="grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setFormData({ ...formData, daysPerWeek: day })}
                  className={`p-3 rounded-lg border-2 font-medium transition-all ${
                    formData.daysPerWeek === day
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={!formData.name || !formData.level || !formData.pace}
              className="bg-blue-700 hover:bg-blue-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-200 flex items-center gap-2 min-h-[44px]"
            >
              Commencer mon parcours guidé
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
