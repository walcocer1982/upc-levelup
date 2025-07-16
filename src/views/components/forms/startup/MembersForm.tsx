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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

// Esquema para validación del formulario
const memberSchema = z.object({
  nombres: z.string().min(1, "Los nombres son obligatorios"),
  apellidos: z.string().min(1, "Los apellidos son obligatorios"),
  dni: z.string().min(8, "El DNI debe tener al menos 8 caracteres"),
  cargo: z.string().min(1, "El cargo es obligatorio"),
  email: z.string().email("Ingresa un email válido"),
  telefono: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
  linkedin: z.string().url("Ingresa una URL válida de LinkedIn"),
  biografia: z.string().min(10, "La biografía debe tener al menos 10 caracteres"),
});

type MemberFormValues = z.infer<typeof memberSchema>;

interface MembersFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function MembersForm({ onSubmit, initialData }: MembersFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(initialData?.biografia?.length || 0);

  // Usar initialData si está disponible
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: initialData || {
      nombres: "",
      apellidos: "",
      dni: "",
      cargo: "",
      email: "",
      telefono: "",
      linkedin: "",
      biografia: "",
    },
  });

  const handleSubmit = (data: MemberFormValues) => {
    setIsSubmitting(true);
    
    // Simular envío con un pequeño retraso
    setTimeout(() => {
      onSubmit(data);
      setIsSubmitting(false);
      
      // Solo resetear si no hay datos iniciales (es un nuevo registro)
      if (!initialData) {
        form.reset();
        setCharCount(0);
      }
    }, 500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Información personal */}
              <FormField
                control={form.control}
                name="nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Nombres del integrante" {...field} />
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
                    <FormLabel>Apellidos <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Apellidos del integrante" {...field} />
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
                    <FormLabel>DNI <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Número de DNI" 
                        maxLength={8} 
                        {...field} 
                        onChange={(e) => {
                          // Solo permitir números
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol/cargo en la startup <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: CEO, CTO, Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Información de contacto */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="correo@ejemplo.com" {...field} />
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
                    <FormLabel>Teléfono Celular <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Número de celular"
                        {...field}
                        onChange={(e) => {
                          // Solo permitir números
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Perfil de LinkedIn <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      URL completa del perfil de LinkedIn
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-2">
              {/* Biografía */}
              <FormField
                control={form.control}
                name="biografia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografía <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Breve descripción de la experiencia y habilidades del integrante" 
                        className="min-h-[120px] resize-none"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setCharCount(e.target.value.length);
                        }}
                      />
                    </FormControl>
                    <div className="flex justify-end">
                      <span className={`text-xs ${
                        charCount < 10 ? 'text-destructive' : 
                        charCount > 300 ? 'text-amber-500' : 
                        'text-muted-foreground'
                      }`}>
                        {charCount} caracteres
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? "Guardando..." 
                  : initialData 
                    ? "Actualizar integrante" 
                    : "Agregar integrante"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}