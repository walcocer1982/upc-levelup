"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, CheckCircle, XCircle, Clock, Download, Filter, Search } from "lucide-react";
import { mockStartups } from "@/data/mock/startups";
import { mockEvaluaciones } from "@/data/mock/evaluaciones";
import { mockPostulaciones } from "@/data/mock/postulaciones";
import Link from "next/link";

// Tipos para las evaluaciones
interface Evaluacion {
  id: string;
  nombre: string;
  categoria: string;
  puntuacion: number;
  estado: "pendiente" | "aprobada" | "rechazada";
  fecha: string;
  fortalezas: string[];
  startupId: string;
}

// Función para combinar datos de startups, evaluaciones y postulaciones
const generarEvaluacionesCompletas = (): Evaluacion[] => {
  const evaluacionesCompletas: Evaluacion[] = [];

  // Procesar evaluaciones existentes
  mockEvaluaciones.forEach(evaluacion => {
    const postulacion = mockPostulaciones.find(p => p.id === evaluacion.postulacionId);
    const startup = mockStartups.find(s => s.id === postulacion?.startupId);
    
    if (startup && postulacion) {
      evaluacionesCompletas.push({
        id: evaluacion.id,
        startupId: startup.id,
        nombre: startup.nombre,
        categoria: startup.categoria,
        puntuacion: evaluacion.puntajeTotal || 0,
        estado: evaluacion.recomendacion === 'aprobado' ? 'aprobada' : 
                evaluacion.recomendacion === 'rechazado' ? 'rechazada' : 'pendiente',
        fecha: evaluacion.fechaEvaluacion.toLocaleDateString('es-ES'),
        fortalezas: evaluacion.feedbackGeneral ? [evaluacion.feedbackGeneral] : []
      });
    }
  });

  return evaluacionesCompletas;
};

