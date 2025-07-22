"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requiredRole?: "usuario" | "admin", requireRegistration = true) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si aún está cargando, no hacer nada
    if (status === "loading") return;

    // Si no está autenticado, redirigir a la página principal
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    // Si requiere registro y el usuario no está registrado
    if (requireRegistration && session?.user && !session.user.isRegistered) {
      router.push("/");
      return;
    }

    // Si requiere un rol específico
    if (requiredRole && session?.user && session.user.role !== requiredRole) {
      // Los admins pueden acceder a todo
      if (session.user.role !== "admin") {
        router.push("/denied");
        return;
      }
    }
  }, [session, status, requiredRole, requireRegistration, router]);

  return {
    session,
    status,
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isAdmin: session?.user?.role === "admin",
    isUser: session?.user?.role === "usuario",
    isRegistered: session?.user?.isRegistered,
    hasAcceptedPolicy: session?.user?.haAceptadoPolitica,
  };
}

export function useRequireAuth(requiredRole?: "usuario" | "admin") {
  return useAuth(requiredRole, true);
}

export function useOptionalAuth() {
  return useAuth(undefined, false);
} 