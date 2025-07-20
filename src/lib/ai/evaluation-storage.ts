import { getMockData, mockDB } from "@/data/mock";

// Interfaces para el almacenamiento de evaluaciones
export interface StoredEvaluation {
  id: string;
  postulacionId: string;
  evaluadorId: string;
  criteriosEvaluados: StoredCriterioEvaluado[];
  puntajeTotal: number;
  feedbackGeneral: string;
  recomendacion: 'aprobado' | 'rechazado' | 'pendiente';
  fechaEvaluacion: Date;
  createdAt: Date;
  updatedAt: Date;
  status: 'evaluacion_ia' | 'en_revision_admin' | 'evaluacion_final';
  adminFeedback?: string;
  adminRecommendation?: 'aprobado' | 'rechazado' | 'pendiente';
}

export interface StoredCriterioEvaluado {
  id: string;
  evaluacionId: string;
  criterioId: string;
  puntaje: number; // 1-4
  feedback: string;
  justificacion: string;
  adminPuntaje?: number;
  adminFeedback?: string;
  adminJustificacion?: string;
}

// Clase para gestionar evaluaciones usando MockDB
export class EvaluationStorageManager {
  
  // Guardar evaluación usando MockDB
  static async saveEvaluation(evaluacion: any, postulacionId: string): Promise<string> {
    try {
      // Convertir evaluación al formato de mock data
      const storedEvaluation: StoredEvaluation = {
        id: evaluacion.id || `eval-${Date.now()}`,
        postulacionId,
        evaluadorId: 'admin-001', // Por defecto
        criteriosEvaluados: evaluacion.scores.map((score: any, index: number) => ({
          id: `criterio-eval-${evaluacion.id || 'temp'}-${index}`,
          evaluacionId: evaluacion.id || 'temp',
          criterioId: score.criterioId,
          puntaje: Math.round((score.adminScore || score.score) / 25), // Convertir de 0-100 a 1-4
          feedback: score.adminMejoras || score.mejoras,
          justificacion: score.adminRazones || score.razones,
          adminPuntaje: score.adminScore ? Math.round(score.adminScore / 25) : undefined,
          adminFeedback: score.adminMejoras,
          adminJustificacion: score.adminRazones
        })),
        puntajeTotal: Math.round((evaluacion.adminScore || evaluacion.totalScore) / 25),
        feedbackGeneral: evaluacion.adminFeedback || evaluacion.observations.join('\n'),
        recomendacion: evaluacion.adminRecommendation || 'pendiente',
        fechaEvaluacion: new Date(),
        createdAt: new Date(evaluacion.createdAt || Date.now()),
        updatedAt: new Date(),
        status: evaluacion.status || 'evaluacion_ia',
        adminFeedback: evaluacion.adminFeedback,
        adminRecommendation: evaluacion.adminRecommendation
      };
      
      // Guardar usando MockDB
      const evaluationId = await mockDB.saveEvaluation(storedEvaluation);
      console.log('Evaluación guardada en MockDB:', evaluationId);
      
      return evaluationId;
    } catch (error) {
      console.error('Error guardando evaluación:', error);
      throw new Error('Failed to save evaluation');
    }
  }
  
  // Obtener evaluación por postulación usando MockDB
  static async getEvaluationByPostulacion(postulacionId: string): Promise<StoredEvaluation | null> {
    try {
      const evaluaciones = await mockDB.getEvaluationsByPostulacion(postulacionId);
      return evaluaciones[0] || null;
    } catch (error) {
      console.error('Error obteniendo evaluación:', error);
      return null;
    }
  }

