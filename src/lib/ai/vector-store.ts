import * as fs from 'fs';
import * as path from 'path';
import { openai, generateEmbedding, KNOWLEDGE_STORE_ID, FEEDBACK_STORE_ID } from './openai.config';
import { FeedbackLevel } from './criteria';

// Tipos de entradas
export interface KnowledgeEntry {
  id: string;
  topic: string;
  content: string;
  embedding: number[];
  metadata: {
    source: string;
    chapter?: string;
    page?: number;
    createdAt: string;
  };
}

export interface FeedbackEntry {
  id: string;
  criterionId: string;
  level: FeedbackLevel;
  content: string;
  embedding: number[];
  metadata: {
    source: string;
    createdAt: string;
  };
}

// Interfaz para el almacén de vectores
interface VectorStore {
  id: string;
  name: string;
  description: string;
  entries: KnowledgeEntry[] | FeedbackEntry[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    totalEntries: number;
    source: string;
  };
}

// Clase simplificada para gestionar el almacén de vectores local
class VectorStoreManager {
  private storePath: string;
  
  constructor() {
    this.storePath = path.join(process.cwd(), 'data');
    this.ensureStorePathExists();
  }
  
  // Asegurarse de que el directorio de almacenamiento existe
  private ensureStorePathExists() {
    if (!fs.existsSync(this.storePath)) {
      fs.mkdirSync(this.storePath, { recursive: true });
    }
  }
  
  // Cargar un almacén de vectores
  loadStore(storeId: string): VectorStore | null {
    try {
      const filePath = path.join(this.storePath, `${storeId}.json`);
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      }
      
      // Si es el almacén de conocimiento, intentar cargar desde knowledge-store.json
      if (storeId === KNOWLEDGE_STORE_ID) {
        const knowledgeFilePath = path.join(this.storePath, 'knowledge-store.json');
        if (fs.existsSync(knowledgeFilePath)) {
          const data = fs.readFileSync(knowledgeFilePath, 'utf8');
          return JSON.parse(data);
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Error loading vector store ${storeId}:`, error);
      return null;
    }
  }
  
  // Guardar un almacén de vectores
  saveStore(store: VectorStore): boolean {
    try {
      const filePath = path.join(this.storePath, `${store.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(store, null, 2));
      return true;
    } catch (error) {
      console.error(`Error saving vector store ${store.id}:`, error);
      return false;
    }
  }
  
  // Buscar entradas similares en el almacén
  async findSimilar(storeId: string, query: string, topK: number = 3): Promise<any[]> {
    try {
      const store = this.loadStore(storeId);
      if (!store || !store.entries || store.entries.length === 0) {
        return [];
      }
      
      // Generar embedding para la consulta
      const queryEmbedding = await generateEmbedding(query);
      
      // Calcular similitud con cada entrada
      const entriesWithSimilarity = store.entries.map((entry: any) => {
        const similarity = this.cosineSimilarity(queryEmbedding, entry.embedding);
        return { ...entry, similarity };
      });
      
      // Ordenar por similitud descendente y tomar los top K
      return entriesWithSimilarity
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
    } catch (error) {
      console.error(`Error finding similar entries in ${storeId}:`, error);
      return [];
    }
  }
  
  // Calcular similitud del coseno entre dos vectores
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
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
  
  // Crear un nuevo almacén de vectores
  createStore(id: string, name: string, description: string): VectorStore {
    const store: VectorStore = {
      id,
      name,
      description,
      entries: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalEntries: 0,
        source: 'UPC-LevelUp'
      }
    };
    
    this.saveStore(store);
    return store;
  }
  
  // Añadir una entrada al almacén
  async addEntry(storeId: string, entry: Omit<KnowledgeEntry | FeedbackEntry, 'id' | 'embedding'>): Promise<string> {
    try {
      let store = this.loadStore(storeId);
      
      if (!store) {
        store = this.createStore(
          storeId, 
          storeId === KNOWLEDGE_STORE_ID ? 'Conocimiento sobre Startups' : 'Feedback de Evaluaciones',
          storeId === KNOWLEDGE_STORE_ID ? 'Base de conocimiento para evaluación de startups' : 'Repositorio de feedback para evaluaciones'
        );
      }
      
      // Generar embedding para el contenido
      const embedding = await generateEmbedding(entry.content);
      
      // Crear ID único
      const id = `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Añadir entrada con embedding
      const newEntry = {
        ...entry,
        id,
        embedding
      };
      
      store.entries.push(newEntry as any);
      store.metadata.totalEntries = store.entries.length;
      store.metadata.updatedAt = new Date().toISOString();
      
      this.saveStore(store);
      return id;
    } catch (error) {
      console.error(`Error adding entry to ${storeId}:`, error);
      throw new Error('Failed to add entry to vector store');
    }
  }
}

// Exportar el gestor de almacén de vectores
export const vectorStoreManager = new VectorStoreManager(); 