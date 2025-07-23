"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Building, Calendar, Globe, Play, Users, Target, Award } from "lucide-react";

interface Startup {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  etapa: string;
  fechaFundacion: string;
  paginaWeb?: string;
  videoPitchUrl?: string;
  razonSocial?: string;
  ruc?: string;
  origen: string;
}

interface Member {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  rol: string;
  aceptado: boolean;
}

export default function StartupDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const startupId = params.id as string;

  const [startup, setStartup] = useState<Startup | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStartupDetails = async () => {
      if (!session?.user?.email || !startupId) return;

      try {
        setLoading(true);
        
        // Cargar detalles de la startup
        const startupResponse = await fetch(`/api/startups/${startupId}/profile`);
        if (startupResponse.ok) {
          const startupData = await startupResponse.json();
          setStartup(startupData.startup);
        }

        // Cargar miembros de la startup
        const membersResponse = await fetch(`/api/startups/${startupId}/members`);
        if (membersResponse.ok) {
          const membersData = await membersResponse.json();
          setMembers(membersData.members || []);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar los detalles de la startup');
      } finally {
        setLoading(false);
      }
    };

    loadStartupDetails();
  }, [session, startupId]);

  const getCategoriaColor = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'fintech':
        return 'bg-green-100 text-green-800';
      case 'edutech':
        return 'bg-blue-100 text-blue-800';
      case 'healthtech':
        return 'bg-red-100 text-red-800';
      case 'ecommerce':
        return 'bg-purple-100 text-purple-800';
      case 'tech':
        return 'bg-gray-100 text-gray-800';
      case 'green':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEtapaColor = (etapa: string) => {
    switch (etapa.toLowerCase()) {
      case 'idea':
        return 'bg-yellow-100 text-yellow-800';
      case 'mvp':
        return 'bg-blue-100 text-blue-800';
      case 'traction':
        return 'bg-green-100 text-green-800';
      case 'growth':
        return 'bg-purple-100 text-purple-800';
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
        <span className="ml-2 text-muted-foreground">Cargando startup...</span>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Startup no encontrada</h3>
            <p className="text-muted-foreground mb-4">
              La startup que buscas no existe o no tienes permisos para acceder.
            </p>
            <Link href="/user/startups">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Startups
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
        <Link href="/user/startups">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Startups
          </Button>
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{startup.nombre}</h1>
            <p className="text-muted-foreground mt-2">
              {startup.descripcion}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/user/startups/${startupId}/impacto`}>
              <Button>
                <Target className="w-4 h-4 mr-2" />
                Formulario de Impacto
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="equipo">Equipo</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Categoría</h3>
                    <Badge className={getCategoriaColor(startup.categoria)}>
                      {startup.categoria}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Etapa</h3>
                    <Badge className={getEtapaColor(startup.etapa)}>
                      {startup.etapa}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Fecha de Fundación</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(startup.fechaFundacion)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Origen</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {startup.origen}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {startup.razonSocial && (
                    <div>
                      <h3 className="font-medium mb-2">Razón Social</h3>
                      <p className="text-sm text-muted-foreground">
                        {startup.razonSocial}
                      </p>
                    </div>
                  )}
                  
                  {startup.ruc && (
                    <div>
                      <h3 className="font-medium mb-2">RUC</h3>
                      <p className="text-sm text-muted-foreground">
                        {startup.ruc}
                      </p>
                    </div>
                  )}
                  
                  {startup.paginaWeb && (
                    <div>
                      <h3 className="font-medium mb-2">Página Web</h3>
                      <a 
                        href={startup.paginaWeb} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Globe className="w-4 h-4" />
                        {startup.paginaWeb}
                      </a>
                    </div>
                  )}
                  
                  {startup.videoPitchUrl && (
                    <div>
                      <h3 className="font-medium mb-2">Video Pitch</h3>
                      <a 
                        href={startup.videoPitchUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Play className="w-4 h-4" />
                        Ver Video Pitch
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipo" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipo</CardTitle>
              <CardDescription>
                Miembros del equipo de {startup.nombre}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay miembros registrados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {members.map((member) => (
                    <div key={member.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">
                            {member.nombres} {member.apellidos}
                          </h3>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <Badge variant={member.aceptado ? "default" : "secondary"}>
                          {member.aceptado ? "Aceptado" : "Pendiente"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Rol:</strong> {member.rol}</p>
                        <p><strong>Teléfono:</strong> {member.telefono}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos y Enlaces</CardTitle>
              <CardDescription>
                Documentos y recursos relacionados con {startup.nombre}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Formulario de Impacto</h3>
                      <p className="text-sm text-muted-foreground">
                        Respuestas del formulario de impacto
                      </p>
                    </div>
                  </div>
                  <Link href={`/user/startups/${startupId}/impacto`}>
                    <Button variant="outline" size="sm">
                      Ver Formulario
                    </Button>
                  </Link>
                </div>
                
                {startup.paginaWeb && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-green-600" />
                      <div>
                        <h3 className="font-medium">Página Web</h3>
                        <p className="text-sm text-muted-foreground">
                          Sitio web oficial
                        </p>
                      </div>
                    </div>
                    <a 
                      href={startup.paginaWeb} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        Visitar
                      </Button>
                    </a>
                  </div>
                )}
                
                {startup.videoPitchUrl && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-red-600" />
                      <div>
                        <h3 className="font-medium">Video Pitch</h3>
                        <p className="text-sm text-muted-foreground">
                          Presentación de la startup
                        </p>
                      </div>
                    </div>
                    <a 
                      href={startup.videoPitchUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        Ver Video
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 