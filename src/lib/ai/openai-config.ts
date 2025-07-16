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
export const VECTOR_STORE_ID = 'vs_67e76aa00d8c8191a9b9b7a6f6cdc7fe';

// Función para generar embeddings
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
      encoding_format: 'float',
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

// Función para buscar en el vector store usando la API de Assistants
export async function searchVectorStore(query: string, topK: number = 5): Promise<string | null> {
  try {
    // Crear un assistant temporal para la búsqueda
    const assistant = await openai.beta.assistants.create({
      name: "Evaluador de Startups",
      instructions: `Eres un experto en evaluación de startups. Busca información relevante en la base de conocimiento y proporciona respuestas específicas y detalladas.`,
      model: "gpt-4o-mini",
      tools: [{"type": "retrieval"}],
      tool_resources: {
        vector_stores: [{
          id: VECTOR_STORE_ID
        }]
      }
    });

    // Crear un thread
    const thread = await openai.beta.threads.create();

    // Agregar el mensaje de consulta
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: query
    });

    // Ejecutar el assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id
    });

    // Esperar a que termine
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Obtener la respuesta
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];
    
    if (lastMessage && lastMessage.content.length > 0) {
      return lastMessage.content[0].text.value;
    }

    return null;
  } catch (error) {
    console.error('Error searching vector store:', error);
    return null;
  }
}

// Función para calcular similitud coseno
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
} 