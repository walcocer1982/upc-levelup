"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Startup {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  etapa: string;
  fechaFundacion: string;
  paginaWeb?: string;
  videoPitchUrl?: string;
  rol: string;
  aceptado: boolean;
}

export default function UserStartupsPage() {
  const { data: session } = useSession();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("fecha-reciente");

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

  const filteredAndSortedStartups = startups
    .filter(startup => {
      const matchesSearch = startup.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           startup.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || startup.categoria === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "fecha-reciente":
          return new Date(b.fechaFundacion).getTime() - new Date(a.fechaFundacion).getTime();
        case "fecha-antigua":
          return new Date(a.fechaFundacion).getTime() - new Date(b.fechaFundacion).getTime();
        case "nombre-az":
          return a.nombre.localeCompare(b.nombre);
        case "nombre-za":
          return b.nombre.localeCompare(a.nombre);
        case "etapa":
          const etapaOrder = { "idea": 1, "mvp": 2, "escalado": 3 };
          return (etapaOrder[a.etapa.toLowerCase()] || 0) - (etapaOrder[b.etapa.toLowerCase()] || 0);
        default:
          return 0;
      }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Cargando startups...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Mis Startups</h1>
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

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar startup..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="Tech">Tech</SelectItem>
            <SelectItem value="EdTech">EdTech</SelectItem>
            <SelectItem value="FinTech">FinTech</SelectItem>
            <SelectItem value="HealthTech">HealthTech</SelectItem>
            <SelectItem value="E-commerce">E-commerce</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fecha-reciente">Fecha (Más Reciente)</SelectItem>
            <SelectItem value="fecha-antigua">Fecha (Más Antigua)</SelectItem>
            <SelectItem value="nombre-az">Nombre (A-Z)</SelectItem>
            <SelectItem value="nombre-za">Nombre (Z-A)</SelectItem>
            <SelectItem value="etapa">Etapa de Desarrollo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Startups List */}
      {filteredAndSortedStartups.length === 0 ? (
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
                : "No hay startups que coincidan con tu búsqueda o filtros aplicados."
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedStartups.map((startup) => (
            <Card key={startup.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header con nombre y estado */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{startup.nombre}</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {startup.descripcion.length > 80 
                          ? `${startup.descripcion.substring(0, 80)}...`
                          : startup.descripcion
                        }
                      </p>
                    </div>
                    {!startup.aceptado && (
                      <Badge variant="outline" className="ml-2 flex-shrink-0 text-xs">
                        Pendiente
                      </Badge>
                    )}
                  </div>
                  
                  {/* Badges y detalles en línea */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex gap-1">
                      <Badge className={`${getEtapaColor(startup.etapa)} text-xs`}>
                        {startup.etapa}
                      </Badge>
                      <Badge className={`${getCategoriaColor(startup.categoria)} text-xs`}>
                        {startup.categoria}
                      </Badge>
                    </div>
                    <span>•</span>
                    <span><strong>Rol:</strong> {startup.rol}</span>
                    <span>•</span>
                    <span><strong>Fundada:</strong> {new Date(startup.fechaFundacion).toLocaleDateString()}</span>
                    {startup.paginaWeb && (
                      <>
                        <span>•</span>
                        <a 
                          href={startup.paginaWeb} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          <strong>Web:</strong> Ver sitio
                        </a>
                      </>
                    )}
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="flex gap-2 pt-1">
                    <Link href={`/user/startups/${startup.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Ver Detalles
                      </Button>
                    </Link>
                    <Link href={`/user/startups/${startup.id}/impacto`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Completar Impacto
                      </Button>
                    </Link>
                    <Link href={`/user/startups/${startup.id}/editar`} className="flex-1">
                      <Button size="sm" className="w-full text-xs">
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