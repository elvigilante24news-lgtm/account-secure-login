import { useState } from 'react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Edit2, Trash2, Trophy, Calendar, MapPin, Eye, Users, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Partido, Equipo, FaseMundial, EstadoPartido } from '@/types';

interface AdminPartidosScreenProps {
  onBack: () => void;
  onCrearPartido: () => void;
  onEditarPartido: (partido: Partido) => void;
  onVerAcertadores: (partido: Partido) => void;
}

const fasesLabels: Record<FaseMundial, string> = {
  'fase-grupos': 'Fase de Grupos',
  'dieciseisavos': 'Dieciseisavos de Final',
  'octavos': 'Octavos de Final',
  'cuartos': 'Cuartos de Final',
  'semifinales': 'Semifinales',
  'tercer-puesto': 'Tercer Puesto',
  'final': 'Gran Final'
};

const estadosLabels: Record<EstadoPartido, string> = {
  'programado': 'Programado',
  'en-vivo': 'En Vivo',
  'finalizado': 'Finalizado',
  'cancelado': 'Cancelado'
};

export function AdminPartidosScreen({ 
  onBack, 
  onCrearPartido, 
  onEditarPartido,
  onVerAcertadores 
}: AdminPartidosScreenProps) {
  const { partidos, eliminarPartido, obtenerPrediccionesPorPartido } = useStore();
  const [partidoAEliminar, setPartidoAEliminar] = useState<Partido | null>(null);
  const [filtroFase, setFiltroFase] = useState<string>('todas');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  const partidosFiltrados = partidos.filter(partido => {
    const cumpleFase = filtroFase === 'todas' || partido.fase === filtroFase;
    const cumpleEstado = filtroEstado === 'todos' || partido.estado === filtroEstado;
    return cumpleFase && cumpleEstado;
  });

  const handleEliminar = () => {
    if (partidoAEliminar) {
      const success = eliminarPartido(partidoAEliminar.id);
      if (success) {
        toast.success('Partido eliminado correctamente');
      } else {
        toast.error('No se pudo eliminar el partido');
      }
      setPartidoAEliminar(null);
    }
  };

  const getPrediccionesCount = (partidoId: string) => {
    return obtenerPrediccionesPorPartido(partidoId).length;
  };

  const getEstadoBadge = (estado: EstadoPartido) => {
    switch (estado) {
      case 'programado':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Programado</Badge>;
      case 'en-vivo':
        return <Badge className="bg-green-500 text-white animate-pulse">En Vivo</Badge>;
      case 'finalizado':
        return <Badge variant="secondary">Finalizado</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
    }
  };

  const formatFecha = (fecha: string, hora: string) => {
    const date = new Date(`${fecha}T${hora}`);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short'
    }) + ` ${hora}`;
  };

  return (
    <div className="min-h-screen bg-pollo-fondo">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-pollo-amarillo/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-black text-pollo-marron flex items-center gap-2">
              <Trophy className="w-5 h-5 text-pollo-marron" />
              Gestión de Partidos
            </h1>
            <p className="text-xs text-gray-500">Mundial 2026</p>
          </div>
          <Button 
            size="sm" 
            onClick={onCrearPartido}
            className="bg-pollo-amarillo hover:bg-pollo-amarillo text-pollo-marron shadow-md"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nuevo
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-4 py-3 bg-white/50 border-b border-gray-200">
        <div className="flex gap-2">
          <Select value={filtroFase} onValueChange={setFiltroFase}>
            <SelectTrigger className="flex-1 text-xs">
              <SelectValue placeholder="Todas las fases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las fases</SelectItem>
              {Object.entries(fasesLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="flex-1 text-xs">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              {Object.entries(estadosLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Partidos */}
      <div className="p-4 space-y-3">
        {partidosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay partidos registrados</p>
            <Button 
              onClick={onCrearPartido}
              className="mt-4 bg-pollo-amarillo hover:bg-pollo-amarillo text-pollo-marron"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear primer partido
            </Button>
          </div>
        ) : (
          partidosFiltrados.map(partido => {
            const prediccionesCount = getPrediccionesCount(partido.id);
            
            return (
              <Card key={partido.id} className="overflow-hidden">
                <CardContent className="p-3">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getEstadoBadge(partido.estado)}
                      {partido.grupo && (
                        <Badge variant="outline" className="text-xs">
                          Grupo {partido.grupo}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => onEditarPartido(partido)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => setPartidoAEliminar(partido)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Equipos */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <img 
                        src={partido.equipoLocal.bandera} 
                        alt={partido.equipoLocal.nombre}
                        className="w-8 h-5 object-cover rounded"
                      />
                      <span className="text-sm font-medium">{partido.equipoLocal.codigo}</span>
                    </div>
                    
                    <div className="px-3">
                      {partido.estado === 'finalizado' && partido.golesLocal !== undefined ? (
                        <span className="text-lg font-black">
                          {partido.golesLocal} - {partido.golesVisitante}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">VS</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-sm font-medium">{partido.equipoVisitante.codigo}</span>
                      <img 
                        src={partido.equipoVisitante.bandera} 
                        alt={partido.equipoVisitante.nombre}
                        className="w-8 h-5 object-cover rounded"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatFecha(partido.fecha, partido.hora)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {partido.ciudad}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{prediccionesCount} predicciones</span>
                    </div>
                  </div>

                  {/* Botón de Acertadores (solo para partidos finalizados) */}
                  {partido.estado === 'finalizado' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-green-500 text-green-600 hover:bg-green-50"
                      onClick={() => onVerAcertadores(partido)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Seleccionar Acertadores
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={!!partidoAEliminar} onOpenChange={() => setPartidoAEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar partido?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará el partido 
              <strong>
                {partidoAEliminar && ` ${partidoAEliminar.equipoLocal.nombre} vs ${partidoAEliminar.equipoVisitante.nombre}`}
              </strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPartidoAEliminar(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleEliminar}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
