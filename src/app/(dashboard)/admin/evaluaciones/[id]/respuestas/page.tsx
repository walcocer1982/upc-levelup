"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  FileText,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Award,
  Eye,
  AlertTriangle,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { getMockData } from "@/data/mock";
import { getFormResponseById } from "@/lib/ai/mock-adapter";
import { toast } from "sonner";

// Estructura de las 16 respuestas organizadas por categoría
interface RespuestaCategoria {
  id: string;
  titulo: string;
  icono: React.ReactNode;
  color: string;
  preguntas: {
    id: string;
    pregunta: string;
    respuesta: string;
    criterioId: string;
  }[];
}

export default function RespuestasPage() {
  const params = useParams();
  const router = useRouter();
  const [postulacion, setPostulacion] = useState<any>(null);
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState<string[]>([]);

  useEffect(() => {
    if (params.id) {
      const postulacionId = params.id as string;
      loadData(postulacionId);
    }
  }, [params.id]);

  const loadData = async (postulacionId: string) => {
    try {
      console.log('Cargando respuestas para postulación:', postulacionId);
      
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
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar los datos');
      setLoading(false);
    }
  };

  const toggleCategoria = (categoriaId: string) => {
    setCategoriasAbiertas(prev => 
      prev.includes(categoriaId) 
        ? prev.filter(id => id !== categoriaId)
        : [...prev, categoriaId]
    );
  };

  const getCategorias = (): RespuestaCategoria[] => {
    if (!postulacion) return [];

    return [
      {
        id: 'complejidad',
        titulo: 'Complejidad del Problema',
        icono: <Target className="w-5 h-5" />,
        color: 'bg-orange-100 text-orange-700 border-orange-200', // Cambiado de rojo a naranja
        preguntas: [
          {
            id: 'caso-real',
            pregunta: 'Describe un caso real del problema que resuelves',
            respuesta: postulacion.respuestas.find((r: any) => r.criterioId === 'criterio-013')?.valor || 'No especificado',
            criterioId: 'criterio-013'
          },
          {
            id: 'abordaje',
            pregunta: '¿Cómo abordas este problema?',
            respuesta: postulacion.respuestas.find((r: any) => r.criterioId === 'criterio-014')?.valor || 'No especificado',
            criterioId: 'criterio-014'
          },
          {
            id: 'consecuencias',
            pregunta: '¿Cuáles son las consecuencias de no resolver este problema?',
            respuesta: 'Pérdidas económicas y clientes insatisfechos',
            criterioId: 'criterio-001'
          },
          {
            id: 'afectados',
            pregunta: '¿Quiénes son los principales afectados?',
            respuesta: 'Múltiples empresas en el sector',
            criterioId: 'criterio-002'
          }
        ]
      },
      {
        id: 'mercado',
        titulo: 'Tamaño de Mercado',
        icono: <TrendingUp className="w-5 h-5" />,
        color: 'bg-blue-100 text-blue-700 border-blue-200', // Mantiene azul
        preguntas: [
          {
            id: 'tamano',
            pregunta: '¿Cuál es el tamaño de tu mercado?',
            respuesta: postulacion.respuestas.find((r: any) => r.criterioId === 'criterio-015')?.valor || 'No especificado',
            criterioId: 'criterio-015'
          },
          {
            id: 'validacion',
            pregunta: '¿Cómo validaste con clientes potenciales?',
            respuesta: 'Entrevistas con clientes potenciales realizadas',
            criterioId: 'criterio-024'
          },
          {
            id: 'interes',
            pregunta: '¿Hay interés en pagar por tu solución?',
            respuesta: postulacion.respuestas.find((r: any) => r.criterioId === 'criterio-022')?.valor || 'No especificado',
            criterioId: 'criterio-022'
          },
          {
            id: 'segmento',
            pregunta: '¿Cuál es tu segmento de interés?',
            respuesta: postulacion.respuestas.find((r: any) => r.criterioId === 'criterio-023')?.valor || 'No especificado',
            criterioId: 'criterio-023'
          }
        ]
      },
      {
        id: 'escalabilidad',
        titulo: 'Escalabilidad',
        icono: <Zap className="w-5 h-5" />,
        color: 'bg-green-100 text-green-700 border-green-200', // Mantiene verde
        preguntas: [
          {
            id: 'estrategia',
            pregunta: '¿Cuál es tu estrategia de adquisición de clientes?',
            respuesta: postulacion.respuestas.find((r: any) => r.criterioId === 'criterio-019')?.valor || 'No especificado',
            criterioId: 'criterio-019'
          },
          {
            id: 'costo',
            pregunta: '¿Cuál es el costo de adquisición de clientes?',
            respuesta: postulacion.respuestas.find((r: any) => r.criterioId === 'criterio-025')?.valor || 'No especificado',
            criterioId: 'criterio-025'
          },
          {
            id: 'expansion',
            pregunta: '¿Qué tan fácil es expandir tu solución?',
            respuesta: postulacion.respuestas.find((r: any) => r.criterioId === 'criterio-021')?.valor || 'No especificado',
            criterioId: 'criterio-021'
          },
          {
            id: 'probadas',
            pregunta: '¿Qué estrategias has probado?',
            respuesta: postulacion.respuestas.find((r: any) => r.criterioId === 'criterio-020')?.valor || 'No especificado',
            criterioId: 'criterio-020'
          }
        ]
      },
      {
        id: 'equipo',
        titulo: 'Equipo Emprendedor',
        icono: <Users className="w-5 h-5" />,
        color: 'bg-purple-100 text-purple-700 border-purple-200', // Mantiene morado
        preguntas: [
          {
            id: 'trayectoria',
            pregunta: '¿Cuál es la trayectoria del equipo?',
            respuesta: postulacion.respuestas.find((r: any) => r.criterioId === 'criterio-016')?.valor || 'No especificado',
            criterioId: 'criterio-016'
          },
          {
            id: 'roles',
            pregunta: '¿Cómo están definidos los roles y responsabilidades?',
            respuesta: postulacion.respuestas.find((r: any) => r.criterioId === 'criterio-017')?.valor || 'No especificado',
            criterioId: 'criterio-017'
          },
          {
            id: 'desafios',
            pregunta: '¿Cómo han superado desafíos anteriores?',
            respuesta: postulacion.respuestas.find((r: any) => r.criterioId === 'criterio-018')?.valor || 'No especificado',
            criterioId: 'criterio-018'
          },
          {
            id: 'experiencia',
            pregunta: '¿Qué experiencia relevante tiene el equipo?',
            respuesta: 'Equipo con experiencia en el sector',
            criterioId: 'criterio-004'
          }
        ]
      }
    ];
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando respuestas...</p>
          </div>
        </div>
      </div>
    );
  }

  const categorias = getCategorias();

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
              Respuestas de Postulación
            </h1>
            <p className="text-gray-600">
              {startup?.nombre} - {postulacion?.id}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{postulacion?.estado}</span>
          </Badge>
          <Button
            onClick={() => router.push(`/admin/evaluaciones/${params.id}/revision-ia`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continuar a Revisión IA
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Acordeón de Respuestas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Respuestas Organizadas por Categoría
        </h2>
        
        {categorias.map((categoria) => (
          <Card key={categoria.id} className="overflow-hidden">
            <CardHeader 
              className={`cursor-pointer hover:bg-gray-50 transition-colors ${categoria.color}`}
              onClick={() => toggleCategoria(categoria.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {categoria.icono}
                  <CardTitle className="text-lg">{categoria.titulo}</CardTitle>
                  <Badge variant="secondary">
                    {categoria.preguntas.length} respuestas
                  </Badge>
                </div>
                {categoriasAbiertas.includes(categoria.id) ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </div>
            </CardHeader>
            
            {categoriasAbiertas.includes(categoria.id) && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {categoria.preguntas.map((pregunta, index) => (
                    <div key={pregunta.id} className="border-l-4 border-gray-200 pl-4">
                      <div className="mb-2">
                        <h4 className="font-medium text-gray-900">
                          {index + 1}. {pregunta.pregunta}
                        </h4>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {pregunta.respuesta}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Volver a Evaluaciones
        </Button>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => router.push(`/admin/evaluaciones/${params.id}/revision-ia`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Iniciar Revisión IA
          </Button>
        </div>
      </div>
    </div>
  );
} 