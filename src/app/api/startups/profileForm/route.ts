import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/startups/profileForm iniciado...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ GET /api/startups/profileForm - No autorizado - Sin sesión");
      return NextResponse.json(
        { error: "Usuario no autorizado" },
        { status: 401 }
      );
    }

    // Obtener el startupId de los parámetros de la URL
    const url = new URL(request.url);
    const startupId = url.searchParams.get('startupId');
    
    if (!startupId) {
      return NextResponse.json(
        { error: "startupId es requerido" },
        { status: 400 }
      );
    }

    console.log("📋 Buscando startup:", startupId);

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, dni: true, nombres: true, apellidos: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que el usuario es miembro de la startup
    const member = await prisma.member.findUnique({
      where: {
        dni_startupId: {
          dni: user.dni!,
          startupId: startupId
        }
      },
      include: {
        startup: true
      }
    });

    if (!member) {
      return NextResponse.json(
        { error: "No autorizado para esta startup" },
        { status: 403 }
      );
    }

    console.log("✅ Startup encontrada:", member.startup.nombre);

    // Devolver formulario de la startup
    return NextResponse.json({
      startup: {
        id: member.startup.id,
        nombre: member.startup.nombre,
        descripcion: member.startup.descripcion,
        categoria: member.startup.categoria,
        etapa: member.startup.etapa,
        fechaFundacion: member.startup.fechaFundacion,
        paginaWeb: member.startup.paginaWeb,
        videoPitchUrl: member.startup.videoPitchUrl
      }
    });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/profileForm:", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/startups/profileForm iniciado...");
    
    // Verificar sesión
    const session = await auth();
    if (!session?.user?.email) {
      console.log("❌ POST /api/startups/profileForm - No autorizado - Sin sesión");
      return NextResponse.json(
        { error: "Usuario no autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { startupId, ...formData } = body;

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, dni: true, nombres: true, apellidos: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    console.log("🔐 Usuario autenticado:", user.nombres, user.apellidos);

    // Si hay startupId, es una actualización
    if (startupId) {
      // Verificar que el usuario es miembro de la startup
      const member = await prisma.member.findUnique({
        where: {
          dni_startupId: {
            dni: user.dni!,
            startupId: startupId
          }
        }
      });

      if (!member) {
        return NextResponse.json(
          { error: "No autorizado para esta startup" },
          { status: 403 }
        );
      }

      // Actualizar la startup
      const updatedStartup = await prisma.startup.update({
        where: { id: startupId },
        data: {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          categoria: formData.categoria,
          etapa: formData.etapa,
          fechaFundacion: formData.fechaFundacion ? new Date(formData.fechaFundacion) : undefined,
          paginaWeb: formData.web,
          videoPitchUrl: formData.videoPitch
        }
      });

      console.log("✅ Startup actualizada:", updatedStartup.nombre);

      return NextResponse.json({
        success: true,
        message: "Startup actualizada exitosamente",
        startup: updatedStartup
      });
    } else {
      // Es una nueva startup
      console.log("🆕 Creando nueva startup...");

      // Crear startup y miembro en una transacción
      const result = await prisma.$transaction(async (tx) => {
        // Crear la startup
        const newStartup = await tx.startup.create({
          data: {
            nombre: formData.nombre || 'Nueva Startup',
            descripcion: formData.descripcion || '',
            categoria: formData.categoria || 'Tech',
            fechaFundacion: formData.fechaFundacion ? new Date(formData.fechaFundacion) : new Date(),
            paginaWeb: formData.web || '',
            videoPitchUrl: formData.videoPitch || '',
            etapa: formData.etapa || 'Idea',
            origen: 'UNIVERSIDAD'
          }
        });

        // Crear el miembro (fundador)
        const newMember = await tx.member.create({
          data: {
            nombres: user.nombres || '',
            apellidos: user.apellidos || '',
            dni: user.dni!,
            email: session.user.email,
            telefono: '',
            rol: 'Fundador',
            startupId: newStartup.id,
            aceptado: true
          }
        });

        return { startup: newStartup, member: newMember };
      });

      console.log("✅ Nueva startup creada y guardada:", result.startup.nombre);

      return NextResponse.json({
        success: true,
        message: "Startup creada exitosamente",
        startup: result.startup
      });
    }

  } catch (error) {
    console.error("💥 Error en POST /api/startups/profileForm:", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}