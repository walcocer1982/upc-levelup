"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, X, Trash2 } from "lucide-react";
import { TipoConvocatoria, EstadoConvocatoria } from "@/data/mock/convocatorias";

interface ConvocatoriaFormData {
  titulo: string;
  descripcion: string;
  tipo: TipoConvocatoria;
  estado: EstadoConvocatoria;
  fechaInicio: string;
  fechaFin: string;
  criterios: {
    id: string;
    nombre: string;
    descripcion: string;
    peso: number;
    tipo: 'complejidad' | 'mercado' | 'escalabilidad' | 'equipo';
    requerido: boolean;
    puntajeMinimo: number;
    puntajeMaximo: number;
  }[];
}

interface ConvocatoriaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  convocatoria?: any; // Para edición
  onSave: (data: ConvocatoriaFormData) => void;
}

const criteriosDefault = [
  {
    id: 'temp-1',
    nombre: 'Complejidad del Problema',
    descripcion: 'Evaluación de qué tan complejo y significativo es el problema que resuelve',
    peso: 25,
    tipo: 'complejidad' as const,
    requerido: true,
    puntajeMinimo: 1,
    puntajeMaximo: 4,
  },
  {
    id: 'temp-2',
    nombre: 'Tamaño y Validación de Mercado',
    descripcion: 'Evaluación del tamaño del mercado y validación con clientes potenciales',
    peso: 25,
    tipo: 'mercado' as const,
    requerido: true,
    puntajeMinimo: 1,
    puntajeMaximo: 4,
  },
  {
    id: 'temp-3',
    nombre: 'Potencial de Escalabilidad',
    descripcion: 'Evaluación de la capacidad de la startup para crecer de manera eficiente',
    peso: 25,
    tipo: 'escalabilidad' as const,
    requerido: true,
    puntajeMinimo: 1,
    puntajeMaximo: 4,
  },
  {
    id: 'temp-4',
    nombre: 'Capacidades del Equipo',
    descripcion: 'Evaluación de la experiencia y capacidades del equipo emprendedor',
    peso: 25,
    tipo: 'equipo' as const,
    requerido: true,
    puntajeMinimo: 1,
    puntajeMaximo: 4,
  },
];

