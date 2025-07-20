"use client";

import { useState, useEffect } from "react";
import MemberCard from "./MemberCard";
import AddMemberCard from "./AddMemberCard";
import MembersForm from "@/views/components/forms/startup/MembersForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/general/useMediaQuery";

// ✅ INTERFACE para el tipo de miembro
interface Member {
  id: string;
  nombre: string;
  nombres?: string;
  apellidos?: string;
  cargo: string;
  email: string;
  dni?: string;
  telefono?: string;
  linkedin?: string;
  biografia?: string;
  aceptado?: boolean;
  avatar?: string;
}

// ✅ INTERFACE simplificada sin props innecesarios
interface MembersListProps {
  startupId?: string;
}

export default function MembersList({ startupId }: MembersListProps) {
  // ✅ ESTADOS con tipos específicos
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 640px)");

  // ✅ LOGGING para debug
  console.log("🔍 MembersList - Props recibidas:");
  console.log("  - startupId:", startupId);
  console.log("  - members count:", members.length);

  // ✅ MIEMBRO en edición con tipo específico
  const editingMember: Member | undefined = editingMemberId
    ? members.find(m => m.id === editingMemberId)
    : undefined;

  // ✅ CARGAR miembros desde la API
  useEffect(() => {
    const fetchMembers = async () => {
      if (!startupId) {
        console.log("❌ MembersList - No hay startupId, no se pueden cargar miembros");
        setIsLoading(false);
        return;
      }

      console.log("🔄 MembersList - Cargando miembros para startup:", startupId);
      setIsLoading(true);

      try {
        const response = await fetch(`/api/startups/${startupId}/members`);
        const data = await response.json();

        console.log("📨 MembersList - Respuesta del servidor:", data);

        if (response.ok) {
          console.log("✅ MembersList - Miembros cargados exitosamente:", data.members.length);
          setMembers(data.members || []);
        } else {
          console.error("❌ MembersList - Error al cargar miembros:", data.error);
          setMembers([]);
        }
      } catch (error) {
        console.error("💥 MembersList - Error en la petición:", error);
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [startupId]);

  const handleAddMember = () => {
    console.log("➕ MembersList - handleAddMember");
    if (isMobile) {
      setEditingMemberId(null);
      setShowForm(true);
    } else {
      setEditingMemberId(null);
      setIsDialogOpen(true);
    }
  };

  const handleEditMember = (id: string) => {
    console.log("✏️ MembersList - handleEditMember:", id);
    if (isMobile) {
      setEditingMemberId(id);
      setShowForm(true);
    } else {
      setEditingMemberId(id);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteMember = (id: string) => {
    console.log("🗑️ MembersList - handleDeleteMember:", id);
    setMembers(members.filter(m => m.id !== id));
    // TODO: Aquí podrías agregar una llamada al endpoint DELETE en el futuro
  };

  const handleFormSubmit = (data: any) => {
    console.log("📝 MembersList - handleFormSubmit - Datos recibidos:", data);
    
    if (editingMemberId) {
      // ✅ ACTUALIZAR miembro existente (solo estado local por ahora)
      setMembers(members.map(m => 
        m.id === editingMemberId ? { 
          ...m, 
          // ✅ CAMPOS que coinciden con schema.prisma y endpoint
          nombre: `${data.nombres} ${data.apellidos}`, // Para MemberCard
          nombres: data.nombres,     // schema: nombres String
          apellidos: data.apellidos, // schema: apellidos String
          cargo: data.cargo,         // endpoint mapea: rol (schema) ↔ cargo (frontend)
          email: data.email,         // schema: email String
          dni: data.dni,             // schema: dni String
          telefono: data.telefono,   // schema: telefono String
          linkedin: data.linkedin,   // schema: linkedin String?
          biografia: data.biografia, // schema: biografia String?
          avatar: m.avatar || "",
        } : m
      ));
    } else {
      // ✅ AGREGAR nuevo miembro al estado local
      const newMember: Member = {
        id: data.id || `member-${Date.now()}`, // ID del servidor o temporal
        nombre: `${data.nombres} ${data.apellidos}`, // Para MemberCard
        nombres: data.nombres,     // schema: nombres String
        apellidos: data.apellidos, // schema: apellidos String
        cargo: data.cargo || data.rol, // endpoint mapea: rol (schema) ↔ cargo (frontend)
        email: data.email,         // schema: email String
        dni: data.dni,             // schema: dni String
        telefono: data.telefono,   // schema: telefono String
        linkedin: data.linkedin,   // schema: linkedin String?
        biografia: data.biografia, // schema: biografia String?
        aceptado: data.aceptado || false, // schema: aceptado Boolean @default(false)
        avatar: "",
      };
      
      console.log("✅ MembersList - Agregando nuevo miembro al estado:", newMember);
      setMembers([...members, newMember]);
    }
    
    setShowForm(false);
    setIsDialogOpen(false);
    setEditingMemberId(null);
  };

  // ✅ MOSTRAR loading
  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-bold">Integrantes del equipo</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
          <AddMemberCard onClick={handleAddMember} />
          <div className="text-center p-4 text-muted-foreground">
            Cargando miembros...
          </div>
        </div>
      </div>
    );
  }

  // ✅ FORMULARIO en modo móvil
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
          startupId={startupId}
        />
      </div>
    );
  }

  // ✅ LISTA de integrantes
  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-2xl font-bold">
          Integrantes del equipo
          {members.length > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              ({members.length} {members.length === 1 ? 'miembro' : 'miembros'})
            </span>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
        <AddMemberCard onClick={handleAddMember} />

        {members.length > 0 ? (
          members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={handleEditMember}
              onDelete={handleDeleteMember}
            />
          ))
        ) : (
          <div className="col-span-full text-center p-8 text-muted-foreground">
            <p className="text-lg mb-2">No hay miembros registrados</p>
            <p className="text-sm">Agrega el primer integrante de tu equipo</p>
          </div>
        )}
      </div>

      {/* ✅ DIALOG para desktop */}
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
              startupId={startupId}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}