// import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  console.log("🛡️ Middleware ejecutándose para:", pathname);
  
  // Permitir acceso libre a rutas públicas
  if (pathname === '/' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // TEMPORAL: Deshabilitar middleware complejo para evitar redirecciones infinitas
  console.log("✅ Acceso permitido temporalmente a:", pathname);
  return NextResponse.next();
}

export const config = {
  // Definir las rutas que este middleware debe procesar
  matcher: [
    '/user/:path*',     // Todas las rutas de usuario regular
    '/admin/:path*',    // Todas las rutas de administración
    '/denied',          // Página de acceso denegado
    '/api/users/:path*', // APIs de usuario
    '/api/startups/:path*', // APIs de startups
  ],
};