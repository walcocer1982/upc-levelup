import { NextResponse } from 'next/server';
import { evaluarStartup } from '@/lib/ai/evaluation';
import { ensureKnowledgeLoaded } from '@/lib/ai/load-knowledge';

export async function POST(request: Request) {
  try {
    // Verificar que la base de conocimiento esté cargada
    await ensureKnowledgeLoaded();
    
    // Obtener datos de la solicitud
    const data = await request.json();
    
    // Validar datos
    if (!data.startupName || !data.criterios || !Array.isArray(data.criterios)) {
      return NextResponse.json(
        { error: 'Datos de evaluación inválidos' },
        { status: 400 }
      );
    }
    
    // Evaluar startup
    const resultado = await evaluarStartup({
      startupName: data.startupName,
      criterios: data.criterios
    });
    
    // Devolver resultados
    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Error al evaluar startup:', error);
    return NextResponse.json(
      { error: 'Error al procesar la evaluación' },
      { status: 500 }
    );
  }
} 