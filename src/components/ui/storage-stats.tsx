"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  HardDrive, 
  RefreshCw, 
  Trash2, 
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';
import { Repository } from '@/data/mock/repository';

interface StorageStats {
  totalEvaluations: number;
  storageSize: number;
  lastBackup: string | null;
}

export function StorageStats() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = () => {
    const currentStats = Repository.getStorageStats();
    setStats(currentStats);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSync = async () => {
    setLoading(true);
    try {
      await Repository.syncEvaluationsWithStorage();
      loadStats();
    } catch (error) {
      console.error('Error sincronizando:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearStorage = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todas las evaluaciones almacenadas? Esta acción no se puede deshacer.')) {
      // Implementar limpieza
      loadStats();
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('es-ES');
  };

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Estadísticas de Almacenamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">Cargando...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Estadísticas de Almacenamiento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <HardDrive className="w-6 h-6 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Evaluaciones</div>
              <div className="text-xl font-bold text-blue-600">
                {stats.totalEvaluations}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Download className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Tamaño</div>
              <div className="text-xl font-bold text-green-600">
                {formatBytes(stats.storageSize)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <Upload className="w-6 h-6 text-orange-600" />
            <div>
              <div className="text-sm text-gray-600">Último Backup</div>
              <div className="text-sm font-medium text-orange-600">
                {formatDate(stats.lastBackup)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleSync} 
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sincronizar
          </Button>
          
          <Button 
            onClick={handleClearStorage}
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar
          </Button>
        </div>

        {stats.totalEvaluations === 0 && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              No hay evaluaciones almacenadas. Las evaluaciones se perderán al reiniciar el servidor.
            </span>
          </div>
        )}

        {stats.totalEvaluations > 0 && (
          <div className="text-xs text-gray-500">
            💡 Las evaluaciones están guardadas en el navegador y se mantendrán entre sesiones.
          </div>
        )}
      </CardContent>
    </Card>
  );
} 