// Enums centralizados
export enum StartupStatus {
  ACTIVA = 'ACTIVA',
  INACTIVA = 'INACTIVA',
  PENDIENTE = 'PENDIENTE'
}

export enum PostulacionStatus {
  ENVIADA = 'ENVIADA',
  EN_EVALUACION_IA = 'EN_EVALUACION_IA',
  ESPERANDO_SUPERVISION = 'ESPERANDO_SUPERVISION',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
  REQUIERE_REVISION = 'REQUIERE_REVISION'
}

export enum EvaluacionStatus {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADA = 'COMPLETADA',
  REQUIERE_REVISION = 'REQUIERE_REVISION'
}

export enum CategoriaEvaluacion {
  COMPLEJIDAD = 'COMPLEJIDAD',
  MERCADO = 'MERCADO',
  ESCALABILIDAD = 'ESCALABILIDAD',
  EQUIPO = 'EQUIPO'
}

// Interfaces base
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

// Entidades principales
export interface Startup extends BaseEntity {
  nombre: string;
  descripcion: string;
  categoria: string;
  sector: string;
  estado: StartupStatus;
  fundadores: string[];
  miembros: string[];
  website?: string;
  linkedin?: string;
  pitchDeck?: string;
  logo?: string;
  fechaFundacion: Date;
  ubicacion: string;
  mercadoObjetivo: string;
  modeloNegocio: string;
}

export interface Postulacion extends BaseEntity {
  startupId: string;
  convocatoriaId: string;
  estado: PostulacionStatus;
  fechaPostulacion: Date;
  fechaEvaluacion?: Date;
  fechaResultado?: Date;
  documentos: string[];
  respuestas: Respuesta[];
}

export interface Respuesta extends BaseEntity {
  postulacionId: string;
  criterioId: string;
  pregunta: string;
  respuesta: string;
  categoria: CategoriaEvaluacion;
  peso: number;
  orden: number;
}

export interface EvaluacionIA extends BaseEntity {
  postulacionId: string;
  estado: EvaluacionStatus;
  modelVersion: string;
  confianza: number;
  criteriosEvaluados: CriterioEvaluado[];
  puntajeTotal: number;
  analisis: {
    fortalezas: string[];
    debilidades: string[];
    observaciones: string[];
    recomendaciones: string[];
  };
  metadata: {
    tiempoEvaluacion: number;
    intentos: number;
    ultimaActualizacion: Date;
  };
}

export interface CriterioEvaluado extends BaseEntity {
  evaluacionId: string;
  criterioId: string;
  categoria: CategoriaEvaluacion;
  puntajeOriginal: number; // 1-4
  puntajeNormalizado: number; // 0-100
  justificacion: string;
  recomendaciones: string;
  confianza: number;
}

export interface Supervision extends BaseEntity {
  evaluacionId: string;
  supervisorId: string;
  estado: EvaluacionStatus;
  ajustes: {
    criterioId: string;
    puntajeOriginal: number;
    puntajeAjustado: number;
    justificacion: string;
  }[];
  comentarios: string;
  decisionFinal: 'APROBADA' | 'RECHAZADA' | 'REQUIERE_REVISION';
  tiempoRevision: number;
}

export interface Criterio extends BaseEntity {
  categoria: CategoriaEvaluacion;
  nombre: string;
  descripcion: string;
  peso: number;
  rubrica: {
    nivel: number;
    descripcion: string;
    puntajeMinimo: number;
    ejemplos: string[];
  }[];
  ejemploExcelencia: string;
} 