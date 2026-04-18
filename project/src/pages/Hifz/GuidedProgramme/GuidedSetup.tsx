import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Compass } from 'lucide-react';
import { GuidedProfile } from '../../../types/hifz';

interface Props {
  onSubmit: (profile: GuidedProfile) => void;
  onBack: () => void;
  existingProfile?: GuidedProfile | null;
}

const LEVELS = [
  { value: 'non-arabic', label: 'Non arabophone', sub: 'Je ne lis pas encore l\'arabe.' },
  { value: 'beginner', label: 'Débutant', sub: 'Je lis l\'arabe lentement.' },
  { value: 'intermediate', label: 'Intermédiaire', sub: 'Je lis l\'arabe avec quelques hésitations.' },
  { value: 'advanced', label: 'Avancé', sub: 'Je lis couramment.' },
  { value: 'hafiz', label: 'Hafiz (révision)', sub: 'J\'ai déjà mémorisé le Coran.' },
] as const;

const PACES = [
  { value: 'slow', label: 'Doux', sub: '¼ page / jour', pages: 0.25 },
  { value: 'moderate', label: 'Modéré', sub: '½ page / jour', pages: 0.5 },
  { value: 'intense', label: 'Intense', sub: '1 page / jour', pages: 1 },
  { value: 'custom', label: 'Personnalisé', sub: 'Je choisis mes pages', pages: 0 },
] as const;

export default function GuidedSetup({ onSubmit, onBack, existingProfile }: Props) {
  const [name, setName] = useState(existingProfile?.name ?? '');
  const [level, setLevel] = useState<GuidedProfile['level']>(existingProfile?.level ?? 'beginner');
  const [pace, setPace] = useState<GuidedProfile['pace']>(existingProfile?.pace ?? 'moderate');
  const [daysPerWeek, setDaysPerWeek] = useState(existingProfile?.daysPerWeek ?? 5);
  const [customPages, setCustomPages] = useState(existingProfile?.customPagesPerDay ?? 1);

  const needsTransliteration = level === 'non-arabic';

  const handleSubmit = () => {
    if (!name.trim()) return;
    const profile: GuidedProfile = {
      name: name.trim(),
      level,
      pace,
      daysPerWeek,
      customPagesPerDay: pace === 'custom' ? customPages : undefined,
      mode: 'guided',
      needsTransliteration,
      createdAt: existingProfile?.createdAt ?? new Date().toISOString(),
    };
    onSubmit(profile);
  };

  const canSubmit = name.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors"
          >
            <ChevronLeft size={18} />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-stone-800">Programme Guidé</h1>
            <p className="text-sm text-stone-500">Configurez votre parcours en quelques secondes.</p>
          </div>
          <Compass size={24} className="text-blue-700 ml-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 rounded-2xl shadow-xl border border-stone-200 p-6 space-y-6"
        >
          <div>
            <label className="text-sm font-semibold text-stone-700 block mb-2">Votre prénom</label>
            <input
              type="text"
              placeholder="Ex : Aïcha, Ibrahim…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm
                focus:outline-none focus:border-blue-700 placeholder:text-stone-400 transition-colors"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-stone-700 mb-2">Votre niveau en arabe</p>
            <div className="space-y-2">
              {LEVELS.map((l) => (
                <motion.button
                  key={l.value}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLevel(l.value)}
                  className={`w-full text-left p-3.5 rounded-xl border-2 transition-all
                    ${level === l.value
                      ? 'border-blue-700 bg-blue-50'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                >
                  <p className="font-semibold text-stone-800 text-sm">{l.label}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{l.sub}</p>
                </motion.button>
              ))}
            </div>
            {needsTransliteration && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-blue-600 mt-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200"
              >
                La translittération sera activée pour vous aider à prononcer les versets.
              </motion.p>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-stone-700 mb-2">Rythme de mémorisation</p>
            <div className="grid grid-cols-2 gap-2">
              {PACES.map((p) => (
                <motion.button
                  key={p.value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPace(p.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all
                    ${pace === p.value
                      ? 'border-blue-700 bg-blue-50'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                >
                  <p className="font-semibold text-stone-800 text-sm">{p.label}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{p.sub}</p>
                </motion.button>
              ))}
            </div>
            {pace === 'custom' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                <label className="text-sm font-semibold text-stone-700 block mb-2">
                  Pages par jour : <span className="text-blue-700">{customPages}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={customPages}
                  onChange={(e) => setCustomPages(parseInt(e.target.value))}
                  className="w-full accent-blue-700"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-1">
                  <span>1p</span><span>2p</span><span>3p</span><span>4p</span><span>5p</span>
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-stone-700 mb-2">
              Jours par semaine : <span className="text-blue-700">{daysPerWeek}</span>
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setDaysPerWeek(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all
                    ${daysPerWeek === n
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                    }`}
                >
                  {n}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.button
          whileHover={canSubmit ? { scale: 1.03 } : {}}
          whileTap={canSubmit ? { scale: 0.97 } : {}}
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-xl font-bold text-base transition-all
            ${canSubmit
              ? 'bg-blue-700 hover:bg-blue-800 text-white'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
        >
          Commencer mon parcours guidé
        </motion.button>
      </div>
    </div>
  );
}
