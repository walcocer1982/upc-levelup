import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    // Verificar sesión
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    
    // Buscar usuario usando Prisma directamente
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    // Seleccionar solo los campos necesarios
    const userProfile = {
      id: user.id,
      email: user.email,
      nombres: user.nombres,
      apellidos: user.apellidos,
      dni: user.dni,
      telefono: user.telefono,
      correoLaureate: user.correoLaureate,
      linkedin: user.linkedin,
      biografia: user.biografia,
      role: user.role,
      haAceptadoPolitica: user.haAceptadoPolitica,
      isRegistered: user.isRegistered,
    };
    
    return NextResponse.json(userProfile);
    
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return NextResponse.json({ error: "Error al obtener perfil" }, { status: 500 });
  }
}