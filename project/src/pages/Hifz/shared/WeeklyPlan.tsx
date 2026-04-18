import { CalendarDays, MoonStar, Repeat } from 'lucide-react';
import { PlannedDay } from '../../../lib/hifzSchedule';

interface WeeklyPlanProps {
  plan: PlannedDay[];
}

function isToday(dateStr: string) {
  return new Date().toISOString().split('T')[0] === dateStr;
}

export default function WeeklyPlan({ plan }: WeeklyPlanProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-4 h-4 text-primary-500" />
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
          Planning automatique (semaine)
        </h3>
      </div>

      <div className="space-y-2">
        {plan.map((day) => {
          const today = isToday(day.date);
          return (
            <div
              key={day.date}
              className={`rounded-xl border px-3 py-2.5 flex items-center justify-between ${
                today
                  ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-beige-200 dark:border-gray-700'
              }`}
            >
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {day.dayLabel} · {new Date(day.date + 'T12:00:00').toLocaleDateString('fr-FR')}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {day.mode === 'kahf'
                    ? 'Lecture de sourate Al-Kahf'
                    : day.mode === 'revision'
                      ? 'Jour de révision'
                      : `Pages ${day.fromPage} -> ${day.toPage}`}
                </p>
              </div>

              {day.mode === 'kahf' ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400">
                  <MoonStar className="w-3 h-3" />
                  Vendredi
                </span>
              ) : day.mode === 'revision' ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-beige-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  <Repeat className="w-3 h-3" />
                  Révision
                </span>
              ) : (
                <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  {day.targetPages} page{day.targetPages > 1 ? 's' : ''}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
