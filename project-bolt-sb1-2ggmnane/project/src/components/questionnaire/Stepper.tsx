interface StepperProps {
  currentStep: number;
  totalSteps: number;
  hasMemorized: boolean;
}

const STEP_LABELS_WITH_MEM = ['Situation', 'Mémorisé', 'Objectif', 'Disponibilité', 'Profil'];
const STEP_LABELS_WITHOUT_MEM = ['Situation', 'Objectif', 'Disponibilité', 'Profil'];

export default function Stepper({ currentStep, totalSteps, hasMemorized }: StepperProps) {
  const labels = hasMemorized ? STEP_LABELS_WITH_MEM : STEP_LABELS_WITHOUT_MEM;
  const count = totalSteps;

  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-center gap-0">
        {Array.from({ length: count }, (_, i) => {
          const step = i + 1;
          const isDone = step < currentStep;
          const isActive = step === currentStep;

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    isDone
                      ? 'bg-[#2c6e3c] text-white'
                      : isActive
                      ? 'bg-[#d4a345] text-white shadow-md scale-110'
                      : 'bg-[#e8e4d4] text-[#9a9080]'
                  }`}
                >
                  {isDone ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`mt-1.5 text-[10px] font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'text-[#d4a345]' : isDone ? 'text-[#2c6e3c]' : 'text-[#b0a898]'
                  }`}
                >
                  {labels[i]}
                </span>
              </div>
              {i < count - 1 && (
                <div
                  className={`w-8 sm:w-14 h-0.5 mb-5 mx-1 transition-colors duration-300 ${
                    isDone ? 'bg-[#2c6e3c]' : 'bg-[#e8e4d4]'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
