import { ObjectifHifz, QuestionnaireData } from '../../types/hifz';

interface Props {
  data: Pick<QuestionnaireData, 'objectif' | 'nombreJuzObjectif' | 'aDateObjectif' | 'dateObjectif' | 'situation' | 'qualiteMemorisation'>;
  onChange: (field: string, value: unknown) => void;
}

const getObjectifOptions = (situation: QuestionnaireData['situation'], qualite: QuestionnaireData['qualiteMemorisation']) => {
  const options: { value: ObjectifHifz; icon: string; title: string; desc?: string }[] = [
    { value: 'complet', icon: '🎯', title: 'Mémoriser le Coran en entier' },
    { value: 'quelques_juz', icon: '📝', title: 'Mémoriser quelques Juz seulement' },
  ];
  if (situation !== 'debutant' && (qualite === 'partielle' || qualite === 'oubliee')) {
    options.push({ value: 'revision', icon: '🔄', title: 'Réviser et consolider uniquement' });
  }
  return options;
};

export default function Step3Objective({ data, onChange }: Props) {
  const options = getObjectifOptions(data.situation, data.qualiteMemorisation);

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-semibold text-[#2c3e2d] text-center mb-2">
        Quel est votre objectif ?
      </h2>
      <p className="text-center text-[#7a8c7b] mb-8 text-sm">Définissez votre ambition pour le Hifz</p>

      <div className="max-w-lg mx-auto space-y-7">
        <div className="space-y-3">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange('objectif', opt.value)}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                data.objectif === opt.value
                  ? 'border-[#2c6e3c] bg-[#2c6e3c]/5'
                  : 'border-[#e0dccf] bg-white hover:border-[#d4a345]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.icon}</span>
                <span
                  className={`font-semibold text-sm ${
                    data.objectif === opt.value ? 'text-[#2c6e3c]' : 'text-[#2c3e2d]'
                  }`}
                >
                  {opt.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {data.objectif === 'quelques_juz' && (
          <div className="bg-[#f8f6e9] rounded-2xl p-5 border border-[#e8e4d4]">
            <p className="text-sm font-medium text-[#2c3e2d] mb-3">
              Combien de Juz souhaitez-vous mémoriser ?
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={30}
                value={data.nombreJuzObjectif}
                onChange={e => onChange('nombreJuzObjectif', Number(e.target.value))}
                className="flex-1 accent-[#2c6e3c] h-2 cursor-pointer"
              />
              <div className="min-w-[52px] text-center">
                <span className="text-xl font-bold text-[#2c6e3c]">{data.nombreJuzObjectif}</span>
                <span className="text-xs text-[#7a8c7b] block">Juz</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#f8f6e9] rounded-2xl p-5 border border-[#e8e4d4]">
          <p className="text-sm font-medium text-[#2c3e2d] mb-3">
            Avez-vous un objectif de date ?
          </p>
          <div className="flex gap-3 mb-4">
            {[
              { label: 'Oui', val: true },
              { label: 'Non', val: false },
            ].map(opt => (
              <button
                key={String(opt.val)}
                onClick={() => onChange('aDateObjectif', opt.val)}
                className={`px-6 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                  data.aDateObjectif === opt.val
                    ? 'border-[#2c6e3c] bg-[#2c6e3c] text-white'
                    : 'border-[#e0dccf] bg-white text-[#2c3e2d] hover:border-[#2c6e3c]/40'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {data.aDateObjectif && (
            <div>
              <label className="text-xs text-[#7a8c7b] block mb-1.5">Je veux terminer avant le :</label>
              <input
                type="date"
                value={data.dateObjectif}
                onChange={e => onChange('dateObjectif', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 rounded-xl border-2 border-[#e0dccf] bg-white text-sm text-[#2c3e2d] focus:outline-none focus:border-[#2c6e3c] transition-colors cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
