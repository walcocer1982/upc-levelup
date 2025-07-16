"use client";

import { useState } from "react";
import ApplicationCard from "./ApplicationCard";
import PastApplications from "./PastApplications";
import ApplicationForm from "@/views/components/forms/application/ApplicationForm";
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogHeader 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Datos de ejemplo para las convocatorias activas
const mockApplications = [
  {
    id: "1",
    nombre: "Inqubalab",
    fechaInicio: "2025-07-01",
    fechaFin: "2025-08-15",
    descripcion: "Programa de incubación para startups en etapa temprana con duración de 3 meses."
  },
  {
    id: "2",
    nombre: "Aceleración",
    fechaInicio: "2025-06-15",
    fechaFin: "2025-07-20",
    descripcion: "Programa intensivo para startups con MVP validado buscando escalar su modelo de negocio."
  },
];

// Datos de ejemplo para postulaciones pasadas
const mockPastApplications = [
  {
    id: "101",
    convocatoriaNombre: "Inqubalab 2024-1",
    fechaPostulacion: "2024-02-10",
    estado: "aceptado",
    startupId: "1"
  },
  {
    id: "102",
    convocatoriaNombre: "Aceleración 2024-1",
    fechaPostulacion: "2024-04-15",
    estado: "en_revision",
    startupId: "2"
  }
];

interface ApplicationListProps {
  startupId?: string;
}

export default function ApplicationList({ startupId }: ApplicationListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  
  // Filtrar postulaciones pasadas por startupId
  const filteredPastApplications = startupId 
    ? mockPastApplications.filter(app => app.startupId === startupId)
    : [];
  
  const handleApply = (id: string) => {
    setSelectedApplicationId(id);
    setIsFormOpen(true);
  };
  
  const handleFormSubmit = (data: any) => {
    console.log("Application submitted:", data);
    console.log("For application ID:", selectedApplicationId);
    console.log("For startup ID:", startupId);
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  // Obtener el nombre de la convocatoria seleccionada
  const getSelectedApplicationName = () => {
    const app = mockApplications.find(app => app.id === selectedApplicationId);
    return app ? app.nombre : "Convocatoria";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Convocatorias disponibles</h1>
        <p className="text-muted-foreground mt-1">
          Postula tu startup a los programas de incubación y aceleración disponibles
        </p>
      </div>

      {/* Grid de convocatorias activas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockApplications.map((application) => (
          <ApplicationCard 
            key={application.id}
            application={application}
            onApply={handleApply}
          />
        ))}
      </div>

      {/* Sección de postulaciones anteriores */}
      <div className="mt-8">
        <PastApplications 
          applications={filteredPastApplications} 
        />
      </div>

      {/* Dialog para formulario de postulación */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Postulación a {getSelectedApplicationName()}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-muted-foreground mb-4"
              onClick={handleCloseForm}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a convocatorias
            </Button>
            
            <p className="text-sm text-muted-foreground mt-1">
              Completa la información para postular tu startup
            </p>
          </div>
          
          <ApplicationForm 
            onSubmit={handleFormSubmit} 
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}