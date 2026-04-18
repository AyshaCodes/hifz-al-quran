import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { QuestionnaireData } from '../../../types/hifz';
import Stepper from './Stepper';
import Step1Situation from './Step1Situation';
import Step2Memorized from './Step2Memorized';
import Step3Objective from './Step3Objective';
import Step4Availability from './Step4Availability';
import Step5Name from './Step5Name';

interface Props {
  onSubmit: (data: QuestionnaireData) => void;
  onBack: () => void;
}

const initialData: QuestionnaireData = {
  situation: null,
  departMemorisation: null,
  juzArrive: 1,
  qualiteMemorisation: null,
  objectif: null,
  nombreJuzObjectif: 5,
  aDateObjectif: false,
  dateObjectif: '',
  heuresDisponibles: [],
  minutesParJour: 30,
  joursParSemaine: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'],
  prenom: '',
};

function canProceed(step: number, data: QuestionnaireData, hasMemorized: boolean): boolean {
  if (step === 1) return data.situation !== null;
  if (step === 2 && hasMemorized) return data.departMemorisation !== null && data.qualiteMemorisation !== null;
  const objStep = hasMemorized ? 3 : 2;
  if (step === objStep) return data.objectif !== null;
  const availStep = hasMemorized ? 4 : 3;
  if (step === availStep) return data.joursParSemaine.length > 0;
  const nameStep = hasMemorized ? 5 : 4;
  if (step === nameStep) return data.prenom.trim().length > 0;
  return true;
}

export default function QuestionnaireContainer({ onSubmit, onBack }: Props) {
  const [data, setData] = useState<QuestionnaireData>(initialData);
  const [currentStep, setCurrentStep] = useState(1);

  const hasMemorized = data.situation !== 'debutant' && data.situation !== null;
  const totalSteps = hasMemorized ? 5 : 4;

  const updateData = (updates: Partial<QuestionnaireData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (!canProceed(currentStep, data, hasMemorized)) return;
    if (currentStep === 1 && !hasMemorized) {
      setCurrentStep(3);
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
    } else {
      onSubmit(data);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onBack();
      return;
    }
    if (currentStep === 3 && !hasMemorized) {
      setCurrentStep(1);
      return;
    }
    setCurrentStep((s) => s - 1);
  };

  const displayStep = (() => {
    if (!hasMemorized && currentStep >= 3) return currentStep - 1;
    return currentStep;
  })();

  const renderStep = () => {
    if (currentStep === 1) return <Step1Situation data={data} onChange={updateData} />;
    if (currentStep === 2 && hasMemorized) return <Step2Memorized data={data} onChange={updateData} />;
    if (currentStep === 3) return <Step3Objective data={data} onChange={updateData} />;
    if (currentStep === 4) return <Step4Availability data={data} onChange={updateData} />;
    if (currentStep === 5) return <Step5Name data={data} onChange={updateData} />;
    if (!hasMemorized && currentStep === 2) return <Step3Objective data={data} onChange={updateData} />;
    if (!hasMemorized && currentStep === 3) return <Step4Availability data={data} onChange={updateData} />;
    if (!hasMemorized && currentStep === 4) return <Step5Name data={data} onChange={updateData} />;
    return null;
  };

  const isLastStep = displayStep === totalSteps;
  const canGo = canProceed(currentStep, data, hasMemorized);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 px-4 py-8">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-stone-800 text-center mb-1">Mon Programme Hifz</h1>
          <p className="text-sm text-stone-500 text-center mb-6">
            Étape {displayStep} sur {totalSteps}
          </p>
          <Stepper
            currentStep={displayStep}
            totalSteps={totalSteps}
            hasMemorized={hasMemorized}
          />
        </motion.div>

        <div className="bg-white/90 rounded-2xl shadow-xl border border-stone-200 p-6 min-h-[320px]">
          <AnimatePresence mode="wait">
            <div key={currentStep}>
              {renderStep()}
            </div>
          </AnimatePresence>
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBack}
            className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-stone-200 hover:bg-stone-300
              text-stone-800 font-semibold text-sm transition-colors"
          >
            <ChevronLeft size={16} />
            Retour
          </motion.button>
          <motion.button
            whileHover={canGo ? { scale: 1.03 } : {}}
            whileTap={canGo ? { scale: 0.97 } : {}}
            onClick={handleNext}
            disabled={!canGo}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-semibold text-sm
              transition-all ${canGo
                ? 'bg-green-700 hover:bg-green-800 text-white'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
          >
            {isLastStep ? (
              <>
                <Check size={16} />
                Créer mon programme
              </>
            ) : (
              <>
                Suivant
                <ChevronRight size={16} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
