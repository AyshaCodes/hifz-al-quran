import { motion } from 'framer-motion';
import { DailyProgress } from '../../../types/hifz';

interface Props {
  progress: DailyProgress[];
  variant?: 'green' | 'blue';
}

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function getWeekDays(): string[] {
  const days: string[] = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

export default function WeeklyCalendar({ progress, variant = 'green' }: Props) {
  const weekDays = getWeekDays();
  const progressMap = new Map(progress.map((p) => [p.date, p]));
  const today = new Date().toISOString().split('T')[0];

  const activeClass = variant === 'green' ? 'bg-green-700' : 'bg-blue-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white/90 rounded-2xl shadow-xl border border-stone-200 p-5"
    >
      <h3 className="text-base font-bold text-stone-800 mb-4">Planning de la semaine</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((date, i) => {
          const entry = progressMap.get(date);
          const isToday = date === today;
          const isDone = entry?.completed;
          const isFuture = date > today;

          return (
            <div key={date} className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-medium text-stone-500">{DAYS_FR[i]}</span>
              <motion.div
                whileHover={!isFuture ? { scale: 1.1 } : {}}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${isToday ? `ring-2 ring-offset-1 ${variant === 'green' ? 'ring-green-700' : 'ring-blue-700'}` : ''}
                  ${isDone ? `${activeClass} text-white` : isFuture ? 'bg-stone-100 text-stone-300' : 'bg-stone-200 text-stone-500'}
                `}
              >
                {new Date(date).getDate()}
              </motion.div>
              {entry?.pagesDone ? (
                <span className="text-xs text-stone-400">{entry.pagesDone}p</span>
              ) : (
                <span className="text-xs text-stone-300">—</span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
