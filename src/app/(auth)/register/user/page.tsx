"use client";

import { useState } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
// Importa desde la ruta correcta
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function UserRegistrationPage() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const userEmail = session?.user?.email || "usuario@ejemplo.com";
  
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    correoLaureate: "",
    politicaPrivacidad: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, politicaPrivacidad: checked }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombres) newErrors.nombres = "Los nombres son obligatorios";
    if (!formData.apellidos) newErrors.apellidos = "Los apellidos son obligatorios";
    if (!formData.dni) {
      newErrors.dni = "El DNI es obligatorio";
    } else if (formData.dni.length < 8 || !/^\d+$/.test(formData.dni)) {
      newErrors.dni = "El DNI debe tener al menos 8 dígitos numéricos";
    }
    
    if (!formData.telefono) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (formData.telefono.length < 9 || !/^\d+$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener al menos 9 dígitos numéricos";
    }
    
    if (formData.correoLaureate && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoLaureate)) {
      newErrors.correoLaureate = "El correo debe ser válido";
    }
    
    if (!formData.politicaPrivacidad) {
      newErrors.politicaPrivacidad = "Debes aceptar la política de privacidad";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      console.log({
        email: userEmail,
        ...formData
      });
      
      setTimeout(() => {
        setIsSubmitting(false);
        alert("Usuario registrado con éxito");
      }, 1500);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Completa tu información</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Para finalizar tu registro necesitamos algunos datos adicionales
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="mb-6">
            <Label>Correo electrónico</Label>
            <Input
              value={userEmail}
              disabled
              className="bg-muted mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Este correo fue proporcionado por tu autenticación con Google
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres</Label>
              <Input
                id="nombres"
                name="nombres"
                placeholder="Ingresa tus nombres"
                value={formData.nombres}
                onChange={handleChange}
              />
              {errors.nombres && <p className="text-sm text-red-500">{errors.nombres}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apellidos">Apellidos</Label>
              <Input
                id="apellidos"
                name="apellidos"
                placeholder="Ingresa tus apellidos"
                value={formData.apellidos}
                onChange={handleChange}
              />
              {errors.apellidos && <p className="text-sm text-red-500">{errors.apellidos}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                name="dni"
                placeholder="Ingresa tu número de DNI"
                value={formData.dni}
                onChange={handleChange}
                maxLength={8}
              />
              {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono celular</Label>
              <Input
                id="telefono"
                name="telefono"
                placeholder="Ej: 999888777"
                value={formData.telefono}
                onChange={handleChange}
                maxLength={9}
              />
              {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="correoLaureate">Correo Laureate (opcional)</Label>
              <Input
                id="correoLaureate"
                name="correoLaureate"
                type="email"
                placeholder="usuario@laureate.edu"
                value={formData.correoLaureate}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Si eres parte de la comunidad Laureate, ingresa tu correo institucional
              </p>
              {errors.correoLaureate && <p className="text-sm text-red-500">{errors.correoLaureate}</p>}
            </div>
            
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
              <Checkbox
                id="politicaPrivacidad"
                checked={formData.politicaPrivacidad}
                onCheckedChange={handleCheckboxChange}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="politicaPrivacidad">
                  Acepto la política de privacidad
                </Label>
                <p className="text-sm text-muted-foreground">
                  Al marcar esta casilla, aceptas nuestra{" "}
                  <a
                    href="/politica-privacidad"
                    className="text-primary underline"
                    target="_blank"
                  >
                    política de privacidad
                  </a>
                  .
                </p>
              </div>
            </div>
            {errors.politicaPrivacidad && <p className="text-sm text-red-500">{errors.politicaPrivacidad}</p>}
            
            <Button 
              type="submit" 
              className="w-full mt-4" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Completar registro"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}