import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Verificar que el usuario sea admin
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { email, role } = await req.json();
    
    if (!email || !role) {
      return NextResponse.json({ error: "Email y rol son requeridos" }, { status: 400 });
    }

    // Validar que el rol sea válido
    if (!['admin', 'usuario'].includes(role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }

    // Actualizar rol del usuario
    const result = await prisma.user.updateMany({
      where: { email },
      data: { role }
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Usuario ${email} actualizado a ${role}`
    });

  } catch (error) {
    console.error("Error actualizando rol:", error);
    return NextResponse.json({ error: "Error al actualizar rol" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    // Verificar que el usuario sea admin
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nombres: true,
        apellidos: true,
        role: true,
        isRegistered: true,
        haAceptadoPolitica: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 