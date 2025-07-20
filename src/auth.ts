import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { DefaultSession } from "next-auth";
import { getMockData } from "@/data/mock";

// Extender tipos para Auth.js v5
declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      isRegistered: boolean;
      userId?: string;
    } & DefaultSession["user"];
  }

  // Definición de User para Auth.js v5
  interface User {
    role?: string;
    isRegistered?: boolean;
    userId?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // En Auth.js v5, jwt sigue siendo usado pero maneja internamente las conversiones
    async jwt({ token, user, account }) {
      console.log("Callback JWT ejecutado");

      // Si es la primera vez que se genera el token (login)
      if (user && account) {
        try {
          // Verificar si el usuario existe en los datos mock
          let dbUser = getMockData.getUserByEmail(user.email!);

          // Si no existe el usuario, crear uno simulado
          if (!dbUser) {
            // Simular creación de usuario
            dbUser = {
              id: `user-${Date.now()}`,
                email: user.email!,
              nombres: user.name?.split(" ")[0] || "",
              apellidos: user.name?.split(" ").slice(1).join(" ") || "",
              role: user.email === "walcocer.1982@gmail.com" ? "ADMIN" : "FUNDADOR",
                haAceptadoPolitica: false,
                isRegistered: false,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            console.log("Nuevo usuario simulado creado:", dbUser.email);
          }
          
          // Determinar si está registrado
          const isRegistered = !!dbUser?.isRegistered;
          
          // Determinar el rol basado en los datos mock o email específico
          const isAdmin = user.email === "walcocer.1982@gmail.com";
          const role = dbUser?.role || (isAdmin ? "admin" : "usuario");

          // Añadir información adicional al token
          token.role = role;
          token.isRegistered = isRegistered;
          token.userId = dbUser?.id;

          console.log("Token generado (MOCK):", token); // Depuración
        } catch (error) {
          console.error("Error verificando/creando usuario (MOCK):", error);
          // Si hay error, establecer valores predeterminados
          token.role = user.email === "walcocer.1982@gmail.com" ? "admin" : "usuario";
          token.isRegistered = false;
        }
      }

      return token;
    },

    // Añadir información adicional a la sesión
    async session({ session, token }) {
      console.log("Callback Session ejecutado");

      if (session.user) {
        // Añadir información al objeto de sesión
        session.user.role = token.role as string;
        session.user.isRegistered = token.isRegistered as boolean;
        session.user.userId = token.userId as string | undefined;

        console.log("Sesión generada:", session); // Depuración
      }

      return session;
    },

    // Registrar login/signup en callback signIn (MOCK)
    async signIn({ user, account }) {
      try {
        // Simular búsqueda de usuario en datos mock
        const dbUser = getMockData.getUserByEmail(user.email!);
        const isNewUser = !dbUser;
        const action = isNewUser ? 'signup' : 'login';
        
        console.log(`${action.toUpperCase()} simulado para usuario:`, user.email);
        
        // No necesitamos registrar en base de datos real
        console.log("Evento de sesión simulado (MOCK)");
      } catch (error) {
        console.error(`Error en el proceso de autenticación (MOCK):`, error);
      }

      return true; // Continuar con el proceso de autenticación
    },

    // Redirección personalizada basada en el estado del usuario
    async redirect({ url, baseUrl }) {
      // Si es nuestra URL de redirección específica, permitirla
      if (url.includes("/auth-redirect")) {
        return url;
      }

      // Si es una URL relativa, adjuntar el baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Si es una URL del mismo origen, permitirla
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      // Por defecto, redirigir a la raíz
      return baseUrl;
    },
  },
  pages: {
    signIn: '/', // Página de login personalizada
    error: '/auth/error', // Página de error de autenticación
  }
});