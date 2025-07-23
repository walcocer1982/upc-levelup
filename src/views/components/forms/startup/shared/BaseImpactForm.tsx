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
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const impactSchema = z.object({
  // Criterio 1: Nivel de complejidad de la situación que resuelven
  casoReal: z.string().optional(),
  abordajeProblema: z.string().optional(),
  consecuencias: z.string().optional(),
  afectados: z.string().optional(),

  // Criterio 2: Tamaño de mercado
  tamanoMercado: z.string().optional(),
  potencialesClientes: z.string().optional(),
  interesPagar: z.string().optional(),
  segmentoInteres: z.string().optional(),

  // Criterio 3: Potencial de escalar
  estrategiaAdquisicion: z.string().optional(),
  costoAdquisicion: z.string().optional(),
  facilidadExpansion: z.string().optional(),
  escalabilidad: z.string().optional(),

  // Criterio 4: Equipo emprendedor
  trayectoria: z.string().optional(),
  experiencia: z.string().optional(),
  roles: z.string().optional(),
  desafios: z.string().optional(),
});

type ImpactFormValues = z.infer<typeof impactSchema>;

interface BaseImpactFormProps {
  onSubmit: (data: ImpactFormValues) => void;
  initialData?: Partial<ImpactFormValues>;
  startupId?: string;
  mode?: 'admin' | 'user';
  title?: string;
  submitButtonText?: string;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export default function BaseImpactForm({ 
  onSubmit, 
  initialData, 
  startupId,
  mode = 'user',
  title = "Impacto de tu Startup",
  submitButtonText = "Guardar Impacto",
  onCancel,
  showCancelButton = false
}: BaseImpactFormProps) {
  const [activeSection, setActiveSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ImpactFormValues>({
    resolver: zodResolver(impactSchema),
    defaultValues: initialData || {
      // Criterio 1
      casoReal: "",
      abordajeProblema: "",
      consecuencias: "",
      afectados: "",

      // Criterio 2
      tamanoMercado: "",
      potencialesClientes: "",
      interesPagar: "",
      segmentoInteres: "",

      // Criterio 3
      estrategiaAdquisicion: "",
      costoAdquisicion: "",
      facilidadExpansion: "",
      escalabilidad: "",

      // Criterio 4
      trayectoria: "",
      experiencia: "",
      roles: "",
      desafios: "",
    },
  });

  // Cargar datos existentes al montar el componente
  const loadImpactData = useCallback(async () => {
    if (!startupId) {
      console.log("🔄 Sin startupId, formulario vacío");
      return;
    }

    try {
      console.log("🔍 Cargando impact para startup:", startupId);
      setIsLoading(true);

      const response = await fetch(`/api/startups/impact?startupId=${startupId}`);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Datos de impacto cargados:", data);
        
        if (data.impact) {
          form.reset(data.impact);
        }
      } else {
        console.log("⚠️ No se encontraron datos de impacto");
      }
    } catch (error) {
      console.error('Error al cargar datos de impacto:', error);
      toast.error("Error al cargar los datos de impacto");
    } finally {
      setIsLoading(false);
    }
  }, [startupId, form]);

  useEffect(() => {
    loadImpactData();
  }, [loadImpactData]);

  const handleSubmit = async (data: ImpactFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("🚀 Enviando datos de impacto:", data);

      const apiUrl = `/api/startups/impact`;
      const method = startupId ? 'PUT' : 'POST';
      const body = { startupId, ...data };

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Impacto guardado exitosamente:", result);
        toast.success("Datos de impacto guardados exitosamente");
        onSubmit(data);
      } else {
        const errorData = await response.json();
        console.error("❌ Error al guardar impacto:", errorData);
        toast.error(errorData.error || "Error al guardar los datos");
      }
    } catch (error) {
      console.error("❌ Error en el envío:", error);
      toast.error("Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSectionFields = (section: number): (keyof ImpactFormValues)[] => {
    switch (section) {
      case 1:
        return ['casoReal', 'abordajeProblema', 'consecuencias', 'afectados'];
      case 2:
        return ['tamanoMercado', 'potencialesClientes', 'interesPagar', 'segmentoInteres'];
      case 3:
        return ['estrategiaAdquisicion', 'costoAdquisicion', 'facilidadExpansion', 'escalabilidad'];
      case 4:
        return ['trayectoria', 'experiencia', 'roles', 'desafios'];
      default:
        return [];
    }
  };

  const getSectionData = (data: ImpactFormValues, section: number) => {
    const fields = getSectionFields(section);
    return fields.reduce((acc, field) => {
      acc[field] = data[field];
      return acc;
    }, {} as Partial<ImpactFormValues>);
  };

  const renderTextareaField = (
    name: keyof ImpactFormValues,
    label: string,
    placeholder: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
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

  const sections = [
    {
      id: 1,
      title: "Problema y Solución",
      description: "Describe el problema que resuelves y cómo lo abordas"
    },
    {
      id: 2,
      title: "Mercado y Clientes",
      description: "Define tu mercado objetivo y validación de clientes"
    },
    {
      id: 3,
      title: "Escalabilidad",
      description: "Estrategias de crecimiento y expansión"
    },
    {
      id: 4,
      title: "Equipo",
      description: "Experiencia y capacidades del equipo"
    }
  ];

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">
            Completa la información sobre el impacto de tu startup
          </p>
        </div>

        {/* Navegación de secciones */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Sección activa */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">
                    {sections.find(s => s.id === activeSection)?.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {sections.find(s => s.id === activeSection)?.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {activeSection === 1 && (
                    <>
                      {renderTextareaField(
                        "casoReal",
                        "Caso Real",
                        "Describe un caso real o situación específica que tu startup resuelve. ¿Qué problema enfrentaban las personas o empresas antes de tu solución?"
                      )}
                      {renderTextareaField(
                        "abordajeProblema",
                        "Abordaje del Problema",
                        "¿Cómo abordas este problema? ¿Cuál es tu enfoque único para resolverlo?"
                      )}
                      {renderTextareaField(
                        "consecuencias",
                        "Consecuencias del Problema",
                        "¿Qué impacto negativo (pérdidas de tiempo, dinero, oportunidades, etc.) experimentaban al no tener una solución efectiva para esta situación? Si es posible, cuantifica estas consecuencias."
                      )}
                      {renderTextareaField(
                        "afectados",
                        "Personas Afectadas",
                        "¿Cuántas personas o empresas se ven afectadas por este problema? ¿Quiénes son los principales afectados?"
                      )}
                    </>
                  )}

                  {activeSection === 2 && (
                    <>
                      {renderTextareaField(
                        "tamanoMercado",
                        "Tamaño del Mercado",
                        "Describe el tamaño de tu mercado objetivo. ¿Cuántos clientes potenciales existen?"
                      )}
                      {renderTextareaField(
                        "potencialesClientes",
                        "Clientes Potenciales",
                        "¿Quiénes son tus clientes potenciales? ¿Cómo los has identificado y validado?"
                      )}
                      {renderTextareaField(
                        "interesPagar",
                        "Interés en Pagar",
                        "¿Has validado que tus clientes potenciales están dispuestos a pagar por tu solución? ¿Cómo lo has verificado?"
                      )}
                      {renderTextareaField(
                        "segmentoInteres",
                        "Segmento de Interés",
                        "¿Cuál es el segmento de clientes más interesado en tu solución? ¿Por qué?"
                      )}
                    </>
                  )}

                  {activeSection === 3 && (
                    <>
                      {renderTextareaField(
                        "estrategiaAdquisicion",
                        "Estrategia de Adquisición",
                        "¿Cuál es tu estrategia para adquirir nuevos clientes? ¿Qué canales utilizarás?"
                      )}
                      {renderTextareaField(
                        "costoAdquisicion",
                        "Costo de Adquisición",
                        "¿Cuál es el costo estimado para adquirir un nuevo cliente? ¿Cómo planeas optimizarlo?"
                      )}
                      {renderTextareaField(
                        "facilidadExpansion",
                        "Facilidad de Expansión",
                        "¿Qué tan fácil es expandir tu solución a nuevos mercados o segmentos? ¿Cuáles son los principales desafíos?"
                      )}
                      {renderTextareaField(
                        "escalabilidad",
                        "Estrategias de Escalabilidad",
                        "¿Qué estrategias tienes para escalar tu negocio? ¿Cómo planeas crecer de manera sostenible?"
                      )}
                    </>
                  )}

                  {activeSection === 4 && (
                    <>
                      {renderTextareaField(
                        "trayectoria",
                        "Trayectoria del Equipo",
                        "¿Cuál es la trayectoria profesional de los miembros del equipo? ¿Qué experiencia relevante tienen?"
                      )}
                      {renderTextareaField(
                        "experiencia",
                        "Experiencia en el Sector",
                        "¿Qué experiencia específica tiene el equipo en el sector o industria de tu startup?"
                      )}
                      {renderTextareaField(
                        "roles",
                        "Roles y Responsabilidades",
                        "¿Cómo están distribuidos los roles en el equipo? ¿Quién se encarga de qué áreas?"
                      )}
                      {renderTextareaField(
                        "desafios",
                        "Superación de Desafíos",
                        "¿Qué desafíos importantes ha superado el equipo? ¿Cómo han demostrado resiliencia y capacidad de adaptación?"
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Navegación entre secciones */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveSection(Math.max(1, activeSection - 1))}
                disabled={activeSection === 1}
              >
                Anterior
              </Button>

              <div className="flex gap-2">
                {activeSection < 4 && (
                  <Button
                    type="button"
                    onClick={() => setActiveSection(activeSection + 1)}
                  >
                    Siguiente
                  </Button>
                )}
                
                {activeSection === 4 && (
                  <>
                    {showCancelButton && onCancel && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Guardando..." : submitButtonText}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
} 