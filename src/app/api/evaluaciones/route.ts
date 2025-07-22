import { NextResponse } from "next/server";
import { PrismaRepository } from "@/data/database/repository-prisma";

export async function GET() {
  try {
    console.log('🔍 Obteniendo evaluaciones desde el servidor...');

    // Obtener todas las postulaciones
    const postulaciones = await PrismaRepository.getAllApplicants();
    
    // Procesar cada postulación (con o sin evaluación)
    const evaluacionesData = await Promise.all(
      postulaciones.map(async (postulacion) => {
        const evaluacion = await PrismaRepository.getEvaluacionIAByPostulacion(postulacion.id);
        const startup = await PrismaRepository.getStartup(postulacion.startupId);
        
        // Si no hay evaluación, crear una entrada para la postulación pendiente
        if (!evaluacion) {
          return {
            id: `pending-${postulacion.id}`,
            postulacionId: postulacion.id,
            startupName: startup?.nombre || 'Startup no encontrada',
            estado: 'PENDIENTE',
            puntajeTotal: 0,
            evaluadorId: 'Pendiente',
            fechaEvaluacion: postulacion.fecha,
            metadata: {
              tiempoEvaluacion: 0,
              intentos: 0
            },
            tieneEvaluacion: false
          };
        }

        // Si hay evaluación, usar los datos reales
        return {
          id: evaluacion.id,
          postulacionId: postulacion.id,
          startupName: startup?.nombre || 'Startup no encontrada',
          estado: evaluacion.estado,
          puntajeTotal: evaluacion.puntajeTotal,
          evaluadorId: 'IA',
          fechaEvaluacion: evaluacion.updatedAt,
          metadata: evaluacion.metadata,
          tieneEvaluacion: true
        };
      })
    );

    // Calcular estadísticas (solo para evaluaciones completadas)
    const evaluacionesCompletadas = evaluacionesData.filter(e => e.tieneEvaluacion && e.estado === 'COMPLETADA');
    const estadisticas = {
      total: evaluacionesData.length,
      evaluacionesIA: evaluacionesCompletadas.length,
      promedioPuntaje: evaluacionesCompletadas.reduce((sum, e) => sum + e.puntajeTotal, 0) / evaluacionesCompletadas.length || 0,
      aprobadas: evaluacionesCompletadas.filter(e => e.puntajeTotal >= 70).length
    };

    return NextResponse.json({
      success: true,
      evaluaciones: evaluacionesData,
      estadisticas
    });

  } catch (error) {
    console.error('❌ Error obteniendo evaluaciones:', error);
    return NextResponse.json(
      { 
        error: 'Error al obtener evaluaciones',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 