import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ✅ AGREGAR método GET para obtener miembros
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    console.log("🔐 GET Members - Sesión verificada:", session?.user?.email);

    if (!session || !session.user?.email) {
      console.log("❌ GET Members - No autorizado - Sin sesión");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const startupId = (await params).id;
    console.log("📝 GET Members - Obteniendo miembros para startup:", startupId);

    // Verificar que el usuario actual es miembro de la startup
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || !user.dni) {
      console.log("❌ GET Members - Usuario no encontrado o sin DNI");
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const memberCheck = await prisma.member.findFirst({
      where: {
        dni: user.dni,
        startupId: startupId
      }
    });

    if (!memberCheck) {
      console.log("❌ GET Members - Sin acceso a la startup");
      return NextResponse.json({ error: "No tienes acceso a esta startup" }, { status: 403 });
    }

    // Verificar que la startup existe
    const startup = await prisma.startup.findUnique({
      where: { id: startupId }
    });

    if (!startup) {
      console.log("❌ GET Members - Startup no encontrada");
      return NextResponse.json({ error: "Startup no encontrada" }, { status: 404 });
    }

    // Obtener todos los miembros de la startup
    const members = await prisma.member.findMany({
      where: { startupId: startupId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nombres: true,
            apellidos: true
          }
        }
      },
      orderBy: {
        id: 'asc' // Ordenar por fecha de creación
      }
    });

    console.log("✅ GET Members - Miembros encontrados:", members.length);
    console.log("📋 GET Members - Lista de miembros:", members.map(m => ({ 
      id: m.id, 
      nombres: m.nombres, 
      apellidos: m.apellidos, 
      rol: m.rol 
    })));

    // Formatear los datos para el frontend
    const formattedMembers = members.map(member => ({
      id: member.id,
      nombre: `${member.nombres} ${member.apellidos}`, // Combinar nombres para MemberCard
      nombres: member.nombres, // Mantener campos separados para edición
      apellidos: member.apellidos,
      cargo: member.rol, // Mapear 'rol' de DB a 'cargo' para frontend
      email: member.email,
      dni: member.dni,
      telefono: member.telefono,
      linkedin: member.linkedin,
      biografia: member.biografia,
      aceptado: member.aceptado,
      avatar: "", // Por ahora sin avatar
    }));

    console.log("✅ GET Members - Datos formateados:", formattedMembers.length);

    return NextResponse.json({
      members: formattedMembers,
      count: formattedMembers.length
    }, { status: 200 });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/[id]/members:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ✅ MANTENER método POST existente sin cambios
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    console.log("🔐 POST Members - Sesión verificada:", session?.user?.email);

    if (!session || !session.user?.email) {
      console.log("❌ POST Members - No autorizado - Sin sesión");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const startupId = (await params).id;
    const body = await request.json();
    console.log("📝 POST Members - Datos recibidos para startup:", startupId);
    console.log("📝 POST Members - Body recibido:", JSON.stringify(body, null, 2));

    // Verificar que el usuario actual es miembro de la startup
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || !user.dni) {
      console.log("❌ POST Members - Usuario no encontrado o sin DNI");
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const memberCheck = await prisma.member.findFirst({
      where: {
        dni: user.dni,
        startupId: startupId
      }
    });

    if (!memberCheck) {
      console.log("❌ POST Members - Sin acceso a la startup");
      return NextResponse.json({ error: "No tienes acceso a esta startup" }, { status: 403 });
    }

    // Verificar que la startup existe
    const startup = await prisma.startup.findUnique({
      where: { id: startupId }
    });

    if (!startup) {
      console.log("❌ POST Members - Startup no encontrada");
      return NextResponse.json({ error: "Startup no encontrada" }, { status: 404 });
    }

    // Verificar que el DNI no esté ya registrado en esta startup
    const existingMember = await prisma.member.findFirst({
      where: {
        dni: body.dni,
        startupId: startupId
      }
    });

    if (existingMember) {
      console.log("❌ POST Members - DNI ya registrado en esta startup");
      return NextResponse.json({ 
        error: "Este DNI ya está registrado como miembro de esta startup" 
      }, { status: 400 });
    }

    // Verificar si el usuario con este DNI existe en la tabla User
    let targetUser = await prisma.user.findUnique({
      where: { dni: body.dni }
    });

    // Si no existe, crear el usuario con datos mínimos
    if (!targetUser) {
      console.log("✅ POST Members - Creando nuevo usuario para DNI:", body.dni);
      targetUser = await prisma.user.create({
        data: {
          email: body.email,
          nombres: body.nombres,
          apellidos: body.apellidos,
          dni: body.dni,
          telefono: body.telefono,
          linkedin: body.linkedin,
          biografia: body.biografia,
          isRegistered: false // Marcar como no registrado hasta que se registre oficialmente
        }
      });
      console.log("✅ POST Members - Usuario creado:", targetUser.id);
    }

    // Preparar los datos para crear el miembro
    const memberData = {
      nombres: body.nombres,
      apellidos: body.apellidos,
      dni: body.dni,
      email: body.email,
      telefono: body.telefono,
      linkedin: body.linkedin || null,
      biografia: body.biografia || null,
      rol: body.cargo, // Mapear 'cargo' del formulario a 'rol' en la DB
      aceptado: false, // Por defecto no aceptado
      startupId: startupId
    };

    console.log("📝 POST Members - Datos preparados para crear miembro:", JSON.stringify(memberData, null, 2));

    // Crear el miembro
    const newMember = await prisma.member.create({
      data: memberData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nombres: true,
            apellidos: true
          }
        },
        startup: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    console.log("✅ POST Members - Miembro creado exitosamente:", newMember.id);

    return NextResponse.json({
      message: "Miembro agregado exitosamente",
      member: {
        id: newMember.id,
        nombre: `${newMember.nombres} ${newMember.apellidos}`, // Formatear para frontend
        nombres: newMember.nombres,
        apellidos: newMember.apellidos,
        dni: newMember.dni,
        email: newMember.email,
        telefono: newMember.telefono,
        linkedin: newMember.linkedin,
        biografia: newMember.biografia,
        cargo: newMember.rol, // Mapear 'rol' a 'cargo' para frontend
        aceptado: newMember.aceptado,
        startupId: newMember.startupId,
        avatar: ""
      }
    }, { status: 201 });

  } catch (error) {
    console.error("💥 Error en POST /api/startups/[id]/members:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}