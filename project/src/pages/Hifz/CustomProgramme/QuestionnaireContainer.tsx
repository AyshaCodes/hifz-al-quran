import { useState } from 'react';
import { QuestionnaireData } from '../../../types/hifz';
import Stepper from '../shared/Stepper';
import Step1Situation from './Step1Situation';
import Step2Memorized from './Step2Memorized';
import Step3Objective from './Step3Objective';
import Step4Availability from './Step4Availability';
import Step5Name from './Step5Name';

interface Props {
  onSubmit: (data: QuestionnaireData) => void;
}

const INITIAL_DATA: QuestionnaireData = {
  situation: null,
  departMemorisation: 'debut',
  juzArrive: 1,
  qualiteMemorisation: null,
  objectif: null,
  nombreJuzObjectif: 5,
  aDateObjectif: false,
  dateObjectif: '',
  heuresDisponibles: ['fajr'],
  minutesParJour: 30,
  joursParSemaine: ['L', 'M', 'Me', 'J', 'V', 'S', 'D'],
  prenom: '',
};

export default function QuestionnaireContainer({ onSubmit }: Props) {
  const [data, setData] = useState<QuestionnaireData>(INITIAL_DATA);
  const [currentStep, setCurrentStep] = useState(1);

  const isDebutant = data.situation === 'debutant';
  const totalSteps = isDebutant ? 4 : 5;

  const getActualStep = (displayStep: number): number => {
    if (isDebutant && displayStep >= 2) return displayStep + 1;
    return displayStep;
  };

  const canProceed = (): boolean => {
    const actual = getActualStep(currentStep);
    switch (actual) {
      case 1: return data.situation !== null;
      case 2: return data.departMemorisation !== null && data.qualiteMemorisation !== null;
      case 3: return data.objectif !== null;
      case 4: return data.heuresDisponibles.length > 0 && data.joursParSemaine.length > 0;
      case 5: return data.prenom.trim().length > 0;
      default: return false;
    }
  };

  const handleFieldChange = (field: string, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      if (currentStep === 1 && isDebutant) {
        setCurrentStep(2);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      onSubmit(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const renderStep = () => {
    const actual = getActualStep(currentStep);
    switch (actual) {
      case 1:
        return (
          <Step1Situation
            value={data.situation}
            onChange={v => {
              handleFieldChange('situation', v);
              if (v === 'revision') handleFieldChange('objectif', 'revision');
            }}
          />
        );
      case 2:
        return (
          <Step2Memorized
            data={{
              departMemorisation: data.departMemorisation,
              juzArrive: data.juzArrive,
              qualiteMemorisation: data.qualiteMemorisation,
            }}
            onChange={handleFieldChange}
          />
        );
      case 3:
        return (
          <Step3Objective
            data={{
              objectif: data.objectif,
              nombreJuzObjectif: data.nombreJuzObjectif,
              aDateObjectif: data.aDateObjectif,
              dateObjectif: data.dateObjectif,
              situation: data.situation,
              qualiteMemorisation: data.qualiteMemorisation,
            }}
            onChange={handleFieldChange}
          />
        );
      case 4:
        return (
          <Step4Availability
            data={{
              heuresDisponibles: data.heuresDisponibles,
              minutesParJour: data.minutesParJour,
              joursParSemaine: data.joursParSemaine,
            }}
            onChange={handleFieldChange}
          />
        );
      case 5:
        return <Step5Name prenom={data.prenom} onChange={v => handleFieldChange('prenom', v)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-blue-950 dark:via-gray-900 dark:to-blue-950 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start px-4 py-10 sm:py-16">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400 mb-1 font-amiri">
              هِفْظ
            </div>
            <h1 className="text-base font-semibold text-stone-600 dark:text-stone-400 tracking-wide uppercase">
              Mon Hifz — Programme personnalisé
            </h1>
          </div>

          <Stepper currentStep={currentStep} hasMemorized={!isDebutant} />

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-10 min-h-[360px] flex flex-col border border-stone-200 dark:border-stone-700">
            <div className="flex-1">{renderStep()}</div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-200 dark:border-stone-700">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium transition disabled:opacity-0 disabled:pointer-events-none flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
              >
                {currentStep === totalSteps ? (
                  <>✨ Créer mon programme personnalisé</>
                ) : (
                  <>
                    Suivant
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}