"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Convocatoria {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  createdAt: string;
}

export default function DebugConvocatoriasPage() {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConvocatorias = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/convocatorias');
        
        if (response.ok) {
          const data = await response.json();
          setConvocatorias(data.convocatorias || []);
        } else {
          console.error('Error cargando convocatorias:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConvocatorias();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Cargando convocatorias...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Debug - Convocatorias Disponibles</h1>
        <p className="text-muted-foreground mt-2">
          Lista de todas las convocatorias en la base de datos
        </p>
      </div>

      {convocatorias.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No hay convocatorias disponibles</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {convocatorias.map((convocatoria) => (
            <Card key={convocatoria.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{convocatoria.titulo}</CardTitle>
                    <CardDescription className="mt-2">
                      ID: {convocatoria.id}
                    </CardDescription>
                  </div>
                  <Badge variant={convocatoria.estado === 'ACTIVA' ? 'default' : 'secondary'}>
                    {convocatoria.estado}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {convocatoria.descripcion}
                  </p>
                  
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Fecha de Inicio:</strong> {formatDate(convocatoria.fechaInicio)}</p>
                    <p><strong>Fecha de Fin:</strong> {formatDate(convocatoria.fechaFin)}</p>
                    <p><strong>Creada:</strong> {formatDate(convocatoria.createdAt)}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/user/convocatorias/${convocatoria.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </Link>
                    <Link href={`/user/convocatorias/${convocatoria.id}/postular`}>
                      <Button size="sm">
                        Postular
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 