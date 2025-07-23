import { NextRequest, NextResponse } from "next/server";
import { PrismaRepository } from "@/data/database/repository-prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/startups/profile iniciado");
    
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

    // Verificar autenticación (por ahora usamos el usuario de prueba)
    const user = await PrismaRepository.getUserByEmail('admin@test.com');
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no autorizado" },
        { status: 401 }
      );
    }

    // Obtener la startup desde la base de datos real
    const startup = await PrismaRepository.getStartupById(startupId);
    
    if (!startup) {
      return NextResponse.json(
        { error: "Startup no encontrada" },
        { status: 404 }
      );
    }

    console.log("✅ Startup encontrada:", startup.nombre);

    // Devolver perfil completo de la startup
    return NextResponse.json({
      startup: {
        id: startup.id,
        nombre: startup.nombre,
        descripcion: startup.descripcion,
        categoria: startup.categoria,
        sector: startup.sector,
        estado: startup.estado,
        fundadores: startup.fundadores,
        miembros: startup.miembros,
        website: startup.website,
        fechaFundacion: startup.fechaFundacion,
        ubicacion: startup.ubicacion,
        mercadoObjetivo: startup.mercadoObjetivo,
        modeloNegocio: startup.modeloNegocio,
        createdAt: startup.createdAt,
        updatedAt: startup.updatedAt
      }
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

export async function PUT(request: NextRequest) {
  try {
    console.log("🔍 PUT /api/startups/profile iniciado");
    
    const body = await request.json();
    const { startupId, ...formData } = body;

    if (!startupId) {
      return NextResponse.json(
        { error: "startupId es requerido" },
        { status: 400 }
      );
    }

    // Verificar autenticación (por ahora usamos el usuario de prueba)
    const user = await PrismaRepository.getUserByEmail('admin@test.com');
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no autorizado" },
        { status: 401 }
      );
    }

    // Verificar que la startup existe
    const existingStartup = await PrismaRepository.getStartupById(startupId);
    
    if (!existingStartup) {
      return NextResponse.json(
        { error: "Startup no encontrada" },
        { status: 404 }
      );
    }

    console.log("✅ Startup encontrada para actualizar:", existingStartup.nombre);

    // Actualizar el perfil en la base de datos real
    const updatedStartup = await PrismaRepository.updateStartup(startupId, formData);

    console.log("✅ Perfil de startup actualizado en la base de datos");

    return NextResponse.json({
      success: true,
      message: "Perfil actualizado exitosamente",
      startup: updatedStartup
    });

  } catch (error) {
    console.error("💥 Error en PUT /api/startups/profile:", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}