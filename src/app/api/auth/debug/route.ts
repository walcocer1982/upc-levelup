import { NextRequest, NextResponse } from "next/server";
import { mockAuth } from "@/lib/mock-auth";
import { getMockData } from "@/data/mock";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Debug endpoint iniciado (MOCK)");
    
    // Verificar sesión mock
    const session = mockAuth.getSession();
    console.log("📋 Session completa (MOCK):", JSON.stringify(session, null, 2));
    
    // Verificar variables de entorno
    const envCheck = {
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    };
    
    // Verificar datos mock
    const mockDataStatus = {
      totalUsers: getMockData.getAllUsers().length,
      totalStartups: getMockData.getAllStartups().length,
      totalConvocatorias: getMockData.getAllConvocatorias().length,
      totalPostulaciones: getMockData.getAllPostulaciones().length,
    };
    
    return NextResponse.json({
      session: session ? {
        hasUser: !!session.user,
        userEmail: session.user?.email,
        userRole: session.user?.role,
        isRegistered: session.user?.isRegistered,
      } : null,
      environment: envCheck,
      mockData: mockDataStatus,
      authentication: {
        isAuthenticated: mockAuth.isAuthenticated(),
        hasRole: mockAuth.hasRole('admin'),
        isRegistered: mockAuth.isRegistered(),
      },
      timestamp: new Date().toISOString(),
      mode: "MOCK",
    });
    
  } catch (error) {
    console.error("💥 Error en debug endpoint (MOCK):", error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
      mode: "MOCK",
    }, { status: 500 });
  }
} 