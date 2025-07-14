"use client";

import { useState } from "react";
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
import { Search } from "lucide-react";

interface Startup {
  id: string;
  nombre: string;
  descripcion: string;
  fechaFundacion: string;
  etapa: string;
  categoria: string;
  membersCount?: number;
}

interface StartupListProps {
  startups: Startup[];
  onSelectStartup: (id: string) => void;
  onAddStartup: () => void;
}

export default function StartupList({
  startups,
  onSelectStartup,
  onAddStartup
}: StartupListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStage, setFilterStage] = useState("");

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          startup.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? startup.categoria === filterCategory : true;
    const matchesStage = filterStage ? startup.etapa === filterStage : true;
    
    return matchesSearch && matchesCategory && matchesStage;
  });

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
            value={filterCategory}
            onValueChange={setFilterCategory}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Todas</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="edtech">EdTech</SelectItem>
              <SelectItem value="otras">Otras</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterStage}
            onValueChange={setFilterStage}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Etapa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Todas</SelectItem>
              <SelectItem value="mvp">MVP</SelectItem>
              <SelectItem value="idea">Idea</SelectItem>
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
      </div>
    </div>
  );
}