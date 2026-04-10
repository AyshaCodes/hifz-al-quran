import { useLocalStorage } from '../../hooks/useLocalStorage';
import { DailyProgress, UserProfile } from '../../types';
import Dashboard from './Dashboard';
import ProfilForm from './ProfilForm';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function HifzPage() {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('hifz-profile', null);
  const [progress, setProgress] = useLocalStorage<DailyProgress[]>('hifz-progress', []);
  const [kahfReadDates, setKahfReadDates] = useLocalStorage<string[]>('hifz-kahf-read-dates', []);

  const handleCreateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setProgress([]);
  };

  const handleMarkDone = () => {
    const today = getTodayStr();
    const exists = progress.find((p) => p.date === today);
    if (exists) return;

    const newEntry: DailyProgress = {
      date: today,
      pagesDone: 1,
      completed: true,
      lastReviewedAt: today,
    };
    setProgress([...progress, newEntry]);
  };

  const handleMarkTodayReviewed = () => {
    const today = getTodayStr();
    const existing = progress.find((p) => p.date === today);

    if (!existing) {
      const reviewOnlyEntry: DailyProgress = {
        date: today,
        pagesDone: 0,
        completed: false,
        lastReviewedAt: today,
      };
      setProgress([...progress, reviewOnlyEntry]);
      return;
    }

    setProgress(
      progress.map((entry) => (
        entry.date === today ? { ...entry, lastReviewedAt: today } : entry
      ))
    );
  };

  const handleMarkPriorityReviewed = (pages: number[]) => {
    if (pages.length === 0) return;

    const startPage = ((profile?.juzActuel ?? 1) - 1) * 20 + 1;
    const completedSorted = [...progress]
      .filter((p) => p.completed)
      .sort((a, b) => a.date.localeCompare(b.date));

    const pageMap = new Map<number, DailyProgress>();
    completedSorted.forEach((entry, index) => {
      pageMap.set(startPage + index, entry);
    });

    const today = getTodayStr();
    setProgress(
      progress.map((entry) => {
        const hit = pages.some((page) => pageMap.get(page)?.date === entry.date);
        if (!hit) return entry;
        return { ...entry, lastReviewedAt: today };
      })
    );
  };

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser votre programme ? Toutes vos données seront supprimées.')) {
      setProfile(null);
      setProgress([]);
      setKahfReadDates([]);
    }
  };

  const handleMarkKahfRead = () => {
    const today = getTodayStr();
    if (kahfReadDates.includes(today)) return;
    setKahfReadDates([...kahfReadDates, today]);
  };

  if (!profile) {
    return <ProfilForm onSubmit={handleCreateProfile} />;
  }

  return (
    <Dashboard
      profile={profile}
      progress={progress}
      onMarkDone={handleMarkDone}
      onMarkTodayReviewed={handleMarkTodayReviewed}
      onMarkPriorityReviewed={handleMarkPriorityReviewed}
      kahfReadToday={kahfReadDates.includes(getTodayStr())}
      onMarkKahfRead={handleMarkKahfRead}
      onReset={handleReset}
    />
  );
}
