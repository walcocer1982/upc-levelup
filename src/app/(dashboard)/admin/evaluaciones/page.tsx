"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Brain, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  BarChart3,
  Users,
  TrendingUp,
  AlertCircle,
  FileText
} from "lucide-react";
import { EvaluacionStatus, PostulacionStatus } from "@/data/mock/types";
import { StorageStats } from "@/components/ui/storage-stats";

// Interfaces para la UI
interface EvaluacionUI {
  id: string;
  postulacionId: string;
  startupName: string;
  estado: EvaluacionStatus;
  puntajeTotal: number;
  evaluadorId: string;
  fechaEvaluacion?: Date;
  metadata: {
    tiempoEvaluacion: number;
    intentos: number;
  };
  tieneEvaluacion: boolean;
}

interface EstadisticasUI {
  total: number;
  evaluacionesIA: number;
  promedioPuntaje: number;
  aprobadas: number;
}

export default function EvaluacionesPage() {
  const router = useRouter();
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionUI[]>([]);
  const [filteredEvaluaciones, setFilteredEvaluaciones] = useState<EvaluacionUI[]>([]);
  const [stats, setStats] = useState<EstadisticasUI>({
    total: 0,
    evaluacionesIA: 0,
    promedioPuntaje: 0,
    aprobadas: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [puntajeFilter, setPuntajeFilter] = useState("todos");

  // Cargar evaluaciones
  useEffect(() => {
    const cargarEvaluaciones = async () => {
      try {
        setLoading(true);
        
        // Obtener evaluaciones desde el endpoint API
        const response = await fetch('/api/evaluaciones');
        const data = await response.json();
        
        if (data.success) {
          // Mapear los estados string al enum
          const mapearEstado = (estado: string): EvaluacionStatus => {
            switch (estado) {
              case 'PENDIENTE': return EvaluacionStatus.PENDIENTE;
              case 'EN_PROCESO': return EvaluacionStatus.EN_PROCESO;
              case 'COMPLETADA': return EvaluacionStatus.COMPLETADA;
              case 'REQUIERE_REVISION': return EvaluacionStatus.REQUIERE_REVISION;
              default: return EvaluacionStatus.PENDIENTE;
            }
          };
          
          const evaluacionesData = data.evaluaciones.map((evaluacion: any) => ({
            ...evaluacion,
            estado: mapearEstado(evaluacion.estado),
            fechaEvaluacion: new Date(evaluacion.fechaEvaluacion)
          }));

          setEvaluaciones(evaluacionesData);
          setStats(data.estadisticas);
        } else {
          console.error('Error en la respuesta del servidor:', data.error);
        }
        
      } catch (error) {
        console.error('Error cargando evaluaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarEvaluaciones();
  }, []);

  // Filtrar evaluaciones
  useEffect(() => {
    let filtered = evaluaciones;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(evaluacion => 
        evaluacion.startupName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(evaluacion => evaluacion.estado === statusFilter);
    }

    // Filtro por puntaje
    if (puntajeFilter !== 'todos') {
      filtered = filtered.filter(evaluacion => {
        if (puntajeFilter === 'aprobado') return evaluacion.puntajeTotal >= 70;
        if (puntajeFilter === 'rechazado') return evaluacion.puntajeTotal < 70;
        return true;
      });
    }

    setFilteredEvaluaciones(filtered);
  }, [evaluaciones, searchTerm, statusFilter, puntajeFilter]);

  const getStatusBadge = (evaluacion: EvaluacionUI) => {
    switch (evaluacion.estado) {
      case EvaluacionStatus.PENDIENTE:
        return (
          <Badge variant="outline" className="bg-gray-100">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case EvaluacionStatus.EN_PROCESO:
        return (
          <Badge variant="outline" className="bg-blue-100">
            <Brain className="w-3 h-3 mr-1" />
            En Evaluación
          </Badge>
        );
      case EvaluacionStatus.COMPLETADA:
        return (
          <Badge variant="outline" className="bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        );
      case EvaluacionStatus.REQUIERE_REVISION:
        return (
          <Badge variant="outline" className="bg-yellow-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Requiere Revisión
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            Desconocido
          </Badge>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score === 0) return "text-gray-600";
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getActionButton = (evaluacion: EvaluacionUI) => {
    switch (evaluacion.estado) {
      case EvaluacionStatus.PENDIENTE:
        return {
          text: "Revisar Respuestas",
          icon: FileText,
          action: () => router.push(`/admin/evaluaciones/${evaluacion.postulacionId}/respuestas`),
          variant: "default" as const
        };
      case EvaluacionStatus.EN_PROCESO:
        return {
          text: "Continuar Evaluación",
          icon: Brain,
          action: () => router.push(`/admin/evaluaciones/${evaluacion.postulacionId}/revision-ia`),
          variant: "default" as const
        };
      case EvaluacionStatus.COMPLETADA:
        return {
          text: "Ver Evaluación",
          icon: Eye,
          action: () => router.push(`/admin/evaluaciones/${evaluacion.postulacionId}/revision-ia`),
          variant: "outline" as const
        };
      case EvaluacionStatus.REQUIERE_REVISION:
        return {
          text: "Revisar",
          icon: AlertCircle,
          action: () => router.push(`/admin/evaluaciones/${evaluacion.postulacionId}/revision-ia`),
          variant: "destructive" as const
        };
      default:
        return {
          text: "Ver Detalles",
          icon: Eye,
          action: () => router.push(`/admin/evaluaciones/${evaluacion.postulacionId}/respuestas`),
          variant: "outline" as const
        };
    }
  };

  const iniciarEvaluacion = async (postulacionId: string) => {
    try {
      // Llamar a la API route para iniciar evaluación
      const response = await fetch('/api/evaluaciones/iniciar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postulacionId }),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar la evaluación');
      }

      const result = await response.json();
      
      if (result.success) {
        router.push(`/admin/evaluaciones/${postulacionId}/revision-ia`);
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error iniciando evaluación:', error);
      // TODO: Mostrar error al usuario
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando evaluaciones...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Evaluaciones</h1>
          <p className="text-gray-600">Gestión y revisión de evaluaciones de startups</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evaluaciones</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Evaluaciones registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluaciones IA</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.evaluacionesIA}
            </div>
            <p className="text-xs text-muted-foreground">
              Con evaluación automática
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntuación Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(stats.promedioPuntaje)}`}>
              {stats.promedioPuntaje > 0 ? `${stats.promedioPuntaje.toFixed(1)}/100` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Promedio de evaluaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.aprobadas}
            </div>
            <p className="text-xs text-muted-foreground">
              Startups aprobadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas de Almacenamiento */}
      <StorageStats />

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar startup..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value={EvaluacionStatus.PENDIENTE}>Pendiente</SelectItem>
                <SelectItem value={EvaluacionStatus.EN_PROCESO}>En Evaluación</SelectItem>
                <SelectItem value={EvaluacionStatus.COMPLETADA}>Completada</SelectItem>
                <SelectItem value={EvaluacionStatus.REQUIERE_REVISION}>Requiere Revisión</SelectItem>
              </SelectContent>
            </Select>

            <Select value={puntajeFilter} onValueChange={setPuntajeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Puntaje" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="aprobado">Aprobado (≥70)</SelectItem>
                <SelectItem value="rechazado">Rechazado (&lt;70)</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-sm text-gray-500 flex items-center justify-end">
              {filteredEvaluaciones.length} de {evaluaciones.length} evaluaciones
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Evaluaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evaluaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEvaluaciones.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron evaluaciones</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvaluaciones.map((evaluacion) => {
                const actionButton = getActionButton(evaluacion);
                const ActionIcon = actionButton.icon;

                return (
                  <div key={evaluacion.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{evaluacion.startupName}</h3>
                          {getStatusBadge(evaluacion)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Puntuación:</span>
                            <p className={`font-semibold ${getScoreColor(evaluacion.puntajeTotal)}`}>
                              {evaluacion.puntajeTotal > 0 ? `${evaluacion.puntajeTotal.toFixed(1)}/100` : 'Pendiente'}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Evaluador:</span>
                            <p>{evaluacion.evaluadorId}</p>
                          </div>
                          <div>
                            <span className="font-medium">Fecha:</span>
                            <p>{evaluacion.fechaEvaluacion ? new Date(evaluacion.fechaEvaluacion).toLocaleDateString() : 'Pendiente'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={actionButton.variant}
                          size="sm"
                          onClick={actionButton.action}
                          className="flex items-center gap-2"
                        >
                          <ActionIcon className="w-4 h-4" />
                          {actionButton.text}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 