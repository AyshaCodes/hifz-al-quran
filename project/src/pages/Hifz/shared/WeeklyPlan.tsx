import { motion } from 'framer-motion';

interface DayPlan {
  label: string;
  pages: number;
  isActive: boolean;
}

interface Props {
  daysPerWeek: number;
  pagesPerDay: number;
  variant?: 'green' | 'blue';
}

const ALL_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function WeeklyPlan({ daysPerWeek, pagesPerDay, variant = 'green' }: Props) {
  const days: DayPlan[] = ALL_DAYS.map((label, i) => ({
    label,
    pages: pagesPerDay,
    isActive: i < daysPerWeek,
  }));

  const activeClass = variant === 'green' ? 'bg-green-700 text-white' : 'bg-blue-700 text-white';
  const inactiveClass = 'bg-stone-100 text-stone-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white/90 rounded-2xl shadow-xl border border-stone-200 p-5"
    >
      <h3 className="text-base font-bold text-stone-800 mb-4">Plan hebdomadaire</h3>
      <div className="flex items-end gap-2 justify-between">
        {days.map((day) => (
          <div key={day.label} className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-xs font-semibold text-stone-400">{day.label}</span>
            <div
              className={`w-full rounded-xl py-2 text-center text-xs font-bold ${day.isActive ? activeClass : inactiveClass}`}
            >
              {day.isActive ? `${day.pages}p` : '—'}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-stone-500 mt-3 text-center">
        {daysPerWeek} jour(s)/semaine · {pagesPerDay} page(s)/jour
      </p>
    </motion.div>
  );
}
