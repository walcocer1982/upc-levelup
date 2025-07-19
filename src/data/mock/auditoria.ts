export interface MockAuditoria {
  id: string;
  postulacionId: string;
  respuestaId: string;
  usuarioId: string;
  accion: 'crear' | 'editar' | 'eliminar';
  valorAnterior?: string;
  valorNuevo?: string;
  campo: string;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
}

export interface MockVersion {
  id: string;
  postulacionId: string;
  version: number;
  respuestas: MockRespuestaVersion[];
  creadoPor: string;
  timestamp: Date;
  comentario?: string;
}

export interface MockRespuestaVersion {
  id: string;
  versionId: string;
  criterioId: string;
  valor: string;
  timestamp: Date;
}

// Historial de cambios en respuestas
export const mockAuditoria: MockAuditoria[] = [
  // TechHealth Solutions - Cambios en postulación 1
  {
    id: 'audit-001',
    postulacionId: 'post-001',
    respuestaId: 'resp-001',
    usuarioId: 'fundador-001',
    accion: 'crear',
    valorNuevo: 'Hospital Regional de Lima Norte atiende 500 pacientes diarios con tiempos de espera de 4-6 horas para consultas especializadas. El Dr. García, cardiólogo, solo puede atender 20 pacientes por día cuando la demanda es de 50.',
    campo: 'casoReal',
    timestamp: new Date('2024-02-01T10:30:00'),
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    id: 'audit-002',
    postulacionId: 'post-001',
    respuestaId: 'resp-001',
    usuarioId: 'fundador-001',
    accion: 'editar',
    valorAnterior: 'Hospital Regional de Lima Norte atiende 500 pacientes diarios con tiempos de espera de 4-6 horas para consultas especializadas. El Dr. García, cardiólogo, solo puede atender 20 pacientes por día cuando la demanda es de 50.',
    valorNuevo: 'Hospital Regional de Lima Norte atiende 500 pacientes diarios con tiempos de espera de 4-6 horas para consultas especializadas. El Dr. García, cardiólogo, solo puede atender 20 pacientes por día cuando la demanda es de 50. Hemos validado este caso con 50 pacientes adicionales.',
    campo: 'casoReal',
    timestamp: new Date('2024-02-10T14:20:00'),
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  
  // TechHealth Solutions - Cambios en postulación 2 (respuestas mejoradas)
  {
    id: 'audit-003',
    postulacionId: 'post-002',
    respuestaId: 'resp-005',
    usuarioId: 'fundador-001',
    accion: 'crear',
    valorNuevo: 'Hospital Regional de Lima Norte atiende 500 pacientes diarios con tiempos de espera de 4-6 horas. Hemos validado con 300 pacientes adicionales y 50 médicos especialistas. El problema es más complejo de lo que inicialmente identificamos.',
    campo: 'casoReal',
    timestamp: new Date('2024-05-01T09:15:00'),
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    id: 'audit-004',
    postulacionId: 'post-002',
    respuestaId: 'resp-006',
    usuarioId: 'fundador-001',
    accion: 'editar',
    valorAnterior: 'Mercado de telemedicina en Perú: TAM $150M, SAM $45M (Lima), SOM $15M (especialidades médicas). Conversamos con 150 pacientes y 25 médicos especialistas.',
    valorNuevo: 'Mercado actualizado: TAM $200M, SAM $60M, SOM $25M. Hemos validado con 500 pacientes y 75 médicos. 90% de pacientes expresan disposición a pagar S/80-120 por consulta especializada.',
    campo: 'tamanoMercado',
    timestamp: new Date('2024-05-15T16:45:00'),
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  
  // EduTech Pro - Cambios en postulación 3
  {
    id: 'audit-005',
    postulacionId: 'post-003',
    respuestaId: 'resp-009',
    usuarioId: 'fundador-002',
    accion: 'crear',
    valorNuevo: 'Estudiante de Ingeniería de la UPC, María, dedica 6 horas diarias a estudiar pero solo retiene 30% del contenido. Sus calificaciones han bajado de 16 a 12 en el último semestre.',
    campo: 'casoReal',
    timestamp: new Date('2024-02-10T11:00:00'),
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
  
  // EduTech Pro - Cambios en postulación 4 (respuestas mejoradas)
  {
    id: 'audit-006',
    postulacionId: 'post-004',
    respuestaId: 'resp-013',
    usuarioId: 'fundador-002',
    accion: 'crear',
    valorNuevo: 'Problema más complejo: 70% de estudiantes universitarios tienen problemas de retención. Validamos con 500 estudiantes de 5 universidades diferentes. El problema afecta a múltiples carreras y niveles.',
    campo: 'casoReal',
    timestamp: new Date('2024-05-05T13:30:00'),
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
  {
    id: 'audit-007',
    postulacionId: 'post-004',
    respuestaId: 'resp-014',
    usuarioId: 'fundador-002',
    accion: 'editar',
    valorAnterior: 'Mercado de EdTech en Perú: TAM $80M, SAM $25M (Lima), SOM $8M. Conversamos con 200 estudiantes y 15 profesores.',
    valorNuevo: 'Mercado expandido: TAM $120M, SAM $40M, SOM $15M. Validamos con 800 estudiantes y 50 profesores. 85% expresan disposición a pagar S/50-80 mensual.',
    campo: 'tamanoMercado',
    timestamp: new Date('2024-05-20T10:15:00'),
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
  
  // FinFlow - Cambios en postulación 5 (borrador)
  {
    id: 'audit-008',
    postulacionId: 'post-005',
    respuestaId: 'resp-017',
    usuarioId: 'fundador-003',
    accion: 'crear',
    valorNuevo: 'Restaurante El Sabor, con 15 empleados, pierde S/5,000 mensuales por mala gestión de inventario y flujo de caja. El dueño, Sr. López, dedica 3 horas diarias a tareas administrativas.',
    campo: 'casoReal',
    timestamp: new Date('2024-07-10T15:20:00'),
    ip: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
  },
  {
    id: 'audit-009',
    postulacionId: 'post-005',
    respuestaId: 'resp-017',
    usuarioId: 'fundador-003',
    accion: 'editar',
    valorAnterior: 'Restaurante El Sabor, con 15 empleados, pierde S/5,000 mensuales por mala gestión de inventario y flujo de caja. El dueño, Sr. López, dedica 3 horas diarias a tareas administrativas.',
    valorNuevo: 'Restaurante El Sabor, con 15 empleados, pierde S/5,000 mensuales por mala gestión de inventario y flujo de caja. El dueño, Sr. López, dedica 3 horas diarias a tareas administrativas. Hemos validado este caso con 20 restaurantes similares.',
    campo: 'casoReal',
    timestamp: new Date('2024-07-15T12:45:00'),
    ip: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
  },
];

// Versiones de postulaciones
export const mockVersiones: MockVersion[] = [
  // TechHealth Solutions - Versión 1 (Inqubalab)
  {
    id: 'version-001',
    postulacionId: 'post-001',
    version: 1,
    respuestas: [
      {
        id: 'resp-version-001',
        versionId: 'version-001',
        criterioId: 'criterio-001',
        valor: 'Hospital Regional de Lima Norte atiende 500 pacientes diarios con tiempos de espera de 4-6 horas para consultas especializadas. El Dr. García, cardiólogo, solo puede atender 20 pacientes por día cuando la demanda es de 50.',
        timestamp: new Date('2024-02-01T10:30:00'),
      },
      {
        id: 'resp-version-002',
        versionId: 'version-001',
        criterioId: 'criterio-002',
        valor: 'Mercado de telemedicina en Perú: TAM $150M, SAM $45M (Lima), SOM $15M (especialidades médicas). Conversamos con 150 pacientes y 25 médicos especialistas.',
        timestamp: new Date('2024-02-01T10:30:00'),
      },
    ],
    creadoPor: 'fundador-001',
    timestamp: new Date('2024-02-01T10:30:00'),
    comentario: 'Primera versión de la postulación',
  },
  
  // TechHealth Solutions - Versión 2 (Inqubalab) - Mejorada
  {
    id: 'version-002',
    postulacionId: 'post-001',
    version: 2,
    respuestas: [
      {
        id: 'resp-version-003',
        versionId: 'version-002',
        criterioId: 'criterio-001',
        valor: 'Hospital Regional de Lima Norte atiende 500 pacientes diarios con tiempos de espera de 4-6 horas para consultas especializadas. El Dr. García, cardiólogo, solo puede atender 20 pacientes por día cuando la demanda es de 50. Hemos validado este caso con 50 pacientes adicionales.',
        timestamp: new Date('2024-02-10T14:20:00'),
      },
      {
        id: 'resp-version-004',
        versionId: 'version-002',
        criterioId: 'criterio-002',
        valor: 'Mercado de telemedicina en Perú: TAM $150M, SAM $45M (Lima), SOM $15M (especialidades médicas). Conversamos con 150 pacientes y 25 médicos especialistas.',
        timestamp: new Date('2024-02-10T14:20:00'),
      },
    ],
    creadoPor: 'fundador-001',
    timestamp: new Date('2024-02-10T14:20:00'),
    comentario: 'Mejorada validación del caso real',
  },
  
  // TechHealth Solutions - Versión 1 (Aceleración) - Respuestas completamente nuevas
  {
    id: 'version-003',
    postulacionId: 'post-002',
    version: 1,
    respuestas: [
      {
        id: 'resp-version-005',
        versionId: 'version-003',
        criterioId: 'criterio-005',
        valor: 'Hospital Regional de Lima Norte atiende 500 pacientes diarios con tiempos de espera de 4-6 horas. Hemos validado con 300 pacientes adicionales y 50 médicos especialistas. El problema es más complejo de lo que inicialmente identificamos.',
        timestamp: new Date('2024-05-01T09:15:00'),
      },
      {
        id: 'resp-version-006',
        versionId: 'version-003',
        criterioId: 'criterio-006',
        valor: 'Mercado actualizado: TAM $200M, SAM $60M, SOM $25M. Hemos validado con 500 pacientes y 75 médicos. 90% de pacientes expresan disposición a pagar S/80-120 por consulta especializada.',
        timestamp: new Date('2024-05-15T16:45:00'),
      },
    ],
    creadoPor: 'fundador-001',
    timestamp: new Date('2024-05-01T09:15:00'),
    comentario: 'Nueva postulación con respuestas mejoradas basadas en aprendizaje de la primera convocatoria',
  },
  
  // EduTech Pro - Versión 1 (Inqubalab)
  {
    id: 'version-004',
    postulacionId: 'post-003',
    version: 1,
    respuestas: [
      {
        id: 'resp-version-007',
        versionId: 'version-004',
        criterioId: 'criterio-001',
        valor: 'Estudiante de Ingeniería de la UPC, María, dedica 6 horas diarias a estudiar pero solo retiene 30% del contenido. Sus calificaciones han bajado de 16 a 12 en el último semestre.',
        timestamp: new Date('2024-02-10T11:00:00'),
      },
    ],
    creadoPor: 'fundador-002',
    timestamp: new Date('2024-02-10T11:00:00'),
    comentario: 'Primera versión de la postulación',
  },
  
  // EduTech Pro - Versión 1 (Aceleración) - Respuestas completamente nuevas
  {
    id: 'version-005',
    postulacionId: 'post-004',
    version: 1,
    respuestas: [
      {
        id: 'resp-version-008',
        versionId: 'version-005',
        criterioId: 'criterio-005',
        valor: 'Problema más complejo: 70% de estudiantes universitarios tienen problemas de retención. Validamos con 500 estudiantes de 5 universidades diferentes. El problema afecta a múltiples carreras y niveles.',
        timestamp: new Date('2024-05-05T13:30:00'),
      },
      {
        id: 'resp-version-009',
        versionId: 'version-005',
        criterioId: 'criterio-006',
        valor: 'Mercado expandido: TAM $120M, SAM $40M, SOM $15M. Validamos con 800 estudiantes y 50 profesores. 85% expresan disposición a pagar S/50-80 mensual.',
        timestamp: new Date('2024-05-20T10:15:00'),
      },
    ],
    creadoPor: 'fundador-002',
    timestamp: new Date('2024-05-05T13:30:00'),
    comentario: 'Nueva postulación con respuestas mejoradas basadas en feedback de la primera convocatoria',
  },
]; 