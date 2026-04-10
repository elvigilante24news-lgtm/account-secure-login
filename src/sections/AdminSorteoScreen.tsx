import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Gift, Trophy, Play, Check, Crown, Medal, Award, AlertCircle, Edit2, Trash2, MessageCircle, Mail, Send, Phone, Sparkles, PartyPopper } from 'lucide-react';
import { useStore } from '@/store';
import type { Sorteo, Ganador } from '@/types';
import { toast } from 'sonner';

interface AdminSorteoScreenProps {
  sorteo: Sorteo;
  onBack: () => void;
  onEditarSorteo?: () => void;
}

// Componente de pantalla de carga para el sorteo
function SorteandoLoading() {
  return (
    <div className="fixed inset-0 bg-pollo-marron z-50 flex flex-col items-center justify-center">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pollo-amarillo/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pollo-amarillo/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pollo-amarillo/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Contenido central */}
      <div className="relative z-10 text-center">
        {/* Trofeo animado */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-yellow-400 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          {/* Destellos alrededor del trofeo */}
          <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-yellow-300 animate-pulse" />
          <Sparkles className="absolute -bottom-2 -left-4 w-6 h-6 text-pollo-marron animate-pulse" style={{ animationDelay: '0.3s' }} />
          <Sparkles className="absolute top-1/2 -right-8 w-5 h-5 text-yellow-200 animate-pulse" style={{ animationDelay: '0.6s' }} />
        </div>
        
        {/* Texto Sorteando */}
        <h2 className="text-4xl font-black text-white mb-4 animate-pulse">
          Sorteando
          <span className="inline-block animate-bounce">.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
        </h2>
        
        <p className="text-white/70 text-lg">
          Seleccionando a los ganadores
        </p>
        
        {/* Barra de progreso animada */}
        <div className="mt-8 w-64 h-2 bg-pollo-fondo-claro/30 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-pollo-amarillo to-yellow-400 rounded-full animate-[loading_2s_ease-in-out_infinite]" 
               style={{ 
                 width: '0%',
                 animation: 'loading 3s ease-in-out infinite'
               }} />
        </div>
        
        {/* Emoji decorativos */}
        <div className="mt-8 flex justify-center gap-4 text-3xl">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎲</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎰</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🎯</span>
          <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🎱</span>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

// Componente de confeti y celebración
function CelebrationEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Confeti */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={`confetti-${i}`}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            width: `${8 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 8}px`,
            backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][Math.floor(Math.random() * 8)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      
      {/* Globos */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`balloon-${i}`}
          className="absolute animate-balloon"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-100px',
            width: `${40 + Math.random() * 20}px`,
            height: `${50 + Math.random() * 25}px`,
            backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCF7F', '#A78BFA', '#F472B6'][Math.floor(Math.random() * 6)],
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
          }}
        >
          {/* Hilo del globo */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-white/50"
            style={{ 
              height: '60px', 
              top: '100%',
              transform: 'translateX(-50%) rotate(5deg)'
            }} 
          />
        </div>
      ))}
      
      {/* Serpentinas */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`streamer-${i}`}
          className="absolute animate-streamer"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-50px',
            width: '6px',
            height: '100px',
            background: `linear-gradient(180deg, ${['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 4)]} 0%, transparent 100%)`,
            borderRadius: '3px',
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
      
      {/* Estrellas brillantes */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Sparkles
          key={`sparkle-${i}`}
          className="absolute text-yellow-400 animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${12 + Math.random() * 16}px`,
            height: `${12 + Math.random() * 16}px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random()}s`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes balloon {
          0% {
            transform: translateY(0) rotate(-5deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) rotate(5deg);
            opacity: 0;
          }
        }
        
        @keyframes streamer {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .animate-confetti {
          animation: confetti 4s linear forwards;
        }
        
        .animate-balloon {
          animation: balloon 6s ease-in forwards;
        }
        
        .animate-streamer {
          animation: streamer 3s linear forwards;
        }
      `}</style>
    </div>
  );
}

export function AdminSorteoScreen({ sorteo, onBack, onEditarSorteo }: AdminSorteoScreenProps) {
  const { participaciones, realizarSorteo, ganadores, eliminarSorteo, enviarNotificacionGanador } = useStore();
  const [isSorting, setIsSorting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [sorteoGanadores, setSorteoGanadores] = useState<Ganador[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notificacionesEnviadas, setNotificacionesEnviadas] = useState<Set<string>>(new Set());

  const participantesSorteo = participaciones.filter(p => p.sorteoId === sorteo.id);
  const ganadoresExistentes = ganadores.filter(g => g.sorteoId === sorteo.id);

  useEffect(() => {
    if (ganadoresExistentes.length > 0) {
      setSorteoGanadores(ganadoresExistentes);
      setShowResults(true);
    }
  }, []);

  const handleRealizarSorteo = async () => {
    if (participantesSorteo.length < 1) {
      toast.error('Se necesita al menos 1 participante para realizar el sorteo');
      return;
    }

    setIsSorting(true);
    
    // Simular animación de sorteo (3 segundos)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const nuevosGanadores = realizarSorteo(sorteo.id);
    setSorteoGanadores(nuevosGanadores);
    setIsSorting(false);
    setShowResults(true);
    
    // Activar celebración con confeti y globos
    setShowCelebration(true);
    
    // Sonido de celebración (opcional - usando la API de vibración en móviles)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    // Desactivar celebración después de 6 segundos
    setTimeout(() => setShowCelebration(false), 6000);
    
    toast.success('¡Sorteo realizado exitosamente!', {
      description: 'Los ganadores han sido seleccionados. Ahora podés contactarlos manualmente.',
    });
  };

  const handleEliminarSorteo = () => {
    eliminarSorteo(sorteo.id);
    toast.success('Sorteo eliminado correctamente');
    onBack();
  };

  const handleEnviarWhatsApp = (ganador: Ganador) => {
    const telefono = ganador.usuario.telefono.replace(/\D/g, '');
    if (!telefono) {
      toast.error('El ganador no tiene teléfono registrado');
      return;
    }
    
    const mensaje = encodeURIComponent(
      `¡Hola ${ganador.usuario.nombre}! 🎉\n\n` +
      `¡Felicitaciones! Sos el ganador del ${ganador.puesto}° puesto en el sorteo "${sorteo.titulo}".\n\n` +
      `🎁 Tu premio: ${ganador.premio.nombre}\n` +
      `💰 Valor: ${ganador.premio.valor}\n\n` +
      `Por favor, contactanos para coordinar la entrega de tu premio.\n\n` +
      `¡Gracias por participar!`
    );
    
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
    
    // Marcar como notificado
    enviarNotificacionGanador(ganador.id);
    setNotificacionesEnviadas(prev => new Set(prev).add(ganador.id));
    toast.success(`Mensaje de WhatsApp preparado para ${ganador.usuario.nombre}`);
  };

  const handleEnviarEmail = (ganador: Ganador) => {
    const email = ganador.usuario.email;
    if (!email) {
      toast.error('El ganador no tiene email registrado');
      return;
    }
    
    const asunto = encodeURIComponent(`¡Felicitaciones! Ganaste en el sorteo "${sorteo.titulo}"`);
    const cuerpo = encodeURIComponent(
      `Hola ${ganador.usuario.nombre} ${ganador.usuario.apellido},\n\n` +
      `¡Felicitaciones! Has sido seleccionado como ganador del ${ganador.puesto}° puesto en el sorteo "${sorteo.titulo}".\n\n` +
      `═══════════════════════════════════════\n` +
      `🎁 PREMIO GANADO\n` +
      `═══════════════════════════════════════\n` +
      `Nombre: ${ganador.premio.nombre}\n` +
      `Descripción: ${ganador.premio.descripcion}\n` +
      `Valor: ${ganador.premio.valor}\n\n` +
      `═══════════════════════════════════════\n` +
      `TUS DATOS\n` +
      `═══════════════════════════════════════\n` +
      `Nombre: ${ganador.usuario.nombre} ${ganador.usuario.apellido}\n` +
      `Email: ${ganador.usuario.email}\n` +
      `Teléfono: ${ganador.usuario.telefono}\n` +
      `DNI: ${ganador.usuario.dni}\n\n` +
      `Por favor, respondé a este email o contactanos por teléfono para coordinar la entrega de tu premio.\n\n` +
      `¡Gracias por participar en nuestros sorteos!\n\n` +
      `Saludos,\n` +
      `Equipo Hiper del Pollo`
    );
    
    window.open(`mailto:${email}?subject=${asunto}&body=${cuerpo}`, '_blank');
    
    // Marcar como notificado
    enviarNotificacionGanador(ganador.id);
    setNotificacionesEnviadas(prev => new Set(prev).add(ganador.id));
    toast.success(`Email preparado para ${ganador.usuario.nombre}`);
  };

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

  const ganadoresNotificados = sorteoGanadores.filter(g => 
    notificacionesEnviadas.has(g.id) || g.notificado
  ).length;

  return (
    <div className="min-h-screen w-full pb-24 relative">
      {/* Pantalla de carga cuando está sorteando */}
      {isSorting && <SorteandoLoading />}
      
      {/* Efectos de celebración cuando aparecen los ganadores */}
      {showCelebration && <CelebrationEffects />}

      {/* Header */}
      <div className="bg-pollo-marron px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-pollo-lg relative overflow-hidden">
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex gap-2">
              {onEditarSorteo && (
                <button
                  onClick={onEditarSorteo}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/30 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/80 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
          
          <h1 className="text-2xl font-black text-white mb-1">Realizar Sorteo</h1>
          <p className="text-white/80 text-sm">{sorteo.titulo}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {!showResults ? (
          <>
            {/* Info Card */}
            <div className="card-premium mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-pollo-marron rounded-xl flex items-center justify-center">
                  <Gift className="w-8 h-8 text-pollo-amarillo" />
                </div>
                <div>
                  <h2 className="font-bold text-pollo-marron">{sorteo.titulo}</h2>
                  <p className="text-sm text-pollo-marron/60">{sorteo.descripcion}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-pollo-fondo-claro rounded-xl p-3 text-center">
                  <Users className="w-5 h-5 text-pollo-marron mx-auto mb-1" />
                  <p className="text-xl font-bold text-pollo-marron">{participantesSorteo.length}</p>
                  <p className="text-xs text-pollo-marron/60">Participantes</p>
                </div>
                <div className="bg-pollo-fondo-claro rounded-xl p-3 text-center">
                  <Trophy className="w-5 h-5 text-pollo-marron mx-auto mb-1" />
                  <p className="text-xl font-bold text-pollo-marron">{sorteo.premios.length}</p>
                  <p className="text-xs text-pollo-marron/60">Premios</p>
                </div>
              </div>
            </div>

            {/* Premios */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-pollo-marron mb-3">Premios a sortear</h3>
              <div className="space-y-3">
                {sorteo.premios.map((premio) => (
                  <div key={premio.id} className="card-pollo flex items-center gap-4">
                    <div className={`w-12 h-12 ${getPositionColor(premio.puesto)} rounded-xl flex items-center justify-center`}>
                      {getPositionIcon(premio.puesto)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-pollo-marron">{premio.nombre}</p>
                      <p className="text-sm text-pollo-marron font-semibold">{premio.valor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            {participantesSorteo.length >= 1 ? (
              <button
                onClick={handleRealizarSorteo}
                disabled={isSorting}
                className="w-full btn-primary text-lg py-5 flex items-center justify-center gap-3"
              >
                <Play className="w-6 h-6" />
                Realizar Sorteo
              </button>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600 font-semibold">No hay participantes</p>
                <p className="text-sm text-red-500">Se necesita al menos 1 participante para realizar el sorteo</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Results */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-soft shadow-xl bg-primary text-primary-foreground">
                <PartyPopper className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-black text-pollo-marron">¡Ganadores!</h2>
              <p className="text-pollo-marron/60">Sorteo realizado exitosamente</p>
            </div>

            {/* Estado de notificaciones */}
            <div className={`mb-6 p-4 rounded-2xl ${ganadoresNotificados === sorteoGanadores.length ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ganadoresNotificados === sorteoGanadores.length ? 'bg-green-500' : 'bg-yellow-500'}`}>
                  {ganadoresNotificados === sorteoGanadores.length ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className={`font-bold ${ganadoresNotificados === sorteoGanadores.length ? 'text-green-700' : 'text-yellow-700'}`}>
                    {ganadoresNotificados === sorteoGanadores.length 
                      ? 'Todos los ganadores fueron notificados ' 
                      : `Contactados: ${ganadoresNotificados} de ${sorteoGanadores.length}`}
                  </p>
                  <p className={`text-sm ${ganadoresNotificados === sorteoGanadores.length ? 'text-green-600' : 'text-yellow-600'}`}>
                    {ganadoresNotificados === sorteoGanadores.length 
                      ? 'Excelente trabajo' 
                      : 'Usá los botones de contacto para notificar a cada ganador'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {sorteoGanadores.map((ganador) => (
                <div 
                  key={ganador.id}
                  className="card-premium relative overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${ganador.puesto * 200}ms` }}
                >
                  <div className={`absolute top-0 left-0 w-full h-1.5 ${getPositionColor(ganador.puesto)}`} />
                  
                  {/* Badge de notificado */}
                  {(notificacionesEnviadas.has(ganador.id) || ganador.notificado) && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Contactado
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${getPositionColor(ganador.puesto)} rounded-xl flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl font-black text-white">#{ganador.puesto}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getPositionIcon(ganador.puesto)}
                        <span className="text-xs font-bold text-pollo-marron/60 uppercase">
                          {ganador.puesto === 1 ? 'Primer' : ganador.puesto === 2 ? 'Segundo' : ganador.puesto === 3 ? 'Tercer' : `${ganador.puesto}°`} Puesto
                        </span>
                      </div>
                      <h3 className="font-bold text-pollo-marron text-lg">
                        {ganador.usuario.nombre} {ganador.usuario.apellido}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-pollo-marron/60">
                        <Mail className="w-3 h-3" />
                        {ganador.usuario.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-pollo-marron/60">
                        <Phone className="w-3 h-3" />
                        {ganador.usuario.telefono || 'Sin teléfono'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-pollo-amarillo/20">
                    <p className="text-xs text-pollo-marron/50 mb-1">PREMIO GANADO:</p>
                    <p className="font-bold text-pollo-marron">{ganador.premio.nombre}</p>
                    <p className="text-sm text-pollo-marron font-semibold">{ganador.premio.valor}</p>
                  </div>

                  {/* Botones de contacto */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleEnviarWhatsApp(ganador)}
                      disabled={!ganador.usuario.telefono}
                      className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleEnviarEmail(ganador)}
                      className="flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      Email
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onBack}
              className="w-full btn-secondary text-lg py-4 mt-6"
            >
              Volver al Panel
            </button>
          </>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-scale-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-pollo-marron text-center mb-2">
              ¿Eliminar sorteo?
            </h3>
            <p className="text-pollo-marron/60 text-center mb-2">
              Estás a punto de eliminar el sorteo:
            </p>
            <p className="font-bold text-pollo-marron text-center mb-6">
              "{sorteo.titulo}"
            </p>
            <p className="text-sm text-red-500 text-center mb-6">
              Esta acción no se puede deshacer. Se eliminarán todos los datos del sorteo, participaciones y ganadores.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-pollo-marron border-2 border-pollo-amarillo/30"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarSorteo}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-red-500"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
