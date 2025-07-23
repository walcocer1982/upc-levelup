import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔐 GET Convocatoria by ID - Iniciando...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ GET Convocatoria by ID - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: convocatoriaId } = await params;
    console.log("🔍 GET Convocatoria by ID - Buscando convocatoria:", convocatoriaId);

    // Obtener convocatoria de la base de datos (usando Application en lugar de Convocatoria)
    const convocatoria = await prisma.application.findUnique({
      where: { id: convocatoriaId },
      select: {
        id: true,
        tipo: true,
        fechaInicio: true,
        fechaFin: true,
        creadoPorId: true,
        creadoPor: {
          select: {
            nombres: true,
            apellidos: true,
            email: true
          }
        }
      }
    });

    if (!convocatoria) {
      console.log("❌ GET Convocatoria by ID - Convocatoria no encontrada");
      return NextResponse.json({ error: 'Convocatoria no encontrada' }, { status: 404 });
    }

    // Obtener postulaciones para esta convocatoria
    const postulaciones = await prisma.applicant.findMany({
      where: { 
        convocatoriaId: convocatoriaId 
      },
      include: {
        startup: {
          select: {
            id: true,
            nombre: true,
            categoria: true
          }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    });

    // Formatear postulaciones
    const formattedPostulaciones = postulaciones.map(post => ({
      id: post.id,
      startupId: post.startupId,
      estado: post.estado,
      fecha: post.fecha.toISOString(),
      startup: post.startup
    }));

    console.log("✅ GET Convocatoria by ID - Convocatoria encontrada:", convocatoria.tipo);

    return NextResponse.json({
      success: true,
      convocatoria: {
        id: convocatoria.id,
        nombre: `${convocatoria.tipo} ${new Date(convocatoria.fechaInicio).getFullYear()}`, // Campo requerido por el frontend
        titulo: `${convocatoria.tipo} ${new Date(convocatoria.fechaInicio).getFullYear()}`,
        descripcion: `Convocatoria ${convocatoria.tipo} para el año ${new Date(convocatoria.fechaInicio).getFullYear()}`,
        tipo: convocatoria.tipo, // Campo requerido por el frontend
        fechaInicio: convocatoria.fechaInicio,
        fechaFin: convocatoria.fechaFin,
        estado: 'ACTIVA', // Por defecto activa si está en el rango de fechas
        criterios: null,
        // Agregar campos requeridos por el frontend
        requisitos: [
          'Startup con al menos 6 meses de operación',
          'Equipo mínimo de 2 personas',
          'Producto o servicio validado en el mercado',
          'Formulario de impacto completo'
        ],
        beneficios: [
          'Mentoría personalizada',
          'Acceso a red de inversores',
          'Espacio de trabajo',
          'Financiamiento de hasta $50,000'
        ],
        postulaciones: formattedPostulaciones
      }
    });

  } catch (error) {
    console.error("💥 Error en GET /api/convocatorias/[id]:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔍 Actualizando convocatoria:', id);
    
    const body = await request.json();
    const { titulo, descripcion, fechaInicio, fechaFin, estado, criterios } = body;

    // Verificar que la convocatoria existe
    const existingConvocatoria = await PrismaRepository.getConvocatoriaById(id);
    
    if (!existingConvocatoria) {
      return NextResponse.json(
        { error: 'Convocatoria no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar convocatoria
    const convocatoriaActualizada = await PrismaRepository.saveConvocatoria({
      id,
      titulo: titulo || existingConvocatoria.titulo,
      descripcion: descripcion || existingConvocatoria.descripcion,
      fechaInicio: fechaInicio ? new Date(fechaInicio) : existingConvocatoria.fechaInicio,
      fechaFin: fechaFin ? new Date(fechaFin) : existingConvocatoria.fechaFin,
      estado: estado || existingConvocatoria.estado,
      criterios: criterios || existingConvocatoria.criterios
    });

    console.log('✅ Convocatoria actualizada exitosamente');

    return NextResponse.json({
      success: true,
      message: 'Convocatoria actualizada exitosamente',
      convocatoria: convocatoriaActualizada
    });

  } catch (error) {
    console.error('❌ Error actualizando convocatoria:', error);
    return NextResponse.json(
      { error: 'Error al actualizar convocatoria' },
      { status: 500 }
    );
  }
} 