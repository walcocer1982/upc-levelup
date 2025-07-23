import { serverOpenAI } from './server-only';

// Configuración de OpenAI para embeddings (solo servidor)
const openai = serverOpenAI;

// Contenido del libro "The Art of Startup Fundraising" chunked por categorías
export const STARTUP_FUNDRAISING_KNOWLEDGE = {
  complejidad_problema: [
    {
      id: 'comp-1',
      content: 'La complejidad del problema que resuelve una startup es fundamental para determinar su potencial de inversión. Los inversores buscan problemas que sean lo suficientemente complejos como para requerir soluciones innovadoras, pero no tan complejos que sean imposibles de resolver.',
      category: 'complejidad_problema',
      relevance: 0.9
    },
    {
      id: 'comp-2',
      content: 'Los problemas más atractivos para los inversores son aquellos que afectan a un gran número de personas o empresas, tienen un impacto significativo en la vida cotidiana o en los procesos de negocio, y requieren una solución tecnológica innovadora.',
      category: 'complejidad_problema',
      relevance: 0.85
    },
    {
      id: 'comp-3',
      content: 'La validación del problema es crucial. Una startup debe demostrar que el problema existe, que las personas están dispuestas a pagar por una solución, y que la solución propuesta es viable técnicamente y comercialmente.',
      category: 'complejidad_problema',
      relevance: 0.8
    }
  ],
  tamano_mercado: [
    {
      id: 'merc-1',
      content: 'El tamaño del mercado es uno de los factores más importantes que evalúan los inversores. Un mercado total direccionable (TAM) grande es esencial para justificar la inversión y el potencial de retorno.',
      category: 'tamano_mercado',
      relevance: 0.95
    },
    {
      id: 'merc-2',
      content: 'Los inversores buscan mercados que estén creciendo rápidamente, preferiblemente con tasas de crecimiento anual del 20% o más. Esto indica que hay demanda creciente y oportunidades de expansión.',
      category: 'tamano_mercado',
      relevance: 0.9
    },
    {
      id: 'merc-3',
      content: 'La validación de mercado es fundamental. Las startups deben demostrar que han validado su propuesta de valor con clientes reales, preferiblemente con ventas iniciales o acuerdos de intención de compra.',
      category: 'tamano_mercado',
      relevance: 0.85
    },
    {
      id: 'merc-4',
      content: 'Los inversores evalúan la capacidad de la startup para penetrar el mercado y capturar una porción significativa del mercado direccionable. Esto incluye la estrategia de go-to-market y la propuesta de valor única.',
      category: 'tamano_mercado',
      relevance: 0.8
    }
  ],
  escalabilidad: [
    {
      id: 'esc-1',
      content: 'La escalabilidad es clave para el éxito de una startup. Los inversores buscan modelos de negocio que puedan crecer rápidamente sin un aumento proporcional en los costos operativos.',
      category: 'escalabilidad',
      relevance: 0.9
    },
    {
      id: 'esc-2',
      content: 'Los modelos de negocio más escalables incluyen software-as-a-service (SaaS), plataformas de marketplace, y productos digitales que pueden ser distribuidos globalmente sin costos marginales significativos.',
      category: 'escalabilidad',
      relevance: 0.85
    },
    {
      id: 'esc-3',
      content: 'La tecnología debe permitir la automatización y eficiencia operativa. Los inversores evalúan la capacidad de la startup para manejar el crecimiento sin comprometer la calidad del producto o servicio.',
      category: 'escalabilidad',
      relevance: 0.8
    },
    {
      id: 'esc-4',
      content: 'La expansión geográfica y de productos debe ser viable. Los inversores buscan startups que puedan expandirse a nuevos mercados y desarrollar productos adicionales basados en su tecnología central.',
      category: 'escalabilidad',
      relevance: 0.75
    }
  ],
  equipo_emprendedor: [
    {
      id: 'equi-1',
      content: 'El equipo es el factor más importante para los inversores. Un equipo fuerte con experiencia relevante, habilidades complementarias y un historial de ejecución exitosa es esencial.',
      category: 'equipo_emprendedor',
      relevance: 0.95
    },
    {
      id: 'equi-2',
      content: 'Los fundadores deben tener experiencia en el dominio del problema que están resolviendo. Esto incluye experiencia técnica, de mercado, o de la industria específica.',
      category: 'equipo_emprendedor',
      relevance: 0.9
    },
    {
      id: 'equi-3',
      content: 'La capacidad de ejecución es crítica. Los inversores evalúan la capacidad del equipo para cumplir con los hitos, adaptarse a los cambios del mercado, y ejecutar la estrategia de negocio.',
      category: 'equipo_emprendedor',
      relevance: 0.85
    },
    {
      id: 'equi-4',
      content: 'La red de contactos y relaciones del equipo es valiosa. Los inversores consideran la capacidad del equipo para atraer talento, clientes, socios estratégicos y futuras rondas de financiamiento.',
      category: 'equipo_emprendedor',
      relevance: 0.8
    }
  ]
};

