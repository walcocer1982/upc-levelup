import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// import { prisma } from "@/lib/prisma";

// Los tipos están definidos en src/types/next-auth.d.ts



export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("🔐 Callback JWT ejecutado");

      // Si es la primera vez que se genera el token (login)
      if (user && account) {
        try {
          // TEMPORAL: Usar datos mock mientras solucionamos Prisma
          console.log("🆕 Usando datos mock temporalmente:", user.email);
          
          // Determinar rol basado en email específico
          const isAdmin = user.email === "walcocer.1982@gmail.com";
          const role = isAdmin ? "admin" : "usuario";
          
          // Crear usuario mock
          const dbUser = {
            id: `user-${Date.now()}`,
            email: user.email!,
            nombres: user.name?.split(" ")[0] || "",
            apellidos: user.name?.split(" ").slice(1).join(" ") || "",
            dni: "00000000",
            telefono: "000000000",
            role: role,
            haAceptadoPolitica: false,
            isRegistered: false,
          };
          
                  // Añadir información adicional al token
        token.id = dbUser.id;
        token.role = (dbUser.role as "usuario" | "admin") || "usuario";
        token.isRegistered = dbUser.isRegistered || false;
        token.haAceptadoPolitica = dbUser.haAceptadoPolitica || false;
        token.nombres = dbUser.nombres || undefined;
        token.apellidos = dbUser.apellidos || undefined;
        token.dni = dbUser.dni || undefined;

          console.log("🎫 Token generado:", {
            id: token.id,
            email: token.email,
            role: token.role,
            isRegistered: token.isRegistered
          });
        } catch (error) {
          console.error("❌ Error verificando/creando usuario:", error);
          // Si hay error, establecer valores predeterminados
          token.role = (user.email === "walcocer.1982@gmail.com" ? "admin" : "usuario") as "usuario" | "admin";
          token.isRegistered = false;
          token.haAceptadoPolitica = false;
        }
      }

      return token;
    },

    async session({ session, token }) {
      console.log("🔐 Callback Session ejecutado");

      if (session.user) {
        // Añadir información al objeto de sesión usando type assertion
        const tokenData = token as any;
        session.user.id = tokenData.id || "";
        session.user.role = tokenData.role || "usuario";
        session.user.isRegistered = tokenData.isRegistered || false;
        session.user.haAceptadoPolitica = tokenData.haAceptadoPolitica || false;
        session.user.nombres = tokenData.nombres;
        session.user.apellidos = tokenData.apellidos;
        session.user.dni = tokenData.dni;

        console.log("👤 Sesión generada:", {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role,
          isRegistered: session.user.isRegistered
        });
      }

      return session;
    },

    async signIn({ user, account }) {
      try {
        console.log("🔐 SignIn callback ejecutado para:", user.email);
        
        // TEMPORAL: Usar datos mock mientras solucionamos Prisma
        const action = 'LOGIN';
        console.log(`✅ ${action} exitoso para usuario:`, user.email);
        
        // TEMPORAL: No registrar en BD por ahora
        console.log("📝 Evento de sesión simulado (temporal)");
        
      } catch (error) {
        console.error("❌ Error en el proceso de autenticación:", error);
      }

      return true; // Continuar con el proceso de autenticación
    },

    async redirect({ url, baseUrl }) {
      console.log("🔄 Redirect callback:", { url, baseUrl });
      
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
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
});