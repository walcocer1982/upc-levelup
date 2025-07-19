"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  FileText,
  Target,
  Users,
  Settings
} from "lucide-react";
import { TipoConvocatoria, EstadoConvocatoria } from "@/data/mock/convocatorias";
import Link from "next/link";

interface Criterio {
  id: string;
  nombre: string;
  descripcion: string;
  peso: number;
  tipo: 'complejidad' | 'mercado' | 'escalabilidad' | 'equipo';
  requerido: boolean;
  puntajeMinimo: number;
  puntajeMaximo: number;
  rubricas: {
    nivel: number;
    descripcion: string;
    puntaje: number;
  }[];
}

interface ConvocatoriaFormData {
  titulo: string;
  descripcion: string;
  tipo: TipoConvocatoria;
  estado: EstadoConvocatoria;
  fechaInicio: string;
  fechaFin: string;
  criterios: Criterio[];
}

const criteriosDefault: Criterio[] = [
  {
    id: 'temp-1',
    nombre: 'Complejidad del Problema',
    descripcion: 'Evaluación de qué tan complejo y significativo es el problema que resuelve',
    peso: 25,
    tipo: 'complejidad',
    requerido: true,
    puntajeMinimo: 1,
    puntajeMaximo: 4,
    rubricas: [
      { nivel: 1, descripcion: 'Problema simple y bien definido', puntaje: 1 },
      { nivel: 2, descripcion: 'Problema moderadamente complejo', puntaje: 2 },
      { nivel: 3, descripcion: 'Problema complejo con múltiples variables', puntaje: 3 },
      { nivel: 4, descripcion: 'Problema altamente complejo e innovador', puntaje: 4 },
    ]
  },
  {
    id: 'temp-2',
    nombre: 'Tamaño y Validación de Mercado',
    descripcion: 'Evaluación del tamaño del mercado y validación con clientes potenciales',
    peso: 25,
    tipo: 'mercado',
    requerido: true,
    puntajeMinimo: 1,
    puntajeMaximo: 4,
    rubricas: [
      { nivel: 1, descripcion: 'Mercado pequeño sin validación', puntaje: 1 },
      { nivel: 2, descripcion: 'Mercado mediano con validación inicial', puntaje: 2 },
      { nivel: 3, descripcion: 'Mercado grande con validación sólida', puntaje: 3 },
      { nivel: 4, descripcion: 'Mercado masivo con validación completa', puntaje: 4 },
    ]
  },
  {
    id: 'temp-3',
    nombre: 'Potencial de Escalabilidad',
    descripcion: 'Evaluación de la capacidad de la startup para crecer de manera eficiente',
    peso: 25,
    tipo: 'escalabilidad',
    requerido: true,
    puntajeMinimo: 1,
    puntajeMaximo: 4,
    rubricas: [
      { nivel: 1, descripcion: 'Escalabilidad limitada', puntaje: 1 },
      { nivel: 2, descripcion: 'Escalabilidad moderada', puntaje: 2 },
      { nivel: 3, descripcion: 'Alto potencial de escalabilidad', puntaje: 3 },
      { nivel: 4, descripcion: 'Escalabilidad exponencial', puntaje: 4 },
    ]
  },
  {
    id: 'temp-4',
    nombre: 'Capacidades del Equipo',
    descripcion: 'Evaluación de la experiencia y capacidades del equipo emprendedor',
    peso: 25,
    tipo: 'equipo',
    requerido: true,
    puntajeMinimo: 1,
    puntajeMaximo: 4,
    rubricas: [
      { nivel: 1, descripcion: 'Equipo básico sin experiencia', puntaje: 1 },
      { nivel: 2, descripcion: 'Equipo con experiencia moderada', puntaje: 2 },
      { nivel: 3, descripcion: 'Equipo experimentado y complementario', puntaje: 3 },
      { nivel: 4, descripcion: 'Equipo de clase mundial', puntaje: 4 },
    ]
  },
];

