import { getFormResponseById } from '@/lib/ai/mock-adapter';
import { EvaluacionRepository, PostulacionRepository, PostulacionStatus } from '@/data/mock';
import evaluator, { EnhancedEvaluator } from '@/lib/ai/enhanced-evaluator';
import { Evaluacion } from '@/data/mock/types';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { startupId, startupName, responses } = data;

    console.log('🔍 Evaluando startup:', { startupId, startupName });

    // Obtener respuestas del formulario
    const formResponses = getFormResponseById(startupId);
    if (!formResponses) {
      throw new Error('No se encontraron respuestas para la startup');
    }

    // Realizar evaluación con IA
    const evaluation = await evaluator.evaluateStartupWithContext({
      id: startupId,
      startupName,
      ...formResponses
    });

    // Guardar evaluación en el mock
    const mockEvaluation: Evaluacion = {
      id: `eval-${startupId}`,
      postulacionId: startupId,
      evaluadorId: 'admin-001',
      puntajeTotal: evaluation.totalScore,
      feedbackGeneral: evaluation.observations.join('\n'),
      recomendacion: evaluation.totalScore >= 70 ? 'aprobado' : 'rechazado',
      fechaEvaluacion: new Date(),
      completedAt: new Date(),
      estado: 'COMPLETED',
      createdAt: new Date(),
      updatedAt: new Date(),
      fortalezas: evaluation.strengths,
      debilidades: evaluation.weaknesses,
      analisisDetallado: evaluation.observations.join('\n'),
      criteriosEvaluados: evaluation.scores.map(score => ({
        id: `crit-${score.criterioId}`,
        evaluacionId: `eval-${startupId}`,
        criterioId: score.criterioId,
        puntaje: score.score,
        feedback: score.mejoras,
        justificacion: score.razones,
        mejoras: score.mejoras,
        impacto: score.score >= 75 ? 'ALTO' : score.score >= 50 ? 'MEDIO' : 'BAJO'
      }))
    };

    // Guardar en el mock
    EvaluacionRepository.saveEvaluacion(mockEvaluation);

    // Actualizar estado de la postulación
    await PostulacionRepository.actualizarEstadoPostulacion(
      startupId,
      evaluation.totalScore >= 70 ? PostulacionStatus.APROBADA : PostulacionStatus.EN_REVISION
    );

    return Response.json({ evaluation });
  } catch (error) {
    console.error('Error en evaluación:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
} 
