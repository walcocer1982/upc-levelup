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
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  nombres: z.string().min(1, "Los nombres son obligatorios"),
  apellidos: z.string().min(1, "Los apellidos son obligatorios"),
  dni: z.string()
    .min(8, "El DNI debe tener al menos 8 caracteres")
    .regex(/^\d+$/, "El DNI debe contener solo números"),
  telefono: z.string()
    .min(9, "El número debe tener al menos 9 dígitos")
    .regex(/^\d+$/, "El teléfono debe contener solo números"),
  correoLaureate: z.string().email("Debe ser un correo válido").optional().or(z.literal("")),
  politicaPrivacidad: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function UserRegistrationPage() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Email del usuario autenticado
  const userEmail = session?.user?.email || "";
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      dni: "",
      telefono: "",
      correoLaureate: "",
      politicaPrivacidad: false,
    },
  });

  function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    // Aquí implementarías la lógica para guardar los datos
    console.log({
      email: userEmail,
      ...data
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Usuario registrado con éxito");
      // Redirigir al usuario a la siguiente página si es necesario
    }, 1500);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Completa tu información</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Para finalizar tu registro necesitamos algunos datos adicionales
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          {/* Email del usuario (no editable) */}
          <div className="mb-6">
            <FormLabel>Correo electrónico</FormLabel>
            <Input
              value={userEmail}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Este correo fue proporcionado por tu autenticación con Google
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa tus nombres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="apellidos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa tus apellidos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNI</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ingresa tu número de DNI" 
                        {...field} 
                        maxLength={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono celular</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ej: 999888777" 
                        {...field} 
                        maxLength={9}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="correoLaureate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Laureate (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="usuario@laureate.edu" 
                        type="email"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Si eres parte de la comunidad Laureate, ingresa tu correo institucional
                    </FormDescription>
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