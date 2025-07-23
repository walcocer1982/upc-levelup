"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Building, Users, Target, Award } from 'lucide-react';
import Link from 'next/link';

interface Convocatoria {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  createdAt: string;
}

export default function ConvocatoriasPage() {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [filteredConvocatorias, setFilteredConvocatorias] = useState<Convocatoria[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  useEffect(() => {
    filterConvocatorias();
  }, [convocatorias, searchTerm, filterTipo]);

  const fetchConvocatorias = async () => {
    try {
      const response = await fetch('/api/convocatorias');
      if (response.ok) {
        const data = await response.json();
        setConvocatorias(data.convocatorias || []);
      } else {
        console.error('Error cargando convocatorias');
        setConvocatorias([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setConvocatorias([]);
    } finally {
      setLoading(false);
    }
  };



  const filterConvocatorias = () => {
    let filtered = convocatorias;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(conv => 
        conv.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo (basado en el título)
    if (filterTipo !== 'todos') {
      filtered = filtered.filter(conv => 
        conv.titulo.toLowerCase().includes(filterTipo.toLowerCase())
      );
    }

    setFilteredConvocatorias(filtered);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activa':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Activa</Badge>;
      case 'cerrada':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cerrada</Badge>;
      case 'próximamente':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Próximamente</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getTipoIcon = (titulo: string) => {
    if (titulo.toLowerCase().includes('aceleracion')) {
      return <Award className="w-4 h-4" />;
    } else if (titulo.toLowerCase().includes('inqubalab')) {
      return <Target className="w-4 h-4" />;
    } else if (titulo.toLowerCase().includes('competencia')) {
      return <Award className="w-4 h-4" />;
    } else {
      return <Building className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Convocatorias</h1>
        <p className="text-gray-600">
          Descubre oportunidades para hacer crecer tu startup y conectar con la comunidad de emprendedores
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar convocatorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterTipo} onValueChange={setFilterTipo}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="Aceleracion">Aceleración</SelectItem>
            <SelectItem value="Inqubalab">Inqubalab</SelectItem>
            <SelectItem value="Competencia">Competencia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{convocatorias.length}</p>
              </div>
              <Building className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-green-600">
                  {convocatorias.filter(c => c.estado.toLowerCase() === 'activa').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximamente</p>
                <p className="text-2xl font-bold text-blue-600">
                  {convocatorias.filter(c => c.estado.toLowerCase() === 'próximamente').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cupos Totales</p>
                <p className="text-2xl font-bold text-purple-600">
                  {convocatorias.length * 20}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Convocatorias List */}
      <div className="space-y-6">
        {filteredConvocatorias.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron convocatorias</h3>
              <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
            </CardContent>
          </Card>
        ) : (
          filteredConvocatorias.map((convocatoria) => (
            <Card key={convocatoria.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTipoIcon(convocatoria.titulo)}
                      <CardTitle className="text-xl">{convocatoria.titulo}</CardTitle>
                      {getEstadoBadge(convocatoria.estado)}
                    </div>
                    <CardDescription className="text-base">
                      {convocatoria.descripcion}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Inicio: {formatDate(convocatoria.fechaInicio)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Cierre: {formatDate(convocatoria.fechaFin)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Cupos disponibles: 20</span>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Información:</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>• Convocatoria abierta para startups</p>
                        <p>• Formulario de impacto requerido</p>
                        <p>• Evaluación por IA disponible</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Beneficios:</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>✓ Mentoría personalizada</p>
                        <p>✓ Acceso a red de inversores</p>
                        <p>✓ Espacio de trabajo</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <Link href={`/user/convocatorias/${convocatoria.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Ver Detalles
                    </Button>
                  </Link>
                  {convocatoria.estado === 'activa' && (
                    <Link href={`/user/convocatorias/${convocatoria.id}/postular`} className="flex-1">
                      <Button className="w-full">
                        Postular
                      </Button>
                    </Link>
                  )}
                  {convocatoria.estado === 'próximamente' && (
                    <Button variant="outline" className="flex-1" disabled>
                      Próximamente
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 