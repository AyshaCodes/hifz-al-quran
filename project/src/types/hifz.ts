export type Situation = 'debutant' | 'peu_avance' | 'plusieurs_juz' | 'revision';
export type DepartMemorisation = 'debut' | 'fin';
export type QualiteMemorisation = 'solide' | 'partielle' | 'oubliee';
export type ObjectifHifz = 'complet' | 'quelques_juz' | 'revision';
export type JourSemaine = 'L' | 'M' | 'Me' | 'J' | 'V' | 'S' | 'D';
export type HeureDisponible = 'fajr' | 'matin' | 'apres-midi' | 'soir' | 'nuit';

export interface QuestionnaireData {
  situation: Situation | null;
  departMemorisation: DepartMemorisation | null;
  juzArrive: number;
  qualiteMemorisation: QualiteMemorisation | null;
  objectif: ObjectifHifz | null;
  nombreJuzObjectif: number;
  aDateObjectif: boolean;
  dateObjectif: string;
  heuresDisponibles: HeureDisponible[];
  minutesParJour: number;
  joursParSemaine: JourSemaine[];
  prenom: string;
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

export interface HifzProfile {
  questionnaire: QuestionnaireData;
  programme: ProgrammeHifz;
  dateCreation: string;
  pageActuelle: number;
}

export interface JourProgress {
  date: string;
  pageFaite: boolean;
  pageRevisee: boolean;
  dureeSession: number;
}

export interface HifzProgress {
  jours: JourProgress[];
  joursConsecutifs: number;
  pagesCompletees: number;
  juzCompletes: number;
  derniereRevision: { [page: number]: string };
}
