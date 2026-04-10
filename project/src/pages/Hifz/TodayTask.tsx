import { CheckCircle, Circle, Heart, RefreshCcw } from 'lucide-react';
import { DailyProgress } from '../../types';

interface TodayTaskProps {
  targetPage: number;
  targetSurah: string;
  reviewedToday: boolean;
  todayProgress: DailyProgress | null;
  onMarkDone: () => void;
  onMarkReviewed: () => void;
}

export default function TodayTask({
  targetPage,
  targetSurah,
  reviewedToday,
  todayProgress,
  onMarkDone,
  onMarkReviewed,
}: TodayTaskProps) {
  const isDone = todayProgress?.completed ?? false;
  const pagesGoal = 1;
  const pagesActual = todayProgress?.pagesDone ?? 0;
  const progress = Math.min(100, (pagesActual / pagesGoal) * 100);

  return (
    <div className={`card p-5 border-l-4 ${isDone ? 'border-l-primary-500' : 'border-l-gold-400'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Tâche du jour
            </p>
            {isDone && (
              <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium">
                Complété
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Aujourd'hui : page {targetPage}
          </h3>
          <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 font-medium">
            {targetSurah}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Mémorisez et révisez la page {targetPage} du Mushaf.
          </p>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              <span>Progression</span>
              <span>{isDone ? '1/1' : '0/1'} page</span>
            </div>
            <div className="w-full bg-beige-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isDone ? 'bg-primary-500' : 'bg-gold-400'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          {isDone ? (
            <CheckCircle className="w-8 h-8 text-primary-500" />
          ) : (
            <Circle className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
        {!isDone && (
          <button
            onClick={onMarkDone}
            className="btn-primary flex items-center justify-center gap-2 text-sm py-2.5"
          >
            <CheckCircle className="w-4 h-4" />
            Marquer comme fait
          </button>
        )}
        <button
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

      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Heart className="w-3.5 h-3.5 text-primary-500" />
        <span>Constance avant intensité — 30 min/jour suffit.</span>
      </div>

      {isDone && (
        <div className="mt-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3 text-center">
          <p className="text-primary-700 dark:text-primary-300 text-sm font-medium">
            Ma sha'Allah ! Excellent travail aujourd'hui.
          </p>
          <p className="font-arabic text-base text-primary-600 dark:text-primary-400 mt-1">
            اللّهم تقبّل منّا
          </p>
        </div>
      )}
    </div>
  );
}
