import { AlertTriangle, BookOpen, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';
import { SURAHS } from '../../data/surahs';
import {
  formatPagesFr,
  formatTempsCourt,
  getPagesPerDayFromMinutes,
  snapTempsToStep,
} from '../../lib/hifzPace';
import {
  getCurrentTargetPage,
  getDailyMemoGoal,
  getTodayStr,
  isRevisionOnlyPeriod,
  memorizationQualityOrDefault,
  reviewThresholdDays,
} from '../../lib/hifzSchedule';
import { DailyProgress, PageQuality, UserProfile } from '../../types';
import ProgressChart from './ProgressChart';
import StatCards from './StatCards';
import TodayTask from './TodayTask';
import WeeklyCalendar from './WeeklyCalendar';

interface DashboardProps {
  profile: UserProfile;
  progress: DailyProgress[];
  onMarkDoneWithQuality: (quality: PageQuality) => void;
  onSessionSeconds: (seconds: number) => void;
  onMarkTodayReviewed: () => void;
  onMarkPriorityReviewed: (pages: number[]) => void;
  onActivateTenJuzConsolidation: () => void;
  onDismissTenJuzHint: () => void;
  kahfReadToday: boolean;
  onMarkKahfRead: () => void;
  onReset: () => void;
}

function isFridayToday() {
  return new Date().getDay() === 5;
}

function computeStreak(progress: DailyProgress[]) {
  const sorted = [...progress]
    .filter((p) => p.completed || p.lastReviewedAt === p.date)
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

function getUnrevisedPages(
  progress: DailyProgress[],
  juzActuel: number,
  profile: UserProfile
): number[] {
  const threshold = reviewThresholdDays(profile.memorizationQuality);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - threshold);

  const startPage = (juzActuel - 1) * 20 + 1;
  const completedSorted = [...progress]
    .filter((p) => p.completed)
    .sort((a, b) => a.date.localeCompare(b.date));

  const stale = completedSorted
    .map((entry, index) => ({
      page: startPage + index,
      reviewedAt: entry.lastReviewedAt ?? entry.date,
    }))
    .filter((entry) => new Date(entry.reviewedAt) < cutoff)
    .slice(-5)
    .map((entry) => entry.page);

  const urgent = profile.urgentReviewPages ?? [];
  const merged = [...new Set([...urgent, ...stale])];
  return merged.slice(0, 8);
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
  onMarkDoneWithQuality,
  onSessionSeconds,
  onMarkTodayReviewed,
  onMarkPriorityReviewed,
  onActivateTenJuzConsolidation,
  onDismissTenJuzHint,
  kahfReadToday,
  onMarkKahfRead,
  onReset,
}: DashboardProps) {
  const today = getTodayStr();
  const todayProgress = progress.find((p) => p.date === today) ?? null;
  const mq = memorizationQualityOrDefault(profile.memorizationQuality);
  const revisionOnly = isRevisionOnlyPeriod(profile, today);
  const dailyGoal = getDailyMemoGoal(profile, today);

  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const pagesThisMonth = progress
      .filter((p) => {
        const d = new Date(p.date);
        return p.completed && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, p) => sum + (p.pagesDone > 0 ? p.pagesDone : 1), 0);

    const totalPages = progress
      .filter((p) => p.completed && p.pageQuality !== 'hard')
      .reduce((sum, p) => sum + (p.pagesDone > 0 ? p.pagesDone : 1), 0);

    const juzCompleted = Math.floor(totalPages / 20);
    const streakDays = computeStreak(progress);
    const daysSinceStart = Math.max(
      1,
      Math.ceil((new Date().getTime() - new Date(profile.createdAt).getTime()) / 86400000)
    );
    const pagesPerDay = totalPages > 0 ? totalPages / daysSinceStart : 0;

    const sessionTodaySeconds = todayProgress?.sessionSeconds ?? 0;

    return { pagesThisMonth, juzCompleted, streakDays, pagesPerDay, sessionTodaySeconds };
  }, [progress, profile, todayProgress]);

  const targetPage = getCurrentTargetPage(profile, progress);
  const targetSurah = getSurahNameForPage(targetPage);
  const unrevisedPages = getUnrevisedPages(progress, profile.juzActuel, profile);
  const reviewedToday = todayProgress?.lastReviewedAt === today;

  const daysUntilObjectif = Math.ceil(
    (new Date(profile.objectif).getTime() - new Date().getTime()) / 86400000
  );

  const showTenJuzCard =
    stats.juzCompleted >= 10 &&
    !profile.tenJuzDismissed &&
    !revisionOnly &&
    !isFridayToday();

  const memoDoneToday =
    todayProgress?.completed === true && todayProgress.pageQuality !== 'hard';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5 animate-fade-in">
      <div className="card green-gradient text-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary-200 text-sm mb-1">Bienvenue</p>
            <h1 className="font-amiri text-3xl font-bold text-white">{profile.prenom}</h1>
            <p className="text-primary-200 text-sm mt-2">
              {daysUntilObjectif > 0
                ? `Objectif dans ${daysUntilObjectif} jours`
                : "Objectif atteint ! Ma sha'Allah !"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-arabic text-2xl text-gold-300">بِسْمِ اللَّه</p>
            <p className="text-primary-200 text-xs mt-1">Juz {profile.juzActuel}</p>
          </div>
        </div>
      </div>

      <StatCards stats={stats} />

      {revisionOnly && (
        <div className="card p-5 border-l-4 border-l-primary-500 bg-primary-50/80 dark:bg-primary-900/20">
          <h3 className="font-semibold text-primary-800 dark:text-primary-200 text-sm">
            Mode révision (consolidation)
          </h3>
          <p className="text-xs text-primary-700 dark:text-primary-300 mt-2 leading-relaxed">
            Jusqu&apos;au{' '}
            <strong>
              {profile.revisionOnlyUntil
                ? new Date(profile.revisionOnlyUntil + 'T12:00:00').toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'}
            </strong>
            , concentrez-vous sur la révision des pages déjà apprises — pas de nouvelle mémorisation
            dans le tableau de bord.
          </p>
        </div>
      )}

      {mq === 'partial' && !revisionOnly && (
        <div className="card p-4 border border-gold-200 dark:border-gold-700/50 bg-gold-50/50 dark:bg-gold-900/10">
          <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>Révision intensive :</strong> réservez environ la moitié de votre temps du jour
            pour réciter les Juz déjà acquis ; l&apos;autre moitié sert à la nouvelle page.
          </p>
        </div>
      )}

      {showTenJuzCard && (
        <div className="card p-5 border-2 border-gold-400 bg-gradient-to-br from-gold-50 to-beige-50 dark:from-gold-900/20 dark:to-gray-900">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              📚
            </span>
            Pause de consolidation recommandée
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            Vous avez atteint 10 Juz — l&apos;Ustadh conseille 1 mois de révision pure avant de
            continuer.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Voulez-vous activer le mode consolidation ?
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              type="button"
              onClick={onActivateTenJuzConsolidation}
              className="btn-primary text-sm py-2 px-4"
            >
              Activer le mode révision (1 mois)
            </button>
            <button
              type="button"
              onClick={onDismissTenJuzHint}
              className="text-sm py-2 px-4 rounded-xl border border-beige-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-beige-100 dark:hover:bg-gray-800"
            >
              Plus tard
            </button>
          </div>
        </div>
      )}

      {isFridayToday() && (
        <div className="card p-5 bg-gradient-to-r from-primary-700 to-primary-800 border border-primary-600 animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-gold-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white flex items-center gap-2">
                Aujourd&apos;hui c&apos;est vendredi — Lis Al-Kahf
              </h3>
              <p className="text-primary-100 text-sm mt-1">Pas de nouvelle page aujourd&apos;hui.</p>
              <button
                type="button"
                onClick={onMarkKahfRead}
                disabled={kahfReadToday}
                className={`mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  kahfReadToday
                    ? 'bg-white/20 text-white cursor-default'
                    : 'bg-gold-400 hover:bg-gold-300 text-gray-900'
                }`}
              >
                {kahfReadToday ? 'Al-Kahf lu ✓' : 'Marquer Al-Kahf comme lu'}
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
        profile={profile}
        dailyMemoGoal={dailyGoal}
        revisionOnly={revisionOnly}
        memoDoneToday={memoDoneToday}
        onMarkDoneWithQuality={onMarkDoneWithQuality}
        onSessionSeconds={onSessionSeconds}
        onMarkReviewed={onMarkTodayReviewed}
      />

      <WeeklyCalendar progress={progress} />

      {unrevisedPages.length > 0 && (
        <div className="card p-5 border-l-4 border-l-amber-400 bg-amber-50 dark:bg-amber-900/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                {mq === 'partial'
                  ? 'Révision prioritaire — pages à reprendre vite'
                  : 'Règle des 3 jours — Révision nécessaire'}
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
                type="button"
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
              Juz {profile.juzActuel} · {formatTempsCourt(snapTempsToStep(profile.tempsParJour))} · ~{' '}
              {formatPagesFr(getPagesPerDayFromMinutes(snapTempsToStep(profile.tempsParJour)))}
              / jour (rythme indicatif)
              {memorizationQualityOrDefault(profile.memorizationQuality) === 'partial'
                ? ' — moitié du temps pour la révision des Juz appris'
                : null}
            </p>
          </div>
          <button
            type="button"
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
