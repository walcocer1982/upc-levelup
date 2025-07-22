import { NextRequest, NextResponse } from 'next/server';
import { PrismaRepository } from '@/data/database/repository-prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔍 Obteniendo convocatoria:', id);
    
    // Obtener convocatoria específica desde la base de datos real
    const convocatoria = await PrismaRepository.getConvocatoriaById(id);
    
    if (!convocatoria) {
      return NextResponse.json(
        { error: 'Convocatoria no encontrada' },
        { status: 404 }
      );
    }

    console.log('✅ Convocatoria encontrada:', convocatoria.titulo);

    return NextResponse.json(convocatoria);
  } catch (error) {
    console.error('❌ Error obteniendo convocatoria:', error);
    return NextResponse.json(
      { error: 'Error al obtener convocatoria' },
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