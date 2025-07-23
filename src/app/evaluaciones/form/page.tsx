'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { localStorageManager } from '@/lib/ai/types';

export default function EvaluationForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("complejidad");
  const [formData, setFormData] = useState({
    startupName: "",
    complejidad: {
      casoReal: "",
      abordajePrevio: "",
      consecuencias: "",
      identificacionAfectados: ""
    },
    mercado: {
      tamanoMercado: "",
      validacionClientes: "",
      interesPago: "",
      segmentoInteres: ""
    },
    escalabilidad: {
      estrategiaAdquisicion: "",
      costoAdquisicion: "",
      facilidadExpansion: "",
      estrategiasProbadas: ""
    },
    equipo: {
      trayectoriaEquipo: "",
      experienciaRelevante: "",
      rolesResponsabilidades: "",
      superacionDesafios: ""
    }
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // Manejar cambio de pestaña
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Navegar a la siguiente pestaña
  const handleNext = () => {
    const tabs = ["complejidad", "mercado", "escalabilidad", "equipo"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  // Navegar a la pestaña anterior
  const handlePrevious = () => {
    const tabs = ["complejidad", "mercado", "escalabilidad", "equipo"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // Enviar el formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startupName) {
      alert("Por favor, ingresa el nombre de tu startup");
      return;
    }
    
    // Guardar en localStorage
    try {
      const startupId = localStorageManager.saveResponses(formData);
      
      // Redireccionar a la página de evaluación
      router.push(`/evaluaciones/result?id=${startupId}`);
    } catch (error) {
      console.error("Error al guardar las respuestas:", error);
      alert("Ocurrió un error al guardar tus respuestas. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Impacto de tu Startup</h1>
      <p className="text-center mb-8">Cuéntanos sobre el problema que resuelves y el impacto que generarás</p>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nombre de la Startup</CardTitle>
            <CardDescription>¿Cómo se llama tu startup?</CardDescription>
          </CardHeader>
          <CardContent>
            <Input 
              placeholder="Mi Startup"
              value={formData.startupName}
              onChange={(e) => setFormData(prev => ({ ...prev, startupName: e.target.value }))}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="complejidad">Complejidad</TabsTrigger>
            <TabsTrigger value="mercado">Mercado</TabsTrigger>
            <TabsTrigger value="escalabilidad">Escalabilidad</TabsTrigger>
            <TabsTrigger value="equipo">Equipo</TabsTrigger>
          </TabsList>
          
          {/* Pestaña de Complejidad */}
          <TabsContent value="complejidad">
            <Card>
              <CardHeader>
                <CardTitle>Nivel de complejidad de la situación</CardTitle>
                <CardDescription>Estas preguntas buscan entender qué tan relevante es el problema que tu startup resuelve.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="casoReal">Cuéntanos sobre un caso real y reciente</Label>
                  <Textarea 
                    id="casoReal"
                    placeholder="Describe un ejemplo concreto de una persona o empresa que haya enfrentado el problema que ustedes resuelven."
                    value={formData.complejidad.casoReal}
                    onChange={(e) => handleChange("complejidad", "casoReal", e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="abordajePrevio">¿Cómo abordaban el problema antes?</Label>
                  <Textarea 
                    id="abordajePrevio"
                    placeholder="Antes de conocer tu propuesta, ¿qué métodos utilizaban para manejar esta situación?"
                    value={formData.complejidad.abordajePrevio}
                    onChange={(e) => handleChange("complejidad", "abordajePrevio", e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="consecuencias">Consecuencias del problema</Label>
                  <Textarea 
                    id="consecuencias"
                    placeholder="¿Qué impacto negativo experimentaban al no tener una solución efectiva?"
                    value={formData.complejidad.consecuencias}
                    onChange={(e) => handleChange("complejidad", "consecuencias", e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="identificacionAfectados">Identificación de afectados</Label>
                  <Textarea 
                    id="identificacionAfectados"
                    placeholder="¿Cuántas personas o empresas conoces que hayan enfrentado situaciones similares?"
                    value={formData.complejidad.identificacionAfectados}
                    onChange={(e) => handleChange("complejidad", "identificacionAfectados", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" onClick={handleNext}>Siguiente</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Pestaña de Mercado */}
          <TabsContent value="mercado">
            <Card>
              <CardHeader>
                <CardTitle>Tamaño de mercado</CardTitle>
                <CardDescription>Aquí nos interesa comprender el potencial de crecimiento de tu startup.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tamanoMercado">Estima el tamaño de tu mercado</Label>
                  <Textarea 
                    id="tamanoMercado"
                    placeholder="¿Cuántas personas o empresas crees que enfrentan este problema hoy?"
                    value={formData.mercado.tamanoMercado}
                    onChange={(e) => handleChange("mercado", "tamanoMercado", e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="validacionClientes">Validación con potenciales clientes</Label>
                  <Textarea 
                    id="validacionClientes"
                    placeholder="¿Con cuántos potenciales clientes han conversado sobre este problema?"
                    value={formData.mercado.validacionClientes}
                    onChange={(e) => handleChange("mercado", "validacionClientes", e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interesPago">Interés en pagar por la solución</Label>
                  <Textarea 
                    id="interesPago"
                    placeholder="¿Cuántos expresaron claramente su disposición a pagar por una solución?"
                    value={formData.mercado.interesPago}
                    onChange={(e) => handleChange("mercado", "interesPago", e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="segmentoInteres">Segmento de mayor interés</Label>
                  <Textarea 
                    id="segmentoInteres"
                    placeholder="¿Qué tipo de clientes ha mostrado mayor interés en tu propuesta?"
                    value={formData.mercado.segmentoInteres}
                    onChange={(e) => handleChange("mercado", "segmentoInteres", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>Anterior</Button>
                <Button type="button" onClick={handleNext}>Siguiente</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Pestaña de Escalabilidad */}
          <TabsContent value="escalabilidad">
            <Card>
              <CardHeader>
                <CardTitle>Potencial de escalar</CardTitle>
                <CardDescription>Queremos entender cómo tu startup crecerá y llegará a más clientes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="estrategiaAdquisicion">Estrategia de adquisición de clientes</Label>
                  <Textarea 
                    id="estrategiaAdquisicion"
                    placeholder="¿Cómo planean conseguir a sus primeros clientes?"
                    value={formData.escalabilidad.estrategiaAdquisicion}
                    onChange={(e) => handleChange("escalabilidad", "estrategiaAdquisicion", e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="costoAdquisicion">Costo de adquisición (CAC)</Label>
                  <Textarea 
                    id="costoAdquisicion"
                    placeholder="¿Cuánto les costará adquirir un cliente, en dinero y tiempo?"
                    value={formData.escalabilidad.costoAdquisicion}
                    onChange={(e) => handleChange("escalabilidad", "costoAdquisicion", e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facilidadExpansion">Facilidad de expansión</Label>
                  <Textarea 
                    id="facilidadExpansion"
                    placeholder="¿Qué tan viable es multiplicar tu base de clientes sin que los costos crezcan al mismo ritmo?"
                    value={formData.escalabilidad.facilidadExpansion}
                    onChange={(e) => handleChange("escalabilidad", "facilidadExpansion", e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estrategiasProbadas">Estrategias de escalabilidad probadas</Label>
                  <Textarea 
                    id="estrategiasProbadas"
                    placeholder="¿Han experimentado ya con alguna estrategia para escalar su operación?"
                    value={formData.escalabilidad.estrategiasProbadas}
                    onChange={(e) => handleChange("escalabilidad", "estrategiasProbadas", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>Anterior</Button>
                <Button type="button" onClick={handleNext}>Siguiente</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Pestaña de Equipo */}
          <TabsContent value="equipo">
            <Card>
              <CardHeader>
                <CardTitle>Equipo emprendedor</CardTitle>
                <CardDescription>El equipo es uno de los pilares más importantes de una startup.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="trayectoriaEquipo">Trayectoria del equipo</Label>
                  <Textarea 
                    id="trayectoriaEquipo"
                    placeholder="¿Cuánto tiempo llevan trabajando juntos en este proyecto?"
                    value={formData.equipo.trayectoriaEquipo}
                    onChange={(e) => handleChange("equipo", "trayectoriaEquipo", e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experienciaRelevante">Experiencia relevante</Label>
                  <Textarea 
                    id="experienciaRelevante"
                    placeholder="¿Qué experiencia tienen en el sector de su startup?"
                    value={formData.equipo.experienciaRelevante}
                    onChange={(e) => handleChange("equipo", "experienciaRelevante", e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rolesResponsabilidades">Roles y responsabilidades</Label>
                  <Textarea 
                    id="rolesResponsabilidades"
                    placeholder="¿Cómo distribuyen las responsabilidades dentro del equipo?"
                    value={formData.equipo.rolesResponsabilidades}
                    onChange={(e) => handleChange("equipo", "rolesResponsabilidades", e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="superacionDesafios">Superación de desafíos</Label>
                  <Textarea 
                    id="superacionDesafios"
                    placeholder="Cuéntanos una situación difícil que hayan superado como equipo."
                    value={formData.equipo.superacionDesafios}
                    onChange={(e) => handleChange("equipo", "superacionDesafios", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>Anterior</Button>
                <Button type="submit" variant="default">Evaluar startup</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
} 