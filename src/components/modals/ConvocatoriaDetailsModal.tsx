"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, FileText, Target, BarChart3, CheckCircle, XCircle, Clock, Send } from "lucide-react";
import { getMockData } from "@/data/mock";

interface ConvocatoriaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  convocatoria: any;
}

export default function ConvocatoriaDetailsModal({ isOpen, onClose, convocatoria }: ConvocatoriaDetailsModalProps) {
  if (!convocatoria) return null;

  const postulaciones = getMockData.getPostulacionesByConvocatoria(convocatoria.id);
  const creador = getMockData.getUserById(convocatoria.creadoPorId);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "abierta":
        return "bg-green-100 text-green-800";
      case "en_evaluacion":
        return "bg-blue-100 text-blue-800";
      case "finalizada":
        return "bg-gray-100 text-gray-800";
      case "cerrada":
        return "bg-red-100 text-red-800";
      case "borrador":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Inqubalab":
        return "bg-purple-100 text-purple-800";
      case "Aceleración":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case "abierta":
        return "Abierta";
      case "en_evaluacion":
        return "En Evaluación";
      case "finalizada":
        return "Finalizada";
      case "cerrada":
        return "Cerrada";
      case "borrador":
        return "Borrador";
      default:
        return estado;
    }
  };

  const getEstadoPostulacionColor = (estado: string) => {
    switch (estado) {
      case "aprobada":
        return "bg-green-100 text-green-800";
      case "rechazada":
        return "bg-red-100 text-red-800";
      case "en_revision":
        return "bg-blue-100 text-blue-800";
      case "evaluada":
        return "bg-purple-100 text-purple-800";
      case "enviada":
        return "bg-orange-100 text-orange-800";
      case "borrador":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoPostulacionText = (estado: string) => {
    switch (estado) {
      case "aprobada":
        return "Aprobada";
      case "rechazada":
        return "Rechazada";
      case "en_revision":
        return "En Revisión";
      case "evaluada":
        return "Evaluada";
      case "enviada":
        return "Enviada";
      case "borrador":
        return "Borrador";
      default:
        return estado;
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "aprobada":
        return <CheckCircle size={16} />;
      case "rechazada":
        return <XCircle size={16} />;
      case "en_revision":
        return <Clock size={16} />;
      case "enviada":
        return <Send size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{convocatoria.titulo}</span>
            <Badge className={getEstadoColor(convocatoria.estado)}>
              {getEstadoText(convocatoria.estado)}
            </Badge>
            <Badge variant="outline" className={getTipoColor(convocatoria.tipo)}>
              {convocatoria.tipo}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="criterios">Criterios</TabsTrigger>
            <TabsTrigger value="postulaciones">Postulaciones</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Descripción</h4>
                  <p className="text-muted-foreground">{convocatoria.descripcion}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Período</p>
                      <p className="text-sm text-muted-foreground">
                        {convocatoria.fechaInicio.toISOString().split('T')[0]} - {convocatoria.fechaFin.toISOString().split('T')[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Creado por</p>
                      <p className="text-sm text-muted-foreground">
                        {creador?.nombres} {creador?.apellidos}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Criterios</p>
                      <p className="text-sm text-muted-foreground">
                        {convocatoria.criterios.length} criterios
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Fechas importantes</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Fecha de inicio:</span>
                        <span className="font-medium">{convocatoria.fechaInicio.toISOString().split('T')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fecha de fin:</span>
                        <span className="font-medium">{convocatoria.fechaFin.toISOString().split('T')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Creada:</span>
                        <span className="font-medium">{convocatoria.createdAt.toISOString().split('T')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Última actualización:</span>
                        <span className="font-medium">{convocatoria.updatedAt.toISOString().split('T')[0]}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Resumen</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total de postulaciones:</span>
                        <span className="font-medium">{postulaciones.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Postulaciones aprobadas:</span>
                        <span className="font-medium">
                          {postulaciones.filter(p => p.estado === 'aprobada').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Postulaciones rechazadas:</span>
                        <span className="font-medium">
                          {postulaciones.filter(p => p.estado === 'rechazada').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>En revisión:</span>
                        <span className="font-medium">
                          {postulaciones.filter(p => p.estado === 'en_revision').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="criterios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Criterios de Evaluación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {convocatoria.criterios.map((criterio: any, index: number) => (
                    <div key={criterio.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{criterio.nombre}</h4>
                          <p className="text-sm text-muted-foreground">{criterio.descripcion}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {criterio.tipo}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Peso:</span>
                          <span className="ml-2 font-medium">{criterio.peso}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Puntaje:</span>
                          <span className="ml-2 font-medium">{criterio.puntajeMinimo}-{criterio.puntajeMaximo}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Requerido:</span>
                          <span className="ml-2 font-medium">
                            {criterio.requerido ? "Sí" : "No"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="ml-2 font-medium capitalize">{criterio.tipo}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="postulaciones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Postulaciones ({postulaciones.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {postulaciones.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No hay postulaciones para esta convocatoria
                  </p>
                ) : (
                  <div className="space-y-4">
                    {postulaciones.map((postulacion: any) => {
                      const startup = getMockData.getStartupById(postulacion.startupId);
                      return (
                        <div key={postulacion.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{startup?.nombre}</h4>
                              <p className="text-sm text-muted-foreground">
                                {startup?.descripcion}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getEstadoIcon(postulacion.estado)}
                              <Badge className={getEstadoPostulacionColor(postulacion.estado)}>
                                {getEstadoPostulacionText(postulacion.estado)}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Fecha de envío:</span>
                              <span className="ml-2 font-medium">
                                {postulacion.fechaEnvio ? postulacion.fechaEnvio.toISOString().split('T')[0] : "No enviada"}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Fecha de evaluación:</span>
                              <span className="ml-2 font-medium">
                                {postulacion.fechaEvaluacion ? postulacion.fechaEvaluacion.toISOString().split('T')[0] : "Pendiente"}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Respuestas:</span>
                              <span className="ml-2 font-medium">
                                {postulacion.respuestas.length}/{convocatoria.criterios.length}
                              </span>
                            </div>
                          </div>

                          {postulacion.respuestas.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium mb-2">Respuestas a criterios:</h5>
                              <div className="space-y-2">
                                {postulacion.respuestas.map((respuesta: any) => {
                                  const criterio = convocatoria.criterios.find((c: any) => c.id === respuesta.criterioId);
                                  return (
                                    <div key={respuesta.id} className="bg-muted/50 rounded p-3">
                                      <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-sm">{criterio?.nombre}</span>
                                        <Badge variant="outline" size="sm">
                                          {respuesta.estado}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {respuesta.valor.substring(0, 150)}...
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estadisticas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de la Convocatoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Estado de Postulaciones</h4>
                    <div className="space-y-3">
                      {[
                        { estado: 'aprobada', label: 'Aprobadas', color: 'text-green-600' },
                        { estado: 'rechazada', label: 'Rechazadas', color: 'text-red-600' },
                        { estado: 'en_revision', label: 'En Revisión', color: 'text-blue-600' },
                        { estado: 'evaluada', label: 'Evaluadas', color: 'text-purple-600' },
                        { estado: 'enviada', label: 'Enviadas', color: 'text-orange-600' },
                        { estado: 'borrador', label: 'Borrador', color: 'text-gray-600' },
                      ].map(({ estado, label, color }) => {
                        const count = postulaciones.filter((p: any) => p.estado === estado).length;
                        const percentage = postulaciones.length > 0 ? (count / postulaciones.length) * 100 : 0;
                        return (
                          <div key={estado} className="flex justify-between items-center">
                            <span className="text-sm">{label}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${color}`}>{count}</span>
                              <span className="text-sm text-muted-foreground">({percentage.toFixed(1)}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Distribución de Criterios</h4>
                    <div className="space-y-3">
                      {convocatoria.criterios.map((criterio: any) => (
                        <div key={criterio.id} className="flex justify-between items-center">
                          <span className="text-sm">{criterio.nombre}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{criterio.peso}%</span>
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${criterio.peso}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-4">Resumen General</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">{postulaciones.length}</div>
                      <div className="text-sm text-muted-foreground">Total Postulaciones</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {postulaciones.filter((p: any) => p.estado === 'aprobada').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Aprobadas</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {postulaciones.filter((p: any) => p.estado === 'en_revision').length}
                      </div>
                      <div className="text-sm text-muted-foreground">En Revisión</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">{convocatoria.criterios.length}</div>
                      <div className="text-sm text-muted-foreground">Criterios</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 