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

  function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    // Aquí implementarías la lógica para guardar los datos
    console.log(data);
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Información registrada con éxito");
    }, 1500);
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Impacto de tu Startup</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Cuéntanos sobre el problema que resuelves y el impacto que generarás
          </p>
        </div>
        
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
                    {isSubmitting ? "Enviando..." : "Completar registro"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}