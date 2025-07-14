"use client";

import { useState, useEffect } from "react";
import Layout from "@/views/components/interface/Layout";
import ProfileForm from "@/views/components/forms/user/ProfileForm";
import StartupList from "@/views/components/dashboard/startup/StartupList";
import TabsNavigation from "@/views/components/interface/TabsNavigation";
import StartupProfileForm from "@/views/components/forms/startup/ProfileForm";
import ImpactForm from "@/views/components/forms/startup/ImpactForm";
import MetricsForm from "@/views/components/forms/startup/MetricsForm";
import MembersList from "@/views/components/dashboard/startup/MembersList";
import ApplicationList from "@/views/components/forms/application/ApplicationList"; // Corregido el path
import { Button } from "@/components/ui/button";

// Definir las pestañas para la navegación de startup
const startupTabs = [
    { id: "profile", label: "Perfil" },
    { id: "impact", label: "Impacto" },
    { id: "metrics", label: "Métricas" },
    { id: "members", label: "Integrantes" }
];

// Datos de ejemplo para las startups
const mockStartups = [
    {
        id: "1",
        nombre: "Tech Innovators",
        descripcion: "Plataforma de inteligencia artificial para optimización de procesos industriales.",
        fechaFundacion: "2023-03-15",
        etapa: "mvp",
        categoria: "tech",
        membersCount: 3
    },
    {
        id: "2",
        nombre: "EduLearn",
        descripcion: "Solución para educación remota con enfoque en experiencias interactivas.",
        fechaFundacion: "2022-11-21",
        etapa: "idea",
        categoria: "edtech",
        membersCount: 2
    },
];

export default function DashboardPage() {
    // Estado para controlar la hidratación
    const [isMounted, setIsMounted] = useState(false);

    // Estados para controlar la navegación y visualización
    const [activeView, setActiveView] = useState<"profile" | "startups" | "startup-detail" | "applications">("startups");
    const [selectedStartupId, setSelectedStartupId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("profile");

    // Establecer el estado de montaje cuando el componente está listo en el cliente
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Funciones para la navegación
    const handleSelectProfile = () => {
        setActiveView("profile");
    };

    const handleSelectStartups = () => {
        setActiveView("startups");
        setSelectedStartupId(null);
    };

    const handleSelectApplications = () => {
        setActiveView("applications");
    };

    const handleSelectStartup = (id: string) => {
        setSelectedStartupId(id);
        setActiveView("startup-detail");
        setActiveTab("profile");
    };

    const handleAddStartup = () => {
        setSelectedStartupId("new");
        setActiveView("startup-detail");
        setActiveTab("profile");
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    // Renderizar el contenido según la vista activa
    const renderContent = () => {
        if (!isMounted) return null; // No renderizar nada hasta que esté montado en cliente

        switch (activeView) {
            case "profile":
                return (
                    <div className="w-full">
                        <div>
                            <h1 className="text-2xl font-bold">Completa tu información</h1>
                            <p className="text-muted-foreground">
                                Para finalizar tu registro necesitamos algunos datos adicionales
                            </p>
                        </div>

                        <div className="mt-6 bg-card p-6 rounded-lg shadow-sm border">
                            <ProfileForm
                                userEmail="usuario@ejemplo.com" // Añadir este prop
                                onSubmit={(data) => console.log("Profile data:", data)}
                            />
                        </div>
                    </div>
                );

            case "startups":
                return (
                    <StartupList
                        startups={mockStartups}
                        onSelectStartup={handleSelectStartup}
                        onAddStartup={handleAddStartup}
                    />
                );

            case "startup-detail":
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">
                                {selectedStartupId && selectedStartupId !== "new"
                                    ? `Editar Startup`
                                    : "Nueva Startup"}
                            </h1>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveView("startups")}
                            >
                                Volver a startups
                            </Button>
                        </div>

                        <TabsNavigation
                            tabs={startupTabs}
                            defaultValue={activeTab}
                            onTabChange={handleTabChange}
                        />

                        {/* Contenido según el tab activo */}
                        {activeTab === "profile" && (
                            <StartupProfileForm
                                onSubmit={(data) => console.log("Profile data:", data)}
                            />
                        )}

                        {activeTab === "impact" && (
                            <ImpactForm
                                onSubmit={(data) => console.log("Impact data:", data)}
                            />
                        )}

                        {activeTab === "metrics" && (
                            <MetricsForm
                                onSubmit={(data) => console.log("Metrics data:", data)}
                            />
                        )}
                        {activeTab === "members" && (
                            <MembersList
                                startupId={selectedStartupId || undefined}
                                onSubmit={(data) => console.log("Members data:", data)}
                            />
                        )}
                    </div>
                );

            case "applications":
                return (
                    <ApplicationList
                        startupId={selectedStartupId || undefined}
                    />
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
        <Layout
            activeView={activeView}
            onSelectProfile={handleSelectProfile}
            onSelectStartups={handleSelectStartups}
            onSelectApplications={handleSelectApplications}
        >
            {renderContent()}
        </Layout>
    );
}