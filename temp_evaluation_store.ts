import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IEvaluacion } from '@/models/interfaces/IEvaluacion'

interface EvaluationState {
  evaluations: IEvaluacion[]
  currentEvaluation: IEvaluacion | null
  isLoading: boolean
  error: string | null
  // Acciones
  setEvaluations: (evaluations: IEvaluacion[]) => void
  setCurrentEvaluation: (evaluation: IEvaluacion | null) => void
  updateEvaluation: (evaluation: IEvaluacion) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useEvaluationStore = create<EvaluationState>()(
  persist(
    (set) => ({
      evaluations: [],
      currentEvaluation: null,
      isLoading: false,
      error: null,

      setEvaluations: (evaluations) => set({ evaluations }),
      setCurrentEvaluation: (evaluation) => set({ currentEvaluation: evaluation }),
      updateEvaluation: (updatedEvaluation) =>
        set((state) => ({
          evaluations: state.evaluations.map((eval) =>
            eval.id === updatedEvaluation.id ? updatedEvaluation : eval
          ),
          currentEvaluation:
            state.currentEvaluation?.id === updatedEvaluation.id
              ? updatedEvaluation
              : state.currentEvaluation,
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'evaluation-storage',
    }
  )
) 