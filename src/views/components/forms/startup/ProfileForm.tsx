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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const startupSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  razonSocial: z.string().optional().or(z.literal("")),
  ruc: z.string().optional().or(z.literal("")),
  fechaFundacion: z.string().min(1, "La fecha de fundación es obligatoria"),
  categoria: z.string({
    required_error: "Selecciona una categoría",
  }),
  web: z.string().url("Ingresa una URL válida").optional().or(z.literal("")),
  descripcion: z.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no debe exceder los 500 caracteres"),
  etapa: z.enum(["mvp", "idea"], {
    required_error: "Selecciona la etapa de tu proyecto",
  }),
  origen: z.enum(["curso", "tesis", "idea", "inqubalab"], {
    required_error: "Selecciona el origen de tu proyecto",
  }),
  videoPitch: z.string().url("Ingresa una URL válida").optional().or(z.literal("")),
});

type StartupFormValues = z.infer<typeof startupSchema>;

interface StartupProfileFormProps {
  onSubmit: (data: StartupFormValues) => void;
  startupData?: Partial<StartupFormValues>;
}

export default function StartupProfileForm({ 
  onSubmit,
  startupData
}: StartupProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(startupData?.descripcion?.length || 0);
  
  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupSchema),
    defaultValues: startupData || {
      nombre: "",
      razonSocial: "",
      ruc: "",
      fechaFundacion: "",
      categoria: "",
      web: "",
      descripcion: "",
      etapa: undefined,
      origen: undefined,
      videoPitch: "",
    },
  });

  const handleSubmit = (data: StartupFormValues) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmit(data);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold">Registro de Startup</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Completa la información de tu emprendimiento
        </p>
      </div>
      
      <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Información básica</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Nombre del proyecto o emprendimiento <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del proyecto o startup" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="razonSocial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razón social</FormLabel>
                      <FormControl>
                        <Input placeholder="Razón social (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ruc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RUC</FormLabel>
                      <FormControl>
                        <Input placeholder="RUC (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fechaFundacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de fundación <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tech">Tech</SelectItem>
                          <SelectItem value="edtech">Edtech</SelectItem>
                          <SelectItem value="otras">Otras</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Etapa y origen */}
            <div className="space-y-4 pt-4 border-t">
              <h2 className="text-lg font-semibold">Estado del proyecto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="etapa"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Etapa <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mvp" id="mvp" />
                            <Label htmlFor="mvp">MVP (Producto mínimo viable)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="idea" id="idea" />
                            <Label htmlFor="idea">Idea</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="origen"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Origen <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="curso" id="curso" />
                            <Label htmlFor="curso">Curso</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="tesis" id="tesis" />
                            <Label htmlFor="tesis">Tesis</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="idea" id="idea-origen" />
                            <Label htmlFor="idea-origen">Idea</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="inqubalab" id="inqubalab" />
                            <Label htmlFor="inqubalab">Inqubalab</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Enlaces y descripción */}
            <div className="space-y-4 pt-4 border-t">
              <h2 className="text-lg font-semibold">Información adicional</h2>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="web"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Página web o redes sociales</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Enlace a tu página web o perfil principal en redes sociales
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="videoPitch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video pitch</FormLabel>
                      <FormControl>
                        <Input placeholder="https://youtube.com/..." {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Enlace a tu video pitch en YouTube, Vimeo u otra plataforma
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción corta <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe tu startup o proyecto (máx. 500 caracteres)" 
                          className="min-h-[120px]" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            setCharCount(e.target.value.length);
                          }}
                          maxLength={500}
                        />
                      </FormControl>
                      <div className="flex justify-end">
                        <span className={`text-xs ${charCount > 480 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                          {charCount}/500
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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