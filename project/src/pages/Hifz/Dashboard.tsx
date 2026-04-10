import { AlertTriangle, BookOpen, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';
import { SURAHS } from '../../data/surahs';
import { DailyProgress, UserProfile } from '../../types';
import ProgressChart from './ProgressChart';
import StatCards from './StatCards';
import TodayTask from './TodayTask';
import WeeklyCalendar from './WeeklyCalendar';

interface DashboardProps {
  profile: UserProfile;
  progress: DailyProgress[];
  onMarkDone: () => void;
  onMarkTodayReviewed: () => void;
  onMarkPriorityReviewed: (pages: number[]) => void;
  kahfReadToday: boolean;
  onMarkKahfRead: () => void;
  onReset: () => void;
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function isFridayToday() {
  return new Date().getDay() === 5;
}

function computeStreak(progress: DailyProgress[]) {
  const sorted = [...progress]
    .filter((p) => p.completed)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) return 0;

  const today = getTodayStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (sorted[0].date !== today && sorted[0].date !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    prev.setDate(prev.getDate() - 1);
    if (prev.toISOString().split('T')[0] === curr.toISOString().split('T')[0]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function getUnrevisedPages(progress: DailyProgress[], juzActuel: number) {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const startPage = (juzActuel - 1) * 20 + 1;
  const completedSorted = [...progress]
    .filter((p) => p.completed)
    .sort((a, b) => a.date.localeCompare(b.date));

  return completedSorted
    .map((entry, index) => ({
      page: startPage + index,
      reviewedAt: entry.lastReviewedAt ?? entry.date,
    }))
    .filter((entry) => new Date(entry.reviewedAt) < threeDaysAgo)
    .slice(-5)
    .map((entry) => entry.page);
}

function getCurrentTargetPage(profile: UserProfile, doneCount: number) {
  const startPage = (profile.juzActuel - 1) * 20 + 1;
  return startPage + doneCount;
}

function getSurahNameForPage(page: number) {
  let pageCursor = 1;
  for (const surah of SURAHS) {
    const endPage = pageCursor + surah.pages - 1;
    if (page >= pageCursor && page <= endPage) {
      return `Sourate ${surah.number} — ${surah.nameTranslit}`;
    }
    pageCursor = endPage + 1;
  }
  return 'Sourate en cours';
}

export default function Dashboard({
  profile,
  progress,
  onMarkDone,
  onMarkTodayReviewed,
  onMarkPriorityReviewed,
  kahfReadToday,
  onMarkKahfRead,
  onReset,
}: DashboardProps) {
  const today = getTodayStr();
  const todayProgress = progress.find((p) => p.date === today) ?? null;

  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const pagesThisMonth = progress.filter((p) => {
      const d = new Date(p.date);
      return p.completed && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    const totalDone = progress.filter((p) => p.completed).length;
    const juzCompleted = Math.floor(totalDone / 20);
    const streakDays = computeStreak(progress);
    const pagesPerDay = totalDone > 0
      ? totalDone / Math.max(1, Math.ceil((new Date().getTime() - new Date(profile.createdAt).getTime()) / 86400000))
      : 0;

    return { pagesThisMonth, juzCompleted, streakDays, pagesPerDay };
  }, [progress, profile]);

  const totalDone = progress.filter((p) => p.completed).length;
  const targetPage = getCurrentTargetPage(profile, totalDone);
  const targetSurah = getSurahNameForPage(targetPage);
  const unrevisedPages = getUnrevisedPages(progress, profile.juzActuel);
  const reviewedToday = todayProgress?.lastReviewedAt === today;

  const daysUntilObjectif = Math.ceil(
    (new Date(profile.objectif).getTime() - new Date().getTime()) / 86400000
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5 animate-fade-in">
      <div className="card green-gradient text-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary-200 text-sm mb-1">Bienvenue</p>
            <h1 className="font-amiri text-3xl font-bold text-white">
              {profile.prenom}
            </h1>
            <p className="text-primary-200 text-sm mt-2">
              {daysUntilObjectif > 0
                ? `Objectif dans ${daysUntilObjectif} jours`
                : 'Objectif atteint ! Ma sha\'Allah !'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-arabic text-2xl text-gold-300">بِسْمِ اللَّه</p>
            <p className="text-primary-200 text-xs mt-1">Juz {profile.juzActuel}</p>
          </div>
        </div>
      </div>

      <StatCards stats={stats} />

      {isFridayToday() && (
        <div className="card p-5 bg-gradient-to-r from-primary-700 to-primary-800 border border-primary-600 animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-gold-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white flex items-center gap-2">
                Aujourd'hui c'est vendredi — Lis Al-Kahf
              </h3>
              <p className="text-primary-100 text-sm mt-1">
                Pas de nouvelle page aujourd'hui.
              </p>
              <button
                onClick={onMarkKahfRead}
                disabled={kahfReadToday}
                className={`mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  kahfReadToday
                    ? 'bg-white/20 text-white cursor-default'
                    : 'bg-gold-400 hover:bg-gold-300 text-gray-900'
                }`}
              >
                {kahfReadToday ? 'Al-Kahf lu' : 'Al-Kahf lu ✓'}
              </button>
            </div>
          </div>
        </div>
      )}

      <TodayTask
        targetPage={targetPage}
        targetSurah={targetSurah}
        reviewedToday={reviewedToday}
        todayProgress={todayProgress}
        onMarkDone={onMarkDone}
        onMarkReviewed={onMarkTodayReviewed}
      />

      <WeeklyCalendar progress={progress} />

      {unrevisedPages.length > 0 && (
        <div className="card p-5 border-l-4 border-l-amber-400 bg-amber-50 dark:bg-amber-900/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                Règle des 3 jours — Révision nécessaire
              </h3>
              <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">
                Pages à réviser en priorité : {unrevisedPages.map((p) => `Page ${p}`).join(', ')}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {unrevisedPages.map((p) => (
                  <span
                    key={p}
                    className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs px-2.5 py-1 rounded-full font-medium"
                  >
                    Page {p}
                  </span>
                ))}
              </div>
              <button
                onClick={() => onMarkPriorityReviewed(unrevisedPages)}
                className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Marquer comme révisé
              </button>
            </div>
          </div>
        </div>
      )}

      <ProgressChart progress={progress} />

      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              Paramètres du programme
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Juz {profile.juzActuel} · {profile.tempsParJour} min/jour
            </p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
