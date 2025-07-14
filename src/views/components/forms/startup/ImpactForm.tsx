"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const impactSchema = z.object({
  // Criterio 1: Nivel de complejidad de la situación que resuelven
  casoReal: z.string().min(10, "Por favor describe un caso real con más detalle"),
  abordajeAnterior: z.string().min(10, "Por favor describe cómo abordaban el problema con más detalle"),
  consecuenciasProblema: z.string().min(10, "Por favor describe las consecuencias con más detalle"),
  otrosAfectados: z.string().min(10, "Por favor describe a otros afectados con más detalle"),
  
  // Criterio 2: Tamaño de mercado
  tamanoMercado: z.string().min(10, "Por favor estima el tamaño del mercado con más detalle"),
  validacionClientes: z.string().min(5, "Por favor indica con cuántos clientes han conversado"),
  disposicionPago: z.string().min(5, "Por favor indica cuántos expresaron disposición a pagar"),
  segmentoInteres: z.string().min(10, "Por favor describe el segmento con más detalle"),
  
  // Criterio 3: Potencial de escalar
  estrategiaAdquisicion: z.string().min(10, "Por favor describe la estrategia con más detalle"),
  costoAdquisicion: z.string().min(5, "Por favor indica el costo de adquisición estimado"),
  facilidadExpansion: z.string().min(10, "Por favor describe la viabilidad de expansión con más detalle"),
  estrategiasEscalabilidad: z.string().min(10, "Por favor describe las estrategias con más detalle"),
  
  // Criterio 4: Equipo emprendedor
  trayectoriaEquipo: z.string().min(5, "Por favor indica cuánto tiempo llevan trabajando juntos"),
  experienciaEquipo: z.string().min(10, "Por favor describe la experiencia del equipo con más detalle"),
  rolesEquipo: z.string().min(10, "Por favor describe los roles con más detalle"),
  superacionDesafios: z.string().min(10, "Por favor describe la situación con más detalle"),
});

type ImpactFormValues = z.infer<typeof impactSchema>;

interface ImpactFormProps {
  onSubmit: (data: ImpactFormValues) => void;
  initialData?: Partial<ImpactFormValues>;
}

