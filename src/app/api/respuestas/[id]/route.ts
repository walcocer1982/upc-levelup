import { NextResponse } from "next/server";
import { PrismaRepository } from "@/data/database/repository-prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postulacionId = params.id;
    console.log('🔍 Obteniendo respuestas para postulación:', postulacionId);

    // Obtener postulación
    const postulacionData = await PrismaRepository.getApplicantById(postulacionId);
    if (!postulacionData) {
      return NextResponse.json(
        { error: 'Postulación no encontrada' },
        { status: 404 }
      );
    }

    // Obtener startup
    const startupData = await PrismaRepository.getStartup(postulacionData.startupId);
    if (!startupData) {
      return NextResponse.json(
        { error: 'Startup no encontrada' },
        { status: 404 }
      );
    }

    // Obtener respuestas
    const respuestasData = await PrismaRepository.getApplicationFormsByStartup(postulacionData.startupId);
    if (!respuestasData || respuestasData.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron respuestas' },
        { status: 404 }
      );
    }

    // Verificar si ya existe una evaluación
    const evaluacionData = await PrismaRepository.getEvaluacionIAByPostulacion(postulacionId);

    return NextResponse.json({
      success: true,
      postulacion: {
        id: postulacionData.id,
        startupId: postulacionData.startupId,
        estado: postulacionData.estado,
        fecha: postulacionData.fecha,
        fechaPostulacion: postulacionData.fecha,
        convocatoriaId: postulacionData.convocatoriaId,
        documentos: [],
        respuestas: respuestasData.map(r => ({
          id: r.id,
          pregunta: r.pregunta,
          respuesta: r.respuesta,
          categoria: r.categoria,
          peso: r.peso,
          orden: r.orden
        })),
        createdAt: postulacionData.fecha,
        updatedAt: postulacionData.fecha,
        version: 1
      },
      startup: {
        id: startupData.id,
        nombre: startupData.nombre,
        categoria: startupData.categoria,
        etapa: startupData.etapa,
        descripcion: startupData.descripcion,
        sector: startupData.sector || 'TECH',
        estado: 'activa',
        fundadores: ['Fundador Principal'],
        miembros: [],
        fechaFundacion: startupData.fechaFundacion,
        paginaWeb: startupData.paginaWeb,
        videoPitchUrl: startupData.videoPitchUrl,
        razonSocial: startupData.razonSocial,
        ruc: startupData.ruc,
        origen: startupData.origen
      },
      respuestas: respuestasData.map(r => ({
        id: r.id,
        pregunta: r.pregunta,
        respuesta: r.respuesta,
        categoria: r.categoria,
        peso: r.peso,
        orden: r.orden
      })),
      evaluacion: evaluacionData ? {
        id: evaluacionData.id,
        postulacionId: evaluacionData.postulacionId,
        estado: evaluacionData.estado,
        puntajeTotal: evaluacionData.puntajeTotal,
        confianza: evaluacionData.confianza,
        fechaEvaluacion: evaluacionData.fechaEvaluacion,
        criteriosEvaluados: evaluacionData.criteriosEvaluados || [],
        analisis: evaluacionData.analisis,
        feedback: evaluacionData.feedback,
        metadata: evaluacionData.metadata
      } : null
    });

  } catch (error) {
    console.error('❌ Error obteniendo respuestas:', error);
    return NextResponse.json(
      { 
        error: 'Error al obtener respuestas',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 