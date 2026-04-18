export interface QuestionnaireData {
  situation: 'debutant' | 'intermediaire' | 'avance' | 'revision' | null;
  departMemorisation: 'debut' | 'milieu' | 'juzPrecis' | null;
  juzArrive: number;
  qualiteMemorisation: 'solide' | 'partielle' | 'oubliee' | null;
  objectif: 'nombreJuz' | 'dateButoir' | 'revision' | null;
  nombreJuzObjectif: number;
  aDateObjectif: boolean;
  dateObjectif: string;
  heuresDisponibles: string[];
  minutesParJour: number;
  joursParSemaine: string[];
  prenom: string;
}

export interface UserProfile {
  prenom: string;
  juzActuel: number;
  objectif: string;
  tempsParJour: number;
  createdAt: string;
  memorizationQuality: 'good' | 'partial' | 'forgotten';
  revisionOnlyUntil?: string;
  urgentReviewPages: number[];
}

export interface DailyProgress {
  date: string;
  pagesDone: number;
  completed: boolean;
  lastReviewedAt?: string;
  pageQuality?: 'fluent' | 'hesitant' | 'hard';
  sessionSeconds: number;
  pageNumber?: number;
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
