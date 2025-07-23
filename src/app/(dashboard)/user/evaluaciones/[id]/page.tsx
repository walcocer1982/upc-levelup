"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Star, CheckCircle, AlertCircle } from "lucide-react";

interface CriterioEvaluacion {
  id: string;
  categoria: string;
  puntajeOriginal: number;
  puntajeNormalizado: number;
  justificacion: string;
  recomendaciones: string;
  confianza: number;
}

interface Evaluacion {
  id: string;
  estado: string;
  modelVersion: string;
  confianza: number;
  puntajeTotal: number;
  analisis: {
    resumen: string;
    fortalezas: string[];
    debilidades: string[];
    recomendaciones: string[];
  };
  metadata: {
    criteriosEvaluados: number;
    tiempoEvaluacion: string;
    version: string;
  };
  criteriosEvaluados: CriterioEvaluacion[];
  postulacion: {
    startup: {
      nombre: string;
      categoria: string;
    };
    convocatoria: {
      tipo: string;
    };
  };
}

export default function UserEvaluationPage() {
  const { data: session } = useSession();
  const params = useParams();
  const evaluationId = params.id as string;
  
  const [evaluacion, setEvaluacion] = useState<Evaluacion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvaluation = async () => {
      if (!session?.user?.email || !evaluationId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/evaluaciones/${evaluationId}`);
        
        if (response.ok) {
          const data = await response.json();
          setEvaluacion(data.evaluacion);
        } else {
          console.error('Error cargando evaluación:', response.status);
          toast.error('Error al cargar la evaluación');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    loadEvaluation();
  }, [session, evaluationId]);

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'en progreso':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'complejidad':
        return 'bg-blue-100 text-blue-800';
      case 'mercado':
        return 'bg-green-100 text-green-800';
      case 'escalabilidad':
        return 'bg-purple-100 text-purple-800';
      case 'equipo':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const agruparCriteriosPorCategoria = (criterios: CriterioEvaluacion[]) => {
    const grupos: { [key: string]: CriterioEvaluacion[] } = {};
    
    criterios.forEach(criterio => {
      const categoria = criterio.categoria;
      if (!grupos[categoria]) {
        grupos[categoria] = [];
      }
      grupos[categoria].push(criterio);
    });
    
    return grupos;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Cargando evaluación...</span>
      </div>
    );
  }

  if (!evaluacion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Evaluación no encontrada</h3>
            <p className="text-muted-foreground mb-4">
              La evaluación que buscas no existe o no tienes permisos para verla.
            </p>
            <Link href="/user/applications">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Aplicaciones
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const criteriosAgrupados = agruparCriteriosPorCategoria(evaluacion.criteriosEvaluados);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/user/applications">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Aplicaciones
          </Button>
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Evaluación IA</h1>
            <p className="text-muted-foreground">
              {evaluacion.postulacion.startup.nombre} - {evaluacion.postulacion.convocatoria.tipo}
            </p>
          </div>
          <Badge className={getEstadoColor(evaluacion.estado)}>
            {evaluacion.estado}
          </Badge>
        </div>
      </div>

      {/* Resumen */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumen de la Evaluación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{evaluacion.puntajeTotal}</div>
              <div className="text-sm text-muted-foreground">Puntaje Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{evaluacion.criteriosEvaluados.length}</div>
              <div className="text-sm text-muted-foreground">Criterios Evaluados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(evaluacion.confianza * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Confianza</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Análisis General</h4>
            <p className="text-muted-foreground">{evaluacion.analisis.resumen}</p>
          </div>
        </CardContent>
      </Card>

      {/* Fortalezas y Debilidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Fortalezas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluacion.analisis.fortalezas.map((fortaleza, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{fortaleza}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
              Áreas de Mejora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluacion.analisis.debilidades.map((debilidad, index) => (
                <li key={index} className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{debilidad}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Criterios Evaluados */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Criterios Evaluados</CardTitle>
          <CardDescription>
            Análisis detallado de los {evaluacion.criteriosEvaluados.length} criterios evaluados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(criteriosAgrupados).map(([categoria, criterios]) => (
              <div key={categoria} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">{categoria}</h3>
                  <Badge className={getCategoriaColor(categoria)}>
                    {criterios.length} criterios
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {criterios.map((criterio, index) => (
                    <div key={criterio.id} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Criterio {index + 1}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{criterio.puntajeOriginal}/10</span>
                          </div>
                          <Badge variant="outline">
                            {Math.round(criterio.confianza * 100)}% confianza
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <Progress value={criterio.puntajeNormalizado} className="h-2" />
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p><strong>Justificación:</strong> {criterio.justificacion}</p>
                        <p><strong>Recomendaciones:</strong> {criterio.recomendaciones}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Modelo:</strong> {evaluacion.modelVersion}
            </div>
            <div>
              <strong>Tiempo de Evaluación:</strong> {evaluacion.metadata.tiempoEvaluacion}
            </div>
            <div>
              <strong>Versión:</strong> {evaluacion.metadata.version}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 