"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Tipos para las startups
interface Startup {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  estado: "activa" | "inactiva" | "pendiente";
  fechaCreacion: string;
  propietario: {
    nombre: string;
    email: string;
  };
  evaluaciones: number;
  puntuacionPromedio: number;
}

export default function AdminStartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [loading, setLoading] = useState(true);

  // Cargar startups desde la base de datos
  useEffect(() => {
    const loadStartups = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/startups');
        
        if (response.ok) {
          const data = await response.json();
          setStartups(data.startups || []);
        } else {
          console.error('Error cargando startups:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStartups();
  }, []);

  // Filtrar startups
  useEffect(() => {
    let filtered = startups;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(startup =>
        startup.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.propietario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.propietario.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (categoryFilter !== "todas") {
      filtered = filtered.filter(startup => startup.categoria === categoryFilter);
    }

    // Filtro por estado
    if (statusFilter !== "todas") {
      filtered = filtered.filter(startup => startup.estado === statusFilter);
    }

    setFilteredStartups(filtered);
  }, [startups, searchTerm, categoryFilter, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "activa":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "inactiva":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Ver Startups</h1>
            <p className="text-muted-foreground">
              Visualiza todas las startups registradas en el sistema (solo lectura)
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Cargando startups...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ver Startups</h1>
          <p className="text-muted-foreground">
            Visualiza todas las startups registradas en el sistema (solo lectura)
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Los usuarios crean sus propias startups
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Buscar startup..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorías</SelectItem>
                <SelectItem value="Tech">Tech</SelectItem>
                <SelectItem value="EdTech">EdTech</SelectItem>
                <SelectItem value="FinTech">FinTech</SelectItem>
                <SelectItem value="Green">Green</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos los estados</SelectItem>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="inactiva">Inactiva</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setCategoryFilter("todas");
              setStatusFilter("todas");
            }}>
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{startups.length}</div>
            <div className="text-sm text-muted-foreground">Total de Startups</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {startups.filter(s => s.estado === "activa").length}
            </div>
            <div className="text-sm text-muted-foreground">Activas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {startups.filter(s => s.estado === "pendiente").length}
            </div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {startups.filter(s => s.estado === "inactiva").length}
            </div>
            <div className="text-sm text-muted-foreground">Inactivas</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Startups */}
      <Card>
        <CardHeader>
          <CardTitle>
            Startups ({filteredStartups.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStartups.map((startup) => (
              <div
                key={startup.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{startup.nombre}</h3>
                    <Badge className={getStatusColor(startup.estado)}>
                      {startup.estado}
                    </Badge>
                    <Badge variant="outline">{startup.categoria}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {startup.descripcion}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Propietario: {startup.propietario.nombre}</span>
                    <span>•</span>
                    <span>{startup.propietario.email}</span>
                    <span>•</span>
                    <span>Creada: {new Date(startup.fechaCreacion).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Evaluaciones: {startup.evaluaciones}</span>
                    {startup.evaluaciones > 0 && (
                      <>
                        <span>•</span>
                        <span className={getScoreColor(startup.puntuacionPromedio)}>
                          Puntuación: {startup.puntuacionPromedio}/100
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" title="Ver detalles">
                    <Eye size={16} />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredStartups.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron startups con los filtros aplicados
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 