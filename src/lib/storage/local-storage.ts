// Tipos para las respuestas y evaluaciones
export interface StartupResponse {
  id: string;
  startupName: string;
  createdAt: string;
  responses: {
    criterioId: string;
    nombre: string;
    respuesta: string;
  }[];
}

export interface StartupEvaluation {
  id: string;
  startupResponseId: string;
  createdAt: string;
  global: number;
  resultados: {
    nombre: string;
    criterioId: string;
    score: number;
    razones: string;
    mejoras: string;
  }[];
  observations: string[];
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

// Claves para el almacenamiento local
const RESPONSES_KEY = 'startup_responses';
const EVALUATIONS_KEY = 'startup_evaluations';

// Funciones para manejar respuestas
export function saveResponse(response: Omit<StartupResponse, 'id' | 'createdAt'>): StartupResponse {
  const responses = getResponses();
  
  const newResponse: StartupResponse = {
    ...response,
    id: `resp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  
  responses.push(newResponse);
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
  
  return newResponse;
}

export function getResponses(): StartupResponse[] {
  try {
    const data = localStorage.getItem(RESPONSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al obtener respuestas:', error);
    return [];
  }
}

export function getResponseById(id: string): StartupResponse | null {
  const responses = getResponses();
  return responses.find(r => r.id === id) || null;
}

// Funciones para manejar evaluaciones
export function saveEvaluation(evaluation: Omit<StartupEvaluation, 'id' | 'createdAt'>): StartupEvaluation {
  const evaluations = getEvaluations();
  
  const newEvaluation: StartupEvaluation = {
    ...evaluation,
    id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  
  evaluations.push(newEvaluation);
  localStorage.setItem(EVALUATIONS_KEY, JSON.stringify(evaluations));
  
  return newEvaluation;
}

export function getEvaluations(): StartupEvaluation[] {
  try {
    const data = localStorage.getItem(EVALUATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error);
    return [];
  }
}

export function getEvaluationById(id: string): StartupEvaluation | null {
  const evaluations = getEvaluations();
  return evaluations.find(e => e.id === id) || null;
}

export function getEvaluationByResponseId(responseId: string): StartupEvaluation | null {
  const evaluations = getEvaluations();
  return evaluations.find(e => e.startupResponseId === responseId) || null;
}

// Función para limpiar todos los datos
export function clearAllData(): void {
  localStorage.removeItem(RESPONSES_KEY);
  localStorage.removeItem(EVALUATIONS_KEY);
} 

export const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('evaluation-store');
    localStorage.removeItem('mock-evaluaciones');
    localStorage.removeItem('mock-postulaciones');
    console.log('✅ LocalStorage limpiado');
  }
} 