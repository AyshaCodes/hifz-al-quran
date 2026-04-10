import { BookOpen, Star, Calendar, ChevronRight, Moon, UserRound, TrendingUp, BellRing, ArrowRight } from 'lucide-react';
import { Page } from '../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const features = [
  {
    icon: BookOpen,
    title: 'Lire le Coran',
    desc: 'Lisez les 114 sourates avec traduction française et audio.',
    page: 'lire' as Page,
    color: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
  },
  {
    icon: Star,
    title: 'Mon Hifz',
    desc: 'Suivez votre progression de mémorisation jour par jour.',
    page: 'hifz' as Page,
    color: 'bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400',
  },
  {
    icon: Calendar,
    title: 'Programme Personnalisé',
    desc: 'Un programme adapté à votre rythme et vos objectifs.',
    page: 'hifz' as Page,
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  },
];

const verses = [
  {
    arabic: 'وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا',
    french: 'Et récite le Coran lentement et clairement.',
    ref: 'Sourate Al-Muzzammil 73:4',
  },
  {
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    french: 'Le meilleur d\'entre vous est celui qui apprend le Coran et l\'enseigne.',
    ref: 'Hadith — Bukhari',
  },
];

const howItWorksSteps = [
  {
    icon: UserRound,
    title: 'Créez votre profil',
    desc: 'Définissez votre juz actuel, votre objectif et votre rythme quotidien.',
  },
  {
    icon: TrendingUp,
    title: 'Suivez votre progression chaque jour',
    desc: 'Visualisez vos pages mémorisées, vos stats et votre régularité.',
  },
  {
    icon: BellRing,
    title: 'Révisez avec les rappels intelligents',
    desc: 'Repérez les pages prioritaires et maintenez une révision continue.',
  },
];

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 dark:from-gray-900 dark:via-primary-950 dark:to-gray-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-gold-400 blur-3xl" />
          <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-primary-300 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Moon className="w-4 h-4 text-gold-300" />
              <span>Votre compagnon de mémorisation</span>
            </div>

            <h1 className="font-arabic text-5xl md:text-6xl text-white mb-4 leading-tight" style={{ direction: 'rtl' }}>
              حِفْظُ الْقُرْآن
            </h1>
            <h2 className="font-amiri text-3xl md:text-4xl text-gold-300 mb-6">
              Hifz Al-Quran
            </h2>
            <p className="text-primary-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              Mémorisez le Livre d'Allah à votre rythme avec un programme personnalisé,
              un suivi quotidien et des rappels de révision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('hifz')}
                className="btn-primary bg-gold-400 hover:bg-gold-300 text-gray-900 flex items-center justify-center gap-2 text-base shadow-lg"
              >
                Commencer mon Hifz
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('lire')}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-base"
              >
                <BookOpen className="w-4 h-4" />
                Lire le Coran
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-amiri text-3xl text-primary-700 dark:text-primary-400 mb-3">
            Tout ce qu'il vous faut
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Une application complète pour votre voyage de mémorisation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.title}
                onClick={() => onNavigate(f.page)}
                className="card p-6 text-left hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-beige-100 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-amiri text-3xl text-primary-700 dark:text-primary-400 mb-3">
              Comment ça marche
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Trois étapes simples pour avancer avec constance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-4 items-start">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative">
                  <div className="card p-6 h-full text-center">
                    <div className="mx-auto w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      Étape {index + 1} : {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-primary-500 text-white items-center justify-center shadow-sm">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-beige-100 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-amiri text-3xl text-primary-700 dark:text-primary-400 mb-2">
              Inspiration du Coran
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {verses.map((v, i) => (
              <div
                key={i}
                className="card p-6 border-l-4 border-gold-400"
              >
                <p className="font-arabic text-2xl text-gray-800 dark:text-gray-100 text-right mb-3 leading-loose" style={{ direction: 'rtl' }}>
                  {v.arabic}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm italic leading-relaxed mb-2">
                  {v.french}
                </p>
                <p className="text-gold-500 text-xs font-medium">{v.ref}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="card p-10 green-gradient text-white max-w-2xl mx-auto">
          <p className="font-arabic text-3xl mb-4 opacity-90">إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ</p>
          <p className="text-primary-100 text-sm italic mb-6">
            "C'est Nous qui avons fait descendre le Rappel, et c'est Nous qui en sommes gardiens."
            <span className="block text-gold-300 mt-1 not-italic">— Al-Hijr 15:9</span>
          </p>
          <button
            onClick={() => onNavigate('hifz')}
            className="bg-gold-400 hover:bg-gold-300 text-gray-900 font-semibold py-3 px-8 rounded-xl transition-all duration-200 inline-flex items-center gap-2"
          >
            Créer mon programme
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
