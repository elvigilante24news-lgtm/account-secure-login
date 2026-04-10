import { useState } from 'react';
import { ArrowLeft, Gift, Calendar, Users, Check, Sparkles, Trophy, AlertCircle, Clock, Share2, Target, TrendingUp, ShieldAlert, X, MessageCircle, Instagram, Facebook, FileText } from 'lucide-react';
import { useStore } from '@/store';
import type { Sorteo } from '@/types';
import { toast } from 'sonner';

interface SorteoDetailScreenProps {
  sorteo: Sorteo;
  onBack: () => void;
  onIrAPartido?: (partidoId: string) => void;
}

export function SorteoDetailScreen({ sorteo, onBack, onIrAPartido }: SorteoDetailScreenProps) {
  const { user, esAdmin, verificarParticipacion, partidos, prediccionesHabilitadas, participarEnSorteo } = useStore();
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);
  
  const yaParticipa = user ? verificarParticipacion(sorteo.id) : false;
  
  // Buscar el partido relacionado con este sorteo
  const partidoRelacionado = partidos.find(p => p.sorteoId === sorteo.id);

  // Determinar si se puede participar directamente (sin predicción)
  const participacionDirecta = !prediccionesHabilitadas || !partidoRelacionado;

  const handleIrAPartido = () => {
    if (!user) {
      setError('Debes iniciar sesión para participar');
      return;
    }
    if (esAdmin) {
      setError('Los administradores del sorteo no pueden participar de los sorteos');
      return;
    }

    if (participacionDirecta) {
      // Participación directa sin predicción
      handleParticiparDirecto();
    } else if (partidoRelacionado && onIrAPartido) {
      onIrAPartido(partidoRelacionado.id);
    } else {
      setError('No hay un partido disponible para este sorteo');
    }
  };

  const handleParticiparDirecto = async () => {
    setIsParticipating(true);
    try {
      const success = await participarEnSorteo(sorteo.id);
      if (success) {
        toast.success('¡Ya estás participando del sorteo!');
      } else {
        setError('Ya estás participando de este sorteo');
      }
    } catch {
      setError('Error al participar');
    } finally {
      setIsParticipating(false);
    }
  };

  const getMedalColor = (puesto: number) => {
    switch (puesto) {
      case 1: return 'bg-pollo-amarillo';
      case 2: return 'bg-pollo-marron';
      case 3: return 'bg-pollo-marron/70';
      default: return 'bg-pollo-amarillo';
    }
  };

  const getStatusBadge = () => {
    const baseClass = 'px-3 py-1 rounded-full text-xs font-bold text-white';
    switch (sorteo.estado) {
      case 'activo': return <span className={`${baseClass} bg-green-500`}>Sorteo Activo</span>;
      case 'proximo': return <span className={`${baseClass} bg-blue-500`}>Próximamente</span>;
      case 'finalizado': return <span className={`${baseClass} bg-gray-500`}>Finalizado</span>;
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const shareOnWhatsApp = () => {
    const text = `¡Participa en el sorteo "${sorteo.titulo}" de Hiper del Pollo! 🎉\n\n${sorteo.descripcion}\n\nPremios increíbles te esperan. ¡Crea tu cuenta y participa ahora! 🎁\n\nhttps://hiperdelpollo.com/sorteo/${sorteo.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnInstagram = () => {
    const text = `¡Participa en el sorteo "${sorteo.titulo}" de Hiper del Pollo! 🎉\n\n${sorteo.descripcion}\n\n¡Crea tu cuenta y participa ahora! 🎁`;
    navigator.clipboard.writeText(text);
    alert('¡Texto copiado al portapapeles! Ahora puedes pegarlo en Instagram.');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://hiperdelpollo.com/sorteo/${sorteo.id}`)}&quote=${encodeURIComponent(`¡Participa en el sorteo "${sorteo.titulo}" de Hiper del Pollo! 🎉`)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    const url = `https://hiperdelpollo.com/sorteo/${sorteo.id}`;
    navigator.clipboard.writeText(url);
    alert('¡Enlace copiado al portapapeles!');
  };

  return (
    <div className="min-h-screen w-full">
      {/* Header Image */}
      <div className="relative h-56 bg-pollo-marron overflow-hidden">
        {sorteo.imagen ? (
          <img src={sorteo.imagen} alt={sorteo.titulo} className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-12 left-6 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-pollo-marron" />
        </button>

        {/* Share button */}
        <button 
          onClick={handleShare}
          className="absolute top-12 right-6 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
        >
          <Share2 className="w-5 h-5 text-pollo-marron" />
        </button>

        {/* Content */}
        {!sorteo.imagen && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto">
                <Gift className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 -mt-8 relative z-10 pb-8">
        <div className="card-premium">
          {/* Status Badge */}
          <div className="mb-3">
            {getStatusBadge()}
          </div>
          
          <h1 className="text-2xl font-black text-pollo-marron mb-2">{sorteo.titulo}</h1>
          <p className="text-pollo-marron/70 leading-relaxed">{sorteo.descripcion}</p>

          {/* Stats */}
          <div className="flex gap-3 mt-6">
            <div className="flex-1 rounded-xl p-3 text-center bg-[sidebar-accent-foreground] bg-stone-300">
              <div className="flex items-center justify-center mb-1">
                <Users className="w-5 h-5 text-pollo-marron" />
              </div>
              <p className="text-lg font-bold text-pollo-marron">{sorteo.participantes.toLocaleString()}</p>
              <p className="text-xs text-pollo-marron/70">Participantes</p>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center bg-stone-300">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-5 h-5 text-pollo-marron" />
              </div>
              <p className="text-lg font-bold text-pollo-marron">
                {new Date(sorteo.fechaSorteo).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-xs text-pollo-marron/70">Fecha del sorteo</p>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center bg-stone-300">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-5 h-5 text-pollo-marron" />
              </div>
              <p className="text-lg font-bold text-pollo-marron">
                {Math.ceil((new Date(sorteo.fechaFin).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-xs text-pollo-marron/70">Días restantes</p>
            </div>
          </div>
        </div>

        {/* Cómo participar */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-pollo-marron mb-3">¿Cómo participar?</h2>
          <div className="bg-pollo-amarillo/20 rounded-xl p-4 border-2 border-pollo-amarillo">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-pollo-amarillo rounded-xl flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-pollo-marron" />
              </div>
              <div className="flex-1">
                {participacionDirecta ? (
                  <>
                    <h3 className="font-bold text-pollo-marron">¡Participá directamente!</h3>
                    <p className="text-sm text-pollo-marron/70 mt-1">
                      Hacé clic en el botón de participar y ya estarás dentro del sorteo.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-pollo-marron">Predecí el resultado</h3>
                    <p className="text-sm text-pollo-marron/70 mt-1">
                      Para participar en este sorteo, debés predecir el resultado del partido relacionado.
                    </p>
                    <div className="flex items-center gap-2 mt-3 p-2 bg-green-50 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-green-600 font-medium text-sm">Si acertás: TRIPLE CHANCE</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded-lg">
                      <span className="w-4 h-4 flex items-center justify-center text-gray-400 flex-shrink-0">•</span>
                      <span className="text-pollo-marron/60 text-sm">Si no acertás: 1 chance</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Advertencia para Administradores */}
        {esAdmin && (
          <div className="mt-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-700 mb-1">
                    Acceso restringido
                  </h3>
                  <p className="text-sm text-red-600">
                    Los administradores del sorteo no pueden participar de los sorteos ni predecir resultados. 
                    Como administrador, tu función es gestionar los sorteos y partidos, no participar en ellos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requisitos */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-pollo-marron mb-3">Requisitos</h2>
          <div className="space-y-2">
            {sorteo.requisitos.map((requisito, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-pollo-fondo-claro/80 rounded-xl border border-green-400 bg-green-200">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-pollo-marron">{requisito}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Premios */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-pollo-marron mb-3">
            {sorteo.tipoSorteo === 'cantidad' ? 'Premio' : 'Premios'}
          </h2>
          <div className="space-y-3">
            {sorteo.premios.map((premio) => (
              <div 
                key={premio.id}
                className="card-pollo relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${getMedalColor(premio.puesto)}`} />
                
                <div className="flex items-center gap-4 pl-3">
                  <div className={`w-14 h-14 ${getMedalColor(premio.puesto)} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                    {premio.puesto === 1 ? <Trophy className="w-7 h-7 text-pollo-marron" /> :
                     premio.puesto === 2 ? <Trophy className="w-6 h-6 text-pollo-amarillo" /> :
                     <Sparkles className="w-6 h-6 text-pollo-amarillo" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${premio.puesto === 1 ? 'bg-pollo-amarillo text-pollo-marron' : 'bg-pollo-marron text-pollo-amarillo'}`}>
                        {sorteo.tipoSorteo === 'cantidad' ? 'GANADOR' : `${premio.puesto}° PUESTO`}
                      </span>
                    </div>
                    <h3 className="font-bold text-pollo-marron mt-1">{premio.nombre}</h3>
                    <p className="text-sm text-pollo-marron/60">{premio.descripcion}</p>
                    <p className="text-sm font-bold mt-1 text-primary-foreground">{premio.valor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {sorteo.tipoSorteo === 'cantidad' && sorteo.cantidadGanadores && (
            <p className="text-sm text-pollo-marron/60 mt-2 text-center">
              Se sortearán <strong>{sorteo.cantidadGanadores} ganadores</strong> con el mismo premio
            </p>
          )}
        </div>

        {/* Términos y Condiciones */}
        {sorteo.terminosCondiciones && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-pollo-marron mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Términos y Condiciones
            </h2>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-pollo-marron/70 whitespace-pre-wrap">{sorteo.terminosCondiciones}</p>
            </div>
          </div>
        )}

        {/* Action Button - Al final del contenido */}
        <div className="mt-8 pt-4 border-t border-pollo-amarillo/20">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {sorteo.estado === 'activo' && (
            <button
              onClick={handleIrAPartido}
              disabled={yaParticipa || esAdmin || isParticipating}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                yaParticipa
                  ? 'bg-green-500 text-white cursor-default'
                  : esAdmin
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {isParticipating ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : yaParticipa ? (
                <>
                  <Check className="w-5 h-5" />
                  Ya estás participando
                </>
              ) : esAdmin ? (
                <>
                  <ShieldAlert className="w-5 h-5" />
                  No disponible para administradores
                </>
              ) : participacionDirecta ? (
                <>
                  <Gift className="w-5 h-5" />
                  Participar del Sorteo
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  Predecir y Participar
                </>
              )}
            </button>
          )}

          {sorteo.estado === 'proximo' && (
            <button
              disabled
              className="w-full py-4 rounded-2xl font-bold text-lg bg-gray-200 text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Próximamente
            </button>
          )}

          {sorteo.estado === 'finalizado' && (
            <button
              disabled
              className="w-full py-4 rounded-2xl font-bold text-lg bg-gray-200 text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Sorteo Finalizado
            </button>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          />
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-pollo-marron">Compartir sorteo</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <p className="text-pollo-marron/70 text-sm mb-6">
              Invita a tus amigos a participar en "{sorteo.titulo}"
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareOnWhatsApp}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors border border-green-200"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-700">WhatsApp</span>
              </button>

              <button
                onClick={shareOnInstagram}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-purple-700">Instagram</span>
              </button>

              <button
                onClick={shareOnFacebook}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Facebook className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-700">Facebook</span>
              </button>

              <button
                onClick={copyLink}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Copiar link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
