import { startupEvaluator, RespuestaEvaluacion } from './startup-evaluator';
import { vectorStore } from './vector-store-config';
import { CategoriaEvaluacion } from '@/data/mock/types';

// Servicios de IA que solo se ejecutan en el servidor
export class ServerAIServices {
  static async evaluarStartup(respuestas: RespuestaEvaluacion[]) {
    return await startupEvaluator.evaluarStartup(respuestas);
  }

  static async buscarContextoRelevante(
    categoria: string,
    respuestas: string[]
  ): Promise<string> {
    return await vectorStore.getContextForEvaluation(categoria, respuestas);
  }

  static async evaluarCategoria(
    categoria: CategoriaEvaluacion,
    respuestas: RespuestaEvaluacion[]
  ) {
    return await startupEvaluator.evaluarStartup(respuestas);
  }
} 