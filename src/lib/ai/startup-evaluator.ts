import { EVALUATION_CRITERIA, RUBRICA } from './criteria';
import { CategoriaEvaluacion } from '@/data/mock/types';
import { vectorStore } from './vector-store-config';
import { serverOpenAI } from './server-only';

// Configuración de OpenAI (solo servidor)
const openai = serverOpenAI;

export interface RespuestaEvaluacion {
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: CategoriaEvaluacion;
  peso: number;
  orden: number;
}

export interface EvaluacionCriterio {
  categoria: CategoriaEvaluacion;
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

export class StartupEvaluator {
  private static instance: StartupEvaluator;

  private constructor() {}

  static getInstance(): StartupEvaluator {
    if (!StartupEvaluator.instance) {
      StartupEvaluator.instance = new StartupEvaluator();
    }
    return StartupEvaluator.instance;
  }

  async evaluarStartup(respuestas: RespuestaEvaluacion[]): Promise<EvaluacionCompleta> {
    try {
      // Agrupar respuestas por categoría
      const respuestasPorCategoria = this.agruparRespuestasPorCategoria(respuestas);
      
      // Evaluar cada categoría
      const evaluacionesCriterios: EvaluacionCriterio[] = [];
      
      for (const [categoria, respuestasCategoria] of Object.entries(respuestasPorCategoria)) {
        const evaluacion = await this.evaluarCategoria(
          categoria as CategoriaEvaluacion,
          respuestasCategoria
        );
        evaluacionesCriterios.push(evaluacion);
      }

      // Calcular puntaje total
      const puntajeTotal = this.calcularPuntajeTotal(evaluacionesCriterios);
      const confianza = this.calcularConfianzaPromedio(evaluacionesCriterios);

      // Generar análisis general
      const analisis = await this.generarAnalisisGeneral(evaluacionesCriterios, respuestas);

      // Determinar decisión final
      const decisionFinal = this.determinarDecisionFinal(puntajeTotal, evaluacionesCriterios);
      const justificacionDecision = await this.generarJustificacionDecision(
        decisionFinal,
        puntajeTotal,
        evaluacionesCriterios
      );

      return {
        criteriosEvaluados: evaluacionesCriterios,
        puntajeTotal,
        confianza,
        analisis,
        decisionFinal,
        justificacionDecision
      };

    } catch (error) {
      console.error('Error en evaluación de startup:', error);
      throw new Error('Error al evaluar la startup');
    }
  }

  private agruparRespuestasPorCategoria(respuestas: RespuestaEvaluacion[]): Record<CategoriaEvaluacion, RespuestaEvaluacion[]> {
    const agrupadas: Record<CategoriaEvaluacion, RespuestaEvaluacion[]> = {
      [CategoriaEvaluacion.COMPLEJIDAD]: [],
      [CategoriaEvaluacion.MERCADO]: [],
      [CategoriaEvaluacion.ESCALABILIDAD]: [],
      [CategoriaEvaluacion.EQUIPO]: []
    };

    respuestas.forEach(respuesta => {
      agrupadas[respuesta.categoria].push(respuesta);
    });

    return agrupadas;
  }

  private async evaluarCategoria(
    categoria: CategoriaEvaluacion,
    respuestas: RespuestaEvaluacion[]
  ): Promise<EvaluacionCriterio> {
    const criterio = EVALUATION_CRITERIA.find(c => c.id === this.mapCategoriaToCriterioId(categoria));
    
    if (!criterio) {
      throw new Error(`Criterio no encontrado para categoría: ${categoria}`);
    }

    // Obtener contexto del vector store
    const respuestasTexto = respuestas.map(r => r.respuesta);
    const contextoVectorStore = await vectorStore.getContextForEvaluation(
      this.mapCategoriaToRubricaKey(categoria),
      respuestasTexto
    );

    // Preparar contexto para la evaluación
    const contexto = this.prepararContextoEvaluacion(categoria, respuestas, criterio, contextoVectorStore);

    // Generar prompt para evaluación
    const prompt = this.generarPromptEvaluacion(categoria, contexto, criterio);

    try {
      console.log(`🔄 Evaluando categoría: ${categoria}`);
      
      // Crear un timeout de 30 segundos para la llamada a OpenAI (más que suficiente con gpt-4o-mini)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La evaluación tardó más de 30 segundos')), 30000);
      });

