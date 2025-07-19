export interface MockEvaluacion {
  id: string;
  postulacionId: string;
  evaluadorId: string;
  criteriosEvaluados: MockCriterioEvaluado[];
  puntajeTotal: number;
  feedbackGeneral: string;
  recomendacion: 'aprobado' | 'rechazado' | 'pendiente';
  fechaEvaluacion: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockCriterioEvaluado {
  id: string;
  evaluacionId: string;
  criterioId: string;
  puntaje: number; // 1-4
  feedback: string;
  justificacion: string;
}

export interface MockRubrica {
  id: string;
  criterioId: string;
  nivel: number; // 1-4
  descripcion: string;
  puntaje: number;
}

// Rubricas para cada criterio
export const mockRubricas: MockRubrica[] = [
  // Complejidad del Problema
  {
    id: 'rubrica-001',
    criterioId: 'criterio-001',
    nivel: 1,
    descripcion: 'No evidencia validación real ni datos de impacto.',
    puntaje: 1,
  },
  {
    id: 'rubrica-002',
    criterioId: 'criterio-001',
    nivel: 2,
    descripcion: 'Conoce el problema pero con validación muy preliminar.',
    puntaje: 2,
  },
  {
    id: 'rubrica-003',
    criterioId: 'criterio-001',
    nivel: 3,
    descripcion: 'Muestra datos cuantitativos iniciales y casos reales.',
    puntaje: 3,
  },
  {
    id: 'rubrica-004',
    criterioId: 'criterio-001',
    nivel: 4,
    descripcion: 'Presenta evidencia sólida y métricas del impacto.',
    puntaje: 4,
  },
  
  // Tamaño de Mercado
  {
    id: 'rubrica-005',
    criterioId: 'criterio-002',
    nivel: 1,
    descripcion: 'No dimensiona el mercado o lo hace sin respaldo.',
    puntaje: 1,
  },
  {
    id: 'rubrica-006',
    criterioId: 'criterio-002',
    nivel: 2,
    descripcion: 'Estimaciones generales sin datos específicos.',
    puntaje: 2,
  },
  {
    id: 'rubrica-007',
    criterioId: 'criterio-002',
    nivel: 3,
    descripcion: 'Análisis de mercado con segmentación y fuentes.',
    puntaje: 3,
  },
  {
    id: 'rubrica-008',
    criterioId: 'criterio-002',
    nivel: 4,
    descripcion: 'Validación completa con TAM, SAM y SOM respaldados.',
    puntaje: 4,
  },
  
  // Escalabilidad
  {
    id: 'rubrica-009',
    criterioId: 'criterio-003',
    nivel: 1,
    descripcion: 'No muestra cómo crecerá sin aumentar costos proporcionalmente.',
    puntaje: 1,
  },
  {
    id: 'rubrica-010',
    criterioId: 'criterio-003',
    nivel: 2,
    descripcion: 'Ideas de escalabilidad pero sin plan concreto.',
    puntaje: 2,
  },
  {
    id: 'rubrica-011',
    criterioId: 'criterio-003',
    nivel: 3,
    descripcion: 'Modelo con potencial de escala y primeras validaciones.',
    puntaje: 3,
  },
  {
    id: 'rubrica-012',
    criterioId: 'criterio-003',
    nivel: 4,
    descripcion: 'Modelo probado con economías de escala y efectos de red.',
    puntaje: 4,
  },
  
  // Equipo Emprendedor
  {
    id: 'rubrica-013',
    criterioId: 'criterio-004',
    nivel: 1,
    descripcion: 'Equipo incompleto o sin experiencia relevante.',
    puntaje: 1,
  },
  {
    id: 'rubrica-014',
    criterioId: 'criterio-004',
    nivel: 2,
    descripcion: 'Equipo con algunas habilidades pero brechas críticas.',
    puntaje: 2,
  },
  {
    id: 'rubrica-015',
    criterioId: 'criterio-004',
    nivel: 3,
    descripcion: 'Equipo complementario con experiencia en el sector.',
    puntaje: 3,
  },
  {
    id: 'rubrica-016',
    criterioId: 'criterio-004',
    nivel: 4,
    descripcion: 'Equipo excepcional con logros previos y red de contactos.',
    puntaje: 4,
  },
];

// Evaluaciones con múltiples evaluadores
export const mockEvaluaciones: MockEvaluacion[] = [
  // TechHealth Solutions - Inqubalab 2024 (Evaluación 1)
  {
    id: 'eval-001',
    postulacionId: 'post-001',
    evaluadorId: 'admin-001',
    criteriosEvaluados: [
      {
        id: 'criterio-eval-001',
        evaluacionId: 'eval-001',
        criterioId: 'criterio-001',
        puntaje: 4,
        feedback: 'Excelente validación del problema con casos reales y datos cuantitativos.',
        justificacion: 'Presenta evidencia sólida de 15,000 pacientes afectados y validación con 200 pacientes.',
      },
      {
        id: 'criterio-eval-002',
        evaluacionId: 'eval-001',
        criterioId: 'criterio-002',
        puntaje: 3,
        feedback: 'Buena validación de mercado con segmentación clara.',
        justificacion: 'TAM, SAM, SOM bien definidos y validación con 150 pacientes.',
      },
      {
        id: 'criterio-eval-003',
        evaluacionId: 'eval-001',
        criterioId: 'criterio-003',
        puntaje: 3,
        feedback: 'Estrategia de escalabilidad clara con métricas definidas.',
        justificacion: 'CAC y LTV bien calculados, estrategia de partnerships definida.',
      },
      {
        id: 'criterio-eval-004',
        evaluacionId: 'eval-001',
        criterioId: 'criterio-004',
        puntaje: 4,
        feedback: 'Equipo excepcional con experiencia relevante y roles claros.',
        justificacion: 'Fundador con 5 años en desarrollo médico, equipo complementario.',
      },
    ],
    puntajeTotal: 3.5,
    feedbackGeneral: 'Startup sólida con excelente validación del problema y equipo fuerte. Recomendado para aprobación.',
    recomendacion: 'aprobado',
    fechaEvaluacion: new Date('2024-03-15'),
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  
  // TechHealth Solutions - Aceleración 2024 (Evaluación 1)
  {
    id: 'eval-002',
    postulacionId: 'post-002',
    evaluadorId: 'admin-001',
    criteriosEvaluados: [
      {
        id: 'criterio-eval-005',
        evaluacionId: 'eval-002',
        criterioId: 'criterio-005',
        puntaje: 4,
        feedback: 'Validación excepcional con 300 pacientes adicionales y comprensión profunda del problema.',
        justificacion: 'Demuestra evolución significativa desde la primera postulación.',
      },
      {
        id: 'criterio-eval-006',
        evaluacionId: 'eval-002',
        criterioId: 'criterio-006',
        puntaje: 4,
        feedback: 'Mercado expandido y validación robusta con 500 pacientes.',
        justificacion: 'TAM actualizado a $200M, 90% disposición a pagar.',
      },
      {
        id: 'criterio-eval-007',
        evaluacionId: 'eval-002',
        criterioId: 'criterio-007',
        puntaje: 4,
        feedback: 'Estrategia de escalabilidad probada con piloto exitoso.',
        justificacion: 'CAC optimizado, LTV aumentado, modelo probado con 1,000 pacientes.',
      },
      {
        id: 'criterio-eval-008',
        evaluacionId: 'eval-002',
        criterioId: 'criterio-008',
        puntaje: 4,
        feedback: 'Equipo fortalecido con roles complementarios y experiencia acumulada.',
        justificacion: 'Equipo expandido, experiencia acumulada, roles claros.',
      },
    ],
    puntajeTotal: 4.0,
    feedbackGeneral: 'Evolución excepcional desde la primera postulación. Startup lista para aceleración.',
    recomendacion: 'aprobado',
    fechaEvaluacion: new Date('2024-06-20'),
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-20'),
  },
  
  // EduTech Pro - Inqubalab 2024 (Evaluación 1)
  {
    id: 'eval-003',
    postulacionId: 'post-003',
    evaluadorId: 'admin-001',
    criteriosEvaluados: [
      {
        id: 'criterio-eval-009',
        evaluacionId: 'eval-003',
        criterioId: 'criterio-001',
        puntaje: 2,
        feedback: 'Problema identificado pero validación preliminar.',
        justificacion: 'Caso real presentado pero falta evidencia cuantitativa del impacto.',
      },
      {
        id: 'criterio-eval-010',
        evaluacionId: 'eval-003',
        criterioId: 'criterio-002',
        puntaje: 2,
        feedback: 'Estimaciones de mercado básicas sin validación profunda.',
        justificacion: 'TAM, SAM, SOM definidos pero validación limitada con clientes.',
      },
      {
        id: 'criterio-eval-011',
        evaluacionId: 'eval-003',
        criterioId: 'criterio-003',
        puntaje: 2,
        feedback: 'Estrategia de escalabilidad básica sin validación.',
        justificacion: 'CAC y LTV estimados pero sin pruebas reales.',
      },
      {
        id: 'criterio-eval-012',
        evaluacionId: 'eval-003',
        criterioId: 'criterio-004',
        puntaje: 3,
        feedback: 'Equipo con experiencia relevante pero brechas en roles.',
        justificacion: 'Fundadora con experiencia en pedagogía, equipo complementario.',
      },
    ],
    puntajeTotal: 2.25,
    feedbackGeneral: 'Startup con potencial pero necesita mayor validación y desarrollo de estrategia.',
    recomendacion: 'rechazado',
    fechaEvaluacion: new Date('2024-03-20'),
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
  },
  
  // EduTech Pro - Aceleración 2024 (Evaluación 1)
  {
    id: 'eval-004',
    postulacionId: 'post-004',
    evaluadorId: 'admin-001',
    criteriosEvaluados: [
      {
        id: 'criterio-eval-013',
        evaluacionId: 'eval-004',
        criterioId: 'criterio-005',
        puntaje: 4,
        feedback: 'Validación excepcional con 500 estudiantes de 5 universidades.',
        justificacion: 'Problema más complejo identificado, validación robusta.',
      },
      {
        id: 'criterio-eval-014',
        evaluacionId: 'eval-004',
        criterioId: 'criterio-006',
        puntaje: 4,
        feedback: 'Mercado expandido y validación completa.',
        justificacion: 'TAM actualizado, 800 estudiantes validados, 85% disposición a pagar.',
      },
      {
        id: 'criterio-eval-015',
        evaluacionId: 'eval-004',
        criterioId: 'criterio-007',
        puntaje: 4,
        feedback: 'Estrategia de escalabilidad probada con piloto exitoso.',
        justificacion: 'Integración con LMS, CAC optimizado, piloto con 2,000 estudiantes.',
      },
      {
        id: 'criterio-eval-016',
        evaluacionId: 'eval-004',
        criterioId: 'criterio-008',
        puntaje: 4,
        feedback: 'Equipo fortalecido con especialistas en IA y pedagogía.',
        justificacion: 'Equipo expandido, experiencia acumulada, roles complementarios.',
      },
    ],
    puntajeTotal: 4.0,
    feedbackGeneral: 'Evolución excepcional desde la primera postulación. Startup lista para aceleración.',
    recomendacion: 'aprobado',
    fechaEvaluacion: new Date('2024-06-25'),
    createdAt: new Date('2024-06-25'),
    updatedAt: new Date('2024-06-25'),
  },
  
  // EduTech Innovate - Aceleración 2024 (Evaluación Pendiente)
  {
    id: 'eval-005',
    postulacionId: 'post-006',
    evaluadorId: 'admin-001',
    criteriosEvaluados: [
      {
        id: 'criterio-eval-017',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-013',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-018',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-014',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-019',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-015',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-020',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-016',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-021',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-017',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-022',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-018',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-023',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-019',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-024',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-020',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-025',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-021',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-026',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-022',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-027',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-023',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-028',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-024',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-029',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-025',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-030',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-026',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-031',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-027',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
      {
        id: 'criterio-eval-032',
        evaluacionId: 'eval-005',
        criterioId: 'criterio-028',
        puntaje: 0, // Pendiente de evaluación
        feedback: '',
        justificacion: '',
      },
    ],
    puntajeTotal: 0, // Pendiente de evaluación
    feedbackGeneral: '',
    recomendacion: 'pendiente',
    fechaEvaluacion: new Date('2024-07-10'), // Pendiente de evaluación
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-10'),
  },
]; 