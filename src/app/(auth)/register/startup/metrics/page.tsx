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
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { currencies } from "@/views/components/forms/currencies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  hasVentas: z.enum(["si", "no"], {
    required_error: "Por favor selecciona una opción",
  }),
  montoVentas: z.string().optional()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: "Debe ser un número válido",
    }),
  monedaVentas: z.string().optional(),
  
  hasPiloto: z.enum(["si", "no"], {
    required_error: "Por favor selecciona una opción",
  }),
  enlacePiloto: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  lugarAplicacion: z.string().optional(),
  tecnologia: z.string().optional(),
  
  hasAreaTech: z.enum(["si", "no"], {
    required_error: "Por favor selecciona una opción",
  }),
  
  hasInversion: z.enum(["si", "no"], {
    required_error: "Por favor selecciona una opción",
  }),
  montoInversion: z.string().optional()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: "Debe ser un número válido",
    }),
  monedaInversion: z.string().optional(),
}).refine((data) => {
  // Si tiene ventas, debe tener monto y moneda
  if (data.hasVentas === "si") {
    return !!data.montoVentas && !!data.monedaVentas;
  }
  return true;
}, {
  message: "Si tienes ventas, debes especificar el monto y la moneda",
  path: ["montoVentas"],
}).refine((data) => {
  // Si tiene piloto, debe tener los campos requeridos
  if (data.hasPiloto === "si") {
    return !!data.lugarAplicacion && !!data.tecnologia;
  }
  return true;
}, {
  message: "Debes completar la información del piloto",
  path: ["lugarAplicacion"],
}).refine((data) => {
  // Si tiene inversión, debe tener monto y moneda
  if (data.hasInversion === "si") {
    return !!data.montoInversion && !!data.monedaInversion;
  }
  return true;
}, {
  message: "Si recibiste inversión, debes especificar el monto y la moneda",
  path: ["montoInversion"],
});

type FormValues = z.infer<typeof formSchema>;

export default function StartupMetricsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasVentas: undefined,
      montoVentas: "",
      monedaVentas: "",
      hasPiloto: undefined,
      enlacePiloto: "",
      lugarAplicacion: "",
      tecnologia: "",
      hasAreaTech: undefined,
      hasInversion: undefined,
      montoInversion: "",
      monedaInversion: "",
    },
    mode: "onChange",
  });

  const watchHasVentas = form.watch("hasVentas");
  const watchHasPiloto = form.watch("hasPiloto");
  const watchHasInversion = form.watch("hasInversion");

  function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    // Aquí implementarías la lógica para guardar los datos
    console.log(data);
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Métricas registradas con éxito");
    }, 1500);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Métricas de tu Startup</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Por favor, completa la información sobre las métricas de tu startup
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* ¿Ha tenido ventas? */}
              <FormField
                control={form.control}
                name="hasVentas"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>¿Ha tenido ventas?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="si" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Sí
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            No
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campos condicionales para ventas */}
              {watchHasVentas === "si" && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="montoVentas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto total de ventas</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Ej: 10000"
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
                        <FormLabel>Moneda</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem 
                                key={currency.code} 
                                value={currency.code}
                              >
                                {currency.code} - {currency.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {/* ¿Cuenta con piloto o prueba? */}
              <FormField
                control={form.control}
                name="hasPiloto"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>¿Cuenta con piloto o prueba?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="si" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Sí
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            No
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campos condicionales para piloto */}
              {watchHasPiloto === "si" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="enlacePiloto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enlace de tu piloto o prueba</FormLabel>
                        <FormControl>
                          <Input 
                            type="url" 
                            placeholder="https://..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Comparte un enlace donde podamos ver tu piloto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lugarAplicacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿Dónde se aplica la solución?</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: Lima, Perú / Online / Sector educativo"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tecnologia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tecnología utilizada</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: React, Node.js, Python, IA"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {/* ¿Tiene área de desarrollo tech? */}
              <FormField
                control={form.control}
                name="hasAreaTech"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>¿Tiene área de desarrollo tech?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="si" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Sí
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            No
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* ¿Recibió inversión externa? */}
              <FormField
                control={form.control}
                name="hasInversion"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>¿Recibió inversión externa?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="si" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Sí
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            No
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campos condicionales para inversión */}
              {watchHasInversion === "si" && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="montoInversion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto de inversión</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Ej: 50000"
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
                        <FormLabel>Moneda</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem 
                                key={currency.code} 
                                value={currency.code}
                              >
                                {currency.code} - {currency.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Completar registro"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}