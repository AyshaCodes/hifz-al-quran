import { HifzProgress } from '../../types/hifz';
import { getSourateForPage } from '../../data/juz';
import { getTodayProgress } from '../../utils/storage';

interface Props {
  pageActuelle: number;
  progress: HifzProgress;
  onMarkDone: () => void;
  onMarkRevised: () => void;
}

export default function DailyTask({ pageActuelle, progress, onMarkDone, onMarkRevised }: Props) {
  const todayProgress = getTodayProgress(progress);
  const sourate = getSourateForPage(pageActuelle);
  const isDone = todayProgress?.pageFaite || false;
  const isRevised = todayProgress?.pageRevisee || false;

  return (
    <div className="bg-white rounded-3xl border border-[#e8e4d4] overflow-hidden">
      <div className="px-6 pt-5 pb-3 border-b border-[#f0ece0]">
        <p className="text-xs text-[#9a9688] uppercase tracking-wide font-medium mb-1">Tâche du jour</p>
        <h3 className="text-lg font-semibold text-[#2c3e2d]">
          Page {pageActuelle} — {sourate}
        </h3>
      </div>

      <div className="px-6 py-4">
        <div className="mb-4">
          <div className="flex justify-between text-xs text-[#9a9688] mb-1.5">
            <span>Progression</span>
            <span>{isDone ? '1' : '0'} / 1 page</span>
          </div>
          <div className="h-2 bg-[#f0ece0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2c6e3c] rounded-full transition-all duration-500"
              style={{ width: isDone ? '100%' : '0%' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={onMarkDone}
            disabled={isDone}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              isDone
                ? 'bg-[#2c6e3c] text-white opacity-70 cursor-default'
                : 'bg-[#2c6e3c] text-white hover:bg-[#235630] hover:shadow-md'
            }`}
          >
            {isDone ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Fait
              </>
            ) : (
              <>✓ Marquer comme fait</>
            )}
          </button>

          <button
            onClick={onMarkRevised}
            disabled={isRevised}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
              isRevised
                ? 'border-[#d4a345] text-[#d4a345] opacity-70 cursor-default'
                : 'border-[#d4a345] text-[#d4a345] hover:bg-[#d4a345]/10'
            }`}
          >
            {isRevised ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Révisé
              </>
            ) : (
              <>↺ Marquer comme révisé</>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium text-[#6b7c6c] bg-[#f8f6e9] hover:bg-[#f0ece0] transition-all border border-[#e8e4d4]">
            🎯 Tester ma mémorisation
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium text-[#6b7c6c] bg-[#f8f6e9] hover:bg-[#f0ece0] transition-all border border-[#e8e4d4]">
            📖 Ouvrir dans le lecteur
          </button>
        </div>
      </div>

      <div className="px-6 pb-5">
        <p className="text-xs text-center text-[#9a9688] italic">Constance avant intensité 🤍</p>
      </div>
    </div>
  );
}
