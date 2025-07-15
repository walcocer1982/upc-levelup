import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/startups/profile iniciado");
    
    // Verificar que el usuario esté autenticado
    const session = await auth();
    console.log("📋 Session:", session);
    
    if (!session || !session.user || !session.user.email) {
      console.log("❌ No hay sesión válida");
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        startups: {
          include: {
            startup: {
              include: {
                impact: true,
                metrics: true
              }
            }
          },
          where: {
            rol: { in: ["CEO", "CEO/Fundador", "Fundador"] }
          }
        }
      }
    });

    if (!user) {
      console.log("❌ Usuario no encontrado");
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Si el usuario es CEO/Fundador de alguna startup, devolver la más reciente
    if (user.startups.length > 0) {
      const startupData = user.startups[0].startup;
      console.log("✅ Startup encontrada:", startupData.nombre);
      
      return NextResponse.json({
        startup: startupData,
        isOwner: true,
        memberRole: user.startups[0].rol
      });
    }

    // Si no tiene startup como CEO/Fundador
    console.log("ℹ️ Usuario no tiene startup como CEO/Fundador");
    return NextResponse.json({
      startup: null,
      isOwner: false,
      memberRole: null
    });

  } catch (error) {
    console.error("💥 Error en GET /api/startups/profile:", error);
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
    console.log("🚀 POST /api/startups/profile iniciado");
    
    // Verificar que el usuario esté autenticado
    const session = await auth();
    console.log("📋 Session:", session);
    
    if (!session || !session.user || !session.user.email) {
      console.log("❌ No hay sesión válida");
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      console.log("❌ Usuario no encontrado");
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (!user.dni) {
      console.log("❌ Usuario no tiene DNI registrado");
      return NextResponse.json(
        { error: "Debe completar su perfil de usuario primero" },
        { status: 400 }
      );
    }

    // Parsear los datos del request
    const body = await request.json();
    console.log("📝 Datos recibidos:", body);

    // Validar campos requeridos
    const requiredFields = ['nombre', 'fechaFundacion', 'categoria', 'descripcion', 'etapa', 'origen'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.log("❌ Campos requeridos faltantes:", missingFields);
      return NextResponse.json(
        { error: `Campos requeridos: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Obtener startupId del query parameter para actualización
    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get('startupId');

    let startup;
    let isNewStartup = false;

    if (startupId) {
      // ACTUALIZAR startup específica
      console.log("📝 Actualizando startup específica:", startupId);
      
      // Verificar que el usuario tenga permisos para actualizar esta startup
      const memberCheck = await prisma.member.findFirst({
        where: {
          dni: user.dni,
          startupId: startupId,
          rol: { in: ["CEO", "CEO/Fundador", "Fundador"] }
        }
      });

      if (!memberCheck) {
        console.log("❌ Usuario no tiene permisos para actualizar esta startup");
        return NextResponse.json(
          { error: "No tiene permisos para actualizar esta startup" },
          { status: 403 }
        );
      }

      startup = await prisma.startup.update({
        where: { id: startupId },
        data: {
          nombre: body.nombre,
          razonSocial: body.razonSocial || null,
          ruc: body.ruc || null,
          fechaFundacion: new Date(body.fechaFundacion),
          categoria: body.categoria,
          paginaWeb: body.paginaWeb || null,
          descripcion: body.descripcion,
          etapa: body.etapa,
          origen: body.origen,
          videoPitchUrl: body.videoPitchUrl || null
        },
        include: {
          impact: true,
          metrics: true,
          members: true
        }
      });
      
      console.log("✅ Startup actualizada exitosamente");
      
    } else {
      // CREAR nueva startup
      console.log("🆕 Creando nueva startup");
      
      // Verificar que el nombre no esté duplicado
      const duplicateStartup = await prisma.startup.findFirst({
        where: { nombre: body.nombre }
      });
      
      if (duplicateStartup) {
        console.log("❌ Nombre de startup ya existe");
        return NextResponse.json(
          { error: "Ya existe una startup con ese nombre" },
          { status: 409 }
        );
      }

      startup = await prisma.$transaction(async (tx) => {
        // 1. Crear la startup
        const newStartup = await tx.startup.create({
          data: {
            nombre: body.nombre,
            razonSocial: body.razonSocial || null,
            ruc: body.ruc || null,
            fechaFundacion: new Date(body.fechaFundacion),
            categoria: body.categoria,
            paginaWeb: body.paginaWeb || null,
            descripcion: body.descripcion,
            etapa: body.etapa,
            origen: body.origen,
            videoPitchUrl: body.videoPitchUrl || null
          }
        });

        // 2. Registrar al usuario como CEO/Fundador
        await tx.member.create({
          data: {
            nombres: user.nombres || '',
            apellidos: user.apellidos || '',
            dni: user.dni,
            email: user.email,
            telefono: user.telefono || '',
            linkedin: user.linkedin || null,
            biografia: user.biografia || null,
            rol: "CEO/Fundador",
            aceptado: true,
            startupId: newStartup.id
          }
        });

        return newStartup;
      });

      isNewStartup = true;
      console.log("✅ Nueva startup creada exitosamente");
    }

    // Respuesta exitosa
    return NextResponse.json({
      message: isNewStartup ? "Startup creada exitosamente" : "Startup actualizada exitosamente",
      startup: startup,
      isNewStartup: isNewStartup
    });

  } catch (error) {
    console.error("💥 Error en POST /api/startups/profile:", error);
    console.error("Stack trace:", error.stack);
    
    // Manejar errores específicos
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Ya existe una startup con esos datos" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}