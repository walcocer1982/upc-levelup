"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Eye, 
  CheckCircle, 
  Clock,
  AlertCircle,
  BarChart3,
  Plus
} from "lucide-react";
import Link from "next/link";
import { mockDataSummary } from "@/data/mock";

// Usar datos mock centralizados
const mockStats = {
  totalUsers: mockDataSummary.totalUsers,
  totalStartups: mockDataSummary.totalStartups,
  pendingEvaluations: mockDataSummary.postulacionesByEstado.en_revision,
  activeConvocatorias: mockDataSummary.convocatoriasByEstado.abierta,
  recentActivity: [
    {
      id: "1",
      type: "evaluation",
      message: "Nueva evaluación completada para TechFlow Solutions",
      time: "2 horas atrás",
      status: "completed"
    },
    {
      id: "2",
      type: "startup",
      message: "Nueva startup registrada: EduTech Pro",
      time: "4 horas atrás",
      status: "new"
    },
    {
      id: "3",
      type: "user",
      message: "Nuevo usuario registrado: carlos@edutech.com",
      time: "6 horas atrás",
      status: "new"
    },
    {
      id: "4",
      type: "evaluation",
      message: "Evaluación pendiente requiere revisión: GreenEnergy",
      time: "1 día atrás",
      status: "pending"
    }
  ]
};

export default function AdminDashboardPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Administración</h1>
          <p className="text-muted-foreground">
            Resumen general del sistema y actividad reciente
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 size={16} className="mr-2" />
            Generar Reporte
          </Button>
          <Button>
            <Plus size={16} className="mr-2" />
            Nueva Convocatoria
          </Button>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Usuarios</p>
                <p className="text-3xl font-bold">{mockStats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Startups</p>
                <p className="text-3xl font-bold">{mockStats.totalStartups}</p>
              </div>
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Evaluaciones Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">{mockStats.pendingEvaluations}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Convocatorias Activas</p>
                <p className="text-3xl font-bold text-purple-600">{mockStats.activeConvocatorias}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/evaluaciones">
              <Button variant="outline" className="w-full justify-start">
                <Eye size={16} className="mr-2" />
                Revisar Evaluaciones Pendientes
              </Button>
            </Link>
            <Link href="/admin/startups">
              <Button variant="outline" className="w-full justify-start">
                <Building2 size={16} className="mr-2" />
                Gestionar Startups
              </Button>
            </Link>
            <Link href="/admin/convocatorias">
              <Button variant="outline" className="w-full justify-start">
                <Calendar size={16} className="mr-2" />
                Crear Nueva Convocatoria
              </Button>
            </Link>
            <Link href="/admin/usuarios">
              <Button variant="outline" className="w-full justify-start">
                <Users size={16} className="mr-2" />
                Ver Todos los Usuarios
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockStats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {activity.status === "completed" && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {activity.status === "new" && (
                      <Plus className="h-4 w-4 text-blue-600" />
                    )}
                    {activity.status === "pending" && (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enlaces a secciones principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/startups">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Gestionar Startups</h3>
                  <p className="text-sm text-muted-foreground">
                    Administra todas las startups del sistema
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/evaluaciones">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">Evaluaciones</h3>
                  <p className="text-sm text-muted-foreground">
                    Revisa y gestiona evaluaciones de startups
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/convocatorias">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Convocatorias</h3>
                  <p className="text-sm text-muted-foreground">
                    Crea y gestiona convocatorias
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}