"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Building2, 
  Calendar, 
  Mail, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/general/useMediaQuery";

interface SidebarProps {
  onSelectProfile: () => void;
  onSelectStartups: () => void;
  onSelectApplications: () => void;  // Nueva prop para manejar las aplicaciones
  activeView?: string;
}

export default function Sidebar({ 
  onSelectProfile, 
  onSelectStartups,
  onSelectApplications,  // Nuevo parámetro
  activeView = "startups"
}: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Cerrar el menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname, activeView]);

  const menuItems = [
    {
      icon: <User size={20} />,
      label: "Perfil",
      onClick: onSelectProfile,
      active: activeView === "profile"
    },
    {
      icon: <Building2 size={20} />,
      label: "Startups",
      onClick: onSelectStartups,
      active: activeView === "startups" || activeView === "startup-detail"
    },
    {
      icon: <Calendar size={20} />,
      label: "Convocatorias",
      onClick: onSelectApplications,  // Cambiado de href a onClick
      active: activeView === "applications"  // Actualizado para usar activeView
    }
  ];

  // Botón de toggle para móvil - visible solo en dispositivos pequeños
  const mobileToggle = (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden fixed top-4 left-4 z-50"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      aria-label="Toggle menu"
    >
      {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
    </Button>
  );

  return (
    <>
      {mobileToggle}

      <div 
        className={cn(
          "transition-all duration-300 ease-in-out",
          // En móvil: sidebar deslizable desde la izquierda
          isMobile 
            ? isMobileMenuOpen 
              ? "fixed inset-y-0 left-0 z-40 w-64 shadow-lg transform translate-x-0" 
              : "fixed inset-y-0 left-0 z-40 w-64 shadow-lg transform -translate-x-full"
            : "relative h-full w-64" // En desktop: sidebar fijo
        )}
      >
        <div className="h-full w-full border-r bg-card p-4 flex flex-col">
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
              <User size={32} className="text-muted-foreground" />
            </div>
            <h2 className="font-medium">Usuario</h2>
            <p className="text-sm text-muted-foreground">usuario@ejemplo.com</p>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.href ? (
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center w-full px-3 py-2 rounded-md transition-colors text-sm font-medium",
                        item.active 
                          ? "bg-muted text-primary font-medium"
                          : "text-foreground hover:bg-muted/50"
                      )}
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.label}</span>
                      {item.active && <ChevronRight size={16} className="ml-auto" />}
                    </Link>
                  ) : (
                    <Button
                      variant="ghost" 
                      className={cn(
                        "w-full justify-start text-sm font-medium",
                        item.active 
                          ? "bg-muted text-primary font-medium"
                          : "text-foreground hover:bg-muted/50"
                      )}
                      onClick={item.onClick}
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.label}</span>
                      {item.active && <ChevronRight size={16} className="ml-auto" />}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Overlay para cerrar el menú en móvil */}
      {isMobileMenuOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}