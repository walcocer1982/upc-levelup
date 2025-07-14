import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Función auxiliar para centralizar la lógica de control de acceso
function hasAccess(path: string, role?: string, isRegistered?: boolean): boolean {
  // Valores predeterminados para casos donde faltan datos
  role = role || 'public';
  isRegistered = isRegistered ?? false;
  
  // Si el usuario no está registrado, solo puede acceder a rutas públicas
  if (!isRegistered) {
    return !path.startsWith('/user') && !path.startsWith('/admin');
  }
  
  // Rutas específicas para administradores
  if (path.startsWith('/admin')) {
    return role === 'admin';
  }
  
  // Rutas específicas para usuarios regulares
  if (path.startsWith('/user')) {
    return role === 'user';
  }
  
  // Por defecto, permitir acceso a rutas públicas
  return true;
}

export async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;
  
  // Permitir acceso libre a la página principal y rutas de autenticación
  if (pathname === '/' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Si no hay sesión, redirigir a la página principal
  if (!session || !session.user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Obtener información del usuario desde la sesión (usando Auth.js v5)
  const userRole = session.user.role;
  const isRegistered = session.user.isRegistered;

  // Verificar acceso usando la función auxiliar
  if (!hasAccess(pathname, userRole, isRegistered)) {
    // Caso especial: usuario no registrado tratando de acceder a áreas protegidas
    if (!isRegistered) {
      // Redirigir a la página principal hasta que complete su registro
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    // Si el usuario está autenticado pero no autorizado, redirigir a página de acceso denegado
    return NextResponse.redirect(new URL('/denied', req.url));
  }

  // Si pasa todas las validaciones, continuar con la request
  return NextResponse.next();
}

export const config = {
  // Definir las rutas que este middleware debe procesar
  matcher: [
    '/user/:path*',     // Todas las rutas de usuario regular
    '/admin/:path*',    // Todas las rutas de administración
    '/denied',          // Página de acceso denegado
  ],
};