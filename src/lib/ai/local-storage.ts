// Interfaces para las respuestas del formulario
export interface FormResponses {
  id: string;
  startupName: string;
  complejidad: {
    casoReal: string;
    abordajePrevio: string;
    consecuencias: string;
    identificacionAfectados: string;
  };
  mercado: {
    tamanoMercado: string;
    validacionClientes: string;
    interesPago: string;
    segmentoInteres: string;
  };
  escalabilidad: {
    estrategiaAdquisicion: string;
    costoAdquisicion: string;
    facilidadExpansion: string;
    estrategiasProbadas: string;
  };
  equipo: {
    trayectoriaEquipo: string;
    experienciaRelevante: string;
    rolesResponsabilidades: string;
    superacionDesafios: string;
  };
  createdAt: string;
}

// Interfaces para los resultados de evaluación
export interface EvaluationScore {
  criterioId: string;
  score: number;
  razones: string;
  mejoras: string;
}

export interface LocalEvaluation {
  id: string;
  startupId: string;
  startupName: string;
  scores: EvaluationScore[];
  totalScore: number;
  observations: string[];
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  createdAt: string;
}

// Clase para gestionar el almacenamiento local
export class LocalStorageManager {
  // Clave para las respuestas del formulario
  private responsesKey = 'startup_responses';
  // Clave para las evaluaciones
  private evaluationsKey = 'startup_evaluations';

  // Verificar si estamos en el navegador
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  // Guardar respuestas del formulario
  saveResponses(responses: Omit<FormResponses, 'id' | 'createdAt'>): string {
    if (!this.isClient()) return '';

    // Cargar respuestas existentes
    const existingResponses = this.getResponses();
    
    // Crear nuevo ID
    const id = `resp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Crear nueva entrada
    const newResponse: FormResponses = {
      ...responses,
      id,
      createdAt: new Date().toISOString()
    };
    
    // Guardar en localStorage
    localStorage.setItem(
      this.responsesKey, 
      JSON.stringify([...existingResponses, newResponse])
    );
    
    return id;
  }

  // Obtener todas las respuestas
  getResponses(): FormResponses[] {
    if (!this.isClient()) return [];
    
    const data = localStorage.getItem(this.responsesKey);
    if (!data) return [];
    
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing responses from localStorage', e);
      return [];
    }
  }

  // Obtener una respuesta por ID
  getResponseById(id: string): FormResponses | null {
    const responses = this.getResponses();
    return responses.find(r => r.id === id) || null;
  }

  // Guardar una evaluación
  saveEvaluation(evaluation: Omit<LocalEvaluation, 'id' | 'createdAt'>): string {
    if (!this.isClient()) return '';

    // Cargar evaluaciones existentes
    const existingEvaluations = this.getEvaluations();
    
    // Crear nuevo ID
    const id = `eval_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Crear nueva entrada
    const newEvaluation: LocalEvaluation = {
      ...evaluation,
      id,
      createdAt: new Date().toISOString()
    };
    
    // Guardar en localStorage
    localStorage.setItem(
      this.evaluationsKey, 
      JSON.stringify([...existingEvaluations, newEvaluation])
    );
    
    return id;
  }

  // Obtener todas las evaluaciones
  getEvaluations(): LocalEvaluation[] {
    if (!this.isClient()) return [];
    
    const data = localStorage.getItem(this.evaluationsKey);
    if (!data) return [];
    
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing evaluations from localStorage', e);
      return [];
    }
  }

  // Obtener una evaluación por ID
  getEvaluationById(id: string): LocalEvaluation | null {
    const evaluations = this.getEvaluations();
    return evaluations.find(e => e.id === id) || null;
  }

  // Obtener evaluaciones para una startup específica
  getEvaluationsByStartupId(startupId: string): LocalEvaluation[] {
    const evaluations = this.getEvaluations();
    return evaluations.filter(e => e.startupId === startupId);
  }

  // Borrar todos los datos (para pruebas)
  clearAll(): void {
    if (!this.isClient()) return;
    
    localStorage.removeItem(this.responsesKey);
    localStorage.removeItem(this.evaluationsKey);
  }
}

// Exportar una instancia del gestor
export const localStorageManager = new LocalStorageManager(); 