  // Obtener evaluación en formato compatible con la UI
  static async getEvaluationForUI(postulacionId: string): Promise<any | null> {
    try {
      const storedEvaluation = await this.getEvaluationByPostulacion(postulacionId);
      
      if (!storedEvaluation) {
        return null;
      }

      // Convertir al formato esperado por la UI
      return {
        id: storedEvaluation.id,
        postulacionId: storedEvaluation.postulacionId,
        startupId: storedEvaluation.postulacionId, // Usar postulacionId como startupId
        startupName: `Startup ${storedEvaluation.postulacionId}`, // Nombre por defecto
        puntajeTotal: storedEvaluation.puntajeTotal,
        puntajes: storedEvaluation.criteriosEvaluados.map(criterio => ({
          criterioId: criterio.criterioId,
          puntaje: criterio.puntaje,
          razones: criterio.justificacion,
          mejoras: criterio.feedback
        })),
        observaciones: storedEvaluation.feedbackGeneral ? [storedEvaluation.feedbackGeneral] : [],
        recomendaciones: [],
        fortalezas: [],
        debilidades: [],
        status: storedEvaluation.status,
        recomendacion: storedEvaluation.recomendacion,
        createdAt: storedEvaluation.createdAt.toISOString(),
        updatedAt: storedEvaluation.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Error obteniendo evaluación para UI:', error);
      return null;
    }
  }

  // Eliminar evaluación usando MockDB
  static async deleteEvaluation(postulacionId: string): Promise<boolean> {
    try {
      return await mockDB.deleteEvaluationByPostulacion(postulacionId);
    } catch (error) {
      console.error('Error eliminando evaluación:', error);
      return false;
    }
  }
  
  // Actualizar evaluación existente usando MockDB
  static async updateEvaluation(evaluationId: string, updates: Partial<StoredEvaluation>): Promise<boolean> {
    try {
      await mockDB.update('evaluaciones', evaluationId, updates);
      return true;
    } catch (error) {
      console.error('Error actualizando evaluación:', error);
      return false;
    }
  }
  
  // Obtener todas las evaluaciones usando MockDB
  static async getAllEvaluations(): Promise<StoredEvaluation[]> {
    try {
      return await mockDB.read('evaluaciones') as StoredEvaluation[];
    } catch (error) {
      console.error('Error obteniendo evaluaciones:', error);
      return [];
    }
  }
  
  // Obtener evaluaciones por estado usando MockDB
  static async getEvaluationsByStatus(status: string): Promise<StoredEvaluation[]> {
    try {
      return await mockDB.query('evaluaciones', { status }) as StoredEvaluation[];
    } catch (error) {
      console.error('Error obteniendo evaluaciones por estado:', error);
      return [];
    }
  }
  
  // Obtener estadísticas de evaluaciones usando MockDB
  static async getEvaluationStats() {
    try {
      const stats = mockDB.getStats();
      
      return {
        total: stats.totalEvaluaciones,
        porEstado: stats.evaluacionesByStatus,
        porRecomendacion: {
          aprobado: 0, // Calcular desde evaluaciones
          rechazado: 0,
          pendiente: 0
        },
        promedioPuntaje: 0 // Calcular desde evaluaciones
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        total: 0,
        porEstado: { evaluacion_ia: 0, en_revision_admin: 0, evaluacion_final: 0 },
        porRecomendacion: { aprobado: 0, rechazado: 0, pendiente: 0 },
        promedioPuntaje: 0
      };
    }
  }
}

// Función de utilidad para convertir evaluación editable a formato de almacenamiento
export function convertToStoredFormat(evaluacion: any, postulacionId: string): StoredEvaluation {
  return {
    id: evaluacion.id || `eval-${Date.now()}`,
    postulacionId,
    evaluadorId: 'admin-001',
    criteriosEvaluados: evaluacion.scores.map((score: any, index: number) => ({
      id: `criterio-eval-${evaluacion.id || 'temp'}-${index}`,
      evaluacionId: evaluacion.id || 'temp',
      criterioId: score.criterioId,
      puntaje: Math.round((score.adminScore || score.score) / 25),
      feedback: score.adminMejoras || score.mejoras,
      justificacion: score.adminRazones || score.razones,
      adminPuntaje: score.adminScore ? Math.round(score.adminScore / 25) : undefined,
      adminFeedback: score.adminMejoras,
      adminJustificacion: score.adminRazones
    })),
    puntajeTotal: Math.round((evaluacion.adminScore || evaluacion.totalScore) / 25),
    feedbackGeneral: evaluacion.adminFeedback || evaluacion.observations.join('\n'),
    recomendacion: evaluacion.adminRecommendation || 'pendiente',
    fechaEvaluacion: new Date(),
    createdAt: new Date(evaluacion.createdAt || Date.now()),
    updatedAt: new Date(),
    status: evaluacion.status || 'evaluacion_final',
    adminFeedback: evaluacion.adminFeedback,
    adminRecommendation: evaluacion.adminRecommendation
  };
} 