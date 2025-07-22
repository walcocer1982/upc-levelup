import { NextRequest, NextResponse } from "next/server";
import { mockUsers, mockDb } from "@/data/mock";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/startups/profileForm iniciado (MOCK)");
    
    // Obtener el startupId de los parámetros de la URL
    const url = new URL(request.url);
    const startupId = url.searchParams.get('startupId');
    
    if (!startupId) {
      return NextResponse.json(
        { error: "startupId es requerido" },
        { status: 400 }
      );
    }

    console.log("📋 Buscando startup:", startupId);

    // Simular verificación de autenticación
    const user = mockUsers.find(u => u.email === 'walcocer.1982@gmail.com'); // Usuario mock por defecto
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no autorizado" },
        { status: 401 }
      );
    }

    // Buscar la startup
    const startup = mockDb.getAllStartups().find(s => s.id === startupId);
    
    if (!startup) {
      return NextResponse.json(
        { error: "Startup no encontrada" },
        { status: 404 }
      );
    }

    console.log("✅ Startup encontrada:", startup.nombre);

    // Devolver formulario de la startup
    return NextResponse.json({
      startup: {
        id: startup.id,
        nombre: startup.nombre,
        descripcion: startup.descripcion,
        categoria: startup.categoria,
        sector: startup.sector,
        estado: startup.estado,
        website: startup.website,
        linkedin: startup.linkedin,
        pitchDeck: startup.pitchDeck,
        logo: startup.logo,
        fechaFundacion: startup.fechaFundacion,
        ubicacion: startup.ubicacion,
        mercadoObjetivo: startup.mercadoObjetivo,
        modeloNegocio: startup.modeloNegocio,
        traccion: startup.traccion,
        financiamiento: startup.financiamiento,
        desafios: startup.desafios,
        proximosPasos: startup.proximosPasos
      }
    });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/profileForm (MOCK):", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/startups/profileForm iniciado (MOCK)");
    
    const body = await request.json();
    const { startupId, ...formData } = body;

    if (!startupId) {
      return NextResponse.json(
        { error: "startupId es requerido" },
        { status: 400 }
      );
    }

    // Simular verificación de autenticación
    const user = mockUsers.find(u => u.email === 'walcocer.1982@gmail.com'); // Usuario mock por defecto
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no autorizado" },
        { status: 401 }
      );
    }

    // Buscar la startup
    const startup = mockDb.getAllStartups().find(s => s.id === startupId);
    
    if (!startup) {
      return NextResponse.json(
        { error: "Startup no encontrada" },
        { status: 404 }
      );
    }

    console.log("✅ Startup encontrada para actualizar:", startup.nombre);

    // Simular actualización del formulario
    const updatedStartup = {
      ...startup,
      ...formData,
      updatedAt: new Date()
    };

    console.log("✅ Formulario de startup actualizado (MOCK)");

    return NextResponse.json({
      success: true,
      message: "Formulario actualizado exitosamente",
      startup: updatedStartup
    });

  } catch (error) {
    console.error("💥 Error en POST /api/startups/profileForm (MOCK):", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}