// Versiones seguras para el cliente de los servicios de IA
// Estas funciones solo hacen llamadas a API routes del servidor

export interface RespuestaEvaluacion {
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: string;
  peso: number;
  orden: number;
}

export interface EvaluacionCriterio {
  categoria: string;
  nivel: number;
  puntuacion: number;
  justificacion: string;
  confianza: number;
  recomendaciones?: string;
}

export interface EvaluacionCompleta {
  criteriosEvaluados: EvaluacionCriterio[];
  puntajeTotal: number;
  confianza: number;
  analisis: {
    fortalezas: string[];
    debilidades: string[];
    observaciones: string[];
    recomendaciones: string[];
  };
  decisionFinal: 'APROBADA' | 'RECHAZADA' | 'REQUIERE_REVISION';
  justificacionDecision: string;
}

// Cliente seguro para evaluaciones
export class ClientSafeEvaluator {
  static async evaluarStartup(postulacionId: string): Promise<EvaluacionCompleta> {
    const response = await fetch('/api/evaluaciones/iniciar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postulacionId }),
    });

    if (!response.ok) {
      throw new Error('Error al evaluar la startup');
    }

    const result = await response.json();
    return result.evaluacion;
  }

  static async buscarContextoRelevante(
    categoria: string,
    respuestas: string[]
  ): Promise<string> {
    const response = await fetch('/api/evaluaciones/contexto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoria, respuestas }),
    });

    if (!response.ok) {
      return '';
    }

    const result = await response.json();
    return result.contexto;
  }
}

export const clientSafeEvaluator = ClientSafeEvaluator; 