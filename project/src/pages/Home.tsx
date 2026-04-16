import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Star, ChevronRight, Moon, UserRound, TrendingUp, 
  BellRing, ArrowRight, BarChart3, Target, Clock, Award, Zap, Heart, 
  Sparkles, Volume2, Gem 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { UserProfile, DailyProgress } from '../types';
import { getCurrentTargetPage, getTodayStr, getDailyMemoGoal } from '../lib/hifzSchedule';

// ------------------------- Données statiques -------------------------
const quranicVerses = [
  { arabic: 'وَٱذْكُر رَّبَّكَ فِي نَفْسِكَ تَضَرُّعًا وَخِيفَةً', french: 'Et invoque ton Seigneur en ton âme, avec humilité et crainte.', ref: 'Al-A‘rāf 7:205' },
  { arabic: 'إِنَّ هَـٰذَا ٱلْقُرْءَانَ يَهْدِى لِلَّتِى هِىَ أَقْوَمُ', french: 'Ce Coran guide vers ce qu’il y a de plus droit.', ref: 'Al-Isrā 17:9' },
  { arabic: 'وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا', french: 'Et récite le Coran lentement et clairement.', ref: 'Al-Muzzammil 73:4' },
  { arabic: 'ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ', french: 'Ceux qui ont cru, et dont les cœurs se tranquillisent par le rappel d’Allah.', ref: 'Ar-Ra‘d 13:28' }
];

const features = [
  { icon: BookOpen, title: 'Lire le Coran', desc: 'Parcourez les 114 sourates avec traduction et audio.', path: '/lire', color: 'emerald' },
  { icon: Star, title: 'Mon Hifz', desc: 'Planifiez votre mémorisation et suivez vos progrès.', path: '/hifz', color: 'amber' },
  { icon: Volume2, title: 'Écouter & Apprendre', desc: 'Écoutez la récitation de grands qaris.', path: '/lecture', color: 'teal' },
];

const steps = [
  { icon: UserRound, title: 'Créez votre profil', desc: 'Définissez votre juz actuel et votre objectif quotidien.' },
  { icon: TrendingUp, title: 'Mémorisez chaque jour', desc: 'Validez vos pages mémorisées et suivez votre progression.' },
  { icon: BellRing, title: 'Révisez intelligemment', desc: 'Notre algorithme vous rappelle les pages à réviser.' },
];

const achievements = [
  { id: 1, title: 'Premier pas', icon: Award, description: 'Compléter votre première journée', unlocked: true },
  { id: 2, title: 'Semaine en or', icon: Zap, description: '7 jours consécutifs', unlocked: false },
  { id: 3, title: 'Juz accompli', icon: Gem, description: 'Mémoriser un Juz complet', unlocked: false },
  { id: 4, title: 'Al-Hafidh', icon: Award, description: '30 jours de révision active', unlocked: false },
];

// ------------------------- Utilitaires -------------------------
const calculateStreak = (progressData: DailyProgress[]): number => {
  if (progressData.length === 0) return 0;
  const sorted = [...progressData]
    .filter(p => p.completed || p.lastReviewedAt === p.date)
    .sort((a, b) => b.date.localeCompare(a.date));
  if (sorted.length === 0) return 0;
  let streak = 0;
  let currentDate = new Date();
  for (const entry of sorted) {
    const entryDate = new Date(entry.date);
    const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (86400000));
    if (diffDays === streak) { streak++; currentDate = entryDate; } else break;
  }
  return streak;
};

const calculateProgressPercentage = (profile: UserProfile, progressData: DailyProgress[]): number => {
  const startPage = ((profile.juzActuel || 1) - 1) * 20 + 1;
  const completedPages = progressData.filter(p => p.completed).length;
  const totalPages = 604 - startPage + 1;
  return Math.min(Math.round((completedPages / totalPages) * 100), 100);
};

