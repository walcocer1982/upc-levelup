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
  ventas: z.boolean({
    required_error: "Este campo es obligatorio",
  }),
  montoVentas: z.string().optional(),
  monedaVentas: z.string().optional(),

  // Piloto/Prueba
  tienePiloto: z.boolean({
    required_error: "Este campo es obligatorio",
  }),
  enlacePiloto: z.string().optional(),
  lugarAplicacion: z.string().optional(),
  tecnologia: z.string().min(1, { message: "Este campo es obligatorio" }),

  // Área tech
  tieneAreaTech: z.boolean({
    required_error: "Este campo es obligatorio",
  }),

  // Inversión
  inversionExterna: z.boolean({
    required_error: "Este campo es obligatorio",
  }),
  montoInversion: z.string().optional(),
  monedaInversion: z.string().optional(),
}).refine((data) => {
  // Validar campos de ventas solo si ventas es true
  if (data.ventas) {
    return data.montoVentas && data.montoVentas.trim() !== "" && 
           data.monedaVentas && data.monedaVentas.trim() !== "";
  }
  return true;
}, {
  message: "Los campos de ventas son obligatorios cuando se tienen ventas",
  path: ["montoVentas"]
}).refine((data) => {
  // Validar campos de piloto solo si tienePiloto es true
  if (data.tienePiloto) {
    return data.enlacePiloto && data.enlacePiloto.trim() !== "" && 
           data.lugarAplicacion && data.lugarAplicacion.trim() !== "";
  }
  return true;
}, {
  message: "Los campos de piloto son obligatorios cuando se tiene piloto",
  path: ["enlacePiloto"]
}).refine((data) => {
  // Validar campos de inversión solo si inversionExterna es true
  if (data.inversionExterna) {
    return data.montoInversion && data.montoInversion.trim() !== "" && 
           data.monedaInversion && data.monedaInversion.trim() !== "";
  }
  return true;
}, {
  message: "Los campos de inversión son obligatorios cuando se recibió inversión",
  path: ["montoInversion"]
});

type MetricsFormValues = z.infer<typeof metricsSchema>;

interface BaseMetricsFormProps {
  onSubmit: (data: MetricsFormValues) => void;
  initialData?: Partial<MetricsFormValues>;
  startupId?: string;
  mode?: 'admin' | 'user';
  title?: string;
  submitButtonText?: string;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export default function BaseMetricsForm({ 
  onSubmit, 
  initialData, 
  startupId,
  mode = 'user',
  title = "Métricas de tu Startup",
  submitButtonText = "Guardar Métricas",
  onCancel,
  showCancelButton = false
}: BaseMetricsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MetricsFormValues>({
    resolver: zodResolver(metricsSchema),
    defaultValues: initialData || {
      ventas: false,
      montoVentas: "",
      monedaVentas: "",
      tienePiloto: false,
      enlacePiloto: "",
      lugarAplicacion: "",
      tecnologia: "",
      tieneAreaTech: false,
      inversionExterna: false,
      montoInversion: "",
      monedaInversion: "",
    },
  });

  // Cargar datos existentes al montar el componente
  useEffect(() => {
    const loadMetricsData = async () => {
      if (!startupId) {
        console.log("🔄 Sin startupId, formulario vacío");
        return;
      }

      try {
        console.log("🔍 Cargando métricas para startup:", startupId);
        setIsLoading(true);

        const response = await fetch(`/api/startups/metrics?startupId=${startupId}`);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Datos de métricas cargados:", data);
          
          if (data.metrics) {
            form.reset(data.metrics);
          }
        } else {
          console.log("⚠️ No se encontraron datos de métricas");
        }
      } catch (error) {
        console.error('Error al cargar datos de métricas:', error);
        toast.error("Error al cargar los datos de métricas");
      } finally {
        setIsLoading(false);
      }
    };

    loadMetricsData();
  }, [startupId, form]);

  const handleSubmit = async (data: MetricsFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("🚀 Enviando datos de métricas:", data);

      const apiUrl = `/api/startups/metrics`;
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
        console.log("✅ Métricas guardadas exitosamente:", result);
        toast.success("Datos de métricas guardados exitosamente");
        onSubmit(data);
      } else {
        const errorData = await response.json();
        console.error("❌ Error al guardar métricas:", errorData);
        toast.error(errorData.error || "Error al guardar los datos");
      }
    } catch (error) {
      console.error("❌ Error en el envío:", error);
      toast.error("Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBooleanField = (
    name: "ventas" | "tienePiloto" | "tieneAreaTech" | "inversionExterna",
    label: string,
    description?: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label} <span className="text-destructive">*</span></FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => field.onChange(value === "true")}
              value={field.value ? "true" : "false"}
              className="flex flex-col space-y-1"
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
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );

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
            Completa la información sobre las métricas de tu startup
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Ventas */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Ventas</h2>
                <div className="space-y-4">
                  {renderBooleanField(
                    "ventas",
                    "¿Has tenido ventas?",
                    "Indica si tu startup ha generado ingresos por ventas"
                  )}

                  {form.watch("ventas") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="montoVentas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monto Total de Ventas <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="monedaVentas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Moneda <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="">Selecciona una moneda</option>
                                {currencyCodes.map((currency) => (
                                  <option key={currency} value={currency}>
                                    {currency}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Piloto */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Piloto o Prueba</h2>
                <div className="space-y-4">
                  {renderBooleanField(
                    "tienePiloto",
                    "¿Tienes un piloto o prueba en funcionamiento?",
                    "Indica si has implementado una versión de prueba de tu solución"
                  )}

                  {form.watch("tienePiloto") && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="enlacePiloto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Enlace del Piloto <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://tu-piloto.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lugarAplicacion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lugar de Aplicación <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="¿Dónde se está aplicando la solución?" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="tecnologia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tecnología Principal <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="¿Qué tecnología principal utilizas?" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Área Tech */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Área de Tecnología</h2>
                {renderBooleanField(
                  "tieneAreaTech",
                  "¿Tienes un área de tecnología?",
                  "Indica si cuentas con un equipo o área dedicada a tecnología"
                )}
              </CardContent>
            </Card>

            {/* Inversión */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Inversión Externa</h2>
                <div className="space-y-4">
                  {renderBooleanField(
                    "inversionExterna",
                    "¿Has recibido inversión externa?",
                    "Indica si has recibido financiamiento de inversores externos"
                  )}

                  {form.watch("inversionExterna") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="montoInversion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monto de Inversión <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="monedaInversion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Moneda <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="">Selecciona una moneda</option>
                                {currencyCodes.map((currency) => (
                                  <option key={currency} value={currency}>
                                    {currency}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6">
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
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
} 