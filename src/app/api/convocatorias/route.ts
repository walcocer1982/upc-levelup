import { NextRequest, NextResponse } from 'next/server';
import { PrismaRepository } from '@/data/database/repository-prisma';

export async function GET() {
  try {
    console.log('🔍 Obteniendo todas las convocatorias...');
    
    // Obtener todas las convocatorias desde la base de datos real
    const convocatorias = await PrismaRepository.getConvocatorias();
    
    console.log(`✅ Encontradas ${convocatorias.length} convocatorias`);
    convocatorias.forEach(conv => {
      console.log(`   - ID: ${conv.id}`);
      console.log(`   - Título: ${conv.titulo}`);
      console.log(`   - Estado: ${conv.estado}`);
    });

    return NextResponse.json(convocatorias);
  } catch (error) {
    console.error('❌ Error obteniendo convocatorias:', error);
    return NextResponse.json(
      { error: 'Error al obtener convocatorias' },
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