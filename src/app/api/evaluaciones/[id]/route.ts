import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔐 GET Evaluación Detallada - Iniciando...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ GET Evaluación - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 GET Evaluación - Buscando evaluación ID:", id);

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, dni: true }
    });

    if (!user || !user.dni) {
      console.log("❌ GET Evaluación - Usuario no encontrado o sin DNI");
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Buscar la evaluación con todos los datos relacionados
    const evaluacion = await prisma.evaluacionIA.findUnique({
      where: { id },
      include: {
        criteriosEvaluados: {
          orderBy: { categoria: 'asc' }
        },
        postulacion: {
          include: {
            startup: {
              select: {
                nombre: true,
                categoria: true
              }
            },
            convocatoria: {
              select: {
                tipo: true
              }
            }
          }
        }
      }
    });

    if (!evaluacion) {
      console.log("❌ GET Evaluación - Evaluación no encontrada");
      return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 });
    }

    // Verificar que el usuario tiene acceso a esta evaluación
    // (es miembro de la startup de la postulación)
    const isMember = await prisma.member.findUnique({
      where: {
        dni_startupId: {
          dni: user.dni,
          startupId: evaluacion.postulacion.startupId
        }
      }
    });

    if (!isMember) {
      console.log("❌ GET Evaluación - Usuario no autorizado para esta evaluación");
      return NextResponse.json({ error: 'No autorizado para esta evaluación' }, { status: 403 });
    }

    console.log("✅ GET Evaluación - Evaluación encontrada con", evaluacion.criteriosEvaluados.length, "criterios");

    // Formatear la respuesta
    const evaluacionFormateada = {
      id: evaluacion.id,
      estado: evaluacion.estado,
      modelVersion: evaluacion.modelVersion,
      confianza: evaluacion.confianza,
      puntajeTotal: evaluacion.puntajeTotal,
      analisis: evaluacion.analisis,
      metadata: evaluacion.metadata,
      criteriosEvaluados: evaluacion.criteriosEvaluados.map(criterio => ({
        id: criterio.id,
        categoria: criterio.categoria,
        puntajeOriginal: criterio.puntajeOriginal,
        puntajeNormalizado: criterio.puntajeNormalizado,
        justificacion: criterio.justificacion,
        recomendaciones: criterio.recomendaciones,
        confianza: criterio.confianza
      })),
      postulacion: {
        startup: {
          nombre: evaluacion.postulacion.startup.nombre,
          categoria: evaluacion.postulacion.startup.categoria
        },
        convocatoria: {
          tipo: evaluacion.postulacion.convocatoria.tipo
        }
      }
    };

    return NextResponse.json({ evaluacion: evaluacionFormateada });

  } catch (error) {
    console.error("💥 Error en GET /api/evaluaciones/[id]:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 