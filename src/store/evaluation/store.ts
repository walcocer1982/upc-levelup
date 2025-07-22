import { create } from 'zustand'
import { IEvaluacion } from '@/models/interfaces/IEvaluacion'
import { PostulacionRepository, EvaluacionRepository } from '@/data/mock'

interface Stats {
  total: number
  evaluacionesIA: number
  promedioPuntaje: number
  aprobadas: number
}

interface EvaluationState {
  evaluations: IEvaluacion[]
  currentEvaluation: IEvaluacion | null
  isLoading: boolean
  error: string | null
  stats: Stats
  // Acciones
  setEvaluations: (evaluations: IEvaluacion[]) => void
  setCurrentEvaluation: (evaluation: IEvaluacion | null) => void
  updateEvaluation: (evaluation: IEvaluacion) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  loadEvaluations: () => Promise<void>
  calculateStats: () => void
  saveEvaluation: (evaluation: IEvaluacion) => Promise<void>
  clearStore: () => void
}

export const useEvaluationStore = create<EvaluationState>()((set, get) => ({
  evaluations: [],
  currentEvaluation: null,
  isLoading: false,
  error: null,
  stats: {
    total: 0,
    evaluacionesIA: 0,
    promedioPuntaje: 0,
    aprobadas: 0
  },

  setEvaluations: (evaluations) => {
    set({ evaluations })
    get().calculateStats()
  },
  
  setCurrentEvaluation: (evaluation) => set({ currentEvaluation: evaluation }),
  
  updateEvaluation: (updatedEvaluation) => {
    set((state) => {
      // Asegurar que completedAt está establecido
      const evaluationWithDate = {
        ...updatedEvaluation,
        completedAt: updatedEvaluation.completedAt || new Date(),
        updatedAt: new Date()
      }

      const newEvaluations = state.evaluations.map((evaluation) =>
        evaluation.id === evaluationWithDate.id ? evaluationWithDate : evaluation
      )

      // Guardar en mock DB
      get().saveEvaluation(evaluationWithDate)

      return {
        evaluations: newEvaluations,
        currentEvaluation:
          state.currentEvaluation?.id === evaluationWithDate.id
            ? evaluationWithDate
            : state.currentEvaluation,
      }
    })
    get().calculateStats()
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  saveEvaluation: async (evaluation) => {
    try {
      // Guardar en mock DB
      const savedEvaluation = EvaluacionRepository.saveEvaluacion(evaluation)
      
      // Actualizar el store con la evaluación guardada
      const state = get()
      const newEvaluations = state.evaluations.map(e => 
        e.id === savedEvaluation.id ? {
          ...e,
          completedAt: savedEvaluation.completedAt,
          status: savedEvaluation.estado,
          updatedAt: savedEvaluation.updatedAt
        } : e
      )
      
      set({ evaluations: newEvaluations })
      get().calculateStats()
      
    } catch (error) {
      console.error('Error guardando evaluación:', error)
      throw error
    }
  },
  
  loadEvaluations: async () => {
    const state = get()
    try {
      state.setLoading(true)
      state.setError(null)

      // Obtener todas las postulaciones
      const postulaciones = PostulacionRepository.getPostulaciones()
      
      // Convertir postulaciones a evaluaciones
      const evaluaciones = postulaciones.map(postulacion => {
        // Buscar si ya existe una evaluación
        const evaluacionExistente = EvaluacionRepository.getEvaluacionesByPostulacion(postulacion.id)[0]
        
        if (evaluacionExistente) {
          return {
            id: evaluacionExistente.id,
            postulacionId: evaluacionExistente.postulacionId,
            evaluadorId: evaluacionExistente.evaluadorId,
            puntajes: [],
            totalScore: evaluacionExistente.puntajeTotal,
            score: evaluacionExistente.puntajeTotal,
            status: evaluacionExistente.estado === 'COMPLETED' ? 'completed' : 'pending',
            createdAt: evaluacionExistente.createdAt,
            updatedAt: evaluacionExistente.updatedAt,
            completedAt: evaluacionExistente.completedAt,
            startup: postulacion.startup,
            detailedAnalysis: evaluacionExistente.analisisDetallado,
            scores: evaluacionExistente.criteriosEvaluados.map(criterio => ({
              criterioId: criterio.criterioId,
              criterioName: criterio.criterioId,
              score: criterio.puntaje,
              razones: criterio.justificacion,
              mejoras: criterio.mejoras
            }))
          }
        } else {
          // Crear una nueva evaluación pendiente
          return {
            id: `eval-${postulacion.id}`,
            postulacionId: postulacion.id,
            evaluadorId: 'admin',
            puntajes: [],
            totalScore: 0,
            score: 0,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            startup: postulacion.startup
          }
        }
      })

      state.setEvaluations(evaluaciones)
    } catch (error) {
      state.setError('Error cargando evaluaciones')
      console.error('Error cargando evaluaciones:', error)
    } finally {
      state.setLoading(false)
    }
  },

  calculateStats: () => {
    const state = get()
    const evaluations = state.evaluations
    
    const stats = {
      total: evaluations.length,
      evaluacionesIA: evaluations.filter(e => e.completedAt).length,
      promedioPuntaje: evaluations.reduce((sum, e) => sum + (e.score || 0), 0) / 
        (evaluations.filter(e => e.score > 0).length || 1),
      aprobadas: evaluations.filter(e => e.score >= 70).length
    }
    
    set({ stats })
  },

  clearStore: () => set({ evaluations: [], currentEvaluation: null, error: null })
})) 