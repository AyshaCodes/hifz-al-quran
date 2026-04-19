import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

const QUALITY_VALUES = {
  fluent: 3,
  hesitant: 2,
  hard: 1,
};

const QUALITY_LABELS = {
  fluent: 'Fluide',
  hesitant: 'Hésitant',
  hard: 'Difficile',
};

export default function ProgressChart({ progress, variant = 'green' }: Props) {
  const [view, setView] = useState<'pages' | 'quality'>('pages');
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
      quality: entry?.pageQuality ? QUALITY_VALUES[entry.pageQuality] : 0,
      qualityLabel: entry?.pageQuality ? QUALITY_LABELS[entry.pageQuality] : 'N/A',
      rawQuality: entry?.pageQuality,
    };
  });

  const barColor = variant === 'green' ? '#15803d' : '#1d4ed8';
  const qualityColors = {
    fluent: '#16a34a',
    hesitant: '#f59e0b',
    hard: '#ef4444',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 rounded-2xl shadow-xl border border-stone-200 p-5"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-stone-800">Analyse de progression</h3>
        <div className="flex bg-stone-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setView('pages')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
              view === 'pages' ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-stone-500'
            }`}
          >
            Pages
          </button>
          <button
            onClick={() => setView('quality')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
              view === 'quality' ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-stone-500'
            }`}
          >
            Qualité
          </button>
        </div>
      </div>

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
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
              domain={[0, view === 'pages' ? 'auto' : 3]}
            />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              }}
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              formatter={(value, name, props) => {
                if (view === 'pages') return [`${value} page(s)`, 'Mémorisé'];
                return [props.payload.qualityLabel, 'Qualité'];
              }}
            />
            <Bar dataKey={view === 'pages' ? 'pages' : 'quality'} radius={[4, 4, 0, 0]} maxBarSize={24}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={view === 'pages' ? barColor : (entry.rawQuality ? qualityColors[entry.rawQuality as keyof typeof qualityColors] : '#e7e5e4')} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-4">
        {view === 'pages' ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: barColor }} />
            <span className="text-[10px] text-stone-500 font-medium">Pages mémorisées</span>
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
              <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Fluide</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Hésitant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Difficile</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
