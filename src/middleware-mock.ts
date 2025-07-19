import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { mockAuth } from "@/lib/mock-auth";

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
    return role === 'usuario';
  }
  
  // Por defecto, permitir acceso a rutas públicas
  return true;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Permitir acceso libre a la página principal y rutas de autenticación
  if 