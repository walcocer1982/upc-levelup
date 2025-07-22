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
import ApplicationList from "@/views/components/forms/application/ApplicationList";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// Definir las pestañas para la navegación de startup
const startupTabs = [
    { id: "profile", label: "Perfil" },
    { id: "impact", label: "Impacto" },
    { id: "metrics", label: "Métricas" },
    { id: "members", label: "Integrantes" }
];

export default function DashboardPage() {
    // Estado para controlar la hidratación
    const [isMounted, setIsMounted] = useState(false);
    const { data: session } = useSession();

    // Estados para controlar la navegación y visualización
    const [activeView, setActiveView] = useState<"profile" | "startups" | "startup-detail" | "applications">("startups");
    const [selectedStartupId, setSelectedStartupId] = useState<string | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<string>("profile");
    
    // Estados para datos
    const [userStartups, setUserStartups] = useState([]);
    const [loading, setLoading] = useState(true);

    // Establecer el estado de montaje cuando el componente está listo en el cliente
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Cargar startups del usuario
    useEffect(() => {
        const loadUserStartups = async () => {
            if (!session?.user?.email) return;

            try {
                setLoading(true);
                const response = await fetch('/api/users/startups');
                
                if (response.ok) {
                    const data = await response.json();
                    setUserStartups(data.startups || []);
                } else {
                    console.error('Error cargando startups:', response.status);
                    toast.error('Error al cargar tus startups');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Error de conexión');
            } finally {
                setLoading(false);
            }
        };

        loadUserStartups();
    }, [session]);

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

    // Función para actualizar la lista de startups después de cambios
    const handleStartupUpdate = async () => {
        try {
            const response = await fetch('/api/users/startups');
            if (response.ok) {
                const data = await response.json();
                setUserStartups(data.startups || []);
            }
        } catch (error) {
            console.error('Error actualizando startups:', error);
        }
    };

    // Renderizar el contenido según la vista activa
    const renderContent = () => {
        if (!isMounted) return null; // No renderizar nada hasta que esté montado en cliente

        switch (activeView) {
            case "profile":
                return (
                    <div className="w-full">
                        <div>
                            <h1 className="text-2xl font-bold">Mi Perfil</h1>
                            <p className="text-muted-foreground">
                                Actualiza tu información personal
                            </p>
                        </div>

                        <div className="mt-6 bg-card p-6 rounded-lg shadow-sm border">
                            <ProfileForm
                                userEmail={session?.user?.email}
                                onSubmit={(data) => {
                                    console.log("Profile data:", data);
                                    toast.success("Perfil actualizado exitosamente");
                                }}
                            />
                        </div>
                    </div>
                );

            case "startups":
                return (
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold">Mis Startups</h1>
                                <p className="text-muted-foreground">
                                    Gestiona tus startups y proyectos
                                </p>
                            </div>
                            <Button onClick={handleAddStartup}>
                                + Nueva Startup
                            </Button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <span className="ml-2 text-muted-foreground">Cargando startups...</span>
                            </div>
                        ) : (
                            <StartupList
                                startups={userStartups}
                                onSelectStartup={handleSelectStartup}
                                onAddStartup={handleAddStartup}
                            />
                        )}
                    </div>
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
                                startupId={selectedStartupId === "new" ? undefined : selectedStartupId}
                                onSubmit={(data) => {
                                    console.log("Profile data:", data);
                                    toast.success("Perfil de startup guardado exitosamente");
                                    handleStartupUpdate();
                                    if (selectedStartupId === "new") {
                                        setActiveView("startups");
                                    }
                                }}
                            />
                        )}

                        {activeTab === "impact" && (
                            <ImpactForm
                                startupId={selectedStartupId}
                                onSubmit={(data) => {
                                    console.log("Impact data:", data);
                                    toast.success("Datos de impacto guardados exitosamente");
                                }}
                            />
                        )}

                        {activeTab === "metrics" && (
                            <MetricsForm
                                startupId={selectedStartupId}
                                onSubmit={(data) => {
                                    console.log("Metrics data:", data);
                                    toast.success("Métricas guardadas exitosamente");
                                }}
                            />
                        )}

                        {activeTab === "members" && (
                            <MembersList
                                startupId={selectedStartupId}
                                onSubmit={(data) => {
                                    console.log("Members data:", data);
                                    toast.success("Integrantes actualizados exitosamente");
                                }}
                            />
                        )}
                    </div>
                );

            case "applications":
                return (
                    <div className="w-full">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">Mis Aplicaciones</h1>
                            <p className="text-muted-foreground">
                                Revisa el estado de tus aplicaciones a convocatorias
                            </p>
                        </div>
                        
                        <ApplicationList
                            startupId={selectedStartupId}
                        />
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