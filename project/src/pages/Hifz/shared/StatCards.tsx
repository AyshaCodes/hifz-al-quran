import { BookOpen, Clock, Flame, Star, TrendingUp } from 'lucide-react';

interface Stats {
  pagesThisMonth: number;
  juzCompleted: number;
  streakDays: number;
  pagesPerDay: number;
  sessionTodaySeconds: number;
}

function formatSessionShort(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s}s`;
  return `${m}m${s.toString().padStart(2, '0')}`;
}

interface StatCardsProps {
  stats: Stats;
}

export default function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      icon: BookOpen,
      label: 'Pages ce mois',
      value: stats.pagesThisMonth,
      unit: 'pages',
      color: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
      border: 'border-t-primary-400',
    },
    {
      icon: Star,
      label: 'Juz complétés',
      value: stats.juzCompleted,
      unit: '/ 30',
      color: 'bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400',
      border: 'border-t-gold-400',
    },
    {
      icon: Flame,
      label: 'Jours consécutifs',
      value: stats.streakDays,
      unit: 'jours',
      color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
      border: 'border-t-orange-400',
    },
    {
      icon: TrendingUp,
      label: 'Rythme actuel',
      value: stats.pagesPerDay.toFixed(1),
      unit: 'p/jour',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      border: 'border-t-blue-400',
    },
    {
      icon: Clock,
      label: "Session aujourd'hui",
      value: formatSessionShort(stats.sessionTodaySeconds),
      unit: '',
      color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
      border: 'border-t-teal-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className={`stat-card border-t-2 ${card.border}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {card.value}
                {card.unit ? (
                  <span className="text-sm font-normal text-gray-400 ml-1">{card.unit}</span>
                ) : null}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