      const openaiPromise = openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Modelo ultra rápido y económico
        messages: [
          {
            role: 'system',
            content: `Eres un evaluador experto de startups. Evalúa según criterios específicos y proporciona justificaciones concisas.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 400
      });

      // Ejecutar con timeout
      const response = await Promise.race([openaiPromise, timeoutPromise]);

      const evaluacionTexto = (response as any).choices[0]?.message?.content;
      if (!evaluacionTexto) {
        throw new Error('No se recibió respuesta de la IA');
      }

      console.log(`✅ Evaluación completada para: ${categoria}`);
      
      // Parsear la respuesta
      return this.parsearEvaluacionCriterio(evaluacionTexto, categoria);

    } catch (error) {
      console.error(`❌ Error en evaluación de categoría ${categoria}:`, error);
      
      // Retornar evaluación por defecto con información del error
      return {
        categoria,
        nivel: 2,
        puntuacion: 50,
        justificacion: `Evaluación automática no disponible: ${error instanceof Error ? error.message : 'Error desconocido'}. Se requiere revisión manual.`,
        confianza: 0.3,
        recomendaciones: 'Verificar configuración de OpenAI y conexión a internet'
      };
    }
  }

  private prepararContextoEvaluacion(
    categoria: CategoriaEvaluacion,
    respuestas: RespuestaEvaluacion[],
    criterio: { id: string; nombre: string; descripcion: string; excelencia: string; peso: number },
    contextoVectorStore: string
  ): string {
    const respuestasTexto = respuestas
      .sort((a, b) => a.orden - b.orden)
      .map((r, index) => `Pregunta ${index + 1}: ${r.pregunta}\nRespuesta: ${r.respuesta}`)
      .join('\n\n');

    return `
Categoría: ${criterio.nombre}
Contexto: ${contextoVectorStore}
Respuestas: ${respuestasTexto}
`;
  }

  private generarPromptEvaluacion(
    categoria: CategoriaEvaluacion,
    contexto: string,
    criterio: { id: string; nombre: string; descripcion: string; excelencia: string; peso: number }
  ): string {
    const rubrica = RUBRICA[this.mapCategoriaToRubricaKey(categoria)];

    return `
Evalúa la startup en "${criterio.nombre}".

CONTEXTO: ${contexto}

RÚBRICA:
1: ${rubrica[1]}
2: ${rubrica[2]}
3: ${rubrica[3]}
4: ${rubrica[4]}

Asigna nivel (1-4), puntuación (25/50/75/100), confianza (0-1), justificación breve y recomendaciones.

RESPONDE EN JSON:
{
  "nivel": 3,
  "puntuacion": 75,
  "justificacion": "Justificación breve...",
  "confianza": 0.85,
  "recomendaciones": "Recomendación..."
}
`;
  }

  private parsearEvaluacionCriterio(
    texto: string,
    categoria: CategoriaEvaluacion
  ): EvaluacionCriterio {
    try {
      // Extraer JSON del texto
      const jsonMatch = texto.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No se encontró JSON en la respuesta');
      }

      const evaluacion = JSON.parse(jsonMatch[0]);

      return {
        categoria,
        nivel: evaluacion.nivel || 2,
        puntuacion: evaluacion.puntuacion || 50,
        justificacion: evaluacion.justificacion || 'Evaluación automática',
        confianza: evaluacion.confianza || 0.5,
        recomendaciones: evaluacion.recomendaciones
      };

    } catch (error) {
      console.error('Error parseando evaluación:', error);
      return {
        categoria,
        nivel: 2,
        puntuacion: 50,
        justificacion: 'Error en evaluación automática. Se requiere revisión manual.',
        confianza: 0.3
      };
    }
  }

  private calcularPuntajeTotal(evaluaciones: EvaluacionCriterio[]): number {
    const puntajes = evaluaciones.map(e => e.puntuacion);
    return puntajes.reduce((sum, puntaje) => sum + puntaje, 0) / puntajes.length;
  }

  private calcularConfianzaPromedio(evaluaciones: EvaluacionCriterio[]): number {
    const confianzas = evaluaciones.map(e => e.confianza);
    return confianzas.reduce((sum, confianza) => sum + confianza, 0) / confianzas.length;
  }

  private async generarAnalisisGeneral(
    evaluaciones: EvaluacionCriterio[],
    respuestasOriginales: RespuestaEvaluacion[]
  ): Promise<{
    fortalezas: string[];
    debilidades: string[];
    observaciones: string[];
    recomendaciones: string[];
  }> {
    // Agrupar respuestas por categoría para contexto
    const respuestasPorCategoria = this.agruparRespuestasPorCategoria(respuestasOriginales);
    
    const contexto = `
EVALUACIÓN DE STARTUP

Evaluaciones por criterio:
${evaluaciones.map(e => `${e.categoria}: Nivel ${e.nivel}, Puntuación ${e.puntuacion}`).join('\n')}

Puntaje total: ${this.calcularPuntajeTotal(evaluaciones)}/100

RESPUESTAS ESPECÍFICAS POR CATEGORÍA:

COMPLEJIDAD:
${respuestasPorCategoria.COMPLEJIDAD?.map(r => `- ${r.pregunta}: ${r.respuesta}`).join('\n') || 'No hay respuestas'}

MERCADO:
${respuestasPorCategoria.MERCADO?.map(r => `- ${r.pregunta}: ${r.respuesta}`).join('\n') || 'No hay respuestas'}

ESCALABILIDAD:
${respuestasPorCategoria.ESCALABILIDAD?.map(r => `- ${r.pregunta}: ${r.respuesta}`).join('\n') || 'No hay respuestas'}

EQUIPO:
${respuestasPorCategoria.EQUIPO?.map(r => `- ${r.pregunta}: ${r.respuesta}`).join('\n') || 'No hay respuestas'}
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Modelo ultra rápido y económico
        messages: [
          {
            role: 'system',
            content: `Eres un evaluador experto de startups. Analiza las respuestas específicas y genera un análisis detallado basado en el contenido real de las respuestas. Identifica fortalezas y debilidades específicas mencionadas en las respuestas, no uses texto genérico.`
          },
          {
            role: 'user',
            content: `${contexto}

Basándote en las respuestas específicas de la startup, genera ÚNICAMENTE un JSON válido con el siguiente formato exacto:

{
  "fortalezas": ["Fortaleza específica basada en las respuestas con detalles cuantitativos y cualitativos"],
  "debilidades": ["Debilidad específica basada en las respuestas"],
  "observaciones": ["Observación específica sobre el proyecto"],
  "recomendaciones": ["Recomendación específica para mejorar"]
}

REGLAS:
1. Responde ÚNICAMENTE con el JSON, sin texto adicional
2. Usa información específica de las respuestas, no texto genérico
3. Asegúrate de que el JSON sea válido y completo
4. No incluyas explicaciones fuera del JSON
5. Las fortalezas deben ser descriptivas e incluir métricas específicas (números, porcentajes, ratios)
6. Cada fortaleza debe explicar el impacto y beneficio para la startup`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const analisisTexto = response.choices[0]?.message?.content;
      if (!analisisTexto) {
        throw new Error('No se recibió análisis de la IA');
      }

      console.log('🔍 Respuesta de la IA:', analisisTexto.substring(0, 200) + '...');

      // Intentar extraer JSON de la respuesta
      let jsonMatch = analisisTexto.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        // Si no hay JSON, intentar crear uno básico basado en el contexto
        console.log('⚠️ No se encontró JSON, creando análisis básico...');
        return {
          fortalezas: ['Análisis basado en respuestas específicas'],
          debilidades: ['Se requiere revisión manual'],
          observaciones: ['Evaluación en proceso'],
          recomendaciones: ['Revisar manualmente los criterios']
        };
      }

      try {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validar que tenga la estructura correcta
        if (!parsed.fortalezas || !parsed.debilidades || !parsed.observaciones || !parsed.recomendaciones) {
          throw new Error('JSON incompleto');
        }
        
        return parsed;
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        throw new Error('JSON inválido en la respuesta de la IA');
      }

    } catch (error) {
      console.error('Error generando análisis general:', error);
      return {
        fortalezas: ['Análisis automático no disponible'],
        debilidades: ['Se requiere revisión manual'],
        observaciones: ['Evaluación en proceso'],
        recomendaciones: ['Revisar manualmente los criterios']
      };
    }
  }

  private determinarDecisionFinal(
    puntajeTotal: number,
    evaluaciones: EvaluacionCriterio[]
  ): 'APROBADA' | 'RECHAZADA' | 'REQUIERE_REVISION' {
    // Lógica de decisión basada en puntaje y criterios mínimos
    if (puntajeTotal >= 75 && evaluaciones.every(e => e.nivel >= 3)) {
      return 'APROBADA';
    } else if (puntajeTotal < 50 || evaluaciones.some(e => e.nivel <= 1)) {
      return 'RECHAZADA';
    } else {
      return 'REQUIERE_REVISION';
    }
  }

  private async generarJustificacionDecision(
    decision: 'APROBADA' | 'RECHAZADA' | 'REQUIERE_REVISION',
    puntajeTotal: number,
    evaluaciones: EvaluacionCriterio[]
  ): Promise<string> {
    const contexto = `
Puntaje total: ${puntajeTotal}/100
Decision: ${decision}
Evaluaciones: ${evaluaciones.map(e => `${e.categoria}: Nivel ${e.nivel}`).join(', ')}
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Modelo ultra rápido y económico
        messages: [
          {
            role: 'system',
            content: `Eres un evaluador. Justifica la decisión de manera concisa.`
          },
          {
            role: 'user',
            content: `${contexto}

Justifica brevemente la decisión ${decision}.`
          }
        ],
        temperature: 0.2,
        max_tokens: 150
      });

      return response.choices[0]?.message?.content || 
        `Decisión: ${decision} basada en puntaje total de ${puntajeTotal}/100`;

    } catch (error) {
      console.error('Error generando justificación:', error);
      return `Decisión: ${decision} basada en evaluación automática`;
    }
  }

  private mapCategoriaToCriterioId(categoria: CategoriaEvaluacion): string {
    const mapping: Record<CategoriaEvaluacion, string> = {
      [CategoriaEvaluacion.COMPLEJIDAD]: 'complejidad',
      [CategoriaEvaluacion.MERCADO]: 'mercado',
      [CategoriaEvaluacion.ESCALABILIDAD]: 'escalabilidad',
      [CategoriaEvaluacion.EQUIPO]: 'equipo'
    };
    return mapping[categoria];
  }

  private mapCategoriaToRubricaKey(categoria: CategoriaEvaluacion): keyof typeof RUBRICA {
    const mapping: Record<CategoriaEvaluacion, keyof typeof RUBRICA> = {
      [CategoriaEvaluacion.COMPLEJIDAD]: 'complejidad_problema',
      [CategoriaEvaluacion.MERCADO]: 'tamano_mercado',
      [CategoriaEvaluacion.ESCALABILIDAD]: 'escalabilidad',
      [CategoriaEvaluacion.EQUIPO]: 'equipo_emprendedor'
    };
    return mapping[categoria];
  }
}

export const startupEvaluator = StartupEvaluator.getInstance(); 