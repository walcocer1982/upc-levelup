"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle, AlertCircle, CheckCircle2, Target } from "lucide-react";

interface Startup {
  id: string;
  nombre: string;
  categoria: string;
}

interface ImpactResponse {
  id: string;
  startupId: string;
  criterio: string;
  pregunta: number;
  respuesta: string;
  createdAt: string;
  updatedAt: string;
}

const CRITERIOS = [
  {
    id: "complejidad",
    nombre: "Complejidad",
    descripcion: "Nivel de complejidad de la situación que resuelven",
    color: "bg-blue-100 text-blue-800",
    preguntas: [
      {
        id: 1,
        titulo: "Cuéntanos sobre un caso real y reciente",
        descripcion: "Describe un ejemplo concreto de una persona o empresa que haya enfrentado el problema que ustedes resuelven. ¿Qué pasó exactamente y cómo lo vivieron?"
      },
      {
        id: 2,
        titulo: "¿Cómo abordaban el problema antes de su solución?",
        descripcion: "Antes de conocer tu propuesta, ¿qué métodos o herramientas utilizaban para manejar esta situación? ¿Cuáles eran sus principales limitaciones o ineficiencias?"
      },
      {
        id: 3,
        titulo: "¿Qué consecuencias tenía no resolver bien este problema?",
        descripcion: "¿Qué impacto negativo (pérdidas de tiempo, dinero, oportunidades, etc.) experimentaban al no tener una solución efectiva para esta situación? Si es posible, cuantifica estas consecuencias."
      },
      {
        id: 4,
        titulo: "¿Han identificado a otros afectados?",
        descripcion: "¿Cuántas personas o empresas conoces que hayan enfrentado situaciones similares? ¿Cómo validaron esta información?"
      }
    ]
  },
  {
    id: "mercado",
    nombre: "Mercado",
    descripcion: "Tamaño de mercado",
    color: "bg-green-100 text-green-800",
    preguntas: [
      {
        id: 5,
        titulo: "Estima el tamaño de tu mercado",
        descripcion: "¿Cuántas personas o empresas crees que enfrentan este problema hoy? ¿Cómo llegaron a esa estimación? (Indica tus fuentes o metodología de cálculo)."
      },
      {
        id: 6,
        titulo: "Validación con potenciales clientes",
        descripcion: "¿Con cuántos potenciales clientes han conversado ya sobre este problema y su posible solución?"
      },
      {
        id: 7,
        titulo: "Interés en pagar por la solución",
        descripcion: "De esas conversaciones, ¿cuántos expresaron claramente su disposición a pagar por una solución que resuelva este problema?"
      },
      {
        id: 8,
        titulo: "Segmento de mayor interés",
        descripcion: "Hasta ahora, ¿qué tipo de clientes (segmento) ha mostrado mayor interés en tu propuesta? Describe sus características principales."
      }
    ]
  },
  {
    id: "escalabilidad",
    nombre: "Escalabilidad",
    descripcion: "Potencial de escalar",
    color: "bg-purple-100 text-purple-800",
    preguntas: [
      {
        id: 9,
        titulo: "Estrategia de adquisición de primeros clientes",
        descripcion: "¿Cómo planean conseguir o cómo consiguieron a sus primeros clientes? Describe el proceso."
      },
      {
        id: 10,
        titulo: "Costo de adquisición de clientes (CAC)",
        descripcion: "¿Tienen una estimación de cuánto les costará adquirir a un cliente, tanto en dinero como en tiempo? Si ya tienen clientes, ¿cuál ha sido el costo real?"
      },
      {
        id: 11,
        titulo: "Facilidad de expansión",
        descripcion: "¿Qué tan viable es multiplicar tu base de clientes sin que los costos operativos y de adquisición crezcan al mismo ritmo? ¿Qué elementos de tu modelo de negocio lo permiten?"
      },
      {
        id: 12,
        titulo: "Estrategias de escalabilidad probadas",
        descripcion: "¿Han experimentado ya con alguna estrategia para escalar su operación o adquisición de clientes? ¿Qué resultados obtuvieron y qué aprendizajes clave les dejó?"
      }
    ]
  },
  {
    id: "equipo",
    nombre: "Equipo",
    descripcion: "Equipo emprendedor",
    color: "bg-orange-100 text-orange-800",
    preguntas: [
      {
        id: 13,
        titulo: "Trayectoria del equipo en el proyecto",
        descripcion: "¿Cuánto tiempo llevan trabajando juntos en este proyecto? ¿Es a tiempo completo o parcial?"
      },
      {
        id: 14,
        titulo: "Experiencia relevante del equipo",
        descripcion: "¿Qué experiencia o conocimiento tienen en el sector o la industria en la que se enfoca su startup?"
      },
      {
        id: 15,
        titulo: "Roles y responsabilidades clave",
        descripcion: "¿Cómo distribuyen las responsabilidades y tareas dentro del equipo para el desarrollo y crecimiento del proyecto?"
      },
      {
        id: 16,
        titulo: "Superación de desafíos",
        descripcion: "Cuéntanos una situación difícil o un obstáculo importante que hayan superado juntos como equipo. ¿Qué aprendieron de esa experiencia?"
      }
    ]
  }
];

