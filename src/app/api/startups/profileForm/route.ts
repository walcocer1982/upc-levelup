import { NextRequest, NextResponse } from "next/server";
import { mockAuth } from "@/lib/mock-auth";
import { getMockData } from "@/data/mock";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/startups/profileForm iniciado (MOCK)");

    // Obtener startupId del query parameter
    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get('startupId');

    console.log("🔍 startupId extraído:", startupId);
    console.log("🔍 URL completa:", request.url);

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

    // Si hay startupId, buscar startup específica
    if (startupId) {
      console.log("🎯 Entrando en lógica para startup específica:", startupId);

      // Obtener startup específica del mock data
      const startup = getMockData.getStartupById(startupId);

      if (!startup) {
        return NextResponse.json({ error: "Startup no encontrada" }, { status: 404 });
      }

      const user = getMockData.getUserByEmail(session.user.email);

      if (!user || !user.dni) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
      }

      console.log("✅ Devolviendo startup específica:", startup.nombre);

      return NextResponse.json({
        startup: startup,
        isOwner: true,
        memberRole: "CEO/Fundador"
      });
    }

    // Si no hay startupId, es una nueva startup - devolver formulario vacío
    console.log("🔄 Entrando en lógica para nueva startup (sin startupId)");
    
    return NextResponse.json({
      startup: null,
      isOwner: false,
      memberRole: null
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
    console.log("🚀 POST /api/startups/profileForm iniciado (MOCK)");

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

    // Obtener startupId del query parameter para actualización
    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get('startupId');

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
        id: startupId || "startup-mock-" + Date.now(),
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
    console.error("💥 Error en POST /api/startups/profileForm (MOCK):", error);
    return NextResponse.json(
      { error: "Error interno del servidor (MOCK)" },
      { status: 500 }
    );
  }
}