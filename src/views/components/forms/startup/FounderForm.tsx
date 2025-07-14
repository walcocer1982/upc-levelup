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

const founderSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Ingresa un email válido"),
  telefono: z.string()
    .min(9, "El teléfono debe tener al menos 9 dígitos")
    .regex(/^\d+$/, "El teléfono solo debe contener números"),
  linkedin: z.string().url("Ingresa una URL válida").optional().or(z.literal("")),
  bio: z.string().min(10, "La biografía debe tener al menos 10 caracteres"),
});

type FounderFormValues = z.infer<typeof founderSchema>;

interface FounderFormProps {
  onSubmit: (data: FounderFormValues) => void;
  initialData?: Partial<FounderFormValues>;
}

export default function FounderForm({ onSubmit, initialData }: FounderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FounderFormValues>({
    resolver: zodResolver(founderSchema),
    defaultValues: initialData || {
      nombre: "",
      email: "",
      telefono: "",
      linkedin: "",
      bio: "",
    },
  });

  const handleSubmit = (data: FounderFormValues) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmit(data);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold">Información del fundador</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comparte los datos del fundador principal de la startup
        </p>
      </div>
      
      <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del fundador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="fundador@startup.com" {...field} />
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
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="999888777" {...field} />
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
                    <FormLabel>Perfil de LinkedIn (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Biografía</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Breve descripción del fundador y su experiencia..." 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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