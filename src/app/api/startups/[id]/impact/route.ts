import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔐 GET Startup Impact - Iniciando...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ GET Startup Impact - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: startupId } = await params;
    console.log("🔍 GET Startup Impact - Buscando respuestas para startup:", startupId);

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, dni: true }
    });

    if (!user || !user.dni) {
      console.log("❌ GET Startup Impact - Usuario no encontrado o sin DNI");
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar que el usuario es miembro de la startup
    const isMember = await prisma.member.findUnique({
      where: {
        dni_startupId: {
          dni: user.dni,
          startupId: startupId
        }
      }
    });

    if (!isMember) {
      console.log("❌ GET Startup Impact - Usuario no autorizado para esta startup");
      return NextResponse.json({ error: 'No autorizado para esta startup' }, { status: 403 });
    }

    // Buscar respuestas de impacto existentes
    const responses = await prisma.impactResponse.findMany({
      where: { startupId },
      orderBy: [
        { criterio: 'asc' },
        { pregunta: 'asc' }
      ]
    });

    console.log("✅ GET Startup Impact - Respuestas encontradas:", responses.length);

    return NextResponse.json({ responses });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/[id]/impact:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔐 POST Startup Impact - Iniciando...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ POST Startup Impact - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: startupId } = await params;
    const body = await request.json();
    const { responses } = body;

    console.log("🔍 POST Startup Impact - Guardando respuestas para startup:", startupId);

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, dni: true }
    });

    if (!user || !user.dni) {
      console.log("❌ POST Startup Impact - Usuario no encontrado o sin DNI");
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar que el usuario es miembro de la startup
    const isMember = await prisma.member.findUnique({
      where: {
        dni_startupId: {
          dni: user.dni,
          startupId: startupId
        }
      }
    });

    if (!isMember) {
      console.log("❌ POST Startup Impact - Usuario no autorizado para esta startup");
      return NextResponse.json({ error: 'No autorizado para esta startup' }, { status: 403 });
    }

    // Guardar o actualizar respuestas
    const savedResponses = [];
    
    for (const response of responses) {
      const { criterio, pregunta, respuesta } = response;
      
      const savedResponse = await prisma.impactResponse.upsert({
        where: {
          startupId_criterio_pregunta: {
            startupId,
            criterio,
            pregunta
          }
        },
        update: {
          respuesta,
          updatedAt: new Date()
        },
        create: {
          startupId,
          criterio,
          pregunta,
          respuesta,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      savedResponses.push(savedResponse);
    }

    console.log("✅ POST Startup Impact - Respuestas guardadas:", savedResponses.length);

    return NextResponse.json({ 
      message: 'Respuestas guardadas exitosamente',
      responses: savedResponses 
    });

  } catch (error) {
    console.error("💥 Error en POST /api/startups/[id]/impact:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}