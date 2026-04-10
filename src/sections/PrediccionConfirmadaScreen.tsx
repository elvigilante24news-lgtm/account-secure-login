import { CheckCircle, Gift, Calendar, Clock, MessageCircle, Mail, Share2, Trophy, ChevronRight, ArrowLeft, Target, TrendingUp, Users, Phone } from 'lucide-react';
import { useStore } from '@/store';
import type { Partido, Prediccion } from '@/types';

interface PrediccionConfirmadaScreenProps {
  partido: Partido;
  prediccion: Prediccion;
  onBack: () => void;
  onVerSorteo: (sorteoId: string) => void;
  onIrAInicio: () => void;
}

export function PrediccionConfirmadaScreen({ 
  partido, 
  prediccion, 
  onBack, 
  onVerSorteo, 
  onIrAInicio 
}: PrediccionConfirmadaScreenProps) {
  const { sorteos } = useStore();
  
  const sorteo = sorteos.find(s => s.id === partido.sorteoId);
  
  if (!sorteo) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-pollo-marron/60">No se encontró información del sorteo</p>
          <button onClick={onIrAInicio} className="btn-primary mt-4">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const getMedalColor = (puesto: number) => {
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
      <div className="bg-green-500 px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full" />
        
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-pollo-fondo-claro/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-soft">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">
            ¡Predicción Registrada!
          </h1>
          <p className="text-white/80">
            Ya estás participando del sorteo
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Resultado de la predicción */}
        <div className="card-premium">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-pollo-amarillo rounded-xl flex items-center justify-center">
              <Target className="w-8 h-8 text-pollo-marron" />
            </div>
            <div>
              <p className="text-sm text-pollo-marron/60">Tu predicción</p>
              <p className="text-2xl font-black text-pollo-marron">
                {partido.equipoLocal.nombre} {prediccion.golesLocal} - {prediccion.golesVisitante} {partido.equipoVisitante.nombre}
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-bold text-green-700">Triple Chance</p>
                <p className="text-sm text-green-600">
                  Si acertás el resultado exacto, tendrás <strong>3 chances</strong> de ganar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Sorteo */}
        <div className="card-premium">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-pollo-amarillo rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-pollo-marron" />
            </div>
            <div>
              <p className="text-xs text-pollo-marron/50 uppercase tracking-wider">Sorteo en el que participás</p>
              <h2 className="text-xl font-black text-pollo-marron">{sorteo.titulo}</h2>
            </div>
          </div>

          {/* Fechas importantes */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-pollo-amarillo/10 rounded-xl">
              <Clock className="w-5 h-5 text-pollo-amarillo" />
              <div>
                <p className="text-sm text-pollo-marron/60">Cierre de inscripciones</p>
                <p className="font-bold text-pollo-marron">
                  {new Date(sorteo.fechaFin).toLocaleDateString('es-AR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-pollo-amarillo/10 rounded-xl">
              <Calendar className="w-5 h-5 text-pollo-amarillo" />
              <div>
                <p className="text-sm text-pollo-marron/60">Fecha del sorteo</p>
                <p className="font-bold text-pollo-marron">
                  {new Date(sorteo.fechaSorteo).toLocaleDateString('es-AR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-pollo-amarillo/10 rounded-xl">
              <Users className="w-5 h-5 text-pollo-amarillo" />
              <div>
                <p className="text-sm text-pollo-marron/60">Participantes</p>
                <p className="font-bold text-pollo-marron">{sorteo.participantes.toLocaleString()} personas</p>
              </div>
            </div>
          </div>

          {/* Botón para ver más info del sorteo */}
          <button
            onClick={() => onVerSorteo(sorteo.id)}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            Ver información completa del sorteo
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Premios */}
        <div>
          <h3 className="text-lg font-bold text-pollo-marron mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-pollo-marron" />
            Premios por los que participás
          </h3>
          
          <div className="space-y-3">
            {sorteo.premios.map((premio) => (
              <div 
                key={premio.id}
                className="card-pollo relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${getMedalColor(premio.puesto)}`} />
                
                <div className="flex items-center gap-4 pl-3">
                  <div className={`w-12 h-12 ${getMedalColor(premio.puesto)} rounded-xl flex items-center justify-center shadow-md`}>
                    <span className="text-white font-bold">{premio.puesto}°</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-pollo-marron">{premio.nombre}</p>
                    <p className="text-sm text-pollo-marron/60">{premio.descripcion}</p>
                    <p className="text-sm font-bold text-pollo-marron mt-1">{premio.valor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sorteo.tipoSorteo === 'cantidad' && sorteo.cantidadGanadores && (
            <p className="text-sm text-pollo-marron/60 mt-3 text-center">
              Se sortearán <strong className="text-pollo-marron">{sorteo.cantidadGanadores} ganadores</strong> con el mismo premio
            </p>
          )}
        </div>

        {/* Cómo se comunicarán los ganadores */}
        <div className="card-premium">
          <h3 className="text-lg font-bold text-pollo-marron mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-pollo-marron" />
            ¿Cómo se contactarán los ganadores?
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-green-700">WhatsApp</p>
                <p className="text-sm text-green-600">Mensaje directo al teléfono registrado</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-blue-700">Email</p>
                <p className="text-sm text-blue-600">Notificación al correo electrónico</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-purple-700">Llamada telefónica</p>
                <p className="text-sm text-purple-600">Contacto directo por teléfono</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-pollo-amarillo/20 rounded-xl border border-pollo-amarillo/30">
              <div className="w-10 h-10 bg-pollo-amarillo rounded-xl flex items-center justify-center">
                <Share2 className="w-5 h-5 text-pollo-marron" />
              </div>
              <div>
                <p className="font-bold text-pollo-marron">Redes Sociales</p>
                <p className="text-sm text-pollo-marron/60">Publicación en nuestras redes oficiales</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-pollo-amarillo/10 rounded-xl border border-pollo-amarillo/30">
            <p className="text-sm text-pollo-marron/70 text-center">
              <strong>Importante:</strong> Asegurate de tener tus datos de contacto actualizados en tu perfil para que podamos contactarte si ganás.
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={() => onVerSorteo(sorteo.id)}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            Ver información del sorteo
          </button>
          
          <button
            onClick={onIrAInicio}
            className="w-full btn-secondary py-4 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
