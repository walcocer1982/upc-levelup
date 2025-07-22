import { EvaluacionIA } from '@/data/mock/types';

const EVALUATIONS_STORAGE_KEY = 'upc_levelup_evaluations';
const EVALUATIONS_BACKUP_KEY = 'upc_levelup_evaluations_backup';

export class EvaluationStorage {
  /**
   * Guardar evaluación en localStorage
   */
  static saveEvaluation(evaluacion: EvaluacionIA): void {
    try {
      const evaluations = this.getAllEvaluations();
      
      // Actualizar o agregar la evaluación
      const existingIndex = evaluations.findIndex(e => e.id === evaluacion.id);
      if (existingIndex >= 0) {
        evaluations[existingIndex] = evaluacion;
      } else {
        evaluations.push(evaluacion);
      }
      
      // Guardar en localStorage
      localStorage.setItem(EVALUATIONS_STORAGE_KEY, JSON.stringify(evaluations));
      
      // Crear backup
      this.createBackup(evaluations);
      
      console.log(`💾 Evaluación ${evaluacion.id} guardada en localStorage`);
    } catch (error) {
      console.error('Error guardando evaluación en localStorage:', error);
    }
  }

  /**
   * Obtener todas las evaluaciones de localStorage
   */
  static getAllEvaluations(): EvaluacionIA[] {
    try {
      const data = localStorage.getItem(EVALUATIONS_STORAGE_KEY);
      if (!data) return [];
      
      const evaluations = JSON.parse(data);
      
      // Convertir fechas de string a Date
      return evaluations.map((evaluacion: any) => ({
        ...evaluacion,
        createdAt: new Date(evaluacion.createdAt),
        updatedAt: new Date(evaluacion.updatedAt),
        metadata: {
          ...evaluacion.metadata,
          ultimaActualizacion: new Date(evaluacion.metadata.ultimaActualizacion)
        },
        criteriosEvaluados: evaluacion.criteriosEvaluados.map((crit: any) => ({
          ...crit,
          createdAt: new Date(crit.createdAt),
          updatedAt: new Date(crit.updatedAt)
        }))
      }));
    } catch (error) {
      console.error('Error cargando evaluaciones de localStorage:', error);
      return [];
    }
  }

  /**
   * Obtener evaluación por ID de postulación
   */
  static getEvaluationByPostulacion(postulacionId: string): EvaluacionIA | undefined {
    const evaluations = this.getAllEvaluations();
    return evaluations.find(e => e.postulacionId === postulacionId);
  }

  /**
   * Obtener evaluación por ID
   */
  static getEvaluationById(id: string): EvaluacionIA | undefined {
    const evaluations = this.getAllEvaluations();
    return evaluations.find(e => e.id === id);
  }

  /**
   * Eliminar evaluación
   */
  static deleteEvaluation(id: string): void {
    try {
      const evaluations = this.getAllEvaluations();
      const filtered = evaluations.filter(e => e.id !== id);
      localStorage.setItem(EVALUATIONS_STORAGE_KEY, JSON.stringify(filtered));
      console.log(`🗑️ Evaluación ${id} eliminada de localStorage`);
    } catch (error) {
      console.error('Error eliminando evaluación de localStorage:', error);
    }
  }

  /**
   * Limpiar todas las evaluaciones
   */
  static clearAll(): void {
    try {
      localStorage.removeItem(EVALUATIONS_STORAGE_KEY);
      console.log('🧹 Todas las evaluaciones eliminadas de localStorage');
    } catch (error) {
      console.error('Error limpiando evaluaciones de localStorage:', error);
    }
  }

  /**
   * Crear backup de las evaluaciones
   */
  private static createBackup(evaluations: EvaluacionIA[]): void {
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        count: evaluations.length,
        evaluations: evaluations
      };
      localStorage.setItem(EVALUATIONS_BACKUP_KEY, JSON.stringify(backup));
    } catch (error) {
      console.error('Error creando backup:', error);
    }
  }

  /**
   * Restaurar desde backup
   */
  static restoreFromBackup(): EvaluacionIA[] {
    try {
      const backupData = localStorage.getItem(EVALUATIONS_BACKUP_KEY);
      if (!backupData) return [];
      
      const backup = JSON.parse(backupData);
      console.log(`🔄 Restaurando ${backup.count} evaluaciones desde backup del ${backup.timestamp}`);
      
      // Guardar las evaluaciones del backup
      localStorage.setItem(EVALUATIONS_STORAGE_KEY, JSON.stringify(backup.evaluations));
      
      return this.getAllEvaluations();
    } catch (error) {
      console.error('Error restaurando desde backup:', error);
      return [];
    }
  }

  /**
   * Sincronizar evaluaciones del mock con localStorage
   */
  static syncWithMock(mockEvaluations: EvaluacionIA[]): void {
    try {
      const storedEvaluations = this.getAllEvaluations();
      const allEvaluations = [...mockEvaluations];
      
      // Agregar evaluaciones almacenadas que no estén en el mock
      storedEvaluations.forEach(stored => {
        const existsInMock = mockEvaluations.some(mock => mock.id === stored.id);
        if (!existsInMock) {
          allEvaluations.push(stored);
        }
      });
      
      // Guardar todas las evaluaciones
      localStorage.setItem(EVALUATIONS_STORAGE_KEY, JSON.stringify(allEvaluations));
      console.log(`🔄 Sincronizadas ${allEvaluations.length} evaluaciones (${mockEvaluations.length} mock + ${storedEvaluations.length} almacenadas)`);
    } catch (error) {
      console.error('Error sincronizando evaluaciones:', error);
    }
  }

  /**
   * Obtener estadísticas de almacenamiento
   */
  static getStorageStats(): {
    totalEvaluations: number;
    storageSize: number;
    lastBackup: string | null;
  } {
    try {
      const evaluations = this.getAllEvaluations();
      const data = localStorage.getItem(EVALUATIONS_STORAGE_KEY);
      const backupData = localStorage.getItem(EVALUATIONS_BACKUP_KEY);
      
      let lastBackup = null;
      if (backupData) {
        const backup = JSON.parse(backupData);
        lastBackup = backup.timestamp;
      }
      
      return {
        totalEvaluations: evaluations.length,
        storageSize: data ? new Blob([data]).size : 0,
        lastBackup
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de almacenamiento:', error);
      return {
        totalEvaluations: 0,
        storageSize: 0,
        lastBackup: null
      };
    }
  }
} 