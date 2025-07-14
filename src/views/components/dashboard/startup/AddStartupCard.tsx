import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddStartupCardProps {
  onClick: () => void;
}

export default function AddStartupCard({ onClick }: AddStartupCardProps) {
  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full"
      onClick={onClick}
    >
      <CardContent className="p-0 h-full">
        <Button 
          variant="ghost" 
          className="h-full w-full flex flex-col items-center justify-center py-12 space-y-4"
        >
          <PlusCircle size={48} className="text-muted-foreground" />
          <div className="text-center">
            <h3 className="font-medium text-lg">Agregar Startup</h3>
            <p className="text-muted-foreground text-sm">
              Registra un nuevo proyecto o startup
            </p>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}