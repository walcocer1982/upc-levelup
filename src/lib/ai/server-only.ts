// Configuración que solo se ejecuta en el servidor
// Este archivo no debe ser importado en el cliente

import OpenAI from 'openai';

// Verificar que estamos en el servidor
if (typeof window !== 'undefined') {
  throw new Error('Este módulo solo debe ejecutarse en el servidor');
}

// Configuración de OpenAI solo para servidor
export const serverOpenAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Verificar que la API key esté disponible
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY no está configurada en el servidor');
} 