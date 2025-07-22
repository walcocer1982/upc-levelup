import { Repository } from './repository';
import { 
  EvaluacionIA, 
  EvaluacionStatus, 
  CriterioEvaluado,
  Supervision,
  PostulacionStatus,
  CategoriaEvaluacion
} from './types';
import { ServerAIServices } from '@/lib/ai/server-services';

export class EvaluacionService {
  private static instance: EvaluacionService;

  private constructor() {}

  static getInstance(): EvaluacionService {
    if (!EvaluacionService.instance) {
      EvaluacionService.instance = new EvaluacionService();
    }
    return EvaluacionService.instance;
  }

  async iniciarEvaluacion(postulacionId: string): Promise<EvaluacionIA> {
    try {
      // Verificar que no exista ya una evaluación
      const evaluacionExistente = await Repository.getEvaluacionIAByPostulacion(postulacionId);
      if (evaluacionExistente) {
        return evaluacionExistente;
      }

      // Obtener respuestas de la postulación
      const respuestas = await Repository.getRespuestasByPostulacion(postulacionId);
      if (!respuestas || respuestas.length === 0) {
        throw new Error('No se encontraron respuestas para la postulación');
      }

      // Convertir respuestas al formato del evaluador
      const respuestasEvaluacion = respuestas.map(r => ({
        id: r.id,
        pregunta: r.pregunta,
        respuesta: r.respuesta,
        categoria: r.categoria,
        peso: r.peso,
        orden: r.orden
      }));

      // Realizar evaluación con IA usando servicios del servidor
      const evaluacionCompleta = await ServerAIServices.evaluarStartup(respuestasEvaluacion);

      // Crear evaluación IA
      const evaluacionIA: EvaluacionIA = {
        id: `eval-${Date.now()}`,
        postulacionId,
        estado: EvaluacionStatus.COMPLETADA,
        modelVersion: 'gpt-4-turbo-preview',
        confianza: evaluacionCompleta.confianza,
        criteriosEvaluados: evaluacionCompleta.criteriosEvaluados.map(ec => ({
          id: `crit-eval-${Date.now()}-${ec.categoria}`,
          evaluacionId: `eval-${Date.now()}`,
          criterioId: `crit-${ec.categoria}`,
          categoria: ec.categoria,
          puntajeOriginal: ec.nivel,
          puntajeNormalizado: ec.puntuacion,
          justificacion: ec.justificacion,
          recomendaciones: ec.recomendaciones || '',
          confianza: ec.confianza,
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1
        })),
        puntajeTotal: evaluacionCompleta.puntajeTotal,
        analisis: evaluacionCompleta.analisis,
        metadata: {
          tiempoEvaluacion: 0,
          intentos: 1,
          ultimaActualizacion: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      };

      // Guardar evaluación
      await Repository.saveEvaluacionIA(evaluacionIA);

      // Actualizar estado de la postulación
      const postulacion = await Repository.getPostulacion(postulacionId);
      if (postulacion) {
        postulacion.estado = PostulacionStatus.EVALUADA;
        await Repository.savePostulacion(postulacion);
      }

      return evaluacionIA;

    } catch (error) {
      console.error('Error iniciando evaluación:', error);
      throw new Error('Error al iniciar la evaluación de IA');
    }
  }

  async evaluarCriterio(
    evaluacionId: string,
    criterioId: string,
    respuestas: Record<string, string>
  ): Promise<CriterioEvaluado> {
    try {
      const evaluacion = await Repository.getEvaluacionIA(evaluacionId);
      if (!evaluacion) {
        throw new Error('Evaluación no encontrada');
      }

      // Esta función está diseñada para evaluar criterios individuales
      // Por ahora, retornamos un criterio evaluado por defecto
      const criterioEvaluadoCompleto: CriterioEvaluado = {
        id: `crit-eval-${Date.now()}`,
        evaluacionId,
        criterioId,
        categoria: CategoriaEvaluacion.COMPLEJIDAD,
        puntajeOriginal: 2,
        puntajeNormalizado: 50,
        justificacion: 'Evaluación de criterio individual no implementada completamente',
        recomendaciones: 'Se requiere evaluación completa de la startup',
        confianza: 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      };

      // Actualizar evaluación
      evaluacion.criteriosEvaluados.push(criterioEvaluadoCompleto);
      evaluacion.puntajeTotal = this.calcularPuntajeTotal(evaluacion.criteriosEvaluados);
      evaluacion.confianza = this.calcularConfianzaPromedio(evaluacion.criteriosEvaluados);
      evaluacion.updatedAt = new Date();

      await Repository.saveEvaluacionIA(evaluacion);

      return criterioEvaluadoCompleto;

    } catch (error) {
      console.error('Error evaluando criterio:', error);
      throw new Error('Error al evaluar el criterio');
    }
  }

  async supervisarEvaluacion(
    evaluacionId: string,
    supervisorId: string,
    ajustes: Array<{
      criterioId: string;
      puntajeAjustado: number;
      justificacion: string;
    }>,
    comentarios: string,
    decisionFinal: 'APROBADA' | 'RECHAZADA' | 'REQUIERE_REVISION'
  ): Promise<Supervision> {
    try {
      const evaluacion = await Repository.getEvaluacionIA(evaluacionId);
      if (!evaluacion) {
        throw new Error('Evaluación no encontrada');
      }

      const supervision: Supervision = {
        id: `super-${Date.now()}`,
        evaluacionId,
        supervisorId,
        ajustes: ajustes.map(ajuste => ({
          criterioId: ajuste.criterioId,
          puntajeOriginal: 0, // Se calculará
          puntajeAjustado: ajuste.puntajeAjustado,
          justificacion: ajuste.justificacion
        })),
        comentarios,
        decisionFinal,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      };

      // Actualizar evaluación con ajustes
      evaluacion.estado = EvaluacionStatus.REQUIERE_REVISION;
      evaluacion.updatedAt = new Date();

      await Repository.saveEvaluacionIA(evaluacion);
      await Repository.saveSupervision(supervision);

      return supervision;

    } catch (error) {
      console.error('Error en supervisión:', error);
      throw new Error('Error al supervisar la evaluación');
    }
  }

  private calcularPuntajeTotal(criteriosEvaluados: CriterioEvaluado[]): number {
    if (criteriosEvaluados.length === 0) return 0;
    const puntajes = criteriosEvaluados.map(c => c.puntajeNormalizado);
    return puntajes.reduce((sum, puntaje) => sum + puntaje, 0) / puntajes.length;
  }

  private calcularConfianzaPromedio(criteriosEvaluados: CriterioEvaluado[]): number {
    if (criteriosEvaluados.length === 0) return 0;
    const confianzas = criteriosEvaluados.map(c => c.confianza);
    return confianzas.reduce((sum, confianza) => sum + confianza, 0) / confianzas.length;
  }
}

export const evaluacionService = EvaluacionService.getInstance(); 