import { Situation } from '../../types/hifz';

interface Props {
  value: Situation | null;
  onChange: (value: Situation) => void;
}

const OPTIONS: { value: Situation; icon: string; title: string; desc: string }[] = [
  {
    value: 'debutant',
    icon: '📖',
    title: 'Je commence le Hifz',
    desc: "Je n'ai encore rien mémorisé",
  },
  {
    value: 'peu_avance',
    icon: '🌱',
    title: "J'ai commencé mais peu avancé",
    desc: "J'ai mémorisé quelques sourates",
  },
  {
    value: 'plusieurs_juz',
    icon: '📚',
    title: "J'ai mémorisé plusieurs Juz",
    desc: 'Je veux continuer et réviser',
  },
  {
    value: 'revision',
    icon: '🔄',
    title: "Je veux réviser ce que j'ai oublié",
    desc: "J'ai mémorisé mais beaucoup oublié",
  },
];

export default function Step1Situation({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-semibold text-[#2c3e2d] text-center mb-2">
        Où en êtes-vous avec le Coran ?
      </h2>
      <p className="text-center text-[#7a8c7b] mb-8 text-sm">Choisissez votre situation actuelle</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md cursor-pointer ${
              value === opt.value
                ? 'border-[#2c6e3c] bg-[#2c6e3c]/5 shadow-md'
                : 'border-[#e0dccf] bg-white hover:border-[#d4a345]/50'
            }`}
          >
            <div className="text-3xl mb-3">{opt.icon}</div>
            <div
              className={`font-semibold text-sm mb-1 ${
                value === opt.value ? 'text-[#2c6e3c]' : 'text-[#2c3e2d]'
              }`}
            >
              {opt.title}
            </div>
            <div className="text-xs text-[#9a9688]">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
