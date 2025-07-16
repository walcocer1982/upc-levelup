import { openai, generateEmbedding, searchVectorStore } from './openai-config';
import { EVALUATION_CRITERIA } from './criteria';

export interface DetailedEvaluation {
  criterioId: string;
  score: number;
  razones: string[];
  mejoras: string[];
  similitudScore: number;
  contextoRelevante: string;
  respuestasComparadas: string[];
}

export class AdvancedEvaluator {
  private async compareWithCriteria(respuesta: string, criterio: any): Promise<DetailedEvaluation> {
    // Buscar contexto relevante en el vector store
    const contextoRelevante = await searchVectorStore(
      `Criterios de evaluación para ${criterio.nombre}: ${criterio.descripcion}`
    );
    
    // Obtener embedding de la respuesta del usuario
    const respuestaEmbedding = await generateEmbedding(respuesta);
    
    // Obtener embedding del criterio de excelencia
    const criterioEmbedding = await generateEmbedding(criterio.excelencia);
    
    // Calcular similitud
    const similitud = await this.calculateSimilarity(respuestaEmbedding, criterioEmbedding);
    
    // Generar evaluación detallada usando GPT con contexto del vector store
    const evaluation = await this.generateDetailedEvaluation(
      respuesta, 
      criterio, 
      similitud, 
      contextoRelevante
    );
    
    return {
      criterioId: criterio.id,
      score: Math.round(similitud * 10),
      razones: evaluation.razones,
      mejoras: evaluation.mejoras,
      similitudScore: similitud,
      contextoRelevante: contextoRelevante || 'No se encontró contexto específico',
      respuestasComparadas: [respuesta, criterio.excelencia]
    };
  }

  private async calculateSimilarity(embedding1: number[], embedding2: number[]): Promise<number> {
    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitude1 * magnitude2);
  }

  private async generateDetailedEvaluation(
    respuesta: string, 
    criterio: any, 
    similitud: number, 
    contextoRelevante: string
  ): Promise<{razones: string[], mejoras: string[]}> {
    const prompt = `
    Evalúa la siguiente respuesta del emprendedor usando el contexto experto y los criterios de excelencia:
    
    CONTEXTO EXPERTO DEL VECTOR STORE:
    ${contextoRelevante}
    
    CRITERIO: ${criterio.nombre}
    DESCRIPCIÓN: ${criterio.descripcion}
    
    RESPUESTA DEL EMPRENDEDOR:
    ${respuesta}
    
    CRITERIO DE EXCELENCIA:
    ${criterio.excelencia}
    
    SIMILITUD CALCULADA: ${similitud.toFixed(3)}
    
    Genera:
    1. 3 razones específicas por las que la respuesta obtiene esta puntuación
    2. 3 mejoras concretas y accionables basadas en el contexto experto
    
    Responde en formato JSON:
    {
      "razones": ["razón 1", "razón 2", "razón 3"],
      "mejoras": ["mejora 1", "mejora 2", "mejora 3"]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    return JSON.parse(response.choices[0].message.content || '{"razones": [], "mejoras": []}');
  }

  public async evaluateStartup(responses: any): Promise<DetailedEvaluation[]> {
    const evaluations: DetailedEvaluation[] = [];
    
    // Evaluar cada criterio
    for (const criterio of EVALUATION_CRITERIA) {
      const respuesta = this.getResponseForCriterio(responses, criterio.id);
      if (respuesta) {
        const evaluation = await this.compareWithCriteria(respuesta, criterio);
        evaluations.push(evaluation);
      }
    }
    
    return evaluations;
  }

  private getResponseForCriterio(responses: any, criterioId: string): string {
    // Mapear criterios a respuestas del formulario
    const mapping = {
      'complejidad': responses.complejidad.casoReal,
      'mercado': responses.mercado.tamanoMercado,
      'escalabilidad': responses.escalabilidad.estrategiaAdquisicion,
      'equipo': responses.equipo.trayectoriaEquipo
    };
    
    return mapping[criterioId] || '';
  }
}

// Exportar una instancia del evaluador
export const advancedEvaluator = new AdvancedEvaluator(); 