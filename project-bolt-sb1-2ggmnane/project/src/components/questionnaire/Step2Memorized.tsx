import { DepartMemorisation, QualiteMemorisation, QuestionnaireData } from '../../types/hifz';
import { JUZ_LIST } from '../../data/juz';

interface Props {
  data: Pick<QuestionnaireData, 'departMemorisation' | 'juzArrive' | 'qualiteMemorisation'>;
  onChange: (field: string, value: unknown) => void;
}

const QUALITE_OPTIONS: { value: QualiteMemorisation; dot: string; title: string; desc: string }[] = [
  { value: 'solide', dot: 'bg-emerald-500', title: 'Solide', desc: 'Je récite sans hésiter' },
  { value: 'partielle', dot: 'bg-amber-400', title: 'Partielle', desc: 'Quelques hésitations' },
  { value: 'oubliee', dot: 'bg-rose-400', title: 'Oubliée', desc: "J'ai beaucoup oublié" },
];

export default function Step2Memorized({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-semibold text-[#2c3e2d] text-center mb-2">
        Qu'avez-vous déjà mémorisé ?
      </h2>
      <p className="text-center text-[#7a8c7b] mb-8 text-sm">
        Aidez-nous à comprendre votre avancement
      </p>

      <div className="max-w-lg mx-auto space-y-8">
        <div>
          <p className="font-medium text-[#2c3e2d] mb-3 text-sm">
            Par où avez-vous commencé ?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { value: 'debut' as DepartMemorisation, icon: '📗', label: 'Par le début', sub: 'Juz 1 — Al-Fatiha' },
                { value: 'fin' as DepartMemorisation, icon: '📘', label: 'Par la fin', sub: 'Juz 30 — An-Naba' },
              ] as const
            ).map(opt => (
              <button
                key={opt.value}
                onClick={() => onChange('departMemorisation', opt.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  data.departMemorisation === opt.value
                    ? 'border-[#2c6e3c] bg-[#2c6e3c]/5'
                    : 'border-[#e0dccf] bg-white hover:border-[#d4a345]/50'
                }`}
              >
                <div className="text-2xl mb-2">{opt.icon}</div>
                <div
                  className={`font-semibold text-sm ${
                    data.departMemorisation === opt.value ? 'text-[#2c6e3c]' : 'text-[#2c3e2d]'
                  }`}
                >
                  {opt.label}
                </div>
                <div className="text-xs text-[#9a9688] mt-0.5">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium text-[#2c3e2d] mb-3 text-sm">Jusqu'où êtes-vous arrivé ?</p>
          <select
            value={data.juzArrive}
            onChange={e => onChange('juzArrive', Number(e.target.value))}
            className="w-full p-3 rounded-xl border-2 border-[#e0dccf] bg-white text-[#2c3e2d] text-sm focus:outline-none focus:border-[#2c6e3c] transition-colors cursor-pointer"
          >
            {JUZ_LIST.map(juz => (
              <option key={juz.numero} value={juz.numero}>
                Juz {juz.numero} — {juz.souratePrincipale}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="font-medium text-[#2c3e2d] mb-3 text-sm">
            Comment évaluez-vous votre mémorisation ?
          </p>
          <div className="grid grid-cols-3 gap-3">
            {QUALITE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onChange('qualiteMemorisation', opt.value)}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  data.qualiteMemorisation === opt.value
                    ? 'border-[#2c6e3c] bg-[#2c6e3c]/5'
                    : 'border-[#e0dccf] bg-white hover:border-[#d4a345]/50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${opt.dot} mx-auto mb-2`} />
                <div
                  className={`font-semibold text-sm ${
                    data.qualiteMemorisation === opt.value ? 'text-[#2c6e3c]' : 'text-[#2c3e2d]'
                  }`}
                >
                  {opt.title}
                </div>
                <div className="text-[10px] text-[#9a9688] mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
