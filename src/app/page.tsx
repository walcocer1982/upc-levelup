"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold">UPC-LevelUp</h1>
        <p className="text-xl text-muted-foreground">
          Sistema de evaluación de startups con inteligencia artificial
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Link href="/evaluaciones/form" className="w-full">
            <Button size="lg" className="w-full">
              Evaluar una Startup
            </Button>
          </Link>
          
          <Link href="/evaluaciones" className="w-full">
            <Button size="lg" variant="outline" className="w-full">
              Ver evaluaciones
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
              <h3 className="font-medium">Completa el formulario</h3>
              <p className="text-sm text-muted-foreground">
                Responde las preguntas sobre tu startup en las cuatro áreas clave: Complejidad, Mercado, Escalabilidad y Equipo.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
              <h3 className="font-medium">Evaluación con IA</h3>
              <p className="text-sm text-muted-foreground">
                Nuestro sistema analiza tus respuestas utilizando embeddings y las compara con una base de conocimiento experto.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
              <h3 className="font-medium">Recibe feedback detallado</h3>
              <p className="text-sm text-muted-foreground">
                Obtén una evaluación detallada con puntuaciones, fortalezas, debilidades y recomendaciones específicas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
