import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST request iniciado");
    
    // Verificar que el usuario esté autenticado
    const session = await auth();
    console.log("📋 Session:", session);
    
    if (!session || !session.user || !session.user.email) {
      console.log("❌ No hay sesión válida");
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    console.log("✅ Usuario autenticado:", session.user.email);

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

    console.log("🔍 Verificando DNI duplicado...");
    // Verificar si el DNI ya existe (para otro usuario)
    const existingUserWithDni = await prisma.user.findFirst({
      where: {
        dni: dni,
        email: { not: session.user.email },
      },
    });

    if (existingUserWithDni) {
      console.log("❌ DNI duplicado para otro usuario");
      return NextResponse.json(
        { error: "El DNI ya está registrado por otro usuario" },
        { status: 409 }
      );
    }

    console.log("🔍 Buscando usuario actual...");
    // Buscar el usuario actual
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      console.log("❌ Usuario no encontrado en BD");
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    console.log("✅ Usuario encontrado:", currentUser.id);

    console.log("🔄 Actualizando perfil...");
    // Actualizar el perfil del usuario
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        nombres,
        apellidos,
        dni,
        telefono,
        correoLaureate: correoLaureate || null,
        linkedin,
        biografia,
        haAceptadoPolitica,
        isRegistered: true, // Marcar como registrado
      },
    });

    console.log("✅ Perfil actualizado exitosamente");

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
    console.error("💥 Error en POST /api/auth/register-profile:", error);
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
    console.log("🔍 GET request iniciado");
    
    // Verificar que el usuario esté autenticado
    const session = await auth();
    console.log("📋 Session:", session);
    
    if (!session || !session.user || !session.user.email) {
      console.log("❌ No hay sesión válida");
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    console.log("✅ Usuario autenticado:", session.user.email);

    console.log("🔍 Buscando usuario en BD...");
    // Buscar el usuario actual
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        nombres: true,
        apellidos: true,
        dni: true,
        telefono: true,
        correoLaureate: true,
        linkedin: true,
        biografia: true,
        role: true,
        haAceptadoPolitica: true,
        isRegistered: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!currentUser) {
      console.log("❌ Usuario no encontrado en BD");
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    console.log("✅ Usuario encontrado:", currentUser.id);

    return NextResponse.json({
      user: currentUser,
    });
  } catch (error) {
    console.error("💥 Error en GET /api/auth/register-profile:", error);
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