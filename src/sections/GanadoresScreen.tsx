import { useState } from 'react';
import { ArrowLeft, Trophy, Crown, Medal, Award, Calendar, Users, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useStore } from '@/store';
import type { Sorteo, Ganador } from '@/types';

interface GanadoresScreenProps {
  onBack: () => void;
}

export function GanadoresScreen({ onBack }: GanadoresScreenProps) {
  const { sorteos, ganadores } = useStore();
  const [sorteoSeleccionado, setSorteoSeleccionado] = useState<Sorteo | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // Filtrar sorteos finalizados
  const sorteosFinalizados = sorteos.filter(s => s.estado === 'finalizado');

  // Obtener ganadores de un sorteo específico
  const obtenerGanadoresSorteo = (sorteoId: string): Ganador[] => {
    return ganadores.filter(g => g.sorteoId === sorteoId).sort((a, b) => a.puesto - b.puesto);
  };

  // Filtrar sorteos por búsqueda
  const sorteosFiltrados = sorteosFinalizados.filter(s =>
    s.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getPositionIcon = (puesto: number) => {
    switch (puesto) {
      case 1: return <Crown className="w-6 h-6 text-yellow-600" />;
      case 2: return <Medal className="w-5 h-5 text-gray-600" />;
      case 3: return <Award className="w-5 h-5 text-orange-600" />;
      default: return <Trophy className="w-5 h-5 text-pollo-marron" />;
    }
  };

  const getPositionColor = (puesto: number) => {
    switch (puesto) {
      case 1: return 'bg-yellow-400';
      case 2: return 'bg-gray-400';
      case 3: return 'bg-orange-400';
      default: return 'bg-pollo-amarillo';
    }
  };

  return (
    <div className="min-h-screen w-full pb-24">
      {/* Header */}
      <div className="bg-pollo-marron px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-pollo-lg relative overflow-hidden">
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full" />
        
        <div className="relative z-10">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-pollo-fondo-claro/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Ganadores</h1>
              <p className="text-white/80 text-sm">Sorteos finalizados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pollo-marron/40" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar sorteo..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-pollo-marron/30 focus:border-pollo-amarillo focus:ring-2 focus:ring-pollo-amarillo/20 outline-none"
          />
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-2xl p-4 border border-pollo-marron/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-pollo-marron" />
              <span className="text-xs text-pollo-marron/60">Sorteos Finalizados</span>
            </div>
            <p className="text-2xl font-black text-pollo-marron">{sorteosFinalizados.length}</p>
          </div>
          
          <div className="bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-2xl p-4 border border-pollo-marron/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-pollo-marron" />
              <span className="text-xs text-pollo-marron/60">Total Ganadores</span>
            </div>
            <p className="text-2xl font-black text-pollo-marron">{ganadores.length}</p>
          </div>
        </div>

        {/* Lista de sorteos finalizados */}
        <div>
          <h2 className="text-lg font-bold text-pollo-marron mb-4">Sorteos Finalizados</h2>
          
          {sorteosFiltrados.length === 0 ? (
            <div className="p-6 bg-white/40 rounded-2xl border border-pollo-marron/20 text-center">
              <div className="w-16 h-16 bg-pollo-marron/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-7 h-7 text-pollo-marron/40" />
              </div>
              <p className="text-pollo-marron/60">
                {busqueda ? 'No se encontraron sorteos' : 'No hay sorteos finalizados'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sorteosFiltrados.map((sorteo) => {
                const ganadoresSorteo = obtenerGanadoresSorteo(sorteo.id);
                const estaExpandido = sorteoSeleccionado?.id === sorteo.id;
                
                return (
                  <div key={sorteo.id} className="card-premium overflow-hidden">
                    {/* Header del sorteo */}
                    <div 
                      onClick={() => setSorteoSeleccionado(estaExpandido ? null : sorteo)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">
                          Finalizado
                        </span>
                        <div className="flex items-center gap-1 text-sm text-pollo-marron/60">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(sorteo.fechaSorteo).toLocaleDateString('es-AR')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-pollo-amarillo rounded-xl flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-pollo-marron">{sorteo.titulo}</h3>
                          <p className="text-sm text-pollo-marron/60 line-clamp-1">{sorteo.descripcion}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Users className="w-4 h-4 text-pollo-amarillo" />
                            <span className="text-sm text-pollo-marron/60">
                              {sorteo.participantes} participantes
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {estaExpandido ? (
                            <ChevronUp className="w-5 h-5 text-pollo-marron/40" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-pollo-marron/40" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Ganadores del sorteo */}
                    {estaExpandido && (
                      <div className="mt-4 pt-4 border-t border-pollo-marron/20 space-y-3">
                        <h4 className="font-bold text-pollo-marron text-sm mb-3">
                          🏆 Ganadores
                        </h4>
                        
                        {ganadoresSorteo.length === 0 ? (
                          <p className="text-sm text-pollo-marron/50 text-center py-4">
                            No se han registrado ganadores para este sorteo
                          </p>
                        ) : (
                          ganadoresSorteo.map((ganador) => (
                            <div 
                              key={ganador.id}
                              className="card-pollo relative overflow-hidden"
                            >
                              <div className={`absolute top-0 left-0 w-full h-1.5 ${getPositionColor(ganador.puesto)}`} />
                              
                              <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 ${getPositionColor(ganador.puesto)} rounded-xl flex items-center justify-center shadow-lg`}>
                                  <span className="text-xl font-black text-white">#{ganador.puesto}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    {getPositionIcon(ganador.puesto)}
                                    <span className="text-xs font-bold text-pollo-marron/60 uppercase">
                                      {ganador.puesto === 1 ? 'Primer' : ganador.puesto === 2 ? 'Segundo' : 'Tercer'} Puesto
                                    </span>
                                  </div>
                                  <h3 className="font-bold text-pollo-marron">
                                    {ganador.usuario.nombre} {ganador.usuario.apellido}
                                  </h3>
                                  <p className="text-sm text-pollo-marron/60">{ganador.usuario.email}</p>
                                  <p className="text-sm text-pollo-marron/60">{ganador.usuario.telefono}</p>
                                </div>
                              </div>

                              <div className="mt-3 pt-3 border-t border-pollo-marron/20">
                                <p className="text-xs text-pollo-marron/50 mb-1">PREMIO GANADO:</p>
                                <p className="font-bold text-pollo-marron text-sm">{ganador.premio.nombre}</p>
                                <p className="text-sm text-pollo-marron font-semibold">{ganador.premio.valor}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
