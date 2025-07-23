// Configuración centralizada de variables de entorno
export const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

// Validar variables de entorno requeridas
export function validateEnv() {
  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada');
  }
}

// Verificar si estamos en el servidor
export const isServer = typeof window === 'undefined'; 