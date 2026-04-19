import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  BookOpen, Star, ChevronRight, Moon, UserRound, TrendingUp,
  BellRing, ArrowRight, Award, Zap,
  Shield, Volume2, Sparkles, Gem
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useRouter } from '../hooks/useRouter';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { UserProfile, DailyProgress } from '../types';
import { getCurrentTargetPage, getTodayStr, getDailyMemoGoal } from '../lib/hifzSchedule';

// ------------------------- Données -------------------------
const quranicVerses = [
  { arabic: 'وَٱذْكُر رَّبَّكَ فِي نَفْسِكَ تَضَرُّعًا وَخِيفَةً', french: 'Et invoque ton Seigneur en ton âme, avec humilité et crainte.', ref: 'Al-A‘rāf 7:205' },
  { arabic: 'إِنَّ هَـٰذَا ٱلْقُرْءَانَ يَهْدِى لِلَّتِى هِىَ أَقْوَمُ', french: 'Ce Coran guide vers ce qu’il y a de plus droit.', ref: 'Al-Isrā 17:9' },
  { arabic: 'وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا', french: 'Et récite le Coran lentement et clairement.', ref: 'Al-Muzzammil 73:4' },
  { arabic: 'ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ', french: 'Ceux qui ont cru, et dont les cœurs se tranquillisent par le rappel d’Allah.', ref: 'Ar-Ra‘d 13:28' }
];

