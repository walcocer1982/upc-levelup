import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { ImpactResponseAdapter } from '@/lib/ai/impact-response-adapter';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔐 GET Startup Impact Status - Iniciando...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ GET Startup Impact Status - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: startupId } = await params;
    console.log("🔍 GET Startup Impact Status - Verificando startup:", startupId);

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, dni: true }
    });

    if (!user || !user.dni) {
      console.log("❌ GET Startup Impact Status - Usuario no encontrado o sin DNI");
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
      console.log("❌ GET Startup Impact Status - Usuario no autorizado para esta startup");
      return NextResponse.json({ error: 'No autorizado para esta startup' }, { status: 403 });
    }

    // Buscar respuestas de impacto existentes
    const impactResponses = await prisma.impactResponse.findMany({
      where: { startupId },
      orderBy: [
        { criterio: 'asc' },
        { pregunta: 'asc' }
      ]
    });

    // Validar completitud usando el adaptador
    const validation = ImpactResponseAdapter.validateCompleteness(impactResponses);
    const categorySummary = ImpactResponseAdapter.getCategorySummary(impactResponses);

    console.log("✅ GET Startup Impact Status - Estado verificado:", {
      startupId,
      isComplete: validation.isValid,
      answeredQuestions: validation.answeredQuestions,
      totalQuestions: validation.totalQuestions
    });

    return NextResponse.json({
      startupId,
      isComplete: validation.isValid,
      answeredQuestions: validation.answeredQuestions,
      totalQuestions: validation.totalQuestions,
      missingQuestions: validation.missingQuestions,
      categorySummary,
      responses: impactResponses
    });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/[id]/impact-status:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 