import { useState } from 'react';
import { Mail, Send, User, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resultMessage, setResultMessage] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(event.currentTarget);
    formData.append('access_key', '9796d525-70a1-4467-8910-638e49f8c1f5');
    formData.append('subject', 'Nouveau message de Hifz Al Quran');
    formData.append('from_name', 'Hifz Al Quran App');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setStatus('success');
        setResultMessage('Votre message a été envoyé avec succès. Nous vous répondrons dès que possible.');
        event.currentTarget.reset();
      } else {
        setStatus('error');
        setResultMessage(data.message || 'Une erreur est survenue lors de l\'envoi.');
      }
    } catch (err) {
      setStatus('error');
      setResultMessage('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-50 dark:bg-gray-950 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-stone-800 dark:text-white mb-4">Contactez-nous</h1>
          <p className="text-stone-500 dark:text-gray-400 max-w-sm mx-auto">
            Une question, une suggestion ou besoin d'aide ? Notre équipe est à votre écoute.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow-xl dark:shadow-2xl rounded-3xl overflow-hidden border border-stone-100 dark:border-white/5">
          <div className="p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-800 dark:text-white mb-2">Merci !</h3>
                  <p className="text-stone-500 dark:text-gray-400 mb-8">{resultMessage}</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-600/20"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form key="form" onSubmit={onSubmit} className="space-y-6">
                  {/* Nom */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 dark:text-gray-500 uppercase tracking-widest ml-1">Nom complet</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary-600 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Votre nom" 
                        required 
                        className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-stone-300 dark:placeholder-gray-700 transition-all" 
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary-600 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="votre@email.com" 
                        required 
                        className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-stone-300 dark:placeholder-gray-700 transition-all" 
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 dark:text-gray-500 uppercase tracking-widest ml-1">Message</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-6 text-stone-400 group-focus-within:text-primary-600 transition-colors">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <textarea 
                        name="message" 
                        placeholder="Comment pouvons-nous vous aider ?" 
                        rows={5} 
                        required 
                        className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-stone-300 dark:placeholder-gray-700 transition-all resize-none" 
                      />
                    </div>
                  </div>

                  {/* Honeypot Spam Protection (hidden) */}
                  <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                  {/* Error Message */}
                  {status === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 text-sm"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p>{resultMessage}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-stone-300 dark:disabled:bg-gray-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}