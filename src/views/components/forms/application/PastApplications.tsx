"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Datos de ejemplo para postulaciones pasadas
const mockPastApplications = [
  {
    id: "101",
    convocatoriaNombre: "Inqubalab 2024-1",
    fechaPostulacion: "2024-02-10",
    estado: "aceptado",
    startupId: "1",
    feedback: "Tu startup muestra un gran potencial. El equipo tiene buena sinergia y el producto resuelve un problema real."
  },
  {
    id: "102",
    convocatoriaNombre: "Aceleración 2024-1",
    fechaPostulacion: "2024-04-15",
    estado: "en_revision",
    startupId: "1",
    feedback: ""
  },
  {
    id: "103",
    convocatoriaNombre: "Inqubalab 2023-2",
    fechaPostulacion: "2023-08-05",
    estado: "rechazado",
    startupId: "2",
    feedback: "Tu proyecto necesita mayor validación de mercado. Te recomendamos trabajar más en la validación con usuarios y definir mejor tu propuesta de valor."
  }
];

interface PastApplication {
  id: string;
  convocatoriaNombre: string;
  fechaPostulacion: string;
  estado: "aceptado" | "rechazado" | "en_revision";
  startupId: string;
  feedback: string;
}

interface PastApplicationsProps {
  startupId?: string;
  className?: string;
}

export default function PastApplications({ 
  startupId,
  className 
}: PastApplicationsProps) {
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

  // Filtrar postulaciones por startupId si está definido
  const filteredApplications = startupId 
    ? mockPastApplications.filter(app => app.startupId === startupId) 
    : mockPastApplications;
  
  if (filteredApplications.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 pb-4">
          <p className="text-center text-muted-foreground">No hay postulaciones previas</p>
        </CardContent>
      </Card>
    );
  }

  // Formatear fechas en formato legible
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Devolver badge según el estado
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "aceptado":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <CheckCircleIcon className="h-3.5 w-3.5" />
            Aceptada
          </Badge>
        );
      case "rechazado":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircleIcon className="h-3.5 w-3.5" />
            Rechazada
          </Badge>
        );
      case "en_revision":
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
            En revisión
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

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Postulaciones anteriores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredApplications.map(app => (
          <div 
            key={app.id} 
            className="border rounded-lg overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3">
              <div className="space-y-1 mb-2 sm:mb-0">
                <p className="font-medium">{app.convocatoriaNombre}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  <span>Postulado el {formatDate(app.fechaPostulacion)}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                {getStatusBadge(app.estado)}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleFeedback(app.id)}
                  disabled={app.estado === "en_revision" || !app.feedback}
                  className="mt-2 sm:mt-0"
                >
                  {expandedFeedback === app.id ? "Ocultar Feedback" : "Ver Feedback"}
                </Button>
              </div>
            </div>
            
            {/* Sección expandible para feedback */}
            {expandedFeedback === app.id && app.feedback && (
              <div className="p-3 pt-0 border-t mt-1 bg-muted/30">
                <h4 className="text-sm font-medium mb-1">Feedback recibido:</h4>
                <p className="text-sm text-muted-foreground">{app.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}