export default function NuevaConvocatoriaPage() {
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
  const [activeTab, setActiveTab] = useState("basica");

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
      console.log("Guardando convocatoria:", formData);
    }
  };

  const updateCriterio = (index: number, field: string, value: any) => {
    const newCriterios = [...formData.criterios];
    newCriterios[index] = { ...newCriterios[index], [field]: value };
    setFormData({ ...formData, criterios: newCriterios });
  };

  const updateRubrica = (criterioIndex: number, rubricaIndex: number, field: string, value: any) => {
    const newCriterios = [...formData.criterios];
    newCriterios[criterioIndex].rubricas[rubricaIndex] = {
      ...newCriterios[criterioIndex].rubricas[rubricaIndex],
      [field]: value
    };
    setFormData({ ...formData, criterios: newCriterios });
  };

  const addCriterio = () => {
    const newCriterio: Criterio = {
      id: `temp-${Date.now()}`,
      nombre: "",
      descripcion: "",
      peso: 25,
      tipo: 'complejidad',
      requerido: true,
      puntajeMinimo: 1,
      puntajeMaximo: 4,
      rubricas: [
        { nivel: 1, descripcion: "", puntaje: 1 },
        { nivel: 2, descripcion: "", puntaje: 2 },
        { nivel: 3, descripcion: "", puntaje: 3 },
        { nivel: 4, descripcion: "", puntaje: 4 },
      ]
    };
    setFormData({
      ...formData,
      criterios: [...formData.criterios, newCriterio],
    });
  };

  const removeCriterio = (index: number) => {
    if (formData.criterios.length > 1) {
      const newCriterios = formData.criterios.filter((_, i) => i !== index);
      setFormData({ ...formData, criterios: newCriterios });
    }
  };

  const totalPeso = formData.criterios.reduce((sum, c) => sum + c.peso, 0);
  const isFormValid = Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/convocatorias">
                <Button variant="outline" size="sm">
                  <ArrowLeft size={16} className="mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Nueva Convocatoria</h1>
                <p className="text-muted-foreground">
                  Crea una nueva convocatoria para startups
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => console.log("Guardar borrador")}>
                <Save size={16} className="mr-2" />
                Guardar Borrador
              </Button>
              <Button onClick={handleSave} disabled={!isFormValid}>
                <CheckCircle size={16} className="mr-2" />
                Publicar Convocatoria
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Contenido Principal */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basica" className="flex items-center gap-2">
                  <FileText size={16} />
                  Básica
                </TabsTrigger>
                <TabsTrigger value="criterios" className="flex items-center gap-2">
                  <Target size={16} />
                  Criterios
                </TabsTrigger>
                <TabsTrigger value="configuracion" className="flex items-center gap-2">
                  <Settings size={16} />
                  Configuración
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye size={16} />
                  Vista Previa
                </TabsTrigger>
              </TabsList>

              {/* Tab: Información Básica */}
              <TabsContent value="basica" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText size={20} />
                      Información Básica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                      <div className="xl:col-span-2">
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
                    </div>

                    <div>
                      <Label htmlFor="descripcion">Descripción *</Label>
                      <Textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        placeholder="Describe el programa, sus objetivos, beneficios para las startups..."
                        rows={6}
                        className={errors.descripcion ? "border-red-500" : ""}
                      />
                      {errors.descripcion && <p className="text-sm text-red-500 mt-1">{errors.descripcion}</p>}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              </TabsContent>

              {/* Tab: Criterios */}
              <TabsContent value="criterios" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Target size={20} />
                        Criterios de Evaluación
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <Badge variant={totalPeso === 100 ? "default" : "destructive"} className="text-sm px-3 py-1">
                          Peso Total: {totalPeso}%
                        </Badge>
                        <Button type="button" variant="outline" onClick={addCriterio}>
                          <Plus size={16} className="mr-2" />
                          Agregar Criterio
                        </Button>
                      </div>
                    </div>
                    {errors.criterios && <p className="text-sm text-red-500 mt-2">{errors.criterios}</p>}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {formData.criterios.map((criterio, index) => (
                        <div key={criterio.id} className="border rounded-lg p-6">
                          <div className="flex justify-between items-start mb-6">
                            <h3 className="text-lg font-semibold">Criterio {index + 1}</h3>
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
                              placeholder="Describe el criterio y qué se evaluará..."
                              rows={3}
                            />
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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

                          <Separator className="my-6" />

                          <div>
                            <h4 className="font-medium mb-4">Rúbrica de Evaluación</h4>
                            <div className="space-y-4">
                              {criterio.rubricas.map((rubrica, rubricaIndex) => (
                                <div key={rubricaIndex} className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                                  <div>
                                    <Label>Nivel {rubrica.nivel}</Label>
                                    <Input
                                      type="number"
                                      value={rubrica.puntaje}
                                      onChange={(e) => updateRubrica(index, rubricaIndex, "puntaje", parseInt(e.target.value) || 1)}
                                      className="w-20"
                                    />
                                  </div>
                                  <div className="lg:col-span-3">
                                    <Label>Descripción</Label>
                                    <Input
                                      value={rubrica.descripcion}
                                      onChange={(e) => updateRubrica(index, rubricaIndex, "descripcion", e.target.value)}
                                      placeholder={`Descripción para nivel ${rubrica.nivel}`}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Configuración */}
              <TabsContent value="configuracion" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings size={20} />
                      Configuración Avanzada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Configuraciones adicionales para la convocatoria.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Vista Previa */}
              <TabsContent value="preview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye size={20} />
                      Vista Previa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold">{formData.titulo || "Título de la Convocatoria"}</h2>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{formData.tipo}</Badge>
                          <Badge>{formData.estado}</Badge>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Descripción</h3>
                        <p className="text-muted-foreground">
                          {formData.descripcion || "Descripción de la convocatoria..."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">Fechas</h3>
                          <p className="text-sm text-muted-foreground">
                            {formData.fechaInicio && formData.fechaFin 
                              ? `${formData.fechaInicio} - ${formData.fechaFin}`
                              : "Fechas no definidas"
                            }
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Criterios</h3>
                          <p className="text-sm text-muted-foreground">
                            {formData.criterios.length} criterios de evaluación
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Panel Lateral */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Resumen */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Criterios:</span>
                    <span className="font-medium">{formData.criterios.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Peso Total:</span>
                    <span className={`font-medium ${totalPeso === 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalPeso}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estado:</span>
                    <Badge variant="outline">{formData.estado}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Validación */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Validación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    {formData.titulo ? <CheckCircle size={16} className="text-green-600" /> : <AlertCircle size={16} className="text-red-600" />}
                    <span className="text-sm">Título</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.descripcion ? <CheckCircle size={16} className="text-green-600" /> : <AlertCircle size={16} className="text-red-600" />}
                    <span className="text-sm">Descripción</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.fechaInicio && formData.fechaFin ? <CheckCircle size={16} className="text-green-600" /> : <AlertCircle size={16} className="text-red-600" />}
                    <span className="text-sm">Fechas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {totalPeso === 100 ? <CheckCircle size={16} className="text-green-600" /> : <AlertCircle size={16} className="text-red-600" />}
                    <span className="text-sm">Peso de criterios</span>
                  </div>
                </CardContent>
              </Card>

              {/* Acciones Rápidas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Save size={16} className="mr-2" />
                    Guardar Borrador
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye size={16} className="mr-2" />
                    Vista Previa
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText size={16} className="mr-2" />
                    Duplicar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
