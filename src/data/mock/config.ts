// Configuración central para toda la base de datos mock
export const MOCK_CONFIG = {
  // Configuración general
  APP_NAME: 'StartUPC Mock',
  VERSION: '1.0.0',
  
  // Configuración de datos
  DEFAULT_PAGE_SIZE: 10,
  MAX_SEARCH_RESULTS: 50,
  
  // Configuración de evaluación
  EVALUATION_CRITERIA_COUNT: 16,
  MIN_COMPLETION_PERCENTAGE: 25,
  MAX_COMPLETION_PERCENTAGE: 100,
  
  // Configuración de usuarios
  DEFAULT_USER_ROLE: 'FUNDADOR',
  ADMIN_EMAIL: 'walcocer.1982@gmail.com',
  
  // Configuración de startups
  DEFAULT_STARTUP_STATUS: 'ACTIVA',
  STARTUP_CATEGORIES: ['TECH', 'FINANCE', 'HEALTH', 'EDUCATION', 'ECOMMERCE'],
  
  // Configuración de convocatorias
  DEFAULT_CONVOCATORIA_STATUS: 'ABIERTA',
  CONVOCATORIA_TYPES: ['ACELERACION', 'INCUBACION', 'CONCURSO'],
  
  // Configuración de postulaciones
  DEFAULT_POSTULACION_STATUS: 'EN_REVISION',
  POSTULACION_STATES: ['BORRADOR', 'ENVIADA', 'EN_REVISION', 'APROBADA', 'RECHAZADA'],
  
  // Configuración de respuestas
  DEFAULT_RESPONSE_VALUE: 'No especificado',
  RESPONSE_TYPES: ['TEXT', 'NUMBER', 'BOOLEAN', 'SELECT'],
  
  // Configuración de auditoría
  AUDIT_ENABLED: true,
  AUDIT_RETENTION_DAYS: 365,
  
  // Configuración de evaluación IA
  AI_EVALUATION_ENABLED: true,
  AI_MODEL: 'gpt-4o-mini',
  AI_MAX_TOKENS: 2000,
  AI_TEMPERATURE: 0.3,
  
  // Configuración de almacenamiento
  STORAGE_TYPE: 'MEMORY', // MEMORY, LOCAL_STORAGE, INDEXED_DB
  STORAGE_PREFIX: 'startup_mock_',
  
  // Configuración de validación
  VALIDATION_ENABLED: true,
  STRICT_MODE: false,
  
  // Configuración de desarrollo
  DEBUG_MODE: true,
  LOG_LEVEL: 'INFO', // DEBUG, INFO, WARN, ERROR
  MOCK_DELAY: 100, // Simular latencia de red (ms)
};

// Tipos de configuración
export interface MockConfig {
  readonly APP_NAME: string;
  readonly VERSION: string;
  readonly DEFAULT_PAGE_SIZE: number;
  readonly MAX_SEARCH_RESULTS: number;
  readonly EVALUATION_CRITERIA_COUNT: number;
  readonly MIN_COMPLETION_PERCENTAGE: number;
  readonly MAX_COMPLETION_PERCENTAGE: number;
  readonly DEFAULT_USER_ROLE: string;
  readonly ADMIN_EMAIL: string;
  readonly DEFAULT_STARTUP_STATUS: string;
  readonly STARTUP_CATEGORIES: readonly string[];
  readonly DEFAULT_CONVOCATORIA_STATUS: string;
  readonly CONVOCATORIA_TYPES: readonly string[];
  readonly DEFAULT_POSTULACION_STATUS: string;
  readonly POSTULACION_STATES: readonly string[];
  readonly DEFAULT_RESPONSE_VALUE: string;
  readonly RESPONSE_TYPES: readonly string[];
  readonly AUDIT_ENABLED: boolean;
  readonly AUDIT_RETENTION_DAYS: number;
  readonly AI_EVALUATION_ENABLED: boolean;
  readonly AI_MODEL: string;
  readonly AI_MAX_TOKENS: number;
  readonly AI_TEMPERATURE: number;
  readonly STORAGE_TYPE: string;
  readonly STORAGE_PREFIX: string;
  readonly VALIDATION_ENABLED: boolean;
  readonly STRICT_MODE: boolean;
  readonly DEBUG_MODE: boolean;
  readonly LOG_LEVEL: string;
  readonly MOCK_DELAY: number;
}

// Función para obtener configuración
export function getMockConfig(): MockConfig {
  return MOCK_CONFIG;
}

// Función para validar configuración
export function validateMockConfig(): boolean {
  const config = getMockConfig();
  
  // Validaciones básicas
  if (config.EVALUATION_CRITERIA_COUNT <= 0) return false;
  if (config.MIN_COMPLETION_PERCENTAGE < 0 || config.MAX_COMPLETION_PERCENTAGE > 100) return false;
  if (config.MOCK_DELAY < 0) return false;
  
  return true;
}

// Función para obtener configuración de desarrollo
export function isDevelopmentMode(): boolean {
  return MOCK_CONFIG.DEBUG_MODE;
}

// Función para simular latencia de red
export async function simulateNetworkDelay(): Promise<void> {
  if (MOCK_CONFIG.MOCK_DELAY > 0) {
    await new Promise(resolve => setTimeout(resolve, MOCK_CONFIG.MOCK_DELAY));
  }
} 