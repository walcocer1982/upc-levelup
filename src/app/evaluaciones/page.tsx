"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { localStorageManager, generarDatosEjemplo, FormResponses, LocalEvaluation } from '@/lib/ai/types';

export default function EvaluacionesPage() {
  const [responses, setResponses] = useState<FormResponses[]>([]);
  const [evaluations, setEvaluations] = useState<LocalEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del localStorage
    const loadData = () => {
      const storedResponses = localStorageManager.getResponses();
      const storedEvaluations = localStorageManager.getEvaluations();
      
      setResponses(storedResponses);
      setEvaluations(storedEvaluations);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Función para generar datos de ejemplo
  const handleGenerateExample = () => {
    const startupId = generarDatosEjemplo();
    // Recargar datos
    setResponses(localStorageManager.getResponses());
    window.location.href = `/evaluaciones/result?id=${startupId}`;
  };

  // Función para limpiar todos los datos
  const handleClearData = () => {
    if (confirm('¿Estás seguro de que deseas eliminar todos los datos? Esta acción no se puede deshacer.')) {
      localStorageManager.clearAll();
      setResponses([]);
      setEvaluations([]);
    }
  };

  // Obtener la evaluación más reciente para una startup
  const getLatestEvaluation = (startupId: string) => {
    const startupEvaluations = evaluations.filter(e => e.startupId === startupId);
    if (startupEvaluations.length === 0) return null;
    
    // Ordenar por fecha de creación (más reciente primero)
    return startupEvaluations.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  };

  // Función para obtener el color según la puntuación
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <p className="text-lg">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Evaluaciones de Startups</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleGenerateExample}>
            Generar ejemplo
          </Button>
          <Button variant="destructive" onClick={handleClearData}>
            Limpiar datos
          </Button>
          <Link href="/evaluaciones/form">
            <Button>Nueva evaluación</Button>
          </Link>
        </div>
      </div>

      {responses.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No hay evaluaciones</CardTitle>
            <CardDescription>
              No se han encontrado startups evaluadas en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Para comenzar, puedes crear una nueva evaluación o generar un ejemplo 
              para ver cómo funciona el sistema.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleGenerateExample}>
              Generar ejemplo
            </Button>
            <Link href="/evaluaciones/form">
              <Button>Nueva evaluación</Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {responses.map((startup) => {
            const evaluation = getLatestEvaluation(startup.id);
            
            return (
              <Card key={startup.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{startup.startupName}</CardTitle>
                  <CardDescription>
                    Creado el {new Date(startup.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {evaluation ? (
                    <div>
                      <p className="mb-2">
                        <span className="font-semibold">Puntuación global: </span>
                        <span className={getScoreColor(evaluation.totalScore)}>
                          {evaluation.totalScore.toFixed(1)}/100
                        </span>
                      </p>
                      <p className="mb-4">
                        <span className="font-semibold">Evaluado el: </span>
                        {new Date(evaluation.createdAt).toLocaleDateString()}
                      </p>
                      <div className="space-y-2">
                        <p className="font-semibold">Fortalezas principales:</p>
                        <ul className="list-disc pl-5">
                          {evaluation.strengths.slice(0, 2).map((strength, idx) => (
                            <li key={idx} className="text-sm">{strength}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p>Esta startup aún no ha sido evaluada</p>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Link href={`/evaluaciones/result?id=${startup.id}`} className="w-full">
                    <Button variant="default" className="w-full">
                      {evaluation ? 'Ver evaluación' : 'Evaluar startup'}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 