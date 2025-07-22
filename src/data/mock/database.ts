import {
  Startup, StartupStatus,
  Postulacion, PostulacionStatus,
  Respuesta,
  EvaluacionIA,
  Supervision,
  CategoriaEvaluacion,
  EvaluacionStatus
} from './types';

/**
 * Base de datos mock singleton
 */
class MockDatabase {
  private static instance: MockDatabase;

  private startups: Map<string, Startup> = new Map();
  private postulaciones: Map<string, Postulacion> = new Map();
  private respuestas: Map<string, Respuesta> = new Map();
  private evaluacionesIA: Map<string, EvaluacionIA> = new Map();
  private supervisiones: Map<string, Supervision> = new Map();

  private constructor() {
    this.initializeData();
  }

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  // Métodos para Startups
  getStartup(id: string): Startup | undefined {
    return this.startups.get(id);
  }

  getAllStartups(): Startup[] {
    return Array.from(this.startups.values());
  }

  saveStartup(startup: Startup): void {
    this.startups.set(startup.id, startup);
  }

  // Métodos para Postulaciones
  getPostulacion(id: string): Postulacion | undefined {
    return this.postulaciones.get(id);
  }

  getAllPostulaciones(): Postulacion[] {
    return Array.from(this.postulaciones.values());
  }

  getPostulacionesByStartup(startupId: string): Postulacion[] {
    return Array.from(this.postulaciones.values()).filter(p => p.startupId === startupId);
  }

  savePostulacion(postulacion: Postulacion): void {
    this.postulaciones.set(postulacion.id, postulacion);
  }

  // Métodos para Respuestas
  getAllRespuestas(): Respuesta[] {
    return Array.from(this.respuestas.values());
  }

  getRespuestasByPostulacion(postulacionId: string): Respuesta[] {
    return Array.from(this.respuestas.values()).filter(r => r.postulacionId === postulacionId);
  }

  saveRespuesta(respuesta: Respuesta): void {
    this.respuestas.set(respuesta.id, respuesta);
  }

  // Métodos para Evaluaciones IA
  getEvaluacionIA(id: string): EvaluacionIA | undefined {
    return this.evaluacionesIA.get(id);
  }

  getAllEvaluacionesIA(): EvaluacionIA[] {
    return Array.from(this.evaluacionesIA.values());
  }

  getEvaluacionIAByPostulacion(postulacionId: string): EvaluacionIA | undefined {
    return Array.from(this.evaluacionesIA.values()).find(e => e.postulacionId === postulacionId);
  }

  saveEvaluacionIA(evaluacion: EvaluacionIA): void {
    this.evaluacionesIA.set(evaluacion.id, evaluacion);
  }

  // Métodos para Supervisiones
  getSupervision(id: string): Supervision | undefined {
    return this.supervisiones.get(id);
  }

  getAllSupervisiones(): Supervision[] {
    return Array.from(this.supervisiones.values());
  }

  getSupervisionByEvaluacion(evaluacionId: string): Supervision | undefined {
    return Array.from(this.supervisiones.values()).find(s => s.evaluacionId === evaluacionId);
  }

  saveSupervision(supervision: Supervision): void {
    this.supervisiones.set(supervision.id, supervision);
  }

  reset(): void {
    this.startups.clear();
    this.postulaciones.clear();
    this.respuestas.clear();
    this.evaluacionesIA.clear();
    this.supervisiones.clear();
    this.initializeData();
  }

