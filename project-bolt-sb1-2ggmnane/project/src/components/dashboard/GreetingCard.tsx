import { HifzProfile } from '../../types/hifz';
import { getDaysUntilObjectif } from '../../utils/calculations';

interface Props {
  profile: HifzProfile;
  pageActuelle: number;
}

export default function GreetingCard({ profile, pageActuelle }: Props) {
  const { questionnaire: q, programme: p } = profile;
  const juzActuel = Math.ceil(pageActuelle / 20);
  const daysLeft = q.aDateObjectif && q.dateObjectif ? getDaysUntilObjectif(q.dateObjectif) : null;

  return (
    <div className="bg-[#2c6e3c] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />

      <div className="relative">
        <p
          className="text-2xl sm:text-3xl mb-1 font-light"
          style={{ fontFamily: "'Amiri', serif", direction: 'rtl' }}
        >
          السلام عليكم {q.prenom} 🤍
        </p>
        <p className="text-[#a8d4b4] text-sm mt-2 mb-5">Que Allah facilite votre chemin</p>

        <div className="flex flex-wrap gap-3">
          {daysLeft !== null && (
            <div className="bg-white/10 rounded-xl px-4 py-2">
              <span className="text-[#d4a345] font-bold text-lg">{daysLeft}</span>
              <span className="text-white/70 text-xs ml-1">jours restants</span>
            </div>
          )}
          <div className="bg-white/10 rounded-xl px-4 py-2">
            <span className="text-[#d4a345] font-bold text-lg">Juz {juzActuel}</span>
            <span className="text-white/70 text-xs ml-1">en cours</span>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2">
            <span className="text-[#d4a345] font-bold text-lg">{p.pagesParJour}</span>
            <span className="text-white/70 text-xs ml-1">page{p.pagesParJour > 1 ? 's' : ''}/jour</span>
          </div>
        </div>
      </div>
    </div>
  );
}
