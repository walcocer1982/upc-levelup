import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log("🔐 GET Startup Impact - Iniciando...");
    
    // Verificar sesión
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log("❌ GET Startup Impact - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener startupId de query params
    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get('startupId');

    if (!startupId) {
      return NextResponse.json(
        { error: 'startupId es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario es miembro de la startup
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { dni: true }
    });

    if (!user?.dni) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const isMember = await prisma.member.findUnique({
      where: {
        dni_startupId: {
          dni: user.dni,
          startupId: startupId
        }
      }
    });

    if (!isMember) {
      return NextResponse.json(
        { error: 'No autorizado para esta startup' },
        { status: 403 }
      );
    }

    // Obtener datos de impacto
    const impact = await prisma.impact.findUnique({
      where: { startupId: startupId }
    });

    console.log("✅ GET Startup Impact - Datos encontrados:", !!impact);

    return NextResponse.json({ impact });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/impact:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 POST Startup Impact - Iniciando...");
    
    // Verificar sesión
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log("❌ POST Startup Impact - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { startupId, ...impactData } = body;

    if (!startupId) {
      return NextResponse.json(
        { error: 'startupId es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario es miembro de la startup
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { dni: true }
    });

    if (!user?.dni) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const isMember = await prisma.member.findUnique({
      where: {
        dni_startupId: {
          dni: user.dni,
          startupId: startupId
        }
      }
    });

    if (!isMember) {
      return NextResponse.json(
        { error: 'No autorizado para esta startup' },
        { status: 403 }
      );
    }

    // Verificar que la startup existe
    const startup = await prisma.startup.findUnique({
      where: { id: startupId }
    });

    if (!startup) {
      return NextResponse.json({ error: 'Startup no encontrada' }, { status: 404 });
    }

    // Crear o actualizar datos de impacto
    const impact = await prisma.impact.upsert({
      where: { startupId: startupId },
      update: impactData,
      create: {
        startupId: startupId,
        ...impactData
      }
    });

    console.log("✅ POST Startup Impact - Datos guardados:", impact.id);

    return NextResponse.json({
      message: 'Datos de impacto guardados exitosamente',
      impact
    });

  } catch (error) {
    console.error("💥 Error en POST /api/startups/impact:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("🔐 PUT Startup Impact - Iniciando...");
    
    // Verificar sesión
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log("❌ PUT Startup Impact - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { startupId, ...impactData } = body;

    if (!startupId) {
      return NextResponse.json(
        { error: 'startupId es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario es miembro de la startup
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { dni: true }
    });

    if (!user?.dni) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const isMember = await prisma.member.findUnique({
      where: {
        dni_startupId: {
          dni: user.dni,
          startupId: startupId
        }
      }
    });

    if (!isMember) {
      return NextResponse.json(
        { error: 'No autorizado para esta startup' },
        { status: 403 }
      );
    }

    // Actualizar datos de impacto
    const impact = await prisma.impact.update({
      where: { startupId: startupId },
      data: impactData
    });

    console.log("✅ PUT Startup Impact - Datos actualizados:", impact.id);

    return NextResponse.json({
      message: 'Datos de impacto actualizados exitosamente',
      impact
    });

  } catch (error) {
    console.error("💥 Error en PUT /api/startups/impact:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 