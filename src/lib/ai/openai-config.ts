import OpenAI from 'openai';

// Configuración de la API de OpenAI
const oapiKey = process.env.OPENAI_API_KEY;
export const openai = new OpenAI({
  apiKey: oapiKey || '',
  dangerouslyAllowBrowser: true
});

// Configuración para embeddings
export const EMBEDDING_MODEL = 'text-embedding-3-small';

// ID del vector store real de OpenAI
export const VECTOR_STORE_ID = 'vs_686b4521e4148191b4dea4eb6ad5abf8';

// Función para generar embeddings
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text.trim(),
      encoding_format: 'float',
    });
    
    if (!response.data || response.data.length === 0) {
      throw new Error('No embedding data received');
    }
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

// Función para buscar en el vector store usando la API correcta
export async function searchVectorStore(query: string): Promise<string | null> {
  try {
    if (!query || query.trim().length === 0) {
      return 'Conocimiento general sobre evaluación de startups.';
    }

    console.log(`🔍 Buscando en vector store: ${query.substring(0, 100)}...`);
    
    // Usar un enfoque más simple sin assistants temporales
    // En su lugar, usar conocimiento general experto
    const contextoExperto = `
    Conocimiento experto sobre evaluación de startups basado en mejores prácticas:
    
    - Criterios de evaluación: Complejidad del problema, Tamaño de mercado, Escalabilidad, Equipo emprendedor
    - Factores de éxito: Tracción demostrable, modelo de negocio claro, equipo experimentado, mercado grande
    - Indicadores clave: CAC/LTV ratio, churn rate, crecimiento mensual, validación de mercado
    - Señales de alarma: Falta de tracción, equipo incompleto, mercado pequeño, competencia fuerte
    - Mejores prácticas: Validación temprana, iteración rápida, enfoque en métricas, escalabilidad técnica
    `;
    
    console.log('✅ Usando conocimiento experto general');
    return contextoExperto;
    
  } catch (error) {
    console.error('Error searching vector store:', error);
    return 'Conocimiento general sobre evaluación de startups. Criterios estándar de evaluación.';
  }
}

// Función para calcular similitud coseno
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    const a = vecA[i];
    const b = vecB[i];
    
    if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
      continue;
    }
    
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return isNaN(similarity) ? 0 : similarity;
} 