export default function AdminEvaluacionesPage() {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [filtradas, setFiltradas] = useState<Evaluacion[]>([]);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    const evaluacionesCompletas = generarEvaluacionesCompletas();
    setEvaluaciones(evaluacionesCompletas);
    setFiltradas(evaluacionesCompletas);
  }, []);
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  
  // Estados de filtros
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroPuntuacion, setFiltroPuntuacion] = useState<[number, number]>([0, 100]);
  const [busqueda, setBusqueda] = useState<string>("");



  // Aplicar filtros
  useEffect(() => {
    let resultado = evaluaciones;

    // Filtro por categoría
    if (filtroCategoria !== "todas") {
      resultado = resultado.filter(e => e.categoria.toLowerCase() === filtroCategoria);
    }

    // Filtro por estado
    if (filtroEstado !== "todos") {
      resultado = resultado.filter(e => e.estado === filtroEstado);
    }

    // Filtro por puntuación
    resultado = resultado.filter(e => e.puntuacion >= filtroPuntuacion[0] && e.puntuacion <= filtroPuntuacion[1]);

    // Filtro por búsqueda
    if (busqueda) {
      resultado = resultado.filter(e => 
        e.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setFiltradas(resultado);
  }, [evaluaciones, filtroCategoria, filtroEstado, filtroPuntuacion, busqueda]);

  // Funciones de acción
  const toggleSeleccion = (id: string) => {
    setSeleccionadas(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const seleccionarTodo = () => {
    setSeleccionadas(filtradas.map(e => e.id));
  };

  const deseleccionarTodo = () => {
    setSeleccionadas([]);
  };

  const aprobarSeleccionadas = () => {
    setEvaluaciones(prev => 
      prev.map(e => 
        seleccionadas.includes(e.id) 
          ? { ...e, estado: "aprobada" as const }
          : e
      )
    );
    setSeleccionadas([]);
  };

  const rechazarSeleccionadas = () => {
    setEvaluaciones(prev => 
      prev.map(e => 
        seleccionadas.includes(e.id) 
          ? { ...e, estado: "rechazada" as const }
          : e
      )
    );
    setSeleccionadas([]);
  };

  // Funciones auxiliares
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "aprobada": return "bg-green-100 text-green-800";
      case "rechazada": return "bg-red-100 text-red-800";
      case "pendiente": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "aprobada": return <CheckCircle className="w-4 h-4" />;
      case "rechazada": return <XCircle className="w-4 h-4" />;
      case "pendiente": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPuntuacionColor = (puntuacion: number) => {
    if (puntuacion >= 75) return "text-green-600 font-bold";
    if (puntuacion >= 50) return "text-yellow-600 font-bold";
    return "text-red-600 font-bold";
  };

  // Estadísticas
  const total = filtradas.length;
  const pendientes = filtradas.filter(e => e.estado === "pendiente").length;
  const aprobadas = filtradas.filter(e => e.estado === "aprobada").length;
  const rechazadas = filtradas.filter(e => e.estado === "rechazada").length;
  const promedio = filtradas.length > 0 
    ? (filtradas.reduce((sum, e) => sum + e.puntuacion, 0) / filtradas.length).toFixed(1)
    : "0.0";

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Evaluaciones de Startups</h1>
          <p className="text-muted-foreground">Gestión y aprobación de evaluaciones</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Excel
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="edtech">EdTech</SelectItem>
                  <SelectItem value="fintech">FinTech</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="aprobada">Aprobada</SelectItem>
                  <SelectItem value="rechazada">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Puntuación mínima</label>
              <Input 
                type="number" 
                min="0" 
                max="100"
                value={filtroPuntuacion[0]}
                onChange={(e) => setFiltroPuntuacion([parseInt(e.target.value) || 0, filtroPuntuacion[1]])}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Puntuación máxima</label>
              <Input 
                type="number" 
                min="0" 
                max="100"
                value={filtroPuntuacion[1]}
                onChange={(e) => setFiltroPuntuacion([filtroPuntuacion[0], parseInt(e.target.value) || 100])}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Nombre startup..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => {
              setFiltroCategoria("todas");
              setFiltroEstado("todos");
              setFiltroPuntuacion([0, 100]);
              setBusqueda("");
            }}>
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pendientes}</div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{aprobadas}</div>
            <div className="text-sm text-muted-foreground">Aprobadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{rechazadas}</div>
            <div className="text-sm text-muted-foreground">Rechazadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{promedio}</div>
            <div className="text-sm text-muted-foreground">Promedio</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Hoy</div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones masivas */}
      {seleccionadas.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  {seleccionadas.length} evaluaciones seleccionadas
                </span>
                <Button variant="outline" size="sm" onClick={deseleccionarTodo}>
                  Deseleccionar todo
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={aprobarSeleccionadas}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Aprobar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={rechazarSeleccionadas}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Rechazar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de evaluaciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Evaluaciones ({total})</CardTitle>
            <Button variant="outline" size="sm" onClick={seleccionarTodo}>
              Seleccionar todo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <Checkbox 
                      checked={seleccionadas.length === filtradas.length && filtradas.length > 0}
                      onCheckedChange={(checked) => checked ? seleccionarTodo() : deseleccionarTodo()}
                    />
                  </th>
                  <th className="text-left p-3 font-medium">Startup</th>
                  <th className="text-left p-3 font-medium">Categoría</th>
                  <th className="text-left p-3 font-medium">Puntuación</th>
                  <th className="text-left p-3 font-medium">Estado</th>
                  <th className="text-left p-3 font-medium">Fecha</th>
                  <th className="text-left p-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((evaluacion) => (
                  <tr key={evaluacion.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <Checkbox 
                        checked={seleccionadas.includes(evaluacion.id)}
                        onCheckedChange={() => toggleSeleccion(evaluacion.id)}
                      />
                    </td>
                    <td className="p-3 font-medium">{evaluacion.nombre}</td>
                    <td className="p-3">
                      <Badge variant="outline">{evaluacion.categoria}</Badge>
                    </td>
                    <td className="p-3">
                      <span className={getPuntuacionColor(evaluacion.puntuacion)}>
                        {evaluacion.puntuacion}/100
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge className={getEstadoColor(evaluacion.estado)}>
                        <span className="flex items-center gap-1">
                          {getEstadoIcon(evaluacion.estado)}
                          {evaluacion.estado.charAt(0).toUpperCase() + evaluacion.estado.slice(1)}
                        </span>
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {evaluacion.fecha}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/evaluaciones/${evaluacion.startupId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {evaluacion.estado === "pendiente" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => {
                                setEvaluaciones(prev => 
                                  prev.map(e => 
                                    e.id === evaluacion.id 
                                      ? { ...e, estado: "aprobada" as const }
                                      : e
                                  )
                                );
                              }}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => {
                                setEvaluaciones(prev => 
                                  prev.map(e => 
                                    e.id === evaluacion.id 
                                      ? { ...e, estado: "rechazada" as const }
                                      : e
                                  )
                                );
                              }}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtradas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron evaluaciones con los filtros aplicados
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {filtradas.length} de {evaluaciones.length} evaluaciones
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="outline" size="sm" disabled>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
} 