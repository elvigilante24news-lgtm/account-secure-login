import { useEffect, useState } from 'react';
import { Gift, Ticket, Bell, ChevronRight, Trophy, Calendar, Users, Globe, TrendingUp, Target } from 'lucide-react';
import { useStore } from '@/store';
import type { Sorteo } from '@/types';

interface HomeScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user, sorteos, participaciones, notificaciones, predicciones, prediccionesHabilitadas } = useStore();
  const [greeting, setGreeting] = useState('');
  
  const sorteosActivos = sorteos.filter(s => s.estado === 'activo');
  const misParticipaciones = participaciones.filter(p => p.userId === user?.id);
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida && n.userId === user?.id);
  const misPredicciones = predicciones.filter(p => p.userId === user?.id);
  const prediccionesAcertadas = misPredicciones.filter(p => p.estado === 'acertado');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 18) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

  return (
    <div className="min-h-screen w-full pb-24">
      {/* Header */}
      <div className="bg-pollo-marron px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-pollo-lg relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 right-10 w-8 h-8 bg-white/10 rounded-full" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm font-medium">{greeting}</p>
              <h1 className="text-2xl font-black text-white">
                {user?.nombre} {user?.apellido}
              </h1>
            </div>
            <button 
              onClick={() => onNavigate('notificaciones')}
              className="relative w-12 h-12 bg-pollo-fondo-claro/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
            >
              <Bell className="w-5 h-5 text-white" />
              {notificacionesNoLeidas.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white font-bold flex items-center justify-center">
                  {notificacionesNoLeidas.length}
                </span>
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <div className="flex-1 bg-pollo-fondo-claro/30 backdrop-blur-sm rounded-2xl p-3 shadow-md">
              <div className="flex items-center gap-1 mb-1">
                <Ticket className="w-3 h-3 text-white/80" />
                <span className="text-white/80 text-xs">Participaciones</span>
              </div>
              <p className="text-xl font-black text-white">{misParticipaciones.length}</p>
            </div>
            <div className="flex-1 bg-pollo-fondo-claro/30 backdrop-blur-sm rounded-2xl p-3 shadow-md">
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-3 h-3 text-white/80" />
                <span className="text-white/80 text-xs">Predicciones</span>
              </div>
              <p className="text-xl font-black text-white">{misPredicciones.length}</p>
            </div>
            <div className="flex-1 bg-pollo-fondo-claro/30 backdrop-blur-sm rounded-2xl p-3 shadow-md">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-white/80" />
                <span className="text-white/80 text-xs">Acertadas</span>
              </div>
              <p className="text-xl font-black text-white">{prediccionesAcertadas.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Mundial 2026 - Banner Principal (solo si predicciones están habilitadas) */}
        {prediccionesHabilitadas && (
          <div 
            onClick={() => onNavigate('partidos-mundial')}
            className="relative overflow-hidden rounded-2xl cursor-pointer group bg-pollo-azul-claro border border-pollo-azul/30 shadow-soft"
          >
            <div className="relative p-5 shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-pollo-azul" />
                    <span className="text-pollo-azul text-xs font-bold uppercase tracking-wider">Mundial 2026</span>
                  </div>
                  <h2 className="text-xl font-black text-pollo-marron mb-2">
                    Predicciones con<br/>Triple Chance
                  </h2>
                  <p className="text-pollo-marron/70 text-sm mb-3">
                    Predecí los resultados y ganá <strong>3x chances</strong> si acertás
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="bg-pollo-azul text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      Predecir Ahora
                    </span>
                    <ChevronRight className="w-4 h-4 text-pollo-marron/60" />
                  </div>
                </div>
                <div className="w-16 h-16 bg-pollo-azul rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <img src="/trophy-icon.png" alt="Trophy" className="w-10 h-10" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sorteos Activos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-pollo-marron">Sorteos Activos</h2>
            <button 
              onClick={() => onNavigate('sorteos')}
              className="text-sm text-pollo-marron font-semibold flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {sorteosActivos.slice(0, 2).map((sorteo) => (
              <SorteoCard key={sorteo.id} sorteo={sorteo} onClick={() => onNavigate('sorteo-detail', sorteo)} />
            ))}
          </div>
        </div>

        {/* Mis Predicciones (solo si predicciones están habilitadas) */}
        {prediccionesHabilitadas && misPredicciones.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-pollo-marron">Mis Predicciones</h2>
              <button 
                onClick={() => onNavigate('partidos-mundial')}
                className="text-sm text-pollo-marron font-semibold flex items-center gap-1"
              >
                Ver todas <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-green-700">{misPredicciones.length}</p>
                    <p className="text-sm text-green-600">Predicciones realizadas</p>
                  </div>
                </div>
                {prediccionesAcertadas.length > 0 && (
                  <div className="text-right">
                    <p className="text-2xl font-black text-green-700">{prediccionesAcertadas.length}</p>
                    <p className="text-sm text-green-600">Con Triple Chance</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function SorteoCard({ sorteo, onClick }: { sorteo: Sorteo; onClick: () => void }) {
  const { verificarParticipacion, user } = useStore();
  const yaParticipa = user ? verificarParticipacion(sorteo.id) : false;
  
  return (
    <div 
      onClick={onClick}
      className="card-pollo cursor-pointer hover:shadow-pollo-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-pollo-marron rounded-xl flex items-center justify-center flex-shrink-0">
          <Gift className="w-8 h-8 text-pollo-amarillo" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-pollo-marron truncate">{sorteo.titulo}</h3>
            {yaParticipa && (
              <span className="badge-pollo flex-shrink-0">Participando</span>
            )}
          </div>
          <p className="text-sm text-pollo-marron/60 line-clamp-2 mt-1">{sorteo.descripcion}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs text-pollo-marron/50">
              <Users className="w-3.5 h-3.5" />
              <span>{sorteo.participantes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-pollo-marron/50">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(sorteo.fechaSorteo).toLocaleDateString('es-AR')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
