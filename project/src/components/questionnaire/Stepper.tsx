// components/questionnaire/Stepper.tsx
interface StepperProps {
  currentStep: number;      // de 1 à totalSteps
  hasMemorized: boolean;    // true si l'utilisateur a déjà mémorisé (donc 5 étapes)
}

export default function Stepper({ currentStep, hasMemorized }: StepperProps) {
  // Définition des étapes selon le parcours
  const steps = hasMemorized
    ? [
        { num: 1, label: "Situation", shortLabel: "Sit" },
        { num: 2, label: "Mémorisation", shortLabel: "Mém" },
        { num: 3, label: "Objectif", shortLabel: "Obj" },
        { num: 4, label: "Disponibilité", shortLabel: "Dispo" },
        { num: 5, label: "Nom", shortLabel: "Nom" },
      ]
    : [
        { num: 1, label: "Situation", shortLabel: "Sit" },
        // Pour débutant, on saute l'étape 2 de mémorisation, donc on décale les suivantes
        { num: 2, label: "Objectif", shortLabel: "Obj" },
        { num: 3, label: "Disponibilité", shortLabel: "Dispo" },
        { num: 4, label: "Nom", shortLabel: "Nom" },
      ];

  // Ajustement : pour débutant, les numéros affichés sont 1,2,3,4 mais le currentStep reçu est 1..4
  // Le currentStep correspond déjà au bon index (car le container gère le décalage)
  // On utilise directement steps.length

  return (
    <div className="w-full mb-8 px-2">
      {/* Version mobile : cercles numérotés seuls */}
      <div className="flex justify-between items-center gap-1 sm:hidden">
        {steps.map((step, idx) => {
          const stepNumber = step.num;
          const isActive = currentStep === stepNumber;
          const isPast = currentStep > stepNumber;
          return (
            <div key={stepNumber} className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-200
                  ${isActive ? 'bg-green-700 text-white ring-2 ring-green-300 shadow-md' : ''}
                  ${isPast ? 'bg-green-100 text-green-700 border border-green-300' : ''}
                  ${!isActive && !isPast ? 'bg-stone-100 text-stone-400 border border-stone-200' : ''}
                `}
              >
                {stepNumber}
              </div>
              {isActive && <div className="w-6 h-0.5 bg-green-700 mt-1 rounded-full" />}
            </div>
          );
        })}
      </div>

      {/* Version tablette/desktop : numéro + libellé */}
      <div className="hidden sm:flex justify-between items-center gap-2">
        {steps.map((step) => {
          const stepNumber = step.num;
          const isActive = currentStep === stepNumber;
          const isPast = currentStep > stepNumber;
          return (
            <div key={stepNumber} className="flex-1 text-center">
              <div
                className={`
                  inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${isActive ? 'bg-green-700 text-white shadow-md' : ''}
                  ${isPast ? 'bg-green-100 text-green-700' : ''}
                  ${!isActive && !isPast ? 'bg-stone-100 text-stone-500' : ''}
                `}
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {stepNumber}
                </span>
                <span className="hidden md:inline">{step.label}</span>
                <span className="md:hidden">{step.shortLabel}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
