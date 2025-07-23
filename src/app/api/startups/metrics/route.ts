import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log("🔐 GET Startup Metrics - Iniciando...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ GET Startup Metrics - No autorizado - Sin sesión");
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

    // Obtener datos de métricas
    const metrics = await prisma.metrics.findUnique({
      where: { startupId: startupId }
    });

    console.log("✅ GET Startup Metrics - Datos encontrados:", !!metrics);

    return NextResponse.json({ metrics });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/metrics:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 POST Startup Metrics - Iniciando...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ POST Startup Metrics - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { startupId, ...metricsData } = body;

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

    // Crear o actualizar datos de métricas
    const metrics = await prisma.metrics.upsert({
      where: { startupId: startupId },
      update: metricsData,
      create: {
        startupId: startupId,
        ...metricsData
      }
    });

    console.log("✅ POST Startup Metrics - Datos guardados:", metrics.id);

    return NextResponse.json({
      message: 'Datos de métricas guardados exitosamente',
      metrics
    });

  } catch (error) {
    console.error("💥 Error en POST /api/startups/metrics:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("🔐 PUT Startup Metrics - Iniciando...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ PUT Startup Metrics - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { startupId, ...metricsData } = body;

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

    // Actualizar datos de métricas
    const metrics = await prisma.metrics.update({
      where: { startupId: startupId },
      data: metricsData
    });

    console.log("✅ PUT Startup Metrics - Datos actualizados:", metrics.id);

    return NextResponse.json({
      message: 'Datos de métricas actualizados exitosamente',
      metrics
    });

  } catch (error) {
    console.error("💥 Error en PUT /api/startups/metrics:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 