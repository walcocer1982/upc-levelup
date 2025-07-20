"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  FileText, 
  Brain,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Target,
  Zap,
  Award,
  Edit,
  Save,
  X,
  Eye,
  CheckSquare,
  AlertTriangle
} from "lucide-react";
import { getMockData } from "@/data/mock";
import { evaluarStartupLocal } from "@/lib/ai/local-evaluator";
import { IStartup } from "@/models/interfaces";
import { toast } from "sonner";
import { EvaluationStorageManager } from "@/lib/ai/evaluation-storage";
import { getFormResponseById } from "@/lib/ai/mock-adapter";

// Interfaces para la evaluación editable
interface EditableEvaluation {
  id?: string;
  startupId: string;
  startupName: string;
  scores: EditableScore[];
  totalScore: number;
  observations: string[];
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  status: 'evaluacion_ia' | 'en_revision_admin' | 'evaluacion_final';
  adminFeedback?: string;
  adminRecommendation?: 'aprobado' | 'rechazado' | 'pendiente';
  createdAt?: string;
  updatedAt?: string;
}

interface EditableScore {
  criterioId: string;
  criterioName: string;
  score: number;
  razones: string;
  mejoras: string;
  adminScore?: number;
  adminRazones?: string;
  adminMejoras?: string;
}

