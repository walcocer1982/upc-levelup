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

interface StartupProfileFormProps {
  onSubmit: (data: StartupFormValues) => void;
  startupData?: Partial<StartupFormValues>;
  startupId?: string;
}

export default function StartupProfileForm({
  onSubmit,
  startupData,
  startupId
}: StartupProfileFormProps) {
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
        setCharCount(0);
        setLoadingData(true);

        console.log("🔄 Formulario reseteado para startupId:", startupId);
        console.log("🔄 startupId type:", typeof startupId); // ✅ Agregar
        console.log("🔄 startupId === undefined:", startupId === undefined); // ✅ Agregar
        console.log("🔄 startupId === 'undefined':", startupId === 'undefined'); // ✅ Agregar
        console.log("🔄 URL que se va a consultar:", startupId ? `/api/startups/profileForm?startupId=${startupId}` : '/api/startups/profileForm');

        const response = await fetch(startupId ? `/api/startups/profileForm?startupId=${startupId}` : '/api/startups/profileForm', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        });

        console.log("🌐 Response status:", response.status);
        console.log("🌐 Response URL:", response.url);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Datos de startup cargados:", data);

          if (data.startup) {
            // Mapear datos del endpoint al formato del formulario
            const formData = {
              nombre: data.startup.nombre || "",
              razonSocial: data.startup.razonSocial || "",
              ruc: data.startup.ruc || "",
              fechaFundacion: data.startup.fechaFundacion ?
                new Date(data.startup.fechaFundacion).toISOString().split('T')[0] : "",
              categoria: data.startup.categoria || "",
              web: data.startup.paginaWeb || "",
              descripcion: data.startup.descripcion || "",
              etapa: data.startup.etapa || undefined,
              origen: data.startup.origen || undefined,
              videoPitch: data.startup.videoPitchUrl || "",
            };

            console.log("📝 Datos preparados para el formulario:", formData);

            // Actualizar el formulario con los datos de la startup
            form.reset(formData);
            setCharCount(formData.descripcion.length);
            setIsNewStartup(false);
          } else {
            console.log("ℹ️ No se encontró startup existente - modo creación");
            setIsNewStartup(true);
          }
        } else {
          console.log("❌ Error al cargar datos de startup:", response.status);
        }
      } catch (error) {
        console.error("💥 Error cargando datos de startup:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadStartupData();
  }, [form, startupId]);

  const handleSubmit = async (data: StartupFormValues) => {
    setIsSubmitting(true);

    try {
      console.log("🚀 Enviando datos de startup:", data);

      // Llamar al onSubmit proporcionado por el componente padre (mantener compatibilidad)
      onSubmit(data);

      // Mapear datos del formulario al formato del endpoint
      const endpointData = {
        nombre: data.nombre,
        razonSocial: data.razonSocial,
        ruc: data.ruc,
        fechaFundacion: data.fechaFundacion,
        categoria: data.categoria,
        paginaWeb: data.web,
        descripcion: data.descripcion,
        etapa: data.etapa,
        origen: data.origen,
        videoPitchUrl: data.videoPitch,
      };

      // Enviar los datos al endpoint de la API
      const response = await fetch(startupId ? `/api/startups/profileForm?startupId=${startupId}` : '/api/startups/profileForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(endpointData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar la startup");
      }

      console.log("✅ Startup guardada exitosamente:", result);

      // Mostrar mensaje de éxito usando toast
      toast.success("Startup guardada exitosamente");

      // Actualizar el estado
      setIsNewStartup(false);

    } catch (error) {
      console.error("💥 Error guardando startup:", error);
      toast.error("Error al guardar la startup. Intenta nuevamente.");

    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  // Mostrar loading mientras se cargan los datos
  if (loadingData) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
        <div className="text-center">
          <div className="h-8 bg-muted animate-pulse rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-64 mx-auto"></div>
        </div>
        <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="space-y-4">
            <div className="h-6 bg-muted animate-pulse rounded w-32"></div>
            <div className="h-10 bg-muted animate-pulse rounded"></div>
            <div className="h-10 bg-muted animate-pulse rounded"></div>
            <div className="h-10 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

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