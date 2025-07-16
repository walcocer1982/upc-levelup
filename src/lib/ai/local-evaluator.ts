import { openai, generateEmbedding } from './openai-config';
import { FormResponses, EvaluationScore, LocalEvaluation, localStorageManager } from './local-storage';

// Prompts base para cada criterio
const basePrompts = {
  complejidad: `Evalúa la complejidad y relevancia del problema considerando:
- Caso real y tangible presentado
- Método anterior de solución
- Impacto negativo del problema
- Alcance de personas/empresas afectadas
Califica de 0-100 donde:
0-20: Problema trivial o mal definido
21-40: Problema común con impacto limitado
41-60: Problema relevante bien documentado
61-80: Problema significativo con alto impacto
81-100: Problema crítico con impacto transformacional`,

  mercado: `Evalúa el potencial de mercado considerando:
- Tamaño realista del mercado objetivo
- Nivel de validación con clientes reales
- Disposición comprobada a pagar
- Claridad del segmento objetivo
Califica de 0-100 donde:
0-20: Mercado no validado
21-40: Validación inicial básica
41-60: Buena validación con mercado definido
61-80: Fuerte validación y segmento claro
81-100: Validación excepcional con alto potencial`,

  escalabilidad: `Evalúa el potencial de escalabilidad considerando:
- Estrategia clara de adquisición de clientes
- CAC realista y bien calculado
- Facilidad real de expansión
- Evidencia de estrategias probadas
Califica de 0-100 donde:
0-20: Sin estrategia clara de escalabilidad
21-40: Estrategia básica con algunas pruebas
41-60: Buena estrategia con validación inicial
61-80: Estrategia sólida bien probada
81-100: Estrategia excepcional con resultados comprobados`,

  equipo: `Evalúa la capacidad del equipo considerando:
- Tiempo trabajando juntos
- Experiencia relevante al sector
- Claridad en roles y responsabilidades
- Capacidad de resolver desafíos
Califica de 0-100 donde:
0-20: Equipo sin experiencia relevante
21-40: Equipo con experiencia básica
41-60: Buen equipo con roles claros
61-80: Equipo sólido con experiencia probada
81-100: Equipo excepcional con track record`
};

// Función para evaluar un criterio específico
export async function evaluarCriterio(
  criterio: keyof typeof basePrompts,
  respuestas: Record<string, string>
): Promise<EvaluationScore> {
  try {
    // Combinar respuestas en un texto
    const textoRespuestas = Object.entries(respuestas)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n\n');
    
    // Crear el prompt completo
    const promptCompleto = `${basePrompts[criterio]}\n\nRespuestas de la startup:\n${textoRespuestas}`;
    
    // Llamar a OpenAI para evaluación
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { 
          role: "system", 
          content: `Eres un experto evaluador de startups. Evalúa el siguiente criterio y devuelve SOLO JSON con el formato:
{
  "score": [número entre 0-100],
  "razones": "Explicación detallada de la puntuación",
  "mejoras": "Recomendaciones específicas para mejorar"
}`
        },
        { role: "user", content: promptCompleto }
      ]
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Mapear criterio a su ID
    const criterioIdMap: Record<string, string> = {
      complejidad: 'complejidad_problema',
      mercado: 'tamano_mercado',
      escalabilidad: 'escalabilidad',
      equipo: 'equipo_emprendedor'
    };
    
    return {
      criterioId: criterioIdMap[criterio],
      score: result.score,
      razones: result.razones,
      mejoras: result.mejoras
    };
  } catch (error) {
    console.error(`Error evaluando criterio ${criterio}:`, error);
    
    // Devolver una evaluación por defecto en caso de error
    return {
      criterioId: criterio,
      score: 50,
      razones: "No se pudo evaluar completamente debido a un error técnico.",
      mejoras: "Proporcionar más detalles específicos y cuantificables."
    };
  }
}

