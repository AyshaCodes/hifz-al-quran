import { HifzProgress } from '../../types/hifz';
import { getWeekDays } from '../../utils/storage';

interface Props {
  progress: HifzProgress;
}

export default function WeeklyView({ progress }: Props) {
  const days = getWeekDays();

  const getDayStatus = (date: string, isFriday: boolean, isFuture: boolean) => {
    if (isFuture) return 'future';
    if (isFriday) return 'friday';
    const jour = progress.jours.find(j => j.date === date);
    if (!jour) return 'missed';
    if (jour.pageFaite || jour.pageRevisee) return 'done';
    return 'missed';
  };

  const circleClass = (status: string, isToday: boolean) => {
    const base = 'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all';
    const ring = isToday ? ' ring-2 ring-offset-2 ring-[#2c6e3c]' : '';
    switch (status) {
      case 'done': return `${base} bg-[#2c6e3c] text-white${ring}`;
      case 'missed': return `${base} bg-rose-100 text-rose-400${ring}`;
      case 'friday': return `${base} bg-[#d4a345] text-white${ring}`;
      case 'future': return `${base} bg-[#f0ece0] text-[#c5bfb0]${ring}`;
      default: return `${base} bg-[#f0ece0] text-[#c5bfb0]`;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#e8e4d4] px-6 py-5">
      <p className="text-xs text-[#9a9688] uppercase tracking-wide font-medium mb-4">
        Cette semaine
      </p>

      <div className="flex justify-between items-start gap-1">
        {days.map(day => {
          const status = getDayStatus(day.date, day.isFriday, day.isFuture);
          return (
            <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
              <span className="text-[10px] text-[#9a9688] font-medium">{day.label}</span>
              <div className={circleClass(status, day.isToday)}>
                {status === 'done' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : status === 'friday' ? (
                  '⭐'
                ) : (
                  <span className="text-xs">{new Date(day.date).getDate()}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-[#f0ece0]">
        {[
          { color: 'bg-[#2c6e3c]', label: 'Fait' },
          { color: 'bg-rose-100', label: 'Manqué' },
          { color: 'bg-[#d4a345]', label: 'Vendredi' },
          { color: 'bg-[#f0ece0]', label: 'À venir' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-[10px] text-[#9a9688]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
