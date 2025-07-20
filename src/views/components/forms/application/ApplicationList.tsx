"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";

interface Application {
  id: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  creadoPor: string;
  postulaciones: number;
}

interface ApplicationListProps {
  startupId?: string;
}

export default function ApplicationList({ startupId }: ApplicationListProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  console.log("🔍 ApplicationList - Props recibidas:");
  console.log("  - startupId:", startupId);

  // Cargar convocatorias activas
  useEffect(() => {
    const fetchApplications = async () => {
      console.log("🔄 ApplicationList - Cargando convocatorias activas");
      setIsLoadingApplications(true);

      try {
        const response = await fetch('/api/applications');
        const data = await response.json();

        console.log("📨 ApplicationList - Respuesta convocatorias:", data);

        if (response.ok) {
          console.log("✅ ApplicationList - Convocatorias cargadas:", data.applications.length);
          setApplications(data.applications || []);
        } else {
          console.error("❌ ApplicationList - Error al cargar convocatorias:", data.error);
          toast.error(data.error || "Error al cargar las convocatorias");
          setApplications([]);
        }
      } catch (error) {
        console.error("💥 ApplicationList - Error en petición convocatorias:", error);
        toast.error("Error al cargar las convocatorias");
        setApplications([]);
      } finally {
        setIsLoadingApplications(false);
      }
    };

    fetchApplications();
  }, []);
  
  const handleApply = (id: string) => {
    console.log("📝 ApplicationList - Iniciando postulación para convocatoria:", id);
    setSelectedApplicationId(id);
    setIsFormOpen(true);
  };
  
  const handleFormSubmit = (data: any) => {
    console.log("✅ ApplicationList - Postulación enviada exitosamente:", data);
    console.log("📋 ApplicationList - Para convocatoria ID:", selectedApplicationId);
    console.log("📋 ApplicationList - Para startup ID:", startupId);
    setIsFormOpen(false);
    setSelectedApplicationId(null);
    
    // Recargar convocatorias para actualizar contador de postulaciones
    // No es necesario hacer fetch aquí, el ApplicationForm ya maneja la respuesta
  };

  const handleCloseForm = () => {
    console.log("❌ ApplicationList - Formulario cerrado sin enviar");
    setIsFormOpen(false);
    setSelectedApplicationId(null);
  };

  // Obtener el nombre de la convocatoria seleccionada
  const getSelectedApplicationName = () => {
    const app = applications.find(app => app.id === selectedApplicationId);
    if (!app) return "Convocatoria";
    return app.tipo === 'Aceleracion' ? 'Aceleración' : app.tipo;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Convocatorias disponibles</h1>
        <p className="text-muted-foreground mt-1">
          Postula tu startup a los programas de incubación y aceleración disponibles
        </p>
      </div>

      {/* Loading de convocatorias */}
      {isLoadingApplications ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-48 bg-muted animate-pulse rounded-lg"></div>
        </div>
      ) : applications.length > 0 ? (
        /* Grid de convocatorias activas */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((application) => (
            <ApplicationCard 
              key={application.id}
              application={application}
              onApply={handleApply}
            />
          ))}
        </div>
      ) : (
        /* Sin convocatorias activas */
        <div className="text-center py-8">
          <p className="text-muted-foreground text-lg">No hay convocatorias activas en este momento</p>
          <p className="text-sm text-muted-foreground mt-2">
            Las convocatorias aparecerán aquí cuando estén disponibles para postulación
          </p>
        </div>
      )}

      {/* Sección de postulaciones anteriores */}
      <div className="mt-8">
        <PastApplications 
          startupId={startupId}
        />
      </div>

      {/* Dialog para formulario de postulación */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
          
          {selectedApplicationId && (
            <ApplicationForm 
              applicationId={selectedApplicationId}
              onSubmit={handleFormSubmit} 
              onCancel={handleCloseForm}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}