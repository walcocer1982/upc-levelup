"use client";

import { Toaster as SonnerToaster } from "sonner";
import { toast } from "sonner";  // ← Movida al principio con las otras importaciones

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      closeButton
      richColors
      toastOptions={{
        duration: 5000,
      }}
    />
  );
}

// Este archivo exporta la función toast para usarla en toda la aplicación
export { toast };