"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: 'Dashboard', href: '/user/dashboard', icon: '🏠' },
  { name: 'Mis Startups', href: '/user/startups', icon: '🚀' },
  { name: 'Mis Aplicaciones', href: '/user/applications', icon: '📋' },
  { name: 'Mi Perfil', href: '/user?view=profile', icon: '👤' },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Cargando...</span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Acceso Requerido</h2>
            <p className="text-muted-foreground mb-6">
              Debes iniciar sesión para acceder a esta sección
            </p>
            <Link href="/login">
              <Button>Iniciar Sesión</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/user/dashboard">
                <h1 className="text-xl font-bold text-gray-900">UPC LevelUp</h1>
              </Link>
              <Badge variant="outline">Usuario</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session?.user?.name || session?.user?.email}
              </span>
              <Link href="/api/auth/signout">
                <Button variant="outline" size="sm">
                  Cerrar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || 
                                   (item.href === '/user?view=profile' && pathname === '/user');
                    
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={`w-full justify-start ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'}`}
                        >
                          <span className="mr-3">{item.icon}</span>
                          {item.name}
                        </Button>
                      </Link>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Resumen Rápido</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Startups:</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aplicaciones:</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pendientes:</span>
                    <span className="font-medium">-</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 