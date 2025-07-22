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
import { useState, useEffect } from "react";
import { toast } from "sonner";

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

interface BaseProfileFormProps {
  onSubmit: (data: StartupFormValues) => void;
  startupData?: Partial<StartupFormValues>;
  startupId?: string;
  mode?: 'admin' | 'user';
  title?: string;
  submitButtonText?: string;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export default function BaseProfileForm({
  onSubmit,
  startupData,
  startupId,
  mode = 'user',
  title = "Perfil de Startup",
  submitButtonText = "Guardar Perfil",
  onCancel,
  showCancelButton = false
}: BaseProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [isNewStartup, setIsNewStartup] = useState(true);

  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
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

  // Cargar datos de la startup al montar el componente
  useEffect(() => {
    const loadStartupData = async () => {
      try {
        console.log("🔍 Cargando datos de la startup...");

        // Limpiar el formulario antes de cargar nuevos datos
        form.reset({
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
        });

        if (startupData) {
          console.log("📋 Usando datos proporcionados:", startupData);
          form.reset(startupData);
          setCharCount(startupData.descripcion?.length || 0);
          setIsNewStartup(false);
        } else if (startupId) {
          console.log("🔄 URL que se va a consultar:", startupId ? `/api/startups/profileForm?startupId=${startupId}` : '/api/startups/profileForm');
          
          const response = await fetch(startupId ? `/api/startups/profileForm?startupId=${startupId}` : '/api/startups/profileForm', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("✅ Datos cargados exitosamente:", data);
            
            if (data.startup) {
              form.reset(data.startup);
              setCharCount(data.startup.descripcion?.length || 0);
              setIsNewStartup(false);
            }
          } else {
            console.log("⚠️ No se encontraron datos para esta startup");
            setIsNewStartup(true);
          }
        } else {
          console.log("🆕 Creando nueva startup");
          setIsNewStartup(true);
        }
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        toast.error("Error al cargar los datos de la startup");
      } finally {
        setLoadingData(false);
      }
    };

    loadStartupData();
  }, [startupId, startupData, form]);

  const handleSubmit = async (data: StartupFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("🚀 Enviando datos:", data);

      // Determinar la URL según el modo
      const apiUrl = mode === 'admin' 
        ? `/api/startups/profileForm?startupId=${startupId}` 
        : `/api/startups/profileForm?startupId=${startupId}`;

      const response = await fetch(startupId ? `/api/startups/profileForm?startupId=${startupId}` : '/api/startups/profileForm', {
        method: startupId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Datos guardados exitosamente:", result);
        toast.success(startupId ? "Perfil actualizado exitosamente" : "Startup creada exitosamente");
        onSubmit(data);
      } else {
        const errorData = await response.json();
        console.error("❌ Error al guardar:", errorData);
        toast.error(errorData.error || "Error al guardar los datos");
      }
    } catch (error) {
      console.error("❌ Error en el envío:", error);
      toast.error("Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
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
            {isNewStartup 
              ? "Completa la información básica de tu startup" 
              : "Actualiza la información de tu startup"
            }
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Información Básica</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Startup <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre de tu startup" {...field} />
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
                          <SelectItem value="fintech">Fintech</SelectItem>
                          <SelectItem value="edutech">Edutech</SelectItem>
                          <SelectItem value="healthtech">Healthtech</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="logistics">Logística</SelectItem>
                          <SelectItem value="sustainability">Sostenibilidad</SelectItem>
                          <SelectItem value="ai-ml">IA/ML</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="razonSocial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razón Social</FormLabel>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fechaFundacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Fundación <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="web"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sitio Web</FormLabel>
                      <FormControl>
                        <Input placeholder="https://tu-startup.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enlace a tu página web o perfil principal en redes sociales
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Descripción</h2>
              
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe tu startup, el problema que resuelve y tu propuesta de valor..."
                        className="min-h-[120px]"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setCharCount(e.target.value.length);
                        }}
                      />
                    </FormControl>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <FormDescription>
                        Mínimo 10 caracteres, máximo 500
                      </FormDescription>
                      <span className={charCount > 500 ? "text-destructive" : ""}>
                        {charCount}/500
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Etapa y Origen */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Estado del Proyecto</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Etapa <span className="text-destructive">*</span></Label>
                  <FormField
                    control={form.control}
                    name="etapa"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="idea" id="idea" />
                              <Label htmlFor="idea">Idea</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="mvp" id="mvp" />
                              <Label htmlFor="mvp">MVP</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Origen <span className="text-destructive">*</span></Label>
                  <FormField
                    control={form.control}
                    name="origen"
                    render={({ field }) => (
                      <FormItem>
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
                              <Label htmlFor="idea-origen">Idea personal</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="inqubalab" id="inqubalab" />
                              <Label htmlFor="inqubalab">InQubaLab</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Video Pitch */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Video Pitch</h2>
              
              <FormField
                control={form.control}
                name="videoPitch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enlace del Video Pitch</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Enlace a tu video pitch (YouTube, Vimeo, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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