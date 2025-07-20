"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Building2, 
  Brain,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Users,
  FileText,
  AlertTriangle,
  Play,
  Loader2,
  Sparkles,
  BarChart3,
  Award,
  Save
} from "lucide-react";
import { getMockData } from "@/data/mock";
import { getFormResponseById } from "@/lib/ai/mock-adapter";
import { evaluarStartupLocal } from "@/lib/ai/local-evaluator";
import { EvaluationStorageManager } from "@/lib/ai/evaluation-storage";
import { localStorageManager } from "@/lib/ai/local-storage";
import { toast } from "sonner";

interface EvaluationProgress {
  currentStep: number;
  totalSteps: number;
  currentStepName: string;
  progress: number;
}

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

export default function RevisionIAPage() {
  const params = useParams();
  const router = useRouter();
  const [startup, setStartup] = useState<any>(null);
  const [postulacion, setPostulacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationProgress, setEvaluationProgress] = useState<EvaluationProgress>({
    currentStep: 0,
    totalSteps: 4,
    currentStepName: 'Preparando evaluación...',
    progress: 0
  });
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      const postulacionId = params.id as string;
      loadData(postulacionId);
    }
  }, [params.id]);

  const loadData = async (postulacionId: string) => {
    try {
      console.log('Cargando datos para revisión IA:', postulacionId);
      
      // Obtener la postulación original
      const postulacionOriginal = getMockData.getPostulacionById(postulacionId);
      if (!postulacionOriginal) {
        console.error('Postulación no encontrada:', postulacionId);
        toast.error('Postulación no encontrada');
        setLoading(false);
        return;
      }

      // Obtener la startup
      const startupData = getMockData.getStartupById(postulacionOriginal.startupId);
      if (!startupData) {
        console.error('Startup no encontrada:', postulacionOriginal.startupId);
        toast.error('Startup no encontrada');
        setLoading(false);
        return;
      }

      // Convertir a formato de 16 respuestas
      const formResponse = getFormResponseById(postulacionId);
      if (!formResponse) {
        console.error('No se pudo convertir la postulación');
        toast.error('Error al cargar las respuestas');
        setLoading(false);
        return;
      }

      setPostulacion(postulacionOriginal);
      setStartup(startupData);

      // Verificar si ya existe una evaluación guardada
      console.log('Verificando si existe evaluación guardada...');
      
      try {
        const existingEvaluation = await EvaluationStorageManager.getEvaluationForUI(postulacionId);
        
        if (existingEvaluation && 
            existingEvaluation.puntajes && 
            Array.isArray(existingEvaluation.puntajes) &&
            existingEvaluation.puntajes.length > 0) {
          
          console.log('Evaluación existente válida encontrada:', existingEvaluation);
          
          // Validar que todos los campos necesarios existan
          const isValidEvaluation = existingEvaluation.id &&
            existingEvaluation.startupId &&
            existingEvaluation.startupName &&
            typeof existingEvaluation.puntajeTotal === 'number' &&
            existingEvaluation.observaciones &&
            existingEvaluation.recomendaciones &&
            existingEvaluation.fortalezas &&
            existingEvaluation.debilidades;
          
          if (isValidEvaluation && existingEvaluation.puntajeTotal > 0) {
            // Convertir la evaluación guardada al formato de la interfaz
            const evaluationResult: EvaluationResult = {
              id: existingEvaluation.id,
              startupId: existingEvaluation.startupId,
              startupName: existingEvaluation.startupName,
              scores: existingEvaluation.puntajes.map(puntaje => ({
                criterioId: puntaje.criterioId,
                criterioName: getCriterioName(puntaje.criterioId),
                score: puntaje.puntaje * 25, // Convertir de 1-4 a 0-100
                razones: puntaje.razones || '',
                mejoras: puntaje.mejoras || ''
              })),
              totalScore: existingEvaluation.puntajeTotal * 25, // Convertir de 1-4 a 0-100
              observations: existingEvaluation.observaciones || [],
              recommendations: existingEvaluation.recomendaciones || [],
              strengths: existingEvaluation.fortalezas || [],
              weaknesses: existingEvaluation.debilidades || [],
              status: existingEvaluation.status || 'evaluacion_ia',
              createdAt: existingEvaluation.createdAt || new Date().toISOString()
            };
            
            console.log('Evaluación válida cargada desde storage:', evaluationResult);
            setEvaluationResult(evaluationResult);
            toast.success('Evaluación IA cargada desde el almacenamiento');
          } else {
            console.warn('Evaluación existente pero inválida o con puntaje 0:', existingEvaluation);
            // Limpiar evaluación inválida
            try {
              await EvaluationStorageManager.deleteEvaluation(postulacionId);
              console.log('Evaluación inválida eliminada');
            } catch (deleteError) {
              console.error('Error eliminando evaluación inválida:', deleteError);
            }
          }
        } else {
          console.log('No se encontró evaluación guardada válida');
        }
      } catch (storageError) {
        console.error('Error accediendo al storage de evaluaciones:', storageError);
        // Continuar sin evaluación existente
      }

      setLoading(false);
      
      // Si no hay evaluación válida, ejecutar automáticamente
      if (!evaluationResult) {
        console.log('No hay evaluación válida, ejecutando evaluación automática...');
        await startEvaluation();
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar los datos');
      setLoading(false);
    }
  };

  const startEvaluation = async () => {
    if (!postulacion) return;
    
    setEvaluating(true);
    setEvaluationProgress({
      currentStep: 0,
      totalSteps: 4,
      currentStepName: 'Iniciando evaluación IA...',
      progress: 0
    });

    try {
      console.log('Iniciando evaluación IA...');
      
      // Actualizar progreso
      setEvaluationProgress({
        currentStep: 1,
        totalSteps: 4,
        currentStepName: 'Obteniendo respuestas...',
        progress: 25
      });
      
      // Obtener las respuestas convertidas
      console.log('Obteniendo respuestas para evaluación...');
      const formResponse = getFormResponseById(postulacion.id);
      
      if (!formResponse) {
        throw new Error('No se pudieron obtener las respuestas');
      }

      // Ejecutar evaluación real usando la API del servidor
      console.log('Ejecutando evaluación IA con API del servidor...');
      const response = await fetch('/api/startup/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startupId: postulacion.id,
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
      const resultado = data.evaluation; // Aquí se define resultado

      if (resultado) {
        console.log('Evaluación IA completada:', resultado);
        console.log('Resultado scores:', resultado.scores);
        console.log('Resultado totalScore:', resultado.totalScore);
        console.log('Resultado observations:', resultado.observations);
        console.log('Resultado recommendations:', resultado.recommendations);
        console.log('Resultado strengths:', resultado.strengths);
        console.log('Resultado weaknesses:', resultado.weaknesses);
        
        console.log('Creando evaluationResult...');
        const evaluationResult: EvaluationResult = {
          id: postulacion.id,
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
        console.log('evaluationResult creado:', evaluationResult);
        
        setEvaluationResult(evaluationResult);
        
        // Guardar en storage
        try {
          const evaluationId = await EvaluationStorageManager.saveEvaluation(evaluationResult, postulacion.id);
          console.log('Evaluación guardada exitosamente con ID:', evaluationId);
        } catch (error) {
          console.error('Error guardando evaluación:', error);
          // Continuar sin guardar en storage - no es crítico
        }
        
        toast.success('Evaluación IA completada exitosamente');
      } else {
        throw new Error('No se pudo completar la evaluación');
      }
    } catch (error) {
      console.error('Error durante la evaluación:', error);
      toast.error('Error durante la evaluación IA');
    } finally {
      setEvaluating(false);
    }
  };

  const saveEvaluation = async () => {
    if (!evaluationResult) {
      toast.error('No hay evaluación para guardar');
      return;
    }

    setSaving(true);
    try {
      console.log('Guardando evaluación en base de datos mocks...');
      
      // Guardar usando el storage manager con el formato correcto
      const evaluationId = await EvaluationStorageManager.saveEvaluation(evaluationResult, postulacion.id);
      
      console.log('Evaluación guardada exitosamente con ID:', evaluationId);
      toast.success('Evaluación guardada exitosamente');
      
      // Actualizar el estado para mostrar que ya está guardada
      setEvaluationResult({
        ...evaluationResult,
        status: 'evaluacion_ia'
      });
      
    } catch (error) {
      console.error('Error guardando evaluación:', error);
      toast.error('Error al guardar la evaluación');
    } finally {
      setSaving(false);
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

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-blue-600";
    if (score >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 70) return { color: 'bg-green-100 text-green-800', text: 'Excelente' };
    if (score >= 50) return { color: 'bg-blue-100 text-blue-800', text: 'Bueno' };
    if (score >= 30) return { color: 'bg-yellow-100 text-yellow-800', text: 'Regular' };
    return { color: 'bg-red-100 text-red-800', text: 'Necesita Mejora' };
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando datos para evaluación...</p>
          </div>
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
              Revisión por IA
            </h1>
            <p className="text-gray-600">
              {startup?.nombre} - Evaluación Automática
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Brain className="w-3 h-3" />
            <span>IA Evaluation</span>
          </Badge>
        </div>
      </div>

      {/* Información de la Startup */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Startup a Evaluar</span>
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

      {/* Estado de Evaluación */}
      {!evaluationResult && !evaluating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Iniciar Evaluación IA</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="mb-4">
                <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Evaluación Automática</h3>
                <p className="text-gray-600 mb-6">
                  El sistema de IA analizará las 16 respuestas de la startup y generará una evaluación completa
                  basada en los criterios establecidos.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="font-medium">Complejidad</p>
                  <p className="text-sm text-gray-600">Problema</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">Mercado</p>
                  <p className="text-sm text-gray-600">Tamaño</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">Escalabilidad</p>
                  <p className="text-sm text-gray-600">Potencial</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium">Equipo</p>
                  <p className="text-sm text-gray-600">Emprendedor</p>
                </div>
              </div>
              
              <Button
                onClick={startEvaluation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar Evaluación IA
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progreso de Evaluación */}
      {evaluating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Evaluación en Progreso</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {evaluationProgress.currentStepName}
                </span>
                <span className="text-sm text-gray-500">
                  {evaluationProgress.currentStep} de {evaluationProgress.totalSteps}
                </span>
              </div>
              
              <Progress value={evaluationProgress.progress} className="w-full" />
              
              <div className="flex items-center justify-center py-4">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Procesando con IA...</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados de Evaluación */}
      {evaluationResult && (
        <div className="space-y-6">
          {/* Resumen de Resultados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Resultados de la Evaluación</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-3xl font-bold ${getScoreColor(evaluationResult.totalScore)}`}>
                    {evaluationResult.totalScore.toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-600">Puntuación Total</p>
                  <Badge className={`mt-2 ${getScoreBadge(evaluationResult.totalScore).color}`}>
                    {getScoreBadge(evaluationResult.totalScore).text}
                  </Badge>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {evaluationResult.scores.length}
                  </div>
                  <p className="text-sm text-gray-600">Criterios Evaluados</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {evaluationResult.strengths.length}
                  </div>
                  <p className="text-sm text-gray-600">Fortalezas Identificadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Puntuaciones por Criterio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Puntuaciones por Criterio</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evaluationResult.scores.map((score, index) => (
                  <div key={score.criterioId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{score.criterioName}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${getScoreColor(score.score)}`}>
                          {score.score.toFixed(1)}
                        </span>
                        <Badge className={getScoreBadge(score.score).color}>
                          {getScoreBadge(score.score).text}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Razones:</p>
                        <p className="text-sm text-gray-600">{score.razones}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Mejoras sugeridas:</p>
                        <p className="text-sm text-gray-600">{score.mejoras}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fortalezas y Debilidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span>Fortalezas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {evaluationResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Áreas de Mejora</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {evaluationResult.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Observaciones y Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Observaciones y Recomendaciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Observaciones Generales:</h4>
                  <ul className="space-y-1">
                    {evaluationResult.observations.map((observation, index) => (
                      <li key={index} className="text-sm text-gray-700">• {observation}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recomendaciones:</h4>
                  <ul className="space-y-1">
                    {evaluationResult.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-sm text-gray-700">• {recommendation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Botones de Acción */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Volver a Respuestas
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/evaluaciones/${params.id}/respuestas`)}
          >
            Ver Respuestas
          </Button>
                      {evaluationResult && (
              <Button
                onClick={saveEvaluation}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Guardando...' : 'Guardar Evaluación'}
              </Button>
            )}
        </div>
      </div>
    </div>
  );
} 