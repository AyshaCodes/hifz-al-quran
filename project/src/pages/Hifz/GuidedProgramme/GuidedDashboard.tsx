import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, CheckCircle, Clock, Settings, Target, Zap } from 'lucide-react';
import MotivationalQuote from '../shared/MotivationalQuote';

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

interface DailyProgress {
  date: string;
  pagesMemorized: number;
  pagesReviewed: number;
  completed: boolean;
  quality: 'good' | 'partial' | 'hard';
}

export default function GuidedDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<GuidedProfile | null>(null);
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [todayProgress, setTodayProgress] = useState<DailyProgress | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('hifz-guided-profile');
    const savedProgress = localStorage.getItem('hifz-guided-progress');
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    if (profile) {
      const today = new Date().toISOString().split('T')[0];
      const todayData = progress.find(p => p.date === today);
      
      if (!todayData) {
        setTodayProgress({
          date: today,
          pagesMemorized: 0,
          pagesReviewed: 0,
          completed: false,
          quality: 'good'
        });
      } else {
        setTodayProgress(todayData);
      }
    }
  }, [profile, progress]);

  const getPagesPerDay = () => {
    if (!profile) return 0;
    
    const paceMap = {
      slow: 0.25,
      moderate: 0.5,
      intense: 1,
      custom: profile.customPagesPerDay || 0.5
    };
    
    return paceMap[profile.pace];
  };

  const getRevisionPages = () => {
    // Simple revision logic: pages from last 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    return progress
      .filter(p => new Date(p.date) >= threeDaysAgo && p.pagesMemorized > 0)
      .reduce((total, p) => total + p.pagesMemorized, 0);
  };

  const handleMarkComplete = () => {
    if (!todayProgress || !profile) return;
    
    const updatedProgress = {
      ...todayProgress,
      pagesMemorized: getPagesPerDay(),
      pagesReviewed: getRevisionPages(),
      completed: true,
      quality: 'good' as const
    };
    
    const newProgress = [...progress.filter(p => p.date !== todayProgress.date), updatedProgress];
    setProgress(newProgress);
    setTodayProgress(updatedProgress);
    localStorage.setItem('hifz-guided-progress', JSON.stringify(newProgress));
  };

  const handleAdjustPace = () => {
    navigate('/hifz/guided');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-blue-950 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 dark:text-stone-300 mb-4">Aucun profil trouvé</p>
          <button
            onClick={() => navigate('/hifz/guided')}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 mx-auto"
          >
            Créer un profil
          </button>
        </div>
      </div>
    );
  }

  const pagesPerDay = getPagesPerDay();
  const revisionPages = getRevisionPages();
  const isCompleted = todayProgress?.completed || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-stone-100 dark:from-blue-950 via-gray-900 to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/hifz')}
              className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">
              Bienvenue, {profile.name}! 👋
            </h1>
            <p className="text-stone-600 dark:text-stone-300">
              Votre parcours guidé de mémorisation du Coran
            </p>
          </div>
          <button
            onClick={handleAdjustPace}
            className="flex items-center gap-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-4 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700"
          >
            <Settings className="w-4 h-4" />
            Ajuster le rythme
          </button>
        </div>

        {/* Motivational Quote */}
        <MotivationalQuote />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-xl p-4 border border-stone-200 dark:border-stone-700">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-700 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-stone-600 dark:text-stone-400">Objectif quotidien</p>
                <p className="text-xl font-bold text-stone-800 dark:text-stone-100">{pagesPerDay} page(s)</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-xl p-4 border border-stone-200 dark:border-stone-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-stone-600 dark:text-stone-400">Pages à réviser</p>
                <p className="text-xl font-bold text-stone-800 dark:text-stone-100">{revisionPages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-xl p-4 border border-stone-200 dark:border-stone-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-stone-600 dark:text-stone-400">Jours/semaine</p>
                <p className="text-xl font-bold text-stone-800 dark:text-stone-100">{profile.daysPerWeek}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-xl p-4 border border-stone-200 dark:border-stone-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-stone-600 dark:text-stone-400">Niveau</p>
                <p className="text-xl font-bold text-stone-800 dark:text-stone-100 capitalize">{profile.level}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Task */}
        <div className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200 dark:border-stone-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
            Tâche du jour
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div>
                <p className="font-medium text-stone-800 dark:text-stone-100">
                  Pages à mémoriser aujourd'hui : <span className="text-green-700 dark:text-green-400 font-bold">{pagesPerDay}</span>
                </p>
                {profile.needsTransliteration && (
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                    💡 Translittération disponible pour votre niveau
                  </p>
                )}
              </div>
              <BookOpen className="w-8 h-8 text-green-700 dark:text-green-400" />
            </div>

            {revisionPages > 0 && (
              <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div>
                  <p className="font-medium text-stone-800 dark:text-stone-100">
                    Pages à réviser : <span className="text-amber-600 dark:text-amber-400 font-bold">{revisionPages}</span>
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                    Révisions des 3 derniers jours
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleMarkComplete}
              disabled={isCompleted}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isCompleted
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-not-allowed'
                  : 'bg-green-700 hover:bg-green-800 text-white'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Journée complétée ✅
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Valider ma journée
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200 dark:border-stone-700">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            Résumé de votre progression
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-stone-50 dark:bg-stone-900 rounded-xl">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {progress.filter(p => p.completed).length}
              </p>
              <p className="text-sm text-stone-600 dark:text-stone-400">Jours complétés</p>
            </div>
            
            <div className="text-center p-4 bg-stone-50 dark:bg-stone-900 rounded-xl">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {progress.reduce((total, p) => total + p.pagesMemorized, 0)}
              </p>
              <p className="text-sm text-stone-600 dark:text-stone-400">Pages mémorisées</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
