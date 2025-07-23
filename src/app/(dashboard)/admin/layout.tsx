"use client";

import { useUserData } from '@/hooks/useUserData';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Building2, 
  Calendar, 
  ChevronRight,
  Menu,
  X,
  BarChart3,
  FileText,
  Users,
  Settings,
  LogOut,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/general/useMediaQuery";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, loading } = useUserData();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  // Cerrar el menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Menú para administradores
  const adminMenuItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/admin",
      active: pathname === "/admin"
    },
    {
      icon: <Building2 size={20} />,
      label: "Ver Startups",
      href: "/admin/startups",
      active: pathname === "/admin/startups"
    },
    {
      icon: <FileText size={20} />,
      label: "Evaluaciones",
      href: "/admin/evaluaciones",
      active: pathname === "/admin/evaluaciones"
    },
    {
      icon: <Calendar size={20} />,
      label: "Convocatorias",
      href: "/admin/convocatorias",
      active: pathname === "/admin/convocatorias"
    },
    {
      icon: <Users size={20} />,
      label: "Usuarios",
      href: "/admin/usuarios",
      active: pathname === "/admin/usuarios"
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Reportes",
      href: "/admin/reportes",
      active: pathname === "/admin/reportes"
    },
    {
      icon: <Settings size={20} />,
      label: "Configuración",
      href: "/admin/configuracion",
      active: pathname === "/admin/configuracion"
    }
  ];

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Botón de toggle para móvil */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar */}
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out",
          // En móvil: sidebar deslizable desde la izquierda
          isMobile 
            ? isMobileMenuOpen 
              ? "fixed inset-y-0 left-0 z-40 w-64 shadow-lg transform translate-x-0" 
              : "fixed inset-y-0 left-0 z-40 w-64 shadow-lg transform -translate-x-full"
            : "fixed inset-y-0 left-0 z-40 w-64" // En desktop: sidebar fijo
        )}
      >
        <div className="h-full w-full border-r bg-card p-4 flex flex-col">
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
              <User size={32} className="text-muted-foreground" />
            </div>
            
            {/* Usuario info con datos dinámicos */}
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-32 mb-2 mx-auto"></div>
                <div className="h-3 bg-muted rounded w-24 mx-auto"></div>
              </div>
            ) : (
              <>
                <h2 className="font-medium">
                  Admin
                </h2>
                <p className="text-sm text-muted-foreground">
                  {userData?.email || 'admin@ejemplo.com'}
                </p>
              </>
            )}
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              {adminMenuItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.href}>
                    <Button
                      variant="ghost" 
                      className={cn(
                        "w-full justify-start text-sm font-medium",
                        item.active 
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-foreground hover:bg-muted/50"
                      )}
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.label}</span>
                      {item.active && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Botón de cerrar sesión */}
          <div className="mt-auto pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay para móvil */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isMobile ? "ml-0" : "ml-64"
      )}>
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
} 