  private initializeData(): void {
    // Datos iniciales de startups
    const startups: Startup[] = [
      {
        id: 'startup-001',
        nombre: 'TechFlow Solutions',
        descripcion: 'Plataforma de gestión de flujos de trabajo para empresas',
        categoria: 'SaaS',
        sector: 'Tecnología',
        estado: StartupStatus.ACTIVA,
        fundadores: ['Ana García', 'Carlos López'],
        miembros: ['Ana García', 'Carlos López', 'María Rodríguez'],
        website: 'https://techflow.com',
        linkedin: 'https://linkedin.com/company/techflow',
        fechaFundacion: new Date('2023-01-15'),
        ubicacion: 'Lima, Perú',
        mercadoObjetivo: 'Empresas medianas y grandes',
        modeloNegocio: 'SaaS',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-01-15'),
        version: 1
      },
      {
        id: 'startup-002',
        nombre: 'EcoTech Solutions',
        descripcion: 'Sistema de gestión de residuos inteligente para empresas',
        categoria: 'CleanTech',
        sector: 'Sostenibilidad',
        estado: StartupStatus.ACTIVA,
        fundadores: ['María Fernández', 'Carlos Silva'],
        miembros: ['María Fernández', 'Carlos Silva'],
        website: 'https://ecotech.com',
        linkedin: 'https://linkedin.com/company/ecotech',
        fechaFundacion: new Date('2023-06-20'),
        ubicacion: 'Arequipa, Perú',
        mercadoObjetivo: 'Empresas manufactureras',
        modeloNegocio: 'SaaS',
        createdAt: new Date('2023-06-20'),
        updatedAt: new Date('2023-06-20'),
        version: 1
      },
      {
        id: 'startup-003',
        nombre: 'PayFlow',
        descripcion: 'Plataforma de pagos digitales para comercios',
        categoria: 'FinTech',
        sector: 'Finanzas',
        estado: StartupStatus.ACTIVA,
        fundadores: ['Sofia Mendoza', 'Diego Torres'],
        miembros: ['Sofia Mendoza', 'Diego Torres', 'Carmen Ruiz'],
        website: 'https://payflow.com',
        linkedin: 'https://linkedin.com/company/payflow',
        fechaFundacion: new Date('2023-03-10'),
        ubicacion: 'Lima, Perú',
        mercadoObjetivo: 'Comercios pequeños y medianos',
        modeloNegocio: 'Transaction-based',
        createdAt: new Date('2023-03-10'),
        updatedAt: new Date('2023-03-10'),
        version: 1
      },
      {
        id: 'startup-004',
        nombre: 'EcoTech Solutions',
        descripcion: 'Sistema de gestión de residuos inteligente para empresas',
        categoria: 'CleanTech',
        sector: 'Sostenibilidad',
        estado: StartupStatus.ACTIVA,
        fundadores: ['María Fernández', 'Carlos Silva'],
        miembros: ['María Fernández', 'Carlos Silva'],
        website: 'https://ecotech.com',
        linkedin: 'https://linkedin.com/company/ecotech',
        fechaFundacion: new Date('2023-06-20'),
        ubicacion: 'Arequipa, Perú',
        mercadoObjetivo: 'Empresas manufactureras',
        modeloNegocio: 'SaaS',
        createdAt: new Date('2023-06-20'),
        updatedAt: new Date('2023-06-20'),
        version: 1
      },
      {
        id: 'startup-005',
        nombre: 'QuickFix App',
        descripcion: 'Aplicación para arreglar problemas domésticos simples',
        categoria: 'Consumer',
        sector: 'Servicios',
        estado: StartupStatus.ACTIVA,
        fundadores: ['Juan Pérez'],
        miembros: ['Juan Pérez'],
        website: 'https://quickfix.com',
        linkedin: 'https://linkedin.com/company/quickfix',
        fechaFundacion: new Date('2024-01-01'),
        ubicacion: 'Lima, Perú',
        mercadoObjetivo: 'Personas que necesitan arreglar cosas',
        modeloNegocio: 'Freemium',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        version: 1
      }
    ];

    // Datos iniciales de postulaciones
    const postulaciones: Postulacion[] = [
      {
        id: 'post-001',
        startupId: 'startup-001',
        convocatoriaId: 'conv-001',
        estado: PostulacionStatus.ENVIADA,
        fechaPostulacion: new Date('2024-01-10'),
        documentos: [],
        respuestas: [],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        version: 1
      },
      {
        id: 'post-002',
        startupId: 'startup-002',
        convocatoriaId: 'conv-001',
        estado: PostulacionStatus.ENVIADA,
        fechaPostulacion: new Date('2024-01-11'),
        documentos: [],
        respuestas: [],
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-11'),
        version: 1
      },
      {
        id: 'post-003',
        startupId: 'startup-003',
        convocatoriaId: 'conv-001',
        estado: PostulacionStatus.ENVIADA,
        fechaPostulacion: new Date('2024-01-12'),
        documentos: [],
        respuestas: [],
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
        version: 1
      },
      {
        id: 'post-004',
        startupId: 'startup-004',
        convocatoriaId: 'conv-001',
        estado: PostulacionStatus.ENVIADA,
        fechaPostulacion: new Date('2024-01-13'),
        documentos: [],
        respuestas: [],
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-13'),
        version: 1
      },
      {
        id: 'post-005',
        startupId: 'startup-005',
        convocatoriaId: 'conv-001',
        estado: PostulacionStatus.ENVIADA,
        fechaPostulacion: new Date('2024-01-15'),
        documentos: [],
        respuestas: [],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        version: 1
      }
    ];

    // Datos iniciales de evaluaciones IA
    const evaluacionesIA: EvaluacionIA[] = [
      {
        id: 'eval-001',
        postulacionId: 'post-001',
        estado: EvaluacionStatus.COMPLETADA,
        modelVersion: 'gpt-4-turbo',
        confianza: 0.85,
        criteriosEvaluados: [
          {
            id: 'crit-eval-001',
            evaluacionId: 'eval-001',
            criterioId: 'crit-001',
            categoria: CategoriaEvaluacion.COMPLEJIDAD,
            puntajeOriginal: 3,
            puntajeNormalizado: 75,
            justificacion: 'El problema es complejo y bien definido, con múltiples variables a considerar',
            recomendaciones: 'Profundizar en la validación con más casos de uso',
            confianza: 0.8,
            createdAt: new Date('2024-01-12'),
            updatedAt: new Date('2024-01-12'),
            version: 1
          },
          {
            id: 'crit-eval-002',
            evaluacionId: 'eval-001',
            criterioId: 'crit-002',
            categoria: 'MERCADO',
            puntajeOriginal: 4,
            puntajeNormalizado: 90,
            justificacion: 'Excelente análisis de mercado con TAM/SAM/SOM bien definidos',
            recomendaciones: 'Mantener el enfoque en la segmentación actual',
            confianza: 0.9,
            createdAt: new Date('2024-01-12'),
            updatedAt: new Date('2024-01-12'),
            version: 1
          }
        ],
        puntajeTotal: 82.5,
        analisis: {
          fortalezas: ['Mercado bien validado', 'Equipo experimentado', 'Tecnología sólida'],
          debilidades: ['Necesita más validación de usuarios', 'Competencia fuerte'],
          observaciones: ['Proyecto prometedor con buen potencial'],
          recomendaciones: ['Fortalecer la propuesta de valor', 'Expandir validación de mercado']
        },
        metadata: {
          tiempoEvaluacion: 45,
          intentos: 1,
          ultimaActualizacion: new Date('2024-01-12')
        },
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
        version: 1
      },
      {
        id: 'eval-002',
        postulacionId: 'post-002',
        estado: 'EN_PROCESO',
        modelVersion: 'gpt-4-turbo',
        confianza: 0.0,
        criteriosEvaluados: [],
        puntajeTotal: 0,
        analisis: {
          fortalezas: [],
          debilidades: [],
          observaciones: [],
          recomendaciones: []
        },
        metadata: {
          tiempoEvaluacion: 0,
          intentos: 0,
          ultimaActualizacion: new Date('2024-01-11')
        },
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-11'),
        version: 1
      },
      {
        id: 'eval-003',
        postulacionId: 'post-003',
        estado: 'COMPLETADA',
        modelVersion: 'gpt-4-turbo-preview',
        confianza: 0.888,
        criteriosEvaluados: [
          {
            id: 'crit-eval-003-COMPLEJIDAD',
            evaluacionId: 'eval-003',
            criterioId: 'crit-COMPLEJIDAD',
            categoria: 'COMPLEJIDAD',
            puntajeOriginal: 4,
            puntajeNormalizado: 100,
            justificacion: 'La startup ha demostrado un entendimiento profundo y una validación exhaustiva del problema que aborda.',
            recomendaciones: 'Para fortalecer aún más su propuesta de valor, la startup podría explorar alianzas estratégicas.',
            confianza: 0.9,
            createdAt: new Date('2024-01-13'),
            updatedAt: new Date('2024-01-13'),
            version: 1
          }
        ],
        puntajeTotal: 95.0,
        analisis: {
          fortalezas: ['Validación exhaustiva del problema', 'Caso de uso específico y cuantificado'],
          debilidades: ['Necesita más validación de la solución', 'Competencia establecida'],
          observaciones: ['Proyecto con alto potencial de impacto'],
          recomendaciones: ['Desarrollar MVP y validar con usuarios reales', 'Explorar alianzas estratégicas']
        },
        metadata: {
          tiempoEvaluacion: 120,
          intentos: 1,
          ultimaActualizacion: new Date('2024-01-13')
        },
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-13'),
        version: 1
      },
      {
        id: 'eval-004',
        postulacionId: 'post-004',
        estado: 'COMPLETADA',
        modelVersion: 'gpt-4o-mini',
        confianza: 0.92,
        criteriosEvaluados: [
          {
            id: 'crit-eval-004-COMPLEJIDAD',
            evaluacionId: 'eval-004',
            criterioId: 'crit-001',
            categoria: 'COMPLEJIDAD',
            puntajeOriginal: 4,
            puntajeNormalizado: 90,
            justificacion: 'EcoTech Solutions ha demostrado un entendimiento profundo del problema de gestión de residuos.',
            recomendaciones: 'Profundizar en la validación con más empresas del sector manufacturero.',
            confianza: 0.9,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            version: 1
          },
          {
            id: 'crit-eval-004-MERCADO',
            evaluacionId: 'eval-004',
            criterioId: 'crit-002',
            categoria: 'MERCADO',
            puntajeOriginal: 4,
            puntajeNormalizado: 95,
            justificacion: 'Excelente análisis de mercado con TAM de $2.5B en Latinoamérica.',
            recomendaciones: 'Expandir validación a otros países de la región.',
            confianza: 0.95,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            version: 1
          },
          {
            id: 'crit-eval-004-ESCALABILIDAD',
            evaluacionId: 'eval-004',
            criterioId: 'crit-003',
            categoria: 'ESCALABILIDAD',
            puntajeOriginal: 3,
            puntajeNormalizado: 75,
            justificacion: 'Modelo SaaS escalable con automatización de procesos.',
            recomendaciones: 'Desarrollar procesos automatizados y considerar alianzas.',
            confianza: 0.8,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            version: 1
          },
          {
            id: 'crit-eval-004-EQUIPO',
            evaluacionId: 'eval-004',
            criterioId: 'crit-004',
            categoria: 'EQUIPO',
            puntajeOriginal: 3,
            puntajeNormalizado: 70,
            justificacion: 'Equipo con experiencia en tecnología y sostenibilidad.',
            recomendaciones: 'Contratar un director comercial con experiencia en ventas B2B.',
            confianza: 0.75,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            version: 1
          }
        ],
        puntajeTotal: 82.5,
        analisis: {
          fortalezas: ['Mercado bien validado y en crecimiento', 'Problema claramente definido'],
          debilidades: ['Necesita validar escalabilidad operativa', 'Equipo necesita fortalecimiento'],
          observaciones: ['Proyecto prometedor con buen potencial de mercado'],
          recomendaciones: ['Desarrollar pilotos con empresas reales', 'Fortalecer equipo comercial']
        },
        metadata: {
          tiempoEvaluacion: 85,
          intentos: 1,
          ultimaActualizacion: new Date('2024-01-15')
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        version: 1
      },
      {
        id: 'eval-005',
        postulacionId: 'post-005',
        estado: 'COMPLETADA',
        modelVersion: 'gpt-4o-mini',
        confianza: 0.78,
        criteriosEvaluados: [
          {
            id: 'crit-eval-005-COMPLEJIDAD',
            evaluacionId: 'eval-005',
            criterioId: 'crit-001',
            categoria: 'COMPLEJIDAD',
            puntajeOriginal: 1,
            puntajeNormalizado: 25,
            justificacion: 'El problema está mal definido. "Arreglar cosas" es muy vago.',
            recomendaciones: 'Definir claramente qué tipo de problemas específicos resuelve la app.',
            confianza: 0.8,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            version: 1
          },
          {
            id: 'crit-eval-005-MERCADO',
            evaluacionId: 'eval-005',
            criterioId: 'crit-002',
            categoria: 'MERCADO',
            puntajeOriginal: 1,
            puntajeNormalizado: 30,
            justificacion: 'No hay análisis de mercado. No se define el tamaño del mercado.',
            recomendaciones: 'Realizar un análisis básico de mercado y entrevistar usuarios.',
            confianza: 0.7,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            version: 1
          },
          {
            id: 'crit-eval-005-ESCALABILIDAD',
            evaluacionId: 'eval-005',
            criterioId: 'crit-003',
            categoria: 'ESCALABILIDAD',
            puntajeOriginal: 1,
            puntajeNormalizado: 20,
            justificacion: 'No hay estrategia de crecimiento clara.',
            recomendaciones: 'Desarrollar una estrategia de crecimiento específica.',
            confianza: 0.6,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            version: 1
          },
          {
            id: 'crit-eval-005-EQUIPO',
            evaluacionId: 'eval-005',
            criterioId: 'crit-004',
            categoria: 'EQUIPO',
            puntajeOriginal: 1,
            puntajeNormalizado: 25,
            justificacion: 'Equipo de una sola persona sin experiencia en el sector.',
            recomendaciones: 'Formar un equipo más completo o buscar cofundadores.',
            confianza: 0.7,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            version: 1
          }
        ],
        puntajeTotal: 25.0,
        analisis: {
          fortalezas: ['Idea inicial de app móvil'],
          debilidades: ['Problema mal definido', 'Sin validación de mercado'],
          observaciones: ['Proyecto en etapa muy temprana que requiere mucho trabajo'],
          recomendaciones: ['Definir claramente el problema a resolver', 'Validar con usuarios reales']
        },
        metadata: {
          tiempoEvaluacion: 45,
          intentos: 1,
          ultimaActualizacion: new Date('2024-01-15')
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        version: 1
      }
    ];

    // Datos iniciales de respuestas
    const respuestas: Respuesta[] = [
      {
        id: 'resp-001-001',
        postulacionId: 'post-001',
        pregunta: '¿Cuál es el problema principal que resuelve su startup?',
        respuesta: 'Las empresas medianas y grandes tienen dificultades para gestionar eficientemente sus flujos de trabajo internos, lo que resulta en retrasos, errores y pérdida de productividad.',
        categoria: CategoriaEvaluacion.COMPLEJIDAD,
        peso: 1,
        orden: 1,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        version: 1
      },
      {
        id: 'resp-001-002',
        postulacionId: 'post-001',
        pregunta: '¿Cómo ha validado este problema?',
        respuesta: 'Hemos entrevistado a 50 empresas objetivo y realizado un estudio de mercado que muestra que el 78% de las empresas medianas reportan problemas de gestión de flujos de trabajo.',
        categoria: CategoriaEvaluacion.COMPLEJIDAD,
        peso: 1,
        orden: 2,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        version: 1
      },
      {
        id: 'resp-001-003',
        postulacionId: 'post-001',
        pregunta: '¿Cuál es el tamaño de su mercado objetivo?',
        respuesta: 'TAM: $15B, SAM: $2.1B, SOM: $210M. Nos enfocamos en empresas de 100-1000 empleados en Latinoamérica.',
        categoria: CategoriaEvaluacion.MERCADO,
        peso: 1,
        orden: 3,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        version: 1
      },
      {
        id: 'resp-001-004',
        postulacionId: 'post-001',
        pregunta: '¿Cómo adquieren clientes?',
        respuesta: 'Combinamos marketing digital, ventas directas y alianzas con consultoras. Nuestro CAC es $500 y esperamos reducirlo a $300 en 6 meses.',
        categoria: CategoriaEvaluacion.ESCALABILIDAD,
        peso: 1,
        orden: 4,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        version: 1
      },
      {
        id: 'resp-001-005',
        postulacionId: 'post-001',
        pregunta: '¿Cuál es la experiencia del equipo?',
        respuesta: 'Ana tiene 8 años en desarrollo de software, Carlos tiene 6 años en ventas B2B, y María tiene experiencia en UX/UI. Trabajamos juntos desde hace 2 años.',
        categoria: CategoriaEvaluacion.EQUIPO,
        peso: 1,
        orden: 5,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        version: 1
      }
    ];

    // Guardar datos en la base de datos
    startups.forEach(startup => this.saveStartup(startup));
    postulaciones.forEach(postulacion => this.savePostulacion(postulacion));
    evaluacionesIA.forEach(evaluacion => this.saveEvaluacionIA(evaluacion));
    respuestas.forEach(respuesta => this.saveRespuesta(respuesta));
  }
}

// Exportar una instancia única
export const mockDb = MockDatabase.getInstance();
