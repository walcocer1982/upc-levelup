"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

interface Startup {
  id: string;
  nombre: string;
  categoria: string;
  etapa: string;
  descripcion: string;
  rol: string;
  aceptado: boolean;
}

interface Application {
  id: string;
  estado: string;
  fecha: string;
  convocatoria: {
    tipo: string;
    fechaInicio: string;
    fechaFin: string;
  };
  startup: {
    nombre: string;
  };
}

export default function UserDashboardPage() {
  const { data: session } = useSession();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!session?.user?.email) return;

      try {
        setLoading(true);
        
        // Cargar startups del usuario
        const startupsResponse = await fetch('/api/users/startups');
        if (startupsResponse.ok) {
          const startupsData = await startupsResponse.json();
          setStartups(startupsData.startups || []);
        }

        // Cargar aplicaciones del usuario
        const applicationsResponse = await fetch('/api/users/applications');
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          setApplications(applicationsData.applications || []);
        }
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [session]);

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprobado':
        return 'bg-green-100 text-green-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      case 'en revisión':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEtapaColor = (etapa: string) => {
    switch (etapa.toLowerCase()) {
      case 'mvp':
        return 'bg-blue-100 text-blue-800';
      case 'idea':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Cargando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis Startups</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{startups.length}</div>
            <p className="text-xs text-muted-foreground">
              {startups.length === 1 ? 'Startup registrada' : 'Startups registradas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aplicaciones</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              {applications.length === 1 ? 'Aplicación enviada' : 'Aplicaciones enviadas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aplicaciones Pendientes</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.estado.toLowerCase() === 'pendiente').length}
            </div>
            <p className="text-xs text-muted-foreground">
              En espera de revisión
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/user?view=startups">
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Startup
            </Button>
          </Link>
          <Link href="/user?view=applications">
            <Button variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ver Aplicaciones
            </Button>
          </Link>
          <Link href="/user?view=profile">
            <Button variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Editar Perfil
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Startups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Mis Startups Recientes</CardTitle>
            <CardDescription>
              Tus startups y proyectos más recientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {startups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No tienes startups registradas</p>
                <Link href="/user?view=startups">
                  <Button size="sm">Crear mi primera startup</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {startups.slice(0, 3).map((startup) => (
                  <div key={startup.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{startup.nombre}</h3>
                      <p className="text-sm text-muted-foreground">{startup.descripcion}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getEtapaColor(startup.etapa)}>
                          {startup.etapa}
                        </Badge>
                        <Badge variant="outline">{startup.categoria}</Badge>
                      </div>
                    </div>
                    <Link href={`/user?view=startup-detail&id=${startup.id}`}>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </div>
                ))}
                {startups.length > 3 && (
                  <div className="text-center pt-4">
                    <Link href="/user?view=startups">
                      <Button variant="outline" size="sm">
                        Ver todas ({startups.length})
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Aplicaciones Recientes</CardTitle>
            <CardDescription>
              Estado de tus aplicaciones a convocatorias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No tienes aplicaciones</p>
                <Link href="/user?view=applications">
                  <Button size="sm">Ver convocatorias disponibles</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 3).map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{application.startup.nombre}</h3>
                      <p className="text-sm text-muted-foreground">
                        {application.convocatoria.tipo}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getEstadoColor(application.estado)}>
                          {application.estado}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(application.fecha).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link href={`/user?view=applications&id=${application.id}`}>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </div>
                ))}
                {applications.length > 3 && (
                  <div className="text-center pt-4">
                    <Link href="/user?view=applications">
                      <Button variant="outline" size="sm">
                        Ver todas ({applications.length})
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 