"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (status === "loading") return;

      if (status === "authenticated" && session) {
        try {
          // Verificar si el usuario está registrado
          const response = await fetch('/api/auth/check-user');
          const data = await response.json();
          
          if (data.isRegistered) {
            // Si está registrado, redirigir según rol
            const redirectPath = data.role === "admin" ? "/admin" : "/user";
            router.replace(redirectPath);
          } else {
            // Si no está registrado, redirigir a completar perfil
            router.replace("/user");
          }
        } catch (error) {
          console.error("Error verificando estado del usuario:", error);
          router.replace("/auth/error");
        }
      } else {
        router.replace("/");
      }
    };

    checkUserStatus();
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirigiendo...</p>
      </div>
    </div>
  );
}