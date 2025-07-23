import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log("🔐 GET User Startups - Iniciando...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ GET User Startups - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    console.log("🔐 GET User Startups - Sesión verificada:", session?.user?.email);

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, dni: true, nombres: true, apellidos: true }
    });

    if (!user) {
      console.log("❌ GET User Startups - Usuario no encontrado");
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    console.log("🔍 GET User Startups - Usuario encontrado:", session.user.email, "DNI:", user.dni || "undefined");

    // Si el usuario no tiene DNI, retornar lista vacía
    if (!user.dni) {
      console.log("⚠️ GET User Startups - Usuario sin DNI, retornando lista vacía");
      return NextResponse.json({ startups: [] });
    }

    // Buscar startups donde el usuario es miembro (usando dni)
    const userStartups = await prisma.member.findMany({
      where: { dni: user.dni },
      include: {
        startup: {
          select: {
            id: true,
            nombre: true,
            categoria: true,
            etapa: true,
            descripcion: true,
            fechaFundacion: true,
            paginaWeb: true,
            videoPitchUrl: true
          }
        }
      }
    });

    console.log("✅ GET User Startups - Startups encontradas:", userStartups.length);

    // Verificar el estado de impacto para cada startup
    const startupsWithImpact = await Promise.all(
      userStartups.map(async (member) => {
        // Obtener respuestas de impacto para esta startup
        const impactResponses = await prisma.impactResponse.findMany({
          where: { startupId: member.startup.id }
        });

        // Verificar si el impacto está completo (16 respuestas)
        const impactoCompleto = impactResponses.length >= 16;
        const respuestasCompletadas = impactResponses.length;
        const totalRespuestas = 16;

        return {
          id: member.startup.id,
          nombre: member.startup.nombre,
          categoria: member.startup.categoria,
          etapa: member.startup.etapa,
          descripcion: member.startup.descripcion,
          fechaFundacion: member.startup.fechaFundacion,
          paginaWeb: member.startup.paginaWeb,
          videoPitchUrl: member.startup.videoPitchUrl,
          rol: member.rol,
          aceptado: member.aceptado,
          memberId: member.id,
          // Información de impacto
          impactoCompleto,
          respuestasCompletadas,
          totalRespuestas
        };
      })
    );

    console.log("📋 GET User Startups - Lista formateada con impacto:", startupsWithImpact.map(s => ({ 
      id: s.id, 
      nombre: s.nombre, 
      impactoCompleto: s.impactoCompleto,
      respuestasCompletadas: s.respuestasCompletadas 
    })));

    return NextResponse.json({ startups: startupsWithImpact });

  } catch (error) {
    console.error("💥 Error en GET /api/users/startups:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 POST User Startups - Iniciando...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ POST User Startups - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { startupId, rol } = body;

    if (!startupId || !rol) {
      return NextResponse.json(
        { error: 'startupId y rol son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, dni: true, nombres: true, apellidos: true }
    });

    if (!user || !user.dni) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar que la startup existe
    const startup = await prisma.startup.findUnique({
      where: { id: startupId }
    });

    if (!startup) {
      return NextResponse.json({ error: 'Startup no encontrada' }, { status: 404 });
    }

    // Verificar que no sea ya miembro
    const existingMember = await prisma.member.findUnique({
      where: {
        dni_startupId: {
          dni: user.dni,
          startupId: startupId
        }
      }
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'Ya eres miembro de esta startup' },
        { status: 400 }
      );
    }

    // Crear nuevo miembro
    const newMember = await prisma.member.create({
      data: {
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        dni: user.dni,
        email: session.user.email,
        telefono: '',
        rol: rol,
        startupId: startupId,
        aceptado: true // Auto-aceptado para el creador
      },
      include: {
        startup: {
          select: {
            id: true,
            nombre: true,
            categoria: true,
            etapa: true
          }
        }
      }
    });

    console.log("✅ POST User Startups - Miembro creado:", newMember.id);

    return NextResponse.json({
      message: 'Miembro agregado exitosamente',
      member: {
        id: newMember.id,
        startup: newMember.startup,
        rol: newMember.rol,
        aceptado: newMember.aceptado
      }
    });

  } catch (error) {
    console.error("💥 Error en POST /api/users/startups:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 