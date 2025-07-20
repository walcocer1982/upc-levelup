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

    // Validaciones adicionales para campos requeridos
    if (!linkedin || !biografia) {
      console.log("❌ Faltan LinkedIn o biografía");
      return NextResponse.json(
        { error: "LinkedIn y biografía son requeridos" },
        { status: 400 }
      );
    }

    console.log("🔍 Verificando DNI duplicado (MOCK)...");
    // Verificar si el DNI ya existe (para otro usuario) en datos mock
    const allUsers = getMockData.getAllUsers();
    const existingUserWithDni = allUsers.find(user => 
      user.dni === dni && user.email !== session.user.email
    );

    if (existingUserWithDni) {
      console.log("❌ DNI duplicado para otro usuario (MOCK)");
      return NextResponse.json(
        { error: "El DNI ya está registrado por otro usuario" },
        { status: 409 }
      );
    }

    console.log("🔍 Buscando usuario actual (MOCK)...");
    // Buscar el usuario actual en datos mock
    const currentUser = getMockData.getUserByEmail(session.user.email);

    if (!currentUser) {
      console.log("❌ Usuario no encontrado en BD (MOCK)");
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    console.log("✅ Usuario encontrado (MOCK):", currentUser.id);

    console.log("🔄 Actualizando perfil (MOCK)...");
    // Simular actualización del perfil del usuario
    const updatedUser = {
      ...currentUser,
        nombres,
        apellidos,
        dni,
        telefono,
        correoLaureate: correoLaureate || null,
        linkedin,
        biografia,
        haAceptadoPolitica,
        isRegistered: true, // Marcar como registrado
      updatedAt: new Date(),
    };

    console.log("✅ Perfil actualizado exitosamente (MOCK)");

    return NextResponse.json({
      message: "Perfil actualizado exitosamente",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        nombres: updatedUser.nombres,
        apellidos: updatedUser.apellidos,
        dni: updatedUser.dni,
        telefono: updatedUser.telefono,
        correoLaureate: updatedUser.correoLaureate,
        linkedin: updatedUser.linkedin,
        biografia: updatedUser.biografia,
        role: updatedUser.role,
        isRegistered: updatedUser.isRegistered,
      },
    });
  } catch (error) {
    console.error("💥 Error en POST /api/auth/register-profile (MOCK):", error);
    console.error("Stack trace:", error.stack);
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

    console.log("🔍 Buscando usuario en BD (MOCK)...");
    // Buscar el usuario actual en datos mock
    const currentUser = getMockData.getUserByEmail(session.user.email);

    if (!currentUser) {
      console.log("❌ Usuario no encontrado en BD (MOCK)");
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    console.log("✅ Usuario encontrado (MOCK):", currentUser.id);

    return NextResponse.json({
      user: currentUser,
    });
  } catch (error) {
    console.error("💥 Error en GET /api/auth/register-profile (MOCK):", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}