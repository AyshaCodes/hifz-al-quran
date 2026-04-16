import { useState, useEffect } from 'react';
import { HifzProfile, HifzProgress, QuestionnaireData } from '../../types/hifz';
import { loadProfile, saveProfile, loadProgress, saveProgress } from '../../utils/storage';
import { calculateProgramme } from '../../utils/calculations';
import QuestionnaireContainer from '../questionnaire/QuestionnaireContainer';
import ProgramSummary from '../summary/ProgramSummary';
import Dashboard from '../dashboard/Dashboard';

type AppState = 'loading' | 'questionnaire' | 'summary' | 'dashboard';

export default function HifzApp() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [profile, setProfile] = useState<HifzProfile | null>(null);
  const [progress, setProgress] = useState<HifzProgress | null>(null);
  const [pendingProfile, setPendingProfile] = useState<HifzProfile | null>(null);

  useEffect(() => {
    const savedProfile = loadProfile();
    const savedProgress = loadProgress();
    if (savedProfile) {
      setProfile(savedProfile);
      setProgress(savedProgress);
      setAppState('dashboard');
    } else {
      setAppState('questionnaire');
    }
  }, []);

  const handleQuestionnaireComplete = (data: QuestionnaireData) => {
    const programme = calculateProgramme(data);
    const newProfile: HifzProfile = {
      questionnaire: data,
      programme,
      dateCreation: new Date().toISOString(),
      pageActuelle: programme.phase === 'revision_pure' ? 1 : Math.max(1, (data.juzArrive - 1) * 20 + 1),
    };
    setPendingProfile(newProfile);
    setAppState('summary');
  };

  const handleStartDashboard = () => {
    if (!pendingProfile) return;
    const initialProgress = loadProgress();
    saveProfile(pendingProfile);
    saveProgress(initialProgress);
    setProfile(pendingProfile);
    setProgress(initialProgress);
    setAppState('dashboard');
  };

  const handleProgressChange = (updatedProgress: HifzProgress) => {
    setProgress(updatedProgress);
  };

  const handleReset = () => {
    setProfile(null);
    setProgress(null);
    setPendingProfile(null);
    setAppState('questionnaire');
  };

  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-[#f8f6e9] flex items-center justify-center">
        <div className="text-center">
          <div
            className="text-3xl font-bold text-[#2c6e3c] mb-3"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            هِفْظ
          </div>
          <div className="w-6 h-6 border-2 border-[#2c6e3c]/30 border-t-[#2c6e3c] rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (appState === 'questionnaire') {
    return <QuestionnaireContainer onComplete={handleQuestionnaireComplete} />;
  }

  if (appState === 'summary' && pendingProfile) {
    return <ProgramSummary profile={pendingProfile} onStart={handleStartDashboard} />;
  }

  if (appState === 'dashboard' && profile && progress) {
    return (
      <Dashboard
        profile={profile}
        progress={progress}
        onProgressChange={handleProgressChange}
        onReset={handleReset}
      />
    );
  }

  return null;
}
