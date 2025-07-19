export enum EstadoPostulacion {
  BORRADOR = 'borrador',
  ENVIADA = 'enviada',
  EN_REVISION = 'en_revision',
  EVALUADA = 'evaluada',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada',
}

export interface MockPostulacion {
  id: string;
  startupId: string;
  convocatoriaId: string;
  estado: EstadoPostulacion;
  respuestas: MockRespuesta[];
  fechaEnvio?: Date;
  fechaEvaluacion?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockRespuesta {
  id: string;
  postulacionId: string;
  criterioId: string;
  valor: string;
  archivo?: string;
  estado: 'pendiente' | 'completada' | 'invalida';
  updatedAt: Date;
}

// Respuestas específicas para cada postulación (editables por convocatoria)
export const mockPostulaciones: MockPostulacion[] = [
  // TechHealth Solutions - Inqubalab 2024 (Finalizada)
  {
    id: 'post-001',
    startupId: 'startup-001',
    convocatoriaId: 'conv-001',
    estado: EstadoPostulacion.APROBADA,
    respuestas: [
      {
        id: 'resp-001',
        postulacionId: 'post-001',
        criterioId: 'criterio-001',
        valor: 'Hospital Regional de Lima Norte atiende 500 pacientes diarios con tiempos de espera de 4-6 horas para consultas especializadas. El Dr. García, cardiólogo, solo puede atender 20 pacientes por día cuando la demanda es de 50.',
        estado: 'completada',
        updatedAt: new Date('2024-02-15'),
      },
      {
        id: 'resp-002',
        postulacionId: 'post-001',
        criterioId: 'criterio-002',
        valor: 'Mercado de telemedicina en Perú: TAM $150M, SAM $45M (Lima), SOM $15M (especialidades médicas). Conversamos con 150 pacientes y 25 médicos especialistas.',
        estado: 'completada',
        updatedAt: new Date('2024-02-15'),
      },
      {
        id: 'resp-003',
        postulacionId: 'post-001',
        criterioId: 'criterio-003',
        valor: 'Partnerships con clínicas privadas, marketing digital dirigido. CAC estimado: S/120 por paciente, con LTV de S/800.',
        estado: 'completada',
        updatedAt: new Date('2024-02-15'),
      },
      {
        id: 'resp-004',
        postulacionId: 'post-001',
        criterioId: 'criterio-004',
        valor: 'Equipo trabaja junto desde hace 8 meses. Fundador con 5 años en desarrollo de software médico. CEO (gestión), CTO (desarrollo), CMO (marketing).',
        estado: 'completada',
        updatedAt: new Date('2024-02-15'),
      },
    ],
    fechaEnvio: new Date('2024-02-15'),
    fechaEvaluacion: new Date('2024-03-15'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-15'),
  },
  
  // TechHealth Solutions - Aceleración 2024 (En Evaluación) - Respuestas MEJORADAS
  {
    id: 'post-002',
    startupId: 'startup-001',
    convocatoriaId: 'conv-002',
    estado: EstadoPostulacion.EN_REVISION,
    respuestas: [
      {
        id: 'resp-005',
        postulacionId: 'post-002',
        criterioId: 'criterio-005',
        valor: 'Hospital Regional de Lima Norte atiende 500 pacientes diarios con tiempos de espera de 4-6 horas. Hemos validado con 300 pacientes adicionales y 50 médicos especialistas. El problema es más complejo de lo que inicialmente identificamos.',
        estado: 'completada',
        updatedAt: new Date('2024-05-20'),
      },
      {
        id: 'resp-006',
        postulacionId: 'post-002',
        criterioId: 'criterio-006',
        valor: 'Mercado actualizado: TAM $200M, SAM $60M, SOM $25M. Hemos validado con 500 pacientes y 75 médicos. 90% de pacientes expresan disposición a pagar S/80-120 por consulta especializada.',
        estado: 'completada',
        updatedAt: new Date('2024-05-20'),
      },
      {
        id: 'resp-007',
        postulacionId: 'post-002',
        criterioId: 'criterio-007',
        valor: 'Nueva estrategia: Integración con seguros médicos, partnerships con hospitales públicos. CAC optimizado: S/80 por paciente, LTV aumentado a S/1,200. Modelo probado en piloto con 1,000 pacientes.',
        estado: 'completada',
        updatedAt: new Date('2024-05-20'),
      },
      {
        id: 'resp-008',
        postulacionId: 'post-002',
        criterioId: 'criterio-008',
        valor: 'Equipo expandido: 8 meses trabajando juntos, agregamos CFO y CCO. Experiencia acumulada: 3 años en salud digital, 2 años en desarrollo de software médico. Roles claramente definidos y complementarios.',
        estado: 'completada',
        updatedAt: new Date('2024-05-20'),
      },
    ],
    fechaEnvio: new Date('2024-05-20'),
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-20'),
  },
  
  // EduTech Pro - Inqubalab 2024 (Finalizada)
  {
    id: 'post-003',
    startupId: 'startup-002',
    convocatoriaId: 'conv-001',
    estado: EstadoPostulacion.RECHAZADA,
    respuestas: [
      {
        id: 'resp-009',
        postulacionId: 'post-003',
        criterioId: 'criterio-001',
        valor: 'Estudiante de Ingeniería de la UPC, María, dedica 6 horas diarias a estudiar pero solo retiene 30% del contenido. Sus calificaciones han bajado de 16 a 12 en el último semestre.',
        estado: 'completada',
        updatedAt: new Date('2024-02-20'),
      },
      {
        id: 'resp-010',
        postulacionId: 'post-003',
        criterioId: 'criterio-002',
        valor: 'Mercado de EdTech en Perú: TAM $80M, SAM $25M (Lima), SOM $8M. Conversamos con 200 estudiantes y 15 profesores.',
        estado: 'completada',
        updatedAt: new Date('2024-02-20'),
      },
      {
        id: 'resp-011',
        postulacionId: 'post-003',
        criterioId: 'criterio-003',
        valor: 'Marketing en redes sociales, partnerships con universidades. CAC estimado: S/80 por estudiante, LTV de S/600.',
        estado: 'completada',
        updatedAt: new Date('2024-02-20'),
      },
      {
        id: 'resp-012',
        postulacionId: 'post-003',
        criterioId: 'criterio-004',
        valor: 'Equipo trabaja junto desde hace 6 meses. Fundadora con experiencia en pedagogía. CEO (gestión), CTO (desarrollo), CPO (producto).',
        estado: 'completada',
        updatedAt: new Date('2024-02-20'),
      },
    ],
    fechaEnvio: new Date('2024-02-20'),
    fechaEvaluacion: new Date('2024-03-20'),
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-20'),
  },
  
  // EduTech Pro - Aceleración 2024 (En Evaluación) - Respuestas MEJORADAS
  {
    id: 'post-004',
    startupId: 'startup-002',
    convocatoriaId: 'conv-002',
    estado: EstadoPostulacion.EN_REVISION,
    respuestas: [
      {
        id: 'resp-013',
        postulacionId: 'post-004',
        criterioId: 'criterio-005',
        valor: 'Problema más complejo: 70% de estudiantes universitarios tienen problemas de retención. Validamos con 500 estudiantes de 5 universidades diferentes. El problema afecta a múltiples carreras y niveles.',
        estado: 'completada',
        updatedAt: new Date('2024-05-25'),
      },
      {
        id: 'resp-014',
        postulacionId: 'post-004',
        criterioId: 'criterio-006',
        valor: 'Mercado expandido: TAM $120M, SAM $40M, SOM $15M. Validamos con 800 estudiantes y 50 profesores. 85% expresan disposición a pagar S/50-80 mensual.',
        estado: 'completada',
        updatedAt: new Date('2024-05-25'),
      },
      {
        id: 'resp-015',
        postulacionId: 'post-004',
        criterioId: 'criterio-007',
        valor: 'Nueva estrategia: Integración con LMS universitarios, gamificación avanzada. CAC optimizado: S/60 por estudiante, LTV de S/900. Piloto exitoso con 2,000 estudiantes.',
        estado: 'completada',
        updatedAt: new Date('2024-05-25'),
      },
      {
        id: 'resp-016',
        postulacionId: 'post-004',
        criterioId: 'criterio-008',
        valor: 'Equipo fortalecido: 8 meses trabajando juntos, agregamos especialista en IA y pedagoga. Experiencia: 4 años en EdTech, 3 años en desarrollo de software educativo.',
        estado: 'completada',
        updatedAt: new Date('2024-05-25'),
      },
    ],
    fechaEnvio: new Date('2024-05-25'),
    createdAt: new Date('2024-05-05'),
    updatedAt: new Date('2024-05-25'),
  },
  
  // FinFlow - Inqubalab 2024 Segunda Edición (Borrador)
  {
    id: 'post-005',
    startupId: 'startup-003',
    convocatoriaId: 'conv-003',
    estado: EstadoPostulacion.BORRADOR,
    respuestas: [
      {
        id: 'resp-017',
        postulacionId: 'post-005',
        criterioId: 'criterio-009',
        valor: 'Restaurante El Sabor, con 15 empleados, pierde S/5,000 mensuales por mala gestión de inventario y flujo de caja. El dueño, Sr. López, dedica 3 horas diarias a tareas administrativas.',
        estado: 'completada',
        updatedAt: new Date('2024-07-15'),
      },
      {
        id: 'resp-018',
        postulacionId: 'post-005',
        criterioId: 'criterio-010',
        valor: 'Mercado de software para PyMEs en Perú: TAM $200M, SAM $60M, SOM $20M. Conversamos con 100 dueños de PyMEs.',
        estado: 'completada',
        updatedAt: new Date('2024-07-15'),
      },
      {
        id: 'resp-019',
        postulacionId: 'post-005',
        criterioId: 'criterio-011',
        valor: 'Ventas directas, partnerships con contadores. CAC estimado: S/500 por cliente, LTV de S/3,000.',
        estado: 'completada',
        updatedAt: new Date('2024-07-15'),
      },
      {
        id: 'resp-020',
        postulacionId: 'post-005',
        criterioId: 'criterio-012',
        valor: 'Equipo trabaja junto desde hace 4 meses. Fundador con experiencia en finanzas corporativas. CEO (gestión), CTO (desarrollo), CFO (finanzas).',
        estado: 'completada',
        updatedAt: new Date('2024-07-15'),
      },
    ],
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-15'),
  },
  
  // EduTech Innovate - Aceleración 2024 (En Revisión) - CON LAS 16 RESPUESTAS COMPLETAS
  {
    id: 'post-006',
    startupId: 'startup-004',
    convocatoriaId: 'conv-002',
    estado: EstadoPostulacion.EN_REVISION,
    respuestas: [
      // 1. Propuesta de Valor
      {
        id: 'resp-021',
        postulacionId: 'post-006',
        criterioId: 'criterio-013',
        valor: 'EduTech Innovate ofrece una plataforma de aprendizaje personalizado con IA que adapta el contenido específicamente para estudiantes de carreras técnicas, aumentando la retención en 60% y la empleabilidad en 40%.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 2. Problema que Resuelve
      {
        id: 'resp-022',
        postulacionId: 'post-006',
        criterioId: 'criterio-014',
        valor: 'Los estudiantes técnicos pierden 40% del tiempo en contenido irrelevante y tienen baja retención (30%) debido a metodologías genéricas que no consideran sus necesidades específicas.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 3. Tamaño del Mercado
      {
        id: 'resp-023',
        postulacionId: 'post-006',
        criterioId: 'criterio-015',
        valor: 'TAM: $500M (mercado EdTech Perú), SAM: $50M (institutos técnicos), SOM: $5M (primeros 3 años en Lima y Arequipa).',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 4. Experiencia del Equipo
      {
        id: 'resp-024',
        postulacionId: 'post-006',
        criterioId: 'criterio-016',
        valor: 'Walther: 5+ años en EdTech, ex-director de CETEMIN. María: 8+ años en desarrollo de software educativo. Juan: 6+ años en ventas B2B educativas.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 5. Complementariedad del Equipo
      {
        id: 'resp-025',
        postulacionId: 'post-006',
        criterioId: 'criterio-017',
        valor: 'CEO (educación + gestión), CTO (tecnología + IA), VP Ventas (comercialización + relaciones institucionales).',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 6. Compromiso y Dedicación
      {
        id: 'resp-026',
        postulacionId: 'post-006',
        criterioId: 'criterio-018',
        valor: '100% dedicación full-time. Todos renunciaron a trabajos estables para emprender. Invertimos $50K de capital propio.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 7. Innovación Tecnológica
      {
        id: 'resp-027',
        postulacionId: 'post-006',
        criterioId: 'criterio-019',
        valor: 'IA personalizada que analiza el perfil de aprendizaje de cada estudiante técnico y adapta contenido en tiempo real según su carrera específica.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 8. Diferenciación Competitiva
      {
        id: 'resp-028',
        postulacionId: 'post-006',
        criterioId: 'criterio-020',
        valor: 'Única plataforma especializada en carreras técnicas con IA personalizada. Competidores son genéricos (Coursera, Udemy) sin enfoque técnico local.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 9. Escalabilidad de la Solución
      {
        id: 'resp-029',
        postulacionId: 'post-006',
        criterioId: 'criterio-021',
        valor: 'Arquitectura cloud que permite agregar nuevas carreras técnicas sin modificar el core. API para integración con LMS existentes.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 10. Fuentes de Ingresos
      {
        id: 'resp-030',
        postulacionId: 'post-006',
        criterioId: 'criterio-022',
        valor: 'SaaS B2B: $5/estudiante/mes para instituciones. B2C: $15/mes para estudiantes individuales. Consultoría: $200/hora para implementación.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 11. Canales de Distribución
      {
        id: 'resp-031',
        postulacionId: 'post-006',
        criterioId: 'criterio-023',
        valor: 'Ventas directas a instituciones técnicas, partnerships con CETEMIN y SENATI, marketing digital para estudiantes individuales.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 12. Validación de Mercado
      {
        id: 'resp-032',
        postulacionId: 'post-006',
        criterioId: 'criterio-024',
        valor: 'Piloto con 500 estudiantes de CETEMIN: 85% satisfacción, 60% mejora en retención. 3 instituciones interesadas en implementar.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 13. Métricas Clave
      {
        id: 'resp-033',
        postulacionId: 'post-006',
        criterioId: 'criterio-025',
        valor: '2,500 usuarios activos, $15K MRR, 85% retención mensual, 40% mejora en empleabilidad de graduados.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 14. Proyecciones Financieras
      {
        id: 'resp-034',
        postulacionId: 'post-006',
        criterioId: 'criterio-026',
        valor: 'Año 1: $200K ingresos, Año 2: $800K, Año 3: $2M. Break-even en mes 18. ROI positivo en 24 meses.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 15. Impacto Social/Ambiental
      {
        id: 'resp-035',
        postulacionId: 'post-006',
        criterioId: 'criterio-027',
        valor: 'Reduce la deserción estudiantil en 60%, mejora la empleabilidad en 40%, democratiza el acceso a educación técnica de calidad.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
      // 16. Sostenibilidad
      {
        id: 'resp-036',
        postulacionId: 'post-006',
        criterioId: 'criterio-028',
        valor: 'Modelo de negocio sostenible que permite reinvertir 30% de utilidades en desarrollo de nuevas carreras y becas para estudiantes vulnerables.',
        estado: 'completada',
        updatedAt: new Date('2024-07-10'),
      },
    ],
    fechaEnvio: new Date('2024-07-10'),
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-10'),
  },
]; 