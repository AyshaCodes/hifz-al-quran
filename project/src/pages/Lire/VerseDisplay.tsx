import { Loader2 } from 'lucide-react';
import { stripPrependedBismillahFromVerseOne } from '../../lib/bismillah';
import SurahIntro from './SurahIntro';

interface VerseDisplayProps {
  surahNumber: number;
  verses: {
    number: number;
    numberInSurah: number;
    text: string;
    translation: string;
  }[];
  loading: boolean;
  error: string | null;
  showTranslation: boolean;
}

export default function VerseDisplay({
  surahNumber,
  verses,
  loading,
  error,
  showTranslation,
}: VerseDisplayProps) {
  const toArabicIndicDigits = (value: number) =>
    value
      .toString()
      .split('')
      .map((digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)] ?? digit)
      .join('');

  const formatAyahMarker = (ayahNumber: number) => `﴿${toArabicIndicDigits(ayahNumber)}﴾`;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 min-h-0">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full green-gradient flex items-center justify-center animate-spin">
            <Loader2 className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Chargement de la sourate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 min-h-0">
        <div className="card p-8 text-center max-w-sm">
          <p className="text-red-500 mb-2 font-medium">Erreur de chargement</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0 bg-[#faf8f1] dark:bg-gray-950">
      <SurahIntro surahNumber={surahNumber} />

      <div className="max-w-[700px] mx-auto px-4 py-8 sm:py-10 bg-white/80 dark:bg-gray-900/70">
        {!showTranslation ? (
          <p
            className="text-[2rem] leading-[2.5] text-gray-900 dark:text-gray-100"
            style={{ direction: 'rtl', textAlign: 'justify', fontFamily: "'Scheherazade New', serif" }}
          >
            {verses.map((verse) => {
              const cleanText = stripPrependedBismillahFromVerseOne(
                surahNumber,
                verse.numberInSurah,
                verse.text
              );
              return (
                <span key={verse.number}>
                  {cleanText} <span className="text-gold-600">{formatAyahMarker(verse.numberInSurah)}</span>{' '}
                </span>
              );
            })}
          </p>
        ) : (
          <div>
            {verses.map((verse) => {
              const cleanText = stripPrependedBismillahFromVerseOne(
                surahNumber,
                verse.numberInSurah,
                verse.text
              );
              return (
                <div key={verse.number} className="mb-5">
                  <p
                    className="text-[2rem] leading-[2.5] text-gray-900 dark:text-gray-100"
                    style={{ direction: 'rtl', textAlign: 'justify', fontFamily: "'Scheherazade New', serif" }}
                  >
                    {cleanText} <span className="text-gold-600">{formatAyahMarker(verse.numberInSurah)}</span>
                  </p>
                  <p className="text-[0.9rem] italic text-gray-500 dark:text-gray-400">{verse.translation}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
