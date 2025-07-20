import { getMockData } from '@/data/mock';
import { FormResponses } from '@/lib/ai/local-storage';

// Mapeo de criterios mock a las 16 respuestas del sistema original
const criterioMapping = {
  'criterio-001': {
    categoria: 'complejidad',
    campo: 'casoReal'
  },
  'criterio-002': {
    categoria: 'mercado', 
    campo: 'tamanoMercado'
  },
  'criterio-003': {
    categoria: 'escalabilidad',
    campo: 'estrategiaAdquisicion'
  },
  'criterio-004': {
    categoria: 'equipo',
    campo: 'trayectoriaEquipo'
  },
  // Mapeo para post-006 (EduTech Innovate)
  'criterio-013': {
    categoria: 'complejidad',
    campo: 'casoReal'
  },
  'criterio-014': {
    categoria: 'complejidad',
    campo: 'abordajePrevio'
  },
  'criterio-015': {
    categoria: 'mercado',
    campo: 'tamanoMercado'
  },
  'criterio-016': {
    categoria: 'equipo',
    campo: 'trayectoriaEquipo'
  },
  'criterio-017': {
    categoria: 'equipo',
    campo: 'rolesResponsabilidades'
  },
  'criterio-018': {
    categoria: 'equipo',
    campo: 'superacionDesafios'
  },
  'criterio-019': {
    categoria: 'escalabilidad',
    campo: 'estrategiaAdquisicion'
  },
  'criterio-020': {
    categoria: 'escalabilidad',
    campo: 'estrategiasProbadas'
  },
  'criterio-021': {
    categoria: 'escalabilidad',
    campo: 'facilidadExpansion'
  },
  'criterio-022': {
    categoria: 'mercado',
    campo: 'interesPago'
  },
  'criterio-023': {
    categoria: 'mercado',
    campo: 'segmentoInteres'
  },
  'criterio-024': {
    categoria: 'mercado',
    campo: 'validacionClientes'
  },
  'criterio-025': {
    categoria: 'escalabilidad',
    campo: 'costoAdquisicion'
  }
};

// Función para convertir una postulación mock al formato FormResponses
export function convertPostulacionToFormResponses(postulacionId: string): FormResponses | null {
  try {
    console.log('🔍 Buscando postulación:', postulacionId);
    
    // Obtener la postulación
    const postulacion = getMockData.getPostulacionById(postulacionId);
    if (!postulacion) {
      console.error('❌ Postulación no encontrada:', postulacionId);
      console.log('📋 Postulaciones disponibles:', getMockData.getAllPostulaciones().map(p => p.id));
      return null;
    }
    
    console.log('✅ Postulación encontrada:', postulacion.id, 'Startup ID:', postulacion.startupId);

    // Obtener la startup
    console.log('🔍 Buscando startup:', postulacion.startupId);
    const startup = getMockData.getStartupById(postulacion.startupId);
    if (!startup) {
      console.error('❌ Startup no encontrada para postulación:', postulacionId);
      console.log('📋 Startups disponibles:', getMockData.getAllStartups().map(s => s.id));
      return null;
    }
    
    console.log('✅ Startup encontrada:', startup.id, startup.nombre);

    // Inicializar estructura de respuestas
    const formResponses: FormResponses = {
      id: postulacionId,
      startupName: startup.nombre,
      complejidad: {
        casoReal: '',
        abordajePrevio: 'Análisis de problemas de coordinación y logística',
        consecuencias: 'Pérdidas económicas y clientes insatisfechos',
        identificacionAfectados: 'Múltiples empresas en el sector'
      },
      mercado: {
        tamanoMercado: '',
        validacionClientes: 'Entrevistas con clientes potenciales realizadas',
        interesPago: 'Disposición a pagar por soluciones efectivas',
        segmentoInteres: 'Empresas medianas con problemas de coordinación'
      },
      escalabilidad: {
        estrategiaAdquisicion: '',
        costoAdquisicion: 'CAC estimado basado en estrategia de mercado',
        facilidadExpansion: 'Modelo escalable con costos marginales bajos',
        estrategiasProbadas: 'Pilotos exitosos con clientes iniciales'
      },
      equipo: {
        trayectoriaEquipo: '',
        experienciaRelevante: 'Equipo con experiencia en el sector',
        rolesResponsabilidades: 'Roles claramente definidos y complementarios',
        superacionDesafios: 'Capacidad demostrada para resolver problemas'
      },
      createdAt: postulacion.createdAt.toISOString()
    };

    // Mapear respuestas específicas de la postulación
    postulacion.respuestas.forEach(respuesta => {
      const mapping = criterioMapping[respuesta.criterioId as keyof typeof criterioMapping];
      if (mapping) {
        const { categoria, campo } = mapping;
        (formResponses[categoria as keyof typeof formResponses] as any)[campo] = respuesta.valor;
      }
    });

    // Completar campos faltantes con datos de la startup
    if (!formResponses.complejidad.casoReal) {
      formResponses.complejidad.casoReal = `Problema identificado en ${startup.categoria}: ${startup.descripcion}`;
    }
    if (!formResponses.mercado.tamanoMercado) {
      formResponses.mercado.tamanoMercado = `Mercado de ${startup.categoria} en Perú con potencial de crecimiento`;
    }
    if (!formResponses.escalabilidad.estrategiaAdquisicion) {
      formResponses.escalabilidad.estrategiaAdquisicion = `Estrategia de crecimiento basada en ${startup.etapa} y ${startup.origen}`;
    }
    if (!formResponses.equipo.trayectoriaEquipo) {
      formResponses.equipo.trayectoriaEquipo = `Equipo fundador con experiencia en ${startup.categoria}`;
    }

    console.log('FormResponses convertido:', formResponses);
    return formResponses;
  } catch (error) {
    console.error('Error convirtiendo postulación a FormResponses:', error);
    return null;
  }
}

// Función para obtener todas las postulaciones convertidas
export function getAllFormResponses(): FormResponses[] {
  const postulaciones = getMockData.getAllPostulaciones();
  const formResponses: FormResponses[] = [];

  postulaciones.forEach(postulacion => {
    const converted = convertPostulacionToFormResponses(postulacion.id);
    if (converted) {
      formResponses.push(converted);
    }
  });

  return formResponses;
}

// Función para obtener una postulación específica convertida
export function getFormResponseById(postulacionId: string): FormResponses | null {
  return convertPostulacionToFormResponses(postulacionId);
} 