"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  ArrowLeft, 
  Brain, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Target,
  TrendingUp,
  Users,
  FileText,
  Info,
  BarChart3
} from "lucide-react";
import { EvaluacionStatus, CategoriaEvaluacion } from "@/data/mock/types";
import { EVALUATION_CRITERIA, RUBRICA } from "@/lib/ai/criteria";
import { Startup, Postulacion, EvaluacionIA, CriterioEvaluado } from "@/data/mock/types";

export default function RevisionIAPage() {
  const router = useRouter();
  const params = useParams();
  const [postulacionId, setPostulacionId] = useState<string>("");

  const [startup, setStartup] = useState<Startup | null>(null);
  const [postulacion, setPostulacion] = useState<Postulacion | null>(null);
  const [evaluacion, setEvaluacion] = useState<EvaluacionIA | null>(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [comentarios, setComentarios] = useState("");
  const [decisionFinal, setDecisionFinal] = useState<'APROBADA' | 'RECHAZADA' | 'REQUIERE_REVISION'>('APROBADA');
  const [mostrarRubrica, setMostrarRubrica] = useState(false);

  // Extraer el ID de los params de forma segura
  useEffect(() => {
    if (params && typeof params === 'object' && 'id' in params) {
      setPostulacionId(params.id as string);
    }
  }, [params]);

  // Cargar datos
  useEffect(() => {
    const cargarDatos = async () => {
      if (!postulacionId) return;
      
      try {
        setLoading(true);
        
        // Obtener datos de la postulación y evaluación desde la API
        const response = await fetch(`/api/respuestas/${postulacionId}`);
        const data = await response.json();
        
        if (!data.success) {
          throw new Error('Error al cargar los datos');
        }

        // Verificar que existe evaluación
        if (!data.evaluacion) {
          console.log('❌ No se encontró evaluación, redirigiendo...');
          router.push(`/admin/evaluaciones/${postulacionId}/respuestas`);
          return;
        }

        console.log('✅ Datos cargados exitosamente:', data);
        
        setPostulacion(data.postulacion as Postulacion);
        setStartup(data.startup as Startup);
        setEvaluacion(data.evaluacion as EvaluacionIA);

      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [postulacionId, router]);

  const getCategoriaIcon = (categoria: CategoriaEvaluacion) => {
    switch (categoria) {
      case CategoriaEvaluacion.COMPLEJIDAD:
        return <Target className="w-4 h-4" />;
      case CategoriaEvaluacion.MERCADO:
        return <TrendingUp className="w-4 h-4" />;
      case CategoriaEvaluacion.ESCALABILIDAD:
        return <TrendingUp className="w-4 h-4" />;
      case CategoriaEvaluacion.EQUIPO:
        return <Users className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoriaColor = (categoria: CategoriaEvaluacion) => {
    switch (categoria) {
      case CategoriaEvaluacion.COMPLEJIDAD:
        return "bg-blue-100 text-blue-800";
      case CategoriaEvaluacion.MERCADO:
        return "bg-green-100 text-green-800";
      case CategoriaEvaluacion.ESCALABILIDAD:
        return "bg-purple-100 text-purple-800";
      case CategoriaEvaluacion.EQUIPO:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoriaNombre = (categoria: CategoriaEvaluacion) => {
    switch (categoria) {
      case CategoriaEvaluacion.COMPLEJIDAD:
        return "Complejidad del Problema";
      case CategoriaEvaluacion.MERCADO:
        return "Tamaño y Validación de Mercado";
      case CategoriaEvaluacion.ESCALABILIDAD:
        return "Potencial de Escalabilidad";
      case CategoriaEvaluacion.EQUIPO:
        return "Experiencia y Capacidad del Equipo";
      default:
        return categoria;
    }
  };

  const getNivelColor = (nivel: number) => {
    switch (nivel) {
      case 1:
        return "bg-red-100 text-red-800";
      case 2:
        return "bg-yellow-100 text-yellow-800";
      case 3:
        return "bg-blue-100 text-blue-800";
      case 4:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPuntajeColor = (puntaje: number) => {
    if (puntaje >= 80) return "text-green-600";
    if (puntaje >= 60) return "text-blue-600";
    if (puntaje >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const guardarDecision = async () => {
    try {
      setProcesando(true);
      // TODO: Implementar guardado de decisión
      console.log('Guardando decisión:', { decisionFinal, comentarios });
    } catch (error) {
      console.error('Error guardando decisión:', error);
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando evaluación...</div>
        </div>
      </div>
    );
  }

  if (!startup || !postulacion || !evaluacion) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600">No se encontraron los datos de la evaluación</p>
      </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Revisión de Evaluación IA</h1>
            <p className="text-gray-600">Supervisión y decisión final</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setMostrarRubrica(!mostrarRubrica)}
          className="flex items-center gap-2"
        >
          <Info className="w-4 h-4" />
          {mostrarRubrica ? 'Ocultar' : 'Ver'} Rúbrica
          </Button>
      </div>

      {/* Rúbrica de Criterios */}
      {mostrarRubrica && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Rúbrica de Criterios de Evaluación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {EVALUATION_CRITERIA.map((criterio) => (
                <AccordionItem key={criterio.id} value={criterio.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      {getCategoriaIcon(criterio.id as CategoriaEvaluacion)}
                      <span className="font-medium">{criterio.nombre}</span>
                      <Badge variant="outline">{criterio.peso * 100}%</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-medium mb-2">Descripción:</h4>
                        <p className="text-sm text-gray-600">{criterio.descripcion}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Niveles de Evaluación:</h4>
                        <div className="space-y-2">
                          {[1, 2, 3, 4].map((nivel) => (
                            <div key={nivel} className="flex items-start gap-3">
                              <Badge variant="outline" className={getNivelColor(nivel)}>
                                Nivel {nivel}
                              </Badge>
                              <p className="text-sm text-gray-700 flex-1">
                                {(RUBRICA[mapCriterioToRubricaKey(criterio.id)] as Record<number, string>)[nivel]}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Información de la Startup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Información de la Startup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
              <h3 className="font-semibold text-lg mb-2">{startup.nombre}</h3>
              <p className="text-gray-600 mb-4">{startup.descripcion}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Categoría:</span>
                  <Badge variant="outline">{startup.categoria}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Sector:</span>
                  <span>{startup.sector}</span>
                </div>
                              <div className="flex items-center gap-2">
                  <span className="font-medium">Fundadores:</span>
                  <span>{startup.fundadores?.join(', ')}</span>
                </div>
              </div>
              </div>
                              <div>
              <h4 className="font-medium mb-2">Estado de Evaluación</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Estado:</span>
                  <Badge variant="outline" className={
                    evaluacion.estado === EvaluacionStatus.COMPLETADA ? "bg-green-100 text-green-800" :
                    evaluacion.estado === EvaluacionStatus.EN_PROCESO ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }>
                    {evaluacion.estado}
                  </Badge>
                              </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Puntuación:</span>
                  <span className={`font-semibold text-lg ${getPuntajeColor(evaluacion.puntajeTotal)}`}>
                    {evaluacion.puntajeTotal ? `${evaluacion.puntajeTotal.toFixed(1)}/100` : 'Pendiente'}
                  </span>
                            </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Confianza IA:</span>
                  <span>{(evaluacion.confianza * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluaciones por Criterio */}
      {evaluacion.criteriosEvaluados && evaluacion.criteriosEvaluados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Evaluaciones por Criterio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
                              {evaluacion.criteriosEvaluados.map((criterio: CriterioEvaluado, index: number) => (
                <div key={criterio.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoriaIcon(criterio.categoria)}
                      <Badge variant="outline" className={getCategoriaColor(criterio.categoria)}>
                        {getCategoriaNombre(criterio.categoria)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={getNivelColor(criterio.puntajeOriginal)}>
                        Nivel {criterio.puntajeOriginal}/4
                      </Badge>
                      <span className={`font-semibold ${getPuntajeColor(criterio.puntajeNormalizado)}`}>
                        {criterio.puntajeNormalizado}/100
                      </span>
                      <span className="text-sm text-gray-500">
                        Confianza: {(criterio.confianza * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Justificación:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{criterio.justificacion}</p>
                  </div>

                  {criterio.recomendaciones && (
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Recomendaciones:</h4>
                      <p className="text-blue-700 text-sm leading-relaxed">{criterio.recomendaciones}</p>
                    </div>
                  )}

                  {index < evaluacion.criteriosEvaluados.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análisis de IA */}
      {evaluacion.analisis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Análisis de IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-green-700">Fortalezas</h4>
                <ul className="space-y-1">
                  {evaluacion.analisis.fortalezas?.map((fortaleza: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{fortaleza}</span>
                    </li>
                      ))}
                    </ul>
                </div>
              <div>
                <h4 className="font-medium mb-3 text-red-700">Debilidades</h4>
                <ul className="space-y-1">
                  {evaluacion.analisis.debilidades?.map((debilidad: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{debilidad}</span>
                    </li>
                      ))}
                    </ul>
                  </div>
                </div>
            {evaluacion.analisis.recomendaciones && (
              <div className="mt-6">
                <h4 className="font-medium mb-3 text-blue-700">Recomendaciones</h4>
                <ul className="space-y-1">
                  {evaluacion.analisis.recomendaciones.map((recomendacion: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{recomendacion}</span>
                    </li>
                  ))}
                </ul>
                  </div>
                )}
          </CardContent>
        </Card>
      )}

      {/* Decisión Final */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Decisión Final
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentarios de Supervisión
              </label>
              <Textarea
                placeholder="Agrega comentarios sobre la evaluación, ajustes realizados o justificación de la decisión..."
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Decisión Final
              </label>
              <div className="flex gap-2">
                <Button
                  variant={decisionFinal === 'APROBADA' ? 'default' : 'outline'}
                  onClick={() => setDecisionFinal('APROBADA')}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Aprobar
                </Button>
                <Button
                  variant={decisionFinal === 'RECHAZADA' ? 'default' : 'outline'}
                  onClick={() => setDecisionFinal('RECHAZADA')}
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Rechazar
                </Button>
                <Button
                  variant={decisionFinal === 'REQUIERE_REVISION' ? 'default' : 'outline'}
                  onClick={() => setDecisionFinal('REQUIERE_REVISION')}
                  className="flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Requiere Revisión
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-end pt-4">
              <Button
                onClick={guardarDecision}
                disabled={procesando}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {procesando ? 'Guardando...' : 'Guardar Decisión'}
              </Button>
            </div>
          </div>
        </CardContent>
            </Card>
    </div>
  );
}

// Helper function to map criterio ID to rubrica key
function mapCriterioToRubricaKey(criterioId: string): keyof typeof RUBRICA {
  const mapping: Record<string, keyof typeof RUBRICA> = {
    'complejidad': 'complejidad_problema',
    'mercado': 'tamano_mercado',
    'escalabilidad': 'escalabilidad',
    'equipo': 'equipo_emprendedor',
  };
  return mapping[criterioId] || 'complejidad_problema';
} 