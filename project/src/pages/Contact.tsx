import { Mail, MessageSquare, Send, User, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '../hooks/useRouter';
import { motion } from 'framer-motion';

export default function Contact() {
  const { navigate } = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="premium-card p-12 text-center">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary-600/10">
              <CheckCircle className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="section-title text-3xl mb-4">
              Message envoyé !
            </h2>
            <p className="section-subtitle text-base mb-10 leading-relaxed">
              Merci pour votre message. Nous vous répondrons dans les plus brefs délais, inshallah.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                navigate('/');
              }}
              className="btn-premium w-full justify-center"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="section-container max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="section-title">Contact</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Une question, une suggestion ou besoin d'aide ? Nous sommes là pour vous accompagner dans votre voyage spirituel.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-10">
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
                      Utilisez le formulaire pour nous envoyer un message directement.
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
                      href="https://instagram.com/hifz.al.quran"
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

          <div className="lg:col-span-3">
            <div className="premium-card p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
              <h2 className="font-amiri text-2xl text-gray-800 dark:text-gray-100 mb-8 relative z-10">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-stone-400 px-1">
                      Nom complet
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-4 rounded-2xl bg-stone-50 dark:bg-gray-800 border-2 transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 ${
                          errors.name ? 'border-red-500/50' : 'border-transparent focus:border-primary-500/50'
                        }`}
                        placeholder="Votre nom"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider px-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-stone-400 px-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-4 rounded-2xl bg-stone-50 dark:bg-gray-800 border-2 transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 ${
                          errors.email ? 'border-red-500/50' : 'border-transparent focus:border-primary-500/50'
                        }`}
                        placeholder="votre@email.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider px-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-stone-400 px-1">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-2xl bg-stone-50 dark:bg-gray-800 border-2 transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 ${
                      errors.subject ? 'border-red-500/50' : 'border-transparent focus:border-primary-500/50'
                    }`}
                    placeholder="De quoi souhaitez-vous discuter ?"
                  />
                  {errors.subject && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider px-1">{errors.subject}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-stone-400 px-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-2xl bg-stone-50 dark:bg-gray-800 border-2 transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 resize-none ${
                      errors.message ? 'border-red-500/50' : 'border-transparent focus:border-primary-500/50'
                    }`}
                    placeholder="Votre message ici..."
                  />
                  {errors.message && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider px-1">{errors.message}</p>}
                </div>
                {errors.submit && (
                  <p className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium">
                    {errors.submit}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-premium w-full justify-center py-5 text-lg group"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Envoyer le message
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
