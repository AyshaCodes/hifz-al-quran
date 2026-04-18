import { DailyProgress } from '../../../types';
import { Check, Dot, MoonStar } from 'lucide-react';

interface WeeklyCalendarProps {
  progress: DailyProgress[];
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(today.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDate(d: Date) {
  return d.toISOString().split('T')[0];
}

function isFriday(d: Date) {
  return d.getDay() === 5;
}

function isToday(d: Date) {
  return formatDate(d) === formatDate(new Date());
}

export default function WeeklyCalendar({ progress }: WeeklyCalendarProps) {
  const weekDates = getWeekDates();
  const today = new Date();

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Cette semaine</h3>
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, i) => {
          const dateStr = formatDate(date);
          const dayProgress = progress.find((p) => p.date === dateStr);
          const done = dayProgress?.completed ?? false;
          const isFri = isFriday(date);
          const todayDay = isToday(date);
          const isPast = date < today && !todayDay;
          const isFuture = date > today && !todayDay;

          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <p className={`text-xs font-medium ${todayDay ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>
                {DAYS[i]}
              </p>
              <p className={`text-sm font-semibold ${todayDay ? 'text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`}>
                {date.getDate()}
              </p>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${todayDay ? 'ring-2 ring-primary-400 ring-offset-2 dark:ring-offset-gray-900' : ''}
                  ${done && isFri ? 'bg-gold-400 text-white' :
                    done ? 'bg-primary-500 text-white' :
                    isFri && !isFuture ? 'bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 border-2 border-gold-300' :
                    isPast ? 'bg-red-100 dark:bg-red-900/20 text-red-400' :
                    isFuture ? 'bg-beige-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600' :
                    'bg-beige-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {isFri ? (
                  <MoonStar className="w-3.5 h-3.5" />
                ) : done ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isPast ? (
                  <Dot className="w-4 h-4" />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 pt-3 border-t border-beige-100 dark:border-gray-800">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-3 h-3 rounded-full bg-primary-500" />
          <span>Fait</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-3 h-3 rounded-full bg-red-200" />
          <span>Manqué</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-3 h-3 rounded-full bg-gold-400" />
          <span>Vendredi</span>
        </div>
      </div>
    </div>
  );
}
