import { HifzProgress } from '../../types/hifz';
import { getPagesThisMonth } from '../../utils/calculations';

interface Props {
  progress: HifzProgress;
  pagesParJour: number;
}

export default function StatCards({ progress, pagesParJour }: Props) {
  const pagesThisMonth = getPagesThisMonth(progress.jours);

  const stats = [
    {
      label: 'Pages ce mois',
      value: pagesThisMonth,
      unit: 'pages',
      color: 'text-[#2c6e3c]',
      bg: 'bg-[#2c6e3c]/8',
      icon: '📖',
    },
    {
      label: 'Juz complétés',
      value: progress.juzCompletes,
      unit: `/ 30`,
      color: 'text-[#d4a345]',
      bg: 'bg-[#d4a345]/10',
      icon: '✨',
    },
    {
      label: 'Jours consécutifs',
      value: progress.joursConsecutifs,
      unit: 'jours',
      color: 'text-[#2c6e3c]',
      bg: 'bg-[#2c6e3c]/8',
      icon: '🔥',
    },
    {
      label: 'Rythme actuel',
      value: pagesParJour,
      unit: 'page/jour',
      color: 'text-[#d4a345]',
      bg: 'bg-[#d4a345]/10',
      icon: '⚡',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(s => (
        <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-[#e8e4d4]`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{s.icon}</span>
            <p className="text-xs text-[#7a8c7b] leading-tight">{s.label}</p>
          </div>
          <p className={`text-2xl font-bold ${s.color}`}>
            {s.value}
            <span className="text-xs font-normal text-[#9a9688] ml-1">{s.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
