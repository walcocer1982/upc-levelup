import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StartupCardProps {
  startup: {
    id: string;
    nombre: string;
    descripcion: string;
    fechaFundacion: string;
    etapa: string;
    categoria: string;
    membersCount?: number;
  };
  onClick: (id: string) => void;
}

export default function StartupCard({ startup, onClick }: StartupCardProps) {
  const { id, nombre, descripcion, fechaFundacion, etapa, categoria, membersCount = 0 } = startup;

  const getEtapaColor = (etapa: string) => {
    switch (etapa) {
      case "mvp":
        return "bg-amber-100 text-amber-800";
      case "idea":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "tech":
        return "bg-green-100 text-green-800";
      case "edtech":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{nombre}</h3>
          <div className="flex space-x-2">
            <Badge variant="outline" className={getEtapaColor(etapa)}>
              {etapa === "mvp" ? "MVP" : "Idea"}
            </Badge>
            <Badge variant="outline" className={getCategoriaColor(categoria)}>
              {categoria === "tech" ? "Tech" : categoria === "edtech" ? "EdTech" : "Otras"}
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
            <span>{membersCount} integrantes</span>
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