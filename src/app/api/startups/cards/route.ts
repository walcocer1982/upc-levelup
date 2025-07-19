import { NextRequest, NextResponse } from "next/server";
import { mockAuth } from "@/lib/mock-auth";
import { getMockData } from "@/data/mock";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/startups/cards iniciado (MOCK)");
    
    // Verificar que el usuario esté autenticado (mock)
    const session = mockAuth.getSession();
    
    if (!session || !session.user || !session.user.email) {
      console.log("❌ No hay sesión válida (MOCK)");
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Buscar el usuario en los datos mock
    const user = getMockData.getUserByEmail(session.user.email);

    if (!user) {
      console.log("❌ Usuario no encontrado (MOCK)");
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Si el usuario no tiene DNI, no puede tener startups
    if (!user.dni) {
      console.log("ℹ️ Usuario sin DNI, no puede tener startups (MOCK)");
      return NextResponse.json({
        startups: [],
        total: 0
      });
    }

    // Buscar los miembros del usuario (relación through DNI)
    const allMembers = getMockData.getAllMembers();
    const userMemberships = allMembers.filter(member => member.dni === user.dni);

    // Obtener las startups asociadas al usuario
    const userStartups = userMemberships.map(membership => {
      const startup = getMockData.getStartupById(membership.startupId);
      if (startup) {
        const impact = getMockData.getImpactByStartup(startup.id);
        const metrics = getMockData.getMetricsByStartup(startup.id);
        const members = getMockData.getMembersByStartup(startup.id);
        
        return {
          ...startup,
          impact,
          metrics,
          members: members.map(member => ({
            nombres: member.nombres,
            apellidos: member.apellidos,
            rol: member.rol
          }))
        };
      }
      return null;
    }).filter(Boolean);

    console.log(`✅ ${userStartups.length} startups encontradas para el usuario (MOCK)`);

    return NextResponse.json({
      startups: userStartups,
      total: userStartups.length
    });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/cards (MOCK):", error);
    return NextResponse.json(
      { error: "Error interno del servidor (MOCK)" },
      { status: 500 }
    );
  }
}