const features = [
  { icon: BookOpen, title: 'Lire le Coran', desc: 'Parcourez les 114 sourates avec traduction et audio.', path: '/lire', bgColor: 'bg-primary-50 dark:bg-primary-900/30', iconColor: 'text-primary-700 dark:text-primary-400' },
  { icon: Star, title: 'Mon Hifz', desc: 'Planifiez votre mémorisation et suivez vos progrès.', path: '/hifz', bgColor: 'bg-gold-50 dark:bg-gold-900/30', iconColor: 'text-gold-700 dark:text-gold-400' },
  { icon: Volume2, title: 'Écouter & Apprendre', desc: 'Écoutez la récitation de grands qaris.', path: '/lire', bgColor: 'bg-stone-50 dark:bg-stone-800/50', iconColor: 'text-stone-700 dark:text-stone-300' },
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
  { id: 4, title: 'Al-Hafidh', icon: Shield, description: '30 jours de révision active', unlocked: false },
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
    const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / 86400000);
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
  const { navigate } = useRouter();
  const [profile] = useLocalStorage<UserProfile | null>('hifz-profile', null);
  const [progress] = useLocalStorage<DailyProgress[]>('hifz-progress', []);
  const [dailyVerse, setDailyVerse] = useState(quranicVerses[0]);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.2]);

  useEffect(() => {
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

  const chartData = progress.slice(-30).map((p, idx) => ({ day: `J${idx + 1}`, pages: p.completed ? 1 : 0 }));
  const pieData = [
    { name: 'Réussi', value: progress.filter(p => p.completed).length, color: '#2d6a4f' },
    { name: 'Non fait', value: progress.filter(p => !p.completed).length, color: '#d4d4d8' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-blue-950 dark:via-gray-900 dark:to-blue-950">
      {/* Hero section */}
      <motion.section style={{ opacity: heroOpacity }} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-blue-900/70 dark:from-blue-950 dark:via-gray-900 dark:to-blue-950 z-0" />
        
        {/* Cercles lumineux discrets */}
        <div className="absolute inset-0 z-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.2, 0], scale: [0, 1, 1.2] }}
              transition={{ duration: 6 + i * 0.8, repeat: Infinity, delay: i * 0.5 }}
              className="absolute rounded-full bg-white/10 blur-3xl"
              style={{ width: `${140 + i * 40}px`, height: `${140 + i * 40}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-white mb-6 border border-white/20">
              <Moon className="w-4 h-4 text-stone-300" />
              <span>بسم الله الرحمن الرحيم</span>
            </span>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
            className="font-arabic text-4xl xs:text-5xl md:text-8xl text-white drop-shadow-2xl mb-6 leading-tight font-normal"
          >
            حِفْظُ القُرْآنِ
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} 
            className="font-amiri text-2xl md:text-4xl text-stone-200 mb-10 md:mb-14 drop-shadow-lg tracking-wide"
          >
            Votre compagnon de mémorisation
          </motion.p>

          {profile && userStats ? (
            <motion.div 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} 
              className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center"
            >
              <button onClick={() => navigate('/hifz')} className="btn-premium w-full sm:w-auto px-10 md:px-14 py-4 md:py-5 text-lg md:text-xl justify-center group">
                Continuer mon Hifz 
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/lire')} className="btn-secondary w-full sm:w-auto px-10 md:px-14 py-4 md:py-5 text-lg md:text-xl justify-center group">
                <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                Lire le Coran
              </button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} 
              className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center"
            >
              <button onClick={() => navigate('/hifz')} className="btn-premium w-full sm:w-auto px-10 md:px-14 py-4 md:py-5 text-lg md:text-xl justify-center group">
                Commencer mon Hifz 
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/lire')} className="btn-secondary w-full sm:w-auto px-10 md:px-14 py-4 md:py-5 text-lg md:text-xl justify-center group">
                <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                Lire le Coran
              </button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Verset du jour */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-20">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="premium-card p-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-primary-600 dark:text-primary-400 mb-6">✨ Verset du jour</p>
          <p className="font-arabic text-xl sm:text-2xl text-gray-800 dark:text-gray-100 leading-[3] mb-8 font-normal" dir="rtl">{dailyVerse.arabic}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary-200 dark:via-primary-800 to-transparent mx-auto mb-8 rounded-full" />
          <p className="font-amiri text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-[2] italic">« {dailyVerse.french} »</p>
          <p className="text-xs font-medium text-stone-400 dark:text-stone-500 mt-6 tracking-widest">— {dailyVerse.ref}</p>
        </motion.div>
      </div>

      {/* Section Fonctionnalités */}
      <section className="section-container relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="text-center relative z-10">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title">Une expérience complète</motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-subtitle">Outils pensés pour faciliter votre mémorisation</motion.p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {features.map((f, i) => (
            <motion.button 
              key={f.title} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }} 
              whileHover={{ y: -10, scale: 1.02 }} 
              onClick={() => navigate(f.path)} 
              className="group premium-card p-8 text-left border-none shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/5 to-transparent rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700" />
              <div className={`w-14 h-14 rounded-2xl ${f.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <f.icon className={`w-7 h-7 ${f.iconColor}`} />
              </div>
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-3">{f.title}</h3>
              <p className="text-stone-500 dark:text-stone-400 leading-relaxed">{f.desc}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Nouveauté : Section Programmes */}
      <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-8"
            >
              <h2 className="section-title text-left">Choisissez votre rythme de mémorisation</h2>
              <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed">
                Que vous soyez débutant ou que vous souhaitiez reprendre votre mémorisation, nous avons le programme qu'il vous faut.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 p-6 rounded-3xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                  <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shrink-0">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white mb-1">Programme Personnalisé</h4>
                    <p className="text-sm text-stone-500 dark:text-stone-400">Établi selon votre niveau, vos objectifs et votre temps.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 rounded-3xl bg-gold-50 dark:bg-gold-900/20 border border-gold-100 dark:border-gold-800/30">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white mb-1">Programme Guidé</h4>
                    <p className="text-sm text-stone-500 dark:text-stone-400">Suivez un rythme structuré et progressez rapidement.</p>
                  </div>
                </div>
              </div>
              <button onClick={() => navigate('/hifz')} className="btn-premium group">
                Explorer les programmes <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative"
            >
              <div className="absolute inset-0 bg-primary-500/10 blur-[100px] rounded-full" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="premium-card p-6 bg-white dark:bg-gray-900 shadow-2xl rotate-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                      <TrendingUp className="w-5 h-5 text-primary-600" />
                    </div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Progression</p>
                    <div className="h-2 w-full bg-stone-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-primary-500 rounded-full" />
                    </div>
                  </div>
                  <div className="premium-card p-6 bg-white dark:bg-gray-900 shadow-2xl -rotate-2">
                    <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/50 flex items-center justify-center mb-4">
                      <Award className="w-5 h-5 text-gold-500" />
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">Nouveau badge !</p>
                    <p className="text-[10px] text-stone-400 uppercase">Semaine en or</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="premium-card p-6 bg-white dark:bg-gray-900 shadow-2xl -rotate-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                      <Moon className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">Rappel Fajr</p>
                    <p className="text-[10px] text-stone-400 uppercase">Lecture quotidienne</p>
                  </div>
                  <div className="premium-card p-6 bg-white dark:bg-gray-900 shadow-2xl rotate-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">Sourate Al-Mulk</p>
                    <p className="text-[10px] text-stone-400 uppercase">Page 562</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="py-24 bg-stone-100/50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">En trois étapes simples</h2>
            <p className="section-subtitle">Commencez votre voyage spirituel aujourd'hui</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="relative text-center group">
                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 border border-stone-100 dark:border-gray-700">
                  <s.icon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-4">{s.title}</h3>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed">{s.desc}</p>
                {i < 2 && <ArrowRight className="hidden lg:block absolute top-1/4 -right-6 w-8 h-8 text-stone-300 dark:text-stone-700" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Progression visuelle */}
      {profile && progress.length > 0 && (
        <section className="section-container">
          <div className="text-center">
            <h2 className="section-title">Votre cheminement</h2>
            <p className="section-subtitle">Visualisez vos efforts et votre régularité</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="premium-card p-8 shadow-lg">
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-6">Progression quotidienne</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="day" stroke="#9ca3af" axisLine={false} tickLine={false} />
                    <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="pages" stroke="#16a34a" strokeWidth={4} dot={{ fill: '#16a34a', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="premium-card p-8 shadow-lg">
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-6">Taux de complétion</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={5} label>
                      {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-8 mt-6">
                {pieData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm font-medium text-stone-600 dark:text-stone-400">{entry.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Achievements */}
      {profile && (
        <section className="py-24 bg-stone-50 dark:bg-gray-900/30">
          <div className="section-container">
            <div className="text-center">
              <h2 className="section-title">Vos accomplissements</h2>
              <p className="section-subtitle">Chaque effort compte dans votre parcours</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {achievements.map((ach, idx) => (
                <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} className={`text-center p-8 premium-card ${ach.unlocked ? 'border-primary-100 dark:border-primary-900/30' : 'opacity-60 grayscale'}`}>
                  <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${ach.unlocked ? 'green-gradient text-white shadow-xl shadow-primary-600/20' : 'bg-stone-100 dark:bg-gray-800 text-stone-400'}`}>
                    <ach.icon className="w-10 h-10" />
                  </div>
                  <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{ach.title}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mt-2">{ach.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA finale */}
      <section className="section-container py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="relative overflow-hidden bg-primary-900 dark:bg-blue-950 rounded-[3rem] p-16 shadow-2xl text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full -translate-y-48 translate-x-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full translate-y-48 -translate-x-48 blur-3xl" />
          
          <Sparkles className="w-16 h-16 mx-auto mb-8 text-gold-400 animate-pulse" />
          <p className="font-arabic text-3xl md:text-4xl mb-6 leading-relaxed text-glow">رَبِّ زِدْنِي عِلْمًا</p>
          <p className="font-amiri text-xl italic mb-12 text-stone-200">"Seigneur, augmente mes connaissances" (20:114)</p>
          <button onClick={() => navigate('/hifz')} className="relative group overflow-hidden bg-gold-500 hover:bg-gold-400 text-primary-950 font-bold py-3.5 md:py-5 px-8 md:px-12 rounded-full transition-all inline-flex items-center gap-2 md:gap-3 shadow-2xl hover:shadow-gold-500/40 active:scale-95">
            <span className="relative z-10 text-base md:text-lg">Démarrer mon programme</span>
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>
    </div>
  );
}