export default function ImpactForm({ onSubmit, initialData }: ImpactFormProps) {
  const [activeSection, setActiveSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ImpactFormValues>({
    resolver: zodResolver(impactSchema),
    defaultValues: initialData || {
      // Criterio 1
      casoReal: "",
      abordajeAnterior: "",
      consecuenciasProblema: "",
      otrosAfectados: "",
      
      // Criterio 2
      tamanoMercado: "",
      validacionClientes: "",
      disposicionPago: "",
      segmentoInteres: "",
      
      // Criterio 3
      estrategiaAdquisicion: "",
      costoAdquisicion: "",
      facilidadExpansion: "",
      estrategiasEscalabilidad: "",
      
      // Criterio 4
      trayectoriaEquipo: "",
      experienciaEquipo: "",
      rolesEquipo: "",
      superacionDesafios: "",
    },
  });

  const handleSubmit = (data: ImpactFormValues) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmit(data);
      setIsSubmitting(false);
    }, 500);
  };

  // Renderizar un campo de texto
  const renderTextareaField = (
    name: keyof ImpactFormValues, 
    label: string, 
    placeholder: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel className="font-medium">{label}</FormLabel>
          <FormControl>
            <Textarea 
              placeholder={placeholder} 
              className="min-h-[100px]" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold">Impacto de tu Startup</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comparte información detallada sobre el problema que resuelves y tu potencial de crecimiento
        </p>
      </div>
      
      <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
          <Button 
            variant={activeSection === 1 ? "default" : "outline"} 
            size="sm"
            className="text-xs sm:text-sm px-2 sm:px-3"
            onClick={() => setActiveSection(1)}
          >
            Complejidad
          </Button>
          <Button 
            variant={activeSection === 2 ? "default" : "outline"} 
            size="sm"
            className="text-xs sm:text-sm px-2 sm:px-3"
            onClick={() => setActiveSection(2)}
          >
            Mercado
          </Button>
          <Button 
            variant={activeSection === 3 ? "default" : "outline"} 
            size="sm"
            className="text-xs sm:text-sm px-2 sm:px-3"
            onClick={() => setActiveSection(3)}
          >
            Escalabilidad
          </Button>
          <Button 
            variant={activeSection === 4 ? "default" : "outline"} 
            size="sm"
            className="text-xs sm:text-sm px-2 sm:px-3"
            onClick={() => setActiveSection(4)}
          >
            Equipo
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6">
            {/* Secciones/Criterios */}
            <div className="space-y-4">
              {/* Criterio 1: Nivel de complejidad de la situación que resuelven */}
              {activeSection === 1 && (
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-lg mb-1">Nivel de complejidad de la situación que resuelven</h3>
                      <p className="text-sm text-muted-foreground">
                        Estas preguntas buscan entender qué tan relevante y significativo es el problema que tu startup resuelve para tus clientes. 
                        Queremos ver evidencia de que conoces a fondo la situación que tu solución aborda.
                      </p>
                    </div>
                    
                    {renderTextareaField(
                      "casoReal",
                      "Cuéntanos sobre un caso real y reciente",
                      "Describe un ejemplo concreto de una persona o empresa que haya enfrentado el problema que ustedes resuelven. ¿Qué pasó exactamente y cómo lo vivieron?"
                    )}
                    
                    {renderTextareaField(
                      "abordajeAnterior",
                      "¿Cómo abordaban el problema antes de su solución?",
                      "Antes de conocer tu propuesta, ¿qué métodos o herramientas utilizaban para manejar esta situación? ¿Cuáles eran sus principales limitaciones o ineficiencias?"
                    )}
                    
                    {renderTextareaField(
                      "consecuenciasProblema",
                      "¿Qué consecuencias tenía no resolver bien este problema?",
                      "¿Qué impacto negativo (pérdidas de tiempo, dinero, oportunidades, etc.) experimentaban al no tener una solución efectiva para esta situación? Si es posible, cuantifica estas consecuencias."
                    )}
                    
                    {renderTextareaField(
                      "otrosAfectados",
                      "¿Han identificado a otros afectados?",
                      "¿Cuántas personas o empresas conoces que hayan enfrentado situaciones similares? ¿Cómo validaron esta información?"
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Criterio 2: Tamaño de mercado */}
              {activeSection === 2 && (
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-lg mb-1">Tamaño de mercado</h3>
                      <p className="text-sm text-muted-foreground">
                        Aquí nos interesa comprender el potencial de crecimiento de tu startup, 
                        cuántos clientes existen para tu solución y qué tan grande puede llegar a ser el impacto.
                      </p>
                    </div>
                    
                    {renderTextareaField(
                      "tamanoMercado",
                      "Estima el tamaño de tu mercado",
                      "¿Cuántas personas o empresas crees que enfrentan este problema hoy? ¿Cómo llegaron a esa estimación? (Indica tus fuentes o metodología de cálculo)."
                    )}
                    
                    {renderTextareaField(
                      "validacionClientes",
                      "Validación con potenciales clientes",
                      "¿Con cuántos potenciales clientes han conversado ya sobre este problema y su posible solución?"
                    )}
                    
                    {renderTextareaField(
                      "disposicionPago",
                      "Interés en pagar por la solución",
                      "De esas conversaciones, ¿cuántos expresaron claramente su disposición a pagar por una solución que resuelva este problema?"
                    )}
                    
                    {renderTextareaField(
                      "segmentoInteres",
                      "Segmento de mayor interés",
                      "Hasta ahora, ¿qué tipo de clientes (segmento) ha mostrado mayor interés en tu propuesta? Describe sus características principales."
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Criterio 3: Potencial de escalar */}
              {activeSection === 3 && (
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-lg mb-1">Potencial de escalar</h3>
                      <p className="text-sm text-muted-foreground">
                        Queremos entender cómo tu startup crecerá y llegará a más clientes de manera eficiente. 
                        Nos interesa tu estrategia para expandirte sin que los costos aumenten desproporcionadamente.
                      </p>
                    </div>
                    
                    {renderTextareaField(
                      "estrategiaAdquisicion",
                      "Estrategia de adquisición de primeros clientes",
                      "¿Cómo planean conseguir o cómo consiguieron a sus primeros clientes? Describe el proceso."
                    )}
                    
                    {renderTextareaField(
                      "costoAdquisicion",
                      "Costo de adquisición de clientes (CAC)",
                      "¿Tienen una estimación de cuánto les costará adquirir a un cliente, tanto en dinero como en tiempo? Si ya tienen clientes, ¿cuál ha sido el costo real?"
                    )}
                    
                    {renderTextareaField(
                      "facilidadExpansion",
                      "Facilidad de expansión",
                      "¿Qué tan viable es multiplicar tu base de clientes sin que los costos operativos y de adquisición crezcan al mismo ritmo? ¿Qué elementos de tu modelo de negocio lo permiten?"
                    )}
                    
                    {renderTextareaField(
                      "estrategiasEscalabilidad",
                      "Estrategias de escalabilidad probadas",
                      "¿Han experimentado ya con alguna estrategia para escalar su operación o adquisición de clientes? ¿Qué resultados obtuvieron y qué aprendizajes clave les dejó?"
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Criterio 4: Equipo emprendedor */}
              {activeSection === 4 && (
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-lg mb-1">Equipo emprendedor</h3>
                      <p className="text-sm text-muted-foreground">
                        El equipo es uno de los pilares más importantes de una startup. 
                        Queremos conocer la solidez, experiencia y cohesión de tu equipo.
                      </p>
                    </div>
                    
                    {renderTextareaField(
                      "trayectoriaEquipo",
                      "Trayectoria del equipo en el proyecto",
                      "¿Cuánto tiempo llevan trabajando juntos en este proyecto? ¿Es a tiempo completo o parcial?"
                    )}
                    
                    {renderTextareaField(
                      "experienciaEquipo",
                      "Experiencia relevante del equipo",
                      "¿Qué experiencia o conocimiento tienen en el sector o la industria en la que se enfoca su startup?"
                    )}
                    
                    {renderTextareaField(
                      "rolesEquipo",
                      "Roles y responsabilidades clave",
                      "¿Cómo distribuyen las responsabilidades y tareas dentro del equipo para el desarrollo y crecimiento del proyecto?"
                    )}
                    
                    {renderTextareaField(
                      "superacionDesafios",
                      "Superación de desafíos",
                      "Cuéntanos una situación difícil o un obstáculo importante que hayan superado juntos como equipo. ¿Qué aprendieron de esa experiencia?"
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar información"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}