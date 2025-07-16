import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role: "usuario" | "admin";
      isRegistered: boolean;
      haAceptadoPolitica: boolean;
      nombres?: string;
      apellidos?: string;
    };
  }

  interface User {
    role: "usuario" | "admin";
    isRegistered: boolean;
    haAceptadoPolitica: boolean;
    nombres?: string;
    apellidos?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "usuario" | "admin";
    isRegistered: boolean;
  }
}