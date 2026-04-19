export interface QuestionnaireData {
  situation: 'debutant' | 'intermediaire' | 'avance' | 'revision' | null;
  direction: 'fatiha-nas' | 'nas-fatiha' | null;
  departMemorisation: 'debut' | 'milieu' | 'juzPrecis' | 'souratePrecise' | null;
  juzArrive: number;
  sourateArrive: number;
  qualiteMemorisation: 'solide' | 'partielle' | 'oubliee' | null;
  objectif: 'nombreJuz' | 'dateButoir' | 'revision' | null;
  nombreJuzObjectif: number;
  aDateObjectif: boolean;
  dateObjectif: string;
  heuresDisponibles: string[];
  minutesParJour: number;
  rythmePerso: number; // Nouveau : nombre de pages choisi par l'utilisateur
  joursParSemaine: string[];
  prenom: string;
}

export interface UserProfile {
  prenom: string;
  juzActuel: number;
  direction: 'fatiha-nas' | 'nas-fatiha';
  objectif: string;
  tempsParJour: number;
  pagesParJour: number;
  createdAt: string;
  memorizationQuality: 'good' | 'partial' | 'forgotten';
  revisionOnlyUntil?: string;
  urgentReviewPages: number[];
}

export type HifzProfile = UserProfile;

export interface DailyProgress {
  date: string;
  pagesDone: number;
  completed: boolean;
  lastReviewedAt?: string;
  pageQuality?: 'fluent' | 'hesitant' | 'hard';
  sessionSeconds: number;
  pageNumber?: number;
}

export interface HifzProgress {
  jours: DailyProgress[];
  joursConsecutifs: number;
  pagesCompletees: number;
  juzCompletes: number;
  derniereRevision: Record<number, string>;
}

export interface ProgrammeHifz {
  pagesParJour: number;
  dureeEstimeeMois: number;
  phase: 'memorisation' | 'revision' | 'revision_pure';
  revisionPureRequise: boolean;
  juzDepart: number;
  pagesTotal: number;
  pagesRestantes: number;
}

export interface GuidedProfile {
  name: string;
  level: 'non-arabic' | 'beginner' | 'intermediate' | 'advanced' | 'hafiz';
  pace: 'slow' | 'moderate' | 'intense' | 'custom';
  daysPerWeek: number;
  customPagesPerDay?: number;
  mode: 'guided';
  needsTransliteration: boolean;
  createdAt: string;
}
