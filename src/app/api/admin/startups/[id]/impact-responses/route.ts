import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔐 GET Admin Impact Responses - Iniciando...");
    
    // Verificar sesión de admin
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ GET Admin Impact Responses - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que es admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (user?.role !== 'admin') {
      console.log("❌ GET Admin Impact Responses - No autorizado - No es admin");
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { id: startupId } = await params;
    console.log("🔍 GET Admin Impact Responses - Buscando respuestas para startup:", startupId);

    // Verificar que la startup existe
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      select: { id: true, nombre: true, categoria: true }
    });

    if (!startup) {
      console.log("❌ GET Admin Impact Responses - Startup no encontrada");
      return NextResponse.json({ error: 'Startup no encontrada' }, { status: 404 });
    }

    // Obtener respuestas del formulario de impacto
    const impactResponses = await prisma.impactResponse.findMany({
      where: { startupId },
      orderBy: [
        { criterio: 'asc' },
        { pregunta: 'asc' }
      ]
    });

    // Organizar respuestas por categoría
    const respuestasPorCategoria = {
      complejidad: impactResponses.filter(r => r.criterio === 'complejidad'),
      mercado: impactResponses.filter(r => r.criterio === 'mercado'),
      escalabilidad: impactResponses.filter(r => r.criterio === 'escalabilidad'),
      equipo: impactResponses.filter(r => r.criterio === 'equipo')
    };

    // Mapear preguntas a títulos
    const PREGUNTAS_TITULOS: Record<number, string> = {
      1: "Cuéntanos sobre un caso real y reciente",
      2: "¿Cómo abordaban el problema antes de su solución?",
      3: "¿Qué consecuencias tenía no resolver bien este problema?",
      4: "¿Han identificado a otros afectados?",
      5: "Estima el tamaño de tu mercado",
      6: "Validación con potenciales clientes",
      7: "Interés en pagar por la solución",
      8: "Segmento de mayor interés",
      9: "Estrategia de adquisición de primeros clientes",
      10: "Costo de adquisición de clientes (CAC)",
      11: "Facilidad de expansión",
      12: "Estrategias de escalabilidad probadas",
      13: "Trayectoria del equipo en el proyecto",
      14: "Experiencia relevante del equipo",
      15: "Roles y responsabilidades clave",
      16: "Superación de desafíos"
    };

    // Formatear respuestas con títulos
    const respuestasFormateadas = Object.entries(respuestasPorCategoria).map(([categoria, respuestas]) => ({
      categoria,
      nombre: categoria.charAt(0).toUpperCase() + categoria.slice(1),
      respuestas: respuestas.map(r => ({
        id: r.id,
        pregunta: r.pregunta,
        titulo: PREGUNTAS_TITULOS[r.pregunta] || `Pregunta ${r.pregunta}`,
        respuesta: r.respuesta,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      }))
    }));

    console.log("✅ GET Admin Impact Responses - Respuestas encontradas:", impactResponses.length);

    return NextResponse.json({
      success: true,
      startup: {
        id: startup.id,
        nombre: startup.nombre,
        categoria: startup.categoria
      },
      respuestas: respuestasFormateadas,
      totalRespuestas: impactResponses.length,
      categorias: [
        {
          id: 'complejidad',
          nombre: 'Complejidad',
          total: 4,
          respondidas: respuestasPorCategoria.complejidad.length
        },
        {
          id: 'mercado',
          nombre: 'Mercado',
          total: 4,
          respondidas: respuestasPorCategoria.mercado.length
        },
        {
          id: 'escalabilidad',
          nombre: 'Escalabilidad',
          total: 4,
          respondidas: respuestasPorCategoria.escalabilidad.length
        },
        {
          id: 'equipo',
          nombre: 'Equipo',
          total: 4,
          respondidas: respuestasPorCategoria.equipo.length
        }
      ]
    });

  } catch (error) {
    console.error("💥 Error en GET /api/admin/startups/[id]/impact-responses:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 