import { NextRequest, NextResponse } from "next/server";
import { mockAuth } from "@/lib/mock-auth";
import { getMockData } from "@/data/mock";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/startups/profile iniciado (MOCK)");
    
    // Verificar que el usuario esté autenticado (mock)
    const session = mockAuth.getSession();
    console.log("📋 Session (MOCK):", session);
    
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

    // Buscar startups donde el usuario es CEO/Fundador
    const allStartups = getMockData.getAllStartups();
    const userStartups = allStartups.filter(startup => startup.founderId === user.id);

    // Si el usuario es CEO/Fundador de alguna startup, devolver la más reciente
    if (userStartups.length > 0) {
      const startupData = userStartups[0];
      console.log("✅ Startup encontrada (MOCK):", startupData.nombre);
      
      return NextResponse.json({
        startup: startupData,
        isOwner: true,
        memberRole: "CEO/Fundador"
      });
    }

    // Si no tiene startup como CEO/Fundador
    console.log("ℹ️ Usuario no tiene startup como CEO/Fundador (MOCK)");
    return NextResponse.json({
      startup: null,
      isOwner: false,
      memberRole: null
    });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/profile (MOCK):", error);
    return NextResponse.json(
      { error: "Error interno del servidor (MOCK)" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 POST /api/startups/profile iniciado (MOCK)");
    
    // Verificar que el usuario esté autenticado (mock)
    const session = mockAuth.getSession();
    console.log("📋 Session (MOCK):", session);
    
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

    if (!user.dni) {
      console.log("❌ Usuario no tiene DNI registrado (MOCK)");
      return NextResponse.json(
        { error: "Debe completar su perfil de usuario primero" },
        { status: 400 }
      );
    }

    // Parsear los datos del request
    const body = await request.json();
    console.log("📝 Datos recibidos:", body);

    // Validar campos requeridos
    const requiredFields = ['nombre', 'fechaFundacion', 'categoria', 'descripcion', 'etapa', 'origen'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.log("❌ Campos requeridos faltantes:", missingFields);
      return NextResponse.json(
        { error: `Campos requeridos: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // En modo mock, simplemente devolver éxito
    console.log("✅ Startup creada/actualizada (MOCK)");

    return NextResponse.json({
      success: true,
      message: "Startup creada/actualizada correctamente (MOCK)",
      startup: {
        id: "startup-mock-" + Date.now(),
        nombre: body.nombre,
        fechaFundacion: new Date(body.fechaFundacion),
        categoria: body.categoria,
        descripcion: body.descripcion,
        etapa: body.etapa,
        origen: body.origen,
        founderId: user.id,
        estado: "activa",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

  } catch (error) {
    console.error("💥 Error en POST /api/startups/profile (MOCK):", error);
    return NextResponse.json(
      { error: "Error interno del servidor (MOCK)" },
      { status: 500 }
    );
  }
}