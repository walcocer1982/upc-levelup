"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberCardProps {
  member: {
    id: string;
    nombre: string;
    cargo: string;
    email: string;
    avatar?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export default function MemberCard({ 
  member,
  onEdit,
  onDelete,
  className
}: MemberCardProps) {
  // Obtener iniciales para el avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className={cn("h-full flex flex-col transition-all hover:shadow-md", className)}>
      {/* Usar mismo padding que AddMemberCard */}
      <CardContent className="py-3 sm:py-6 flex flex-col items-center justify-center text-center">
        {/* Avatar más pequeño en móvil, igual que en AddMemberCard */}
        <Avatar className="h-12 w-12 sm:h-20 sm:w-20 mb-2 sm:mb-4">
          {member.avatar ? (
            <AvatarImage src={member.avatar} alt={member.nombre} />
          ) : (
            <AvatarFallback className="text-base sm:text-lg bg-primary/10 text-primary">
              {getInitials(member.nombre)}
            </AvatarFallback>
          )}
        </Avatar>
        
        {/* Texto más pequeño y menos espacio */}
        <h3 className="font-medium text-sm sm:text-lg line-clamp-1">{member.nombre}</h3>
        <Badge variant="outline" className="mt-0.5 sm:mt-1 mb-1 sm:mb-2 text-xs sm:text-sm px-1.5 sm:px-2 py-0 sm:py-0.5">
          {member.cargo}
        </Badge>
        <p className="text-xs text-muted-foreground line-clamp-1">{member.email}</p>
      
        {/* Mover los botones dentro del CardContent para unificar espaciado */}
        <div className="flex flex-row justify-center gap-1 sm:gap-2 mt-2 sm:mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 sm:h-9 w-auto px-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(member.id)}
          >
            <Edit size={14} className="mr-1 sm:mr-1.5" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 sm:h-9 w-auto px-2 text-xs sm:text-sm text-destructive hover:text-destructive/80"
            onClick={() => onDelete(member.id)}
          >
            <Trash2 size={14} className="mr-1 sm:mr-1.5" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}