// ------------------------- Composant principal -------------------------
export default function Home() {
  const navigate = useNavigate();
  const [profile] = useLocalStorage<UserProfile | null>('hifz-profile', null);
  const [progress] = useLocalStorage<DailyProgress[]>('hifz-progress', []);
  const [dailyVerse, setDailyVerse] = useState(quranicVerses[0]);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.2]);

  useEffect(() => {
    // Verse aléatoire chaque jour (change à chaque montage, mais pourrait être basé sur la date)
    const randomIndex = Math.floor(Math.random() * quranicVerses.length);
    setDailyVerse(quranicVerses[randomIndex]);
  }, []);

  const userStats = profile ? {
    currentPage: getCurrentTargetPage(profile, progress),
    todayGoal: getDailyMemoGoal(profile, getTodayStr()),
    completedDays: progress.filter(p => p.completed).length,
    streak: calculateStreak(progress),
    progressPercentage: calculateProgressPercentage(profile, progress),
    totalPages: 604 - ((profile.juzActuel || 1) - 1) * 20
  } : null;

  const chartData = progress.slice(-30).map((p, idx) => ({
    day: `J${idx + 1}`,
    pages: p.completed ? 1 : 0,
  }));
  const pieData = [
    { name: 'Réussi', value: progress.filter(p => p.completed).length, color: '#2c6e3c' },
    { name: 'Non fait', value: progress.filter(p => !p.completed).length, color: '#e5e7eb' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Motif de fond islamique (subtile) */}
      <div className="fixed inset-0 pointer-events-none opacity-5 dark:opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23000000' d='M50 0 L100 50 L50 100 L0 50 Z' /%3E%3C/svg%3E")`, backgroundSize: '40px' }} />
      
      {/* Hero section avec effet de parallaxe */}
      <motion.section style={{ opacity: heroOpacity }} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/70 to-amber-900/60 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 z-0" />
        <div className="absolute inset-0 z-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 1.5] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
              className="absolute rounded-full bg-amber-300/20 blur-3xl"
              style={{ width: `${80 + i * 20}px`, height: `${80 + i * 20}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-white mb-6 border border-white/20">
              <Moon className="w-4 h-4 text-amber-300" />
              <span>بسم الله الرحمن الرحيم</span>
            </span>
          </motion.div>
          
          <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="font-arabic text-6xl md:text-8xl text-white drop-shadow-2xl mb-4">
            حِفْظُ القُرْآنِ
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="font-amiri text-2xl md:text-3xl text-amber-200 mb-6">
            Votre compagnon de mémorisation
          </motion.p>
          
          {profile && userStats ? (
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
              <StatsCard label="Page actuelle" value={userStats.currentPage} icon={Target} />
              <StatsCard label="Progression" value={`${userStats.progressPercentage}%`} icon={BarChart3} />
              <StatsCard label="Série" value={`${userStats.streak} jours`} icon={Clock} />
              <StatsCard label="Objectif du jour" value={`${userStats.todayGoal} page${userStats.todayGoal > 1 ? 's' : ''}`} icon={Star} />
            </motion.div>
          ) : (
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex gap-4 justify-center">
              <button onClick={() => navigate('/hifz')} className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transition-all flex items-center gap-2 text-lg">
                Commencer mon Hifz <ChevronRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/lire')} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-full transition-all flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Lire le Coran
              </button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Verset du jour */}
      <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-20">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-amber-200/50 dark:border-amber-800/30 text-center">
          <p className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">✨ Verset du jour</p>
          <p className="font-arabic text-2xl md:text-3xl text-gray-800 dark:text-gray-100 leading-loose" dir="rtl">{dailyVerse.arabic}</p>
          <p className="italic text-gray-600 dark:text-gray-300 mt-3 text-sm">{dailyVerse.french}</p>
          <p className="text-xs text-amber-500 mt-2">{dailyVerse.ref}</p>
        </motion.div>
      </div>

      {/* Section Fonctionnalités */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="font-amiri text-4xl text-emerald-700 dark:text-emerald-400">Une expérience complète</motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-gray-500 dark:text-gray-400">Outils pensés pour faciliter votre mémorisation</motion.p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.button key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }} onClick={() => navigate(f.path)} className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all text-left border border-gray-100 dark:border-gray-700">
              <div className={`w-12 h-12 rounded-full bg-${f.color}-100 dark:bg-${f.color}-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                <f.icon className={`w-6 h-6 text-${f.color}-600 dark:text-${f.color}-400`} />
              </div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{f.desc}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="py-16 bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-amiri text-3xl text-emerald-700 dark:text-emerald-400">En trois étapes simples</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative text-center">
                <div className="w-20 h-20 rounded-full bg-amber-500/20 dark:bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{s.desc}</p>
                {i < 2 && <ArrowRight className="hidden md:block absolute top-1/3 -right-6 w-5 h-5 text-gray-400" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Progression visuelle (si profil existant) */}
      {profile && progress.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-amiri text-3xl text-emerald-700 dark:text-emerald-400">Votre cheminement</h2>
            <p className="text-gray-500 dark:text-gray-400">Visualisez vos efforts et votre régularité</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Progression quotidienne</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="pages" stroke="#2c6e3c" strokeWidth={3} dot={{ fill: '#2c6e3c', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Taux de complétion</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={80} label>
                      {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {pieData.map((entry, idx) => <div key={idx} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} /><span className="text-sm">{entry.name}</span></div>)}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Achievements */}
      {profile && (
        <section className="py-16 bg-white/50 dark:bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="font-amiri text-3xl text-emerald-700 dark:text-emerald-400">Vos accomplissements</h2>
              <p className="text-gray-500 dark:text-gray-400">Chaque effort compte</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((ach, idx) => (
                <motion.div key={ach.id} initial={{ opacity: 0, rotateY: 90 }} whileInView={{ opacity: 1, rotateY: 0 }} transition={{ delay: idx * 0.1 }} className={`text-center p-4 rounded-xl ${ach.unlocked ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' : 'opacity-50'}`}>
                  <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${ach.unlocked ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                    <ach.icon className="w-8 h-8" />
                  </div>
                  <p className="font-medium mt-3 text-gray-800 dark:text-gray-200">{ach.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{ach.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA finale */}
      <section className="py-20 max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-emerald-700 to-amber-700 rounded-3xl p-10 shadow-2xl text-white">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-amber-300" />
          <p className="font-arabic text-2xl mb-2">رَبِّ زِدْنِي عِلْمًا</p>
          <p className="italic mb-6">"Seigneur, augmente mes connaissances" (20:114)</p>
          <button onClick={() => navigate('/hifz')} className="bg-white text-emerald-800 hover:bg-amber-100 font-bold py-3 px-8 rounded-full transition-all inline-flex items-center gap-2 shadow-lg">
            Démarrer mon programme <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </section>
    </div>
  );
}

// Composant utilitaire pour les cartes de stats
function StatsCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:scale-105 transition">
      <div className="flex items-center justify-center gap-2 text-amber-300 mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}