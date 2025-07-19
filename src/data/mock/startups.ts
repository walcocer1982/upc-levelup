export interface MockStartup {
  id: string;
  nombre: string;
  razonSocial?: string;
  ruc?: string;
  fechaFundacion: Date;
  categoria: string;
  paginaWeb?: string;
  descripcion: string;
  etapa: string;
  origen: string;
  videoPitchUrl?: string;
  founderId: string;
  estado: "activa" | "inactiva" | "pendiente";
  createdAt: Date;
  updatedAt: Date;
}

export interface MockMember {
  id: string;
  nombres: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono: string;
  linkedin?: string;
  biografia?: string;
  rol: string;
  aceptado: boolean;
  startupId: string;
}

export interface MockImpact {
  id: string;
  startupId: string;
  // Criterio 1: Nivel de complejidad
  casoReal: string;
  abordajeProblema: string;
  consecuencias: string;
  afectados: string;
  // Criterio 2: Tamaño de mercado
  tamanoMercado: string;
  potencialesClientes: string;
  interesPagar: string;
  segmentoInteres: string;
  // Criterio 3: Potencial de escalar
  estrategiaAdquisicion: string;
  costoAdquisicion: string;
  facilidadExpansion: string;
  escalabilidad: string;
  // Criterio 4: Equipo emprendedor
  trayectoria: string;
  experiencia: string;
  roles: string;
  desafios: string;
}

export interface MockMetrics {
  id: string;
  startupId: string;
  ventas: boolean;
  montoVentas?: number;
  monedaVentas?: string;
  tienePiloto: boolean;
  enlacePiloto?: string;
  lugarAplicacion?: string;
  tecnologia: string;
  tieneAreaTech: boolean;
  inversionExterna: boolean;
  montoInversion?: number;
  monedaInversion?: string;
}

