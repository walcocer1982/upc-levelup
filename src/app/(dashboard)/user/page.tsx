"use client";

import { useState, useEffect } from "react";
import ProfileForm from "@/views/components/forms/user/ProfileForm";
import { useSession } from "next-auth/react";

export default function UserPage() {
    const [isMounted, setIsMounted] = useState(false);
    const { data: session } = useSession();

    // Establecer el estado de montaje cuando el componente está listo en el cliente
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Mostrar un placeholder simple durante el SSR o mientras se monta
    if (!isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Mi Perfil</h1>
                <p className="text-muted-foreground">
                    Completa tu información personal
                </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border">
                <ProfileForm
                    userEmail={session?.user?.email || ""}
                    onSubmit={(data) => console.log("Profile data:", data)}
                />
            </div>
        </div>
    );
}