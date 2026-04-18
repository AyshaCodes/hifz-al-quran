import { useState, useEffect } from 'react';
import { QuestionnaireData, UserProfile, DailyProgress } from '../../../types/hifz';
import { getTodayString } from '../../../lib/revisionHelper';
import QuestionnaireContainer from './QuestionnaireContainer';
import Dashboard from './Dashboard';

interface Props {
  onBack: () => void;
}

const PROFILE_KEY = 'hifz-profile';
const PROGRESS_KEY = 'hifz-progress';

function buildProfile(data: QuestionnaireData): UserProfile {
  const juzActuel =
    data.situation === 'debutant'
      ? 1
      : data.departMemorisation === 'juzPrecis'
      ? data.juzArrive
      : data.departMemorisation === 'milieu'
      ? 15
      : 1;

  const quality =
    data.qualiteMemorisation === 'solide'
      ? 'good'
      : data.qualiteMemorisation === 'partielle'
      ? 'partial'
      : 'forgotten';

  let objectifLabel = 'Mémoriser le Coran';
  if (data.objectif === 'nombreJuz') objectifLabel = `${data.nombreJuzObjectif} juz`;
  else if (data.objectif === 'dateButoir') objectifLabel = `Avant le ${data.dateObjectif}`;
  else if (data.objectif === 'revision') objectifLabel = 'Révision complète';

  return {
    prenom: data.prenom || 'Frère/Sœur',
    juzActuel,
    objectif: objectifLabel,
    tempsParJour: data.minutesParJour,
    createdAt: new Date().toISOString(),
    memorizationQuality: quality,
    urgentReviewPages: [],
  };
}

export default function HifzApp({ onBack }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [progress, setProgress] = useState<DailyProgress[]>(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  const handleSubmit = (data: QuestionnaireData) => {
    const newProfile = buildProfile(data);
    setProfile(newProfile);
  };

  const handleMarkDone = (pages: number, quality: 'fluent' | 'hesitant' | 'hard') => {
    const today = getTodayString();
    setProgress((prev) => {
      const filtered = prev.filter((p) => p.date !== today);
      return [
        ...filtered,
        {
          date: today,
          pagesDone: pages,
          completed: true,
          pageQuality: quality,
          sessionSeconds: 0,
          pageNumber: (profile?.juzActuel ?? 1) * 20 + filtered.length,
        },
      ];
    });
  };

  const handleReset = () => {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    setProfile(null);
    setProgress([]);
  };

  if (!profile) {
    return <QuestionnaireContainer onSubmit={handleSubmit} onBack={onBack} />;
  }

  return (
    <Dashboard
      profile={profile}
      progress={progress}
      onMarkDone={handleMarkDone}
      onReset={handleReset}
    />
  );
}
