import { useState, useEffect } from 'react';
import { GuidedProfile, DailyProgress } from '../../../types/hifz';
import { getTodayString } from '../../../lib/revisionHelper';
import GuidedSetup from './GuidedSetup';
import GuidedDashboard from './GuidedDashboard';

interface Props {
  onBack: () => void;
}

const PROFILE_KEY = 'hifz-guided-profile';
const PROGRESS_KEY = 'hifz-guided-progress';

export default function GuidedApp({ onBack }: Props) {
  const [profile, setProfile] = useState<GuidedProfile | null>(() => {
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

  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  const handleSubmit = (p: GuidedProfile) => {
    setProfile(p);
    setAdjusting(false);
  };

  const handleMarkDone = (pages: number) => {
    const today = getTodayString();
    setProgress((prev) => {
      const filtered = prev.filter((p) => p.date !== today);
      return [
        ...filtered,
        {
          date: today,
          pagesDone: pages,
          completed: true,
          sessionSeconds: 0,
          pageNumber: filtered.length + 1,
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

  if (!profile || adjusting) {
    return (
      <GuidedSetup
        onSubmit={handleSubmit}
        onBack={adjusting ? () => setAdjusting(false) : onBack}
        existingProfile={profile}
      />
    );
  }

  return (
    <GuidedDashboard
      profile={profile}
      progress={progress}
      onMarkDone={handleMarkDone}
      onAdjust={() => setAdjusting(true)}
      onReset={handleReset}
    />
  );
}
