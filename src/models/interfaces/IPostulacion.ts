export interface IPostulacion {
  id: string;
  startupId: string;
  convocatoriaId: string;
  status: PostulacionStatus;
  respuestas: IRespuesta[];
  evaluaciones: string[]; // IDs de evaluaciones
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  feedback?: string[];
}

export interface IRespuesta {
  criterioId: string;
  value: any;
  file?: string; // URL al archivo
  status: RespuestaStatus;
  updatedAt: Date;
}

export enum PostulacionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  IN_REVIEW = 'in_review',
  EVALUATED = 'evaluated',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum RespuestaStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  INVALID = 'invalid',
}
