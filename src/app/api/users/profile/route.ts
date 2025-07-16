import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    // Verificar sesión
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    
    // Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
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
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    return NextResponse.json(user);
    
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return NextResponse.json({ error: "Error al obtener perfil" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}