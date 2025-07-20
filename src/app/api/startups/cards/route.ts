import { NextRequest, NextResponse } from "next/server";
import { getMockData } from "@/data/mock";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/startups/cards iniciado (MOCK)");
    
    // Obtener todas las startups del mock data
    const startups = getMockData.getAllStartups();
    
    // Mapear las startups para el formato esperado
    const startupsCards = startups.map(startup => ({
      id: startup.id,
      nombre: startup.nombre,
      descripcion: startup.descripcion,
      categoria: startup.categoria,
      etapa: startup.etapa,
      origen: startup.origen,
      fechaFundacion: startup.fechaFundacion,
      paginaWeb: startup.paginaWeb,
      videoPitchUrl: startup.videoPitchUrl,
      razonSocial: startup.razonSocial,
      ruc: startup.ruc,
      userRole: 'Fundador', // Rol por defecto
      impact: {
        impactoSocial: startup.impactoSocial,
        impactoAmbiental: startup.impactoAmbiental,
        impactoEconomico: startup.impactoEconomico
      },
      metrics: {
        ingresosAnuales: startup.ingresosAnuales,
        empleados: startup.empleados,
        clientes: startup.clientes
      },
      members: [
        {
          nombres: 'Fundador',
          apellidos: 'Principal',
          rol: 'Fundador'
        }
      ],
      membersCount: 1
    }));

    console.log(`✅ Se encontraron ${startupsCards.length} startups (MOCK)`);
    
    return NextResponse.json({
      startups: startupsCards,
      total: startupsCards.length
    });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/cards (MOCK):", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}