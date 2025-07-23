import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔐 GET Startup Profile - Iniciando...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ GET Startup Profile - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: startupId } = await params;
    console.log("🔍 GET Startup Profile - Buscando startup:", startupId);

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, dni: true }
    });

    if (!user || !user.dni) {
      console.log("❌ GET Startup Profile - Usuario no encontrado o sin DNI");
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
      console.log("❌ GET Startup Profile - Usuario no autorizado para esta startup");
      return NextResponse.json({ error: 'No autorizado para esta startup' }, { status: 403 });
    }

    // Buscar la startup con datos básicos
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      select: {
        id: true,
        nombre: true,
        categoria: true,
        descripcion: true,
        etapa: true,
        fechaFundacion: true,
        paginaWeb: true
      }
    });

    if (!startup) {
      console.log("❌ GET Startup Profile - Startup no encontrada");
      return NextResponse.json({ error: 'Startup no encontrada' }, { status: 404 });
    }

    console.log("✅ GET Startup Profile - Startup encontrada:", startup.nombre);

    return NextResponse.json({ startup });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/[id]/profile:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 