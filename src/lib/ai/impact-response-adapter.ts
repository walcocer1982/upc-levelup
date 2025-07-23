import { RespuestaEvaluacion } from './startup-evaluator';
import { CategoriaEvaluacion } from '@/data/mock/types';

export interface ImpactResponse {
  id: string;
  startupId: string;
  criterio: string;
  pregunta: number;
  respuesta: string;
  createdAt: string;
  updatedAt: string;
}

// Mapeo de criterios del formulario a categorías de evaluación
const CRITERIO_TO_CATEGORIA: Record<string, CategoriaEvaluacion> = {
  'complejidad': CategoriaEvaluacion.COMPLEJIDAD,
  'mercado': CategoriaEvaluacion.MERCADO,
  'escalabilidad': CategoriaEvaluacion.ESCALABILIDAD,
  'equipo': CategoriaEvaluacion.EQUIPO
};

// Mapeo de preguntas a títulos
const PREGUNTAS_TITULOS: Record<number, string> = {
  1: "Cuéntanos sobre un caso real y reciente",
  2: "¿Cómo abordaban el problema antes de su solución?",
  3: "¿Qué consecuencias tenía no resolver bien este problema?",
  4: "¿Han identificado a otros afectados?",
  5: "Estima el tamaño de tu mercado",
  6: "Validación con potenciales clientes",
  7: "Interés en pagar por la solución",
  8: "Segmento de mayor interés",
  9: "Estrategia de adquisición de primeros clientes",
  10: "Costo de adquisición de clientes (CAC)",
  11: "Facilidad de expansión",
  12: "Estrategias de escalabilidad probadas",
  13: "Trayectoria del equipo en el proyecto",
  14: "Experiencia relevante del equipo",
  15: "Roles y responsabilidades clave",
  16: "Superación de desafíos"
};

export class ImpactResponseAdapter {
  /**
   * Convierte las respuestas de ImpactResponse al formato que espera el evaluador IA
   */
  static adaptToEvaluatorFormat(impactResponses: ImpactResponse[]): RespuestaEvaluacion[] {
    return impactResponses.map(response => {
      const categoria = CRITERIO_TO_CATEGORIA[response.criterio];
      
      if (!categoria) {
        throw new Error(`Criterio no reconocido: ${response.criterio}`);
      }

      return {
        id: response.id,
        pregunta: PREGUNTAS_TITULOS[response.pregunta] || `Pregunta ${response.pregunta}`,
        respuesta: response.respuesta,
        categoria: categoria,
        peso: 1, // Peso uniforme para todas las preguntas
        orden: response.pregunta
      };
    });
  }

  /**
   * Organiza las respuestas por categoría para el evaluador
   */
  static organizeByCategory(impactResponses: ImpactResponse[]): Record<CategoriaEvaluacion, RespuestaEvaluacion[]> {
    const adaptedResponses = this.adaptToEvaluatorFormat(impactResponses);
    
    const organized: Record<CategoriaEvaluacion, RespuestaEvaluacion[]> = {
      [CategoriaEvaluacion.COMPLEJIDAD]: [],
      [CategoriaEvaluacion.MERCADO]: [],
      [CategoriaEvaluacion.ESCALABILIDAD]: [],
      [CategoriaEvaluacion.EQUIPO]: []
    };

    adaptedResponses.forEach(response => {
      organized[response.categoria].push(response);
    });

    return organized;
  }

  /**
   * Valida que todas las respuestas necesarias estén presentes
   */
  static validateCompleteness(impactResponses: ImpactResponse[]): {
    isValid: boolean;
    missingQuestions: number[];
    totalQuestions: number;
    answeredQuestions: number;
  } {
    const expectedQuestions = Array.from({ length: 16 }, (_, i) => i + 1);
    const answeredQuestions = impactResponses.map(r => r.pregunta);
    const missingQuestions = expectedQuestions.filter(q => !answeredQuestions.includes(q));

    return {
      isValid: missingQuestions.length === 0,
      missingQuestions,
      totalQuestions: 16,
      answeredQuestions: answeredQuestions.length
    };
  }

  /**
   * Obtiene un resumen de las respuestas por categoría
   */
  static getCategorySummary(impactResponses: ImpactResponse[]): Record<string, {
    total: number;
    answered: number;
    questions: number[];
  }> {
    const categories = ['complejidad', 'mercado', 'escalabilidad', 'equipo'];
    const summary: Record<string, { total: number; answered: number; questions: number[] }> = {};

    categories.forEach(category => {
      const categoryResponses = impactResponses.filter(r => r.criterio === category);
      const expectedQuestions = category === 'complejidad' ? [1, 2, 3, 4] :
                               category === 'mercado' ? [5, 6, 7, 8] :
                               category === 'escalabilidad' ? [9, 10, 11, 12] : [13, 14, 15, 16];

      summary[category] = {
        total: 4,
        answered: categoryResponses.length,
        questions: categoryResponses.map(r => r.pregunta)
      };
    });

    return summary;
  }
} 