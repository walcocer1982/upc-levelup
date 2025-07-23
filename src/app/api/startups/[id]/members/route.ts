import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔐 GET Startup Members - Iniciando...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ GET Startup Members - No autorizado - Sin sesión");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: startupId } = await params;
    console.log("🔍 GET Startup Members - Verificando startup:", startupId);

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, dni: true }
    });

    if (!user || !user.dni) {
      console.log("❌ GET Startup Members - Usuario no encontrado o sin DNI");
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
      console.log("❌ GET Startup Members - Usuario no autorizado para esta startup");
      return NextResponse.json({ error: 'No autorizado para esta startup' }, { status: 403 });
    }

    // Obtener todos los miembros de la startup
    const members = await prisma.member.findMany({
      where: { startupId },
      include: {
        user: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true
          }
        }
      },
      orderBy: [
        { createdAt: 'asc' }
      ]
    });

    // Formatear la respuesta
    const formattedMembers = members.map(member => ({
      id: member.id,
      nombres: member.user.nombres,
      apellidos: member.user.apellidos,
      email: member.user.email,
      telefono: member.user.telefono,
      rol: member.rol,
      aceptado: member.aceptado,
      createdAt: member.createdAt
    }));

    console.log("✅ GET Startup Members - Miembros obtenidos:", formattedMembers.length);

    return NextResponse.json({
      members: formattedMembers
    });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/[id]/members:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 