import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Award, RefreshCw, BookOpen, ChevronRight, Bell, Lightbulb, TrendingUp } from 'lucide-react';
import { UserProfile, DailyProgress } from '../../../types/hifz';
import { getRevisionPages, getWeeklyStreak, getTodayString } from '../../../lib/revisionHelper';
import MotivationalQuote from '../Shared/MotivationalQuote';
import { StatCards, buildCustomStatCards } from '../Shared/StatCards';
import ProgressChart from '../Shared/ProgressChart';
import TodayTask from '../Shared/TodayTask';
import WeeklyCalendar from '../Shared/WeeklyCalendar';
import WeeklyPlan from '../Shared/WeeklyPlan';
import { useRouter } from '../../../hooks/useRouter';

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

const TIPS = [
  "Révisez vos nouvelles pages juste avant de dormir pour une meilleure consolidation.",
  "La récitation à voix haute aide à ancrer la mémorisation auditive.",
  "N'oubliez pas d'écouter la récitation d'un Qari pour parfaire votre Tajwid.",
  "La régularité est plus importante que la quantité. Même un verset par jour compte.",
];

export default function Dashboard({ profile, progress, onMarkDone, onReset }: Props) {
  const { navigate } = useRouter();
  const [showQuality, setShowQuality] = useState(false);
  const [activeTip, setActiveTip] = useState(() => Math.floor(Math.random() * TIPS.length));
  
  const today = getTodayString();
  const todayEntry = progress.find((p) => p.date === today);
  const todayDone = todayEntry?.completed ?? false;

  const totalCompleted = progress.filter((p) => p.completed).reduce((a, p) => a + p.pagesDone, 0);
  const streak = getWeeklyStreak(progress);
  const revisionPages = getRevisionPages(progress, today);

  const pagesPerDay = profile.pagesParJour || 1;
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
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-stone-800">
              Assalamu Alaikum, {profile.prenom}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-stone-500">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">
                {profile.direction === 'fatiha-nas' ? 'Fatiha → Nas' : 'Nas → Fatiha'}
              </p>
            </div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-2"
          >
            <StatCards cards={statCards} />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-primary-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-center"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/20 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-gold-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-200">Conseil du jour</span>
            </div>
            <p className="text-xs leading-relaxed text-primary-50 italic">
              "{TIPS[activeTip]}"
            </p>
          </motion.div>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <WeeklyCalendar progress={progress} variant="green" />
          <div className="space-y-5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Rediriger vers la sourate actuelle si elle existe
                if (profile.juzActuel) {
                  navigate(`/lire?surah=${profile.juzActuel * 4 - 3}`); // Approximation simple Juz -> Sourate
                } else {
                  navigate('/lire');
                }
              }}
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-stone-200 shadow-lg group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-600/20">
                  <BookOpen size={20} />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-stone-800">Réviser mes sourates</h3>
                  <p className="text-[10px] text-stone-500">Ouvrir le Saint Coran</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-stone-400 group-hover:text-green-600 transition-colors" />
            </motion.button>
            
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-stone-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-stone-800">Rappels actifs</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-stone-500 font-medium">Lecture Fajr</span>
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">05:30</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-stone-500 font-medium">Mémorisation soir</span>
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">21:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
