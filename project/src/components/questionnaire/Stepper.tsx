interface Props {
  currentStep: number;
  hasMemorized: boolean;
}

export default function Stepper({ currentStep, hasMemorized }: Props) {
  const steps = hasMemorized 
    ? ['Situation', 'Mémorisation', 'Objectif', 'Disponibilité', 'Nom']
    : ['Situation', 'Objectif', 'Disponibilité', 'Nom'];

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                  ${isActive ? 'bg-primary-500 text-white' : isCompleted ? 'bg-primary-500 text-white' : 'bg-beige-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                `}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span
                className={`
                  ml-2 text-xs font-medium transition-all
                  ${isActive ? 'text-primary-600 dark:text-primary-400' : isCompleted ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}
                `}
              >
                {step}
              </span>
              {stepNumber < steps.length && (
                <div className="w-8 h-0.5 bg-beige-200 dark:bg-gray-700 mx-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
