import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import {
  addDaysISO,
  getCurrentTargetPage,
  getDailyMemoGoal,
  getTodayStr,
} from '../../../lib/hifzSchedule';
import { DailyProgress, PageQuality, UserProfile } from '../../../types';
import Dashboard from './Dashboard';
import QuestionnaireContainer from './QuestionnaireContainer';

export default function HifzPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('hifz-profile', null);
  const openReaderFromHifz = (page: number, pages?: number[]) => {
    const params = new URLSearchParams();
    params.set('from', 'hifz');
    params.set('page', String(page));
    if (pages && pages.length > 0) {
      params.set('pages', pages.join(','));
    }
    navigate(`/lire?${params.toString()}`);
  };

  const handleResumeReader = () => {
    const saved = localStorage.getItem('lire-last-position');
    if (!saved) {
      const fallbackPage = profile ? getCurrentTargetPage(profile, progress) : 1;
      openReaderFromHifz(fallbackPage);
      return;
    }
    try {
      const parsed = JSON.parse(saved) as { page?: number };
      openReaderFromHifz(parsed.page ?? 1);
    } catch {
      openReaderFromHifz(1);
    }
  };

  const [progress, setProgress] = useLocalStorage<DailyProgress[]>('hifz-progress', []);
  const [kahfReadDates, setKahfReadDates] = useLocalStorage<string[]>('hifz-kahf-read-dates', []);

  const handleCreateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setProgress([]);
  };

  const handleMarkDoneWithQuality = (quality: PageQuality) => {
    if (!profile) return;
    const today = getTodayStr();
    const goal = getDailyMemoGoal(profile, today);
    if (goal <= 0) return;

    const targetPage = getCurrentTargetPage(profile, progress);

    if (quality === 'hard') {
      setProgress((prev) => {
        const existing = prev.find((p) => p.date === today);
        const rest = prev.filter((p) => p.date !== today);
        return [
          ...rest,
          {
            date: today,
            completed: false,
            pagesDone: existing?.pagesDone ?? 0,
            pageQuality: 'hard',
            lastReviewedAt: today,
            sessionSeconds: existing?.sessionSeconds ?? 0,
          },
        ];
      });
      return;
    }

    let urgent = [...(profile.urgentReviewPages ?? [])];
    if (quality === 'hesitant' && !urgent.includes(targetPage)) {
      urgent.push(targetPage);
    }
    if (quality === 'fluent') {
      urgent = urgent.filter((p) => p !== targetPage);
    }

    setProfile((prev) =>
      prev ? { ...prev, urgentReviewPages: urgent } : null
    );

    setProgress((prev) => {
      const existing = prev.find((p) => p.date === today);
      const sessionKeep = existing?.sessionSeconds ?? 0;
      const newEntry: DailyProgress = {
        date: today,
        pagesDone: goal,
        completed: true,
        lastReviewedAt: today,
        pageQuality: quality,
        sessionSeconds: sessionKeep,
      };
      if (existing) {
        return prev.map((p) => (p.date === today ? { ...newEntry, sessionSeconds: Math.max(sessionKeep, p.sessionSeconds ?? 0) } : p));
      }
      return [...prev, newEntry];
    });
  };

  const handleSessionSeconds = (seconds: number) => {
    const today = getTodayStr();
    setProgress((prev) => {
      const existing = prev.find((p) => p.date === today);
      if (existing) {
        return prev.map((p) =>
          p.date === today ? { ...p, sessionSeconds: Math.max(p.sessionSeconds ?? 0, seconds) } : p
        );
      }
      return [
        ...prev,
        {
          date: today,
          pagesDone: 0,
          completed: false,
          sessionSeconds: seconds,
        },
      ];
    });
  };

  const handleMarkTodayReviewed = () => {
    const today = getTodayStr();
    setProgress((prev) => {
      const existing = prev.find((p) => p.date === today);
      if (!existing) {
        return [
          ...prev,
          {
            date: today,
            pagesDone: 0,
            completed: false,
            lastReviewedAt: today,
          },
        ];
      }
      return prev.map((entry) =>
        entry.date === today ? { ...entry, lastReviewedAt: today } : entry
      );
    });
  };

  const handleMarkPriorityReviewed = (pages: number[]) => {
    if (!profile || pages.length === 0) return;

    const startPage = ((profile.juzActuel ?? 1) - 1) * 20 + 1;
    const completedSorted = [...progress]
      .filter((p) => p.completed)
      .sort((a, b) => a.date.localeCompare(b.date));

    const pageMap = new Map<number, DailyProgress>();
    completedSorted.forEach((entry, index) => {
      pageMap.set(startPage + index, entry);
    });

    const today = getTodayStr();
    setProgress((prev) =>
      prev.map((entry) => {
        const hit = pages.some((page) => pageMap.get(page)?.date === entry.date);
        if (!hit) return entry;
        return { ...entry, lastReviewedAt: today };
      })
    );

    setProfile((prev) =>
      prev
        ? {
            ...prev,
            urgentReviewPages: (prev.urgentReviewPages ?? []).filter((p) => !pages.includes(p)),
          }
        : null
    );
  };

  const handleActivateTenJuzConsolidation = () => {
    const today = getTodayStr();
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            revisionOnlyUntil: addDaysISO(today, 30),
            tenJuzDismissed: true,
          }
        : null
    );
  };

  const handleDismissTenJuzHint = () => {
    setProfile((prev) => (prev ? { ...prev, tenJuzDismissed: true } : null));
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Êtes-vous sûr de vouloir réinitialiser votre programme ? Toutes vos données seront supprimées.'
      )
    ) {
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
    return <QuestionnaireContainer onSubmit={handleCreateProfile} />;
  }

  return (
    <Dashboard
      profile={profile}
      progress={progress}
      onMarkDoneWithQuality={handleMarkDoneWithQuality}
      onSessionSeconds={handleSessionSeconds}
      onMarkTodayReviewed={handleMarkTodayReviewed}
      onMarkPriorityReviewed={handleMarkPriorityReviewed}
      onActivateTenJuzConsolidation={handleActivateTenJuzConsolidation}
      onDismissTenJuzHint={handleDismissTenJuzHint}
      kahfReadToday={kahfReadDates.includes(getTodayStr())}
      onMarkKahfRead={handleMarkKahfRead}
      onReset={handleReset}
      onOpenReaderPage={(page) => openReaderFromHifz(page)}
      onOpenReaderPages={(pages) => openReaderFromHifz(pages[0] ?? 1, pages)}
      onResumeReader={handleResumeReader}
    />
  );
}
