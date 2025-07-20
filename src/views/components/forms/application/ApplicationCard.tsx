"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface ApplicationCardProps {
  application: {
    id: string;
    tipo: string; // "Inqubalab" o "Aceleracion"
    fechaInicio: string;
    fechaFin: string;
    creadoPor?: string;
    postulaciones?: number;
  };
  onApply: (id: string) => void;
  className?: string;
}

export default function ApplicationCard({ 
  application, 
  onApply,
  className 
}: ApplicationCardProps) {
  // Verificar si la convocatoria está activa (fecha actual entre fechaInicio y fechaFin)
  const isActive = () => {
    const now = new Date();
    const startDate = new Date(application.fechaInicio);
    const endDate = new Date(application.fechaFin);
    
    return now >= startDate && now <= endDate;
  };
  
  // Formatear fechas en formato legible
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener descripción según el tipo
  const getDescription = (tipo: string) => {
    switch(tipo) {
      case 'Inqubalab':
        return 'Programa de incubación para startups en etapa temprana con duración de 3 meses.';
      case 'Aceleracion':
        return 'Programa intensivo para startups con MVP validado buscando escalar su modelo de negocio.';
      default:
        return 'Programa de desarrollo empresarial para startups.';
    }
  };

  return (
    <Card className={cn("h-full flex flex-col transition-all hover:shadow-md", className)}>
      <CardContent className="flex-grow p-4 sm:p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">
            {application.tipo === 'Aceleracion' ? 'Aceleración' : application.tipo}
          </h3>
          <Badge 
            variant={isActive() ? "default" : "secondary"}
            className={cn(
              isActive() ? "bg-green-100 text-green-800 hover:bg-green-200" : 
              "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {isActive() ? "Activa" : "Finalizada"}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {getDescription(application.tipo)}
        </p>
        
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Inicio: {formatDate(application.fechaInicio)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Cierre: {formatDate(application.fechaFin)}</span>
          </div>
          {application.postulaciones !== undefined && (
            <div className="text-xs text-muted-foreground mt-2">
              {application.postulaciones} postulaciones recibidas
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
        <Button 
          className="w-full" 
          onClick={() => onApply(application.id)}
          disabled={!isActive()}
        >
          {isActive() ? "Postular" : "Convocatoria cerrada"}
        </Button>
      </CardFooter>
    </Card>
  );
}