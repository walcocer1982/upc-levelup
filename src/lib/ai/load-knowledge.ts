import * as fs from 'fs';
import * as path from 'path';
import { openai, generateEmbedding, KNOWLEDGE_STORE_ID } from './openai.config';
import { vectorStoreManager } from './vector-store';

// Base de conocimiento con criterios de evaluación
const startupKnowledge = {
  // Conocimiento sobre complejidad del problema
  complejidad_problema: [
    "Un problema bien definido debe ser específico, medible y validado con usuarios reales.",
    "La validación del problema requiere entrevistas con al menos 100 clientes potenciales.",
    "El problema debe ser lo suficientemente doloroso para que los usuarios estén dispuestos a pagar por resolverlo.",
    "Un problema bien validado tiene evidencia cuantitativa y cualitativa de su existencia.",
    "El impacto del problema debe ser cuantificable en términos de costos, tiempo o recursos perdidos.",
    "La urgencia del problema determina la velocidad de adopción de la solución.",
    "Los problemas 'nice-to-have' tienen ciclos de venta más largos que los problemas críticos.",
    "La frecuencia con que ocurre el problema afecta directamente el valor percibido de la solución.",
    "Un problema bien definido tiene un público objetivo claramente identificado.",
    "La competencia existente es un indicador de que el problema es real y tiene mercado."
  ],
  
  // Conocimiento sobre tamaño de mercado
  tamano_mercado: [
    "El mercado total (TAM) debe ser lo suficientemente grande para justificar la inversión.",
    "El mercado accesible (SAM) es más importante que el mercado total para startups tempranas.",
    "Un mercado nicho con alta penetración es mejor que un mercado masivo con baja penetración.",
    "El crecimiento del mercado debe ser de al menos 20% anual para atraer inversión de riesgo.",
    "La fragmentación del mercado afecta la estrategia de entrada y la velocidad de adquisición de clientes.",
    "Los mercados B2B suelen tener tickets más altos pero ciclos de venta más largos.",
    "Los mercados B2C requieren mayor escala pero tienen ciclos de adquisición más cortos.",
    "Un análisis de mercado debe incluir tendencias, tamaño, crecimiento y segmentación.",
    "La validación del mercado requiere pruebas de disposición a pagar por parte de los clientes.",
    "Un mercado ideal tiene pocos competidores establecidos pero suficiente demanda comprobada."
  ],
  
  // Conocimiento sobre escalabilidad
  escalabilidad: [
    "Un modelo escalable permite crecer en ingresos sin aumentar proporcionalmente los costos.",
    "La escalabilidad tecnológica debe considerar la arquitectura, infraestructura y capacidad de procesamiento.",
    "La escalabilidad operativa se refiere a procesos que funcionan sin intervención manual constante.",
    "La escalabilidad financiera implica márgenes que mejoran con el volumen.",
    "Un CAC (Costo de Adquisición de Cliente) que disminuye con el tiempo es indicador de escalabilidad.",
    "El LTV (Valor de Vida del Cliente) debe ser al menos 3 veces mayor que el CAC para ser escalable.",
    "Los efectos de red aumentan el valor del producto con cada nuevo usuario.",
    "La automatización de procesos es clave para la escalabilidad operativa.",
    "La escalabilidad geográfica requiere un modelo adaptable a diferentes mercados y culturas.",
    "Un producto escalable tiene una propuesta de valor que resuena en múltiples segmentos."
  ],
  
  // Conocimiento sobre equipo emprendedor
  equipo_emprendedor: [
    "Un equipo fundador ideal combina habilidades técnicas, de negocio y de dominio específico.",
    "La experiencia previa en el sector aumenta significativamente las probabilidades de éxito.",
    "Los equipos con fundadores complementarios superan a los fundadores individuales.",
    "La capacidad de ejecución es más importante que la idea en etapas tempranas.",
    "Un equipo resiliente ha demostrado capacidad para superar obstáculos significativos.",
    "Los equipos con experiencia previa en startups tienen mayor probabilidad de éxito.",
    "La claridad en roles y responsabilidades es esencial para la eficiencia del equipo.",
    "La capacidad de atraer talento es un indicador de liderazgo efectivo.",
    "Un equipo con mentalidad de crecimiento busca constantemente retroalimentación y mejora.",
    "La alineación de valores entre fundadores previene conflictos futuros."
  ]
};

// Función para cargar el conocimiento en el almacén local
export async function loadKnowledge() {
  let totalEntries = 0;
  const documents = [];

  // Crear el directorio de datos si no existe
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Procesar cada categoría de conocimiento
  for (const [topic, contents] of Object.entries(startupKnowledge)) {
    console.log(`Procesando ${topic}...`);
    
    // Procesar cada pieza de conocimiento
    for (let i = 0; i < contents.length; i++) {
      try {
        const content = contents[i];
        
        // Añadir entrada al almacén de vectores
        await vectorStoreManager.addEntry(KNOWLEDGE_STORE_ID, {
          topic,
          content,
          metadata: {
            source: "The Art of Startup Fundraising",
            createdAt: new Date().toISOString()
          }
        });
        
        totalEntries++;
        console.log(`Añadido documento ${totalEntries}: ${content.substring(0, 50)}...`);
      } catch (error) {
        console.error(`Error procesando documento: ${error}`);
      }
    }
  }

  console.log(`Procesados exitosamente ${totalEntries} documentos para el almacén de conocimiento ${KNOWLEDGE_STORE_ID}`);
}

// Función para verificar si la base de conocimiento ya está cargada
export async function isKnowledgeLoaded(): Promise<boolean> {
  const store = vectorStoreManager.loadStore(KNOWLEDGE_STORE_ID);
  return !!store && (store.entries?.length > 0);
}

// Función para asegurar que la base de conocimiento está cargada
export async function ensureKnowledgeLoaded(): Promise<void> {
  const isLoaded = await isKnowledgeLoaded();
  
  if (!isLoaded) {
    console.log('Base de conocimiento no encontrada. Cargando...');
    await loadKnowledge();
  } else {
    console.log('Base de conocimiento ya está cargada.');
  }
} 