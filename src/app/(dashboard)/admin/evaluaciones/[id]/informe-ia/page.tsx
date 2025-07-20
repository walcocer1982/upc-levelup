"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  Award
} from "lucide-react";
import { getMockData } from "@/data/mock";
import { evaluarStartupLocal } from "@/lib/ai/local-evaluator";
import { IStartup } from "@/models/interfaces";

export default function InformeIAPage() {
  const params = useParams();
  const router = useRouter();
  const [startup, setStartup] = useState<IStartup | null>(null);
  const [impactData, setImpactData] = useState<any>(null);
  const [evaluacionIA, setEvaluacionIA] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [evaluando, setEvaluando] = useState(false);

  useEffect(() => {
    if (params.id) {
      const startupId = params.id as string;
      
      // Obtener datos mock
      const startupData = getMockData.getAllStartups().find(s => s.id === startupId);
      
      // Buscar el fundador de la startup
      const fundador = startupData 
        ? getMockData.getMembersByStartup(startupId).find(member => member.rol === 'CEO/Fundador')
        : null;
      
      // Buscar datos de impacto de la startup
      const impactData = getMockData.getImpactByStartup(startupId);
      
      // Enriquecer los datos de la startup con el fundador
      const startupEnriquecida = startupData ? {
        ...startupData,
        fundador: fundador ? `${fundador.nombres} ${fundador.apellidos}` : 'No especificado'
      } : null;
      
      setStartup(startupEnriquecida);
      setImpactData(impactData || null);
      setLoading(false);
    }
  }, [params.id]);

  const handleEvaluarIA = async () => {
    if (!startup || !impactData) return;
    
    setEvaluando(true);
    try {
      // Preparar datos para la evaluación IA
      const datosEvaluacion = {
        startupName: startup.nombre,
        complejidad: {
          casoReal: impactData.casoReal,
          abordajePrevio: impactData.abordajeProblema,
          consecuencias: impactData.consecuencias,
          identificacionAfectados: impactData.afectados
        },
        mercado: {
          tamanoMercado: impactData.tamanoMercado,
          validacionClientes: impactData.potencialesClientes,
          interesPago: impactData.interesPagar,
          segmentoInteres: impactData.segmentoInteres
        },
        escalabilidad: {
          estrategiaAdquisicion: impactData.estrategiaAdquisicion,
          costoAdquisicion: impactData.costoAdquisicion,
          facilidadExpansion: impactData.facilidadExpansion,
          estrategiasProbadas: impactData.escalabilidad
        },
        equipo: {
          trayectoriaEquipo: impactData.trayectoria,
          experienciaRelevante: impactData.experiencia,
          rolesResponsabilidades: impactData.roles,
          superacionDesafios: impactData.desafios
        }
      };

      // Guardar datos temporalmente para la evaluación
      localStorage.setItem('temp_evaluation_data', JSON.stringify(datosEvaluacion));
      
      // Ejecutar evaluación IA
      const resultado = await evaluarStartupLocal(startup.id);
      setEvaluacionIA(resultado);
      
    } catch (error) {
      console.error('Error en evaluación IA:', error);
      alert('Error al evaluar con IA. Intenta nuevamente.');
    } finally {
      setEvaluando(false);
    }
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!startup || !impactData) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">No se encontró la startup</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Informe de Evaluación IA</h1>
            <p className="text-gray-600">Análisis automatizado de la startup</p>
          </div>
        </div>
        
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
              <span className="font-medium">Fundador:</span>
              <p className="text-gray-700">{startup.fundador}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados de la Evaluación IA */}
      {evaluacionIA ? (
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
                  {Math.round(evaluacionIA.totalScore)}/100
                </div>
                <Badge className={`text-lg px-4 py-2 ${obtenerColorScore(evaluacionIA.totalScore)}`}>
                  {evaluacionIA.totalScore >= 80 ? 'Excelente' : 
                   evaluacionIA.totalScore >= 60 ? 'Bueno' : 
                   evaluacionIA.totalScore >= 40 ? 'Regular' : 'Necesita Mejora'}
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
                {evaluacionIA.scores.map((score: any, index: number) => (
                  <div key={score.criterioId} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-50">
                        {obtenerIconoCriterio(score.criterioId)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {score.criterioId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                      </div>
                      <Badge className={obtenerColorScore(score.score)}>
                        {score.score}/100
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600">Razones:</h4>
                        <p className="text-sm text-gray-700">{score.razones}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-600">Mejoras:</h4>
                        <p className="text-sm text-gray-700">{score.mejoras}</p>
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
                <ul className="space-y-2">
                  {evaluacionIA.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
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
                <ul className="space-y-2">
                  {evaluacionIA.weaknesses.map((weakness: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
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
              <ul className="space-y-2">
                {evaluacionIA.observations.map((observation: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{observation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {evaluacionIA.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
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