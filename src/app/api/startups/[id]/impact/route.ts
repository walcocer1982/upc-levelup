import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 GET /api/startups/[id]/impact iniciado");

    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const startupId = (await params).id;
    console.log("🎯 Buscando impact para startup:", startupId);

    // Verificar que el usuario es miembro de la startup
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || !user.dni) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const memberCheck = await prisma.member.findFirst({
      where: {
        dni: user.dni,
        startupId: startupId
      }
    });

    if (!memberCheck) {
      return NextResponse.json({ error: "No tienes acceso a esta startup" }, { status: 403 });
    }

    // Buscar el impact de la startup
    const impact = await prisma.impact.findUnique({
      where: { startupId: startupId }
    });

    console.log("✅ Impact encontrado:", impact ? "Sí" : "No");

    return NextResponse.json({
      impact: impact ? {
        // Criterio 1: Complejidad
        casoReal: impact.casoReal,
        abordajeProblema: impact.abordajeProblema,
        consecuenciasProblema: impact.consecuencias,
        otrosAfectados: impact.afectados,

        // Criterio 2: Mercado
        tamanoMercado: impact.tamanoMercado,
        validacionClientes: impact.potencialesClientes,
        disposicionPago: impact.interesPagar,
        segmentoInteres: impact.segmentoInteres,

        // Criterio 3: Escalabilidad
        estrategiaAdquisicion: impact.estrategiaAdquisicion,
        costoAdquisicion: impact.costoAdquisicion,
        facilidadExpansion: impact.facilidadExpansion,
        estrategiasEscalabilidad: impact.escalabilidad,

        // Criterio 4: Equipo
        trayectoriaEquipo: impact.trayectoria,
        experienciaEquipo: impact.experiencia,
        rolesEquipo: impact.roles,
        superacionDesafios: impact.desafios,
      } : null
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🚀 POST /api/startups/[id]/impact iniciado");

    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const startupId = (await params).id;
    const body = await request.json();
    console.log("📝 Datos recibidos para startup:", startupId);

    // Verificar que el usuario es miembro de la startup
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || !user.dni) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const memberCheck = await prisma.member.findFirst({
      where: {
        dni: user.dni,
        startupId: startupId
      }
    });

    if (!memberCheck) {
      return NextResponse.json({ error: "No tienes acceso a esta startup" }, { status: 403 });
    }

    // Verificar que la startup existe
    const startup = await prisma.startup.findUnique({
      where: { id: startupId }
    });

    if (!startup) {
      return NextResponse.json({ error: "Startup no encontrada" }, { status: 404 });
    }

    // Preparar los datos para actualizar/crear
    const impactData = {
      // Criterio 1: Complejidad
      casoReal: body.casoReal || "",
      abordajeProblema: body.abordajeProblema || "",
      consecuencias: body.consecuenciasProblema || "",
      afectados: body.otrosAfectados || "",

      // Criterio 2: Mercado
      tamanoMercado: body.tamanoMercado || "",
      potencialesClientes: body.validacionClientes || "",
      interesPagar: body.disposicionPago || "",
      segmentoInteres: body.segmentoInteres || "",

      // Criterio 3: Escalabilidad
      estrategiaAdquisicion: body.estrategiaAdquisicion || "",
      costoAdquisicion: body.costoAdquisicion || "",
      facilidadExpansion: body.facilidadExpansion || "",
      escalabilidad: body.estrategiasEscalabilidad || "",

      // Criterio 4: Equipo
      trayectoria: body.trayectoriaEquipo || "",
      experiencia: body.experienciaEquipo || "",
      roles: body.rolesEquipo || "",  // 
      desafios: body.superacionDesafios || "",
    };

    let impact;

    // Buscar si ya existe un impact para esta startup
    const existingImpact = await prisma.impact.findUnique({
      where: { startupId: startupId }
    });

    if (existingImpact) {
      // Actualizar el impact existente
      impact = await prisma.impact.update({
        where: { startupId: startupId },
        data: impactData  // ✅ Sin startup.connect
      });
      console.log("✅ Impact actualizado exitosamente");
    } else {
      impact = await prisma.impact.create({
        data: {
          ...impactData,
          startupId: startupId  // ✅ Solo usar startupId
        }
      });
      console.log("✅ Impact creado exitosamente");
    }

    return NextResponse.json({
      message: existingImpact ? "Impact actualizado exitosamente" : "Impact creado exitosamente",
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