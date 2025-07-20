import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/ai/openai-config';

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
async function evaluarCriterio(
  criterio: keyof typeof basePrompts,
  respuestas: any
) {
  try {
    console.log(`Evaluando criterio ${criterio} con respuestas:`, respuestas);
    
    // Extraer las respuestas específicas según el criterio
    let textoRespuestas = '';
    
    switch (criterio) {
      case 'complejidad':
        textoRespuestas = `
Caso Real: ${respuestas.casoReal || 'No especificado'}
Abordaje Previo: ${respuestas.abordajePrevio || 'No especificado'}
Consecuencias: ${respuestas.consecuencias || 'No especificado'}
Afectados: ${respuestas.identificacionAfectados || 'No especificado'}
        `.trim();
        break;
        
      case 'mercado':
        textoRespuestas = `
Tamaño de Mercado: ${respuestas.tamanoMercado || 'No especificado'}
Validación con Clientes: ${respuestas.validacionClientes || 'No especificado'}
Interés en Pagar: ${respuestas.interesPago || 'No especificado'}
Segmento de Interés: ${respuestas.segmentoInteres || 'No especificado'}
        `.trim();
        break;
        
      case 'escalabilidad':
        textoRespuestas = `
Estrategia de Adquisición: ${respuestas.estrategiaAdquisicion || 'No especificado'}
Costo de Adquisición: ${respuestas.costoAdquisicion || 'No especificado'}
Facilidad de Expansión: ${respuestas.facilidadExpansion || 'No especificado'}
Estrategias Probadas: ${respuestas.estrategiasProbadas || 'No especificado'}
        `.trim();
        break;
        
      case 'equipo':
        textoRespuestas = `
Trayectoria del Equipo: ${respuestas.trayectoriaEquipo || 'No especificado'}
Experiencia Relevante: ${respuestas.experienciaRelevante || 'No especificado'}
Roles y Responsabilidades: ${respuestas.rolesResponsabilidades || 'No especificado'}
Superación de Desafíos: ${respuestas.superacionDesafios || 'No especificado'}
        `.trim();
        break;
    }
    
    // Crear el prompt completo con contexto específico
    const promptCompleto = `${basePrompts[criterio]}

RESPUESTAS ESPECÍFICAS DE LA STARTUP:
${textoRespuestas}

Evalúa basándote ÚNICAMENTE en las respuestas específicas proporcionadas arriba. No uses información genérica.`;
    
    console.log(`Prompt para ${criterio}:`, promptCompleto);
    
    // Llamar a OpenAI para evaluación
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { 
          role: "system", 
          content: `Eres un experto evaluador de startups. Evalúa el siguiente criterio basándote ÚNICAMENTE en las respuestas específicas proporcionadas. No uses información genérica. Devuelve SOLO JSON con el formato:
{
  "score": [número entre 0-100],
  "razones": "Explicación detallada de la puntuación basada en las respuestas específicas",
  "mejoras": "Recomendaciones específicas para mejorar basadas en las respuestas"
}`
        },
        { role: "user", content: promptCompleto }
      ]
    });

    const result = JSON.parse(response.choices[0].message.content);
    console.log(`Resultado para ${criterio}:`, result);
    
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
  scores: any[],
  startupName: string
) {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startupId, startupName, respuestas } = body;

    if (!respuestas) {
      return NextResponse.json(
        { error: 'No se proporcionaron respuestas para evaluar' },
        { status: 400 }
      );
    }

    console.log('Iniciando evaluación IA para:', startupName);
    console.log('Respuestas recibidas:', respuestas);

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
      await generarObservaciones(scores, startupName);
    
    // Crear evaluación
    const evaluacion = {
      startupId,
      startupName,
      scores,
      totalScore,
      observations,
      recommendations,
      strengths,
      weaknesses,
      createdAt: new Date().toISOString()
    };

    console.log('Evaluación IA completada exitosamente');

    return NextResponse.json({
      success: true,
      evaluation: evaluacion
    });

  } catch (error) {
    console.error('Error en la evaluación IA:', error);
    return NextResponse.json(
      { error: 'Error durante la evaluación IA' },
      { status: 500 }
    );
  }
}
