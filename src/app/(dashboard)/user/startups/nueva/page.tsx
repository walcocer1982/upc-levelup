"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import StartupProfileForm from "@/views/components/forms/startup/ProfileForm";
import Link from "next/link";

export default function NuevaStartupPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/startups/profileForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Startup creada exitosamente');
        router.push('/user/startups');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al crear la startup');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Debes iniciar sesión para crear una startup</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/user/startups">
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Crear Nueva Startup</h1>
          <p className="text-muted-foreground">
            Completa la información básica de tu startup
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Startup</CardTitle>
            <CardDescription>
              Proporciona los datos básicos de tu emprendimiento. Podrás completar más información después.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StartupProfileForm
              onSubmit={handleSubmit}
              startupId={undefined}
            />
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">💡 Consejos para crear tu startup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Nombre claro:</strong> Elige un nombre que refleje tu propuesta de valor y sea fácil de recordar.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Descripción concisa:</strong> Explica en pocas palabras qué problema resuelves y cómo lo haces.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Categoría precisa:</strong> Selecciona la categoría que mejor describe tu industria o sector.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Etapa realista:</strong> Sé honesto sobre el estado actual de tu proyecto.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 