import { NextRequest, NextResponse } from "next/server";
import { PrismaRepository } from "@/data/database/repository-prisma";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Verificar sesión
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    
    // Obtener datos del cuerpo de la solicitud
    const profileData = await req.json();
    
    // Verificar datos requeridos
    if (!profileData.nombres || !profileData.apellidos || !profileData.dni || !profileData.telefono) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }
    
    // Buscar si el usuario ya existe usando PrismaRepository
    let user = await PrismaRepository.getUserByEmail(session.user.email);
    
    let result;
    
    if (user) {
      // Actualizar usuario existente usando PrismaRepository
      result = await PrismaRepository.updateUserByEmail(session.user.email, {
        nombres: profileData.nombres,
        apellidos: profileData.apellidos,
        dni: profileData.dni,
        telefono: profileData.telefono,
        correoLaureate: profileData.correoLaureate,
        linkedin: profileData.linkedin,
        biografia: profileData.biografia,
        haAceptadoPolitica: profileData.haAceptadoPolitica || false,
        isRegistered: true, // Marcar como registrado
      });
    } else {
      // Crear nuevo usuario usando PrismaRepository
      result = await PrismaRepository.createUser({
        email: session.user.email,
        nombres: profileData.nombres,
        apellidos: profileData.apellidos,
        dni: profileData.dni,
        telefono: profileData.telefono,
        correoLaureate: profileData.correoLaureate,
        linkedin: profileData.linkedin,
        biografia: profileData.biografia,
        haAceptadoPolitica: profileData.haAceptadoPolitica || false,
        role: session.user.email === "m.limaco0191@gmail.com" ? "admin" : "usuario",
        isRegistered: true,
      });
    }
    
    // Registrar la acción en SessionLog
    await prisma.sessionLog.create({
      data: {
        userId: result.id,
        email: session.user.email,
        action: user ? "profile_update" : "registration",
        provider: "form",
      }
    });
    
    return NextResponse.json({
      success: true,
      user: {
        id: result.id,
        isRegistered: result.isRegistered,
        role: result.role,
      }
    });
    
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}