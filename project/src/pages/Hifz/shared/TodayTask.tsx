import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

interface Props {
  pagesToMemorize: number;
  revisionPages: number[];
  todayDone: boolean;
  onMarkDone: () => void;
  variant?: 'green' | 'blue';
  showTransliteration?: boolean;
}

export default function TodayTask({
  pagesToMemorize,
  revisionPages,
  todayDone,
  onMarkDone,
  variant = 'green',
  showTransliteration = false,
}: Props) {
  const btnClass =
    variant === 'green'
      ? 'bg-green-700 hover:bg-green-800'
      : 'bg-blue-700 hover:bg-blue-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white/90 rounded-2xl shadow-xl border border-stone-200 p-5 space-y-4"
    >
      <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
        <CheckCircle2 size={18} className={variant === 'green' ? 'text-green-700' : 'text-blue-700'} />
        Tâche du jour
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
          <div>
            <p className="text-sm font-semibold text-stone-700">
              Mémorisation : <span className="text-stone-900">{pagesToMemorize} page(s)</span>
            </p>
            {showTransliteration && (
              <p className="text-xs text-blue-600 mt-0.5">
                Translittération disponible pour chaque verset
              </p>
            )}
          </div>
          {todayDone && (
            <CheckCircle2 size={20} className="text-green-600 shrink-0" />
          )}
        </div>

        {revisionPages.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Révisions prioritaires ({revisionPages.length} page(s))
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Pages : {revisionPages.slice(0, 5).join(', ')}
                  {revisionPages.length > 5 && ` +${revisionPages.length - 5} autres`}
                </p>
              </div>
            </div>
          </div>
        )}

        {revisionPages.length === 0 && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200">
            <RotateCcw size={16} className="text-green-600 shrink-0" />
            <p className="text-sm text-green-700">Aucune révision urgente aujourd'hui.</p>
          </div>
        )}
      </div>

      {!todayDone && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onMarkDone}
          className={`w-full ${btnClass} text-white font-semibold py-3 rounded-xl transition-colors text-sm`}
        >
          Valider ma journée
        </motion.button>
      )}

      {todayDone && (
        <div className="text-center py-2 text-green-700 font-semibold text-sm">
          MashaAllah ! Journée validée.
        </div>
      )}
    </motion.div>
  );
}
