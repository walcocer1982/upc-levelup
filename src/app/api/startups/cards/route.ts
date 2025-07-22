import { NextResponse } from "next/server";
import { PrismaRepository } from "@/data/database/repository-prisma";

export async function GET() {
  try {
    console.log('🔍 Obteniendo startups para cards...');
    
    // Obtener todas las startups desde la base de datos real
    const startups = await PrismaRepository.getAllStartups();
    
    console.log(`✅ Encontradas ${startups.length} startups`);
    
    return NextResponse.json({ startups });
  } catch (error) {
    console.error('❌ Error obteniendo startups:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}