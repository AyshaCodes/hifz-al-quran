import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Download, FileText, Calendar, Award } from 'lucide-react';

const PDF_LINK = "https://drive.google.com/file/d/1h49cnLuN3Xp42tBs5bp5lskbu39qn5PZ/view?usp=sharing";
const INSTAGRAM_LINK = "https://www.instagram.com/somme_de_jours/";

// Animation fade-up au scroll
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Ressources() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-blue-950 dark:via-gray-900 dark:to-blue-950"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Titre animé */}
        <motion.div variants={fadeUp} className="text-center">
          <h1 className="font-amiri text-4xl md:text-5xl text-green-800 dark:text-green-400 mb-3">
            Ressources
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-base md:text-lg">
            Des supports utiles pour accompagner votre parcours de mémorisation
          </p>
        </motion.div>

        {/* Carte PDF animée */}
        <motion.section 
          variants={fadeUp}
          whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          className="rounded-2xl p-7 md:p-8 border border-green-700/30 bg-gradient-to-br from-green-800 to-blue-900 text-white shadow-lg"
        >
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
              <FileText className="w-6 h-6 text-stone-300" />
            </div>
            <div>
              <h2 className="font-amiri text-3xl leading-tight">
                Programme Hifz Al-Quran
              </h2>
              <p className="text-stone-200 mt-1">
                Carnet personnel imprimable et réutilisable
              </p>
            </div>
          </div>

          <p className="text-stone-200 leading-relaxed mb-4">
            Méthode en 7 étapes · Planning 12 mois · 
            Règles d&apos;or · Carnet de suivi
          </p>

          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white/15 text-stone-200 border border-white/20">
            Gratuit · Imprimable · Réutilisable
          </span>

          <div className="mt-6">
            <motion.a
              href={PDF_LINK}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-colors shadow-md"
            >
              <Download className="w-4 h-4" />
              Télécharger le PDF gratuit
            </motion.a>
          </div>
        </motion.section>

        {/* Autres ressources */}
        <motion.section 
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-gray-900/70 p-6 md:p-7"
        >
          <h3 className="font-amiri text-2xl text-green-800 dark:text-green-400 mb-4">
            Autres ressources
          </h3>
          
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
          >
            {[
              { title: "Guide Tajweed pour débutants", icon: BookOpen },
              { title: "Les 40 hadiths An-Nawawi", icon: Award },
              { title: "Calendrier Ramadan 2027", icon: Calendar }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="rounded-xl border border-dashed border-stone-300 dark:border-stone-700 p-4 text-center bg-white/50 dark:bg-gray-800/50"
              >
                <item.icon className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                <p className="text-sm text-stone-600 dark:text-stone-300 font-medium">
                  {item.title}
                </p>
                <span className="text-xs text-stone-400 mt-1 block">
                  Bientôt inshallah 🤍
                </span>
              </motion.div>
            ))}
          </motion.div>

          <motion.a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 5 }}
            className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 hover:text-green-800 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
            </svg>
            Une suggestion ? Contactez-nous sur Instagram
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.section>
      </div>
    </motion.div>
  );
}