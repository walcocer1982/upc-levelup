import { env } from '@/lib/utils/env';
import OpenAI from 'openai';

// Configuración de la API de OpenAI
export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Función para generar insights de evaluación de IA
export async function generateAIInsights(postulacionData: any): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto evaluador de startups que proporciona insights sobre fortalezas y áreas de mejora.'
        },
        {
          role: 'user',
          content: `Analiza la siguiente postulación de una startup y proporciona insights sobre sus fortalezas, áreas de mejora y una recomendación general:
          ${JSON.stringify(postulacionData)}`
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'No se pudieron generar insights.';
  } catch (error) {
    console.error('Error al generar insights con IA:', error);
    return 'Ocurrió un error al generar los insights con IA.';
  }
}
