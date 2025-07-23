import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log("🔐 GET User Applications - Iniciando...");
    
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ GET User Applications - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { dni: true }
    });

    if (!user?.dni) {
      console.log("❌ GET User Applications - Usuario sin DNI");
      return NextResponse.json({ error: 'Usuario sin DNI registrado' }, { status: 400 });
    }

    console.log("🔍 GET User Applications - Buscando aplicaciones para DNI:", user.dni);

    // Obtener startups del usuario
    const userStartups = await prisma.member.findMany({
      where: { dni: user.dni },
      select: { startupId: true }
    });

    if (userStartups.length === 0) {
      console.log("✅ GET User Applications - Usuario no es miembro de ninguna startup");
      return NextResponse.json({
        success: true,
        aplicaciones: []
      });
    }

    const startupIds = userStartups.map(member => member.startupId);

    // Obtener aplicaciones de las startups del usuario
    const aplicaciones = await prisma.applicant.findMany({
      where: {
        startupId: { in: startupIds }
      },
      include: {
        startup: {
          select: {
            id: true,
            nombre: true,
            categoria: true,
            descripcion: true
          }
        },
        convocatoria: {
          select: {
            id: true,
            tipo: true,
            fechaInicio: true,
            fechaFin: true
          }
        },
        evaluaciones: {
          select: {
            id: true,
            estado: true,
            puntajeTotal: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    });

    console.log("✅ GET User Applications - Aplicaciones encontradas:", aplicaciones.length);

    return NextResponse.json({
      success: true,
              aplicaciones: aplicaciones.map(app => ({
          id: app.id,
          startup: app.startup,
          convocatoria: {
            ...app.convocatoria,
            nombre: `Convocatoria ${app.convocatoria.tipo}`,
            estado: 'activa'
          },
          estado: app.estado,
          fecha: app.fecha,
          evaluaciones: app.evaluaciones
        }))
    });

  } catch (error) {
    console.error("💥 Error en GET /api/users/applications:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 POST User Applications - Iniciando...");
    
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ POST User Applications - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    console.log("📧 POST User Applications - Email del usuario:", session.user.email);

    const body = await request.json();
    console.log("📦 POST User Applications - Body recibido:", body);
    
    const { convocatoriaId, startupId } = body;

    if (!convocatoriaId || !startupId) {
      console.log("❌ POST User Applications - Datos faltantes:", { convocatoriaId, startupId });
      return NextResponse.json(
        { error: 'convocatoriaId y startupId son requeridos' },
        { status: 400 }
      );
    }

    console.log("🔍 POST User Applications - Buscando usuario...");

    // Verificar que el usuario existe y tiene DNI
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { dni: true }
    });

    if (!user?.dni) {
      console.log("❌ POST User Applications - Usuario sin DNI:", session.user.email);
      return NextResponse.json(
        { error: 'Usuario sin DNI registrado' },
        { status: 400 }
      );
    }

    console.log("✅ POST User Applications - Usuario encontrado con DNI:", user.dni);

    console.log("🔍 POST User Applications - Buscando startup...");

    // Verificar que la startup existe y el usuario es miembro
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: {
        members: {
          where: { dni: user.dni }
        }
      }
    });

    if (!startup) {
      console.log("❌ POST User Applications - Startup no encontrada:", startupId);
      return NextResponse.json(
        { error: 'Startup no encontrada' },
        { status: 404 }
      );
    }

    if (startup.members.length === 0) {
      console.log("❌ POST User Applications - Usuario no es miembro de la startup");
      return NextResponse.json(
        { error: 'No eres miembro de esta startup' },
        { status: 403 }
      );
    }

    console.log("✅ POST User Applications - Usuario es miembro de la startup");

    console.log("🔍 POST User Applications - Buscando convocatoria...");

    // Verificar que la convocatoria existe
    const convocatoria = await prisma.application.findUnique({
      where: { id: convocatoriaId }
    });

    if (!convocatoria) {
      console.log("❌ POST User Applications - Convocatoria no encontrada:", convocatoriaId);
      return NextResponse.json(
        { error: 'Convocatoria no encontrada' },
        { status: 404 }
      );
    }

    console.log("✅ POST User Applications - Convocatoria encontrada");

    console.log("🔍 POST User Applications - Verificando impacto...");

    // Verificar que el formulario de impacto esté completo
    const impactResponses = await prisma.impactResponse.findMany({
      where: { startupId }
    });

    console.log("📊 POST User Applications - Respuestas de impacto:", impactResponses.length);

    // Validar que todas las respuestas estén completas usando el adaptador
    const { ImpactResponseAdapter } = await import('@/lib/ai/impact-response-adapter');
    const validation = ImpactResponseAdapter.validateCompleteness(impactResponses);
    
    if (!validation.isValid) {
      console.log("❌ POST User Applications - Impacto incompleto:", validation.answeredQuestions, "/", validation.totalQuestions);
      console.log("❌ POST User Applications - Preguntas faltantes:", validation.missingQuestions);
      return NextResponse.json(
        { 
          error: 'El formulario de impacto debe estar completo (16 respuestas)',
          details: {
            respuestasCompletadas: validation.answeredQuestions,
            totalRequeridas: validation.totalQuestions,
            preguntasFaltantes: validation.missingQuestions
          }
        },
        { status: 400 }
      );
    }

    console.log("🔍 POST User Applications - Verificando duplicados...");

    // Verificar que no haya una postulación duplicada
    const existingApplication = await prisma.applicant.findFirst({
      where: {
        startupId,
        convocatoriaId
      }
    });

    if (existingApplication) {
      console.log("❌ POST User Applications - Postulación duplicada");
      return NextResponse.json(
        { error: 'Ya tienes una postulación para esta convocatoria con esta startup' },
        { status: 400 }
      );
    }

    console.log("✅ POST User Applications - Creando nueva postulación...");

    // Crear la postulación
    const nuevaPostulacion = await prisma.applicant.create({
      data: {
        startupId,
        convocatoriaId,
        estado: 'postulado',
        fecha: new Date()
      },
      include: {
        startup: {
          select: {
            id: true,
            nombre: true,
            categoria: true
          }
        },
        convocatoria: {
          select: {
            id: true,
            tipo: true
          }
        }
      }
    });

    console.log("✅ POST User Applications - Postulación creada:", nuevaPostulacion.id);

    return NextResponse.json({
      success: true,
      message: 'Postulación enviada exitosamente',
      postulacion: {
        id: nuevaPostulacion.id,
        startup: nuevaPostulacion.startup,
        convocatoria: {
          id: nuevaPostulacion.convocatoria.id,
          tipo: nuevaPostulacion.convocatoria.tipo
        },
        estado: nuevaPostulacion.estado,
        fecha: nuevaPostulacion.fecha
      }
    });

  } catch (error) {
    console.error("💥 Error en POST /api/users/applications:", error);
    console.error("💥 Stack trace:", error.stack);
    
    // Devolver un error más específico
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Error interno del servidor',
          details: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 