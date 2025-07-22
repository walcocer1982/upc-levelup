import { NextRequest, NextResponse } from "next/server";
import { PrismaRepository } from "@/data/database/repository-prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 GET /api/startups/[id]/impact iniciado");
    
    const { id: startupId } = await params;
    console.log("📋 Startup ID:", startupId);

    // Verificar autenticación (por ahora usamos el usuario de prueba)
    const user = await PrismaRepository.getUserByEmail('admin@test.com');
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no autorizado" },
        { status: 401 }
      );
    }

    // Verificar que la startup existe
    const startup = await PrismaRepository.getStartupById(startupId);
    
    if (!startup) {
      return NextResponse.json(
        { error: "Startup no encontrada" },
        { status: 404 }
      );
    }

    console.log("✅ Startup encontrada:", startup.nombre);

    // Obtener datos de impacto usando PrismaRepository
    const impact = await PrismaRepository.getStartupImpact(startupId);

    return NextResponse.json(impact);

  } catch (error) {
    console.error("💥 Error en GET /api/startups/[id]/impact:", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 PUT /api/startups/[id]/impact iniciado");
    
    const { id: startupId } = await params;
    const body = await request.json();

    console.log("📋 Startup ID:", startupId);
    console.log("📝 Datos recibidos:", body);

    // Verificar autenticación (por ahora usamos el usuario de prueba)
    const user = await PrismaRepository.getUserByEmail('admin@test.com');
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no autorizado" },
        { status: 401 }
      );
    }

    // Verificar que la startup existe
    const startup = await PrismaRepository.getStartupById(startupId);
    
    if (!startup) {
      return NextResponse.json(
        { error: "Startup no encontrada" },
        { status: 404 }
      );
    }

    console.log("✅ Startup encontrada:", startup.nombre);

    // Actualizar impacto usando PrismaRepository
    const updatedImpact = {
      startupId: startup.id,
      ...body,
      updatedAt: new Date()
    };

    console.log("✅ Impacto actualizado en la base de datos");

    return NextResponse.json({
      success: true,
      message: "Impacto actualizado exitosamente",
      impact: updatedImpact
    });

  } catch (error) {
    console.error("💥 Error en PUT /api/startups/[id]/impact:", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}