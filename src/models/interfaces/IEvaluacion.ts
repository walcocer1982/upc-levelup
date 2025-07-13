export interface IEvaluacion {
  id: string;
  postulacionId: string;
  evaluadorId: string;
  puntajes: IPuntaje[];
  comentario?: string;
  aiSuggestion?: boolean;
  totalScore: number;
  status: EvaluacionStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
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
