import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const quotes = [
  {
    text: 'Le meilleur d\'entre vous est celui qui apprend le Coran et l\'enseigne.',
    source: 'Prophète Muhammad ﷺ (Bukhari)',
  },
  {
    text: 'Récitez le Coran car il intercédera en faveur de ses compagnons au Jour du Jugement.',
    source: 'Prophète Muhammad ﷺ (Muslim)',
  },
  {
    text: 'Celui dont le cœur est vide du Coran est comme une maison en ruine.',
    source: 'Prophète Muhammad ﷺ (Tirmidhi)',
  },
  {
    text: 'En vérité, Nous avons fait descendre le Coran et Nous en sommes le gardien.',
    source: 'Sourate Al-Hijr (15:9)',
  },
  {
    text: 'Le porteur du Coran ne doit pas s\'agiter avec ceux qui s\'agitent ni se montrer ignorant avec ceux qui montrent l\'ignorance.',
    source: 'Hasan al-Basri',
  },
  {
    text: 'Le Coran est un remède pour ce que renferment les poitrines.',
    source: 'Sourate Yunus (10:57)',
  },
  {
    text: 'Illuminez vos maisons par la récitation du Coran.',
    source: 'Prophète Muhammad ﷺ (Ibn Majah)',
  },
  {
    text: 'Quiconque récite une lettre du Coran aura une bonne action, et cette bonne action sera multipliée par dix.',
    source: 'Prophète Muhammad ﷺ (Tirmidhi)',
  },
];

interface Props {
  variant?: 'green' | 'blue';
}

export default function MotivationalQuote({ variant = 'green' }: Props) {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const idx = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[idx]);
  }, []);

  const borderColor = variant === 'green' ? 'border-green-700' : 'border-blue-700';
  const iconColor = variant === 'green' ? 'text-green-700' : 'text-blue-700';
  const textColor = variant === 'green' ? 'text-green-800' : 'text-blue-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white/80 border-l-4 ${borderColor} rounded-xl px-5 py-4 shadow-md flex gap-3 items-start`}
    >
      <BookOpen className={`${iconColor} mt-1 shrink-0`} size={20} />
      <div>
        <p className={`font-semibold text-sm italic ${textColor}`}>« {quote.text} »</p>
        <p className="text-xs text-stone-500 mt-1">{quote.source}</p>
      </div>
    </motion.div>
  );
}
