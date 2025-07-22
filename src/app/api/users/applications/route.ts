import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log("🔐 GET User Applications - Iniciando...");
    
    // Verificar sesión
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log("❌ GET User Applications - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    console.log("🔐 GET User Applications - Sesión verificada:", session?.user?.email);

    // Obtener startupId de query params si existe
    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get('startupId');

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, dni: true, nombres: true, apellidos: true }
    });

    if (!user || !user.dni) {
      console.log("❌ GET User Applications - Usuario no encontrado o sin DNI");
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    console.log("🔍 GET User Applications - Buscando aplicaciones para DNI:", user.dni);

    // Si se especifica startupId, verificar que el usuario es miembro
    if (startupId) {
      const isMember = await prisma.member.findUnique({
        where: {
          dni_startupId: {
            dni: user.dni,
            startupId: startupId
          }
        }
      });

      if (!isMember) {
        console.log("❌ GET User Applications - Usuario no es miembro de la startup");
        return NextResponse.json({ error: 'No autorizado para esta startup' }, { status: 403 });
      }

      // Obtener aplicaciones de la startup específica
      const applications = await prisma.applicant.findMany({
        where: { startupId: startupId },
        include: {
          convocatoria: {
            select: {
              id: true,
              tipo: true,
              fechaInicio: true,
              fechaFin: true
            }
          },
          startup: {
            select: {
              id: true,
              nombre: true,
              categoria: true
            }
          },
          evaluaciones: {
            select: {
              id: true,
              estado: true,
              puntajeTotal: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { fecha: 'desc' }
      });

      console.log("✅ GET User Applications - Aplicaciones encontradas:", applications.length);

      return NextResponse.json({ applications });

    } else {
      // Obtener todas las startups del usuario
      const userStartups = await prisma.member.findMany({
        where: { dni: user.dni },
        select: { startupId: true }
      });

      if (userStartups.length === 0) {
        console.log("✅ GET User Applications - Usuario no es miembro de ninguna startup");
        return NextResponse.json({ applications: [] });
      }

      const startupIds = userStartups.map(member => member.startupId);

      // Obtener aplicaciones de todas las startups del usuario
      const applications = await prisma.applicant.findMany({
        where: {
          startupId: { in: startupIds }
        },
        include: {
          convocatoria: {
            select: {
              id: true,
              tipo: true,
              fechaInicio: true,
              fechaFin: true
            }
          },
          startup: {
            select: {
              id: true,
              nombre: true,
              categoria: true
            }
          },
          evaluaciones: {
            select: {
              id: true,
              estado: true,
              puntajeTotal: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { fecha: 'desc' }
      });

      console.log("✅ GET User Applications - Aplicaciones encontradas:", applications.length);

      return NextResponse.json({ applications });
    }

  } catch (error) {
    console.error("💥 Error en GET /api/users/applications:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 POST User Applications - Iniciando...");
    
    // Verificar sesión
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log("❌ POST User Applications - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { startupId, convocatoriaId } = body;

    if (!startupId || !convocatoriaId) {
      return NextResponse.json(
        { error: 'startupId y convocatoriaId son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, dni: true }
    });

    if (!user || !user.dni) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar que el usuario es miembro de la startup
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

    // Verificar que la convocatoria existe
    const convocatoria = await prisma.application.findUnique({
      where: { id: convocatoriaId }
    });

    if (!convocatoria) {
      return NextResponse.json({ error: 'Convocatoria no encontrada' }, { status: 404 });
    }

    // Verificar que no haya una aplicación existente
    const existingApplication = await prisma.applicant.findUnique({
      where: {
        startupId_convocatoriaId: {
          startupId: startupId,
          convocatoriaId: convocatoriaId
        }
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Ya existe una aplicación para esta convocatoria' },
        { status: 400 }
      );
    }

    // Crear nueva aplicación
    const newApplication = await prisma.applicant.create({
      data: {
        startupId: startupId,
        convocatoriaId: convocatoriaId,
        estado: 'PENDIENTE'
      },
      include: {
        convocatoria: {
          select: {
            id: true,
            tipo: true,
            fechaInicio: true,
            fechaFin: true
          }
        },
        startup: {
          select: {
            id: true,
            nombre: true,
            categoria: true
          }
        }
      }
    });

    console.log("✅ POST User Applications - Aplicación creada:", newApplication.id);

    return NextResponse.json({
      message: 'Aplicación creada exitosamente',
      application: newApplication
    });

  } catch (error) {
    console.error("💥 Error en POST /api/users/applications:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 