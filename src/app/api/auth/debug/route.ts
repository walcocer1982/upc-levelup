import { NextRequest, NextResponse } from "next/server";
import { PrismaRepository } from "@/data/database/repository-prisma";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/auth/debug iniciado");

    // Obtener estadísticas generales desde la base de datos real
    const [
      totalUsers,
      totalStartups,
      totalConvocatorias,
      totalApplications,
      totalApplicationForms,
      totalApplicants,
      totalEvaluaciones
    ] = await Promise.all([
      prisma.user.count(),
      prisma.startup.count(),
      prisma.convocatoria.count(),
      prisma.application.count(),
      prisma.applicationForm.count(),
      prisma.applicant.count(),
      prisma.evaluacionIA.count()
    ]);

    const stats = {
      totalUsers,
      totalStartups,
      totalConvocatorias,
      totalApplications,
      totalApplicationForms,
      totalApplicants,
      totalEvaluaciones
    };

    // Obtener datos de startups
    const startups = await prisma.startup.findMany({
      select: {
        id: true,
        nombre: true,
        categoria: true,
        etapa: true,
        descripcion: true
      }
    });

    // Obtener datos de usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        email: true,
        role: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Datos de debug obtenidos exitosamente desde la base de datos real",
      stats,
      startups,
      users,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("💥 Error en GET /api/auth/debug:", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 