import { HifzProfile } from '../../types/hifz';
import { minutesToLabel } from '../../utils/calculations';

interface Props {
  profile: HifzProfile;
  onStart: () => void;
}

export default function ProgramSummary({ profile, onStart }: Props) {
  const { questionnaire, programme } = profile;

  const getPhaseLabel = () => {
    switch (programme.phase) {
      case 'memorisation': return 'Mémorisation';
      case 'revision': return 'Révision';
      case 'revision_pure': return 'Révision intensive';
      default: return programme.phase;
    }
  };

  const getObjectifLabel = () => {
    switch (questionnaire.objectif) {
      case 'complet': return 'Coran complet (30 Juz)';
      case 'quelques_juz': return `${questionnaire.nombreJuzObjectif} Juz`;
      case 'revision': return 'Révision uniquement';
      default: return questionnaire.objectif;
    }
  };

  const getSituationLabel = () => {
    switch (questionnaire.situation) {
      case 'debutant': return 'Débutant';
      case 'peu_avance': return 'Peu avancé';
      case 'plusieurs_juz': return 'Plusieurs Juz';
      case 'revision': return 'Révision';
      default: return questionnaire.situation;
    }
  };

  return (
    <div className="min-h-screen bg-beige-100 dark:bg-gray-950 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start px-3 sm:px-4 py-8 sm:py-16">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <div
              className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              هِفْظ
            </div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400 tracking-wide">
              Votre programme personnalisé
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
              Voici le résumé de votre parcours Hifz, {questionnaire.prenom}
            </p>
          </div>

          <div className="card p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Profil */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">👤 Votre profil</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-beige-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Situation</div>
                  <div className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200">{getSituationLabel()}</div>
                </div>
                <div className="bg-beige-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Objectif</div>
                  <div className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200">{getObjectifLabel()}</div>
                </div>
              </div>
            </div>

            {/* Programme */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">📋 Votre programme</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-beige-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Phase actuelle</div>
                  <div className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200">{getPhaseLabel()}</div>
                </div>
                <div className="bg-beige-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pages par jour</div>
                  <div className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200">{programme.pagesParJour}</div>
                </div>
                <div className="bg-beige-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Temps quotidien</div>
                  <div className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200">{minutesToLabel(questionnaire.minutesParJour)}</div>
                </div>
                <div className="bg-beige-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Durée estimée</div>
                  <div className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200">{programme.dureeEstimeeMois} mois</div>
                </div>
              </div>
            </div>

            {/* Planning */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">📅 Votre planning</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-beige-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Jours de session</div>
                  <div className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200">
                    {questionnaire.joursParSemaine.map(jour => {
                      const jours: Record<string, string> = {
                        'L': 'Lun', 'M': 'Mar', 'Me': 'Mer', 'J': 'Jeu', 'V': 'Ven', 'S': 'Sam', 'D': 'Dim'
                      };
                      return jours[jour];
                    }).join(', ')}
                  </div>
                </div>
                <div className="bg-beige-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Heures préférées</div>
                  <div className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200">
                    {questionnaire.heuresDisponibles.map(heure => {
                      const heures: Record<string, string> = {
                        'fajr': 'Fajr', 'matin': 'Matin', 'apres-midi': 'Après-midi', 'soir': 'Soir', 'nuit': 'Nuit'
                      };
                      return heures[heure];
                    }).join(', ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">📊 Vos statistiques</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-beige-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">{programme.pagesTotal}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pages totales</div>
                </div>
                <div className="bg-beige-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">{programme.pagesRestantes}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pages restantes</div>
                </div>
                <div className="bg-beige-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">{Math.ceil(programme.pagesRestantes / programme.pagesParJour)}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Jours requis</div>
                </div>
              </div>
            </div>

            {/* Bouton démarrer */}
            <div className="pt-4 sm:pt-6 border-t border-beige-200 dark:border-gray-700">
              <button
                onClick={onStart}
                className="w-full py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold btn-primary"
              >
                🚀 Commencer mon Hifz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
