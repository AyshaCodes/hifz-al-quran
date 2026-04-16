import { HifzProgress } from '../../types/hifz';
import { getPagesNotRevisedSince } from '../../utils/storage';

interface Props {
  progress: HifzProgress;
  pageActuelle: number;
  onRevise: () => void;
}

export default function ReminderCard({ progress, pageActuelle, onRevise }: Props) {
  const unrevisedPages = getPagesNotRevisedSince(progress, pageActuelle, 3);

  if (unrevisedPages.length === 0) return null;

  return (
    <div className="bg-amber-50 rounded-3xl border border-amber-200 px-6 py-5">
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">⚠️</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800 mb-1">Révision recommandée</p>
          <p className="text-xs text-amber-700 mb-3">
            {unrevisedPages.length === 1
              ? `La page ${unrevisedPages[0]} n'a pas été révisée depuis 3 jours`
              : `${unrevisedPages.length} pages n'ont pas été révisées depuis 3 jours`}
          </p>
          <button
            onClick={onRevise}
            className="px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-xl hover:bg-amber-600 transition-all"
          >
            Réviser maintenant
          </button>
        </div>
      </div>
    </div>
  );
}
