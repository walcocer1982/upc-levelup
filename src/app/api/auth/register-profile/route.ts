import { NextRequest, NextResponse } from "next/server";
import { mockAuth } from "@/lib/mock-auth";
import { mockUsers } from "@/data/mock";

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/auth/register-profile iniciado (MOCK)");
    
    const body = await request.json();
    const { 
      nombres, 
      apellidos, 
      dni, 
      telefono, 
      correoLaureate, 
      linkedin, 
      biografia,
      haAceptadoPolitica 
    } = body;

    // Validaciones básicas
    if (!nombres || !apellidos || !dni || !telefono) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    if (!haAceptadoPolitica) {
      return NextResponse.json(
        { error: "Debe aceptar la política de privacidad" },
        { status: 400 }
      );
    }

    // Verificar sesión mock
    const session = mockAuth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    console.log("📋 Usuario en sesión:", session.user.email);

    // Buscar usuario existente
    const allUsers = mockUsers;
    const existingUser = allUsers.find(user => user.email === session.user.email);
    
    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar información del usuario
    const updatedUser = {
      ...existingUser,
      nombres,
      apellidos,
      dni,
      telefono,
      correoLaureate,
      linkedin,
      biografia,
      haAceptadoPolitica,
      isRegistered: true,
      updatedAt: new Date()
    };

    console.log("✅ Perfil actualizado (MOCK):", {
      id: updatedUser.id,
      email: updatedUser.email,
      nombres: updatedUser.nombres,
      isRegistered: updatedUser.isRegistered
    });

    // En un sistema real, aquí se guardaría en la base de datos
    // Por ahora, solo simulamos la actualización

    return NextResponse.json({
      success: true,
      message: "Perfil registrado exitosamente",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        nombres: updatedUser.nombres,
        apellidos: updatedUser.apellidos,
        role: updatedUser.role,
        isRegistered: updatedUser.isRegistered,
        haAceptadoPolitica: updatedUser.haAceptadoPolitica
      }
    });

  } catch (error) {
    console.error("💥 Error en POST /api/auth/register-profile (MOCK):", error);
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
    console.log("🔍 GET /api/auth/register-profile iniciado (MOCK)");
    
    // Verificar sesión mock
    const session = mockAuth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Buscar usuario actual
    const currentUser = mockUsers.find(user => user.email === session.user.email);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: currentUser.id,
        email: currentUser.email,
        nombres: currentUser.nombres,
        apellidos: currentUser.apellidos,
        dni: currentUser.dni,
        telefono: currentUser.telefono,
        correoLaureate: currentUser.correoLaureate,
        linkedin: currentUser.linkedin,
        biografia: currentUser.biografia,
        role: currentUser.role,
        isRegistered: currentUser.isRegistered,
        haAceptadoPolitica: currentUser.haAceptadoPolitica
      }
    });

  } catch (error) {
    console.error("💥 Error en GET /api/auth/register-profile (MOCK):", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}