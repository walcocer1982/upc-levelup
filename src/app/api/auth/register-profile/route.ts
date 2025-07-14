import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; 

export async function POST(request: NextRequest) {
  try {
    // Verificar que el usuario esté autenticado
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener datos del cuerpo de la petición
    const body = await request.json();
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
      return NextResponse.json(
        { error: "Nombres, apellidos y DNI son requeridos" },
        { status: 400 }
      );
    }

    if (!haAceptadoPolitica) {
      return NextResponse.json(
        { error: "Debe aceptar la política de privacidad" },
        { status: 400 }
      );
    }

    // Verificar si el DNI ya existe (para otro usuario)
    const existingUserWithDni = await prisma.user.findFirst({
      where: {
        dni: dni,
        email: { not: session.user.email },
      },
    });

    if (existingUserWithDni) {
      return NextResponse.json(
        { error: "El DNI ya está registrado por otro usuario" },
        { status: 409 }
      );
    }

    // Buscar el usuario actual
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar el perfil del usuario
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        nombres,
        apellidos,
        dni,
        telefono,
        correoLaureate,
        linkedin,
        biografia,
        haAceptadoPolitica,
        isRegistered: true, // Marcar como registrado
        updatedAt: new Date(),
      },
    });

    // Registrar el evento de registro completado
    await prisma.sessionLog.create({
      data: {
        userId: updatedUser.id,
        email: session.user.email,
        action: "profile_completed",
        provider: "internal",
      },
    });

    return NextResponse.json({
      message: "Perfil actualizado exitosamente",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        nombres: updatedUser.nombres,
        apellidos: updatedUser.apellidos,
        dni: updatedUser.dni,
        telefono: updatedUser.telefono,
        role: updatedUser.role,
        isRegistered: updatedUser.isRegistered,
      },
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar que el usuario esté autenticado
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

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
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: currentUser,
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
