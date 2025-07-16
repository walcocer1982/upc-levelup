"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveResponse, saveEvaluation } from "@/lib/storage/local-storage";

const formSchema = z.object({
  // Criterio 1
  casoReal: z.string().min(1, "Este campo es obligatorio"),
  abordajePrevio: z.string().min(1, "Este campo es obligatorio"),
  consecuenciasNoResolucion: z.string().min(1, "Este campo es obligatorio"),
  identificacionAfectados: z.string().min(1, "Este campo es obligatorio"),
  
  // Criterio 2
  tamanoMercado: z.string().min(1, "Este campo es obligatorio"),
  validacionClientes: z.string().min(1, "Este campo es obligatorio"),
  interesPagar: z.string().min(1, "Este campo es obligatorio"),
  segmentoInteres: z.string().min(1, "Este campo es obligatorio"),
  
  // Criterio 3
  estrategiaAdquisicion: z.string().min(1, "Este campo es obligatorio"),
  costoAdquisicion: z.string().min(1, "Este campo es obligatorio"),
  facilidadExpansion: z.string().min(1, "Este campo es obligatorio"),
  estrategiasEscalabilidad: z.string().min(1, "Este campo es obligatorio"),
  
  // Criterio 4
  trayectoriaEquipo: z.string().min(1, "Este campo es obligatorio"),
  experienciaEquipo: z.string().min(1, "Este campo es obligatorio"),
  rolesResponsabilidades: z.string().min(1, "Este campo es obligatorio"),
  superacionDesafios: z.string().min(1, "Este campo es obligatorio"),
});

type FormValues = z.infer<typeof formSchema>;

