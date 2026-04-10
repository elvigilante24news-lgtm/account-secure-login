import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trophy, CheckCircle2, TrendingUp, Users, Sparkles, AlertCircle, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import type { Partido, Prediccion } from '@/types';

interface AdminAcertadoresScreenProps {
  partido: Partido;
  onBack: () => void;
}

interface UsuarioPrediccion {
  userId: string;
  nombre: string;
  apellido: string;
  email: string;
  prediccion: Prediccion;
  acerto: boolean;
}

export function AdminAcertadoresScreen({ partido, onBack }: AdminAcertadoresScreenProps) {
  const { 
    predicciones, 
    seleccionarAcertadores, 
    aplicarTripleChance,
    obtenerAcertadoresPorPartido,
    participaciones
  } = useStore();

  const [usuariosConPrediccion, setUsuariosConPrediccion] = useState<UsuarioPrediccion[]>([]);
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const [busqueda, setBusqueda] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [tripleChanceAplicado, setTripleChanceAplicado] = useState(false);

  useEffect(() => {
    // Cargar usuarios con predicciones para este partido
    const usuariosGuardados = JSON.parse(localStorage.getItem('hiperdelpollo-users') || '[]');
    
    const prediccionesPartido = predicciones.filter(p => p.partidoId === partido.id);
    
    const usuariosPredicciones: UsuarioPrediccion[] = prediccionesPartido.map(pred => {
      const usuario = usuariosGuardados.find((u: any) => u.id === pred.userId);
      
      // Verificar si acertó
      const acerto = pred.golesLocal === partido.golesLocal && 
                     pred.golesVisitante === partido.golesVisitante;
      
      return {
        userId: pred.userId,
        nombre: usuario?.nombre || 'Usuario',
        apellido: usuario?.apellido || 'Desconocido',
        email: usuario?.email || 'unknown@email.com',
        prediccion: pred,
        acerto
      };
    });

    // Ordenar: acertadores primero
    usuariosPredicciones.sort((a, b) => {
      if (a.acerto && !b.acerto) return -1;
      if (!a.acerto && b.acerto) return 1;
      return 0;
    });

    setUsuariosConPrediccion(usuariosPredicciones);

    // Pre-seleccionar los que ya están marcados como acertados
    const yaAcertados = new Set<string>();
    prediccionesPartido.forEach(p => {
      if (p.estado === 'acertado') {
        yaAcertados.add(p.userId);
      }
    });
    setSeleccionados(yaAcertados);

    // Verificar si ya se aplicó triple chance
    const acertadores = obtenerAcertadoresPorPartido(partido.id);
    const algunoConTripleChance = acertadores.some(a => a.prediccion.tripleChanceAplicado);
    setTripleChanceAplicado(algunoConTripleChance);
  }, [predicciones, partido, obtenerAcertadoresPorPartido]);

  const handleSeleccionar = (userId: string) => {
    const nuevosSeleccionados = new Set(seleccionados);
    if (nuevosSeleccionados.has(userId)) {
      nuevosSeleccionados.delete(userId);
    } else {
      nuevosSeleccionados.add(userId);
    }
    setSeleccionados(nuevosSeleccionados);
  };

  const handleSeleccionarTodosLosAcertadores = () => {
    const acertadores = usuariosConPrediccion.filter(u => u.acerto);
    const nuevosSeleccionados = new Set<string>();
    acertadores.forEach(u => nuevosSeleccionados.add(u.userId));
    setSeleccionados(nuevosSeleccionados);
    toast.success(`${acertadores.length} acertadores seleccionados`);
  };

  const handleGuardarAcertadores = () => {
    seleccionarAcertadores(partido.id, Array.from(seleccionados));
    toast.success('Acertadores guardados correctamente');
    setMostrarConfirmacion(true);
  };

  const handleAplicarTripleChance = () => {
    aplicarTripleChance(partido.id);
    setTripleChanceAplicado(true);
    setMostrarConfirmacion(false);
    toast.success('¡TRIPLE CHANCE aplicado con éxito!', {
      description: `Los ${seleccionados.size} acertadores ahora tienen 3x chances de ganar.`,
    });
  };

  const usuariosFiltrados = usuariosConPrediccion.filter(u => 
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const acertadoresCount = usuariosConPrediccion.filter(u => u.acerto).length;
  const totalPredicciones = usuariosConPrediccion.length;

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
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-pollo-marron truncate">
              Seleccionar Acertadores
            </h1>
            <p className="text-xs text-gray-500 truncate">
              {partido.equipoLocal.nombre} vs {partido.equipoVisitante.nombre}
            </p>
          </div>
        </div>
      </div>

      {/* Resultado del Partido */}
      <div className="mx-4 mt-4 p-4 bg-pollo-marron rounded-xl text-white">
        <p className="text-xs text-gray-300 mb-2">Resultado Final</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={partido.equipoLocal.bandera} 
              alt={partido.equipoLocal.nombre}
              className="w-8 h-5 object-cover rounded"
            />
            <span className="font-bold">{partido.equipoLocal.codigo}</span>
          </div>
          <div className="text-2xl font-black">
            {partido.golesLocal} - {partido.golesVisitante}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">{partido.equipoVisitante.codigo}</span>
            <img 
              src={partido.equipoVisitante.bandera} 
              alt={partido.equipoVisitante.nombre}
              className="w-8 h-5 object-cover rounded"
            />
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-xl font-black">{totalPredicciones}</p>
            <p className="text-xs text-gray-500">Predicciones</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-xl font-black text-green-600">{acertadoresCount}</p>
            <p className="text-xs text-gray-500">Acertaron</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Sparkles className="w-5 h-5 text-pollo-marron mx-auto mb-1" />
            <p className="text-xl font-black text-pollo-marron">{seleccionados.size}</p>
            <p className="text-xs text-gray-500">Seleccionados</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Triple Chance */}
      {!tripleChanceAplicado ? (
        <div className="mx-4 mt-4 p-4 bg-pollo-azul-claro rounded-xl border border-pollo-azul/30">
          <div className="flex items-start gap-3">
            <div className="bg-pollo-azul p-2 rounded-lg shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-pollo-marron text-sm">Triple Chance</h3>
              <p className="text-xs text-pollo-marron mt-1">
                Seleccioná a los usuarios que acertaron el resultado. 
                Al aplicar el Triple Chance, sus participaciones en el sorteo se multiplicarán <strong>x3</strong>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-4 mt-4 p-4 bg-green-100 border border-green-300 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-lg shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-green-700 text-sm">Triple Chance Aplicado</h3>
              <p className="text-xs text-green-600 mt-1">
                Los acertadores ya tienen sus chances multiplicadas x3.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Búsqueda */}
      <div className="mx-4 mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar usuario..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="mx-4 mt-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSeleccionarTodosLosAcertadores}
          className="flex-1 text-xs"
        >
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Seleccionar todos los acertadores
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSeleccionados(new Set())}
          className="text-xs"
        >
          <X className="w-3 h-3 mr-1" />
          Limpiar
        </Button>
      </div>

      {/* Lista de Usuarios */}
      <div className="p-4 space-y-2 pb-24">
        {usuariosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No hay predicciones para este partido</p>
          </div>
        ) : (
          usuariosFiltrados.map(usuario => (
            <Card 
              key={usuario.userId} 
              className={`overflow-hidden transition-all ${
                usuario.acerto ? 'border-green-300 bg-green-50/30' : ''
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={seleccionados.has(usuario.userId)}
                    onCheckedChange={() => handleSeleccionar(usuario.userId)}
                    disabled={tripleChanceAplicado}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {usuario.nombre} {usuario.apellido}
                      </p>
                      {usuario.acerto && (
                        <Badge className="bg-green-500 text-white text-xs shrink-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Acertó
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{usuario.email}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm">
                      {usuario.prediccion.golesLocal} - {usuario.prediccion.golesVisitante}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(usuario.prediccion.fechaPrediccion).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Botón Guardar (Sticky) */}
      {!tripleChanceAplicado && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 max-w-md mx-auto">
          <Button
            onClick={handleGuardarAcertadores}
            disabled={seleccionados.size === 0}
            className="w-full bg-pollo-azul hover:bg-pollo-azul text-white font-bold py-3"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Guardar {seleccionados.size} Acertadores
          </Button>
        </div>
      )}

      {/* Diálogo de confirmación para aplicar Triple Chance */}
      <Dialog open={mostrarConfirmacion} onOpenChange={setMostrarConfirmacion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pollo-azul" />
              Aplicar Triple Chance
            </DialogTitle>
            <DialogDescription>
              Estás a punto de aplicar el Triple Chance a <strong>{seleccionados.size} usuarios</strong>.
              Sus chances en el sorteo se multiplicarán por 3.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-pollo-azul-claro rounded-lg p-4 my-4 border border-pollo-azul/30">
            <p className="text-sm text-pollo-marron">
              <strong>Resultado:</strong> {partido.equipoLocal.nombre} {partido.golesLocal} - {partido.golesVisitante} {partido.equipoVisitante.nombre}
            </p>
            <p className="text-sm text-pollo-marron mt-1">
              <strong>Acertadores seleccionados:</strong> {seleccionados.size}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarConfirmacion(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAplicarTripleChance}
              className="bg-pollo-azul hover:bg-pollo-azul text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Aplicar Triple Chance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
