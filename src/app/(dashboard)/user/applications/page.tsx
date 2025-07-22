"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

interface Application {
  id: string;
  estado: string;
  fecha: string;
  convocatoria: {
    id: string;
    tipo: string;
    fechaInicio: string;
    fechaFin: string;
  };
  startup: {
    id: string;
    nombre: string;
    categoria: string;
  };
  evaluaciones?: Array<{
    id: string;
    estado: string;
    puntajeTotal: number;
    createdAt: string;
  }>;
}

export default function UserApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const loadUserApplications = async () => {
      if (!session?.user?.email) return;

      try {
        setLoading(true);
        const response = await fetch('/api/users/applications');
        
        if (response.ok) {
          const data = await response.json();
          setApplications(data.applications || []);
        } else {
          console.error('Error cargando aplicaciones:', response.status);
          toast.error('Error al cargar tus aplicaciones');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    loadUserApplications();
  }, [session]);

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.startup.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.convocatoria.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || application.estado.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

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
      case 'evaluado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'fintech':
        return 'bg-green-100 text-green-800';
      case 'edutech':
        return 'bg-blue-100 text-blue-800';
      case 'healthtech':
        return 'bg-red-100 text-red-800';
      case 'ecommerce':
        return 'bg-orange-100 text-orange-800';
      default:
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Cargando aplicaciones...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mis Aplicaciones</h1>
        <p className="text-muted-foreground">
          Revisa el estado de tus aplicaciones a convocatorias
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por startup o convocatoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en revisión">En Revisión</option>
            <option value="evaluado">Evaluado</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.estado.toLowerCase() === 'pendiente').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.estado.toLowerCase() === 'en revisión').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.estado.toLowerCase() === 'evaluado').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No se encontraron aplicaciones</h3>
            <p className="text-muted-foreground mb-4">
              {applications.length === 0 
                ? "No tienes aplicaciones enviadas. Revisa las convocatorias disponibles."
                : "No hay aplicaciones que coincidan con tu búsqueda."
              }
            </p>
            {applications.length === 0 && (
              <Link href="/convocatorias">
                <Button>Ver Convocatorias</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{application.startup.nombre}</CardTitle>
                    <CardDescription className="mt-2">
                      Convocatoria: {application.convocatoria.tipo}
                    </CardDescription>
                  </div>
                  <Badge className={getEstadoColor(application.estado)}>
                    {application.estado}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getCategoriaColor(application.startup.categoria)}>
                      {application.startup.categoria}
                    </Badge>
                    <Badge variant="outline">
                      {formatDate(application.fecha)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Fecha de aplicación:</strong> {formatDate(application.fecha)}</p>
                    <p><strong>Convocatoria:</strong> {application.convocatoria.tipo}</p>
                    <p><strong>Período:</strong> {formatDate(application.convocatoria.fechaInicio)} - {formatDate(application.convocatoria.fechaFin)}</p>
                    
                    {application.evaluaciones && application.evaluaciones.length > 0 && (
                      <div className="mt-2">
                        <p><strong>Evaluaciones:</strong></p>
                        {application.evaluaciones.map((evaluacion, index) => (
                          <div key={evaluacion.id} className="ml-4 mt-1">
                            <p className="text-xs">
                              Evaluación {index + 1}: {evaluacion.estado} 
                              {evaluacion.puntajeTotal && ` - Puntaje: ${evaluacion.puntajeTotal}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/user/startups/${application.startup.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Startup
                      </Button>
                    </Link>
                    <Link href={`/convocatorias/${application.convocatoria.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Convocatoria
                      </Button>
                    </Link>
                    {application.evaluaciones && application.evaluaciones.length > 0 && (
                      <Link href={`/evaluaciones/${application.evaluaciones[0].id}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          Ver Evaluación
                        </Button>
                      </Link>
                    )}
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