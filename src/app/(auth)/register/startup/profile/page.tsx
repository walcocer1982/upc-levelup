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
// import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre del proyecto es obligatorio"),
  razonSocial: z.string().optional(),
  ruc: z.string().optional(),
  fechaFundacion: z.string().min(1, "La fecha de fundación es obligatoria"),
  categoria: z.enum(["tech", "edtech", "otras"], {
    required_error: "Selecciona una categoría",
  }),
  web: z.string().optional(),
  descripcion: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(500, "Máximo 500 caracteres"),
  etapa: z.enum(["mvp", "idea"], {
    required_error: "Selecciona una etapa",
  }),
  origen: z.enum(["curso", "tesis", "idea", "inqubalab"], {
    required_error: "Selecciona el origen",
  }),
  video: z.string().url("Ingresa una URL válida").optional().or(z.literal("")),
  razonIngreso: z.string().min(1, "Este campo es obligatorio"),
});

type FormValues = z.infer<typeof formSchema>;

export default function StartupProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
//  const router = useRouter();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      razonSocial: "",
      ruc: "",
      fechaFundacion: "",
      web: "",
      descripcion: "",
      video: "",
      razonIngreso: "",
    },
  });

  function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    // Aquí puedes implementar la lógica para guardar los datos
    console.log(data);
    
    // Simular proceso de envío
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Registro completado con éxito");
      // Redireccionar al usuario después del registro exitoso
      // router.push("/dashboard");
    }, 1500);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Registro de Startup</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Completa la información de tu emprendimiento
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nombre del proyecto <span className="text-destructive">*</span>
                    </FormLabel>
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
                    <FormLabel>
                      Fecha de fundación <span className="text-destructive">*</span>
                    </FormLabel>
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
                    <FormLabel>
                      Categoría <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
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
              
              <FormField
                control={form.control}
                name="web"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Página web o redes sociales</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Descripción corta <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe tu startup o proyecto (máx. 500 caracteres)" 
                        {...field} 
                        maxLength={500}
                        className="resize-none h-24"
                      />
                    </FormControl>
                    <FormDescription className="text-right">
                      {field.value?.length || 0}/500
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="etapa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Etapa <span className="text-destructive">*</span>
                      </FormLabel>
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
                          <SelectItem value="mvp">MVP</SelectItem>
                          <SelectItem value="idea">Idea</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="origen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Origen <span className="text-destructive">*</span>
                      </FormLabel>
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
                          <SelectItem value="curso">Curso</SelectItem>
                          <SelectItem value="tesis">Tesis</SelectItem>
                          <SelectItem value="idea">Idea</SelectItem>
                          <SelectItem value="inqubalab">Inqubalab</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video pitch (URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.youtube.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="razonIngreso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Razón para ingresar al programa <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="¿Por qué quieres participar en este programa?" 
                        {...field} 
                        className="resize-none h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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