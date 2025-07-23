import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

// Extender tipos de NextAuth para incluir nuestros campos personalizados
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
      isRegistered: boolean;
      haAceptadoPolitica: boolean;
    };
  }
  
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: string;
    isRegistered: boolean;
    haAceptadoPolitica: boolean;
  }
}

// Los tipos de JWT están definidos en src/types/next-auth.d.ts

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
  
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("🔐 Callback JWT ejecuta");
      
      if (user && account) {
        try {
          // Buscar usuario en la base de datos real
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });

          // Si no existe el usuario, crear uno nuevo
          if (!dbUser) {
            console.log("🆕 Creando nuevo usuario en BD:", user.email);
            
            // Determinar rol basado en email específico
            const adminEmails = [
              "walcocer.1982@gmail.com",
              "walther.alcocer@cetemin.edu.pe",
              "walther.alcocer@gmail.com",
              "m.limaco0191@gmail.com"
            ];
            const isAdmin = adminEmails.includes(user.email!);
            const role = isAdmin ? "admin" : "usuario";

            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                nombres: user.name?.split(" ")[0] || "",
                apellidos: user.name?.split(" ").slice(1).join(" ") || "",
                dni: "00000000", // DNI temporal
                telefono: "000000000", // Teléfono temporal
                role: role,
                haAceptadoPolitica: false,
                isRegistered: false,
              }
            });
            
            console.log("✅ Usuario creado exitosamente:", dbUser.email);
          } else {
            console.log("✅ Usuario encontrado en BD:", dbUser.email);
          }

          // Actualizar token con datos del usuario de la BD
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.nombres + " " + dbUser.apellidos;
          token.role = dbUser.role;
          token.isRegistered = dbUser.isRegistered;
          token.haAceptadoPolitica = dbUser.haAceptadoPolitica;
          
        } catch (error) {
          console.error("❌ Error en callback JWT:", error);
          // En caso de error, usar datos básicos del usuario
          token.id = user.id || "";
          token.email = user.email || "";
          token.name = user.name || "";
          token.role = "usuario";
          token.isRegistered = false;
          token.haAceptadoPolitica = false;
        }
      }
      
      return token;
    },

    async session({ session, token }) {
      console.log("🔐 Callback Session ejecutado");
      
      // Asignar datos del token a la sesión
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string | null;
      session.user.role = token.role as string;
      session.user.isRegistered = token.isRegistered as boolean;
      session.user.haAceptadoPolitica = token.haAceptadoPolitica as boolean;
      
      console.log("👤 Sesión generada:", {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        isRegistered: session.user.isRegistered
      });
      
      return session;
    },

    async signIn({ user, account }) {
      console.log("🔐 Callback SignIn ejecutado");
      
      try {
        // Buscar usuario en la base de datos
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });

        if (dbUser) {
          // Registrar el evento de sesión
          await prisma.sessionLog.create({
            data: {
              userId: dbUser.id,
              email: dbUser.email,
              action: "signin",
              provider: account?.provider || "google"
            }
          });
          
          console.log("📝 Sesión registrada para:", dbUser.email);
        }
        
        return true;
      } catch (error) {
        console.error("❌ Error en signIn callback:", error);
        return true; // Permitir el signin incluso si hay error en el registro
      }
    }
  },
  
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
});