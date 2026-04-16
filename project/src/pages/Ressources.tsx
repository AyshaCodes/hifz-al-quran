import { ArrowRight, BookOpen, Download, 
         FileText } from 'lucide-react';

export default function Ressources() {
  // ← Mets ton vrai lien Google Drive ici
  const PDF_LINK = "https://drive.google.com/file/d/1h49cnLuN3Xp42tBs5bp5lskbu39qn5PZ/view?usp=sharing";
  // ← Mets ton vrai lien Instagram ici  
  const INSTAGRAM_LINK = "https://www.instagram.com/somme_de_jours/";

  return (
    <div className="min-h-screen bg-beige-100 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 
                      py-12 space-y-8">
        
        {/* Titre */}
        <div className="text-center">
          <h1 className="font-amiri text-4xl md:text-5xl 
                         text-primary-700 dark:text-primary-400 mb-3">
            Ressources
          </h1>
          <p className="text-gray-600 dark:text-gray-300 
                        text-base md:text-lg">
            Des supports utiles pour accompagner votre 
            parcours de mémorisation
          </p>
        </div>

        {/* Card PDF */}
        <section className="rounded-2xl p-7 md:p-8 
                            border border-primary-600/30 
                            bg-gradient-to-br from-primary-600 
                            to-primary-700 text-white shadow-lg">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-white/15 
                            flex items-center justify-center">
              <FileText className="w-6 h-6 text-gold-300" />
            </div>
            <div>
              <h2 className="font-amiri text-3xl leading-tight">
                Programme Hifz Al-Quran
              </h2>
              <p className="text-primary-100 mt-1">
                Carnet personnel imprimable et réutilisable
              </p>
            </div>
          </div>

          <p className="text-primary-100 leading-relaxed mb-4">
            Méthode en 7 étapes · Planning 12 mois · 
            Règles d&apos;or · Carnet de suivi
          </p>

          <span className="inline-flex items-center rounded-full 
                           px-3 py-1 text-xs font-semibold 
                           bg-white/15 text-gold-300 
                           border border-white/20">
            Gratuit · Imprimable · Réutilisable
          </span>

          {/* ✅ Bouton téléchargement avec vrai lien */}
          <div className="mt-6">
            
               <a  // <-- Il manquait le "<a" ici
 href={PDF_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 
                         bg-gold-400 hover:bg-gold-300 
                         text-gray-900 font-semibold 
                         px-6 py-3 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              Télécharger le PDF gratuit
            </a>
          </div>
        </section>

        {/* Autres ressources */}
        <section className="rounded-2xl border border-beige-200 
                            dark:border-gray-800 bg-white/80 
                            dark:bg-gray-900/70 p-6 md:p-7">
          <h3 className="font-amiri text-2xl text-primary-700 
                         dark:text-primary-400 mb-4">
            Autres ressources
          </h3>
          
          {/* Cards "bientôt" */}
          <div className="grid grid-cols-1 sm:grid-cols-3 
                          gap-4 mb-6">
            {[
              "Guide Tajweed pour débutants",
              "Les 40 hadiths An-Nawawi", 
              "Calendrier Ramadan 2027"
            ].map((titre) => (
              <div key={titre} 
                   className="rounded-xl border border-dashed 
                              border-gray-300 dark:border-gray-700 
                              p-4 text-center opacity-60">
                <BookOpen className="w-6 h-6 mx-auto mb-2 
                                     text-primary-400" />
                <p className="text-sm text-gray-500 
                              dark:text-gray-400 font-medium">
                  {titre}
                </p>
                <span className="text-xs text-gray-400 mt-1 
                                 block">
                  Bientôt inshallah 🤍
                </span>
              </div>
            ))}
          </div>

          {/* ✅ Lien Instagram avec vrai lien */}
          
            <a  // <-- Il manquait le "<a" ici
  href={INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 
                       text-primary-600 dark:text-primary-400 
                       hover:text-primary-700 text-sm 
                       font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" 
                 viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07
                       3.252.148 4.771 1.691 4.919 4.919.058 
                       1.265.069 1.645.069 4.849 0 3.205-.012 
                       3.584-.069 4.849-.149 3.225-1.664 
                       4.771-4.919 4.919-1.266.058-1.644.07
                       -4.85.07-3.204 0-3.584-.012-4.849-.07
                       -3.26-.149-4.771-1.699-4.919-4.92-.058
                       -1.265-.07-1.644-.07-4.849 0-3.204.013
                       -3.583.07-4.849.149-3.227 1.664-4.771 
                       4.919-4.919 1.266-.057 1.645-.069 
                       4.849-.069z"/>
            </svg>
            Une suggestion ? Contactez-nous sur Instagram
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>

      </div>
    </div>
  );
}