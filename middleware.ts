import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Función auxiliar para centralizar la lógica de control de acceso
function hasAccess(path: string, role?: string, isRegistered?: boolean): boolean {
  console.log("🔐 Verificando acceso:", { path, role, isRegistered });
  
  // Valores predeterminados para casos donde faltan datos
  role = role || 'usuario';
  isRegistered = isRegistered ?? false;
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/', '/login', '/api/auth', '/auth-redirect'];
  if (publicRoutes.some(route => path.startsWith(route))) {
    return true;
  }
  
  // Si el usuario no está registrado, solo puede acceder a rutas públicas
  if (!isRegistered) {
    console.log("❌ Usuario no registrado, acceso denegado a:", path);
    return false;
  }
  
  // Rutas específicas para administradores
  if (path.startsWith('/admin')) {
    const hasAdminAccess = role === 'admin';
    console.log(`🔐 Acceso admin a ${path}:`, hasAdminAccess);
    return hasAdminAccess;
  }
  
  // Rutas específicas para usuarios regulares
  if (path.startsWith('/user')) {
    const hasUserAccess = role === 'usuario' || role === 'admin';
    console.log(`🔐 Acceso usuario a ${path}:`, hasUserAccess);
    return hasUserAccess;
  }
  
  // Por defecto, permitir acceso a rutas públicas
  return true;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  console.log("🛡️ Middleware ejecutándose para:", pathname);
  
  // Permitir acceso libre a rutas públicas
  if (pathname === '/' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  try {
    const session = await auth();
    
    // Si no hay sesión, redirigir a la página principal
    if (!session || !session.user) {
      console.log("❌ No hay sesión, redirigiendo a /");
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Obtener información del usuario desde la sesión
    const userRole = session.user.role;
    const isRegistered = session.user.isRegistered;

    console.log("👤 Usuario autenticado:", {
      email: session.user.email,
      role: userRole,
      isRegistered: isRegistered
    });

    // Verificar acceso usando la función auxiliar
    if (!hasAccess(pathname, userRole, isRegistered)) {
      // Caso especial: usuario no registrado tratando de acceder a áreas protegidas
      if (!isRegistered) {
        console.log("⚠️ Usuario no registrado, redirigiendo a /");
        return NextResponse.redirect(new URL('/', req.url));
      }
      
      // Si el usuario está autenticado pero no autorizado, redirigir a página de acceso denegado
      console.log("🚫 Acceso denegado, redirigiendo a /denied");
      return NextResponse.redirect(new URL('/denied', req.url));
    }

    // Si pasa todas las validaciones, continuar con la request
    console.log("✅ Acceso permitido a:", pathname);
    return NextResponse.next();
    
  } catch (error) {
    console.error("❌ Error en middleware:", error);
    // En caso de error, redirigir a la página principal
    return NextResponse.redirect(new URL('/', req.url));
  }
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