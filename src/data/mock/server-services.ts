// Servicios de IA que solo se ejecutan en el servidor
// Este archivo debe importarse solo en archivos del servidor (API routes)

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
        modelVersion: 'gpt-3.5-turbo',
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
      // Obtener evaluación existente
      const evaluacion = await Repository.getEvaluacionIAById(evaluacionId);
      if (!evaluacion) {
        throw new Error('Evaluación no encontrada');
      }

      // Convertir respuestas al formato del evaluador
      const respuestasEvaluacion = Object.entries(respuestas).map(([id, respuesta]) => ({
        id,
        pregunta: `Pregunta ${id}`,
        respuesta,
        categoria: CategoriaEvaluacion.COMPLEJIDAD, // Por defecto
        peso: 1,
        orden: parseInt(id)
      }));

      // Evaluar criterio específico
      const evaluacionCriterio = await ServerAIServices.evaluarCategoria(
        CategoriaEvaluacion.COMPLEJIDAD,
        respuestasEvaluacion
      );

      // Crear criterio evaluado
      const criterioEvaluado: CriterioEvaluado = {
        id: `crit-eval-${Date.now()}`,
        evaluacionId,
        criterioId,
        categoria: evaluacionCriterio.criteriosEvaluados[0]?.categoria || CategoriaEvaluacion.COMPLEJIDAD,
        puntajeOriginal: evaluacionCriterio.criteriosEvaluados[0]?.nivel || 2,
        puntajeNormalizado: evaluacionCriterio.criteriosEvaluados[0]?.puntuacion || 50,
        justificacion: evaluacionCriterio.criteriosEvaluados[0]?.justificacion || 'Evaluación automática',
        recomendaciones: evaluacionCriterio.criteriosEvaluados[0]?.recomendaciones || '',
        confianza: evaluacionCriterio.criteriosEvaluados[0]?.confianza || 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      };

      return criterioEvaluado;

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
      // Obtener evaluación existente
      const evaluacion = await Repository.getEvaluacionIAById(evaluacionId);
      if (!evaluacion) {
        throw new Error('Evaluación no encontrada');
      }

      // Aplicar ajustes a los criterios
      const criteriosActualizados = evaluacion.criteriosEvaluados.map(criterio => {
        const ajuste = ajustes.find(a => a.criterioId === criterio.criterioId);
        if (ajuste) {
          return {
            ...criterio,
            puntajeOriginal: ajuste.puntajeAjustado,
            puntajeNormalizado: ajuste.puntajeAjustado,
            justificacion: ajuste.justificacion,
            updatedAt: new Date()
          };
        }
        return criterio;
      });

      // Calcular nuevos puntajes
      const puntajeTotal = this.calcularPuntajeTotal(criteriosActualizados);
      const confianza = this.calcularConfianzaPromedio(criteriosActualizados);

      // Actualizar evaluación
      evaluacion.criteriosEvaluados = criteriosActualizados;
      evaluacion.puntajeTotal = puntajeTotal;
      evaluacion.confianza = confianza;
      evaluacion.updatedAt = new Date();

      // Guardar evaluación actualizada
      await Repository.saveEvaluacionIA(evaluacion);

      // Crear supervisión
      const supervision: Supervision = {
        id: `super-${Date.now()}`,
        evaluacionId,
        supervisorId,
        ajustes,
        comentarios,
        decisionFinal,
        puntajeTotal,
        confianza,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      };

      // Guardar supervisión
      await Repository.saveSupervision(supervision);

      return supervision;

    } catch (error) {
      console.error('Error supervisando evaluación:', error);
      throw new Error('Error al supervisar la evaluación');
    }
  }

  private calcularPuntajeTotal(criteriosEvaluados: CriterioEvaluado[]): number {
    if (criteriosEvaluados.length === 0) return 0;
    const suma = criteriosEvaluados.reduce((total, criterio) => total + criterio.puntajeNormalizado, 0);
    return Math.round(suma / criteriosEvaluados.length);
  }

  private calcularConfianzaPromedio(criteriosEvaluados: CriterioEvaluado[]): number {
    if (criteriosEvaluados.length === 0) return 0;
    const suma = criteriosEvaluados.reduce((total, criterio) => total + criterio.confianza, 0);
    return Math.round((suma / criteriosEvaluados.length) * 100) / 100;
  }
} 