"use client";

import { useState } from "react";
import MemberCard from "./MemberCard";
import AddMemberCard from "./AddMemberCard";
import MembersForm from "@/views/components/forms/startup/MembersForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/general/useMediaQuery";

// Datos mockup de integrantes para demostración
const mockMembers = [
  {
    id: "1",
    nombre: "Ana Rodríguez",
    cargo: "CEO",
    email: "ana.rodriguez@startup.com",
    avatar: "",
  },
  {
    id: "2",
    nombre: "Carlos Mendoza",
    cargo: "CTO",
    email: "carlos.mendoza@startup.com",
    avatar: "",
  },
  {
    id: "3",
    nombre: "María Sánchez",
    cargo: "Marketing Lead",
    email: "maria.sanchez@startup.com",
    avatar: "",
  },
  {
    id: "4",
    nombre: "Javier López",
    cargo: "Full Stack Developer",
    email: "javier.lopez@startup.com",
    avatar: "",
  },
];

interface MembersListProps {
  startupId?: string;
  onSubmit?: (data: any) => void;
}

export default function MembersList({ startupId, onSubmit = () => {} }: MembersListProps) {
  const [members, setMembers] = useState(mockMembers);
  const [showForm, setShowForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  const editingMember = editingMemberId 
    ? members.find(m => m.id === editingMemberId) 
    : undefined;

  const handleAddMember = () => {
    if (isMobile) {
      setEditingMemberId(null);
      setShowForm(true);
    } else {
      setEditingMemberId(null);
      setIsDialogOpen(true);
    }
  };

  const handleEditMember = (id: string) => {
    if (isMobile) {
      setEditingMemberId(id);
      setShowForm(true);
    } else {
      setEditingMemberId(id);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleFormSubmit = (data: any) => {
    if (editingMemberId) {
      // Actualizar miembro existente
      setMembers(members.map(m => 
        m.id === editingMemberId ? { ...m, ...data } : m
      ));
    } else {
      // Añadir nuevo miembro
      const newMember = {
        id: `member-${Date.now()}`,
        ...data,
      };
      setMembers([...members, newMember]);
    }
    
    setShowForm(false);
    setIsDialogOpen(false);
    setEditingMemberId(null);
    onSubmit(members);
  };

  // Si estamos mostrando el formulario en modo móvil
  if (showForm) {
    return (
      <div className="space-y-3 sm:space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 h-7 px-2 text-xs sm:text-sm"
            onClick={() => setShowForm(false)}
          >
            <ArrowLeft size={14} className="mr-1 sm:mr-2" />
            <span>Volver</span>
          </Button>
          <h2 className="text-lg sm:text-2xl font-bold">
            {editingMemberId ? "Editar integrante" : "Agregar integrante"}
          </h2>
        </div>
        
        <MembersForm 
          onSubmit={handleFormSubmit}
          initialData={editingMember}
        />
      </div>
    );
  }

  // Mostrar la lista de integrantes
  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-2xl font-bold">Integrantes del equipo</h2>
      </div>
      
      {/* Grid responsivo para las tarjetas con menos gap en móvil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
          <AddMemberCard onClick={handleAddMember} />
        
        {/* Tarjetas de miembros existentes */}
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onEdit={handleEditMember}
            onDelete={handleDeleteMember}
          />
        ))}
      </div>

      {/* Dialog para formulario en pantallas más grandes */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-4 sm:p-6 pb-0 sm:pb-0">
            <DialogTitle>
              {editingMemberId ? "Editar integrante" : "Agregar integrante"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 sm:p-6 pt-2 sm:pt-2">
            <MembersForm 
              onSubmit={handleFormSubmit}
              initialData={editingMember}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}