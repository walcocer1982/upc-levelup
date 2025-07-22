import { NextRequest, NextResponse } from 'next/server';
import { ServerAIServices } from '@/lib/ai/server-services';
import { validateEnv } from '@/lib/config/env';

export async function POST(request: NextRequest) {
  try {
    // Validar variables de entorno
    validateEnv();
    
    const { categoria, respuestas } = await request.json();

    if (!categoria || !respuestas) {
      return NextResponse.json(
        { error: 'categoria y respuestas son requeridos' },
        { status: 400 }
      );
    }

    // Obtener contexto relevante del servidor
    const contexto = await ServerAIServices.buscarContextoRelevante(categoria, respuestas);

    return NextResponse.json({
      success: true,
      contexto
    });

  } catch (error) {
    console.error('Error obteniendo contexto:', error);
    return NextResponse.json(
      { error: 'Error al obtener contexto' },
      { status: 500 }
    );
  }
} 