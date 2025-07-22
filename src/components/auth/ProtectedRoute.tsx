"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "usuario" | "admin";
  requireRegistration?: boolean;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requireRegistration = true,
  fallback 
}: ProtectedRouteProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    isAdmin, 
    isUser, 
    isRegistered,
    user 
  } = useAuth(requiredRole, requireRegistration);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Verificando autenticación...</span>
      </div>
    );
  }

  // Si no está autenticado
  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Acceso Requerido</h2>
            <p className="text-muted-foreground mb-6">
              Debes iniciar sesión para acceder a esta sección
            </p>
            <Link href="/">
              <Button>Iniciar Sesión</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si requiere registro y no está registrado
  if (requireRegistration && !isRegistered) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Registro Requerido</h2>
            <p className="text-muted-foreground mb-6">
              Debes completar tu registro para acceder a esta sección
            </p>
            <Link href="/">
              <Button>Completar Registro</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si requiere un rol específico
  if (requiredRole) {
    const hasAccess = requiredRole === "admin" ? isAdmin : (isUser || isAdmin);
    
    if (!hasAccess) {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Acceso Denegado</h2>
              <p className="text-muted-foreground mb-6">
                No tienes permisos para acceder a esta sección
              </p>
              <div className="space-y-2">
                <Link href="/user/dashboard">
                  <Button variant="outline" className="w-full">
                    Ir al Dashboard
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full">
                    Volver al Inicio
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Si pasa todas las validaciones, mostrar el contenido
  return <>{children}</>;
}

// Componentes específicos para diferentes tipos de protección
export function AdminRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function UserRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="usuario" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function AuthenticatedRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
} 