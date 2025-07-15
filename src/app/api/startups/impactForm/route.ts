import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🔍 GET /api/startups/[id]/impact iniciado");
    
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const startupId = params.id;

    // Verificar que la startup existe y el usuario tiene acceso
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: {
        members: {
          where: {
            email: session.user.email
          }
        },
        impact: true
      }
    });

    if (!startup) {
      return NextResponse.json({ error: "Startup no encontrada" }, { status: 404 });
    }

    if (startup.members.length === 0) {
      return NextResponse.json({ error: "No tienes acceso a esta startup" }, { status: 403 });
    }

    // Retornar los datos de impacto si existen
    return NextResponse.json({
      impact: startup.impact || null
    });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/[id]/impact:", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🚀 POST /api/startups/[id]/impact iniciado");
    
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const startupId = params.id;
    const body = await request.json();

    // Verificar que la startup existe y el usuario tiene acceso
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: {
        members: {
          where: {
            email: session.user.email
          }
        },
        impact: true
      }
    });

    if (!startup) {
      return NextResponse.json({ error: "Startup no encontrada" }, { status: 404 });
    }

    if (startup.members.length === 0) {
      return NextResponse.json({ error: "No tienes acceso a esta startup" }, { status: 403 });
    }

    // Preparar los datos para actualizar/crear
    const impactData = {
      // Criterio 1: Complejidad
      casoReal: body.casoReal || null,
      abordajeAnterior: body.abordajeAnterior || null,
      consecuenciasProblema: body.consecuenciasProblema || null,
      otrosAfectados: body.otrosAfectados || null,
      
      // Criterio 2: Mercado
      tamanoMercado: body.tamanoMercado || null,
      validacionClientes: body.validacionClientes || null,
      disposicionPago: body.disposicionPago || null,
      segmentoInteres: body.segmentoInteres || null,
      
      // Criterio 3: Escalabilidad
      estrategiaAdquisicion: body.estrategiaAdquisicion || null,
      costoAdquisicion: body.costoAdquisicion || null,
      facilidadExpansion: body.facilidadExpansion || null,
      estrategiasEscalabilidad: body.estrategiasEscalabilidad || null,
      
      // Criterio 4: Equipo
      trayectoriaEquipo: body.trayectoriaEquipo || null,
      experienciaEquipo: body.experienciaEquipo || null,
      rolesEquipo: body.rolesEquipo || null,
      superacionDesafios: body.superacionDesafios || null,
    };

    let impact;

    if (startup.impact) {
      // Actualizar el impact existente
      impact = await prisma.impact.update({
        where: { startupId: startupId },
        data: impactData
      });
      console.log("✅ Impact actualizado exitosamente");
    } else {
      // Crear nuevo impact
      impact = await prisma.impact.create({
        data: {
          ...impactData,
          startupId: startupId
        }
      });
      console.log("✅ Impact creado exitosamente");
    }

    return NextResponse.json({
      message: startup.impact ? "Impact actualizado exitosamente" : "Impact creado exitosamente",
      impact: impact
    });

  } catch (error) {
    console.error("💥 Error en POST /api/startups/[id]/impact:", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}