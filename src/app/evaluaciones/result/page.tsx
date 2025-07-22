'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { localStorageManager, evaluarStartupLocal, LocalEvaluation, FormResponses } from '@/lib/ai/types';

export default function EvaluationResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startupId = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startup, setStartup] = useState<FormResponses | null>(null);
  const [evaluation, setEvaluation] = useState<LocalEvaluation | null>(null);

  useEffect(() => {
    if (!startupId) {
      setError('No se proporcionó un ID de startup válido');
      setLoading(false);
      return;
    }

    // Cargar datos de la startup
    const startupData = localStorageManager.getResponseById(startupId);
    if (!startupData) {
      setError('No se encontró la startup con el ID proporcionado');
      setLoading(false);
      return;
    }
    
    setStartup(startupData);
    
    // Buscar si ya existe una evaluación
    const existingEvaluations = localStorageManager.getEvaluationsByStartupId(startupId);
    if (existingEvaluations.length > 0) {
      // Usar la evaluación más reciente
      setEvaluation(existingEvaluations[existingEvaluations.length - 1]);
    }
    
    setLoading(false);
  }, [startupId]);

  // Función para iniciar la evaluación
  const handleStartEvaluation = async () => {
    if (!startupId) return;
    
    setEvaluating(true);
    try {
      const result = await evaluarStartupLocal(startupId);
      if (result) {
        setEvaluation(result);
      } else {
        setError('Ocurrió un error al evaluar la startup');
      }
    } catch (error) {
      console.error('Error evaluando startup:', error);
      setError('Ocurrió un error al evaluar la startup');
    } finally {
      setEvaluating(false);
    }
  };

  // Función para obtener el color según la puntuación
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-500 text-green-800';
    if (score >= 60) return 'bg-blue-100 border-blue-500 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 border-yellow-500 text-yellow-800';
    return 'bg-red-100 border-red-500 text-red-800';
  };

  // Función para obtener el texto según la puntuación
  const getScoreText = (score: number) => {
    if (score >= 80) return 'Destacado';
    if (score >= 60) return 'Logrado';
    if (score >= 40) return 'En proceso';
    return 'Inicio';
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <p className="text-lg">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/evaluaciones/form')}>Volver al formulario</Button>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No se encontraron datos de la startup</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/evaluaciones/form')}>Volver al formulario</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Evaluación de Startup</h1>
      <h2 className="text-xl mb-8">{startup.startupName}</h2>

      {!evaluation && !evaluating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Iniciar evaluación</CardTitle>
            <CardDescription>
              La evaluación utilizará IA para analizar las respuestas proporcionadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              El proceso de evaluación puede tomar unos segundos. Durante este tiempo, 
              nuestro sistema analizará las respuestas utilizando inteligencia artificial 
              para proporcionar una evaluación detallada de tu startup.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartEvaluation}>Comenzar evaluación</Button>
          </CardFooter>
        </Card>
      )}

      {evaluating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Evaluando startup...</CardTitle>
            <CardDescription>
              Este proceso puede tomar unos segundos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {evaluation && (
        <>
          {/* Resumen de la evaluación */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Resumen de la evaluación</CardTitle>
              <CardDescription>
                Puntuación global: {evaluation.totalScore.toFixed(1)}/100
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Fortalezas</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {evaluation.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Áreas de mejora</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {evaluation.weaknesses.map((weakness, idx) => (
                      <li key={idx}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Observaciones</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {evaluation.observations.map((observation, idx) => (
                    <li key={idx}>{observation}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Recomendaciones</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {evaluation.recommendations.map((recommendation, idx) => (
                    <li key={idx}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Detalle de puntuaciones por criterio */}
          <Tabs defaultValue="complejidad_problema" className="mb-8">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="complejidad_problema">Complejidad</TabsTrigger>
              <TabsTrigger value="tamano_mercado">Mercado</TabsTrigger>
              <TabsTrigger value="escalabilidad">Escalabilidad</TabsTrigger>
              <TabsTrigger value="equipo_emprendedor">Equipo</TabsTrigger>
            </TabsList>
            
            {evaluation.scores.map((score) => (
              <TabsContent key={score.criterioId} value={score.criterioId}>
                <Card>
                  <CardHeader className={getScoreColor(score.score)}>
                    <CardTitle className="flex justify-between">
                      <span>
                        {score.criterioId === 'complejidad_problema' && 'Complejidad del problema'}
                        {score.criterioId === 'tamano_mercado' && 'Tamaño de mercado'}
                        {score.criterioId === 'escalabilidad' && 'Potencial de escalar'}
                        {score.criterioId === 'equipo_emprendedor' && 'Equipo emprendedor'}
                      </span>
                      <span>{score.score}/100 - {getScoreText(score.score)}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Análisis</h3>
                      <p>{score.razones}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Recomendaciones de mejora</h3>
                      <p>{score.mejoras}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => router.push('/evaluaciones/form')}>
              Volver al formulario
            </Button>
            <Button onClick={() => router.push('/evaluaciones')}>
              Ver todas las evaluaciones
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 