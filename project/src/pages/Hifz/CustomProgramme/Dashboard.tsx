import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Award, RefreshCw } from 'lucide-react';
import { UserProfile, DailyProgress } from '../../../types/hifz';
import { getRevisionPages, getWeeklyStreak, getTodayString } from '../../../lib/revisionHelper';
import MotivationalQuote from '../shared/MotivationalQuote';
import { StatCards, buildCustomStatCards } from '../shared/StatCards';
import ProgressChart from '../shared/ProgressChart';
import TodayTask from '../shared/TodayTask';
import WeeklyCalendar from '../shared/WeeklyCalendar';
import WeeklyPlan from '../shared/WeeklyPlan';

interface Props {
  profile: UserProfile;
  progress: DailyProgress[];
  onMarkDone: (pages: number, quality: 'fluent' | 'hesitant' | 'hard') => void;
  onReset: () => void;
}

const QUALITY_OPTIONS: { value: 'fluent' | 'hesitant' | 'hard'; label: string; color: string }[] = [
  { value: 'fluent', label: 'Fluide', color: 'bg-green-600 hover:bg-green-700' },
  { value: 'hesitant', label: 'Hésitant', color: 'bg-amber-500 hover:bg-amber-600' },
  { value: 'hard', label: 'Difficile', color: 'bg-red-500 hover:bg-red-600' },
];

export default function Dashboard({ profile, progress, onMarkDone, onReset }: Props) {
  const [showQuality, setShowQuality] = useState(false);
  const today = getTodayString();
  const todayEntry = progress.find((p) => p.date === today);
  const todayDone = todayEntry?.completed ?? false;

  const totalCompleted = progress.filter((p) => p.completed).reduce((a, p) => a + p.pagesDone, 0);
  const streak = getWeeklyStreak(progress);
  const revisionPages = getRevisionPages(progress, today);

  const pagesPerDay = Math.max(1, Math.round(profile.tempsParJour / 20));
  const daysPerWeek = profile.objectif ? 5 : 5;

  const statCards = buildCustomStatCards(
    profile.juzActuel,
    totalCompleted,
    streak,
    pagesPerDay
  );

  const handleMarkDone = () => setShowQuality(true);
  const handleQuality = (q: 'fluent' | 'hesitant' | 'hard') => {
    onMarkDone(pagesPerDay, q);
    setShowQuality(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-stone-800">
              Assalamu Alaikum, {profile.prenom}
            </h1>
            <p className="text-sm text-stone-500 mt-0.5">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-100 px-3 py-1.5 rounded-full">
              <Award size={14} className="text-amber-600" />
              <span className="text-xs font-bold text-amber-700">{streak} j</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="p-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-600 transition-colors"
              title="Réinitialiser"
            >
              <RefreshCw size={16} />
            </motion.button>
          </div>
        </motion.div>

        <MotivationalQuote variant="green" />

        <StatCards cards={statCards} />

        <TodayTask
          pagesToMemorize={pagesPerDay}
          revisionPages={revisionPages}
          todayDone={todayDone}
          onMarkDone={handleMarkDone}
          variant="green"
        />

        <AnimatePresence>
          {showQuality && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/90 rounded-2xl shadow-xl border border-stone-200 p-5"
            >
              <h3 className="text-base font-bold text-stone-800 mb-3">
                Comment s'est passée la séance ?
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {QUALITY_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleQuality(opt.value)}
                    className={`${opt.color} text-white font-semibold py-3 rounded-xl text-sm transition-colors`}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setShowQuality(false)}
                className="w-full mt-2 text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                Annuler
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <WeeklyCalendar progress={progress} variant="green" />

        <WeeklyPlan daysPerWeek={daysPerWeek} pagesPerDay={pagesPerDay} variant="green" />

        <ProgressChart progress={progress} variant="green" />

        <div className="flex justify-center pb-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300
              text-stone-700 font-medium text-sm transition-colors"
          >
            <LogOut size={15} />
            Réinitialiser le programme
          </motion.button>
        </div>
      </div>
    </div>
  );
}
