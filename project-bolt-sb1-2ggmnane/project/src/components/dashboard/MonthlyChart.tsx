import { HifzProgress } from '../../types/hifz';
import { getMonthlyStats } from '../../utils/storage';

interface Props {
  progress: HifzProgress;
}

export default function MonthlyChart({ progress }: Props) {
  const stats = getMonthlyStats(progress);
  const maxPages = Math.max(...stats.map(s => s.pages), 1);

  return (
    <div className="bg-white rounded-3xl border border-[#e8e4d4] px-6 py-5">
      <p className="text-xs text-[#9a9688] uppercase tracking-wide font-medium mb-5">
        Progression mensuelle
      </p>

      <div className="flex items-end gap-2 h-28">
        {stats.map((s, i) => {
          const heightPct = maxPages > 0 ? (s.pages / maxPages) * 100 : 0;
          const isLast = i === stats.length - 1;

          return (
            <div key={s.semaine} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex flex-col items-center justify-end" style={{ height: '96px' }}>
                {s.pages > 0 && (
                  <span className="text-[9px] text-[#7a8c7b] mb-0.5 font-medium">{s.pages}</span>
                )}
                <div
                  className={`w-full rounded-t-lg transition-all duration-700 ${
                    isLast ? 'bg-[#d4a345]' : 'bg-[#2c6e3c]/20'
                  } ${s.pages === 0 ? 'opacity-30' : ''}`}
                  style={{ height: `${Math.max(heightPct, s.pages > 0 ? 8 : 2)}%` }}
                />
              </div>
              <span className="text-[9px] text-[#9a9688] text-center leading-tight whitespace-nowrap">
                {s.semaine}
              </span>
            </div>
          );
        })}
      </div>

      {stats.every(s => s.pages === 0) && (
        <div className="text-center py-2">
          <p className="text-xs text-[#b0a898] italic">
            Votre progression apparaîtra ici au fil du temps 🌱
          </p>
        </div>
      )}
    </div>
  );
}
