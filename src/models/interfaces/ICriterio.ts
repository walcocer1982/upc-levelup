export interface ICriterio {
  id: string;
  name: string;
  description: string;
  weight: number; // Ponderación del criterio (0-100)
  convocatoriaId: string;
  type: CriterioType;
  required: boolean;
  minScore: number;
  maxScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum CriterioType {
  TEXT = 'text',
  NUMBER = 'number',
  FILE = 'file',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
}