export interface KnowledgeChunk {
  id: string;
  content: string;
  category: string;
  relevance: number;
  embedding?: number[];
}

export class VectorStore {
  private static instance: VectorStore;
  private knowledgeBase: Record<string, KnowledgeChunk[]>;
  private embeddings: Map<string, number[]> = new Map();

  private constructor() {
    this.knowledgeBase = STARTUP_FUNDRAISING_KNOWLEDGE;
  }

  static getInstance(): VectorStore {
    if (!VectorStore.instance) {
      VectorStore.instance = new VectorStore();
    }
    return VectorStore.instance;
  }

  async searchRelevantContent(
    query: string,
    category: string,
    limit: number = 3
  ): Promise<KnowledgeChunk[]> {
    try {
      // Generar embedding de la consulta
      const queryEmbedding = await this.generateEmbedding(query);
      
      // Obtener chunks relevantes de la categoría
      const categoryChunks = this.knowledgeBase[category] || [];
      
      // Calcular similitud y ordenar
      const chunksWithSimilarity = await Promise.all(
        categoryChunks.map(async (chunk) => {
          const chunkEmbedding = await this.getChunkEmbedding(chunk);
          const similarity = this.calculateCosineSimilarity(queryEmbedding, chunkEmbedding);
          return {
            ...chunk,
            similarity
          };
        })
      );

      // Ordenar por similitud y retornar los más relevantes
      return chunksWithSimilarity
        .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
        .slice(0, limit)
        .map(({ similarity, ...chunk }) => chunk);

    } catch (error) {
      console.error('Error en búsqueda de contenido relevante:', error);
      // Retornar chunks por defecto de la categoría
      return (this.knowledgeBase[category] || []).slice(0, limit);
    }
  }

  async getContextForEvaluation(
    categoria: string,
    respuestas: string[]
  ): Promise<string> {
    try {
      const query = respuestas.join(' ');
      const relevantChunks = await this.searchRelevantContent(query, categoria, 2);
      
      return relevantChunks
        .map(chunk => chunk.content)
        .join('\n\n');

    } catch (error) {
      console.error('Error obteniendo contexto para evaluación:', error);
      return '';
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generando embedding:', error);
      // Retornar embedding por defecto
      return new Array(1536).fill(0);
    }
  }

  private async getChunkEmbedding(chunk: KnowledgeChunk): Promise<number[]> {
    if (chunk.embedding) {
      return chunk.embedding;
    }

    if (this.embeddings.has(chunk.id)) {
      return this.embeddings.get(chunk.id)!;
    }

    const embedding = await this.generateEmbedding(chunk.content);
    this.embeddings.set(chunk.id, embedding);
    return embedding;
  }

  private calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
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
}

export const vectorStore = VectorStore.getInstance(); 