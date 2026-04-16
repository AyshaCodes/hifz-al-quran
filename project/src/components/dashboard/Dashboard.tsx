import { useState } from 'react';
import { HifzProfile, HifzProgress } from '../../types/hifz';
import { formatDuration, getPagesThisMonth } from '../../utils/calculations';
import { saveProgress } from '../../utils/storage';

interface Props {
  profile: HifzProfile;
  progress: HifzProgress;
  onProgressChange: (progress: HifzProgress) => void;
  onReset: () => void;
}

export default function Dashboard({ profile, progress, onProgressChange, onReset }: Props) {
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  const today = new Date().toISOString().split('T')[0];
  const todayProgress = progress.jours.find(j => j.date === today);

  const handleStartSession = () => {
    setSessionStartTime(Date.now());
    setSessionSeconds(0);
  };

  const handleStopSession = () => {
    if (sessionStartTime) {
      const totalSeconds = sessionSeconds + Math.floor((Date.now() - sessionStartTime) / 1000);
      const updatedProgress = {
        ...progress,
        jours: progress.jours.map(j => 
          j.date === today 
            ? { ...j, dureeSession: j.dureeSession + totalSeconds }
            : j
        ),
      };
      
      if (!todayProgress) {
        updatedProgress.jours.push({
          date: today,
          pageFaite: false,
          pageRevisee: false,
          dureeSession: totalSeconds,
        });
      }
      
      saveProgress(updatedProgress);
      onProgressChange(updatedProgress);
      setSessionStartTime(null);
      setSessionSeconds(0);
    }
  };

  const handleMarkPageDone = () => {
    const updatedProgress = {
      ...progress,
      jours: progress.jours.map(j => 
        j.date === today 
          ? { ...j, pageFaite: true }
          : j
      ),
      pagesCompletees: progress.pagesCompletees + 1,
    };
    
    if (!todayProgress) {
      updatedProgress.jours.push({
        date: today,
        pageFaite: true,
        pageRevisee: false,
        dureeSession: sessionSeconds,
      });
    }
    
    saveProgress(updatedProgress);
    onProgressChange(updatedProgress);
  };

  const handleMarkRevisionDone = () => {
    const updatedProgress = {
      ...progress,
      jours: progress.jours.map(j => 
        j.date === today 
          ? { ...j, pageRevisee: true }
          : j
      ),
    };
    
    if (!todayProgress) {
      updatedProgress.jours.push({
        date: today,
        pageFaite: false,
        pageRevisee: true,
        dureeSession: sessionSeconds,
      });
    }
    
    saveProgress(updatedProgress);
    onProgressChange(updatedProgress);
  };

  const getPhaseLabel = () => {
    switch (profile.programme.phase) {
      case 'memorisation': return 'Mémorisation';
      case 'revision': return 'Révision';
      case 'revision_pure': return 'Révision intensive';
      default: return profile.programme.phase;
    }
  };

  const getCompletionPercentage = () => {
    return Math.round((progress.pagesCompletees / profile.programme.pagesTotal) * 100);
  };

  return (
    <div className="min-h-screen bg-[#f8f6e9] flex flex-col">
      <div className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="text-3xl font-bold text-[#2c6e3c] mb-2"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              هِفْظ
            </div>
            <h1 className="text-xl font-semibold text-[#4a6b4b]">
              Tableau de bord - {profile.questionnaire.prenom}
            </h1>
            <p className="text-[#7a8c7b] mt-1">
              Phase : {getPhaseLabel()} | {profile.programme.pagesParJour} pages/jour
            </p>
          </div>

          {/* Stats principales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8e4d4] p-6 text-center">
              <div className="text-3xl font-bold text-[#2c6e3c]">{progress.pagesCompletees}</div>
              <div className="text-sm text-[#7a8c7b] mt-1">Pages complétées</div>
              <div className="text-xs text-[#7a8c7b] mt-2">
                {getPagesThisMonth(progress.jours)} ce mois
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8e4d4] p-6 text-center">
              <div className="text-3xl font-bold text-[#2c6e3c]">{progress.joursConsecutifs}</div>
              <div className="text-sm text-[#7a8c7b] mt-1">Jours consécutifs</div>
              <div className="text-xs text-[#7a8c7b] mt-2">
                🎯 Objectif quotidien
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8e4d4] p-6 text-center">
              <div className="text-3xl font-bold text-[#2c6e3c]">{getCompletionPercentage()}%</div>
              <div className="text-sm text-[#7a8c7b] mt-1">Progression totale</div>
              <div className="text-xs text-[#7a8c7b] mt-2">
                {profile.programme.pagesRestantes} pages restantes
              </div>
            </div>
          </div>

          {/* Session du jour */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8e4d4] p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#2c3e2d] mb-4">
              📖 Session du jour
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-[#7a8c7b] mb-2">Chronomètre</div>
                <div className="text-2xl font-mono font-bold text-[#2c6e3c]">
                  {formatDuration(sessionSeconds)}
                </div>
                
                <div className="flex gap-2 mt-4">
                  {!sessionStartTime ? (
                    <button
                      onClick={handleStartSession}
                      className="px-4 py-2 bg-[#2c6e3c] text-white rounded-lg hover:bg-[#235630] transition-colors"
                    >
                      ▶️ Démarrer
                    </button>
                  ) : (
                    <button
                      onClick={handleStopSession}
                      className="px-4 py-2 bg-[#e74c3c] text-white rounded-lg hover:bg-[#c0392b] transition-colors"
                    >
                      ⏸️ Arrêter
                    </button>
                  )}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-[#7a8c7b] mb-2">Tâches du jour</div>
                <div className="space-y-2">
                  <button
                    onClick={handleMarkPageDone}
                    disabled={todayProgress?.pageFaite}
                    className={`
                      w-full px-4 py-2 rounded-lg text-left transition-colors
                      ${todayProgress?.pageFaite
                        ? 'bg-[#d4edda] text-[#155724] cursor-not-allowed'
                        : 'bg-[#f8f6e9] hover:bg-[#e8e4d4] text-[#2c3e2d]'
                      }
                    `}
                  >
                    {todayProgress?.pageFaite ? '✅' : '⭕'} Page du jour
                  </button>
                  
                  <button
                    onClick={handleMarkRevisionDone}
                    disabled={todayProgress?.pageRevisee}
                    className={`
                      w-full px-4 py-2 rounded-lg text-left transition-colors
                      ${todayProgress?.pageRevisee
                        ? 'bg-[#d4edda] text-[#155724] cursor-not-allowed'
                        : 'bg-[#f8f6e9] hover:bg-[#e8e4d4] text-[#2c3e2d]'
                      }
                    `}
                  >
                    {todayProgress?.pageRevisee ? '✅' : '⭕'} Révision du jour
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <button
              onClick={onReset}
              className="px-6 py-3 border-2 border-[#e74c3c] text-[#e74c3c] rounded-lg hover:bg-[#e74c3c] hover:text-white transition-colors"
            >
              🔄 Réinitialiser mon programme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
