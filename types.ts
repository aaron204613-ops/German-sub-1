export interface VerbData {
  infinitive: string;
  auxiliary: 'hat' | 'ist';
  participle: string;
  chinese: string;
}

export enum AppState {
  LOADING = 'LOADING',
  READY = 'READY',
  STUDYING = 'STUDYING',
  SUMMARY = 'SUMMARY',
  ERROR = 'ERROR'
}

export interface StudySessionResult {
  verb: VerbData;
  known: boolean;
}