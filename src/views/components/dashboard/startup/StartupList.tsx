"use client";

import { useState, useEffect } from "react";
import StartupCard from "./StartupCard";
import AddStartupCard from "./AddStartupCard";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";

interface Startup {
  id: string;
  nombre: string;
  descripcion: string;
  fechaFundacion: string | Date;
  etapa: string;
  categoria: string;
  membersCount?: number;
  members?: { rol: string }[];
  userRole?: string;
}

interface StartupListProps {
  onSelectStartup: (id: string) => void;
  onAddStartup: () => void;
}

export default function StartupList({
  onSelectStartup,
  onAddStartup
}: StartupListProps) {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStage, setFilterStage] = useState("");

  // Cargar startups desde la API
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/startups/cards');
        
        if (!response.ok) {
          throw new Error('Error al cargar startups');
        }

        const data = await response.json();
        setStartups(data.startups || []);
      } catch (error) {
        console.error('Error al cargar startups:', error);
        setStartups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          startup.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory && filterCategory !== "none" ? 
      startup.categoria.toLowerCase() === filterCategory.toLowerCase() : true;
    const matchesStage = filterStage && filterStage !== "none" ? 
      startup.etapa.toLowerCase() === filterStage.toLowerCase() : true;
    
    return matchesSearch && matchesCategory && matchesStage;
  });

  const handleCategoryChange = (value: string) => {
    setFilterCategory(value === "none" ? "" : value);
  };

  const handleStageChange = (value: string) => {
    setFilterStage(value === "none" ? "" : value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Mis Startups</h1>
          <p className="text-muted-foreground">
            Gestiona tus proyectos y startups registrados
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mis Startups</h1>
        <p className="text-muted-foreground">
          Gestiona tus proyectos y startups registrados
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar startup..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={filterCategory || "none"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Todas</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="edtech">EdTech</SelectItem>
              <SelectItem value="fintech">FinTech</SelectItem>
              <SelectItem value="healthtech">HealthTech</SelectItem>
              <SelectItem value="educación">Educación</SelectItem>
              <SelectItem value="tecnología">Tecnología</SelectItem>
              <SelectItem value="salud">Salud</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterStage || "none"}
            onValueChange={handleStageChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Etapa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Todas</SelectItem>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="mvp">MVP</SelectItem>
              <SelectItem value="crecimiento">Crecimiento</SelectItem>
              <SelectItem value="escalamiento">Escalamiento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AddStartupCard onClick={onAddStartup} />
        
        {filteredStartups.map((startup) => (
          <StartupCard 
            key={startup.id} 
            startup={startup} 
            onClick={onSelectStartup} 
          />
        ))}

        {filteredStartups.length === 0 && searchTerm && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No se encontraron startups que coincidan con tu búsqueda
          </div>
        )}

        {startups.length === 0 && !loading && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No tienes startups registradas aún
          </div>
        )}
      </div>
    </div>
  );
}