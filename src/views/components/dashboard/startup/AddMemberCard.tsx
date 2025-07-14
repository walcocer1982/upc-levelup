"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddMemberCardProps {
  onClick: () => void;
  className?: string;
}

export default function AddMemberCard({ onClick, className }: AddMemberCardProps) {
  return (
    <Card 
      className={cn(
        "h-full flex flex-col items-center justify-center cursor-pointer transition-all",
        "hover:bg-primary/5 hover:border-primary/20 border bg-card",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center h-full w-full py-3 sm:py-6 text-center">
        {/* Círculo con ícono Plus */}
        <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-4">
          <Plus size={20} className="sm:size-8 text-primary" />
        </div>
        
        {/* Título */}
        <h3 className="font-medium text-sm sm:text-lg">Agregar integrante</h3>
        
        {/* Descripción */}
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 max-w-[200px]">
          Añade un nuevo miembro a tu equipo
        </p>
        
        {/* Botón */}
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 sm:mt-4 text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-3"
        >
          <Plus size={14} className="mr-1" />
          Nuevo integrante
        </Button>
      </CardContent>
    </Card>
  );
}