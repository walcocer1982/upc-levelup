export interface IFeedback {
  id: string;
  postulacionId: string;
  evaluadorId: string;
  content: string;
  type: FeedbackType;
  createdAt: Date;
}

export enum FeedbackType {
  GENERAL = 'general',
  CRITERIO = 'criterio',
  MEJORA = 'mejora',
  RECHAZO = 'rechazo',
}
