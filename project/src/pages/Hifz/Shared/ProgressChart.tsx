import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DailyProgress } from '../../../types/hifz';

interface Props {
  progress: DailyProgress[];
  variant?: 'green' | 'blue';
}

function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

export default function ProgressChart({ progress, variant = 'green' }: Props) {
  const days = getLast30Days();
  const progressMap = new Map(progress.map((p) => [p.date, p]));

  const data = days.map((date) => {
    const entry = progressMap.get(date);
    const label = new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    });
    return {
      date: label,
      pages: entry?.pagesDone ?? 0,
      completed: entry?.completed ? 1 : 0,
    };
  });

  const barColor = variant === 'green' ? '#15803d' : '#1d4ed8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 rounded-2xl shadow-xl border border-stone-200 p-5"
    >
      <h3 className="text-base font-bold text-stone-800 mb-4">Progression des 30 derniers jours</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#78716c' }}
            interval={6}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#78716c' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #e7e5e4',
              borderRadius: '12px',
              fontSize: '12px',
            }}
            formatter={(value) => [`${value} page(s)`, 'Pages']}
          />
          <Bar dataKey="pages" fill={barColor} radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
