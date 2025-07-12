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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

// Opciones para ciclo académico
const ciclos = [
  { value: "1", label: "1er ciclo" },
  { value: "2", label: "2do ciclo" },
  { value: "3", label: "3er ciclo" },
  { value: "4", label: "4to ciclo" },
  { value: "5", label: "5to ciclo" },
  { value: "6", label: "6to ciclo" },
  { value: "7", label: "7mo ciclo" },
  { value: "8", label: "8vo ciclo" },
  { value: "9", label: "9no ciclo" },
  { value: "10", label: "10mo ciclo" },
  { value: "egresado", label: "Egresado" },
];

// Opciones para cómo se enteró
const fuentesPrograma = [
  { value: "redes_sociales", label: "Redes sociales" },
  { value: "amigos", label: "Amigos o conocidos" },
  { value: "profesores", label: "Profesores" },
  { value: "correo", label: "Correo electrónico" },
  { value: "web_upc", label: "Web de la UPC" },
  { value: "evento", label: "Evento o feria" },
  { value: "otro", label: "Otro" },
];

const formSchema = z.object({
  carrera: z.string().min(1, "La carrera es obligatoria"),
  ciclo: z.string({
    required_error: "Por favor selecciona tu ciclo académico",
  }),
  linkedin: z.string()
    .min(1, "El perfil de LinkedIn es obligatorio")
    .url("Debe ser una URL válida de LinkedIn")
    .includes("linkedin.com", {
      message: "Debe ser una URL de LinkedIn",
    }),
  fuentePrograma: z.string({
    required_error: "Por favor indica cómo te enteraste del programa",
  }),
  politicaPrivacidad: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function FounderRegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carrera: "",
      ciclo: "",
      linkedin: "",
      fuentePrograma: "",
      politicaPrivacidad: false,
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Información del Fundador</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Por favor completa tus datos académicos y profesionales
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="carrera"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carrera</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ej: Ingeniería de Software, Administración, etc." 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ciclo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciclo académico</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu ciclo actual" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ciclos.map((ciclo) => (
                          <SelectItem key={ciclo.value} value={ciclo.value}>
                            {ciclo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil de LinkedIn</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://linkedin.com/in/tu-perfil" 
                        type="url"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Ingresa la URL completa de tu perfil de LinkedIn
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fuentePrograma"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Cómo te enteraste del programa?</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fuentesPrograma.map((fuente) => (
                          <SelectItem key={fuente.value} value={fuente.value}>
                            {fuente.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="politicaPrivacidad"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Acepto la política de privacidad
                      </FormLabel>
                      <FormDescription>
                        Al marcar esta casilla, aceptas nuestra{" "}
                        <a
                          href="/politica-privacidad"
                          className="text-primary underline"
                          target="_blank"
                        >
                          política de privacidad
                        </a>
                        .
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full mt-4" 
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