export const mockStartups: MockStartup[] = [
  {
    id: 'startup-001',
    nombre: 'TechHealth Solutions',
    razonSocial: 'TechHealth Solutions SAC',
    ruc: '20123456789',
    fechaFundacion: new Date('2023-06-15'),
    categoria: 'HealthTech',
    paginaWeb: 'https://techhealth.com',
    descripcion: 'Plataforma de telemedicina que conecta pacientes con especialistas médicos en tiempo real',
    etapa: 'Crecimiento',
    origen: 'tesis',
    videoPitchUrl: 'https://youtube.com/watch?v=techhealth-pitch',
    founderId: 'fundador-001',
    estado: 'activa',
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'startup-002',
    nombre: 'EduTech Pro',
    razonSocial: 'EduTech Pro EIRL',
    ruc: '20123456790',
    fechaFundacion: new Date('2023-08-20'),
    categoria: 'Educación',
    paginaWeb: 'https://edutechpro.com',
    descripcion: 'Plataforma de aprendizaje personalizado con IA para estudiantes universitarios',
    etapa: 'MVP',
    origen: 'curso',
    founderId: 'fundador-002',
    estado: 'activa',
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'startup-003',
    nombre: 'FinFlow',
    razonSocial: 'FinFlow SAC',
    ruc: '20123456791',
    fechaFundacion: new Date('2023-10-10'),
    categoria: 'FinTech',
    paginaWeb: 'https://finflow.com',
    descripcion: 'Solución de gestión financiera para pequeñas y medianas empresas',
    etapa: 'Idea',
    origen: 'inqubalab',
    founderId: 'fundador-003',
    estado: 'pendiente',
    createdAt: new Date('2023-10-10'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: 'startup-004',
    nombre: 'EduTech Innovate',
    razonSocial: 'EduTech Innovate SAC',
    ruc: '20123456792',
    fechaFundacion: new Date('2023-12-01'),
    categoria: 'EdTech',
    paginaWeb: 'https://edutechinnovate.com',
    descripcion: 'Plataforma de aprendizaje personalizado con IA para estudiantes técnicos',
    etapa: 'MVP',
    origen: 'tesis',
    founderId: 'fundador-001',
    estado: 'activa',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-07-10'),
  },
];

export const mockMembers: MockMember[] = [
  // TechHealth Solutions - Fundador
  {
    id: 'member-001',
    nombres: 'Walther',
    apellidos: 'Alcocer',
    dni: '87654321',
    email: 'walther.alcocer@cetemin.edu.pe.com',
    telefono: '999777666',
    linkedin: 'https://linkedin.com/in/walther-alcocer-fundador',
    biografia: 'CEO y Fundador de TechHealth Solutions',
    rol: 'CEO/Fundador',
    aceptado: true,
    startupId: 'startup-001',
  },
  // TechHealth Solutions - Miembros
  {
    id: 'member-002',
    nombres: 'Ana',
    apellidos: 'López',
    dni: '33333333',
    email: 'ana.lopez@startup.com',
    telefono: '999555666',
    linkedin: 'https://linkedin.com/in/ana-lopez',
    biografia: 'Desarrolladora frontend',
    rol: 'Desarrolladora Frontend',
    aceptado: true,
    startupId: 'startup-001',
  },
  {
    id: 'member-003',
    nombres: 'Juan',
    apellidos: 'Pérez',
    dni: '44444444',
    email: 'juan.perez@startup.com',
    telefono: '999777888',
    linkedin: 'https://linkedin.com/in/juan-perez',
    biografia: 'Especialista en marketing digital',
    rol: 'Marketing Manager',
    aceptado: true,
    startupId: 'startup-001',
  },
  
  // EduTech Pro - Fundadora
  {
    id: 'member-004',
    nombres: 'María',
    apellidos: 'García',
    dni: '11111111',
    email: 'maria.garcia@startup.com',
    telefono: '999111222',
    linkedin: 'https://linkedin.com/in/maria-garcia',
    biografia: 'CEO y Fundadora de EduTech Pro',
    rol: 'CEO/Fundadora',
    aceptado: true,
    startupId: 'startup-002',
  },
  
  // FinFlow - Fundador
  {
    id: 'member-005',
    nombres: 'Carlos',
    apellidos: 'Rodríguez',
    dni: '22222222',
    email: 'carlos.rodriguez@fintech.com',
    telefono: '999333444',
    linkedin: 'https://linkedin.com/in/carlos-rodriguez',
    biografia: 'CEO y Fundador de FinFlow',
    rol: 'CEO/Fundador',
    aceptado: true,
    startupId: 'startup-003',
  },
  {
    id: 'member-006',
    nombres: 'Lucía',
    apellidos: 'Martínez',
    dni: '55555555',
    email: 'lucia.martinez@startup.com',
    telefono: '999999000',
    linkedin: 'https://linkedin.com/in/lucia-martinez',
    biografia: 'UX/UI Designer',
    rol: 'UX/UI Designer',
    aceptado: true,
    startupId: 'startup-003',
  },
  
  // EduTech Innovate - Fundador
  {
    id: 'member-007',
    nombres: 'Walther',
    apellidos: 'Alcocer',
    dni: '87654321',
    email: 'walther.alcocer@cetemin.edu.pe',
    telefono: '999777666',
    linkedin: 'https://linkedin.com/in/walther-alcocer-fundador',
    biografia: 'CEO y Fundador de EduTech Innovate con 5+ años en EdTech',
    rol: 'CEO/Fundador',
    aceptado: true,
    startupId: 'startup-004',
  },
  
  // EduTech Innovate - CTO
  {
    id: 'member-008',
    nombres: 'María',
    apellidos: 'González',
    dni: '66666666',
    email: 'maria.gonzalez@edutechinnovate.com',
    telefono: '999888777',
    linkedin: 'https://linkedin.com/in/maria-gonzalez',
    biografia: 'CTO con 8+ años en desarrollo de software educativo',
    rol: 'CTO',
    aceptado: true,
    startupId: 'startup-004',
  },
  
  // EduTech Innovate - VP Ventas
  {
    id: 'member-009',
    nombres: 'Juan',
    apellidos: 'Ramírez',
    dni: '77777777',
    email: 'juan.ramirez@edutechinnovate.com',
    telefono: '999666555',
    linkedin: 'https://linkedin.com/in/juan-ramirez',
    biografia: 'VP de Ventas con 6+ años en comercialización B2B educativa',
    rol: 'VP Ventas',
    aceptado: true,
    startupId: 'startup-004',
  },
];

export const mockImpacts: MockImpact[] = [
  {
    id: 'impact-001',
    startupId: 'startup-001',
    // Criterio 1: Nivel de complejidad
    casoReal: 'Hospital Regional de Lima Norte atiende 500 pacientes diarios con tiempos de espera de 4-6 horas para consultas especializadas. El Dr. García, cardiólogo, solo puede atender 20 pacientes por día cuando la demanda es de 50.',
    abordajeProblema: 'Los pacientes deben trasladarse físicamente al hospital, esperar horas en cola, y los médicos están limitados por ubicación física y horarios fijos.',
    consecuencias: 'Pérdida de 2-3 días laborales por paciente, costos de transporte de S/50-100, y riesgo de complicaciones por demoras en atención.',
    afectados: 'Identificamos 15,000 pacientes mensuales en Lima Norte que requieren consultas especializadas, validado con encuestas a 200 pacientes.',
    // Criterio 2: Tamaño de mercado
    tamanoMercado: 'Mercado de telemedicina en Perú: TAM $150M, SAM $45M (Lima), SOM $15M (especialidades médicas)',
    potencialesClientes: 'Conversamos con 150 pacientes y 25 médicos especialistas para validar la necesidad.',
    interesPagar: '85% de pacientes expresaron disposición a pagar S/50-80 por consulta especializada.',
    segmentoInteres: 'Pacientes de 25-55 años con seguro privado o capacidad de pago, residentes en Lima Norte.',
    // Criterio 3: Potencial de escalar
    estrategiaAdquisicion: 'Partnerships con clínicas privadas, marketing digital dirigido, y referencias de médicos existentes.',
    costoAdquisicion: 'CAC estimado: S/120 por paciente, con LTV de S/800.',
    facilidadExpansion: 'Modelo replicable a otras ciudades del Perú, con adaptación mínima de infraestructura.',
    escalabilidad: 'Plataforma permite agregar médicos sin incrementos proporcionales en costos operativos.',
    // Criterio 4: Equipo emprendedor
    trayectoria: 'Equipo trabaja junto desde hace 8 meses, conocidos en hackathon de salud digital.',
    experiencia: 'Fundador con 5 años en desarrollo de software médico, equipo con experiencia en startups de salud.',
    roles: 'CEO (gestión), CTO (desarrollo), CMO (marketing), cada uno con responsabilidades claras.',
    desafios: 'Superamos desafíos regulatorios con MINSA, validación con médicos escépticos, y desarrollo de MVP en 3 meses.',
  },
  {
    id: 'impact-002',
    startupId: 'startup-002',
    // Criterio 1: Nivel de complejidad
    casoReal: 'Estudiante de Ingeniería de la UPC, María, dedica 6 horas diarias a estudiar pero solo retiene 30% del contenido. Sus calificaciones han bajado de 16 a 12 en el último semestre.',
    abordajeProblema: 'Los estudiantes usan métodos tradicionales de estudio (repetir, subrayar) que no son efectivos para su estilo de aprendizaje individual.',
    consecuencias: 'Pérdida de tiempo de estudio, bajo rendimiento académico, y riesgo de deserción universitaria.',
    afectados: 'Identificamos 50,000 estudiantes universitarios en Lima con problemas similares, validado con encuestas a 300 estudiantes.',
    // Criterio 2: Tamaño de mercado
    tamanoMercado: 'Mercado de EdTech en Perú: TAM $80M, SAM $25M (Lima), SOM $8M (educación superior)',
    potencialesClientes: 'Conversamos con 200 estudiantes y 15 profesores para validar la necesidad.',
    interesPagar: '70% de estudiantes expresaron disposición a pagar S/30-50 mensual por plataforma personalizada.',
    segmentoInteres: 'Estudiantes universitarios de 18-25 años, con acceso a internet y dispositivos móviles.',
    // Criterio 3: Potencial de escalar
    estrategiaAdquisicion: 'Marketing en redes sociales, partnerships con universidades, y referencias de estudiantes satisfechos.',
    costoAdquisicion: 'CAC estimado: S/80 por estudiante, con LTV de S/600.',
    facilidadExpansion: 'Plataforma escalable a otras universidades y niveles educativos.',
    escalabilidad: 'IA permite personalización automática sin incrementos en costos por estudiante.',
    // Criterio 4: Equipo emprendedor
    trayectoria: 'Equipo trabaja junto desde hace 6 meses, formado en curso de emprendimiento.',
    experiencia: 'Fundadora con experiencia en pedagogía y tecnología educativa.',
    roles: 'CEO (gestión), CTO (desarrollo), CPO (producto), con roles complementarios.',
    desafios: 'Superamos desafíos de validación con estudiantes, desarrollo de algoritmos de IA, y pruebas piloto exitosas.',
  },
  {
    id: 'impact-003',
    startupId: 'startup-003',
    // Criterio 1: Nivel de complejidad
    casoReal: 'Restaurante El Sabor, con 15 empleados, pierde S/5,000 mensuales por mala gestión de inventario y flujo de caja. El dueño, Sr. López, dedica 3 horas diarias a tareas administrativas.',
    abordajeProblema: 'Los dueños de PyMEs usan Excel y métodos manuales para gestionar finanzas, sin visibilidad en tiempo real.',
    consecuencias: 'Pérdidas por inventario vencido, problemas de flujo de caja, y tiempo perdido en tareas administrativas.',
    afectados: 'Identificamos 100,000 PyMEs en Perú con problemas similares, validado con encuestas a 150 empresarios.',
    // Criterio 2: Tamaño de mercado
    tamanoMercado: 'Mercado de software para PyMEs en Perú: TAM $200M, SAM $60M, SOM $20M (gestión financiera)',
    potencialesClientes: 'Conversamos con 100 dueños de PyMEs para validar la necesidad.',
    interesPagar: '80% expresaron disposición a pagar S/100-200 mensual por solución integral.',
    segmentoInteres: 'PyMEs con 5-50 empleados, facturación mensual de S/50K-500K.',
    // Criterio 3: Potencial de escalar
    estrategiaAdquisicion: 'Ventas directas, partnerships con contadores, y marketing digital B2B.',
    costoAdquisicion: 'CAC estimado: S/500 por cliente, con LTV de S/3,000.',
    facilidadExpansion: 'Solución replicable a otros países de Latinoamérica.',
    escalabilidad: 'SaaS permite escalar sin incrementos proporcionales en costos.',
    // Criterio 4: Equipo emprendedor
    trayectoria: 'Equipo trabaja junto desde hace 4 meses, formado en programa de aceleración.',
    experiencia: 'Fundador con experiencia en finanzas corporativas y desarrollo de software.',
    roles: 'CEO (gestión), CTO (desarrollo), CFO (finanzas), con experiencia complementaria.',
    desafios: 'Superamos desafíos de validación con PyMEs, desarrollo de integraciones bancarias, y pruebas piloto exitosas.',
  },
  {
    id: 'impact-004',
    startupId: 'startup-004',
    // Criterio 1: Nivel de complejidad
    casoReal: 'Estudiantes técnicos de CETEMIN pierden 40% del tiempo en contenido irrelevante y tienen baja retención (30%) debido a metodologías genéricas. Carlos, estudiante de Mecatrónica, dedica 6 horas diarias pero solo retiene 25% del contenido específico de su carrera.',
    abordajeProblema: 'Los estudiantes usan plataformas genéricas como Coursera y Udemy que no consideran las necesidades específicas de carreras técnicas peruanas. No hay personalización por carrera ni contexto local.',
    consecuencias: 'Baja retención estudiantil (30%), empleabilidad reducida (40% no consigue trabajo en su campo), y pérdida de tiempo en contenido irrelevante.',
    afectados: 'Identificamos 50,000 estudiantes técnicos en Perú con problemas similares, validado con encuestas a 500 estudiantes de CETEMIN, SENATI y otros institutos.',
    // Criterio 2: Tamaño de mercado
    tamanoMercado: 'Mercado de EdTech en Perú: TAM $500M, SAM $50M (institutos técnicos), SOM $5M (primeros 3 años en Lima y Arequipa)',
    potencialesClientes: 'Conversamos con 500 estudiantes técnicos y 25 directores de institutos para validar la necesidad.',
    interesPagar: '85% de estudiantes expresaron disposición a pagar S/30-50 mensual por plataforma personalizada.',
    segmentoInteres: 'Estudiantes técnicos de 18-25 años en CETEMIN, SENATI y otros institutos técnicos de Lima y Arequipa.',
    // Criterio 3: Potencial de escalar
    estrategiaAdquisicion: 'Partnerships con CETEMIN y SENATI, marketing digital dirigido, y referencias de estudiantes satisfechos.',
    costoAdquisicion: 'CAC estimado: S/80 por estudiante, con LTV de S/600.',
    facilidadExpansion: 'Modelo replicable a otros institutos técnicos del Perú y Latinoamérica, con adaptación mínima de contenido.',
    escalabilidad: 'IA permite personalización automática sin incrementos en costos por estudiante. Arquitectura cloud escalable.',
    // Criterio 4: Equipo emprendedor
    trayectoria: 'Equipo trabaja junto desde hace 8 meses, formado en programa de emprendimiento de CETEMIN.',
    experiencia: 'Fundador con 5+ años en EdTech y experiencia como director en CETEMIN. CTO con 8+ años en desarrollo de software educativo.',
    roles: 'CEO (gestión + educación), CTO (desarrollo + IA), VP Ventas (comercialización + relaciones institucionales), cada uno con responsabilidades claras.',
    desafios: 'Superamos desafíos de validación con estudiantes escépticos, desarrollo de algoritmos de IA personalizada, y pruebas piloto exitosas con 2,500 estudiantes.',
  },
];

export const mockMetrics: MockMetrics[] = [
  {
    id: 'metrics-001',
    startupId: 'startup-001',
    ventas: true,
    montoVentas: 25000,
    monedaVentas: 'PEN',
    tienePiloto: true,
    enlacePiloto: 'https://techhealth-pilot.com',
    lugarAplicacion: 'Lima Norte',
    tecnologia: 'React, Node.js, PostgreSQL',
    tieneAreaTech: true,
    inversionExterna: false,
  },
  {
    id: 'metrics-002',
    startupId: 'startup-002',
    ventas: false,
    tienePiloto: true,
    enlacePiloto: 'https://edutech-pilot.com',
    lugarAplicacion: 'UPC, PUCP, USIL',
    tecnologia: 'React Native, Python, TensorFlow',
    tieneAreaTech: true,
    inversionExterna: false,
  },
  {
    id: 'metrics-003',
    startupId: 'startup-003',
    ventas: false,
    tienePiloto: false,
    tecnologia: 'Vue.js, Laravel, MySQL',
    tieneAreaTech: true,
    inversionExterna: false,
  },
  {
    id: 'metrics-004',
    startupId: 'startup-004',
    ventas: true,
    montoVentas: 15000,
    monedaVentas: 'PEN',
    tienePiloto: true,
    enlacePiloto: 'https://edutechinnovate-pilot.com',
    lugarAplicacion: 'CETEMIN, SENATI Lima',
    tecnologia: 'React, Node.js, TensorFlow, PostgreSQL',
    tieneAreaTech: true,
    inversionExterna: false,
  },
]; 