// Esquema centralizado para criterios de evaluación
export const CRITERIOS_EVALUACION = {
  // COMPLEJIDAD DEL PROBLEMA
  'criterio-001': {
    id: 'criterio-001',
    categoria: 'complejidad',
    pregunta: 'Describe un caso real del problema que resuelves',
    peso: 1,
    obligatorio: true,
    descripcion: 'Ejemplo específico de una empresa o persona que enfrenta el problema'
  },
  'criterio-002': {
    id: 'criterio-002',
    categoria: 'complejidad',
    pregunta: '¿Cómo abordas este problema?',
    peso: 1,
    obligatorio: true,
    descripcion: 'Metodología o enfoque para resolver el problema'
  },
  'criterio-003': {
    id: 'criterio-003',
    categoria: 'complejidad',
    pregunta: '¿Cuáles son las consecuencias de no resolver este problema?',
    peso: 1,
    obligatorio: true,
    descripcion: 'Impacto negativo si el problema persiste'
  },
  'criterio-004': {
    id: 'criterio-004',
    categoria: 'complejidad',
    pregunta: '¿Quiénes son los principales afectados?',
    peso: 1,
    obligatorio: true,
    descripcion: 'Grupos o personas que sufren las consecuencias'
  },

  // TAMAÑO DE MERCADO
  'criterio-005': {
    id: 'criterio-005',
    categoria: 'mercado',
    pregunta: '¿Cuál es el tamaño de tu mercado?',
    peso: 1,
    obligatorio: true,
    descripcion: 'TAM, SAM, SOM con cifras específicas'
  },
  'criterio-006': {
    id: 'criterio-006',
    categoria: 'mercado',
    pregunta: '¿Cómo validaste con clientes potenciales?',
    peso: 1,
    obligatorio: true,
    descripcion: 'Métodos de validación y número de entrevistas'
  },
  'criterio-007': {
    id: 'criterio-007',
    categoria: 'mercado',
    pregunta: '¿Hay interés en pagar por tu solución?',
    peso: 1,
    obligatorio: true,
    descripcion: 'Disposición a pagar y rangos de precio'
  },
  'criterio-008': {
    id: 'criterio-008',
    categoria: 'mercado',
    pregunta: '¿Cuál es tu segmento de interés?',
    peso: 1,
    obligatorio: true,
    descripcion: 'Características demográficas y psicográficas'
  },

  // ESCALABILIDAD
  'criterio-009': {
    id: 'criterio-009',
    categoria: 'escalabilidad',
    pregunta: '¿Cuál es tu estrategia de adquisición de clientes?',
    peso: 1,
    obligatorio: true,
    descripcion: 'Canales y métodos de captación'
  },
  'criterio-010': {
    id: 'criterio-010',
    categoria: 'escalabilidad',
    pregunta: '¿Cuál es el costo de adquisición de clientes?',
    peso: 1,
    obligatorio: true,
    descripcion: 'CAC y LTV con cifras específicas'
  },
  'criterio-011': {
    id: 'criterio-011',
    categoria: 'escalabilidad',
    pregunta: '¿Qué tan fácil es expandir tu solución?',
    peso: 1,
    obligatorio: true,
    descripcion: 'Factibilidad técnica y operativa'
  },
  'criterio-012': {
    id: 'criterio-012',
    categoria: 'escalabilidad',
    pregunta: '¿Qué estrategias has probado?',
    peso: 1,
    obligatorio: true,
    descripcion: 'Experimentos y resultados obtenidos'
  },

  // EQUIPO EMPRENDEDOR
  'criterio-013': {
    id: 'criterio-013',
    categoria: 'equipo',
    pregunta: '¿Cuál es la trayectoria del equipo?',
    peso: 1,
    obligatorio: true,
    descripcion: 'Tiempo trabajando juntos y experiencia previa'
  },
  'criterio-014': {
    id: 'criterio-014',
    categoria: 'equipo',
    pregunta: '¿Cómo están definidos los roles y responsabilidades?',
    peso: 1,
    obligatorio: true,
    descripcion: 'Estructura organizacional y distribución de tareas'
  },
  'criterio-015': {
    id: 'criterio-015',
    categoria: 'equipo',
    pregunta: '¿Cómo han superado desafíos anteriores?',
    peso: 1,
    obligatorio: true,
    descripcion: 'Ejemplos de resiliencia y capacidad de adaptación'
  },
  'criterio-016': {
    id: 'criterio-016',
    categoria: 'equipo',
    pregunta: '¿Qué experiencia relevante tiene el equipo?',
    peso: 1,
    obligatorio: true,
    descripcion: 'Conocimientos y habilidades específicas del sector'
  }
};

// Categorías centralizadas
export const CATEGORIAS = {
  complejidad: {
    id: 'complejidad',
    nombre: 'Complejidad del Problema',
    descripcion: 'Análisis del problema y su solución',
    icono: 'Target',
    color: 'orange',
    criterios: ['criterio-001', 'criterio-002', 'criterio-003', 'criterio-004']
  },
  mercado: {
    id: 'mercado',
    nombre: 'Tamaño de Mercado',
    descripcion: 'Análisis del mercado objetivo',
    icono: 'TrendingUp',
    color: 'blue',
    criterios: ['criterio-005', 'criterio-006', 'criterio-007', 'criterio-008']
  },
  escalabilidad: {
    id: 'escalabilidad',
    nombre: 'Escalabilidad',
    descripcion: 'Capacidad de crecimiento y expansión',
    icono: 'Zap',
    color: 'green',
    criterios: ['criterio-009', 'criterio-010', 'criterio-011', 'criterio-012']
  },
  equipo: {
    id: 'equipo',
    nombre: 'Equipo Emprendedor',
    descripcion: 'Capacidades y experiencia del equipo',
    icono: 'Users',
    color: 'purple',
    criterios: ['criterio-013', 'criterio-014', 'criterio-015', 'criterio-016']
  }
};

// Tipos TypeScript
export interface Criterio {
  id: string;
  categoria: string;
  pregunta: string;
  peso: number;
  obligatorio: boolean;
  descripcion: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  criterios: string[];
} 