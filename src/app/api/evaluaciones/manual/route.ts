import { NextRequest, NextResponse } from 'next/server';
import { PrismaRepository } from '@/data/database/repository-prisma';
import { PrismaClient } from '@/generated/prisma';
import { 
  EvaluacionStatus, 
  PostulacionStatus,
  CategoriaEvaluacion
} from '@/data/mock/types';
import { validateEnv } from '@/lib/config/env';
import { ServerAIServices } from '@/lib/ai/server-services';

const prisma = new PrismaClient();

// GET: Obtener respuestas para revisión manual
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postulacionId = searchParams.get('postulacionId');

    if (!postulacionId) {
      return NextResponse.json(
        { error: 'postulacionId es requerido' },
        { status: 400 }
      );
    }

    console.log(`📋 Obteniendo respuestas para revisión manual: ${postulacionId}`);

    // Obtener la postulación
    const postulacion = await prisma.applicant.findUnique({
      where: { id: postulacionId },
      include: {
        startup: true
      }
    });

    if (!postulacion) {
      return NextResponse.json(
        { error: 'Postulación no encontrada' },
        { status: 404 }
      );
    }

    // Obtener respuestas organizadas por categoría
    const respuestas = await prisma.applicationForm.findMany({
      where: {
        startupId: postulacion.startupId,
        convocatoriaId: postulacion.convocatoriaId
      },
      orderBy: [
        { categoria: 'asc' },
        { orden: 'asc' }
      ]
    });

    // Organizar respuestas por categoría
    const respuestasPorCategoria = {
      COMPLEJIDAD: respuestas.filter(r => r.categoria === 'COMPLEJIDAD'),
      MERCADO: respuestas.filter(r => r.categoria === 'MERCADO'),
      ESCALABILIDAD: respuestas.filter(r => r.categoria === 'ESCALABILIDAD'),
      EQUIPO: respuestas.filter(r => r.categoria === 'EQUIPO')
    };

    return NextResponse.json({
      success: true,
      postulacion: {
        id: postulacion.id,
        startup: postulacion.startup,
        estado: postulacion.estado,
        fecha: postulacion.fecha
      },
      respuestas: respuestasPorCategoria,
      totalRespuestas: respuestas.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo respuestas para revisión manual:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST: Iniciar evaluación IA después de revisión manual
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando evaluación IA después de revisión manual...');
    
    const { postulacionId, usarIA = true } = await request.json();

    if (!postulacionId) {
      return NextResponse.json(
        { error: 'postulacionId es requerido' },
        { status: 400 }
      );
    }

    // Si no se quiere usar IA, crear evaluación manual
    if (!usarIA) {
      const evaluacionManual = {
        id: `eval-manual-${Date.now()}`,
        postulacionId,
        estado: EvaluacionStatus.REQUIERE_REVISION,
        modelVersion: 'manual',
        confianza: 0.5,
        criteriosEvaluados: [],
        puntajeTotal: 0,
        analisis: {
          fortalezas: [],
          debilidades: [],
          observaciones: ['Evaluación pendiente de revisión manual'],
          recomendaciones: []
        },
        metadata: {
          tiempoEvaluacion: 0,
          intentos: 0,
          ultimaActualizacion: new Date(),
          evaluacionManual: true
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      };

      await PrismaRepository.saveEvaluacionIA(evaluacionManual);

      return NextResponse.json({
        success: true,
        evaluacion: evaluacionManual,
        message: 'Evaluación manual creada. Pendiente de revisión.'
      });
    }

    // Validar variables de entorno para IA
    try {
      validateEnv();
      console.log('✅ Configuración de OpenAI validada');
    } catch (error) {
      console.error('❌ Error de configuración:', error);
      return NextResponse.json(
        { 
          error: 'Configuración de OpenAI no encontrada. Por favor, configura OPENAI_API_KEY en .env.local',
          details: error instanceof Error ? error.message : 'Error desconocido'
        },
        { status: 500 }
      );
    }

    // Obtener respuestas de la postulación
    console.log('🔍 Obteniendo respuestas de la postulación...');
    const postulacion = await prisma.applicant.findUnique({
      where: { id: postulacionId }
    });

    if (!postulacion) {
      return NextResponse.json(
        { error: 'Postulación no encontrada' },
        { status: 404 }
      );
    }

    const respuestas = await prisma.applicationForm.findMany({
      where: {
        startupId: postulacion.startupId,
        convocatoriaId: postulacion.convocatoriaId
      },
      select: {
        id: true,
        pregunta: true,
        respuesta: true,
        categoria: true,
        peso: true,
        orden: true
      }
    });

    if (!respuestas || respuestas.length === 0) {
      console.log('❌ No se encontraron respuestas');
      return NextResponse.json(
        { error: 'No se encontraron respuestas para la postulación' },
        { status: 400 }
      );
    }
    console.log(`✅ Encontradas ${respuestas.length} respuestas`);

    // Convertir respuestas al formato del evaluador
    const respuestasEvaluacion = respuestas.map(r => ({
      id: r.id,
      pregunta: r.pregunta || '',
      respuesta: r.respuesta || '',
      categoria: r.categoria?.toUpperCase() as CategoriaEvaluacion,
      peso: r.peso || 1,
      orden: r.orden || 0
    }));

    // Realizar evaluación con IA
    console.log('🤖 Iniciando evaluación con IA...');
    const evaluacionCompleta = await ServerAIServices.evaluarStartup(respuestasEvaluacion);
    console.log('✅ Evaluación con IA completada');

    // Crear evaluación IA
    const evaluacionId = `eval-${Date.now()}`;
    const evaluacionIA = {
      id: evaluacionId,
      postulacionId,
      estado: EvaluacionStatus.COMPLETADA,
      modelVersion: 'gpt-4o-mini',
      confianza: evaluacionCompleta.confianza,
      criteriosEvaluados: evaluacionCompleta.criteriosEvaluados.map((ec, index) => ({
        id: `crit-eval-${evaluacionId}-${index}`,
        evaluacionId: evaluacionId,
        criterioId: `crit-${ec.categoria}`,
        categoria: ec.categoria,
        puntajeOriginal: ec.nivel,
        puntajeNormalizado: ec.puntuacion,
        justificacion: ec.justificacion,
        recomendaciones: ec.recomendaciones || '',
        confianza: ec.confianza,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      })),
      puntajeTotal: evaluacionCompleta.puntajeTotal,
      analisis: evaluacionCompleta.analisis,
      metadata: {
        tiempoEvaluacion: 0,
        intentos: 1,
        ultimaActualizacion: new Date(),
        evaluacionManual: false
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1
    };

    // Guardar evaluación
    console.log('💾 Guardando evaluación en base de datos...');
    console.log(`📋 ID de evaluación: ${evaluacionIA.id}`);
    console.log(`📋 Postulación ID: ${evaluacionIA.postulacionId}`);
    await PrismaRepository.saveEvaluacionIA(evaluacionIA);

    // Actualizar estado de la postulación
    await prisma.applicant.update({
      where: { id: postulacionId },
      data: { estado: 'enRevision' }
    });

    console.log('🎉 Evaluación completada exitosamente!');
    console.log(`📊 Puntuación total: ${evaluacionIA.puntajeTotal}/100`);
    console.log(`🤖 Confianza: ${(evaluacionIA.confianza * 100).toFixed(1)}%`);

    return NextResponse.json({
      success: true,
      evaluacion: evaluacionIA
    });

  } catch (error) {
    console.error('❌ Error en evaluación manual:', error);
    
    let errorMessage = 'Error al procesar la evaluación';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
} 