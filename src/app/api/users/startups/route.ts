import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    console.log("🔐 GET User Startups - Sesión verificada:", session?.user?.email);

    if (!session || !session.user?.email) {
      console.log("❌ GET User Startups - No autorizado - Sin sesión");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener el usuario actual
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || !user.dni) {
      console.log("❌ GET User Startups - Usuario no encontrado o sin DNI");
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    console.log("🔍 GET User Startups - Buscando startups para DNI:", user.dni);

    // Obtener las startups donde el usuario es miembro
    const userStartups = await prisma.member.findMany({
      where: {
        dni: user.dni
      },
      include: {
        startup: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            etapa: true,
            categoria: true
          }
        }
      }
    });

    console.log("✅ GET User Startups - Startups encontradas:", userStartups.length);

    // Formatear la respuesta
    const startups = userStartups.map(member => ({
      id: member.startup.id,
      nombre: member.startup.nombre,
      descripcion: member.startup.descripcion,
      etapa: member.startup.etapa,
      categoria: member.startup.categoria,
      rol: member.rol
    }));

    console.log("📋 GET User Startups - Lista formateada:", startups.map(s => ({ id: s.id, nombre: s.nombre })));

    return NextResponse.json({
      startups: startups,
      count: startups.length
    }, { status: 200 });

  } catch (error) {
    console.error("💥 Error en GET /api/users/startups:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}