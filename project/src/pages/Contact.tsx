import { Mail, MessageSquare, ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const CONTACT_EMAIL = "contact@hifzalquran.app"; // Remplace par ton email réel

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="section-container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="section-title">Contact</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Une question, une suggestion ou besoin d'aide ? Nous sommes là pour vous accompagner dans votre voyage spirituel.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Informations de contact */}
          <div className="space-y-10">
            <div>
              <h2 className="font-amiri text-2xl text-gray-800 dark:text-gray-100 mb-8 border-l-4 border-primary-500 pl-4">
                Restons en contact
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-stone-100 dark:border-white/5 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                      Par email
                    </h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                      Cliquez sur le bouton pour nous envoyer un email directement depuis votre messagerie.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-stone-100 dark:border-white/5 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                      Sur les réseaux
                    </h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm mb-3 leading-relaxed">
                      Suivez-nous sur Instagram pour des conseils et l'actualité du programme.
                    </p>
                    <a
                      href="https://www.instagram.com/somme_de_jours/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold hover:underline"
                    >
                      @hifz.al.quran
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ rapide */}
            <div className="pt-6">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-6">
                Questions fréquentes
              </h3>
              <div className="space-y-4">
                <div className="premium-card p-5 border-none shadow-md">
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2 text-sm">
                    Le programme est-il vraiment gratuit ?
                  </h4>
                  <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed">
                    Oui ! Le PDF et l'application sont entièrement gratuits pour vous accompagner dans votre Hifz.
                  </p>
                </div>
                <div className="premium-card p-5 border-none shadow-md">
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2 text-sm">
                    Puis-je l'utiliser sans l'application ?
                  </h4>
                  <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed">
                    Absolument ! Le PDF contient tout ce qu'il vous faut pour commencer immédiatement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action directe Email */}
          <div className="lg:sticky lg:top-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-10 shadow-xl relative overflow-hidden text-center"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary-600/10">
                  <Mail className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                </div>
                
                <h2 className="font-amiri text-3xl text-gray-800 dark:text-gray-100 mb-4">
                  Envoyez-nous un email
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mb-10 leading-relaxed max-w-xs mx-auto">
                  Nous répondons généralement en moins de 24 heures, inshallah.
                </p>
                
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Contact depuis l'application Hifz Al-Quran`}
                  className="btn-premium w-full justify-center py-5 text-lg group shadow-xl hover:shadow-primary-600/20"
                >
                  Ouvrir ma messagerie
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>

                <div className="mt-8 pt-8 border-t border-stone-100 dark:border-white/5">
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mb-2">
                    Directement à :
                  </p>
                  <p className="text-primary-600 dark:text-primary-400 font-medium">
                    {CONTACT_EMAIL}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-stone-400 italic">
                "Celui qui facilite la tâche à quelqu'un dans la difficulté, Allah lui facilite la tâche dans cette vie et dans l'autre."
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
