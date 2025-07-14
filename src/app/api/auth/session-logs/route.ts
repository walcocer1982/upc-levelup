import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/auth";

const prisma = new PrismaClient();

// Registrar evento de sesión (login/logout)
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, email, action, provider } = data;

    if (!email || !action || !provider) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    // Buscar usuario por email si no se proporciona userId
    let finalUserId = userId;
    if (!finalUserId && email) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      
      if (user) {
        finalUserId = user.id;
      } else {
        // Si es una acción de login y el usuario no existe, crearlo
        if (action === "login" || action === "signup") {
          const newUser = await prisma.user.create({
            data: {
              email,
              role: email === "m.limaco0191@gmail.com" ? "admin" : "usuario",
              isRegistered: false,
            },
          });
          finalUserId = newUser.id;
        } else {
          finalUserId = "unknown";
        }
      }
    }

    // Registrar el evento de sesión
    const sessionLog = await prisma.sessionLog.create({
      data: {
        userId: finalUserId,
        email,
        action,
        provider,
      },
    });

    return NextResponse.json(
      { success: true, sessionLog },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registrando evento de sesión:", error);
    return NextResponse.json(
      { error: "Error al registrar evento de sesión" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Obtener logs de sesión de un usuario
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    // Solo administradores pueden ver logs de sesión
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado para ver logs de sesión" },
        { status: 403 }
      );
    }
    
    // Obtener parámetros de consulta
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    
    // Construir la consulta
    const whereClause: any = {};
    if (email) whereClause.email = email;
    
    const logs = await prisma.sessionLog.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          select: {
            email: true,
            nombres: true,
            apellidos: true,
            role: true,
          },
        },
      },
    });
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error obteniendo logs de sesión:", error);
    return NextResponse.json(
      { error: "Error al obtener logs de sesión" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}