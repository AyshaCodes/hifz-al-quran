import { motion } from 'framer-motion';
import { Settings, Award, Languages, BookOpen, Target, Flame, Clock, ChevronRight } from 'lucide-react';
import { GuidedProfile, DailyProgress } from '../../../types/hifz';
import { getRevisionPages, getWeeklyStreak, getTodayString } from '../../../lib/revisionHelper';
import MotivationalQuote from '../Shared/MotivationalQuote';
import { StatCards } from '../Shared/StatCards';
import ProgressChart from '../Shared/ProgressChart';
import TodayTask from '../Shared/TodayTask';
import WeeklyCalendar from '../Shared/WeeklyCalendar';
import WeeklyPlan from '../Shared/WeeklyPlan';
import { useRouter } from '../../../hooks/useRouter';

interface Props {
  profile: GuidedProfile;
  progress: DailyProgress[];
  onMarkDone: (pages: number) => void;
  onAdjust: () => void;
  onReset: () => void;
}

function getPagesPerDayFromProfile(profile: GuidedProfile): number {
  if (profile.pace === 'slow') return 0.25;
  if (profile.pace === 'moderate') return 0.5;
  if (profile.pace === 'intense') return 1;
  return profile.customPagesPerDay ?? 1;
}

const LEVEL_LABELS: Record<GuidedProfile['level'], string> = {
  'non-arabic': 'Non arabophone',
  'beginner': 'Débutant',
  'intermediate': 'Intermédiaire',
  'advanced': 'Avancé',
  'hafiz': 'Hafiz',
};

export default function GuidedDashboard({ profile, progress, onMarkDone, onAdjust, onReset }: Props) {
  const { navigate } = useRouter();
  const today = getTodayString();
  const todayEntry = progress.find((p) => p.date === today);
  const todayDone = todayEntry?.completed ?? false;

  const pagesPerDay = getPagesPerDayFromProfile(profile);
  const totalCompleted = progress.filter((p) => p.completed).reduce((a, p) => a + p.pagesDone, 0);
  const streak = getWeeklyStreak(progress);
  const revisionPages = getRevisionPages(progress, today);

  const totalPages = 604;
  const pct = Math.round((totalCompleted / totalPages) * 100);

  const statCards = [
    {
      label: 'Niveau',
      value: LEVEL_LABELS[profile.level],
      sub: 'Arabe',
      icon: <BookOpen size={18} className="text-white" />,
      color: 'bg-blue-700',
    },
    {
      label: 'Progression',
      value: `${pct}%`,
      sub: `${totalCompleted} / ${totalPages} pages`,
      icon: <Target size={18} className="text-white" />,
      color: 'bg-teal-600',
    },
    {
      label: 'Série actuelle',
      value: `${streak} j`,
      sub: 'Jours consécutifs',
      icon: <Flame size={18} className="text-white" />,
      color: 'bg-orange-500',
    },
    {
      label: 'Objectif / jour',
      value: `${pagesPerDay}p`,
      sub: `${profile.daysPerWeek}j/semaine`,
      icon: <Clock size={18} className="text-white" />,
      color: 'bg-sky-600',
    },
  ];

  const handleMarkDone = () => {
    onMarkDone(pagesPerDay);
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
              Assalamu Alaikum, {profile.name}
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
              onClick={onAdjust}
              className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
              title="Ajuster mon rythme"
            >
              <Settings size={16} />
            </motion.button>
          </div>
        </motion.div>

        {profile.needsTransliteration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3"
          >
            <Languages size={18} className="text-blue-700 shrink-0" />
            <p className="text-sm text-blue-800">
              Mode translittération activé — chaque verset s'affichera avec sa prononciation phonétique.
            </p>
          </motion.div>
        )}

        <MotivationalQuote variant="blue" />

        <StatCards cards={statCards} />

        <TodayTask
          pagesToMemorize={pagesPerDay}
          revisionPages={revisionPages}
          todayDone={todayDone}
          onMarkDone={handleMarkDone}
          variant="blue"
          showTransliteration={profile.needsTransliteration}
        />

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/lire')}
          className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/80 backdrop-blur-md border-2 border-blue-100/50 shadow-xl group transition-all"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:rotate-3 transition-transform">
              <BookOpen size={28} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-stone-800">Réviser mes sourates</h3>
              <p className="text-sm text-stone-500">Ouvrir le Saint Coran pour ma lecture quotidienne</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <ChevronRight size={20} />
          </div>
        </motion.button>

        <WeeklyCalendar progress={progress} variant="blue" />

        <WeeklyPlan
          daysPerWeek={profile.daysPerWeek}
          pagesPerDay={pagesPerDay}
          variant="blue"
        />

        <ProgressChart progress={progress} variant="blue" />

        <div className="flex flex-col sm:flex-row gap-3 pb-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAdjust}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-700
              hover:bg-blue-800 text-white font-semibold text-sm transition-colors"
          >
            <Settings size={15} />
            Ajuster mon rythme
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-200
              hover:bg-stone-300 text-stone-700 font-semibold text-sm transition-colors"
          >
            Réinitialiser
          </motion.button>
        </div>
      </div>
    </div>
  );
}
