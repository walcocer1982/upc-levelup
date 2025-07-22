"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

interface Startup {
  id: string;
  nombre: string;
  categoria: string;
  etapa: string;
  descripcion: string;
  fechaFundacion: string;
  paginaWeb?: string;
  rol: string;
  aceptado: boolean;
  memberId: string;
}

export default function UserStartupsPage() {
  const { data: session } = useSession();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    const loadUserStartups = async () => {
      if (!session?.user?.email) return;

      try {
        setLoading(true);
        const response = await fetch('/api/users/startups');
        
        if (response.ok) {
          const data = await response.json();
          setStartups(data.startups || []);
        } else {
          console.error('Error cargando startups:', response.status);
          toast.error('Error al cargar tus startups');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    loadUserStartups();
  }, [session]);

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || startup.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

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

  const handleJoinStartup = async (startupId: string) => {
    try {
      const response = await fetch('/api/users/startups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startupId,
          rol: 'Miembro'
        }),
      });

      if (response.ok) {
        toast.success('Te has unido exitosamente a la startup');
        // Recargar startups
        const reloadResponse = await fetch('/api/users/startups');
        if (reloadResponse.ok) {
          const data = await reloadResponse.json();
          setStartups(data.startups || []);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al unirse a la startup');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Cargando startups...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mis Startups</h1>
            <p className="text-muted-foreground">
              Gestiona tus startups y proyectos
            </p>
          </div>
          <Link href="/user/startups/nueva">
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Startup
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar startups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Todas las categorías</option>
            <option value="fintech">Fintech</option>
            <option value="edutech">Edutech</option>
            <option value="healthtech">Healthtech</option>
            <option value="ecommerce">E-commerce</option>
            <option value="logistics">Logística</option>
            <option value="sustainability">Sostenibilidad</option>
            <option value="ai-ml">IA/ML</option>
            <option value="other">Otro</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{startups.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Startups Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {startups.filter(s => s.aceptado).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {startups.filter(s => !s.aceptado).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Startups List */}
      {filteredStartups.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No se encontraron startups</h3>
            <p className="text-muted-foreground mb-4">
              {startups.length === 0 
                ? "No tienes startups registradas. Crea tu primera startup para comenzar."
                : "No hay startups que coincidan con tu búsqueda."
              }
            </p>
            {startups.length === 0 && (
              <Link href="/user/startups/nueva">
                <Button>Crear mi primera startup</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map((startup) => (
            <Card key={startup.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{startup.nombre}</CardTitle>
                    <CardDescription className="mt-2">
                      {startup.descripcion.length > 100 
                        ? `${startup.descripcion.substring(0, 100)}...`
                        : startup.descripcion
                      }
                    </CardDescription>
                  </div>
                  {!startup.aceptado && (
                    <Badge variant="outline" className="ml-2">
                      Pendiente
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getEtapaColor(startup.etapa)}>
                      {startup.etapa}
                    </Badge>
                    <Badge className={getCategoriaColor(startup.categoria)}>
                      {startup.categoria}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Rol:</strong> {startup.rol}</p>
                    <p><strong>Fundada:</strong> {new Date(startup.fechaFundacion).toLocaleDateString()}</p>
                    {startup.paginaWeb && (
                      <p><strong>Web:</strong> 
                        <a 
                          href={startup.paginaWeb} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline ml-1"
                        >
                          Ver sitio
                        </a>
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/user/startups/${startup.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Detalles
                      </Button>
                    </Link>
                    <Link href={`/user/startups/${startup.id}/editar`} className="flex-1">
                      <Button size="sm" className="w-full">
                        Editar
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