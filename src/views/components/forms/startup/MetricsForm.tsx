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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Lista de códigos de moneda ISO 4217
const currencyCodes = [
  "USD", "EUR", "GBP", "JPY", "AUD",
  "CAD", "CHF", "CNY", "SEK", "NZD",
  "MXN", "SGD", "HKD", "NOK", "KRW",
  "TRY", "INR", "BRL", "ZAR", "PEN"
];

const metricsSchema = z.object({
  // Ventas
  hasHadSales: z.boolean({
    required_error: "Este campo es obligatorio",
  }),
  totalSalesAmount: z.string().optional(),
  salesCurrency: z.string().optional(),

  // Piloto/Prueba
  hasPilot: z.boolean({
    required_error: "Este campo es obligatorio",
  }),
  pilotLink: z.string().optional(),
  solutionApplication: z.string().optional(),
  technologyUsed: z.string().min(1, { message: "Este campo es obligatorio" }),

  // Área tech
  hasTechDepartment: z.boolean({
    required_error: "Este campo es obligatorio",
  }),

  // Inversión
  hasReceivedInvestment: z.boolean({
    required_error: "Este campo es obligatorio",
  }),
  investmentAmount: z.string().optional(),
  investmentCurrency: z.string().optional(),
}).refine((data) => {
  // Validar campos de ventas solo si hasHadSales es true
  if (data.hasHadSales) {
    return data.totalSalesAmount && data.totalSalesAmount.trim() !== "" && 
           data.salesCurrency && data.salesCurrency.trim() !== "";
  }
  return true;
}, {
  message: "Los campos de ventas son obligatorios cuando se tienen ventas",
  path: ["totalSalesAmount"]
}).refine((data) => {
  // Validar campos de piloto solo si hasPilot es true
  if (data.hasPilot) {
    return data.pilotLink && data.pilotLink.trim() !== "" && 
           data.solutionApplication && data.solutionApplication.trim() !== "";
  }
  return true;
}, {
  message: "Los campos de piloto son obligatorios cuando se tiene piloto",
  path: ["pilotLink"]
}).refine((data) => {
  // Validar campos de inversión solo si hasReceivedInvestment es true
  if (data.hasReceivedInvestment) {
    return data.investmentAmount && data.investmentAmount.trim() !== "" && 
           data.investmentCurrency && data.investmentCurrency.trim() !== "";
  }
  return true;
}, {
  message: "Los campos de inversión son obligatorios cuando se recibió inversión",
  path: ["investmentAmount"]
});

type MetricsFormValues = z.infer<typeof metricsSchema>;

interface MetricsFormProps {
  onSubmit: (data: MetricsFormValues) => void;
  initialData?: Partial<MetricsFormValues>;
  startupId?: string;
}

export default function MetricsForm({ onSubmit, initialData, startupId }: MetricsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MetricsFormValues>({
    resolver: zodResolver(metricsSchema),
    defaultValues: {
      hasHadSales: false,
      totalSalesAmount: "",
      salesCurrency: "",
      hasPilot: false,
      pilotLink: "",
      solutionApplication: "",
      technologyUsed: "",
      hasTechDepartment: false,
      hasReceivedInvestment: false,
      investmentAmount: "",
      investmentCurrency: "",
      ...initialData
    },
  });

  useEffect(() => {
    const loadMetricsData = async () => {
      if (!startupId) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/startups/${startupId}/metrics`);
        const data = await response.json();

        if (response.ok && data.metrics) {
          console.log("✅ Metrics cargadas:", data.metrics);
          form.reset(data.metrics);
        } else {
          console.log("✅ Metrics cargadas: Sin datos");
        }
      } catch (error) {
        console.error("❌ Error cargando metrics:", error);
        toast.error("Error al cargar las métricas");
      } finally {
        setIsLoading(false);
      }
    };

    loadMetricsData();
  }, [startupId, form]);

  // Observar cambios en los campos condicionales
  const watchHasHadSales = form.watch("hasHadSales");
  const watchHasPilot = form.watch("hasPilot");
  const watchHasReceivedInvestment = form.watch("hasReceivedInvestment");

  const handleSubmit = async (data: MetricsFormValues) => {
    if (!startupId) {
      toast.error("ID de startup no encontrado");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/startups/${startupId}/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Métricas guardadas exitosamente");
        onSubmit(data);
      } else {
        toast.error(result.error || "Error al guardar las métricas");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error al guardar las métricas");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función de ayuda para renderizar campos de selección booleana
  const renderBooleanField = (
    name: "hasHadSales" | "hasPilot" | "hasTechDepartment" | "hasReceivedInvestment",
    label: string,
    description?: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => field.onChange(value === "true")}
              defaultValue={field.value ? "true" : "false"}
              className="flex flex-row space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id={`${name}-yes`} />
                <Label htmlFor={`${name}-yes`}>Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`${name}-no`} />
                <Label htmlFor={`${name}-no`}>No</Label>
              </div>
            </RadioGroup>
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Métricas de tu Startup</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cargando datos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold">Métricas de tu Startup</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comparte los indicadores clave de desempeño de tu startup
        </p>
      </div>

      <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Sección de ventas */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderBooleanField(
                  "hasHadSales",
                  "¿Ha tenido ventas?",
                  "Indica si tu startup ha generado ingresos por ventas"
                )}
              </div>

              {watchHasHadSales && (
                <Card className="border-muted bg-muted/20">
                  <CardContent className="p-3 sm:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="totalSalesAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monto total de ventas desde fundación</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: 50000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="salesCurrency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Moneda</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej: USD, EUR, PEN"
                                {...field}
                                maxLength={3}
                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Formato ISO 4217 (USD, EUR, PEN)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sección de piloto */}
            <div className="space-y-4 pt-2 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderBooleanField(
                  "hasPilot",
                  "¿Cuenta con piloto o prueba?",
                  "Indica si tienes algún producto piloto o versión de prueba"
                )}
              </div>

              {watchHasPilot && (
                <Card className="border-muted bg-muted/20">
                  <CardContent className="p-3 sm:p-4">
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="pilotLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Enlace de tu piloto o prueba</FormLabel>
                            <FormControl>
                              <Input placeholder="https://" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="solutionApplication"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>¿Dónde se aplica la solución?</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Sector financiero, educación..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Tecnología utilizada - siempre visible */}
            <div className="pt-2 border-t">
              <FormField
                control={form.control}
                name="technologyUsed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tecnología utilizada</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: React, Node.js, Python..." {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Describe las principales tecnologías que usa tu producto o servicio
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sección de área tech */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
              {renderBooleanField(
                "hasTechDepartment",
                "¿Tiene área de desarrollo tech?",
                "Indica si cuentas con un equipo o área dedicada al desarrollo tecnológico"
              )}
            </div>

            {/* Sección de inversión */}
            <div className="space-y-4 pt-2 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderBooleanField(
                  "hasReceivedInvestment",
                  "¿Recibió inversión externa?",
                  "Indica si tu startup ha recibido financiamiento externo"
                )}
              </div>

              {watchHasReceivedInvestment && (
                <Card className="border-muted bg-muted/20">
                  <CardContent className="p-3 sm:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="investmentAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monto</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: 100000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="investmentCurrency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Moneda</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej: USD, EUR, PEN"
                                {...field}
                                maxLength={3}
                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Formato ISO 4217 (USD, EUR, PEN)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar métricas"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}