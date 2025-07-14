"use client";

import { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  activeView?: "profile" | "startups" | "startup-detail" | "applications";
  onSelectProfile?: () => void;
  onSelectStartups?: () => void;
  onSelectApplications?: () => void;
}

export default function Layout({
  children,
  activeView = "startups",
  onSelectProfile = () => {},
  onSelectStartups = () => {},
  onSelectApplications = () => {},
}: LayoutProps) {
  // Estado para manejo responsive
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Detectar cambios de tamaño para cerrar sidebar automáticamente en desktop
  useEffect(() => {
    setIsMounted(true);
    
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cerrar sidebar al hacer clic fuera de ella
  const handleMainClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  // Versión simple para el servidor o mientras carga
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="w-full bg-primary text-primary-foreground p-4 shadow-md">
          {/* Placeholder del Header */}
        </div>
        <div className="flex flex-1">
          <div className="hidden lg:block h-full w-64 border-r bg-card p-4"></div>
          <main className="flex-1 p-4 sm:p-6">
            {/* Un esqueleto o nada mientras carga */}
          </main>
        </div>
      </div>
    );
  }

  // Versión completa solo para el cliente
  return (
    <div className="min-h-screen flex flex-col">
      <Header>
        {/* Botón de menú para móviles */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </Header>

      <div className="flex flex-1 relative">
        {/* Sidebar - Versión desktop (siempre visible) */}
        <div className="hidden lg:block h-full w-64 border-r bg-card">
          <Sidebar
            activeView={activeView}
            onSelectProfile={onSelectProfile}
            onSelectStartups={onSelectStartups}
            onSelectApplications={onSelectApplications}
          />
        </div>

        {/* Sidebar - Versión móvil (modal/drawer) */}
        <div
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all lg:hidden",
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r shadow-lg transition-transform duration-300 ease-in-out",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              activeView={activeView}
              onSelectProfile={() => {
                onSelectProfile();
                setIsSidebarOpen(false);
              }}
              onSelectStartups={() => {
                onSelectStartups();
                setIsSidebarOpen(false);
              }}
              onSelectApplications={() => {
                onSelectApplications();
                setIsSidebarOpen(false);
              }}
            />
          </div>
        </div>

        {/* Contenido principal */}
        <main 
          className="flex-1 p-4 sm:p-6 overflow-y-auto" 
          onClick={handleMainClick}
        >
          {children}
        </main>
      </div>
    </div>
  );
}