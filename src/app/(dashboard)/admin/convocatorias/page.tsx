"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Trash2, Filter, Calendar, Users, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMockData } from "@/data/mock";
import DeleteConfirmDialog from "@/components/modals/DeleteConfirmDialog";
import Link from "next/link";

interface Convocatoria {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  estado: "borrador" | "abierta" | "cerrada" | "en_evaluacion" | "finalizada";
  fechaInicio: string;
  fechaFin: string;
  creadoPor: string;
  criterios: number;
  postulaciones: number;
}

// Usar datos mock centralizados
const mockConvocatorias: Convocatoria[] = getMockData.getAllConvocatorias().map(conv => {
  const postulaciones = getMockData.getPostulacionesByConvocatoria(conv.id);
  const creador = getMockData.getUserById(conv.creadoPorId);
  
  return {
    id: conv.id,
    titulo: conv.titulo,
    descripcion: conv.descripcion,
    tipo: conv.tipo,
    estado: conv.estado,
    fechaInicio: conv.fechaInicio.toISOString().split('T')[0],
    fechaFin: conv.fechaFin.toISOString().split('T')[0],
    creadoPor: creador?.nombres + " " + creador?.apellidos || "Admin",
    criterios: conv.criterios.length,
    postulaciones: postulaciones.length
  };
});

export default function AdminConvocatoriasPage() {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>(mockConvocatorias);
  const [filteredConvocatorias, setFilteredConvocatorias] = useState<Convocatoria[]>(mockConvocatorias);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todas");
  const [estadoFilter, setEstadoFilter] = useState("todas");
  
  // Estados para modales
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState<Convocatoria | null>(null);

  // Filtrar convocatorias
  useEffect(() => {
    let filtered = convocatorias;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(conv =>
        conv.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo
    if (tipoFilter !== "todas") {
      filtered = filtered.filter(conv => conv.tipo === tipoFilter);
    }

    // Filtro por estado
    if (estadoFilter !== "todas") {
      filtered = filtered.filter(conv => conv.estado === estadoFilter);
    }

    setFilteredConvocatorias(filtered);
  }, [convocatorias, searchTerm, tipoFilter, estadoFilter]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "abierta":
        return "bg-green-100 text-green-800";
      case "en_evaluacion":
        return "bg-blue-100 text-blue-800";
      case "finalizada":
        return "bg-gray-100 text-gray-800";
      case "cerrada":
        return "bg-red-100 text-red-800";
      case "borrador":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Inqubalab":
        return "bg-purple-100 text-purple-800";
      case "Aceleración":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case "abierta":
        return "Abierta";
      case "en_evaluacion":
        return "En Evaluación";
      case "finalizada":
        return "Finalizada";
      case "cerrada":
        return "Cerrada";
      case "borrador":
        return "Borrador";
      default:
        return estado;
    }
  };

  // Funciones para manejar modales
  const handleDeleteConvocatoria = (convocatoria: Convocatoria) => {
    setSelectedConvocatoria(convocatoria);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedConvocatoria) {
      const updatedConvocatorias = convocatorias.filter(conv => conv.id !== selectedConvocatoria.id);
      setConvocatorias(updatedConvocatorias);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestionar Convocatorias</h1>
          <p className="text-muted-foreground">
            Administra todas las convocatorias del sistema
          </p>
        </div>
        <Link href="/admin/convocatorias/nueva">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Nueva Convocatoria
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Buscar convocatoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos los tipos</SelectItem>
                <SelectItem value="Inqubalab">Inqubalab</SelectItem>
                <SelectItem value="Aceleración">Aceleración</SelectItem>
              </SelectContent>
            </Select>

            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos los estados</SelectItem>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="abierta">Abierta</SelectItem>
                <SelectItem value="en_evaluacion">En Evaluación</SelectItem>
                <SelectItem value="cerrada">Cerrada</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setTipoFilter("todas");
              setEstadoFilter("todas");
            }}>
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{convocatorias.length}</div>
            <div className="text-sm text-muted-foreground">Total de Convocatorias</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {convocatorias.filter(c => c.estado === "abierta" || c.estado === "en_evaluacion").length}
            </div>
            <div className="text-sm text-muted-foreground">Activas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {convocatorias.filter(c => c.estado === "en_evaluacion").length}
            </div>
            <div className="text-sm text-muted-foreground">En Evaluación</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {convocatorias.filter(c => c.estado === "finalizada").length}
            </div>
            <div className="text-sm text-muted-foreground">Finalizadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Convocatorias */}
      <Card>
        <CardHeader>
          <CardTitle>Convocatorias ({filteredConvocatorias.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredConvocatorias.map((convocatoria) => (
              <div key={convocatoria.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{convocatoria.titulo}</h3>
                    <Badge className={getEstadoColor(convocatoria.estado)}>
                      {getEstadoText(convocatoria.estado)}
                    </Badge>
                    <Badge variant="outline" className={getTipoColor(convocatoria.tipo)}>
                      {convocatoria.tipo}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{convocatoria.descripcion}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {convocatoria.fechaInicio} - {convocatoria.fechaFin}
                    </span>
                    <span>•</span>
                    <span>Creado por: {convocatoria.creadoPor}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FileText size={14} />
                      {convocatoria.criterios} criterios
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {convocatoria.postulaciones} postulaciones
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/convocatorias/ver/${convocatoria.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      <Eye size={16} className="mr-2" />
                      Ver
                    </Button>
                  </Link>
                  <Link href={`/admin/convocatorias/editar/${convocatoria.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      <Edit size={16} className="mr-2" />
                      Editar
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteConvocatoria(convocatoria)}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modales */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Convocatoria"
        description="Esta acción eliminará permanentemente la convocatoria y todos sus datos asociados."
        itemName={selectedConvocatoria?.titulo || ""}
        hasAssociatedData={(selectedConvocatoria?.postulaciones ?? 0) > 0}
        associatedDataCount={selectedConvocatoria?.postulaciones ?? 0}
        associatedDataType="postulaciones"
      />
    </div>
  );
} 