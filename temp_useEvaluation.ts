import { useEffect } from 'react'
import { useEvaluationStore } from './temp_evaluation_store'
import { IEvaluacion } from '@/models/interfaces/IEvaluacion'
import { toast } from 'sonner'

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
      const cached = evaluations.find(eval => eval.id === id)
      if (cached) {
        setCurrentEvaluation(cached)
        return
      }

      // Si no está en cache, cargamos del mock
      const response = await fetch(`/api/evaluaciones/${id}`)
      if (!response.ok) throw new Error('Error al cargar la evaluación')
      
      const data = await response.json()
      setCurrentEvaluation(data)
      
      // Actualizamos la lista
      setEvaluations([...evaluations, data])
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

      const response = await fetch(`/api/startup/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evaluationId }),
      })

      if (!response.ok) throw new Error('Error en la evaluación')
      
      const updatedEvaluation = await response.json()
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