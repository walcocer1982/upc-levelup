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
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

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
  linkedin: z.string().url("Ingresa una URL válida de LinkedIn"),
  biografia: z.string().min(10, "La biografía debe tener al menos 10 caracteres"),
  politicaPrivacidad: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  userData?: Partial<FormValues>;
  userEmail?: string;
  onSubmit: (data: FormValues) => void;
  isLoading?: boolean;
}

export default function ProfileForm({
  userData,
  userEmail = "",
  onSubmit,
  isLoading = false
}: ProfileFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState(userEmail);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      dni: "",
      telefono: "",
      correoLaureate: "",
      linkedin: "",
      biografia: "",
      politicaPrivacidad: false,
    },
  });

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log("🔍 Cargando datos del usuario...");
        
        const response = await fetch('/api/auth/register-profile', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const { user } = await response.json();
          console.log("✅ Datos del usuario cargados:", user);
          
          // Actualizar el email del usuario
          setCurrentUserEmail(user.email);
          
          // Preparar los datos para el formulario
          const formData = {
            nombres: user.nombres || "",
            apellidos: user.apellidos || "",
            dni: user.dni || "",
            telefono: user.telefono || "",
            correoLaureate: user.correoLaureate || "",
            linkedin: user.linkedin || "",
            biografia: user.biografia || "",
            politicaPrivacidad: user.haAceptadoPolitica || false,
          };

          console.log("📝 Datos preparados para el formulario:", formData);
          console.log("📧 Email del usuario:", user.email);

          // Actualizar el formulario con los datos del usuario
          form.reset(formData);

          // Actualizar el contador de caracteres de biografía
          setCharCount(user.biografia?.length || 0);
          
        } else {
          console.log("❌ Error al cargar datos del usuario:", response.status);
        }
      } catch (error) {
        console.error("💥 Error cargando datos del usuario:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadUserData();
  }, [form]);

  // Actualizar contador cuando cambie la biografía
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'biografia') {
        setCharCount(value.biografia?.length || 0);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (data: FormValues) => {
    setSubmitting(true);

    try {
      // Llamar al onSubmit proporcionado por el componente padre (para mantener compatibilidad)
      onSubmit(data);

      // Enviar los datos al endpoint de la API
      const response = await fetch('/api/auth/register-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          haAceptadoPolitica: data.politicaPrivacidad
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al actualizar el perfil");
      }

      // Mostrar mensaje de éxito usando toast
      toast.success("Tu información ha sido guardada correctamente.");

      // La redirección se manejará según el flujo existente

    } catch (error) {
      console.error("💥 Error actualizando perfil:", error);
      toast.error("No se pudo actualizar tu perfil. Intenta nuevamente.");
    } finally {
      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
    }
  };

  // Mostrar loading mientras se cargan los datos
  if (loadingData) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
          <div className="h-10 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
          <div className="h-10 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-28"></div>
          <div className="h-10 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
          <div className="h-10 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Email del usuario fuera del Form */}
      <div className="mb-6">
        <label className="text-sm font-medium">Correo electrónico</label>
        <Input
          value={currentUserEmail}
          disabled
          className="bg-muted mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Este correo fue proporcionado por tu autenticación con Google
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil de LinkedIn <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/username" {...field} />
                </FormControl>
                <FormDescription>
                  URL completa del perfil de LinkedIn
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="biografia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biografía <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Breve descripción de tu experiencia y habilidades"
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <div className="flex justify-end">
                  <span className={`text-xs ${charCount < 10 ? 'text-destructive' :
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
                  <label className="text-sm font-medium">
                    Acepto la política de privacidad
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Al marcar esta casilla, aceptas nuestra{" "}
                    <a
                      href="/politica-privacidad"
                      className="text-primary underline"
                      target="_blank"
                    >
                      política de privacidad
                    </a>
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={isLoading || submitting}
          >
            {isLoading || submitting ? "Guardando..." : "Guardar información"}
          </Button>
        </form>
      </Form>
    </div>
  );
}