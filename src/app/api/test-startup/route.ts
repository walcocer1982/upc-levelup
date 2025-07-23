import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('🔍 Probando endpoint de startup...');
    
    // Probar obtener startup directamente con Prisma
    const startup = await prisma.startup.findUnique({
      where: { id: 'startup-test-001' }
    });
    
    if (!startup) {
      return NextResponse.json({ error: 'Startup no encontrada' }, { status: 404 });
    }
    
    console.log('✅ Startup encontrada:', startup.nombre);
    
    return NextResponse.json({
      success: true,
      startup: {
        id: startup.id,
        nombre: startup.nombre,
        categoria: startup.categoria,
        estado: startup.estado
      }
    });
    
  } catch (error) {
    console.error('❌ Error en test startup:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 