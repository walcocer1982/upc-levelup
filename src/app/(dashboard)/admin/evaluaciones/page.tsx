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
  Filter, 
  Eye, 
  Edit, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  FileText,
  Play,
  Gavel,
  Settings
} from "lucide-react";
import { getMockData, mockDB } from "@/data/mock";
import { EvaluationStorageManager } from "@/lib/ai/evaluation-storage";
import { getAllFormResponses, getFormResponseById } from "@/lib/ai/mock-adapter";

interface EvaluationListItem {
  id: string;
  startupName: string;
  postulacionId: string;
  convocatoriaName: string;
  puntajeTotal: number;
  puntajeIA: number | null;
  recomendacion: 'aprobado' | 'rechazado' | 'pendiente';
  status: 'evaluacion_ia' | 'en_revision_admin' | 'evaluacion_final';
  fechaEvaluacion: Date;
  evaluadorName: string;
  hasIAEvaluation: boolean;
  hasAdminReview: boolean;
}

export default function EvaluacionesPage() {
  const router = useRouter();
  const [evaluaciones, setEvaluaciones] = useState<EvaluationListItem[]>([]);
  const [filteredEvaluaciones, setFilteredEvaluaciones] = useState<EvaluationListItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [recomendacionFilter, setRecomendacionFilter] = useState('todos');

  useEffect(() => {
    loadEvaluaciones();
  }, []);

  useEffect(() => {
    filterEvaluaciones();
  }, [evaluaciones, searchTerm, statusFilter, recomendacionFilter]);

  const loadEvaluaciones = async () => {
    try {
      console.log('Cargando evaluaciones con sistema unificado...');

      // Obtener todas las postulaciones convertidas al formato original
      const formResponses = getAllFormResponses();
      console.log('FormResponses obtenidos:', formResponses.length);
      
      const postulaciones = await mockDB.read('postulaciones');
      const convocatorias = await mockDB.read('convocatorias');
      const users = await mockDB.read('users');

      // Crear lista de evaluaciones usando el sistema original
      const evaluacionesCompletas: EvaluationListItem[] = formResponses.map(formResponse => {
        const postulacion = postulaciones.find((p: any) => p.id === formResponse.id);
        const convocatoria = postulacion ? convocatorias.find((c: any) => c.id === postulacion.convocatoriaId) : null;
        const evaluador = users.find((u: any) => u.id === 'admin-001'); // Por defecto admin

        return {
          id: formResponse.id,
          startupName: formResponse.startupName,
          postulacionId: formResponse.id,
          convocatoriaName: convocatoria?.titulo || 'Convocatoria no encontrada',
          puntajeTotal: 0, // Se calculará con IA
          puntajeIA: null,
          recomendacion: 'pendiente',
          status: 'evaluacion_ia',
          fechaEvaluacion: new Date(),
          evaluadorName: evaluador ? `${evaluador.nombres} ${evaluador.apellidos}` : 'Admin',
          hasIAEvaluation: false,
          hasAdminReview: false
        };
      });

      // Verificar evaluaciones existentes en MockDB
      for (const evaluacion of evaluacionesCompletas) {
        try {
          const existingEvaluation = await EvaluationStorageManager.getEvaluationForUI(evaluacion.postulacionId);
          
          if (existingEvaluation && existingEvaluation.puntajes && existingEvaluation.puntajes.length > 0) {
            // Verificar si la evaluación tiene puntajes válidos (no todos en 0)
            const hasValidScores = existingEvaluation.puntajes.some((puntaje: any) => puntaje.puntaje > 0);
            const hasValidTotalScore = existingEvaluation.puntajeTotal > 0;
            
            if (hasValidScores && hasValidTotalScore) {
              evaluacion.hasIAEvaluation = true;
              evaluacion.puntajeIA = existingEvaluation.puntajeTotal * 25; // Convertir de 1-4 a 0-100
              evaluacion.puntajeTotal = evaluacion.puntajeIA;
              
              if (existingEvaluation.status === 'evaluacion_final') {
                evaluacion.status = 'evaluacion_final';
                evaluacion.recomendacion = existingEvaluation.recomendacion;
                evaluacion.hasAdminReview = true;
              } else if (existingEvaluation.status === 'en_revision_admin') {
                evaluacion.status = 'en_revision_admin';
                evaluacion.hasAdminReview = true;
              }
            } else {
              // Si tiene evaluación pero con puntajes 0, mantener como pendiente
              evaluacion.hasIAEvaluation = false;
              evaluacion.puntajeIA = null;
              evaluacion.puntajeTotal = 0;
              evaluacion.status = 'evaluacion_ia';
              evaluacion.recomendacion = 'pendiente';
            }
          }
        } catch (error) {
          console.error(`Error verificando evaluación para ${evaluacion.postulacionId}:`, error);
    }
      }

      setEvaluaciones(evaluacionesCompletas);
      
      // Calcular estadísticas mejoradas
      const evaluacionesConIA = evaluacionesCompletas.filter(e => e.hasIAEvaluation);
      const promedioIA = evaluacionesConIA.length > 0 
        ? evaluacionesConIA.reduce((sum, e) => sum + (e.puntajeIA || 0), 0) / evaluacionesConIA.length 
        : 0;

      const stats = {
        total: evaluacionesCompletas.length,
        promedioPuntaje: promedioIA,
        promedioPuntajeFormatted: (promedioIA / 25).toFixed(1), // Convertir a escala 1-4
        porRecomendacion: {
          aprobado: evaluacionesCompletas.filter(e => e.recomendacion === 'aprobado').length,
          rechazado: evaluacionesCompletas.filter(e => e.recomendacion === 'rechazado').length,
          pendiente: evaluacionesCompletas.filter(e => e.recomendacion === 'pendiente').length
        },
        porEstado: {
          evaluacion_ia: evaluacionesCompletas.filter(e => e.status === 'evaluacion_ia').length,
          en_revision_admin: evaluacionesCompletas.filter(e => e.status === 'en_revision_admin').length,
          evaluacion_final: evaluacionesCompletas.filter(e => e.status === 'evaluacion_final').length
        },
        evaluacionesIA: evaluacionesConIA.length
      };
      setStats(stats);
      
      setLoading(false);
    } catch (error) {
      console.error('Error cargando evaluaciones:', error);
      setLoading(false);
    }
  };

  const filterEvaluaciones = () => {
    let filtered = evaluaciones;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(evaluacion => 
        evaluacion.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluacion.convocatoriaName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(evaluacion => evaluacion.status === statusFilter);
    }

    // Filtro por recomendación
    if (recomendacionFilter !== 'todos') {
      filtered = filtered.filter(evaluacion => evaluacion.recomendacion === recomendacionFilter);
    }

    setFilteredEvaluaciones(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'evaluacion_ia': { color: 'bg-blue-100 text-blue-800', text: 'Evaluación IA', icon: Brain },
      'en_revision_admin': { color: 'bg-yellow-100 text-yellow-800', text: 'En Revisión', icon: Edit },
      'evaluacion_final': { color: 'bg-green-100 text-green-800', text: 'Evaluación Final', icon: CheckCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.evaluacion_ia;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getRecomendacionBadge = (recomendacion: string) => {
    const recomendacionConfig = {
      'aprobado': { color: 'bg-green-100 text-green-800', text: 'Aprobado', icon: CheckCircle },
      'rechazado': { color: 'bg-red-100 text-red-800', text: 'Rechazado', icon: XCircle },
      'pendiente': { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente', icon: Clock }
  };

    const config = recomendacionConfig[recomendacion as keyof typeof recomendacionConfig] || recomendacionConfig.pendiente;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score === 0) return "text-red-600"; // Para puntajes pendientes
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-blue-600";
    if (score >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreDisplay = (evaluacion: EvaluationListItem) => {
    if (evaluacion.hasIAEvaluation && evaluacion.puntajeTotal > 0) {
      return `${evaluacion.puntajeTotal.toFixed(1)}/100`;
    }
    return "Pendiente";
  };

  const getActionButton = (evaluacion: EvaluationListItem) => {
    if (!evaluacion.hasIAEvaluation || evaluacion.puntajeTotal === 0) {
      // Evaluación pendiente - botón "Evaluar" que lleva a respuestas
      return {
        text: "Evaluar",
        icon: Play,
        route: `/admin/evaluaciones/${evaluacion.postulacionId}/respuestas`,
        variant: "default" as const
      };
    } else {
      // Evaluación completada - botón "Ver Reporte" que lleva al informe IA
      return {
        text: "Ver Reporte",
        icon: Brain,
        route: `/admin/evaluaciones/${evaluacion.postulacionId}/revision-ia`,
        variant: "outline" as const
      };
    }
  };

  const handleViewEvaluation = (route: string) => {
    router.push(route);
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
        <Button className="bg-purple-600 hover:bg-purple-700">
          <BarChart3 className="w-4 h-4 mr-2" />
          Ver Estadísticas
        </Button>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Evaluaciones</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Puntuación Promedio IA</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(stats.promedioPuntaje)}`}>
                {stats.promedioPuntaje > 0 ? `${stats.promedioPuntaje.toFixed(1)}/100` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Promedio de evaluaciones IA
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.porRecomendacion.aprobado}
              </div>
              <p className="text-xs text-muted-foreground">
                Startups aprobadas
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar startup o convocatoria..."
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
                <SelectItem value="evaluacion_ia">Evaluación IA</SelectItem>
                <SelectItem value="en_revision_admin">En Revisión</SelectItem>
                <SelectItem value="evaluacion_final">Evaluación Final</SelectItem>
                </SelectContent>
              </Select>

            <Select value={recomendacionFilter} onValueChange={setRecomendacionFilter}>
                <SelectTrigger>
                <SelectValue placeholder="Recomendación" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="todos">Todas las recomendaciones</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
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
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
                          {getStatusBadge(evaluacion.status)}
                          {getRecomendacionBadge(evaluacion.recomendacion)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Convocatoria:</span>
                            <p>{evaluacion.convocatoriaName}</p>
                          </div>
                          <div>
                            <span className="font-medium">Puntuación:</span>
                            <p className={`font-semibold ${getScoreColor(evaluacion.puntajeTotal)}`}>
                              {getScoreDisplay(evaluacion)}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Evaluador:</span>
                            <p>{evaluacion.evaluadorName}</p>
                          </div>
                          <div>
                            <span className="font-medium">Fecha:</span>
                            <p>{evaluacion.fechaEvaluacion.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      
                                            <div className="flex items-center gap-2">
                        <Button 
                          variant={actionButton.variant}
                          size="sm"
                          onClick={() => handleViewEvaluation(actionButton.route)}
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