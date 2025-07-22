import { useEffect } from 'react'
import { useEvaluationStore } from '@/store/evaluation/store'
import { IEvaluacion } from '@/models/interfaces/IEvaluacion'
import { toast } from 'sonner'
import { PostulacionRepository, EvaluacionRepository } from '@/data/mock'

export const useEvaluation = (evaluationId?: string) => {
  const {
    evaluations,
    currentEvaluation,
    isLoading,
    error,
    setEvaluations,
    setCurrentEvaluation,
    updateEvaluation,
    setLoading,
    setError,
  } = useEvaluationStore()

  // Cargar evaluación específica
  useEffect(() => {
    if (evaluationId) {
      loadEvaluation(evaluationId)
    }
  }, [evaluationId])

  const loadEvaluation = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Primero intentamos obtener del store
      const cached = evaluations.find(evaluation => evaluation.id === id)
      if (cached) {
        setCurrentEvaluation(cached)
        return
      }

      // Si no está en cache, cargamos del mock directamente
      const postulacion = PostulacionRepository.getPostulacionConRespuestas(id)
      if (!postulacion) {
        throw new Error('No se encontró la postulación')
      }

      const evaluacionesMock = EvaluacionRepository.getEvaluacionesByPostulacion(id)
      if (evaluacionesMock && evaluacionesMock.length > 0) {
        // Convertir de MockEvaluacion a IEvaluacion
        const evaluacion: IEvaluacion = {
          id: evaluacionesMock[0].id,
          postulacionId: evaluacionesMock[0].postulacionId,
          evaluadorId: evaluacionesMock[0].evaluadorId,
          puntajes: [],
          totalScore: evaluacionesMock[0].puntajeTotal,
          score: evaluacionesMock[0].puntajeTotal,
          status: evaluacionesMock[0].estado === 'COMPLETED' ? 'completed' : 'pending',
          createdAt: evaluacionesMock[0].createdAt,
          updatedAt: evaluacionesMock[0].updatedAt,
          completedAt: evaluacionesMock[0].completedAt,
          startup: postulacion.startup,
          detailedAnalysis: evaluacionesMock[0].analisisDetallado,
          // Nuevos campos
          strengths: evaluacionesMock[0].fortalezas,
          weaknesses: evaluacionesMock[0].debilidades,
          scores: evaluacionesMock[0].criteriosEvaluados.map(criterio => ({
            criterioId: criterio.criterioId,
            criterioName: criterio.criterioId,
            score: criterio.puntaje,
            razones: criterio.justificacion,
            mejoras: criterio.mejoras
          }))
        }
        setCurrentEvaluation(evaluacion)
        setEvaluations([...evaluations, evaluacion])
        return
      }

      // Si no hay evaluación, creamos una nueva
      const nuevaEvaluacion: IEvaluacion = {
        id: `eval-${id}`,
        postulacionId: id,
        evaluadorId: 'admin',
        puntajes: [],
        totalScore: 0,
        score: 0,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        startup: postulacion.startup,
        strengths: [],
        weaknesses: []
      }

      setCurrentEvaluation(nuevaEvaluacion)
      setEvaluations([...evaluations, nuevaEvaluacion])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast.error('Error al cargar la evaluación')
    } finally {
      setLoading(false)
    }
  }

  const evaluateStartup = async (evaluationId: string) => {
    try {
      setLoading(true)
      setError(null)

      const postulacion = PostulacionRepository.getPostulacionConRespuestas(evaluationId)
      if (!postulacion) {
        throw new Error('No se encontró la postulación')
      }

      const response = await fetch(`/api/startup/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId: evaluationId,
          startupName: postulacion.startup?.name,
          responses: postulacion.respuestas
        }),
      })

      if (!response.ok) throw new Error('Error en la evaluación')
      
      const result = await response.json()
      const evaluation = result.evaluation

      // Crear evaluación en formato IEvaluacion
      const updatedEvaluation: IEvaluacion = {
        ...currentEvaluation!,
        ...evaluation,
        completedAt: new Date(),
        status: 'completed',
        updatedAt: new Date(),
        // Asegurar que tenemos fortalezas y debilidades
        strengths: evaluation.strengths || [],
        weaknesses: evaluation.weaknesses || []
      }

      // Convertir a MockEvaluacion para guardar en el mock
      const mockEvaluation = {
        id: updatedEvaluation.id,
        postulacionId: updatedEvaluation.postulacionId,
        evaluadorId: updatedEvaluation.evaluadorId,
        criteriosEvaluados: updatedEvaluation.scores?.map(score => ({
          id: `crit-${score.criterioId}`,
          evaluacionId: updatedEvaluation.id,
          criterioId: score.criterioId,
          puntaje: score.score,
          feedback: score.mejoras,
          justificacion: score.razones,
          mejoras: score.mejoras,
          impacto: score.score >= 75 ? 'ALTO' : score.score >= 50 ? 'MEDIO' : 'BAJO'
        })) || [],
        puntajeTotal: updatedEvaluation.score,
        feedbackGeneral: updatedEvaluation.detailedAnalysis || '',
        recomendacion: updatedEvaluation.score >= 70 ? 'aprobado' : 'rechazado',
        fechaEvaluacion: updatedEvaluation.completedAt,
        completedAt: updatedEvaluation.completedAt,
        estado: 'COMPLETED',
        createdAt: updatedEvaluation.createdAt,
        updatedAt: updatedEvaluation.updatedAt,
        // Nuevos campos
        fortalezas: updatedEvaluation.strengths || [],
        debilidades: updatedEvaluation.weaknesses || [],
        analisisDetallado: updatedEvaluation.detailedAnalysis || ''
      }
      
      // Guardar en el mock
      EvaluacionRepository.saveEvaluacion(mockEvaluation)
      
      // Actualizar el store
      updateEvaluation(updatedEvaluation)
      setCurrentEvaluation(updatedEvaluation)
      
      toast.success('Evaluación completada exitosamente')
      return updatedEvaluation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la evaluación')
      toast.error('Error al realizar la evaluación')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    evaluation: currentEvaluation,
    evaluations,
    isLoading,
    error,
    evaluateStartup,
    loadEvaluation,
  }
} 