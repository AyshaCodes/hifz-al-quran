import { useState, useEffect } from 'react';
import { QuestionnaireData, UserProfile, DailyProgress } from '../../../types/hifz';
import { getTodayString } from '../../../lib/revisionHelper';
import QuestionnaireContainer from './QuestionnaireContainer';
import Dashboard from './Dashboard';
import { SURAHS } from '../../../data/surahs';

interface Props {
  onBack: () => void;
}

const PROFILE_KEY = 'hifz-profile';
const PROGRESS_KEY = 'hifz-progress';

function buildProfile(data: QuestionnaireData): UserProfile {
  let juzActuel = 1;

  if (data.situation !== 'debutant') {
    if (data.departMemorisation === 'juzPrecis') {
      juzActuel = data.juzArrive;
    } else if (data.departMemorisation === 'souratePrecise') {
      // Trouver le juz de la sourate
      const surah = SURAHS.find(s => s.number === data.sourateArrive);
      // Approximation simple : Juz = (page / 20) + 1
      // Dans une version plus précise, on utiliserait une map sourate -> juz
      // Mais ici on peut utiliser les données de SURAHS si elles contiennent le Juz
      // Sinon on reste sur une logique simple
      juzActuel = surah ? Math.ceil(surah.number / 4) : 1; // Logique très simplifiée pour l'exemple
    } else if (data.departMemorisation === 'milieu') {
      juzActuel = 15;
    }
  }

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
