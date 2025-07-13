import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@/lib/permissions/roles';

export function withAuth(middleware: (request: NextRequest) => NextResponse | Promise<NextResponse>) {
  return async function (request: NextRequest) {
    const session = request.cookies.get('next-auth.session-token');

    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return middleware(request);
  };
}

export function withRole(roles: Role[]) {
  return withAuth(async (request: NextRequest) => {
    // Aquí necesitarías decodificar el token y verificar el rol del usuario
    // Esta es una implementación simplificada
    const userRole = request.headers.get('x-user-role') as Role;

    if (!userRole || !roles.includes(userRole)) {
      return new NextResponse(JSON.stringify({ error: 'No tienes permisos para acceder a esta página' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.next();
  });
}