// Función para generar observaciones y recomendaciones
async function generarObservaciones(
  scores: EvaluationScore[],
  startupName: string
): Promise<{
  observations: string[];
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}> {
  try {
    const scoresSummary = scores.map(s => 
      `${s.criterioId}: ${s.score}/100 - ${s.razones.substring(0, 100)}...`
    ).join('\n');
    
    const prompt = `
Analiza los siguientes resultados de evaluación para la startup "${startupName}":

${scoresSummary}

Genera:
1. 2-3 observaciones generales sobre la startup
2. 2-3 recomendaciones concretas para mejorar
3. 2-3 fortalezas principales
4. 2-3 áreas de mejora prioritarias

Devuelve SOLO JSON con el formato:
{
  "observations": ["observación 1", "observación 2", ...],
  "recommendations": ["recomendación 1", "recomendación 2", ...],
  "strengths": ["fortaleza 1", "fortaleza 2", ...],
  "weaknesses": ["debilidad 1", "debilidad 2", ...]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Eres un analista experto de startups." },
        { role: "user", content: prompt }
      ]
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error generando observaciones:", error);
    
    // Devolver valores por defecto en caso de error
    return {
      observations: ["La startup muestra un desarrollo mixto en las áreas evaluadas."],
      recommendations: ["Enfocarse en mejorar las áreas con menor puntuación."],
      strengths: ["Hay aspectos positivos en el planteamiento general."],
      weaknesses: ["Algunas áreas requieren mayor desarrollo y validación."]
    };
  }
}

// Función principal para evaluar una startup completa
export async function evaluarStartupLocal(startupId: string): Promise<LocalEvaluation | null> {
  try {
    // Obtener las respuestas de la startup
    const respuestas = localStorageManager.getResponseById(startupId);
    if (!respuestas) {
      throw new Error(`No se encontraron respuestas para la startup con ID ${startupId}`);
    }
    
    // Evaluar cada criterio
    const complejidadScore = await evaluarCriterio('complejidad', respuestas.complejidad);
    const mercadoScore = await evaluarCriterio('mercado', respuestas.mercado);
    const escalabilidadScore = await evaluarCriterio('escalabilidad', respuestas.escalabilidad);
    const equipoScore = await evaluarCriterio('equipo', respuestas.equipo);
    
    const scores = [complejidadScore, mercadoScore, escalabilidadScore, equipoScore];
    
    // Calcular puntuación total
    const totalScore = scores.reduce((sum, score) => sum + score.score, 0) / scores.length;
    
    // Generar observaciones y recomendaciones
    const { observations, recommendations, strengths, weaknesses } = 
      await generarObservaciones(scores, respuestas.startupName);
    
    // Crear evaluación
    const evaluacion: Omit<LocalEvaluation, 'id' | 'createdAt'> = {
      startupId,
      startupName: respuestas.startupName,
      scores,
      totalScore,
      observations,
      recommendations,
      strengths,
      weaknesses
    };
    
    // Guardar evaluación
    const evaluacionId = localStorageManager.saveEvaluation(evaluacion);
    
    // Devolver la evaluación completa
    return localStorageManager.getEvaluationById(evaluacionId);
  } catch (error) {
    console.error("Error evaluando startup:", error);
    return null;
  }
}

// Función para generar datos de ejemplo para pruebas
export function generarDatosEjemplo() {
  // Respuestas de ejemplo
  const respuestasEjemplo = {
    startupName: "EcoDeliver",
    complejidad: {
      casoReal: "La cadena de restaurantes 'El Buen Sabor' perdía aproximadamente el 20% de sus entregas debido a retrasos y problemas de coordinación con repartidores independientes.",
      abordajePrevio: "Utilizaban un grupo de WhatsApp para coordinar entregas y Excel para hacer seguimiento. No tenían forma de predecir demanda ni optimizar rutas.",
      consecuencias: "Pérdidas mensuales de S/5,000 en pedidos cancelados, clientes insatisfechos, y repartidores frustrados por rutas ineficientes. Rating en apps de delivery bajó a 3.5 estrellas.",
      identificacionAfectados: "Hemos identificado más de 200 restaurantes en Lima con problemas similares. En promedio pierden 15-25% de sus pedidos por mala coordinación."
    },
    mercado: {
      tamanoMercado: "En Lima existen más de 20,000 restaurantes que hacen delivery, de los cuales 5,000 son nuestro mercado objetivo inicial (restaurantes medianos con 20+ pedidos diarios).",
      validacionClientes: "Hemos entrevistado a 50 dueños de restaurantes, 15 nos permitieron hacer pruebas piloto con su operación actual.",
      interesPago: "12 restaurantes firmaron carta de intención para usar nuestro servicio cuando esté listo. Dispuestos a pagar entre S/299-499 mensual según volumen.",
      segmentoInteres: "Restaurantes medianos (20-100 pedidos/día) en zonas urbanas de Lima, especialmente pollerías, chifas y comida criolla con delivery propio."
    },
    escalabilidad: {
      estrategiaAdquisicion: "1. Programa de referidos con restaurantes piloto\n2. Alianzas con asociaciones de restaurantes\n3. Equipo de ventas directa con demos in-situ\n4. Marketing digital enfocado en dolor points específicos",
      costoAdquisicion: "CAC estimado: S/1,200 por restaurante\n- Demo y visitas: S/300\n- Marketing digital: S/400\n- Comisión vendedor: S/500\nTiempo promedio de cierre: 3 semanas",
      facilidadExpansion: "Modelo altamente escalable:\n- Software cloud-based\n- Onboarding automatizado\n- Soporte remoto\n- Costos marginales bajos por cliente adicional",
      estrategiasProbadas: "Piloto con 5 restaurantes mostró:\n- Reducción 40% en tiempo de coordinación\n- Aumento 25% en entregas exitosas\n- ROI positivo en 2 meses para clientes"
    },
    equipo: {
      trayectoriaEquipo: "El equipo fundador lleva 8 meses trabajando juntos en este proyecto. Nos conocimos en un hackathon de logística donde ganamos el primer puesto.",
      experienciaRelevante: "- CEO: 5 años en gestión de operaciones de delivery\n- CTO: Desarrollador senior, ex-Rappi\n- COO: 8 años administrando restaurantes\n- Lead Dev: Especialista en optimización de rutas",
      rolesResponsabilidades: "Roles claramente definidos:\n- CEO: Estrategia y ventas\n- CTO: Desarrollo producto\n- COO: Operaciones y soporte\n- Lead Dev: Arquitectura técnica\nReuniones diarias de coordinación",
      superacionDesafios: "Durante el piloto inicial, tuvimos problemas de adopción con repartidores. Rediseñamos la UX basados en feedback, creamos programa de capacitación, y aumentamos adopción de 40% a 95% en 3 semanas."
    }
  };
  
  // Guardar respuestas de ejemplo
  return localStorageManager.saveResponses(respuestasEjemplo);
} 