import { motion } from 'framer-motion';
import { BookOpen, Target, Flame, Clock } from 'lucide-react';

interface StatCard {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}

interface Props {
  cards: StatCard[];
}

export function StatCards({ cards }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ scale: 1.04, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          className="bg-white/90 rounded-2xl shadow-xl border border-stone-200 p-4 flex flex-col gap-2"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-stone-800">{card.value}</p>
            <p className="text-xs font-medium text-stone-500 mt-0.5">{card.label}</p>
            {card.sub && <p className="text-xs text-stone-400 mt-0.5">{card.sub}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function buildCustomStatCards(
  juzActuel: number,
  totalCompleted: number,
  streak: number,
  todayPages: number
) {
  const totalPages = 604;
  const pct = Math.round((totalCompleted / totalPages) * 100);
  return [
    {
      label: 'Juz actuel',
      value: `Juz ${juzActuel}`,
      sub: `Page ~${juzActuel * 20}`,
      icon: <BookOpen size={18} className="text-white" />,
      color: 'bg-green-700',
    },
    {
      label: 'Progression',
      value: `${pct}%`,
      sub: `${totalCompleted} / ${totalPages} pages`,
      icon: <Target size={18} className="text-white" />,
      color: 'bg-teal-600',
    },
    {
      label: 'Série actuelle',
      value: `${streak} j`,
      sub: 'Jours consécutifs',
      icon: <Flame size={18} className="text-white" />,
      color: 'bg-orange-500',
    },
    {
      label: 'Objectif du jour',
      value: `${todayPages} p.`,
      sub: 'Pages à mémoriser',
      icon: <Clock size={18} className="text-white" />,
      color: 'bg-blue-600',
    },
  ];
}
