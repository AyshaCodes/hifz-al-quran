import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const quotes = [
  { type: 'hadith', text: 'Le meilleur d’entre vous est celui qui apprend le Coran et l’enseigne.', ref: 'Rapporté par Al-Bukhari' },
  { type: 'verse', arabic: 'وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا', french: 'Récite le Coran lentement et clairement.', ref: 'Sourate Al-Muzzammil 73:4' },
  { type: 'dua', text: 'اللهم اجعل القرآن العظيم ربيع قلبي', translation: 'Ô Allah, fais du Coran le printemps de mon cœur', ref: 'Dua du Prophète ﷺ' },
  { type: 'hadith', text: 'Le Coran est un intercesseur dont l’intercession est acceptée.', ref: 'Rapporté par Muslim' },
  { type: 'verse', arabic: 'إِنَّ هَـٰذَا ٱلْقُرْءَانَ يَهْدِى لِلَّتِى هِىَ أَقْوَمُ', french: 'Ce Coran guide vers ce qu’il y a de plus droit.', ref: 'Al-Isra 17:9' },
];

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Change de citation toutes les heures (ou à chaque montage)
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-50 to-stone-50 dark:from-amber-900/20 dark:to-stone-800/30 rounded-2xl p-5 border border-amber-200 dark:border-amber-800/30 max-w-2xl mx-auto text-center"
    >
      <Quote className="w-6 h-6 mx-auto text-amber-500 mb-2" />
      {quote.type === 'verse' && (
        <>
          <p className="font-arabic text-2xl text-gray-800 dark:text-gray-100 leading-loose" dir="rtl">{quote.arabic}</p>
          <p className="italic text-stone-600 dark:text-stone-300 text-sm mt-2">{quote.french}</p>
        </>
      )}
      {quote.type === 'hadith' && (
        <p className="text-stone-700 dark:text-stone-200 text-sm md:text-base">« {quote.text} »</p>
      )}
      {quote.type === 'dua' && (
        <>
          <p className="font-arabic text-xl text-gray-800 dark:text-gray-100">{quote.text}</p>
          <p className="text-stone-600 dark:text-stone-300 text-sm mt-1">{quote.translation}</p>
        </>
      )}
      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">— {quote.ref}</p>
    </motion.div>
  );
}