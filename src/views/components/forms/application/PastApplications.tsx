"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface PastApplication {
  id: string;
  convocatoriaId: string;
  convocatoriaNombre: string;
  convocatoriaTipo: string;
  fechaInicio: string;
  fechaFin: string;
  fechaPostulacion: string;
  estado: "postulado" | "aprobado" | "desaprobado" | "enRevision";
  feedback: string;
  feedbackIA: string;
  startupId: string;
  startupNombre: string;
  locked: boolean;
}

interface PastApplicationsProps {
  startupId?: string;
  className?: string;
}

export default function PastApplications({ 
  startupId,
  className 
}: PastApplicationsProps) {
  const [applications, setApplications] = useState<PastApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

  console.log("🔍 PastApplications - Props recibidas:");
  console.log("  - startupId:", startupId);

  // Cargar postulaciones del usuario
  useEffect(() => {
    const fetchApplications = async () => {
      console.log("🔄 PastApplications - Cargando postulaciones del usuario");
      setIsLoading(true);

      try {
        const url = startupId 
          ? `/api/users/applications?startupId=${startupId}`
          : '/api/users/applications';
        
        console.log("🔄 PastApplications - URL:", url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("📨 PastApplications - Respuesta:", data);

        if (response.ok) {
          console.log("✅ PastApplications - Postulaciones cargadas:", data.applications.length);
          setApplications(data.applications || []);
        } else {
          console.error("❌ PastApplications - Error al cargar postulaciones:", data.error);
          if (response.status !== 403) { // No mostrar error si no tiene acceso a startup específica
            toast.error(data.error || "Error al cargar las postulaciones");
          }
          setApplications([]);
        }
      } catch (error) {
        console.error("💥 PastApplications - Error en petición:", error);
        toast.error("Error al cargar las postulaciones");
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [startupId]);

  // Formatear fechas en formato legible
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Verificar si la convocatoria está activa
  const isConvocatoriaActive = (fechaInicio: string, fechaFin: string) => {
    const now = new Date();
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    return now >= start && now <= end;
  };

  // Devolver badge según el estado
  const getStatusBadge = (estado: string) => {
    switch(estado) {
      case "aprobado":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <CheckCircleIcon className="h-3.5 w-3.5" />
            Aprobada
          </Badge>
        );
      case "desaprobado":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircleIcon className="h-3.5 w-3.5" />
            Rechazada
          </Badge>
        );
      case "enRevision":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            En revisión
          </Badge>
        );
      case "postulado":
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
            Postulada
          </Badge>
        );
    }
  };

  // Manejar la expansión del feedback
  const toggleFeedback = (appId: string) => {
    if (expandedFeedback === appId) {
      setExpandedFeedback(null);
    } else {
      setExpandedFeedback(appId);
    }
  };

  // Determinar si mostrar feedback
  const shouldShowFeedback = (app: PastApplication) => {
    return (app.feedback && app.feedback !== "No disponible") || 
           (app.feedbackIA && app.feedbackIA !== "No disponible");
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Postulaciones anteriores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 bg-muted animate-pulse rounded-lg"></div>
            <div className="h-16 bg-muted animate-pulse rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Postulaciones anteriores</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <p className="text-center text-muted-foreground">No hay postulaciones previas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          Postulaciones anteriores
          <span className="ml-2 text-sm text-muted-foreground font-normal">
            ({applications.length} {applications.length === 1 ? 'postulación' : 'postulaciones'})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.map(app => (
          <div 
            key={app.id} 
            className="border rounded-lg overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-3">
              <div className="space-y-1 mb-2 sm:mb-0 flex-grow">
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {app.convocatoriaTipo === 'Aceleracion' ? 'Aceleración' : app.convocatoriaTipo} {new Date(app.fechaInicio).getFullYear()}
                  </p>
                  {isConvocatoriaActive(app.fechaInicio, app.fechaFin) && (
                    <Badge variant="outline" className="text-xs">
                      Activa
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  <span>Postulado el {formatDate(app.fechaPostulacion)}</span>
                </div>
                {!startupId && (
                  <div className="text-sm text-muted-foreground">
                    Startup: {app.startupNombre}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                {getStatusBadge(app.estado)}
                {shouldShowFeedback(app) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleFeedback(app.id)}
                    className="mt-2 sm:mt-0"
                  >
                    {expandedFeedback === app.id ? "Ocultar Feedback" : "Ver Feedback"}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Sección expandible para feedback */}
            {expandedFeedback === app.id && shouldShowFeedback(app) && (
              <div className="p-3 pt-0 border-t mt-1 bg-muted/30">
                {app.feedback && app.feedback !== "No disponible" && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium mb-1">Feedback del evaluador:</h4>
                    <p className="text-sm text-muted-foreground">{app.feedback}</p>
                  </div>
                )}
                {app.feedbackIA && app.feedbackIA !== "No disponible" && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Feedback IA:</h4>
                    <p className="text-sm text-muted-foreground">{app.feedbackIA}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}