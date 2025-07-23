"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, Award, Target, Building } from "lucide-react";

interface Convocatoria {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  criterios?: any;
  postulaciones?: Array<{
    id: string;
    startupId: string;
    estado: string;
    fecha: string;
    startup: {
      id: string;
      nombre: string;
      categoria: string;
    };
  }>;
}

export default function ConvocatoriaDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const convocatoriaId = params.id as string;

  const [convocatoria, setConvocatoria] = useState<Convocatoria | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConvocatoriaDetails = async () => {
      if (!session?.user?.email || !convocatoriaId) return;

      try {
        setLoading(true);
        
        const response = await fetch(`/api/convocatorias/${convocatoriaId}`);
        if (response.ok) {
          const data = await response.json();
          setConvocatoria(data.convocatoria);
        } else {
          console.error('Error cargando convocatoria:', response.status);
          toast.error('Error al cargar los detalles de la convocatoria');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    loadConvocatoriaDetails();
  }, [session, convocatoriaId]);

  const getTipoIcon = (titulo: string) => {
    if (titulo.toLowerCase().includes('aceleracion')) {
      return <Award className="w-4 h-4" />;
    } else if (titulo.toLowerCase().includes('inqubalab')) {
      return <Target className="w-4 h-4" />;
    } else {
      return <Building className="w-4 h-4" />;
    }
  };

  const getTipoColor = (titulo: string) => {
    if (titulo.toLowerCase().includes('aceleracion')) {
      return 'bg-blue-100 text-blue-800';
    } else if (titulo.toLowerCase().includes('inqubalab')) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isActive = () => {
    if (!convocatoria) return false;
    const now = new Date();
    const start = new Date(convocatoria.fechaInicio);
    const end = new Date(convocatoria.fechaFin);
    return now >= start && now <= end;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Cargando convocatoria...</span>
      </div>
    );
  }

  if (!convocatoria) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Convocatoria no encontrada</h3>
            <p className="text-muted-foreground mb-4">
              La convocatoria que buscas no existe o no tienes permisos para acceder.
            </p>
            <Link href="/user/convocatorias">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Convocatorias
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/user/convocatorias">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Convocatorias
          </Button>
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {getTipoIcon(convocatoria.titulo)}
              <h1 className="text-3xl font-bold">{convocatoria.titulo}</h1>
              <Badge className={getTipoColor(convocatoria.titulo)}>
                {convocatoria.titulo}
              </Badge>
              <Badge variant={isActive() ? "default" : "secondary"}>
                {isActive() ? "Activa" : "Cerrada"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Detalles de la convocatoria y postulaciones
            </p>
          </div>
          
          {isActive() && (
            <Link href={`/user/convocatorias/${convocatoriaId}/postular`}>
              <Button>
                <Target className="w-4 h-4 mr-2" />
                Postular
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Información General */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Fecha de Inicio</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(convocatoria.fechaInicio)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Fecha de Cierre</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(convocatoria.fechaFin)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Postulaciones</p>
                <p className="text-sm text-muted-foreground">
                  {convocatoria.postulaciones?.length || 0} startups
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Postulaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Postulaciones</CardTitle>
          <CardDescription>
            Startups que han postulado a esta convocatoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!convocatoria.postulaciones || convocatoria.postulaciones.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay postulaciones registradas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {convocatoria.postulaciones.map((postulacion) => (
                <div key={postulacion.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-medium">{postulacion.startup.nombre}</h3>
                      <p className="text-sm text-muted-foreground">
                        {postulacion.startup.categoria}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={postulacion.estado === 'aprobado' ? 'default' : 'secondary'}>
                      {postulacion.estado}
                    </Badge>
                    <Link href={`/user/startups/${postulacion.startup.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Startup
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 