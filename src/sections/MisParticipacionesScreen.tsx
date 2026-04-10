import { useState } from 'react';
import { ArrowLeft, Ticket, Gift, Calendar, Clock, Trophy, AlertCircle } from 'lucide-react';
import { useStore } from '@/store';

interface MisParticipacionesScreenProps {
  onBack: () => void;
  onSelectSorteo: (sorteo: any) => void;
}

export function MisParticipacionesScreen({ onBack, onSelectSorteo }: MisParticipacionesScreenProps) {
  const { user, participaciones, sorteos } = useStore();
  const [filter, setFilter] = useState<'todos' | 'activos' | 'ganados'>('todos');

  const misParticipaciones = participaciones
    .filter(p => p.userId === user?.id)
    .map(p => ({
      ...p,
      sorteo: sorteos.find(s => s.id === p.sorteoId)
    }))
    .filter(p => {
      if (filter === 'activos') return p.estado === 'activo';
      if (filter === 'ganados') return p.estado === 'ganador';
      return true;
    })
    .sort((a, b) => new Date(b.fechaParticipacion).getTime() - new Date(a.fechaParticipacion).getTime());

  return (
    <div className="min-h-screen w-full pb-24">
      {/* Header */}
      <div className="bg-pollo-marron px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-pollo-lg relative overflow-hidden">
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full" />
        
        <div className="relative z-10">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-pollo-fondo-claro/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <h1 className="text-2xl font-black text-white mb-2">Mis Participaciones</h1>
          <p className="text-white/80 text-sm">{misParticipaciones.length} sorteos en los que participás</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['todos', 'activos', 'ganados'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-pollo-marron text-white shadow-md'
                  : 'bg-pollo-fondo-claro/80 text-pollo-marron border border-pollo-marron/30'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Participaciones List */}
        <div className="space-y-4">
          {misParticipaciones.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-pollo-marron/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-pollo-marron/40" />
              </div>
              <p className="text-pollo-marron/60 mb-2">No tenés participaciones {filter !== 'todos' ? 'en esta categoría' : ''}</p>
              <p className="text-sm text-pollo-marron/40">¡Participá en un sorteo y empezá a ganar!</p>
            </div>
          ) : (
            misParticipaciones.map((participacion) => (
              <div 
                key={participacion.id}
                onClick={() => participacion.sorteo && onSelectSorteo(participacion.sorteo)}
                className="card-premium cursor-pointer hover:shadow-floating transition-all duration-300 hover:-translate-y-1"
              >
                {/* Status banner */}
                {participacion.estado === 'ganador' && (
                  <div className="mb-4 p-3 bg-yellow-400 rounded-xl text-white text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="w-5 h-5" />
                      <span className="font-bold">¡GANADOR {participacion.puesto}° PUESTO!</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-pollo-marron rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gift className="w-8 h-8 text-pollo-amarillo" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-pollo-marron truncate">
                      {participacion.sorteo?.titulo || 'Sorteo no disponible'}
                    </h3>
                    <p className="text-sm text-pollo-marron/60 line-clamp-2 mt-1">
                      {participacion.sorteo?.descripcion}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1 text-xs text-pollo-marron/50">
                        <Ticket className="w-3.5 h-3.5" />
                        <span>#{participacion.numeroTicket}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-pollo-marron/50">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(participacion.fechaParticipacion).toLocaleDateString('es-AR')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <div className="mt-4 pt-4 border-t border-pollo-marron/20 flex items-center justify-between">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    participacion.estado === 'activo' ? 'bg-green-100 text-green-700' :
                    participacion.estado === 'ganador' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {participacion.estado === 'activo' ? <Clock className="w-3.5 h-3.5" /> :
                     participacion.estado === 'ganador' ? <Trophy className="w-3.5 h-3.5" /> :
                     <AlertCircle className="w-3.5 h-3.5" />}
                    <span>
                      {participacion.estado === 'activo' ? 'Participación activa' :
                       participacion.estado === 'ganador' ? `Ganador ${participacion.puesto}° puesto` :
                       'No ganador'}
                    </span>
                  </div>

                  {participacion.sorteo?.estado === 'finalizado' && (
                    <span className="text-xs text-pollo-marron/50">Sorteo finalizado</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
