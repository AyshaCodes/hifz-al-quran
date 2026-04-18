import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Download, FileText, Calendar, Award } from 'lucide-react';

const PDF_LINK = "https://drive.google.com/file/d/1vXZBYux35JQVb4YeOQDSuq2e1SnkwJD1/view?usp=sharing";
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
      className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      <div className="section-container max-w-5xl">
        
        {/* Titre animé */}
        <motion.div variants={fadeUp} className="text-center">
          <h1 className="section-title">Ressources</h1>
          <p className="section-subtitle">
            Des supports utiles pour accompagner votre parcours de mémorisation
          </p>
        </motion.div>

        {/* Carte PDF animée */}
        <motion.section 
          variants={fadeUp}
          whileHover={{ y: -5 }}
          className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-14 bg-primary-900 text-white shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full -translate-y-48 translate-x-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full translate-y-32 -translate-x-32 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                <FileText className="w-10 h-10 text-gold-400" />
              </div>
              <div>
                <h2 className="font-amiri text-4xl md:text-5xl leading-tight mb-2">
                  Programme Hifz Al-Quran
                </h2>
                <p className="text-primary-100 text-xl font-amiri italic">
                  Carnet personnel imprimable et réutilisable
                </p>
              </div>
            </div>

            <p className="text-primary-50 text-lg leading-relaxed mb-8 max-w-2xl">
              Une méthode structurée en 7 étapes, avec un planning sur 12 mois, les règles d'or de la mémorisation et un carnet de suivi quotidien.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              {['Gratuit', 'Imprimable', 'Réutilisable', 'Format PDF'].map(tag => (
                <span key={tag} className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-white/10 text-primary-50 border border-white/20 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>

            <motion.a
              href={PDF_LINK}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gold-500 hover:bg-gold-400 text-primary-950 font-bold px-10 py-5 rounded-2xl transition-all shadow-xl hover:shadow-gold-500/20 text-lg"
            >
              <Download className="w-6 h-6" />
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
          className="py-12"
        >
          <h3 className="section-title text-3xl mb-12">Autres supports à venir</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
            {[
              { title: "Guide Tajweed pour débutants", icon: BookOpen, desc: "Les bases de la récitation" },
              { title: "Les 40 hadiths An-Nawawi", icon: Award, desc: "L'essentiel de la foi" },
              { title: "Calendrier Ramadan 2027", icon: Calendar, desc: "Planifiez votre mois sacré" }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="premium-card p-8 text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-stone-100 dark:bg-gray-800 flex items-center justify-center group-hover:rotate-3 transition-transform">
                  <item.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">{item.title}</h4>
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">{item.desc}</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 bg-stone-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                  Bientôt inshallah 🤍
                </span>
              </motion.div>
            ))}
          </div>

          <motion.a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 10 }}
            className="premium-card p-6 inline-flex items-center gap-4 text-primary-700 dark:text-primary-400 font-bold hover:text-primary-800 transition-all border-primary-100 dark:border-primary-900/30"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/40 flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
              </svg>
            </div>
            <span>Une suggestion ? Contactez-nous sur Instagram</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </motion.a>
        </motion.section>
      </div>
    </motion.div>
  );
}