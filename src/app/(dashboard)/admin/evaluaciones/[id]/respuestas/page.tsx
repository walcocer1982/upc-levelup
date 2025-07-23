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
  MessageSquare, 
  Send,
  FileText,
  Users,
  Target,
  TrendingUp
} from "lucide-react";
import { CategoriaEvaluacion } from "@/data/mock/types";

export default function RespuestasPage() {
  const router = useRouter();
  const params = useParams();
  const [postulacionId, setPostulacionId] = useState<string>("");

  const [startup, setStartup] = useState<any | null>(null);
  const [postulacion, setPostulacion] = useState<any | null>(null);
  const [respuestas, setRespuestas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [comentarios, setComentarios] = useState<Record<string, string>>({});
  const [evaluacionExistente, setEvaluacionExistente] = useState<any | null>(null);

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
        
        // Obtener datos desde el endpoint API
        const response = await fetch(`/api/respuestas/${postulacionId}`);
        const data = await response.json();
        
        if (data.success) {
          setPostulacion(data.postulacion);
          setStartup(data.startup);
          setRespuestas(data.respuestas);
          setEvaluacionExistente(data.evaluacion);
        } else {
          throw new Error(data.error || 'Error al cargar datos');
        }

      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [postulacionId]);

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

  const agruparRespuestasPorCategoria = () => {
    const agrupadas: Record<CategoriaEvaluacion, any[]> = {
      [CategoriaEvaluacion.COMPLEJIDAD]: [],
      [CategoriaEvaluacion.MERCADO]: [],
      [CategoriaEvaluacion.ESCALABILIDAD]: [],
      [CategoriaEvaluacion.EQUIPO]: []
    };

    respuestas.forEach(respuesta => {
      // Normalizar la categoría a mayúsculas para comparar con el enum
      const categoriaNormalizada = respuesta.categoria?.toUpperCase();
      
      // Mapear categorías de la base de datos a las del enum
      let categoriaEnum: CategoriaEvaluacion;
      switch (categoriaNormalizada) {
        case 'COMPLEJIDAD':
          categoriaEnum = CategoriaEvaluacion.COMPLEJIDAD;
          break;
        case 'MERCADO':
          categoriaEnum = CategoriaEvaluacion.MERCADO;
          break;
        case 'ESCALABILIDAD':
          categoriaEnum = CategoriaEvaluacion.ESCALABILIDAD;
          break;
        case 'EQUIPO':
          categoriaEnum = CategoriaEvaluacion.EQUIPO;
          break;
        default:
          console.warn(`Categoría no reconocida: ${respuesta.categoria}, agregando a COMPLEJIDAD`);
          categoriaEnum = CategoriaEvaluacion.COMPLEJIDAD;
      }
      
      agrupadas[categoriaEnum].push(respuesta);
    });

    return agrupadas;
  };

  const iniciarEvaluacionIA = async () => {
    try {
      setProcesando(true);
      
      // Llamar a la API route para iniciar evaluación IA
      const response = await fetch('/api/evaluaciones/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          postulacionId,
          usarIA: true 
        }),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar la evaluación');
      }

      const result = await response.json();
      console.log('📊 Resultado de evaluación:', result);
      
      if (result.success) {
        console.log('✅ Evaluación exitosa, redirigiendo a revisión IA...');
        
        // Actualizar la evaluación existente
        setEvaluacionExistente(result.evaluacion);
        
        // Mostrar mensaje de éxito y redirigir inmediatamente
        alert(`✅ Evaluación completada exitosamente!\nPuntuación: ${result.evaluacion.puntajeTotal}/100\nRedirigiendo a revisión IA...`);
        
        // Esperar un momento para que la evaluación se guarde completamente
        console.log('⏳ Esperando que la evaluación se guarde...');
        setTimeout(() => {
          console.log('🔄 Intentando redirección a:', `/admin/evaluaciones/${postulacionId}/revision-ia`);
          router.push(`/admin/evaluaciones/${postulacionId}/revision-ia`);
          
          // Verificar si la redirección funcionó después de un momento
          setTimeout(() => {
            if (window.location.pathname.includes('/respuestas')) {
              console.log('⚠️ Redirección falló, intentando con window.location...');
              window.location.href = `/admin/evaluaciones/${postulacionId}/revision-ia`;
            }
          }, 2000);
        }, 1500);
      } else {
        console.log('❌ Error en evaluación:', result.error);
        throw new Error(result.error || 'Error desconocido');
      }
      
    } catch (error) {
      console.error('Error iniciando evaluación:', error);
      alert('Error al iniciar la evaluación de IA');
    } finally {
      setProcesando(false);
    }
  };

  const crearEvaluacionManual = async () => {
    try {
      setProcesando(true);
      
      // Llamar a la API route para crear evaluación manual
      const response = await fetch('/api/evaluaciones/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          postulacionId,
          usarIA: false 
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la evaluación manual');
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Evaluación manual creada exitosamente');
        alert('Evaluación manual creada. Puedes proceder a evaluar manualmente.');
        // Recargar la página para mostrar la nueva evaluación
        window.location.reload();
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
      
    } catch (error) {
      console.error('❌ Error creando evaluación manual:', error);
      alert('Error al crear la evaluación manual: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setProcesando(false);
    }
  };

  const irARevisionIA = () => {
    router.push(`/admin/evaluaciones/${postulacionId}/revision-ia`);
  };

  const solicitarAclaracion = async (respuestaId: string) => {
    const comentario = comentarios[respuestaId];
    if (!comentario?.trim()) {
      alert('Por favor ingresa un comentario para solicitar aclaración');
      return;
    }

    try {
      // TODO: Implementar solicitud de aclaración
      console.log('Solicitando aclaración para respuesta:', respuestaId, comentario);
      alert('Solicitud de aclaración enviada');
      
      // Limpiar comentario
      setComentarios(prev => ({ ...prev, [respuestaId]: '' }));
      
    } catch (error) {
      console.error('Error solicitando aclaración:', error);
      alert('Error al enviar solicitud de aclaración');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando respuestas...</div>
        </div>
      </div>
    );
  }

  if (!startup || !postulacion || !respuestas.length) {
    return (
      <div className="container mx-auto p-6">
          <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600">No se encontraron las respuestas</p>
        </div>
      </div>
    );
  }

  const respuestasPorCategoria = agruparRespuestasPorCategoria();

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
            <h1 className="text-3xl font-bold text-gray-900">Revisión de Respuestas</h1>
            <p className="text-gray-600">Evaluación previa a la revisión de IA</p>
          </div>
        </div>
        <div className="flex gap-2">
          {evaluacionExistente ? (
            <Button
              onClick={irARevisionIA}
              className="flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              Ver Evaluación IA
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={iniciarEvaluacionIA}
                disabled={procesando}
                className="flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                {procesando ? 'Iniciando...' : 'Evaluación IA'}
              </Button>
              <Button
                onClick={crearEvaluacionManual}
                disabled={procesando}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {procesando ? 'Creando...' : 'Evaluación Manual'}
              </Button>
            </div>
          )}
        </div>
      </div>

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
                    evaluacionExistente ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }>
                    {evaluacionExistente ? 'Evaluación IA Completada' : 'Pendiente de Evaluación IA'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Respuestas:</span>
                  <span>{respuestas.length} de 16</span>
                </div>
                {evaluacionExistente && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Puntuación IA:</span>
                    <span className="font-semibold">{evaluacionExistente.puntajeTotal?.toFixed(1) || 'N/A'}/100</span>
                  </div>
                )}
            </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Respuestas por Categoría */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Respuestas por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {Object.entries(respuestasPorCategoria).map(([categoria, respuestasCategoria]) => (
              <AccordionItem key={categoria} value={categoria}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    {getCategoriaIcon(categoria as CategoriaEvaluacion)}
                    <Badge variant="outline" className={getCategoriaColor(categoria as CategoriaEvaluacion)}>
                      {getCategoriaNombre(categoria as CategoriaEvaluacion)}
                  </Badge>
                    <span className="text-sm text-gray-500">
                      {respuestasCategoria.length} respuestas
                    </span>
                </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    {respuestasCategoria
                      .sort((a, b) => a.orden - b.orden)
                      .map((respuesta, index) => (
                        <div key={respuesta.id} className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-2">
                                Pregunta {respuesta.orden}: {respuesta.pregunta}
                        </h4>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  {respuesta.respuesta}
                        </p>
                      </div>
                    </div>
      </div>

                          <div className="flex items-center gap-2">
                            <Textarea
                              placeholder="Agregar comentario o solicitar aclaración..."
                              value={comentarios[respuesta.id] || ''}
                              onChange={(e) => setComentarios(prev => ({
                                ...prev,
                                [respuesta.id]: e.target.value
                              }))}
                              className="flex-1"
                              rows={2}
                            />
        <Button
          variant="outline"
                              size="sm"
                              onClick={() => solicitarAclaracion(respuesta.id)}
                              disabled={!comentarios[respuesta.id]?.trim()}
                              className="flex items-center gap-2"
        >
                              <Send className="w-4 h-4" />
                              Solicitar
        </Button>
                          </div>
                          
                          {index < respuestasCategoria.length - 1 && <Separator />}
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Acciones */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {evaluacionExistente 
                ? 'La evaluación de IA ya ha sido completada. Puedes revisar los resultados.'
                : 'Una vez revisadas las respuestas, puedes iniciar la evaluación automática con IA.'
              }
            </div>
            <div className="flex gap-2">
              {evaluacionExistente ? (
                <Button
                  onClick={irARevisionIA}
                  className="flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Ver Evaluación IA
                </Button>
              ) : (
          <Button
                  onClick={iniciarEvaluacionIA}
                  disabled={procesando}
                  className="flex items-center gap-2"
          >
                  <Brain className="w-4 h-4" />
                  {procesando ? 'Iniciando...' : 'Iniciar Evaluación IA'}
          </Button>
              )}
        </div>
      </div>
        </CardContent>
      </Card>
    </div>
  );
} 