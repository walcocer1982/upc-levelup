// Definición de tipos para los niveles de feedback
export type FeedbackLevel = 'inicio' | 'en_proceso' | 'logrado' | 'destacado';

// Interfaz para criterios de evaluación
export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  levels: {
    [key in FeedbackLevel]: {
      description: string;
      score: number;
    }
  };
}

// Definir la rúbrica para cada criterio
export const RUBRICA = {
  complejidad_problema: {
    1: "No evidencia validación real ni datos de impacto.",
    2: "Conoce el problema pero con validación muy preliminar.",
    3: "Muestra datos cuantitativos iniciales y casos reales.",
    4: "Presenta evidencia sólida y métricas del impacto."
  },
  tamano_mercado: {
    1: "No dimensiona el mercado o lo hace sin respaldo.",
    2: "Estimaciones generales sin datos específicos.",
    3: "Análisis de mercado con segmentación y fuentes.",
    4: "Validación completa con TAM, SAM y SOM respaldados."
  },
  escalabilidad: {
    1: "No muestra cómo crecerá sin aumentar costos proporcionalmente.",
    2: "Ideas de escalabilidad pero sin plan concreto.",
    3: "Modelo con potencial de escala y primeras validaciones.",
    4: "Modelo probado con economías de escala y efectos de red."
  },
  equipo_emprendedor: {
    1: "Equipo incompleto o sin experiencia relevante.",
    2: "Equipo con algunas habilidades pero brechas críticas.",
    3: "Equipo complementario con experiencia en el sector.",
    4: "Equipo excepcional con logros previos y red de contactos."
  }
};

// Criterios detallados de evaluación
export const EVALUATION_CRITERIA = [
  {
    id: 'complejidad',
    nombre: 'Complejidad del Problema',
    descripcion: 'Evaluación de qué tan complejo y significativo es el problema que resuelve',
    excelencia: 'El problema es altamente complejo, afecta a múltiples stakeholders, tiene consecuencias económicas significativas, y no existe una solución efectiva en el mercado. Se presenta evidencia concreta de casos reales, datos cuantitativos de impacto, y una comprensión profunda de las causas raíz del problema.',
    peso: 0.25
  },
  {
    id: 'mercado',
    nombre: 'Tamaño y Validación de Mercado',
    descripcion: 'Evaluación del tamaño del mercado y validación con clientes potenciales',
    excelencia: 'El mercado objetivo está claramente definido con datos cuantitativos (TAM, SAM, SOM), se ha validado con más de 100 clientes potenciales, existe evidencia de disposición a pagar, y se ha identificado un segmento específico con mayor interés. Los datos de validación son recientes y representativos.',
    peso: 0.25
  },
  {
    id: 'escalabilidad',
    nombre: 'Potencial de Escalabilidad',
    descripcion: 'Evaluación de la capacidad de la startup para crecer de manera eficiente',
    excelencia: 'La estrategia de adquisición de clientes es clara, escalable y costo-efectiva. Los costos marginales disminuyen con el crecimiento. Se han probado estrategias de escalabilidad con resultados medibles. El modelo de negocio permite crecimiento exponencial sin incrementos proporcionales en costos operativos.',
    peso: 0.25
  },
  {
    id: 'equipo',
    nombre: 'Capacidades del Equipo',
    descripcion: 'Evaluación de la experiencia y capacidades del equipo emprendedor',
    excelencia: 'El equipo tiene experiencia relevante en el sector, roles claramente definidos, historial de trabajo conjunto exitoso, y ha demostrado capacidad para superar desafíos complejos. Existe complementariedad de habilidades y compromiso a largo plazo con el proyecto.',
    peso: 0.25
  }
];

// Mapear nombre de criterio a su clave en la rúbrica
export function mapNombreToKey(nombre: string): keyof typeof RUBRICA {
  const mapping: Record<string, keyof typeof RUBRICA> = {
    'Nivel de complejidad de la problemática': 'complejidad_problema',
    'Tamaño de mercado': 'tamano_mercado',
    'Potencial de escalar': 'escalabilidad',
    'Equipo emprendedor': 'equipo_emprendedor',
  };
  
  return mapping[nombre] || 'complejidad_problema';
} 