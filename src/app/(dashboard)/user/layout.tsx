"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthenticatedRoute } from "@/components/auth/ProtectedRoute";
import { useUserData } from '@/hooks/useUserData';
import { 
  User, 
  Building2, 
  Calendar, 
  ChevronRight,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// Navegación simple como en la imagen
const navigation = [
  { name: 'Perfil', href: '/user', icon: <User size={20} /> },
  { name: 'Startups', href: '/user/startups', icon: <Building2 size={20} /> },
  { name: 'Convocatorias', href: '/user/convocatorias', icon: <Calendar size={20} /> },
  { name: 'Mis Aplicaciones', href: '/user/applications', icon: <Calendar size={20} /> },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userData, loading } = useUserData();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <AuthenticatedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link href="/user">
                  <h1 className="text-xl font-bold text-gray-900">UPC LevelUp</h1>
                </Link>
                <Badge variant="outline">Usuario</Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Usuario
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar Simple - Como en la imagen */}
          <aside className="w-64 min-h-screen bg-white border-r">
            <div className="p-4">
              {/* Perfil de Usuario */}
              <Card className="mb-6">
                <CardContent className="p-4 text-center">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
                    <User size={32} className="text-muted-foreground" />
                  </div>
                  
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-32 mb-2 mx-auto"></div>
                      <div className="h-3 bg-muted rounded w-24 mx-auto"></div>
                    </div>
                  ) : (
                    <>
                      <h2 className="font-medium">
                        {userData?.nombres || userData?.apellidos 
                          ? `${userData.nombres || ''} ${userData.apellidos || ''}`.trim()
                          : 'Usuario'
                        }
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {userData?.email || 'usuario@ejemplo.com'}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Navegación Simple */}
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                                 (item.href === '/user' && pathname === '/user');
                  
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-sm font-medium",
                          isActive 
                            ? "bg-muted text-primary font-medium"
                            : "text-foreground hover:bg-muted/50"
                        )}
                      >
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.name}</span>
                        {isActive && <ChevronRight size={16} className="ml-auto" />}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Contenido Principal */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthenticatedRoute>
  );
} 