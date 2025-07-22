import { CRITERIOS_EVALUACION, CATEGORIAS } from './schema';

export class MockDataGenerator {
  // Generar postulación con nivel de completitud específico
  static generarPostulacion(
    startupId: string, 
    convocatoriaId: string, 
    nivelCompletitud: 'bajo' | 'medio' | 'alto' | 'completo',
    startupInfo: any
  ) {
    const criteriosObligatorios = Object.values(CRITERIOS_EVALUACION).filter(c => c.obligatorio);
    const numRespuestas = this.getNumRespuestas(nivelCompletitud, criteriosObligatorios.length);
    
    const respuestas = criteriosObligatorios
      .slice(0, numRespuestas)
      .map((criterio, index) => ({
        id: `resp-gen-${Date.now()}-${index}`,
        postulacionId: `post-gen-${Date.now()}`,
        criterioId: criterio.id,
        valor: this.generarRespuesta(criterio, startupInfo),
        estado: 'completada',
        updatedAt: new Date()
      }));

    return {
      id: `post-gen-${Date.now()}`,
      startupId,
      convocatoriaId,
      estado: 'borrador',
      respuestas,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private static getNumRespuestas(nivel: string, total: number): number {
    const porcentajes = {
      bajo: 0.25,      // 25% - 4 respuestas
      medio: 0.5,      // 50% - 8 respuestas
      alto: 0.75,      // 75% - 12 respuestas
      completo: 1.0    // 100% - 16 respuestas
    };
    return Math.floor(total * porcentajes[nivel as keyof typeof porcentajes]);
  }

  private static generarRespuesta(criterio: any, startupInfo: any): string {
    const templates = {
      // COMPLEJIDAD
      'criterio-001': `${startupInfo.nombre} resuelve el problema de ${startupInfo.problema}. Ejemplo: ${startupInfo.casoReal}`,
      'criterio-002': `Desarrollamos ${startupInfo.solucion} que ${startupInfo.metodologia}`,
      'criterio-003': `Las consecuencias incluyen ${startupInfo.consecuencias}`,
      'criterio-004': `Los afectados son ${startupInfo.afectados}`,
      
      // MERCADO
      'criterio-005': `TAM: $${startupInfo.tam}M, SAM: $${startupInfo.sam}M, SOM: $${startupInfo.som}M`,
      'criterio-006': `Validamos con ${startupInfo.validacion} entrevistas y ${startupInfo.metodos}`,
      'criterio-007': `${startupInfo.disposicion}% están dispuestos a pagar $${startupInfo.precio}`,
      'criterio-008': `Segmento: ${startupInfo.segmento}`,
      
      // ESCALABILIDAD
      'criterio-009': `Estrategia: ${startupInfo.estrategia} con ${startupInfo.canales}`,
      'criterio-010': `CAC: $${startupInfo.cac}, LTV: $${startupInfo.ltv}`,
      'criterio-011': `Escalabilidad: ${startupInfo.escalabilidad}`,
      'criterio-012': `Probamos: ${startupInfo.estrategias}`,
      
      // EQUIPO
      'criterio-013': `Equipo: ${startupInfo.trayectoria} con ${startupInfo.experiencia}`,
      'criterio-014': `Roles: ${startupInfo.roles}`,
      'criterio-015': `Desafíos: ${startupInfo.desafios}`,
      'criterio-016': `Experiencia: ${startupInfo.experienciaRelevante}`
    };
    
    return templates[criterio.id as keyof typeof templates] || 'Respuesta generada automáticamente';
  }

  // Generar datos de prueba para diferentes startups
  static generarDatosPrueba() {
    const startupsPrueba = [
      {
        id: 'startup-test-001',
        nombre: 'EcoTech Solutions',
        categoria: 'CleanTech',
        problema: 'contaminación ambiental en ciudades',
        casoReal: 'Lima tiene 150 días al año con aire contaminado, afectando a 2M de personas',
        solucion: 'sensores IoT para monitoreo ambiental',
        metodologia: 'reduce la contaminación en 40%',
        consecuencias: 'problemas respiratorios, costos médicos altos, pérdida de productividad',
        afectados: 'ciudadanos urbanos, empresas, gobierno',
        tam: 500,
        sam: 100,
        som: 20,
        validacion: 200,
        metodos: 'encuestas y pilotos',
        disposicion: 85,
        precio: 50,
        segmento: 'municipalidades y empresas',
        estrategia: 'ventas directas',
        canales: 'partnerships con gobiernos',
        cac: 300,
        ltv: 2000,
        escalabilidad: 'arquitectura cloud escalable',
        estrategias: 'pilotos en 3 ciudades',
        trayectoria: '2 años trabajando juntos',
        experiencia: '5 años en IoT',
        roles: 'CEO, CTO, VP Ventas',
        desafios: 'regulaciones gubernamentales',
        experienciaRelevante: 'IoT y gestión ambiental'
      },
      {
        id: 'startup-test-002',
        nombre: 'AgriTech Pro',
        categoria: 'AgTech',
        problema: 'pérdida de cultivos por clima',
        casoReal: 'Agricultores pierden 30% de sus cosechas por eventos climáticos',
        solucion: 'IA predictiva para agricultura',
        metodologia: 'predice eventos climáticos con 90% precisión',
        consecuencias: 'hambre, pérdidas económicas, migración rural',
        afectados: 'agricultores, consumidores, economía',
        tam: 300,
        sam: 60,
        som: 15,
        validacion: 150,
        metodos: 'entrevistas con agricultores',
        disposicion: 90,
        precio: 30,
        segmento: 'agricultores medianos',
        estrategia: 'freemium',
        canales: 'cooperativas agrícolas',
        cac: 200,
        ltv: 1500,
        escalabilidad: 'modelo SaaS replicable',
        estrategias: 'piloto con 100 agricultores',
        trayectoria: '1 año trabajando juntos',
        experiencia: '3 años en agricultura',
        roles: 'CEO, CTO, VP Producto',
        desafios: 'adopción de tecnología',
        experienciaRelevante: 'agricultura y machine learning'
      }
    ];

    return startupsPrueba;
  }

  // Generar postulaciones de prueba con diferentes niveles
  static generarPostulacionesPrueba() {
    const startupsPrueba = this.generarDatosPrueba();
    const postulaciones = [];

    startupsPrueba.forEach((startup, index) => {
      // Generar postulación con bajo rendimiento
      postulaciones.push(
        this.generarPostulacion(
          startup.id,
          'conv-002',
          'bajo',
          startup
        )
      );

      // Generar postulación con alto rendimiento
      postulaciones.push(
        this.generarPostulacion(
          startup.id,
          'conv-002',
          'alto',
          startup
        )
      );
    });

    return postulaciones;
  }

  // Generar estadísticas de prueba
  static generarEstadisticasPrueba() {
    const postulaciones = this.generarPostulacionesPrueba();
    
    const estadisticas = {
      total: postulaciones.length,
      porNivel: {
        bajo: 0,
        medio: 0,
        alto: 0,
        completo: 0
      },
      porCategoria: {
        CleanTech: 0,
        AgTech: 0,
        HealthTech: 0,
        EdTech: 0,
        FinTech: 0
      },
      promedioCompletitud: 0
    };

    let sumaCompletitud = 0;
    
    postulaciones.forEach(postulacion => {
      const completitud = (postulacion.respuestas.length / 16) * 100;
      sumaCompletitud += completitud;
      
      if (completitud <= 25) estadisticas.porNivel.bajo++;
      else if (completitud <= 50) estadisticas.porNivel.medio++;
      else if (completitud <= 75) estadisticas.porNivel.alto++;
      else estadisticas.porNivel.completo++;
    });

    estadisticas.promedioCompletitud = Math.round((sumaCompletitud / estadisticas.total) * 100) / 100;
    
    return estadisticas;
  }

  // Validar estructura de datos
  static validarEstructura() {
    const errores = [];
    
    // Validar criterios
    Object.values(CRITERIOS_EVALUACION).forEach(criterio => {
      if (!criterio.id || !criterio.pregunta || !criterio.categoria) {
        errores.push(`Criterio ${criterio.id} incompleto`);
      }
    });

    // Validar categorías
    Object.values(CATEGORIAS).forEach(categoria => {
      if (!categoria.id || !categoria.nombre || !categoria.criterios) {
        errores.push(`Categoría ${categoria.id} incompleta`);
      }
    });

    // Validar consistencia
    Object.values(CATEGORIAS).forEach(categoria => {
      categoria.criterios.forEach(criterioId => {
        if (!CRITERIOS_EVALUACION[criterioId as keyof typeof CRITERIOS_EVALUACION]) {
          errores.push(`Criterio ${criterioId} no existe en categoría ${categoria.id}`);
        }
      });
    });

    return {
      valido: errores.length === 0,
      errores
    };
  }
} 