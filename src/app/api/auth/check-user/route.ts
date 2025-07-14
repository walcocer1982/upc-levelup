import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    // Verificar si hay sesión activa
    if (!session || !session.user?.email) {
      return NextResponse.json({ isRegistered: false, error: "No hay sesión activa" }, { status: 401 });
    }
    
    // Buscar si el usuario ya existe en la base de datos
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    
    // Determinar si el usuario está registrado completamente
    const isRegistered = !!user && user.isRegistered;
    const role = user?.role || "usuario";
    
    return NextResponse.json({
      isRegistered,
      role,
      userId: user?.id || null,
    });
    
  } catch (error) {
    console.error("Error verificando usuario:", error);
    return NextResponse.json({ error: "Error al verificar usuario" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}