"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Crear la media query
    const media = window.matchMedia(query);
    
    // Función para actualizar el estado
    const updateMatches = () => {
      // Necesitamos verificar si window está definido (para SSR)
      if (typeof window !== "undefined") {
        setMatches(media.matches);
      }
    };
    
    // Configurar inicialmente
    updateMatches();
    
    // Añadir el listener para cambios
    media.addEventListener("change", updateMatches);
    
    // Limpiar al desmontar
    return () => {
      media.removeEventListener("change", updateMatches);
    };
  }, [query]);
  
  return matches;
}