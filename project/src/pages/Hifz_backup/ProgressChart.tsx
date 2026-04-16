import { DailyProgress } from '../../types';

interface ProgressChartProps {
  progress: DailyProgress[];
}

const FRENCH_MONTHS = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
  'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc',
];

function getLast6MonthsData(progress: DailyProgress[]) {
  const result = [];
  const today = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(d.getMonth() - i);
    const year = d.getFullYear();
    const month = d.getMonth();
    const label = FRENCH_MONTHS[month];

    const monthPages = progress
      .filter((p) => {
        const pd = new Date(p.date);
        return pd.getFullYear() === year && pd.getMonth() === month && p.completed;
      })
      .reduce((sum, p) => sum + (p.pagesDone > 0 ? p.pagesDone : 1), 0);

    result.push({ label, pages: monthPages, month, year });
  }
  return result;
}

export default function ProgressChart({ progress }: ProgressChartProps) {
  const data = getLast6MonthsData(progress);
  const maxPages = Math.max(...data.map((d) => d.pages), 10);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
          Progression mensuelle
        </h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">6 derniers mois</span>
      </div>

      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((d, i) => {
          const heightPct = maxPages > 0 ? (d.pages / maxPages) * 100 : 0;
          const isCurrentMonth = i === data.length - 1;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {d.pages > 0 ? d.pages : ''}
              </span>
              <div className="w-full flex items-end" style={{ height: '100px' }}>
                <div
                  className={`w-full rounded-t-lg transition-all duration-700 ${
                    isCurrentMonth
                      ? 'bg-primary-500'
                      : d.pages === 0
                      ? 'bg-beige-200 dark:bg-gray-800'
                      : 'bg-primary-200 dark:bg-primary-800'
                  }`}
                  style={{
                    height: `${Math.max(heightPct, d.pages > 0 ? 8 : 4)}%`,
                    minHeight: '4px',
                  }}
                />
              </div>
              <span className={`text-xs font-medium ${isCurrentMonth ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>
                {d.label}
              </span>
            </div>
          );
        })}
      </div>

      {data.every((d) => d.pages === 0) && (
        <div className="text-center py-4">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Commencez à mémoriser pour voir votre progression ici.
          </p>
        </div>
      )}
    </div>
  );
}
