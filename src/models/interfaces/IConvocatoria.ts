import { ICriterio } from './ICriterio';

export interface IConvocatoria {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: ConvocatoriaStatus;
  criterios: ICriterio[];
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ConvocatoriaStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
  EVALUATING = 'evaluating',
  FINISHED = 'finished',
}
