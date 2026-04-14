import { ArrowRight, BookOpen, Download, FileText, Instagram } from 'lucide-react';

export default function Ressources() {
  return (
    <div className="min-h-screen bg-beige-100 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center">
          <h1 className="font-amiri text-4xl md:text-5xl text-primary-700 dark:text-primary-400 mb-3">
            Ressources
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
            Des supports utiles pour accompagner votre parcours de mémorisation
          </p>
        </div>

        <section className="rounded-2xl p-7 md:p-8 border border-primary-600/30 bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
              <FileText className="w-6 h-6 text-gold-300" />
            </div>
            <div>
              <h2 className="font-amiri text-3xl leading-tight">Programme Hifz Al-Quran</h2>
              <p className="text-primary-100 mt-1">
                Carnet personnel imprimable et réutilisable — mémorisation complète
              </p>
            </div>
          </div>

          <p className="text-primary-100 leading-relaxed">
            Méthode en 7 étapes · Planning 12 mois · Règles d&apos;or · Carnet de suivi
          </p>

          <div className="mt-4">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white/15 text-gold-300 border border-white/20">
              Gratuit · Imprimable · Réutilisable
            </span>
          </div>

          <a
            href="#"
            className="mt-6 inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            Télécharger le PDF gratuit
          </a>
        </section>

        <section className="rounded-2xl border border-beige-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 p-6 md:p-7">
          <h3 className="font-amiri text-2xl text-primary-700 dark:text-primary-400 mb-4">
            Autres ressources
          </h3>
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
            <div className="w-10 h-10 rounded-lg bg-beige-100 dark:bg-gray-800 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="leading-relaxed">
              D&apos;autres ressources seront bientot disponibles — livres, guides, conseils pour
              memoriser le Coran 🤍
            </p>
          </div>
          <a
            href="#"
            className="mt-5 inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
          >
            <Instagram className="w-4 h-4" />
            Une suggestion de ressource ? Contactez-nous sur Instagram
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>
      </div>
    </div>
  );
}
