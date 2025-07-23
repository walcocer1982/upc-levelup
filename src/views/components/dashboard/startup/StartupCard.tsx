import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StartupCardProps {
  startup: {
    id: string;
    nombre: string;
    descripcion: string;
    fechaFundacion: string | Date;
    etapa?: string;
    categoria?: string;
    membersCount?: number;
    members?: { rol: string }[];
  };
  onClick: (id: string) => void;
}

export default function StartupCard({ startup, onClick }: StartupCardProps) {
  const { id, nombre, descripcion, fechaFundacion, etapa = "", categoria = "", membersCount, members } = startup;

  // Calcular el número de miembros desde la base de datos o usar el valor por defecto
  const actualMembersCount = membersCount || members?.length || 0;

  const getEtapaColor = (etapa: string) => {
    if (!etapa) return "bg-gray-100 text-gray-800";
    
    switch (etapa.toLowerCase()) {
      case "mvp":
        return "bg-amber-100 text-amber-800";
      case "idea":
        return "bg-blue-100 text-blue-800";
      case "crecimiento":
        return "bg-green-100 text-green-800";
      case "escalamiento":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoriaColor = (categoria: string) => {
    if (!categoria) return "bg-gray-100 text-gray-800";
    
    switch (categoria.toLowerCase()) {
      case "tech":
      case "tecnología":
        return "bg-green-100 text-green-800";
      case "edtech":
      case "educación":
        return "bg-purple-100 text-purple-800";
      case "fintech":
        return "bg-blue-100 text-blue-800";
      case "healthtech":
      case "salud":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatEtapaDisplay = (etapa: string) => {
    if (!etapa) return "Sin definir";
    
    switch (etapa.toLowerCase()) {
      case "mvp":
        return "MVP";
      case "idea":
        return "Idea";
      case "crecimiento":
        return "Crecimiento";
      case "escalamiento":
        return "Escalamiento";
      default:
        return etapa;
    }
  };

  const formatCategoriaDisplay = (categoria: string) => {
    if (!categoria) return "Sin definir";
    
    switch (categoria.toLowerCase()) {
      case "tech":
      case "tecnología":
        return "Tech";
      case "edtech":
      case "educación":
        return "EdTech";
      case "fintech":
        return "FinTech";
      case "healthtech":
      case "salud":
        return "HealthTech";
      default:
        return categoria;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{nombre}</h3>
          <div className="flex space-x-2">
            <Badge variant="outline" className={getEtapaColor(etapa)}>
              {formatEtapaDisplay(etapa)}
            </Badge>
            <Badge variant="outline" className={getCategoriaColor(categoria)}>
              {formatCategoriaDisplay(categoria)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {descripcion}
        </p>
        <div className="flex items-center text-xs text-muted-foreground space-x-4">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{new Date(fechaFundacion).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Users2 size={14} className="mr-1" />
            <span>{actualMembersCount} integrantes</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full"
          onClick={() => onClick(id)}
        >
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  );
}