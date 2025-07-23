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
  DollarSign, 
  TrendingUp, 
  Leaf,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText
} from "lucide-react";
import { getMockData } from "@/data/mock";
import { IStartup, IEvaluacion, IFeedback } from "@/models/interfaces";

// Mapeo de criterios a títulos
const criteriosTitulos: { [key: number]: string } = {
  0: "Propuesta de Valor",
  1: "Problema a Resolver", 
  2: "Tamaño del Mercado",
  3: "Experiencia del Equipo",
  4: "Complementariedad del Equipo",
  5: "Compromiso del Equipo",
  6: "Tecnología/Innovación",
  7: "Diferenciación",
  8: "Escalabilidad",
  9: "Modelo de Ingresos",
  10: "Canales de Distribución",
  11: "Validación del Mercado",
  12: "Métricas Clave (KPIs)",
  13: "Proyecciones Financieras",
  14: "Impacto Social",
  15: "Sostenibilidad"
};

// Categorías para agrupar las respuestas (4 categorías como en el formulario de usuario)
const categorias = [
  {
    id: "complejidad",
    nombre: "Complejidad",
    icono: <Building2 className="w-5 h-5" />,
    color: "bg-blue-50 border-blue-200",
    campos: ["casoReal", "abordajeProblema", "consecuencias", "afectados"]
  },
  {
    id: "mercado",
    nombre: "Mercado", 
    icono: <TrendingUp className="w-5 h-5" />,
    color: "bg-green-50 border-green-200",
    campos: ["tamanoMercado", "potencialesClientes", "interesPagar", "segmentoInteres"]
  },
  {
    id: "escalabilidad",
    nombre: "Escalabilidad",
    icono: <Lightbulb className="w-5 h-5" />,
    color: "bg-purple-50 border-purple-200",
    campos: ["estrategiaAdquisicion", "costoAdquisicion", "facilidadExpansion", "escalabilidad"]
  },
  {
    id: "equipo",
    nombre: "Equipo",
    icono: <Users className="w-5 h-5" />,
    color: "bg-yellow-50 border-yellow-200",
    campos: ["trayectoria", "experiencia", "roles", "desafios"]
  }
];

