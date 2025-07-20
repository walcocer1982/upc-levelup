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
  Brain,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Users,
  FileText,
  AlertTriangle,
  Award,
  Edit,
  Save,
  Send,
  Download,
  Eye,
  BarChart3,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from "lucide-react";
import { getMockData } from "@/data/mock";
import { getFormResponseById } from "@/lib/ai/mock-adapter";
import { evaluarStartupLocal } from "@/lib/ai/local-evaluator";
import { EvaluationStorageManager } from "@/lib/ai/evaluation-storage";
import { localStorageManager } from "@/lib/ai/local-storage";
import { toast } from "sonner";

interface EvaluationResult {
  id: string;
  startupId: string;
  startupName: string;
  scores: {
    criterioId: string;
    criterioName: string;
    score: number;
    razones: string;
    mejoras: string;
  }[];
  totalScore: number;
  observations: string[];
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  status: 'evaluacion_ia' | 'en_revision_admin' | 'evaluacion_final';
  createdAt: string;
}

interface AdminEvaluation {
  adminFeedback: string;
  adminRecommendation: 'aprobado' | 'rechazado' | 'pendiente';
  adminScores: {
    criterioId: string;
    score: number;
    razones: string;
  }[];
  finalDecision: string;
  nextSteps: string;
}

export default function ReporteFinalPage() {
  const params = useParams();
  const router = useRouter();
  const [startup, setStartup] = useState<any>(null);
  const [postulacion, setPostulacion] = useState<any>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [adminEvaluation, setAdminEvaluation] = useState<AdminEvaluation>({
    adminFeedback: '',
    adminRecommendation: 'pendiente',
    adminScores: [],
    finalDecision: '',
    nextSteps: ''
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      const postulacionId = params.id as string;
      loadData(postulacionId);
    }
  }, [params.id]);

  const loadData = async (postulacionId: string) => {
    try {
      console.log('Cargando datos para reporte final:', postulacionId);
      
      // Obtener postulación
      const postulacion = getMockData.getPostulacionById(postulacionId);
      if (!postulacion) {
        throw new Error('Postulación no encontrada');
      }
      
      // Obtener startup
      const startup = getMockData.getStartupById(postulacion.startupId);
      if (!startup) {
        throw new Error('Startup no encontrada');
      }
      
      setPostulacion(postulacion);
      setStartup(startup);
      
      // Obtener evaluación existente usando el método correcto
      const existingEvaluation = EvaluationStorageManager.getEvaluationByPostulacion(postulacionId);
      
      if (existingEvaluation) {
        // Convertir evaluación mock a formato de la UI
        const evaluationResult: EvaluationResult = {
          id: existingEvaluation.id,
          startupId: postulacion.startupId,
          startupName: startup.nombre,
          scores: existingEvaluation.criteriosEvaluados.map(criterio => ({
            criterioId: criterio.criterioId,
            criterioName: getCriterioName(criterio.criterioId),
            score: criterio.puntaje * 25, // Convertir de 1-4 a 0-100
            razones: criterio.justificacion,
            mejoras: criterio.feedback
          })),
          totalScore: existingEvaluation.puntajeTotal * 25,
          observations: existingEvaluation.feedbackGeneral.split('\n'),
          recommendations: ['Recomendaciones basadas en la evaluación'],
          strengths: ['Fortalezas identificadas'],
          weaknesses: ['Áreas de mejora'],
          status: existingEvaluation.status,
          createdAt: existingEvaluation.createdAt.toISOString()
        };
        
        setEvaluationResult(evaluationResult);
      } else {
        // Si no hay evaluación, crear una nueva
        console.log('No se encontró evaluación existente, creando nueva...');
        const formResponse = getFormResponseById(postulacionId);
        if (formResponse) {
          // Obtener las respuestas convertidas
          console.log('Obteniendo respuestas para evaluación...');
          
          // Ejecutar evaluación real usando la API del servidor
          console.log('Ejecutando evaluación IA con API del servidor...');
          const response = await fetch('/api/startup/evaluate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              startupId: postulacionId,
              startupName: formResponse.startupName,
              respuestas: {
                complejidad: formResponse.complejidad,
                mercado: formResponse.mercado,
                escalabilidad: formResponse.escalabilidad,
                equipo: formResponse.equipo
              }
            })
          });

          if (!response.ok) {
            throw new Error('Error en la API de evaluación');
          }

          const data = await response.json();
          const resultado = data.evaluation;
          if (resultado) {
            const evaluationResult: EvaluationResult = {
              id: postulacionId,
              startupId: postulacion.startupId,
              startupName: startup.nombre,
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
              status: 'evaluacion_ia',
              createdAt: new Date().toISOString()
            };
            setEvaluationResult(evaluationResult);
          }
        }
      }
      
      // Inicializar adminScores con los scores de IA
      if (evaluationResult) {
        setAdminEvaluation(prev => ({
          ...prev,
          adminScores: evaluationResult.scores.map(score => ({
            criterioId: score.criterioId,
            score: score.score,
            razones: score.razones
          }))
        }));
      }
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
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
      'complejidad': 'Complejidad del Problema',
      'mercado': 'Tamaño de Mercado',
      'equipo': 'Equipo Emprendedor',
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

  const getScoreColor = (score: number) => {
    if (score >= 3.5) return "text-green-600";
    if (score >= 2.5) return "text-blue-600";
    if (score >= 1.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 3.5) return { color: 'bg-green-100 text-green-800', text: 'Excelente', icon: Star };
    if (score >= 2.5) return { color: 'bg-blue-100 text-blue-800', text: 'Bueno', icon: ThumbsUp };
    if (score >= 1.5) return { color: 'bg-yellow-100 text-yellow-800', text: 'Regular', icon: Clock };
    return { color: 'bg-red-100 text-red-800', text: 'Necesita Mejora', icon: AlertTriangle };
  };

  const getRecommendationBadge = (recommendation: string) => {
    const config = {
      'aprobado': { color: 'bg-green-100 text-green-800', text: 'Aprobado', icon: CheckCircle },
      'rechazado': { color: 'bg-red-100 text-red-800', text: 'Rechazado', icon: XCircle },
      'pendiente': { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente', icon: Clock }
    };
    
    const selected = config[recommendation as keyof typeof config] || config.pendiente;
    const Icon = selected.icon;
    
    return (
      <Badge className={selected.color}>
        <Icon className="w-3 h-3 mr-1" />
        {selected.text}
      </Badge>
    );
  };

  const updateAdminScore = (criterioId: string, field: 'score' | 'razones', value: string | number) => {
    setAdminEvaluation(prev => ({
      ...prev,
      adminScores: prev.adminScores.map(score => 
        score.criterioId === criterioId 
          ? { ...score, [field]: value }
          : score
      )
    }));
  };

  const updateAdminField = (field: keyof AdminEvaluation, value: any) => {
    setAdminEvaluation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEvaluation = async () => {
    setSaving(true);
    try {
      if (!evaluationResult) return;

      // Calcular puntuación total del admin
      const totalAdminScore = adminEvaluation.adminScores.reduce((sum, score) => sum + score.score, 0) / adminEvaluation.adminScores.length;

      const finalEvaluation = {
        ...evaluationResult,
        status: 'evaluacion_final' as const,
        adminFeedback: adminEvaluation.adminFeedback,
        adminRecommendation: adminEvaluation.adminRecommendation,
        adminScores: adminEvaluation.adminScores,
        finalDecision: adminEvaluation.finalDecision,
        nextSteps: adminEvaluation.nextSteps,
        totalAdminScore,
        updatedAt: new Date().toISOString()
      };

      // Guardar en storage
      try {
        EvaluationStorageManager.saveEvaluation(finalEvaluation, postulacionId);
        console.log('Evaluación guardada exitosamente');
      } catch (error) {
        console.error('Error guardando evaluación:', error);
        // Continuar sin guardar en storage
      }

      setEvaluationResult(finalEvaluation);
      setIsEditing(false);
      toast.success('Evaluación guardada exitosamente');
    } catch (error) {
      console.error('Error guardando evaluación:', error);
      toast.error('Error al guardar la evaluación');
    } finally {
      setSaving(false);
    }
  };

  const handleSendDecision = async () => {
    try {
      // Aquí se enviaría la decisión final al sistema
      toast.success('Decisión enviada exitosamente');
      
      // Actualizar estado de la postulación
      // En un sistema real, esto actualizaría la base de datos
      console.log('Decisión final enviada:', adminEvaluation.adminRecommendation);
    } catch (error) {
      console.error('Error enviando decisión:', error);
      toast.error('Error al enviar la decisión');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando reporte final...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!evaluationResult) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No se encontró evaluación</h2>
          <p className="text-gray-600 mb-4">No hay una evaluación disponible para esta postulación.</p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reporte Final de Evaluación
            </h1>
            <p className="text-gray-600">
              {startup?.nombre} - Decisión Administrativa
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getRecommendationBadge(adminEvaluation.adminRecommendation)}
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
          </Button>
        </div>
      </div>

      {/* Información de la Startup */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Información de la Startup</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre</p>
              <p className="text-lg font-semibold">{startup?.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Categoría</p>
              <p className="text-lg">{startup?.categoria}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Etapa</p>
              <p className="text-lg">{startup?.etapa}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Postulación</p>
              <p className="text-lg">{postulacion?.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Evaluación IA */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Evaluación por IA</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-3xl font-bold ${getScoreColor(evaluationResult.totalScore)}`}>
                {evaluationResult.totalScore.toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">Puntuación IA</p>
              <Badge className={`mt-2 ${getScoreBadge(evaluationResult.totalScore).color}`}>
                {getScoreBadge(evaluationResult.totalScore).text}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {evaluationResult.strengths.length}
              </div>
              <p className="text-sm text-gray-600">Fortalezas</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {evaluationResult.weaknesses.length}
              </div>
              <p className="text-sm text-gray-600">Áreas de Mejora</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluación Administrativa */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Evaluación Administrativa</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Recomendación Final */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Recomendación Final
                </label>
                <Select 
                  value={adminEvaluation.adminRecommendation} 
                  onValueChange={(value: 'aprobado' | 'rechazado' | 'pendiente') => 
                    updateAdminField('adminRecommendation', value)
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aprobado">Aprobado</SelectItem>
                    <SelectItem value="rechazado">Rechazado</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Puntuación Total Admin
                </label>
                <div className="text-2xl font-bold text-blue-600">
                  {(adminEvaluation.adminScores.reduce((sum, score) => sum + score.score, 0) / adminEvaluation.adminScores.length).toFixed(1)}/4.0
                </div>
              </div>
            </div>

            {/* Puntuaciones por Criterio */}
            <div>
              <h4 className="font-medium mb-4">Puntuaciones por Criterio</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evaluationResult.scores.map((score, index) => {
                  const adminScore = adminEvaluation.adminScores.find(s => s.criterioId === score.criterioId);
                  return (
                    <div key={score.criterioId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{score.criterioName}</h5>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">IA: {score.score.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">|</span>
                          {isEditing ? (
                            <Input
                              type="number"
                              min="0"
                              max="4"
                              step="0.1"
                              value={adminScore?.score || score.score}
                              onChange={(e) => updateAdminScore(score.criterioId, 'score', parseFloat(e.target.value) || 0)}
                              className="w-16"
                            />
                          ) : (
                            <span className={`font-bold ${getScoreColor(adminScore?.score || score.score)}`}>
                              {adminScore?.score?.toFixed(1) || score.score.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs font-medium text-gray-600">Razones:</label>
                            <Textarea
                              value={adminScore?.razones || score.razones}
                              onChange={(e) => updateAdminScore(score.criterioId, 'razones', e.target.value)}
                              className="text-xs"
                              rows={2}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback Administrativo */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Feedback Administrativo
              </label>
              <Textarea
                value={adminEvaluation.adminFeedback}
                onChange={(e) => updateAdminField('adminFeedback', e.target.value)}
                placeholder="Escribe tu feedback administrativo..."
                disabled={!isEditing}
                rows={4}
              />
            </div>

            {/* Decisión Final */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Decisión Final
              </label>
              <Textarea
                value={adminEvaluation.finalDecision}
                onChange={(e) => updateAdminField('finalDecision', e.target.value)}
                placeholder="Describe la decisión final..."
                disabled={!isEditing}
                rows={3}
              />
            </div>

            {/* Próximos Pasos */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Próximos Pasos
              </label>
              <Textarea
                value={adminEvaluation.nextSteps}
                onChange={(e) => updateAdminField('nextSteps', e.target.value)}
                placeholder="Define los próximos pasos..."
                disabled={!isEditing}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/evaluaciones/${params.id}/respuestas`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Respuestas
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/evaluaciones/${params.id}/revision-ia`)}
          >
            <Brain className="w-4 h-4 mr-2" />
            Ver Evaluación IA
          </Button>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEvaluation}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button
                onClick={handleSendDecision}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Decisión
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 