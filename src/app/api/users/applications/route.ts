import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    console.log("🔐 GET User Applications - Sesión verificada:", session?.user?.email);

    if (!session || !session.user?.email) {
      console.log("❌ GET User Applications - No autorizado - Sin sesión");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get('startupId');

    console.log("🔍 GET User Applications - Parámetros:");
    console.log("  - startupId:", startupId);

    // Obtener el usuario actual
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || !user.dni) {
      console.log("❌ GET User Applications - Usuario no encontrado o sin DNI");
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Construir condiciones de búsqueda
    let whereClause: any = {};

    if (startupId) {
      // Si se especifica startupId, buscar solo postulaciones de esa startup
      // Verificar que el usuario sea miembro de la startup
      const memberCheck = await prisma.member.findFirst({
        where: {
          dni: user.dni,
          startupId: startupId
        }
      });

      if (!memberCheck) {
        console.log("❌ GET User Applications - Usuario no es miembro de la startup");
        return NextResponse.json({ error: "No tienes acceso a esta startup" }, { status: 403 });
      }

      whereClause.startupId = startupId;
    } else {
      // Si no se especifica startupId, buscar todas las startups donde el usuario es miembro
      const userStartups = await prisma.member.findMany({
        where: { dni: user.dni },
        select: { startupId: true }
      });

      const startupIds = userStartups.map(member => member.startupId);
      
      if (startupIds.length === 0) {
        console.log("✅ GET User Applications - Usuario no es miembro de ninguna startup");
        return NextResponse.json({
          applications: [],
          count: 0
        }, { status: 200 });
      }

      whereClause.startupId = { in: startupIds };
    }

    console.log("🔍 GET User Applications - Buscando postulaciones con filtros:", whereClause);

    // ✅ MAPEO CORRECTO con schema.prisma:
    // Applicant: id, startupId, convocatoriaId, estado, feedbackEvaluador, feedbackIA, fecha, locked
    const applicants = await prisma.applicant.findMany({
      where: whereClause,
      include: {
        convocatoria: {
          select: {
            id: true,
            tipo: true,           // ✅ Application.tipo (TipoConvocatoria)
            fechaInicio: true,    // ✅ Application.fechaInicio (DateTime)
            fechaFin: true        // ✅ Application.fechaFin (DateTime)
          }
        },
        startup: {
          select: {
            id: true,
            nombre: true          // ✅ Startup.nombre (String)
          }
        }
      },
      orderBy: {
        fecha: 'desc'           // ✅ Applicant.fecha (DateTime)
      }
    });

    console.log("✅ GET User Applications - Postulaciones encontradas:", applicants.length);

    // ✅ FORMATEAR respuesta con campos del schema
    const formattedApplications = applicants.map(applicant => ({
      id: applicant.id,                                          // ✅ Applicant.id
      convocatoriaId: applicant.convocatoriaId,                  // ✅ Applicant.convocatoriaId
      convocatoriaNombre: `${applicant.convocatoria.tipo} ${new Date(applicant.convocatoria.fechaInicio).getFullYear()}`,
      convocatoriaTipo: applicant.convocatoria.tipo,             // ✅ Application.tipo
      fechaInicio: applicant.convocatoria.fechaInicio,           // ✅ Application.fechaInicio
      fechaFin: applicant.convocatoria.fechaFin,                 // ✅ Application.fechaFin
      fechaPostulacion: applicant.fecha,                         // ✅ Applicant.fecha
      estado: applicant.estado,                                  // ✅ Applicant.estado (EstadoPostulacion)
      feedback: applicant.feedbackEvaluador || "No disponible", // ✅ Applicant.feedbackEvaluador
      feedbackIA: applicant.feedbackIA || "No disponible",      // ✅ Applicant.feedbackIA
      startupId: applicant.startupId,                            // ✅ Applicant.startupId
      startupNombre: applicant.startup.nombre,                   // ✅ Startup.nombre
      locked: applicant.locked                                   // ✅ Applicant.locked
    }));

    console.log("📋 GET User Applications - Lista formateada:", formattedApplications.map(app => ({ 
      id: app.id, 
      convocatoria: app.convocatoriaNombre,
      startup: app.startupNombre,
      estado: app.estado 
    })));

    return NextResponse.json({
      applications: formattedApplications,
      count: formattedApplications.length
    }, { status: 200 });

  } catch (error) {
    console.error("💥 Error en GET /api/users/applications:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}