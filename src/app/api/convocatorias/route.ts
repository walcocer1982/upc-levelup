import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log("🔐 GET Convocatorias - Iniciando...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ GET Convocatorias - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener todas las convocatorias (usando Application en lugar de Convocatoria)
    const convocatorias = await prisma.application.findMany({
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
      },
      orderBy: {
        fechaInicio: 'desc'
      }
    });

    // Formatear convocatorias para mantener compatibilidad con el frontend
    const formattedConvocatorias = convocatorias.map(conv => ({
      id: conv.id,
      titulo: `${conv.tipo} ${new Date(conv.fechaInicio).getFullYear()}`,
      descripcion: `Convocatoria ${conv.tipo} para el año ${new Date(conv.fechaInicio).getFullYear()}`,
      fechaInicio: conv.fechaInicio,
      fechaFin: conv.fechaFin,
      estado: 'ACTIVA', // Por defecto activa
      createdAt: conv.fechaInicio // Usar fechaInicio como createdAt
    }));

    console.log("✅ GET Convocatorias - Convocatorias encontradas:", formattedConvocatorias.length);

    return NextResponse.json({
      success: true,
      convocatorias: formattedConvocatorias
    });

  } catch (error) {
    console.error("💥 Error en GET /api/convocatorias:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando nueva convocatoria...');
    
    const body = await request.json();
    const { titulo, descripcion, fechaInicio, fechaFin, estado, criterios } = body;

    if (!titulo || !descripcion || !fechaInicio || !fechaFin) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: titulo, descripcion, fechaInicio, fechaFin' },
        { status: 400 }
      );
    }

    // Crear nueva convocatoria
    const nuevaConvocatoria = await PrismaRepository.saveConvocatoria({
      id: `conv-${Date.now()}`,
      titulo,
      descripcion,
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
      estado: estado || 'ACTIVA',
      criterios: criterios || null
    });

    console.log('✅ Convocatoria creada exitosamente:', nuevaConvocatoria.id);

    return NextResponse.json({
      success: true,
      message: 'Convocatoria creada exitosamente',
      convocatoria: nuevaConvocatoria
    });

  } catch (error) {
    console.error('❌ Error creando convocatoria:', error);
    return NextResponse.json(
      { error: 'Error al crear convocatoria' },
      { status: 500 }
    );
  }
} 