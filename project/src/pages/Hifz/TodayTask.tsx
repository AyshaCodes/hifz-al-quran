import { CheckCircle, Circle, Heart, Pause, Play, RefreshCcw, RotateCcw, Timer } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatPagesFr } from '../../lib/hifzPace';
import { getDailyMotivationalMessage } from '../../lib/hifzMotivation';
import { DailyProgress, PageQuality, UserProfile } from '../../types';

interface TodayTaskProps {
  targetPage: number;
  targetSurah: string;
  reviewedToday: boolean;
  todayProgress: DailyProgress | null;
  profile: UserProfile;
  dailyMemoGoal: number;
  revisionOnly: boolean;
  memoDoneToday: boolean;
  onMarkDoneWithQuality: (quality: PageQuality) => void;
  onSessionSeconds: (seconds: number) => void;
  onMarkReviewed: () => void;
  onOpenInReader: (page: number) => void;
}

function formatMmSs(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function TodayTask({
  targetPage,
  targetSurah,
  reviewedToday,
  todayProgress,
  profile,
  dailyMemoGoal,
  revisionOnly,
  memoDoneToday,
  onMarkDoneWithQuality,
  onSessionSeconds,
  onMarkReviewed,
  onOpenInReader,
}: TodayTaskProps) {
  const [evalOpen, setEvalOpen] = useState(false);
  const [chronoRunning, setChronoRunning] = useState(false);
  const [chronoElapsed, setChronoElapsed] = useState(todayProgress?.sessionSeconds ?? 0);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const noticeShownRef = useRef(false);
  const lastPersistRef = useRef(0);

  const allottedSec = Math.max(60, profile.tempsParJour * 60);
  const motivation = getDailyMotivationalMessage();

  useEffect(() => {
    setChronoElapsed(todayProgress?.sessionSeconds ?? 0);
  }, [todayProgress?.date, todayProgress?.sessionSeconds]);

  const clearIntervalSafe = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const persistSeconds = useCallback(
    (sec: number) => {
      onSessionSeconds(sec);
      lastPersistRef.current = sec;
    },
    [onSessionSeconds]
  );

  useEffect(() => {
    if (!chronoRunning) {
      clearIntervalSafe();
      return;
    }
    intervalRef.current = setInterval(() => {
      setChronoElapsed((prev) => {
        const next = prev + 1;
        if (next - lastPersistRef.current >= 5) {
          persistSeconds(next);
        }
        if (next >= allottedSec && !noticeShownRef.current) {
          noticeShownRef.current = true;
          setSessionNotice(
            `Votre session de ${profile.tempsParJour} min est terminée 🤍 N'oubliez pas de réviser aussi !`
          );
        }
        return next;
      });
    }, 1000);
    return clearIntervalSafe;
  }, [chronoRunning, allottedSec, profile.tempsParJour, persistSeconds]);

  const startChrono = () => {
    noticeShownRef.current = false;
    setSessionNotice(null);
    setChronoRunning(true);
  };

  const pauseChrono = () => {
    setChronoRunning(false);
    clearIntervalSafe();
    setChronoElapsed((sec) => {
      persistSeconds(sec);
      return sec;
    });
  };

  const resetChrono = () => {
    setChronoRunning(false);
    clearIntervalSafe();
    setChronoElapsed(0);
    noticeShownRef.current = false;
    setSessionNotice(null);
    persistSeconds(0);
  };

  const handleOpenEval = () => {
    if (revisionOnly || dailyMemoGoal <= 0) return;
    setEvalOpen(true);
  };

  const handlePickQuality = (q: PageQuality) => {
    setEvalOpen(false);
    onMarkDoneWithQuality(q);
  };

  const pagesGoal = revisionOnly ? 0 : dailyMemoGoal;
  const pagesActual = todayProgress?.pagesDone ?? 0;
  const progressPct =
    pagesGoal > 0 ? Math.min(100, (pagesActual / pagesGoal) * 100) : reviewedToday ? 100 : 0;

  const showMemoSection = !revisionOnly && dailyMemoGoal > 0 && !isFriday();

  return (
    <div
      className={`card p-5 border-l-4 relative overflow-hidden ${memoDoneToday ? 'border-l-primary-500' : 'border-l-gold-400'}`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-gold-400 to-primary-500 opacity-70" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Tâche du jour
            </p>
            {memoDoneToday && (
              <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium">
                Complété
              </span>
            )}
          </div>

          {revisionOnly ? (
            <>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Révision uniquement
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Consolidez les pages et Juz déjà appris. Utilisez le chrono pour cadencer votre
                session et marquez vos révisions ci-dessous.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {isFriday() ? "Vendredi — priorité Al-Kahf" : `Aujourd'hui : page ${targetPage}`}
              </h3>
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 font-medium">
                {targetSurah}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isFriday()
                  ? 'Pas de nouvelle page de mémorisation aujourd’hui.'
                  : `Objectif du jour : ${formatPagesFr(dailyMemoGoal)} à mémoriser (et réviser le reste du temps).`}
              </p>
            </>
          )}

          {!revisionOnly && (
            <button
              type="button"
              onClick={() => onOpenInReader(targetPage)}
              className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm"
            >
              📖 Ouvrir la page {targetPage} dans le lecteur
            </button>
          )}

          {pagesGoal > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                <span>Progression</span>
                <span>
                  {pagesActual}/{pagesGoal} {pagesGoal === 1 ? 'page' : 'objectif'}
                </span>
              </div>
              <div className="w-full bg-beige-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    memoDoneToday ? 'bg-primary-500' : 'bg-gold-400'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          {memoDoneToday ? (
            <CheckCircle className="w-8 h-8 text-primary-500" />
          ) : (
            <Circle className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          )}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-beige-200 dark:border-gray-700 bg-beige-50/80 dark:bg-gray-800/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Timer className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Chrono de session
          </span>
        </div>
        <p className="text-3xl font-mono tabular-nums text-center text-gray-900 dark:text-gray-50 mb-3">
          {formatMmSs(chronoElapsed)}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {!chronoRunning ? (
            <button
              type="button"
              onClick={startChrono}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 shadow-sm"
            >
              <Play className="w-4 h-4" />
              Démarrer la session
            </button>
          ) : (
            <button
              type="button"
              onClick={pauseChrono}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-beige-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-semibold"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}
          <button
            type="button"
            onClick={resetChrono}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-beige-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
        <p className="text-[11px] text-gray-400 text-center mt-2">
          Temps prévu aujourd&apos;hui : {profile.tempsParJour} min — le rappel apparaît à la fin de
          ce créneau.
        </p>
      </div>

      {sessionNotice && (
        <div className="mt-3 rounded-xl bg-gold-50 dark:bg-gold-900/25 border border-gold-200 dark:border-gold-700/50 p-3 text-sm text-amber-900 dark:text-amber-100 text-center leading-relaxed">
          {sessionNotice}
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
        {showMemoSection && !memoDoneToday && (
          <button
            type="button"
            onClick={handleOpenEval}
            className="btn-primary flex items-center justify-center gap-2 text-sm py-2.5 shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Marquer comme fait
          </button>
        )}
        <button
          type="button"
          onClick={onMarkReviewed}
          disabled={reviewedToday}
          className={`inline-flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-xl font-semibold transition-colors ${
            reviewedToday
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 cursor-default'
              : 'bg-beige-100 dark:bg-gray-800 hover:bg-beige-200 dark:hover:bg-gray-700 text-primary-700 dark:text-primary-300'
          }`}
        >
          <RefreshCcw className="w-4 h-4" />
          {reviewedToday ? 'Révisé aujourd’hui' : 'Marquer comme révisé'}
        </button>
      </div>

      <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Heart className="w-3.5 h-3.5 text-primary-500 flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">{motivation}</span>
      </div>

      {memoDoneToday && (
        <div className="mt-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3 text-center">
          <p className="text-primary-700 dark:text-primary-300 text-sm font-medium">
            Ma sha&apos;Allah ! Excellent travail aujourd&apos;hui.
          </p>
          <p className="font-arabic text-base text-primary-600 dark:text-primary-400 mt-1">
            اللّهم تقبّل منّا
          </p>
        </div>
      )}

      {evalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div
            className="card max-w-md w-full p-6 shadow-xl animate-slide-up"
            role="dialog"
            aria-modal="true"
            aria-labelledby="eval-title"
          >
            <h4 id="eval-title" className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
              Comment s&apos;est passée cette page ?
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Votre réponse ajuste les rappels de révision.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handlePickQuality('fluent')}
                className="w-full text-left rounded-xl border border-beige-200 dark:border-gray-700 px-4 py-3 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                ✅ Fluide — je récite sans hésiter
              </button>
              <button
                type="button"
                onClick={() => handlePickQuality('hesitant')}
                className="w-full text-left rounded-xl border border-beige-200 dark:border-gray-700 px-4 py-3 text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              >
                ⚠️ Quelques hésitations
              </button>
              <button
                type="button"
                onClick={() => handlePickQuality('hard')}
                className="w-full text-left rounded-xl border border-beige-200 dark:border-gray-700 px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                ❌ Difficile — besoin de retravailler
              </button>
            </div>
            <button
              type="button"
              onClick={() => setEvalOpen(false)}
              className="mt-4 w-full text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function isFriday() {
  return new Date().getDay() === 5;
}