export default function InformeIAPage() {
  const params = useParams();
  const router = useRouter();
  const [startup, setStartup] = useState<IStartup | null>(null);
  const [postulacion, setPostulacion] = useState<any>(null);
  const [evaluacionIA, setEvaluacionIA] = useState<EditableEvaluation | null>(null);
  const [editableEvaluation, setEditableEvaluation] = useState<EditableEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluando, setEvaluando] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      const postulacionId = params.id as string;
      loadStartupData(postulacionId);
    }
  }, [params.id]);

  const loadStartupData = async (postulacionId: string) => {
    try {
      console.log('Cargando datos para postulación:', postulacionId);
      
      // Usar el adaptador para obtener las 16 respuestas en formato original
      const formResponse = getFormResponseById(postulacionId);
      if (!formResponse) {
        console.error('No se pudo convertir la postulación a FormResponses:', postulacionId);
        setLoading(false);
        return;
      }
      
      // Obtener datos de la startup usando el ID de la postulación original
      const postulacionOriginal = getMockData.getPostulacionById(postulacionId);
      if (!postulacionOriginal) {
        console.error('Postulación original no encontrada:', postulacionId);
        setLoading(false);
        return;
      }
      
      const startupData = getMockData.getStartupById(postulacionOriginal.startupId);
      if (!startupData) {
        console.error('Startup no encontrada para postulación:', postulacionId);
        console.log('Startup ID buscado:', postulacionOriginal.startupId);
        setLoading(false);
        return;
      }
      
      setStartup(startupData);
      setPostulacion(formResponse);
      
      // Buscar evaluaciones existentes usando el sistema original
      const evaluaciones = getMockData.getEvaluacionesByPostulacion(postulacionId);
      const evaluacionExistente = evaluaciones[0];
      
      if (evaluacionExistente) {
        console.log('Evaluación existente encontrada:', evaluacionExistente);
        // Convertir evaluación existente al formato editable
        const evaluacionEditable: EditableEvaluation = {
          id: evaluacionExistente.id,
          startupId: formResponse.id,
          startupName: formResponse.startupName,
          scores: evaluacionExistente.criteriosEvaluados.map((criterio: any) => ({
            criterioId: criterio.criterioId,
            criterioName: getCriterioName(criterio.criterioId),
            score: criterio.puntaje * 25, // Convertir de 1-4 a 0-100
            razones: criterio.justificacion,
            mejoras: criterio.feedback,
            adminScore: criterio.puntaje * 25,
            adminRazones: criterio.justificacion,
            adminMejoras: criterio.feedback
          })),
          totalScore: evaluacionExistente.puntajeTotal * 25,
          observations: [evaluacionExistente.feedbackGeneral],
          recommendations: [],
          strengths: [],
          weaknesses: [],
          status: evaluacionExistente.recomendacion === 'aprobado' ? 'evaluacion_final' : 'en_revision_admin',
          adminFeedback: evaluacionExistente.feedbackGeneral,
          adminRecommendation: evaluacionExistente.recomendacion,
          createdAt: evaluacionExistente.createdAt.toISOString(),
          updatedAt: evaluacionExistente.updatedAt.toISOString()
        };
        
        setEvaluacionIA(evaluacionEditable);
        setEditableEvaluation(evaluacionEditable);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  };

  const getCriterioName = (criterioId: string) => {
    const criterios = {
      // Criterios principales
      'complejidad_problema': 'Complejidad del Problema',
      'tamano_mercado': 'Tamaño de Mercado',
      'escalabilidad': 'Escalabilidad',
      'equipo_emprendedor': 'Equipo Emprendedor',
      // Criterios específicos por ID
      'criterio-001': 'Complejidad del Problema',
      'criterio-002': 'Tamaño de Mercado',
      'criterio-003': 'Escalabilidad',
      'criterio-004': 'Equipo Emprendedor',
      'criterio-013': 'Complejidad del Problema',
      'criterio-014': 'Complejidad del Problema',
      'criterio-015': 'Tamaño de Mercado',
      'criterio-016': 'Equipo Emprendedor',
      'criterio-017': 'Equipo Emprendedor',
      'criterio-018': 'Equipo Emprendedor',
      'criterio-019': 'Escalabilidad',
      'criterio-020': 'Escalabilidad',
      'criterio-021': 'Escalabilidad',
      'criterio-022': 'Tamaño de Mercado',
      'criterio-023': 'Tamaño de Mercado',
      'criterio-024': 'Tamaño de Mercado',
      'criterio-025': 'Escalabilidad'
    };
    return criterios[criterioId as keyof typeof criterios] || criterioId;
  };

  const handleEvaluarIA = async () => {
    if (!startup || !postulacion) return;
    
    setEvaluando(true);
    try {
      console.log('Iniciando evaluación IA con sistema unificado...');
      
      // Usar el evaluador original con las 16 respuestas
      const resultado = await evaluarStartupLocal(postulacion.id);
      
      if (resultado) {
        console.log('Evaluación IA completada:', resultado);
        
        const evaluacionEditable: EditableEvaluation = {
          startupId: postulacion.id,
          startupName: postulacion.startupName,
          scores: resultado.scores.map(score => ({
            criterioId: score.criterioId,
            criterioName: getCriterioName(score.criterioId),
            score: score.score,
            razones: score.razones,
            mejoras: score.mejoras
          })),
          totalScore: resultado.totalScore,
          observations: resultado.observations,
          recommendations: resultado.recommendations,
          strengths: resultado.strengths,
          weaknesses: resultado.weaknesses,
          status: 'evaluacion_ia'
        };
        
        setEvaluacionIA(evaluacionEditable);
        setEditableEvaluation(evaluacionEditable);
        
        toast.success('Evaluación IA completada exitosamente');
      } else {
        toast.error('No se pudo completar la evaluación IA');
      }
      
    } catch (error) {
      console.error('Error en evaluación IA:', error);
      toast.error('Error al evaluar con IA. Intenta nuevamente.');
    } finally {
      setEvaluando(false);
    }
  };

  const handleEditEvaluation = () => {
    setIsEditing(true);
    setEditableEvaluation(evaluacionIA);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableEvaluation(evaluacionIA);
  };

  const handleSaveEvaluation = async () => {
    if (!editableEvaluation || !postulacion) return;
    
    setSaving(true);
    try {
      // Guardar evaluación en la base de datos simulada
      const evaluationId = EvaluationStorageManager.saveEvaluation(editableEvaluation, postulacion.id);
      
      const evaluacionGuardada = {
        ...editableEvaluation,
        id: evaluationId,
        status: 'evaluacion_final',
        updatedAt: new Date().toISOString()
      };
      
      setEvaluacionIA(evaluacionGuardada);
      setEditableEvaluation(evaluacionGuardada);
      setIsEditing(false);
      
      toast.success('Evaluación guardada exitosamente');
    } catch (error) {
      console.error('Error guardando evaluación:', error);
      toast.error('Error al guardar la evaluación');
    } finally {
      setSaving(false);
    }
  };

  const updateScore = (criterioId: string, field: 'adminScore' | 'adminRazones' | 'adminMejoras', value: string | number) => {
    if (!editableEvaluation) return;
    
    setEditableEvaluation(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        scores: prev.scores.map(score => 
          score.criterioId === criterioId 
            ? { ...score, [field]: value }
            : score
        )
      };
    });
  };

  const updateGeneralField = (field: keyof EditableEvaluation, value: any) => {
    if (!editableEvaluation) return;
    
    setEditableEvaluation(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const obtenerIconoCriterio = (criterioId: string) => {
    const iconos: { [key: string]: any } = {
      'complejidad_problema': <Building2 className="w-5 h-5" />,
      'tamano_mercado': <TrendingUp className="w-5 h-5" />,
      'escalabilidad': <Zap className="w-5 h-5" />,
      'equipo_emprendedor': <Users className="w-5 h-5" />
    };
    return iconos[criterioId] || <FileText className="w-5 h-5" />;
  };

  const obtenerColorScore = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'evaluacion_ia': { color: 'bg-blue-100 text-blue-800', text: 'Evaluación IA' },
      'en_revision_admin': { color: 'bg-yellow-100 text-yellow-800', text: 'En Revisión' },
      'evaluacion_final': { color: 'bg-green-100 text-green-800', text: 'Evaluación Final' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.evaluacion_ia;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!startup || !postulacion) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">No se encontró la startup o postulación</div>
        </div>
      </div>
    );
  }

  const currentEvaluation = isEditing ? editableEvaluation : evaluacionIA;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Informe de Evaluación IA</h1>
            <p className="text-gray-600">
              {isEditing ? 'Editando evaluación' : 'Análisis automatizado de la startup'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {evaluacionIA && !isEditing && (
            <>
              {getStatusBadge(evaluacionIA.status)}
              <Button 
                onClick={handleEditEvaluation}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            </>
          )}
          
          {isEditing && (
            <>
              <Button 
                onClick={handleCancelEdit}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveEvaluation}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </>
          )}
        
        {!evaluacionIA && (
          <Button 
            onClick={handleEvaluarIA} 
            disabled={evaluando}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            {evaluando ? 'Evaluando...' : 'Evaluar con IA'}
          </Button>
        )}
        </div>
      </div>

      {/* Información de la Startup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Información de la Startup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="font-medium">Nombre:</span>
              <p className="text-gray-700">{startup.nombre}</p>
            </div>
            <div>
              <span className="font-medium">Sector:</span>
              <p className="text-gray-700">{startup.categoria}</p>
            </div>
            <div>
              <span className="font-medium">Estado Postulación:</span>
              <Badge className="bg-blue-100 text-blue-800">
                {postulacion.estado}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados de la Evaluación */}
      {currentEvaluation ? (
        <div className="space-y-6">
          {/* Puntuación General */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Award className="w-5 h-5" />
                Puntuación General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {Math.round(currentEvaluation.totalScore)}/100
                </div>
                <Badge className={`text-lg px-4 py-2 ${obtenerColorScore(currentEvaluation.totalScore)}`}>
                  {currentEvaluation.totalScore >= 80 ? 'Excelente' : 
                   currentEvaluation.totalScore >= 60 ? 'Bueno' : 
                   currentEvaluation.totalScore >= 40 ? 'Regular' : 'Necesita Mejora'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Criterios Evaluados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Criterios Evaluados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEvaluation.scores.map((score, index) => (
                  <div key={score.criterioId} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-50">
                        {obtenerIconoCriterio(score.criterioId)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{score.criterioName}</h3>
                      </div>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={score.adminScore || score.score}
                            onChange={(e) => updateScore(score.criterioId, 'adminScore', parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500">/100</span>
                        </div>
                      ) : (
                        <Badge className={obtenerColorScore(score.adminScore || score.score)}>
                          {score.adminScore || score.score}/100
                      </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600">Razones:</h4>
                        {isEditing ? (
                          <Textarea
                            value={score.adminRazones || score.razones}
                            onChange={(e) => updateScore(score.criterioId, 'adminRazones', e.target.value)}
                            className="text-sm"
                            rows={3}
                          />
                        ) : (
                          <p className="text-sm text-gray-700">{score.adminRazones || score.razones}</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-600">Mejoras:</h4>
                        {isEditing ? (
                          <Textarea
                            value={score.adminMejoras || score.mejoras}
                            onChange={(e) => updateScore(score.criterioId, 'adminMejoras', e.target.value)}
                            className="text-sm"
                            rows={3}
                          />
                        ) : (
                          <p className="text-sm text-gray-700">{score.adminMejoras || score.mejoras}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Observaciones y Recomendaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fortalezas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  Fortalezas Principales
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={currentEvaluation.strengths.join('\n')}
                    onChange={(e) => updateGeneralField('strengths', e.target.value.split('\n').filter(s => s.trim()))}
                    placeholder="Ingresa las fortalezas principales..."
                    rows={4}
                  />
                ) : (
                <ul className="space-y-2">
                    {currentEvaluation.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
                )}
              </CardContent>
            </Card>

            {/* Áreas de Mejora */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
                  <Target className="w-5 h-5" />
                  Áreas de Mejora
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={currentEvaluation.weaknesses.join('\n')}
                    onChange={(e) => updateGeneralField('weaknesses', e.target.value.split('\n').filter(s => s.trim()))}
                    placeholder="Ingresa las áreas de mejora..."
                    rows={4}
                  />
                ) : (
                <ul className="space-y-2">
                    {currentEvaluation.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Observaciones Generales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Observaciones Generales
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={currentEvaluation.adminFeedback || currentEvaluation.observations.join('\n')}
                  onChange={(e) => updateGeneralField('adminFeedback', e.target.value)}
                  placeholder="Ingresa las observaciones generales..."
                  rows={4}
                />
              ) : (
              <ul className="space-y-2">
                  {(currentEvaluation.adminFeedback ? [currentEvaluation.adminFeedback] : currentEvaluation.observations).map((observation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{observation}</span>
                  </li>
                ))}
              </ul>
              )}
            </CardContent>
          </Card>

          {/* Recomendación Final */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Recomendación Final
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <Select
                    value={currentEvaluation.adminRecommendation || 'pendiente'}
                    onValueChange={(value) => updateGeneralField('adminRecommendation', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una recomendación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aprobado">Aprobado</SelectItem>
                      <SelectItem value="rechazado">Rechazado</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {currentEvaluation.adminRecommendation === 'aprobado' ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Aprobado
                    </Badge>
                  ) : currentEvaluation.adminRecommendation === 'rechazado' ? (
                    <Badge className="bg-red-100 text-red-800">
                      <XCircle className="w-4 h-4 mr-1" />
                      Rechazado
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="w-4 h-4 mr-1" />
                      Pendiente
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Estado inicial - Sin evaluación */
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Evaluación con Inteligencia Artificial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Evaluación IA Pendiente
              </h3>
              <p className="text-gray-600 mb-4">
                Haz clic en "Evaluar con IA" para generar un análisis automatizado 
                de la startup basado en las respuestas del usuario.
              </p>
              <Button 
                onClick={handleEvaluarIA} 
                disabled={evaluando}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                {evaluando ? 'Evaluando...' : 'Evaluar con IA'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 