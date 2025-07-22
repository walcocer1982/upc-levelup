import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { EvaluacionStatus } from "@/data/mock/types";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { postulacionId } = await request.json();

    if (!postulacionId) {
      return NextResponse.json(
        { error: 'ID de postulación requerido' },
        { status: 400 }
      );
    }

    console.log('🚀 Iniciando evaluación para postulación:', postulacionId);

    // Verificar que la postulación existe
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

    // Verificar si ya existe una evaluación
    const evaluacionExistente = await prisma.evaluacionIA.findFirst({
      where: { postulacionId }
    });

    if (evaluacionExistente) {
      return NextResponse.json(
        { 
          error: 'Ya existe una evaluación para esta postulación',
          evaluacionId: evaluacionExistente.id
        },
        { status: 409 }
      );
    }

    // Crear nueva evaluación en estado PENDIENTE
    const nuevaEvaluacion = await prisma.evaluacionIA.create({
      data: {
        postulacionId: postulacionId,
        estado: EvaluacionStatus.PENDIENTE,
        puntajeTotal: null,
        confianza: 0,
        fechaEvaluacion: new Date(),
        criteriosEvaluados: [],
        analisis: null,
        feedback: null,
        metadata: {
          startupId: postulacion.startupId,
          startupName: postulacion.startup?.nombre,
          categoria: postulacion.startup?.categoria
        }
      }
    });

    console.log('✅ Evaluación creada en estado PENDIENTE:', nuevaEvaluacion.id);

    return NextResponse.json({
      success: true,
      message: 'Evaluación iniciada exitosamente',
      data: {
        evaluacionId: nuevaEvaluacion.id,
        estado: nuevaEvaluacion.estado,
        postulacionId: postulacionId,
        startupName: postulacion.startup?.nombre
      }
    });

  } catch (error) {
    console.error('❌ Error iniciando evaluación:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 