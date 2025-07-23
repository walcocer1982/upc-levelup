export enum TipoConvocatoria {
  INQUBALAB = 'Inqubalab',
  ACELERACION = 'Aceleración',
}

export enum EstadoConvocatoria {
  BORRADOR = 'borrador',
  ABIERTA = 'abierta',
  CERRADA = 'cerrada',
  EN_EVALUACION = 'en_evaluacion',
  FINALIZADA = 'finalizada',
}

export interface MockConvocatoria {
  id: string;
  tipo: TipoConvocatoria;
  fechaInicio: Date;
  fechaFin: Date;
  estado: EstadoConvocatoria;
  creadoPorId: string;
  titulo: string;
  descripcion: string;
  criterios: MockCriterio[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MockCriterio {
  id: string;
  convocatoriaId: string;
  nombre: string;
  descripcion: string;
  peso: number; // Ponderación del criterio (0-100)
  tipo: 'complejidad' | 'mercado' | 'escalabilidad' | 'equipo';
  requerido: boolean;
  puntajeMinimo: number;
  puntajeMaximo: number;
  rubrica: {
    nivel: number;
    descripcion: string;
    puntaje: number;
  }[];
}

// Rúbricas por tipo de criterio
const rubricasPorTipo = {
  complejidad: [
    { nivel: 1, descripcion: 'Problema simple y bien definido', puntaje: 1 },
    { nivel: 2, descripcion: 'Problema moderadamente complejo', puntaje: 2 },
    { nivel: 3, descripcion: 'Problema complejo con múltiples variables', puntaje: 3 },
    { nivel: 4, descripcion: 'Problema altamente complejo e innovador', puntaje: 4 },
  ],
  mercado: [
    { nivel: 1, descripcion: 'Mercado pequeño sin validación', puntaje: 1 },
    { nivel: 2, descripcion: 'Mercado mediano con validación inicial', puntaje: 2 },
    { nivel: 3, descripcion: 'Mercado grande con validación sólida', puntaje: 3 },
    { nivel: 4, descripcion: 'Mercado masivo con validación completa', puntaje: 4 },
  ],
  escalabilidad: [
    { nivel: 1, descripcion: 'Escalabilidad limitada', puntaje: 1 },
    { nivel: 2, descripcion: 'Escalabilidad moderada', puntaje: 2 },
    { nivel: 3, descripcion: 'Alto potencial de escalabilidad', puntaje: 3 },
    { nivel: 4, descripcion: 'Escalabilidad exponencial', puntaje: 4 },
  ],
  equipo: [
    { nivel: 1, descripcion: 'Equipo básico sin experiencia', puntaje: 1 },
    { nivel: 2, descripcion: 'Equipo con experiencia moderada', puntaje: 2 },
    { nivel: 3, descripcion: 'Equipo experimentado y complementario', puntaje: 3 },
    { nivel: 4, descripcion: 'Equipo de clase mundial', puntaje: 4 },
  ],
};

// Función helper para crear criterios con rúbricas
const crearCriterio = (
  id: string,
  convocatoriaId: string,
  nombre: string,
  descripcion: string,
  peso: number,
  tipo: 'complejidad' | 'mercado' | 'escalabilidad' | 'equipo',
  requerido: boolean = true,
  puntajeMinimo: number = 1,
  puntajeMaximo: number = 4
): MockCriterio => ({
  id,
  convocatoriaId,
  nombre,
  descripcion,
  peso,
  tipo,
  requerido,
  puntajeMinimo,
  puntajeMaximo,
  rubrica: rubricasPorTipo[tipo],
});

export const mockConvocatorias: MockConvocatoria[] = [
  {
    id: 'conv-001',
    tipo: TipoConvocatoria.INQUBALAB,
    fechaInicio: new Date('2024-01-01'),
    fechaFin: new Date('2024-03-31'),
    estado: EstadoConvocatoria.FINALIZADA,
    creadoPorId: 'admin-001',
    titulo: 'Inqubalab 2024 - Primera Edición',
    descripcion: 'Programa de incubación para startups en etapa temprana con enfoque en innovación tecnológica',
    criterios: [
      crearCriterio('criterio-001', 'conv-001', 'Complejidad del Problema', 'Evaluación de qué tan complejo y significativo es el problema que resuelve', 25, 'complejidad'),
      crearCriterio('criterio-002', 'conv-001', 'Tamaño y Validación de Mercado', 'Evaluación del tamaño del mercado y validación con clientes potenciales', 25, 'mercado'),
      crearCriterio('criterio-003', 'conv-001', 'Potencial de Escalabilidad', 'Evaluación de la capacidad de la startup para crecer de manera eficiente', 25, 'escalabilidad'),
      crearCriterio('criterio-004', 'conv-001', 'Capacidades del Equipo', 'Evaluación de la experiencia y capacidades del equipo emprendedor', 25, 'equipo'),
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-31'),
  },
  {
    id: 'conv-002',
    tipo: TipoConvocatoria.ACELERACION,
    fechaInicio: new Date('2024-04-01'),
    fechaFin: new Date('2024-06-30'),
    estado: EstadoConvocatoria.EN_EVALUACION,
    creadoPorId: 'admin-001',
    titulo: 'Programa de Aceleración 2024',
    descripcion: 'Programa de aceleración para startups con MVP validado y primeros clientes',
    criterios: [
      crearCriterio('criterio-005', 'conv-002', 'Complejidad del Problema', 'Evaluación de qué tan complejo y significativo es el problema que resuelve', 20, 'complejidad'),
      crearCriterio('criterio-006', 'conv-002', 'Tamaño y Validación de Mercado', 'Evaluación del tamaño del mercado y validación con clientes potenciales', 30, 'mercado'),
      crearCriterio('criterio-007', 'conv-002', 'Potencial de Escalabilidad', 'Evaluación de la capacidad de la startup para crecer de manera eficiente', 30, 'escalabilidad'),
      crearCriterio('criterio-008', 'conv-002', 'Capacidades del Equipo', 'Evaluación de la experiencia y capacidades del equipo emprendedor', 20, 'equipo'),
    ],
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: 'conv-003',
    tipo: TipoConvocatoria.INQUBALAB,
    fechaInicio: new Date('2024-07-01'),
    fechaFin: new Date('2024-09-30'),
    estado: EstadoConvocatoria.ABIERTA,
    creadoPorId: 'admin-001',
    titulo: 'Inqubalab 2024 - Segunda Edición',
    descripcion: 'Programa de incubación para startups en etapa temprana con enfoque en innovación tecnológica',
    criterios: [
      crearCriterio('criterio-009', 'conv-003', 'Complejidad del Problema', 'Evaluación de qué tan complejo y significativo es el problema que resuelve', 25, 'complejidad'),
      crearCriterio('criterio-010', 'conv-003', 'Tamaño y Validación de Mercado', 'Evaluación del tamaño del mercado y validación con clientes potenciales', 25, 'mercado'),
      crearCriterio('criterio-011', 'conv-003', 'Potencial de Escalabilidad', 'Evaluación de la capacidad de la startup para crecer de manera eficiente', 25, 'escalabilidad'),
      crearCriterio('criterio-012', 'conv-003', 'Capacidades del Equipo', 'Evaluación de la experiencia y capacidades del equipo emprendedor', 25, 'equipo'),
    ],
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-01'),
  },
]; 