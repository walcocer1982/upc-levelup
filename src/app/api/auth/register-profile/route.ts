import { NextRequest, NextResponse } from "next/server";
import { mockAuth } from "@/lib/mock-auth";
import { getMockData } from "@/data/mock";

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST request iniciado (MOCK)");
    
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

    console.log("✅ Usuario autenticado (MOCK):", session.user.email);

    // Obtener datos del cuerpo de la petición
    const body = await request.json();
    console.log("📝 Datos recibidos:", body);
    
    const {
      nombres,
      apellidos,
      dni,
      telefono,
      correoLaureate,
      linkedin,
      biografia,
      haAceptadoPolitica,
    } = body;

    // Validaciones básicas
    if (!nombres || !apellidos || !dni) {
      console.log("❌ Faltan campos requeridos");
      return NextResponse.json(
        { error: "Nombres, apellidos y DNI son requeridos" },
        { status: 400 }
      );
    }

    if (!haAceptadoPolitica) {
      console.log("❌ No aceptó política de privacidad");
      return NextResponse.json(
        { error: "Debe aceptar la política de privacidad" },
        { status: 400 }
      );
    }

    // En modo mock, simplemente devolver éxito
    console.log("✅ Perfil actualizado (MOCK)");

    return NextResponse.json({
      success: true,
      message: "Perfil actualizado correctamente (MOCK)",
      user: {
        ...session.user,
        nombres,
        apellidos,
        dni,
        telefono,
        correoLaureate,
        linkedin,
        biografia,
        haAceptadoPolitica,
        isRegistered: true,
      }
    });

  } catch (error) {
    console.error("💥 Error en POST /api/auth/register-profile (MOCK):", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor (MOCK)",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET request iniciado (MOCK)");
    
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

    console.log("✅ Usuario autenticado (MOCK):", session.user.email);

    // Buscar el usuario en los datos mock
    const mockUser = getMockData.getUserByEmail(session.user.email);
    
    if (!mockUser) {
      console.log("❌ Usuario no encontrado en datos mock");
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    console.log("✅ Usuario encontrado (MOCK):", mockUser.id);

    return NextResponse.json({
      user: {
        id: mockUser.id,
        email: mockUser.email,
        nombres: mockUser.nombres,
        apellidos: mockUser.apellidos,
        dni: mockUser.dni,
        telefono: mockUser.telefono,
        correoLaureate: mockUser.correoLaureate,
        linkedin: mockUser.linkedin,
        biografia: mockUser.biografia,
        role: mockUser.role,
        haAceptadoPolitica: mockUser.haAceptadoPolitica,
        isRegistered: mockUser.isRegistered,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("💥 Error en GET /api/auth/register-profile (MOCK):", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor (MOCK)",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}