import { useState } from 'react';
import { ArrowLeft, TrendingUp, Users, Trophy, BarChart3, Calendar, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useStore } from '@/store';
import type { Sorteo } from '@/types';

interface EstadisticasScreenProps {
  onBack: () => void;
}

export function EstadisticasScreen({ onBack }: EstadisticasScreenProps) {
  const { sorteos, obtenerEstadisticasGenerales, obtenerEstadisticasSorteo } = useStore();
  const [sorteoSeleccionado, setSorteoSeleccionado] = useState<Sorteo | null>(null);

  const statsGenerales = obtenerEstadisticasGenerales();

  // Obtener estadísticas de un sorteo específico
  const statsSorteo = sorteoSeleccionado 
    ? obtenerEstadisticasSorteo(sorteoSeleccionado.id)
    : null;

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
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Estadísticas</h1>
              <p className="text-white/80 text-sm">Análisis de participación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Estadísticas Generales */}
        <div>
          <h2 className="text-lg font-bold text-pollo-marron mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pollo-marron" />
            Resumen General
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-2xl p-4 border border-pollo-marron/20">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-pollo-marron" />
                <span className="text-xs text-pollo-marron/60">Total Sorteos</span>
              </div>
              <p className="text-2xl font-black text-pollo-marron">{statsGenerales.totalSorteos}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-green-500 font-medium">{statsGenerales.sorteosActivos} activos</span>
              </div>
            </div>
            
            <div className="bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-2xl p-4 border border-pollo-marron/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-pollo-marron" />
                <span className="text-xs text-pollo-marron/60">Participaciones</span>
              </div>
              <p className="text-2xl font-black text-pollo-marron">{statsGenerales.totalParticipaciones}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-pollo-marron/50">
                  {statsGenerales.totalParticipantesUnicos} únicos
                </span>
              </div>
            </div>
            
            <div className="bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-2xl p-4 border border-pollo-marron/20">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-pollo-marron" />
                <span className="text-xs text-pollo-marron/60">Promedio/Sorteo</span>
              </div>
              <p className="text-2xl font-black text-pollo-marron">
                {statsGenerales.promedioParticipacionesPorSorteo}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-pollo-marron/50">participaciones</span>
              </div>
            </div>
            
            <div className="bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-2xl p-4 border border-pollo-marron/20">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-primary-foreground" />
                <span className="text-xs text-pollo-marron/60">Finalizados</span>
              </div>
              <p className="text-2xl font-black text-pollo-marron">{statsGenerales.sorteosFinalizados}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-pollo-marron/50">con ganadores</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sorteos con Mayor Participación */}
        <div className="card-premium">
          <h2 className="text-lg font-bold text-pollo-marron mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pollo-marron" />
            Sorteos con Mayor Participación
          </h2>
          
          {statsGenerales.sorteosConMayorParticipacion.length === 0 ? (
            <p className="text-sm text-pollo-marron/50 text-center py-4">
              No hay datos suficientes
            </p>
          ) : (
            <div className="space-y-3">
              {statsGenerales.sorteosConMayorParticipacion.map((sorteo, index) => (
                <div key={sorteo.sorteoId} className="flex items-center gap-3 p-3 bg-pollo-amarillo/10 rounded-xl">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-400 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-400 text-white' :
                    'bg-pollo-marron/30 text-pollo-marron'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-pollo-marron text-sm">{sorteo.titulo}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pollo-marron">{sorteo.participaciones}</p>
                    <p className="text-xs text-pollo-marron/50">participaciones</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selector de Sorteo para Estadísticas Detalladas */}
        <div>
          <h2 className="text-lg font-bold text-pollo-marron mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-pollo-marron" />
            Estadísticas por Sorteo
          </h2>
          
          <select
            value={sorteoSeleccionado?.id || ''}
            onChange={(e) => {
              const sorteo = sorteos.find(s => s.id === e.target.value);
              setSorteoSeleccionado(sorteo || null);
            }}
            className="w-full px-4 py-3 rounded-xl border border-pollo-marron/30 focus:border-pollo-amarillo focus:ring-2 focus:ring-pollo-amarillo/20 outline-none mb-4"
          >
            <option value="">Seleccionar sorteo...</option>
            {sorteos.map((sorteo) => (
              <option key={sorteo.id} value={sorteo.id}>
                {sorteo.titulo} ({sorteo.estado})
              </option>
            ))}
          </select>

          {sorteoSeleccionado && statsSorteo && (
            <div className="card-premium space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-pollo-marron">{sorteoSeleccionado.titulo}</h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${
                  sorteoSeleccionado.estado === 'activo' ? 'bg-green-500' :
                  sorteoSeleccionado.estado === 'proximo' ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  {sorteoSeleccionado.estado === 'activo' ? 'Activo' :
                   sorteoSeleccionado.estado === 'proximo' ? 'Próximo' : 'Finalizado'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-pollo-amarillo/10 rounded-xl p-3 text-center">
                  <Users className="w-5 h-5 mx-auto mb-1 text-primary-foreground" />
                  <p className="text-xl font-bold text-pollo-marron">{statsSorteo.totalParticipantes}</p>
                  <p className="text-xs text-pollo-marron/60">Total Participaciones</p>
                </div>
                
                <div className="bg-pollo-marron/10 rounded-xl p-3 text-center">
                  <Users className="w-5 h-5 text-pollo-marron mx-auto mb-1" />
                  <p className="text-xl font-bold text-pollo-marron">{statsSorteo.participantesUnicos}</p>
                  <p className="text-xs text-pollo-marron/60">Participantes Únicos</p>
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-pollo-marron/60">Tasa de Conversión</span>
                  <span className="font-bold text-pollo-marron">{statsSorteo.tasaConversion.toFixed(2)}</span>
                </div>
                <div className="w-full h-2 bg-pollo-marron/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-green-400"
                    style={{ width: `${Math.min(statsSorteo.tasaConversion * 50, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-pollo-marron/50 mt-1">
                  Participaciones por participante único
                </p>
              </div>

              {/* Comparación con sorteos anteriores */}
              <div className={`p-3 rounded-xl flex items-center gap-3 ${
                statsSorteo.comparacionSorteosAnteriores > 0 ? 'bg-green-50' :
                statsSorteo.comparacionSorteosAnteriores < 0 ? 'bg-red-50' : 'bg-gray-50'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  statsSorteo.comparacionSorteosAnteriores > 0 ? 'bg-green-500' :
                  statsSorteo.comparacionSorteosAnteriores < 0 ? 'bg-red-500' : 'bg-gray-500'
                }`}>
                  {statsSorteo.comparacionSorteosAnteriores > 0 ? (
                    <ArrowUp className="w-5 h-5 text-white" />
                  ) : statsSorteo.comparacionSorteosAnteriores < 0 ? (
                    <ArrowDown className="w-5 h-5 text-white" />
                  ) : (
                    <Minus className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-pollo-marron">
                    {statsSorteo.comparacionSorteosAnteriores > 0 ? '+' : ''}
                    {statsSorteo.comparacionSorteosAnteriores.toFixed(1)}%
                  </p>
                  <p className="text-xs text-pollo-marron/60">
                    vs. promedio de sorteos anteriores
                  </p>
                </div>
              </div>

              {/* Participaciones por día */}
              {statsSorteo.participacionesPorDia.length > 0 && (
                <div>
                  <h4 className="font-semibold text-pollo-marron text-sm mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pollo-marron" />
                    Participaciones por Día
                  </h4>
                  <div className="space-y-2">
                    {statsSorteo.participacionesPorDia.slice(-7).map((dia) => (
                      <div key={dia.fecha} className="flex items-center gap-3">
                        <span className="text-xs text-pollo-marron/60 w-20">
                          {new Date(dia.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                        </span>
                        <div className="flex-1 h-6 bg-pollo-marron/10 rounded-lg overflow-hidden relative">
                          <div 
                            className="h-full rounded-lg bg-green-400"
                            style={{ 
                              width: `${Math.min((dia.cantidad / Math.max(...statsSorteo.participacionesPorDia.map(d => d.cantidad))) * 100, 100)}%` 
                            }}
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-pollo-marron">
                            {dia.cantidad}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!sorteoSeleccionado && (
            <div className="p-6 bg-white/40 rounded-2xl border border-pollo-marron/20 text-center">
              <div className="w-16 h-16 bg-pollo-marron/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-7 h-7 text-pollo-marron/40" />
              </div>
              <p className="text-pollo-marron/60">Selecciona un sorteo para ver estadísticas detalladas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
