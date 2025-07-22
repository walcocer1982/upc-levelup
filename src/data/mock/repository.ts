import { mockDb } from './database';
import {
  Startup,
  Postulacion, PostulacionStatus,
  Respuesta,
  EvaluacionIA, EvaluacionStatus,
  Supervision
} from './types';
import { EvaluationStorage } from '@/lib/storage/evaluation-storage';

export class Repository {
  // Métodos para Startups
  static async getStartup(id: string): Promise<Startup | undefined> {
    return mockDb.getStartup(id);
  }

  static async getAllStartups(): Promise<Startup[]> {
    return mockDb.getAllStartups();
  }

  static async saveStartup(startup: Startup): Promise<void> {
    mockDb.saveStartup(startup);
  }

  // Métodos para Postulaciones
  static async getPostulacion(id: string): Promise<Postulacion | undefined> {
    return mockDb.getPostulacion(id);
  }

  static async getAllPostups(): Promise<Postulacion[]> {
    return mockDb.getAllPostulaciones();
  }

  static async getPostulacionesByStartup(startupId: string): Promise<Postulacion[]> {
    return mockDb.getPostulacionesByStartup(startupId);
  }

  static async savePostulacion(postulacion: Postulacion): Promise<void> {
    mockDb.savePostulacion(postulacion);
  }

  static async actualizarEstadoPostulacion(id: string, estado: PostulacionStatus): Promise<void> {
    const postulacion = await this.getPostulacion(id);
    if (postulacion) {
      postulacion.estado = estado;
      postulacion.updatedAt = new Date();
      await this.savePostulacion(postulacion);
    }
  }

  // Métodos para Respuestas
  static async getRespuestasByPostulacion(postulacionId: string): Promise<Respuesta[]> {
    return mockDb.getRespuestasByPostulacion(postulacionId);
  }

  static async saveRespuesta(respuesta: Respuesta): Promise<void> {
    mockDb.saveRespuesta(respuesta);
  }

  // Métodos para Evaluaciones IA
  static async getEvaluacionIA(id: string): Promise<EvaluacionIA | undefined> {
    return mockDb.getEvaluacionIA(id);
  }

  static async getEvaluacionIAByPostulacion(postulacionId: string): Promise<EvaluacionIA | undefined> {
    // Primero buscar en localStorage
    const storedEvaluation = EvaluationStorage.getEvaluationByPostulacion(postulacionId);
    if (storedEvaluation) {
      console.log(`📱 Evaluación encontrada en localStorage: ${storedEvaluation.id}`);
      return storedEvaluation;
    }
    
    // Si no está en localStorage, buscar en mock
    const mockEvaluation = mockDb.getEvaluacionIAByPostulacion(postulacionId);
    if (mockEvaluation) {
      console.log(`🗄️ Evaluación encontrada en mock: ${mockEvaluation.id}`);
      // Sincronizar con localStorage
      EvaluationStorage.saveEvaluation(mockEvaluation);
    }
    
    return mockEvaluation;
  }

  static async getAllEvaluacionesIA(): Promise<EvaluacionIA[]> {
    // Obtener evaluaciones del mock
    const mockEvaluations = mockDb.getAllEvaluacionesIA();
    
    // Obtener evaluaciones de localStorage
    const storedEvaluations = EvaluationStorage.getAllEvaluations();
    
    // Combinar y eliminar duplicados
    const allEvaluations = [...mockEvaluations];
    storedEvaluations.forEach(stored => {
      const existsInMock = mockEvaluations.some(mock => mock.id === stored.id);
      if (!existsInMock) {
        allEvaluations.push(stored);
      }
    });
    
    console.log(`📊 Total evaluaciones: ${allEvaluations.length} (${mockEvaluations.length} mock + ${storedEvaluations.length} almacenadas)`);
    return allEvaluations;
  }

  static async saveEvaluacionIA(evaluacion: EvaluacionIA): Promise<void> {
    // Validar estado de la postulación
    const postulacion = await this.getPostulacion(evaluacion.postulacionId);
    if (!postulacion) {
      throw new Error('Postulación no encontrada');
    }

    // Actualizar estado de la postulación según el resultado
    if (evaluacion.estado === EvaluacionStatus.COMPLETADA) {
      await this.actualizarEstadoPostulacion(
        postulacion.id,
        PostulacionStatus.ESPERANDO_SUPERVISION
      );
    }

    // Guardar en mock
    mockDb.saveEvaluacionIA(evaluacion);
    
    // Guardar en localStorage para persistencia
    EvaluationStorage.saveEvaluation(evaluacion);
    
    console.log(`💾 Evaluación ${evaluacion.id} guardada en mock y localStorage`);
  }

  // Métodos para Supervisiones
  static async getSupervision(id: string): Promise<Supervision | undefined> {
    return mockDb.getSupervision(id);
  }

  static async getSupervisionByEvaluacion(evaluacionId: string): Promise<Supervision | undefined> {
    return mockDb.getSupervisionByEvaluacion(evaluacionId);
  }

  static async saveSupervision(supervision: Supervision): Promise<void> {
    // Validar evaluación
    const evaluacion = await this.getEvaluacionIA(supervision.evaluacionId);
    if (!evaluacion) {
      throw new Error('Evaluación no encontrada');
    }

    // Actualizar estado de la postulación según la decisión
    if (supervision.estado === EvaluacionStatus.COMPLETADA) {
      await this.actualizarEstadoPostulacion(
        evaluacion.postulacionId,
        supervision.decisionFinal === 'APROBADA' 
          ? PostulacionStatus.APROBADA 
          : supervision.decisionFinal === 'RECHAZADA'
            ? PostulacionStatus.RECHAZADA
            : PostulacionStatus.REQUIERE_REVISION
      );

      // Si requiere revisión, actualizar estado de la evaluación
      if (supervision.decisionFinal === 'REQUIERE_REVISION') {
        evaluacion.estado = EvaluacionStatus.REQUIERE_REVISION;
        await this.saveEvaluacionIA(evaluacion);
      }
    }

    mockDb.saveSupervision(supervision);
  }

  // Método para reiniciar datos
  static async resetMockData(): Promise<void> {
    mockDb.reset();
  }

  // Método para sincronizar evaluaciones con localStorage
  static async syncEvaluationsWithStorage(): Promise<void> {
    try {
      const mockEvaluations = mockDb.getAllEvaluacionesIA();
      EvaluationStorage.syncWithMock(mockEvaluations);
      console.log('🔄 Evaluaciones sincronizadas con localStorage');
    } catch (error) {
      console.error('Error sincronizando evaluaciones:', error);
    }
  }

  // Método para obtener estadísticas de almacenamiento
  static getStorageStats() {
    return EvaluationStorage.getStorageStats();
  }
} 