export default function ConvocatoriaFormModal({ isOpen, onClose, convocatoria, onSave }: ConvocatoriaFormModalProps) {
  const [formData, setFormData] = useState<ConvocatoriaFormData>({
    titulo: "",
    descripcion: "",
    tipo: TipoConvocatoria.INQUBALAB,
    estado: EstadoConvocatoria.BORRADOR,
    fechaInicio: "",
    fechaFin: "",
    criterios: [...criteriosDefault],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos si es edición
  useEffect(() => {
    if (convocatoria && isOpen) {
      setFormData({
        titulo: convocatoria.titulo,
        descripcion: convocatoria.descripcion,
        tipo: convocatoria.tipo,
        estado: convocatoria.estado,
        fechaInicio: convocatoria.fechaInicio.toISOString().split('T')[0],
        fechaFin: convocatoria.fechaFin.toISOString().split('T')[0],
        criterios: convocatoria.criterios.map((c: any) => ({
          ...c,
          id: c.id.startsWith('temp-') ? c.id : `temp-${c.id}`,
        })),
      });
    } else if (isOpen) {
      // Reset para nueva convocatoria
      setFormData({
        titulo: "",
        descripcion: "",
        tipo: TipoConvocatoria.INQUBALAB,
        estado: EstadoConvocatoria.BORRADOR,
        fechaInicio: "",
        fechaFin: "",
        criterios: [...criteriosDefault],
      });
    }
  }, [convocatoria, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = "La fecha de inicio es requerida";
    }

    if (!formData.fechaFin) {
      newErrors.fechaFin = "La fecha de fin es requerida";
    }

    if (formData.fechaInicio && formData.fechaFin && formData.fechaInicio >= formData.fechaFin) {
      newErrors.fechaFin = "La fecha de fin debe ser posterior a la fecha de inicio";
    }

    const totalPeso = formData.criterios.reduce((sum, c) => sum + c.peso, 0);
    if (totalPeso !== 100) {
      newErrors.criterios = `El peso total debe ser 100% (actual: ${totalPeso}%)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const updateCriterio = (index: number, field: string, value: any) => {
    const newCriterios = [...formData.criterios];
    newCriterios[index] = { ...newCriterios[index], [field]: value };
    setFormData({ ...formData, criterios: newCriterios });
  };

  const removeCriterio = (index: number) => {
    if (formData.criterios.length > 1) {
      const newCriterios = formData.criterios.filter((_, i) => i !== index);
      setFormData({ ...formData, criterios: newCriterios });
    }
  };

  const addCriterio = () => {
    const newCriterio = {
      id: `temp-${Date.now()}`,
      nombre: "",
      descripcion: "",
      peso: 25,
      tipo: 'complejidad' as const,
      requerido: true,
      puntajeMinimo: 1,
      puntajeMaximo: 4,
    };
    setFormData({
      ...formData,
      criterios: [...formData.criterios, newCriterio],
    });
  };

  const totalPeso = formData.criterios.reduce((sum, c) => sum + c.peso, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] w-[98vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl">
            {convocatoria ? "Editar Convocatoria" : "Nueva Convocatoria"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Información básica */}
          <Card className="p-6">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ej: Inqubalab 2024 - Primera Edición"
                    className={errors.titulo ? "border-red-500" : ""}
                  />
                  {errors.titulo && <p className="text-sm text-red-500 mt-1">{errors.titulo}</p>}
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select value={formData.tipo} onValueChange={(value: TipoConvocatoria) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TipoConvocatoria.INQUBALAB}>Inqubalab</SelectItem>
                      <SelectItem value={TipoConvocatoria.ACELERACION}>Aceleración</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="estado">Estado *</Label>
                  <Select value={formData.estado} onValueChange={(value: EstadoConvocatoria) => setFormData({ ...formData, estado: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EstadoConvocatoria.BORRADOR}>Borrador</SelectItem>
                      <SelectItem value={EstadoConvocatoria.ABIERTA}>Abierta</SelectItem>
                      <SelectItem value={EstadoConvocatoria.CERRADA}>Cerrada</SelectItem>
                      <SelectItem value={EstadoConvocatoria.EN_EVALUACION}>En Evaluación</SelectItem>
                      <SelectItem value={EstadoConvocatoria.FINALIZADA}>Finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe el programa y sus objetivos..."
                  rows={4}
                  className={errors.descripcion ? "border-red-500" : ""}
                />
                {errors.descripcion && <p className="text-sm text-red-500 mt-1">{errors.descripcion}</p>}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    className={errors.fechaInicio ? "border-red-500" : ""}
                  />
                  {errors.fechaInicio && <p className="text-sm text-red-500 mt-1">{errors.fechaInicio}</p>}
                </div>

                <div>
                  <Label htmlFor="fechaFin">Fecha de Fin *</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={formData.fechaFin}
                    onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                    className={errors.fechaFin ? "border-red-500" : ""}
                  />
                  {errors.fechaFin && <p className="text-sm text-red-500 mt-1">{errors.fechaFin}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Criterios */}
          <Card className="p-6">
            <CardHeader className="pb-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Criterios de Evaluación</CardTitle>
                <div className="flex items-center gap-3">
                  <Badge variant={totalPeso === 100 ? "default" : "destructive"} className="text-sm px-3 py-1">
                    Peso Total: {totalPeso}%
                  </Badge>
                  <Button type="button" variant="outline" size="sm" onClick={addCriterio} className="px-4">
                    <Plus size={16} className="mr-2" />
                    Agregar Criterio
                  </Button>
                </div>
              </div>
              {errors.criterios && <p className="text-sm text-red-500 mt-2">{errors.criterios}</p>}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {formData.criterios.map((criterio, index) => (
                  <div key={criterio.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Criterio {index + 1}</h4>
                      {formData.criterios.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCriterio(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                      <div>
                        <Label>Nombre</Label>
                        <Input
                          value={criterio.nombre}
                          onChange={(e) => updateCriterio(index, "nombre", e.target.value)}
                          placeholder="Ej: Complejidad del Problema"
                        />
                      </div>

                      <div>
                        <Label>Tipo</Label>
                        <Select
                          value={criterio.tipo}
                          onValueChange={(value: any) => updateCriterio(index, "tipo", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="complejidad">Complejidad</SelectItem>
                            <SelectItem value="mercado">Mercado</SelectItem>
                            <SelectItem value="escalabilidad">Escalabilidad</SelectItem>
                            <SelectItem value="equipo">Equipo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Peso (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={criterio.peso}
                          onChange={(e) => updateCriterio(index, "peso", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <Label>Descripción</Label>
                      <Textarea
                        value={criterio.descripcion}
                        onChange={(e) => updateCriterio(index, "descripcion", e.target.value)}
                        placeholder="Describe el criterio..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <Label>Puntaje Mínimo</Label>
                        <Input
                          type="number"
                          min="1"
                          value={criterio.puntajeMinimo}
                          onChange={(e) => updateCriterio(index, "puntajeMinimo", parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div>
                        <Label>Puntaje Máximo</Label>
                        <Input
                          type="number"
                          min="1"
                          value={criterio.puntajeMaximo}
                          onChange={(e) => updateCriterio(index, "puntajeMaximo", parseInt(e.target.value) || 4)}
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`requerido-${index}`}
                          checked={criterio.requerido}
                          onChange={(e) => updateCriterio(index, "requerido", e.target.checked)}
                          className="mr-2"
                        />
                        <Label htmlFor={`requerido-${index}`}>Requerido</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="pt-6 border-t">
          <Button variant="outline" onClick={onClose} className="px-6">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="px-6">
            {convocatoria ? "Actualizar" : "Crear"} Convocatoria
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 