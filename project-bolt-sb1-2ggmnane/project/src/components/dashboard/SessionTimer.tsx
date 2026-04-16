import { useState, useEffect, useRef } from 'react';
import { formatDuration } from '../../utils/calculations';

interface Props {
  onSessionEnd: (seconds: number) => void;
}

type TimerState = 'idle' | 'niyya' | 'running' | 'paused';

export default function SessionTimer({ onSessionEnd }: Props) {
  const [state, setState] = useState<TimerState>('idle');
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state]);

  const handleStart = () => setState('niyya');

  const handleConfirm = () => {
    setState('running');
    setSeconds(0);
  };

  const handlePause = () => setState('paused');

  const handleResume = () => setState('running');

  const handleStop = () => {
    if (seconds > 0) onSessionEnd(seconds);
    setState('idle');
    setSeconds(0);
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-[#e8e4d4] px-6 py-5">
        <p className="text-xs text-[#9a9688] uppercase tracking-wide font-medium mb-4">
          Session de mémorisation
        </p>

        {state === 'idle' && (
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-[#f8f6e9] border-2 border-dashed border-[#d4a345]/50 text-[#d4a345] font-semibold text-sm hover:bg-[#d4a345]/5 hover:border-[#d4a345] transition-all"
          >
            Démarrer la session
          </button>
        )}

        {(state === 'running' || state === 'paused') && (
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-[#2c3e2d] mb-4 tracking-wider">
              {formatDuration(seconds)}
            </div>
            <div className="flex gap-3 justify-center">
              {state === 'running' ? (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f8f6e9] text-[#2c3e2d] text-sm font-medium border border-[#e8e4d4] hover:bg-[#f0ece0] transition-all"
                >
                  ⏸ Pause
                </button>
              ) : (
                <button
                  onClick={handleResume}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2c6e3c] text-white text-sm font-medium hover:bg-[#235630] transition-all"
                >
                  ▶ Reprendre
                </button>
              )}
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100 hover:bg-rose-100 transition-all"
              >
                ⏹ Terminer
              </button>
            </div>
          </div>
        )}
      </div>

      {state === 'niyya' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <p
              className="text-2xl text-[#2c6e3c] mb-3 leading-loose"
              style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", direction: 'rtl' }}
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <p className="text-[#7a8c7b] text-sm mb-6 leading-relaxed">
              Mémorisez pour Allah uniquement 🤍
              <br />
              <span className="text-xs italic">
                Purifiez votre intention avant de commencer
              </span>
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleConfirm}
                className="w-full py-3.5 rounded-xl bg-[#2c6e3c] text-white font-semibold text-sm hover:bg-[#235630] transition-all"
              >
                Commencer avec Bismillah
              </button>
              <button
                onClick={() => setState('idle')}
                className="w-full py-2.5 rounded-xl text-[#9a9688] text-sm hover:text-[#2c3e2d] hover:bg-[#f8f6e9] transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
