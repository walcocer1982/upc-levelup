import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TipoConvocatoria } from "@/generated/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    console.log("🔐 POST Applications - Sesión verificada:", session?.user?.email);

    if (!session || !session.user?.email) {
      console.log("❌ POST Applications - No autorizado - Sin sesión");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    console.log("📝 POST Applications - Datos recibidos:", JSON.stringify(body, null, 2));

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      console.log("❌ POST Applications - Usuario no encontrado");
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Validar que el tipo de convocatoria sea válido
    if (!Object.values(TipoConvocatoria).includes(body.tipo)) {
      console.log("❌ POST Applications - Tipo de convocatoria inválido:", body.tipo);
      return NextResponse.json({ 
        error: "Tipo de convocatoria inválido. Debe ser 'Inqubalab' o 'Aceleracion'" 
      }, { status: 400 });
    }

    // Validar fechas
    const fechaInicio = new Date(body.fechaInicio);
    const fechaFin = new Date(body.fechaFin);

    if (fechaInicio >= fechaFin) {
      console.log("❌ POST Applications - Fechas inválidas");
      return NextResponse.json({ 
        error: "La fecha de inicio debe ser anterior a la fecha de fin" 
      }, { status: 400 });
    }

    // Crear la convocatoria
    const applicationData = {
      tipo: body.tipo as TipoConvocatoria,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      creadoPorId: user.id
    };

    console.log("📝 POST Applications - Datos preparados:", JSON.stringify(applicationData, null, 2));

    const newApplication = await prisma.application.create({
      data: applicationData,
      include: {
        creadoPor: {
          select: {
            id: true,
            email: true,
            nombres: true,
            apellidos: true
          }
        }
      }
    });

    console.log("✅ POST Applications - Convocatoria creada exitosamente:", newApplication.id);

    return NextResponse.json({
      message: "Convocatoria creada exitosamente",
      application: {
        id: newApplication.id,
        tipo: newApplication.tipo,
        fechaInicio: newApplication.fechaInicio,
        fechaFin: newApplication.fechaFin,
        creadoPor: newApplication.creadoPor
      }
    }, { status: 201 });

  } catch (error) {
    console.error("💥 Error en POST /api/applications:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    console.log("🔐 GET Applications - Sesión verificada:", session?.user?.email);

    if (!session || !session.user?.email) {
      console.log("❌ GET Applications - No autorizado - Sin sesión");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("🔍 GET Applications - Obteniendo convocatorias activas");

    // Obtener convocatorias activas (fecha actual entre fechaInicio y fechaFin)
    const now = new Date();
    const applications = await prisma.application.findMany({
      where: {
        fechaInicio: {
          lte: now
        },
        fechaFin: {
          gte: now
        }
      },
      include: {
        creadoPor: {
          select: {
            nombres: true,
            apellidos: true
          }
        },
        _count: {
          select: {
            postulaciones: true
          }
        }
      },
      orderBy: {
        fechaFin: 'asc'
      }
    });

    console.log("✅ GET Applications - Convocatorias encontradas:", applications.length);

    const formattedApplications = applications.map(app => ({
      id: app.id,
      tipo: app.tipo,
      fechaInicio: app.fechaInicio,
      fechaFin: app.fechaFin,
      creadoPor: `${app.creadoPor.nombres} ${app.creadoPor.apellidos}`,
      postulaciones: app._count.postulaciones
    }));

    return NextResponse.json({
      applications: formattedApplications,
      count: formattedApplications.length
    }, { status: 200 });

  } catch (error) {
    console.error("💥 Error en GET /api/applications:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}