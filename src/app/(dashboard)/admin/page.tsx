"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, CheckCircle, Users } from "lucide-react";



export default function DashboardPage() {
    // Estado para controlar la hidratación
    const [isMounted, setIsMounted] = useState(false);

    // Estados para controlar la navegación y visualización
    const [activeView, setActiveView] = useState<"dashboard" | "convocatorias" | "evaluaciones" | "usuarios">("dashboard");

    // Establecer el estado de montaje cuando el componente está listo en el cliente
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Funciones para la navegación
    const handleSelectDashboard = () => {
        setActiveView("dashboard");
    };

    const handleSelectConvocatorias = () => {
        setActiveView("convocatorias");
    };

    const handleSelectEvaluaciones = () => {
        setActiveView("evaluaciones");
    };

    const handleSelectUsuarios = () => {
        setActiveView("usuarios");
    };

    // Renderizar el contenido según la vista activa
    const renderContent = () => {
        if (!isMounted) return null; // No renderizar nada hasta que esté montado en cliente

        switch (activeView) {
            case "dashboard":
                return (
                    <div className="w-full">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
                            <p className="text-muted-foreground">
                                Panel de control para gestionar convocatorias, evaluaciones y usuarios
                            </p>
                        </div>

                        {/* Estadísticas rápidas */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-card p-6 rounded-lg border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Convocatorias Activas</p>
                                        <p className="text-2xl font-bold">3</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card p-6 rounded-lg border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Postulaciones Pendientes</p>
                                        <p className="text-2xl font-bold">12</p>
                                    </div>
                                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card p-6 rounded-lg border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Evaluaciones Completadas</p>
                                        <p className="text-2xl font-bold">8</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card p-6 rounded-lg border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Usuarios Registrados</p>
                                        <p className="text-2xl font-bold">45</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Acciones rápidas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-card p-6 rounded-lg border">
                                <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
                                <div className="space-y-3">
                                    <Button 
                                        onClick={handleSelectConvocatorias}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Gestionar Convocatorias
                                    </Button>
                                    <Button 
                                        onClick={handleSelectEvaluaciones}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Revisar Evaluaciones
                                    </Button>
                                    <Button 
                                        onClick={handleSelectUsuarios}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        Gestionar Usuarios
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-card p-6 rounded-lg border">
                                <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Nueva postulación recibida - Tech Innovators</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>Evaluación completada - EduLearn</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span>Convocatoria cerrada - Inqubalab 2024</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "convocatorias":
                return (
                    <div className="w-full">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">Gestionar Convocatorias</h1>
                            <p className="text-muted-foreground">
                                Crea y gestiona convocatorias para startups
                            </p>
                        </div>
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">Gestión de Convocatorias</h3>
                            <p className="text-muted-foreground mb-4">
                                Accede a la página completa de gestión de convocatorias
                            </p>
                            <Button asChild>
                                <a href="/admin/convocatorias">Ver Convocatorias</a>
                            </Button>
                        </div>
                    </div>
                );

            case "evaluaciones":
                return (
                    <div className="w-full">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">Revisar Evaluaciones</h1>
                            <p className="text-muted-foreground">
                                Revisa y gestiona las evaluaciones de postulaciones
                            </p>
                        </div>
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">Evaluaciones</h3>
                            <p className="text-muted-foreground mb-4">
                                Accede a la página completa de evaluaciones
                            </p>
                            <Button asChild>
                                <a href="/admin/evaluaciones">Ver Evaluaciones</a>
                            </Button>
                        </div>
                    </div>
                );

            case "usuarios":
                return (
                    <div className="w-full">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">Gestionar Usuarios</h1>
                            <p className="text-muted-foreground">
                                Administra usuarios y sus roles en el sistema
                            </p>
                        </div>
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">Gestión de Usuarios</h3>
                            <p className="text-muted-foreground mb-4">
                                Funcionalidad en desarrollo
                            </p>
                            <Button disabled>
                                Próximamente
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Mostrar un placeholder simple durante el SSR o mientras se monta
    if (!isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            {renderContent()}
        </div>
    );
}