import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // Verificar sesión
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que sea admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // Obtener todas las startups con información de miembros
    const startups = await prisma.startup.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Formatear datos para el frontend
    const formattedStartups = startups.map(startup => {
      // Encontrar el fundador (primer miembro o el que tenga rol fundador)
      const founder = startup.members.find(member => 
        member.rol === 'FUNDADOR' || member.rol === 'fundador'
      ) || startup.members[0];

      // Contar evaluaciones (esto requeriría una relación con evaluaciones)
      const evaluaciones = 0; // Por ahora 0, se puede implementar después
      const puntuacionPromedio = 0; // Por ahora 0

      return {
        id: startup.id,
        nombre: startup.nombre,
        descripcion: startup.descripcion,
        categoria: startup.categoria,
        estado: startup.estado || 'activa',
        fechaCreacion: startup.fechaFundacion.toISOString().split('T')[0],
        propietario: {
          nombre: founder ? `${founder.user.nombres} ${founder.user.apellidos}` : 'Sin propietario',
          email: founder ? founder.user.email : 'sin-email@ejemplo.com'
        },
        evaluaciones,
        puntuacionPromedio
      };
    });

    console.log(`✅ GET Admin Startups - ${formattedStartups.length} startups encontradas`);

    return NextResponse.json({
      startups: formattedStartups
    });

  } catch (error) {
    console.error("Error obteniendo startups:", error);
    return NextResponse.json({ error: "Error al obtener startups" }, { status: 500 });
  }
} 