export default function StartupImpactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [startupName, setStartupName] = useState<string>("Mi Startup");
  const router = useRouter();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      casoReal: "",
      abordajePrevio: "",
      consecuenciasNoResolucion: "",
      identificacionAfectados: "",
      tamanoMercado: "",
      validacionClientes: "",
      interesPagar: "",
      segmentoInteres: "",
      estrategiaAdquisicion: "",
      costoAdquisicion: "",
      facilidadExpansion: "",
      estrategiasEscalabilidad: "",
      trayectoriaEquipo: "",
      experienciaEquipo: "",
      rolesResponsabilidades: "",
      superacionDesafios: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    setEvaluationResult(null);
    setEvaluationError(null);
    
    try {
      // Preparar datos para la evaluación
      const criterios = [
        {
          nombre: "Nivel de complejidad de la problemática",
          respuesta: `
            Caso real: ${data.casoReal}
            Abordaje previo: ${data.abordajePrevio}
            Consecuencias de no resolución: ${data.consecuenciasNoResolucion}
            Identificación de afectados: ${data.identificacionAfectados}
          `
        },
        {
          nombre: "Tamaño de mercado",
          respuesta: `
            Tamaño de mercado: ${data.tamanoMercado}
            Validación con clientes: ${data.validacionClientes}
            Interés en pagar: ${data.interesPagar}
            Segmento de interés: ${data.segmentoInteres}
          `
        },
        {
          nombre: "Potencial de escalar",
          respuesta: `
            Estrategia de adquisición: ${data.estrategiaAdquisicion}
            Costo de adquisición: ${data.costoAdquisicion}
            Facilidad de expansión: ${data.facilidadExpansion}
            Estrategias de escalabilidad: ${data.estrategiasEscalabilidad}
          `
        },
        {
          nombre: "Equipo emprendedor",
          respuesta: `
            Trayectoria del equipo: ${data.trayectoriaEquipo}
            Experiencia relevante: ${data.experienciaEquipo}
            Roles y responsabilidades: ${data.rolesResponsabilidades}
            Superación de desafíos: ${data.superacionDesafios}
          `
        }
      ];
      
      // Guardar respuestas en localStorage
      const savedResponse = saveResponse({
        startupName,
        responses: criterios.map(c => ({
          criterioId: c.nombre === "Nivel de complejidad de la problemática" ? "complejidad_problema" :
                      c.nombre === "Tamaño de mercado" ? "tamano_mercado" :
                      c.nombre === "Potencial de escalar" ? "escalabilidad" :
                      "equipo_emprendedor",
          nombre: c.nombre,
          respuesta: c.respuesta
        }))
      });
      
      // Llamar a la API de evaluación
      const response = await fetch('/api/startup/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startupName,
          criterios
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error al evaluar: ${response.statusText}`);
      }
      
      const result = await response.json();
      setEvaluationResult(result);
      
      // Guardar evaluación en localStorage
      saveEvaluation({
        startupResponseId: savedResponse.id,
        global: result.global,
        resultados: result.resultados,
        observations: result.observations,
        recommendations: result.recommendations,
        strengths: result.strengths,
        weaknesses: result.weaknesses
      });
      
      console.log("Datos del formulario:", data);
      console.log("Resultado de evaluación:", result);
      
    } catch (error) {
      console.error('Error en la evaluación:', error);
      setEvaluationError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  }

  const nextSection = () => {
    if (activeSection < 4) {
      setActiveSection(activeSection + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevSection = () => {
    if (activeSection > 1) {
      setActiveSection(activeSection - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const viewAllEvaluations = () => {
    router.push('/evaluaciones');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Impacto de tu Startup</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Cuéntanos sobre el problema que resuelves y el impacto que generarás
          </p>
        </div>
        
        {evaluationError && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{evaluationError}</AlertDescription>
          </Alert>
        )}
        
        {evaluationResult ? (
          <Card>
            <CardHeader>
              <CardTitle>Resultado de la Evaluación</CardTitle>
              <CardDescription>
                Puntuación global: {evaluationResult.global.toFixed(1)}/4
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Resultados por criterio:</h3>
                <ul className="mt-2 space-y-2">
                  {evaluationResult.resultados.map((resultado: any, idx: number) => (
                    <li key={idx} className="border-l-4 pl-3" style={{ borderColor: getScoreColor(resultado.score) }}>
                      <div className="flex justify-between">
                        <span className="font-medium">{resultado.nombre}</span>
                        <span>{resultado.score}/4</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{resultado.razones}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Fortalezas:</h3>
                <ul className="list-disc pl-5 mt-1">
                  {evaluationResult.strengths.map((strength: string, idx: number) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Áreas de mejora:</h3>
                <ul className="list-disc pl-5 mt-1">
                  {evaluationResult.weaknesses.map((weakness: string, idx: number) => (
                    <li key={idx}>{weakness}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Recomendaciones:</h3>
                <ul className="list-disc pl-5 mt-1">
                  {evaluationResult.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  className="flex-1" 
                  onClick={() => {
                    setEvaluationResult(null);
                    setActiveSection(1);
                    form.reset();
                  }}
                >
                  Nueva evaluación
                </Button>
                <Button 
                  className="flex-1" 
                  variant="outline"
                  onClick={viewAllEvaluations}
                >
                  Ver todas las evaluaciones
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between mb-6">
              <Button 
                variant={activeSection === 1 ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveSection(1)}
              >
                Complejidad
              </Button>
              <Button 
                variant={activeSection === 2 ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveSection(2)}
              >
                Mercado
              </Button>
              <Button 
                variant={activeSection === 3 ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveSection(3)}
              >
                Escalabilidad
              </Button>
              <Button 
                variant={activeSection === 4 ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveSection(4)}
              >
                Equipo
              </Button>
            </div>
            
            {activeSection === 1 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nombre de la Startup</label>
                <input
                  type="text"
                  value={startupName}
                  onChange={(e) => setStartupName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Ingresa el nombre de tu startup"
                />
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Criterio 1 */}
                {activeSection === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold">Nivel de complejidad de la situación</h2>
                      <p className="text-sm text-muted-foreground">
                        Estas preguntas buscan entender qué tan relevante es el problema que tu startup resuelve.
                      </p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="casoReal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Cuéntanos sobre un caso real y reciente
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe un ejemplo concreto de una persona o empresa que haya enfrentado el problema que ustedes resuelven."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="abordajePrevio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            ¿Cómo abordaban el problema antes?
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Antes de conocer tu propuesta, ¿qué métodos utilizaban para manejar esta situación?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="consecuenciasNoResolucion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Consecuencias del problema
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="¿Qué impacto negativo experimentaban al no tener una solución efectiva?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="identificacionAfectados"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Identificación de afectados
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="¿Cuántas personas o empresas conoces que hayan enfrentado situaciones similares?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {/* Criterio 2 */}
                {activeSection === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold">Tamaño de mercado</h2>
                      <p className="text-sm text-muted-foreground">
                        Aquí nos interesa comprender el potencial de crecimiento de tu startup.
                      </p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="tamanoMercado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Estima el tamaño de tu mercado
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="¿Cuántas personas o empresas crees que enfrentan este problema hoy?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="validacionClientes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Validación con potenciales clientes
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="¿Con cuántos potenciales clientes han conversado sobre este problema?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interesPagar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Interés en pagar por la solución
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="¿Cuántos expresaron claramente su disposición a pagar por una solución?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="segmentoInteres"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Segmento de mayor interés
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="¿Qué tipo de clientes ha mostrado mayor interés en tu propuesta?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {/* Criterio 3 */}
                {activeSection === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold">Potencial de escalar</h2>
                      <p className="text-sm text-muted-foreground">
                        Queremos entender cómo tu startup crecerá y llegará a más clientes.
                      </p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="estrategiaAdquisicion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Estrategia de adquisición de clientes
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="¿Cómo planean conseguir a sus primeros clientes?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="costoAdquisicion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Costo de adquisición (CAC)
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="¿Cuánto les costará adquirir a un cliente, en dinero y tiempo?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="facilidadExpansion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Facilidad de expansión
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="¿Qué tan viable es multiplicar tu base de clientes sin que los costos crezcan al mismo ritmo?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="estrategiasEscalabilidad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Estrategias de escalabilidad probadas
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="¿Han experimentado ya con alguna estrategia para escalar su operación?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {/* Criterio 4 */}
                {activeSection === 4 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold">Equipo emprendedor</h2>
                      <p className="text-sm text-muted-foreground">
                        El equipo es uno de los pilares más importantes de una startup.
                      </p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="trayectoriaEquipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Trayectoria del equipo
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="¿Cuánto tiempo llevan trabajando juntos en este proyecto?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="experienciaEquipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Experiencia relevante
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="¿Qué experiencia tienen en el sector de su startup?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rolesResponsabilidades"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Roles y responsabilidades
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="¿Cómo distribuyen las responsabilidades dentro del equipo?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="superacionDesafios"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Superación de desafíos
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Cuéntanos una situación difícil que hayan superado como equipo."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                <div className="flex justify-between pt-4">
                  {activeSection > 1 ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={prevSection}
                    >
                      Anterior
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  
                  {activeSection < 4 ? (
                    <Button 
                      type="button" 
                      onClick={nextSection}
                    >
                      Siguiente
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Evaluando...
                        </>
                      ) : (
                        "Evaluar startup"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}

// Función auxiliar para obtener color según puntuación
function getScoreColor(score: number): string {
  if (score <= 1) return '#ef4444'; // Rojo
  if (score <= 2) return '#f97316'; // Naranja
  if (score <= 3) return '#3b82f6'; // Azul
  return '#22c55e'; // Verde
}