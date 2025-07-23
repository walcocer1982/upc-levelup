import { IStartup } from './IStartup'

export interface IScore {
  criterioId: string;
  criterioName: string;
  score: number;
  razones: string;
  mejoras: string;
}

export interface IEvaluacion {
  id: string;
  postulacionId: string;
  evaluadorId: string;
  puntajes: IPuntaje[];
  comentario?: string;
  aiSuggestion?: boolean;
  totalScore: number;
  score: number;
  scores?: IScore[];
  status: EvaluacionStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  startup?: IStartup;
  strengths?: string[];
  weaknesses?: string[];
  detailedAnalysis?: string;
}

export interface IPuntaje {
  criterioId: string;
  score: number;
  comentario?: string;
}

export enum EvaluacionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}