export default function StartupImpactPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const startupId = params.id as string;
  
  const [startup, setStartup] = useState<Startup | null>(null);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [activeTab, setActiveTab] = useState("complejidad");

  useEffect(() => {
    const loadStartupAndResponses = async () => {
      if (!session?.user?.email || !startupId) return;

      try {
        setLoading(true);
        
        // Cargar datos de la startup
        const startupResponse = await fetch(`/api/startups/${startupId}/profile`);
        if (startupResponse.ok) {
          const startupData = await startupResponse.json();
          setStartup(startupData.startup);
        }

        // Cargar respuestas existentes
        const responsesResponse = await fetch(`/api/startups/${startupId}/impact`);
        if (responsesResponse.ok) {
          const responsesData = await responsesResponse.json();
          const responsesMap: { [key: string]: string } = {};
          responsesData.responses.forEach((response: ImpactResponse) => {
            responsesMap[`${response.criterio}_${response.pregunta}`] = response.respuesta;
          });
          setResponses(responsesMap);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadStartupAndResponses();
  }, [session, startupId]);

  const handleResponseChange = (criterio: string, pregunta: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [`${criterio}_${pregunta}`]: value
    }));
  };

  const saveResponses = async (criterio?: string) => {
    if (!session?.user?.email || !startupId) return;

    try {
      setSaving(true);
      
      const responsesToSave = criterio 
        ? Object.entries(responses).filter(([key]) => key.startsWith(criterio))
        : Object.entries(responses);

      const saveData = responsesToSave.map(([key, respuesta]) => {
        const [criterioKey, preguntaStr] = key.split('_');
        return {
          startupId,
          criterio: criterioKey,
          pregunta: parseInt(preguntaStr),
          respuesta
        };
      });

      const response = await fetch(`/api/startups/${startupId}/impact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses: saveData }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Respuestas guardadas exitosamente:', result);
        
        // Mostrar confirmación más visible
        if (criterio) {
          toast.success(`✅ Respuestas de ${criterio} guardadas exitosamente`);
        } else {
          toast.success('✅ ¡Todas las respuestas han sido guardadas exitosamente!');
          setSavedSuccessfully(true);
          
          // Mostrar confirmación adicional después de 1 segundo
          setTimeout(() => {
            toast.success('🎉 Tu startup está lista para postular a convocatorias');
          }, 1000);
          
          // NO ocultar automáticamente - el usuario debe decidir cuándo navegar
        }
      } else {
        const errorData = await response.json();
        console.error('❌ Error al guardar:', errorData);
        toast.error(errorData.error || 'Error al guardar las respuestas');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión al guardar las respuestas');
    } finally {
      setSaving(false);
    }
  };

  const getCriterioProgress = (criterio: string) => {
    const criterioResponses = Object.entries(responses).filter(([key]) => key.startsWith(criterio));
    const answered = criterioResponses.filter(([, value]) => value.trim().length > 0).length;
    return { answered, total: 4, percentage: (answered / 4) * 100 };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Cargando formulario...</span>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Startup no encontrada</h3>
            <p className="text-muted-foreground mb-4">
              La startup que buscas no existe o no tienes permisos para acceder.
            </p>
            <Link href="/user/startups">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Startups
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Banner de Confirmación */}
      {savedSuccessfully && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-800">¡Formulario de impacto completado!</h3>
                <p className="text-sm text-green-700">
                  Todas las respuestas han sido guardadas exitosamente. Tu startup está lista para postular a convocatorias.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSavedSuccessfully(false)}
              className="text-green-600 hover:text-green-800"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <Link href={`/user/startups/${startupId}`}>
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a {startup.nombre}
          </Button>
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Impacto de tu Startup</h1>
            <p className="text-muted-foreground">
              {startup.nombre} - {startup.categoria}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Comparte información detallada sobre el problema que resuelves y tu potencial de crecimiento
            </p>
          </div>
          <Badge className="bg-primary text-primary-foreground">
            {startup.categoria}
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Progreso del Formulario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CRITERIOS.map((criterio) => {
              const progress = getCriterioProgress(criterio.id);
              return (
                <div key={criterio.id} className="text-center">
                  <div className="text-2xl font-bold text-primary">{progress.answered}/4</div>
                  <div className="text-sm text-muted-foreground">{criterio.nombre}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {CRITERIOS.map((criterio) => {
            const progress = getCriterioProgress(criterio.id);
            return (
              <TabsTrigger 
                key={criterio.id} 
                value={criterio.id}
                className="flex items-center gap-2"
              >
                {progress.answered === 4 && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                {criterio.nombre}
                {progress.answered > 0 && progress.answered < 4 && (
                  <Badge variant="secondary" className="ml-1">
                    {progress.answered}/4
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {CRITERIOS.map((criterio) => (
          <TabsContent key={criterio.id} value={criterio.id} className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={criterio.color}>
                        {criterio.nombre}
                      </Badge>
                      {getCriterioProgress(criterio.id).answered === 4 && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {criterio.descripcion}
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => saveResponses(criterio.id)}
                    disabled={saving}
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Guardando...' : 'Guardar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {criterio.preguntas.map((pregunta) => (
                    <div key={pregunta.id} className="space-y-3">
                      <div>
                        <h3 className="font-medium text-lg">
                          {pregunta.titulo}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {pregunta.descripcion}
                        </p>
                      </div>
                      <Textarea
                        placeholder="Escribe tu respuesta aquí..."
                        value={responses[`${criterio.id}_${pregunta.id}`] || ''}
                        onChange={(e) => handleResponseChange(criterio.id, pregunta.id, e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Save All Button */}
      <div className="mt-6 flex justify-center gap-4">
        <Button 
          onClick={() => saveResponses()}
          disabled={saving}
          size="lg"
          className={`px-8 ${savedSuccessfully ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Guardando todas las respuestas...
            </>
          ) : savedSuccessfully ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              ¡Guardado exitosamente!
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Guardar todas las respuestas
            </>
          )}
        </Button>
        
        {savedSuccessfully && (
          <Link href="/user/convocatorias">
            <Button variant="outline" size="lg" className="px-8">
              <Target className="w-5 h-5 mr-2" />
              Ver Convocatorias
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
} 