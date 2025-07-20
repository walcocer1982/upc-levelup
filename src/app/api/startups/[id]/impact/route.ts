import { NextRequest, NextResponse } from "next/server";
import { mockAuth } from "@/lib/mock-auth";
import { getMockData } from "@/data/mock";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 GET /api/startups/[id]/impact iniciado (MOCK)");

    const session = mockAuth.getSession();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const startupId = (await params).id;
    console.log("🎯 Buscando impact para startup:", startupId);

    // Verificar que el usuario existe en mock data
    const user = getMockData.getUserByEmail(session.user.email);

    if (!user || !user.dni) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Buscar la startup en mock data
    const startup = getMockData.getStartupById(startupId);

    if (!startup) {
      return NextResponse.json({ error: "Startup no encontrada" }, { status: 404 });
    }

    console.log("✅ Impact encontrado (MOCK):", startup.impact ? "Sí" : "No");

    return NextResponse.json({
      impact: startup.impact ? {
        // Criterio 1: Complejidad
        casoReal: startup.impact.casoReal || "",
        abordajeProblema: startup.impact.abordajeProblema || "",
        consecuenciasProblema: startup.impact.consecuencias || "",
        otrosAfectados: startup.impact.afectados || "",

        // Criterio 2: Mercado
        tamanoMercado: startup.impact.tamanoMercado || "",
        validacionClientes: startup.impact.potencialesClientes || "",
        disposicionPago: startup.impact.interesPagar || "",
        segmentoInteres: startup.impact.segmentoInteres || "",

        // Criterio 3: Escalabilidad
        estrategiaAdquisicion: startup.impact.estrategiaAdquisicion || "",
        costoAdquisicion: startup.impact.costoAdquisicion || "",
        facilidadExpansion: startup.impact.facilidadExpansion || "",
        estrategiasEscalabilidad: startup.impact.escalabilidad || "",

        // Criterio 4: Equipo
        trayectoriaEquipo: startup.impact.trayectoria || "",
        experienciaEquipo: startup.impact.experiencia || "",
        rolesEquipo: startup.impact.roles || "",
        superacionDesafios: startup.impact.desafios || "",
      } : null
    });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/[id]/impact (MOCK):", error);
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
    console.log("🚀 POST /api/startups/[id]/impact iniciado (MOCK)");

    const session = mockAuth.getSession();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const startupId = (await params).id;
    const body = await request.json();
    console.log("📝 Datos recibidos para startup:", startupId);

    // Verificar que el usuario existe en mock data
    const user = getMockData.getUserByEmail(session.user.email);

    if (!user || !user.dni) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Verificar que la startup existe
    const startup = getMockData.getStartupById(startupId);

    if (!startup) {
      return NextResponse.json({ error: "Startup no encontrada" }, { status: 404 });
    }

    // En modo mock, simplemente devolver éxito
    console.log("✅ Impact creado/actualizado (MOCK)");

    return NextResponse.json({
      message: "Impact creado/actualizado exitosamente (MOCK)",
      impact: {
        startupId: startupId,
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
        roles: body.rolesEquipo || "",
        desafios: body.superacionDesafios || "",
      }
    });

  } catch (error) {
    console.error("💥 Error en POST /api/startups/[id]/impact (MOCK):", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}