import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/startups/cards iniciado");
    
    // Verificar que el usuario esté autenticado
    const session = await auth();
    
    if (!session || !session.user || !session.user.email) {
      console.log("❌ No hay sesión válida");
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      console.log("❌ Usuario no encontrado");
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Si el usuario no tiene DNI, no puede tener startups
    if (!user.dni) {
      console.log("ℹ️ Usuario sin DNI, no puede tener startups");
      return NextResponse.json({
        startups: [],
        total: 0
      });
    }

    // Buscar los miembros del usuario (relación through DNI)
    const userMemberships = await prisma.member.findMany({
      where: { 
        dni: user.dni 
      },
      include: {
        startup: {
          include: {
            impact: true,
            metrics: true,
            members: {
              select: {
                nombres: true,
                apellidos: true,
                rol: true
              }
            }
          }
        }
      }
    });

    // Mapear las startups del usuario
    const startups = userMemberships.map(memberInfo => ({
      id: memberInfo.startup.id,
      nombre: memberInfo.startup.nombre,
      descripcion: memberInfo.startup.descripcion,
      categoria: memberInfo.startup.categoria,
      etapa: memberInfo.startup.etapa,
      origen: memberInfo.startup.origen,
      fechaFundacion: memberInfo.startup.fechaFundacion,
      paginaWeb: memberInfo.startup.paginaWeb,
      videoPitchUrl: memberInfo.startup.videoPitchUrl,
      razonSocial: memberInfo.startup.razonSocial,
      ruc: memberInfo.startup.ruc,
      userRole: memberInfo.rol,
      impact: memberInfo.startup.impact,
      metrics: memberInfo.startup.metrics,
      members: memberInfo.startup.members,
      membersCount: memberInfo.startup.members.length
    }));

    console.log(`✅ Se encontraron ${startups.length} startups para el usuario`);
    
    return NextResponse.json({
      startups: startups,
      total: startups.length
    });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/cards:", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}