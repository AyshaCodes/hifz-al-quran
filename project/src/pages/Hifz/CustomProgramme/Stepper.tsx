import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Props {
  currentStep: number;
  totalSteps: number;
  hasMemorized: boolean;
}

const STEP_LABELS = [
  'Situation',
  'Mémorisé',
  'Objectif',
  'Disponibilité',
  'Prénom',
];

export default function Stepper({ currentStep, totalSteps, hasMemorized }: Props) {
  const visibleSteps = hasMemorized
    ? STEP_LABELS
    : [STEP_LABELS[0], ...STEP_LABELS.slice(2)];

  const steps = visibleSteps.slice(0, totalSteps);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-stone-200 z-0">
          <motion.div
            className="h-full bg-green-700 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (currentStep - 1) / (totalSteps - 1) }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          return (
            <div key={i} className="flex flex-col items-center z-10 flex-1">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.15 : 1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
                  ${isDone ? 'bg-green-700 border-green-700 text-white' : isActive ? 'bg-white border-green-700 text-green-700' : 'bg-white border-stone-300 text-stone-400'}
                `}
              >
                {isDone ? <Check size={14} /> : stepNum}
              </motion.div>
              <span className="hidden sm:block text-xs font-medium mt-1.5 text-center leading-tight
                text-stone-500 max-w-[60px]">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
