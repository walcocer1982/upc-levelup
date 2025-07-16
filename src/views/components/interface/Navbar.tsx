"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              UPC-LevelUp
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                Inicio
              </Link>
              
              <Link
                href="/evaluaciones"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/evaluaciones")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                Evaluaciones
              </Link>
              
              <Link
                href="/(auth)/register/startup/impact"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/(auth)/register/startup/impact")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                Evaluar Startup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 