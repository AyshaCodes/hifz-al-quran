import { HifzProfile } from '../../types/hifz';
import { minutesToLabel } from '../../utils/calculations';

interface Props {
  profile: HifzProfile;
  onStart: () => void;
}

export default function ProgramSummary({ profile, onStart }: Props) {
  const { questionnaire: q, programme: p } = profile;

  const phaseLabel =
    p.phase === 'revision_pure'
      ? 'Révision pure (1 mois)'
      : p.phase === 'revision'
      ? 'Révision et consolidation'
      : 'Mémorisation';

  const dureeLabel =
    p.dureeEstimeeMois >= 12
      ? `${Math.floor(p.dureeEstimeeMois / 12)} an${Math.floor(p.dureeEstimeeMois / 12) > 1 ? 's' : ''} ${p.dureeEstimeeMois % 12 > 0 ? `et ${p.dureeEstimeeMois % 12} mois` : ''}`
      : `${p.dureeEstimeeMois} mois`;

  return (
    <div className="min-h-screen bg-[#f8f6e9] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div
            className="text-2xl font-bold text-[#2c6e3c] mb-1"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            هِفْظ
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#e8e4d4] overflow-hidden mb-6">
          <div className="bg-[#2c6e3c] px-8 py-7 text-white">
            <p className="text-sm text-[#a8d4b4] mb-1">Votre programme Hifz</p>
            <h1 className="text-2xl font-semibold">
              {q.prenom} 🤍
            </h1>
          </div>

          <div className="p-7 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f8f6e9] rounded-2xl p-4">
                <p className="text-xs text-[#9a9688] mb-1">Rythme</p>
                <p className="text-lg font-bold text-[#2c6e3c]">
                  {p.pagesParJour} page{p.pagesParJour !== 1 ? 's' : ''}
                  <span className="text-xs font-normal text-[#9a9688]">/jour</span>
                </p>
              </div>
              <div className="bg-[#f8f6e9] rounded-2xl p-4">
                <p className="text-xs text-[#9a9688] mb-1">Durée estimée</p>
                <p className="text-lg font-bold text-[#d4a345]">{dureeLabel}</p>
              </div>
            </div>

            <div className="bg-[#f8f6e9] rounded-2xl p-4">
              <p className="text-xs text-[#9a9688] mb-1">Phase actuelle</p>
              <p className="text-sm font-semibold text-[#2c3e2d]">{phaseLabel}</p>
            </div>

            <div className="bg-[#f8f6e9] rounded-2xl p-4">
              <p className="text-xs text-[#9a9688] mb-1">Temps par session</p>
              <p className="text-sm font-semibold text-[#2c3e2d]">
                {minutesToLabel(q.minutesParJour)} · {q.joursParSemaine.length} jour{q.joursParSemaine.length > 1 ? 's' : ''}/semaine
              </p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <p className="text-xs text-amber-700 mb-0.5 font-medium">🌙 Règle du vendredi</p>
              <p className="text-xs text-amber-600">
                Pas de nouvelle page · Lecture d'Al-Kahf recommandée
              </p>
            </div>

            {p.revisionPureRequise && (
              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                <p className="text-xs text-rose-700 mb-0.5 font-medium">⚠️ Phase de révision d'abord</p>
                <p className="text-xs text-rose-600">
                  1 mois de révision pure avant toute nouvelle mémorisation
                </p>
              </div>
            )}

            <div
              className="bg-[#2c6e3c]/5 rounded-2xl p-5 text-center border border-[#2c6e3c]/10"
            >
              <p
                className="text-lg text-[#2c6e3c] mb-2 leading-relaxed"
                style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", direction: 'rtl' }}
              >
                وَلَقَدۡ يَسَّرۡنَا ٱلۡقُرۡءَانَ لِلذِّكۡرِ
              </p>
              <p className="text-xs text-[#7a8c7b] italic">
                "Nous avons facilité le Coran pour la méditation" — Al-Qamar 54:17
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-[#2c6e3c] text-white font-semibold text-sm hover:bg-[#235630] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          Commencer mon Hifz
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