export default function EvaluacionDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [startup, setStartup] = useState<IStartup | null>(null);
  const [evaluacion, setEvaluacion] = useState<IEvaluacion | null>(null);
  const [postulacion, setPostulacion] = useState<any>(null);
  const [impactData, setImpactData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const startupId = params.id as string;
      
      // Obtener datos mock
      const startupData = getMockData.getAllStartups().find(s => s.id === startupId);
      
      // Buscar la postulación de esta startup
      const postulacionData = getMockData.getPostulacionesByStartup(startupId)[0];
      
      // Buscar la evaluación por postulación
      const evaluacionData = postulacionData 
        ? getMockData.getEvaluacionesByPostulacion(postulacionData.id)[0]
        : null;
      
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
      setEvaluacion(evaluacionData || null);
      setPostulacion(postulacionData || null);
      setImpactData(impactData || null);
      setLoading(false);
    }
  }, [params.id]);

  const obtenerTituloCriterio = (criterioId: string): string => {
    // Convertir criterioId de string a number
    // Los criterios en mock usan: criterio-013, criterio-014, etc.
    // Necesitamos mapear: 13→0, 14→1, 15→2, etc.
    const criterioNum = parseInt(criterioId.split('-')[1]) - 13;
    return criteriosTitulos[criterioNum] || `Criterio ${criterioId}`;
  };

  const obtenerDatosPorCategoria = (categoria: typeof categorias[0]) => {
    if (!impactData) return [];
    
    return categoria.campos.map(campo => ({
      campo,
      valor: impactData[campo] || 'No especificado',
      titulo: obtenerTituloCampo(campo)
    }));
  };

  const obtenerTituloCampo = (campo: string): string => {
    const titulos: { [key: string]: string } = {
      casoReal: "Cuéntanos sobre un caso real y reciente",
      abordajeProblema: "¿Cómo abordaban el problema antes de su solución?",
      consecuencias: "¿Qué consecuencias tenía no resolver bien este problema?",
      afectados: "¿Han identificado a otros afectados?",
      tamanoMercado: "Tamaño del mercado",
      potencialesClientes: "Potenciales clientes",
      interesPagar: "Interés en pagar",
      segmentoInteres: "Segmento de interés",
      estrategiaAdquisicion: "Estrategia de adquisición",
      costoAdquisicion: "Costo de adquisición",
      facilidadExpansion: "Facilidad de expansión",
      escalabilidad: "Escalabilidad",
      trayectoria: "Trayectoria del equipo",
      experiencia: "Experiencia del equipo",
      roles: "Roles del equipo",
      desafios: "Desafíos superados"
    };
    return titulos[campo] || campo;
  };

  const obtenerEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Aprobado</Badge>;
      case 'rechazado':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rechazado</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const handleAprobar = () => {
    // Aquí iría la lógica para aprobar la evaluación
    console.log('Aprobar evaluación:', evaluacion?.id);
  };

  const handleRechazar = () => {
    // Aquí iría la lógica para rechazar la evaluación
    console.log('Rechazar evaluación:', evaluacion?.id);
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

  if (!startup || !evaluacion) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">No se encontró la evaluación</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Evaluación Detallada</h1>
            <p className="text-gray-600">Revisión completa de la startup</p>
          </div>
        </div>
                 {evaluacion?.recomendacion === 'pendiente' && (
          <div className="flex gap-2">
            <Button onClick={handleAprobar} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprobar
            </Button>
            <Button onClick={handleRechazar} variant="destructive">
              <XCircle className="w-4 h-4 mr-2" />
              Rechazar
            </Button>
          </div>
        )}
      </div>

      {/* Información General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Startup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
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

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Evaluación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                             <div>
                 <span className="font-medium">Estado:</span>
                 <div className="mt-1">{obtenerEstadoBadge(evaluacion?.recomendacion || 'pendiente')}</div>
               </div>
                             <div>
                 <span className="font-medium">Puntuación:</span>
                 <p className="text-gray-700">{evaluacion?.puntajeTotal || 0}/100</p>
               </div>
                             <div>
                 <span className="font-medium">Fecha:</span>
                 <p className="text-gray-700">
                   {evaluacion?.fechaEvaluacion ? 
                     new Date(evaluacion.fechaEvaluacion).toLocaleDateString('es-ES') : 
                     'Pendiente'}
                 </p>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Resumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                             <div>
                 <span className="font-medium">Total Respuestas:</span>
                 <p className="text-gray-700">{impactData ? '16/16' : '0/16'}</p>
               </div>
                             <div>
                 <span className="font-medium">Evaluador:</span>
                 <p className="text-gray-700">{evaluacion?.evaluadorId || 'Pendiente de asignar'}</p>
               </div>
              {evaluacion.comentarios && (
                <div>
                  <span className="font-medium">Comentarios:</span>
                  <p className="text-gray-700 text-sm">{evaluacion.comentarios}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

            {/* Respuestas del Usuario por Categorías */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Respuestas del Usuario por Categoría</CardTitle>
          <p className="text-gray-600">Revisa las respuestas completadas por el usuario organizadas por categorías</p>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {categorias.map((categoria) => {
              const datos = obtenerDatosPorCategoria(categoria);
              
              return (
                <AccordionItem key={categoria.id} value={categoria.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 w-full">
                      <div className={`p-2 rounded-lg ${categoria.color}`}>
                        {categoria.icono}
                      </div>
                      <div className="flex-1 text-left">
                        <span className="font-semibold text-lg">{categoria.nombre}</span>
                        <div className="text-sm text-gray-500 mt-1">
                          {datos.length} campos completados
                        </div>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {datos.length} campos
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4 space-y-4">
                      {datos.map((item, index) => (
                        <div key={item.campo} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {index + 1}. {item.titulo}
                          </h4>
                          <div className="bg-white rounded border p-3">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {item.valor}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Evaluación del Admin (Solo si hay evaluación) */}
      {evaluacion && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Evaluación del Administrador</CardTitle>
            <p className="text-gray-600">Criterios de evaluación y puntuación</p>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {evaluacion.criteriosEvaluados?.map((criterio, index) => (
                <AccordionItem key={criterio.id} value={criterio.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 w-full">
                      <div className="p-2 rounded-lg bg-blue-50 border-blue-200">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="font-semibold text-lg">
                          Criterio {criterio.criterioId}
                        </span>
                        <div className="text-sm text-gray-500 mt-1">
                          Puntuación: {criterio.puntaje}/4
                        </div>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {criterio.puntaje}/4
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4 space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Feedback:</h4>
                        <p className="text-gray-700">{criterio.feedback || 'Sin feedback'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Justificación:</h4>
                        <p className="text-gray-700">{criterio.justificacion || 'Sin justificación'}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 