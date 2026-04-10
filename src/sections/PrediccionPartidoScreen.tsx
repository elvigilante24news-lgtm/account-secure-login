import { useState } from 'react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trophy, Calendar, MapPin, Clock, AlertCircle, TrendingUp, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import type { Partido, Prediccion } from '@/types';

interface PrediccionPartidoScreenProps {
  partido: Partido;
  onBack: () => void;
  onPrediccionConfirmada?: (prediccion: Prediccion) => void;
}

export function PrediccionPartidoScreen({ partido, onBack, onPrediccionConfirmada }: PrediccionPartidoScreenProps) {
  const { user, esAdmin, realizarPrediccion, verificarPrediccion, sorteos } = useStore();
  const [golesLocal, setGolesLocal] = useState<string>('');
  const [golesVisitante, setGolesVisitante] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediccionRealizada, setPrediccionRealizada] = useState(false);

  const sorteo = sorteos.find(s => s.id === partido.sorteoId);
  const prediccionExistente = verificarPrediccion(partido.id);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para realizar una predicción');
      return;
    }

    // Verificar si el usuario es administrador
    if (esAdmin) {
      toast.error('Los administradores del sorteo no pueden participar de los sorteos', {
        description: 'Solo los usuarios regulares pueden predecir y participar.',
      });
      return;
    }

    if (golesLocal === '' || golesVisitante === '') {
      toast.error('Debes ingresar ambos resultados');
      return;
    }

    const golesL = parseInt(golesLocal);
    const golesV = parseInt(golesVisitante);

    if (isNaN(golesL) || isNaN(golesV) || golesL < 0 || golesV < 0) {
      toast.error('Los goles deben ser números válidos');
      return;
    }

    if (golesL > 20 || golesV > 20) {
      toast.error('El máximo de goles permitido es 20');
      return;
    }

    setIsSubmitting(true);

    try {
      const prediccion = await realizarPrediccion(
        partido.id,
        partido.sorteoId || '',
        golesL,
        golesV
      );

      if (prediccion) {
        setPrediccionRealizada(true);
        toast.success('¡Predicción registrada con éxito!', {
          description: 'Ya estás participando del sorteo. Si acertás, tendrás TRIPLE CHANCE.',
        });
        // Redirigir a la pantalla de confirmación
        if (onPrediccionConfirmada) {
          onPrediccionConfirmada(prediccion);
        }
      } else {
        toast.error('No se pudo registrar la predicción. ¿Ya habías pronosticado este partido?');
      }
    } catch (error) {
      toast.error('Error al registrar la predicción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFecha = (fecha: string, hora: string) => {
    const date = new Date(`${fecha}T${hora}`);
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Si ya predijo o la predicción fue exitosa, mostrar confirmación
  if (prediccionExistente || prediccionRealizada) {
    return (
      <div className="min-h-screen bg-green-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-green-200 px-4 py-3">
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
              <h1 className="text-lg font-black text-green-700">¡Predicción Guardada!</h1>
            </div>
          </div>
        </div>

        <div className="p-4">
          <Card className="border-green-300 bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-xl font-black text-green-700 mb-2">
                ¡Ya estás participando!
              </h2>
              
              <p className="text-gray-600 text-sm mb-4">
                Tu predicción ha sido registrada correctamente. Si acertás el resultado, 
                tendrás <strong>TRIPLE CHANCE</strong> de ganar el sorteo.
              </p>

              {/* Resumen de la predicción */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-500 mb-2">Tu predicción:</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <img 
                      src={partido.equipoLocal.bandera} 
                      alt={partido.equipoLocal.nombre}
                      className="w-10 h-6 object-cover rounded mx-auto mb-1"
                    />
                    <span className="text-xs">{partido.equipoLocal.codigo}</span>
                  </div>
                  <div className="text-2xl font-black text-pollo-marron">
                    {prediccionExistente ? `${prediccionExistente.golesLocal} - ${prediccionExistente.golesVisitante}` : `${golesLocal} - ${golesVisitante}`}
                  </div>
                  <div className="text-center">
                    <img 
                      src={partido.equipoVisitante.bandera} 
                      alt={partido.equipoVisitante.nombre}
                      className="w-10 h-6 object-cover rounded mx-auto mb-1"
                    />
                    <span className="text-xs">{partido.equipoVisitante.codigo}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={onBack}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Ver más partidos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <h1 className="text-lg font-black text-pollo-marron">Realizar Predicción</h1>
            <p className="text-xs text-gray-500">Mundial 2026</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Info del Partido */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            {/* Fecha y lugar */}
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatFecha(partido.fecha, partido.hora)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{partido.hora} hs</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{partido.estadio}, {partido.ciudad}</span>
              </div>
            </div>

            {partido.grupo && (
              <Badge className="mb-3 bg-pollo-marron text-white">
                Grupo {partido.grupo}
              </Badge>
            )}

            {/* Equipos */}
            <div className="flex items-center justify-between">
              {/* Local */}
              <div className="flex flex-col items-center flex-1">
                <img 
                  src={partido.equipoLocal.bandera} 
                  alt={partido.equipoLocal.nombre}
                  className="w-16 h-10 object-cover rounded shadow-md mb-2"
                />
                <span className="font-bold text-center">{partido.equipoLocal.nombre}</span>
                <span className="text-xs text-gray-500">{partido.equipoLocal.codigo}</span>
              </div>

              {/* VS */}
              <div className="px-6">
                <div className="text-xl font-black text-gray-400">VS</div>
              </div>

              {/* Visitante */}
              <div className="flex flex-col items-center flex-1">
                <img 
                  src={partido.equipoVisitante.bandera} 
                  alt={partido.equipoVisitante.nombre}
                  className="w-16 h-10 object-cover rounded shadow-md mb-2"
                />
                <span className="font-bold text-center">{partido.equipoVisitante.nombre}</span>
                <span className="text-xs text-gray-500">{partido.equipoVisitante.codigo}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advertencia para Administradores */}
        {esAdmin && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-red-700 mb-1">
                    Acceso restringido
                  </h3>
                  <p className="text-sm text-red-600">
                    Los administradores del sorteo no pueden participar de los sorteos ni predecir resultados. 
                    Esta función está disponible solo para usuarios regulares.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulario de Predicción */}
        <Card className={`border-pollo-amarillo ${esAdmin ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardContent className="p-4">
            <h3 className="font-bold text-pollo-marron mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-pollo-marron" />
              ¿Cuál será el resultado?
            </h3>

            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Goles Local */}
              <div className="text-center">
                <label className="text-xs text-gray-500 mb-2 block">
                  {partido.equipoLocal.codigo}
                </label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={golesLocal}
                  onChange={(e) => setGolesLocal(e.target.value)}
                  className="w-20 h-16 text-3xl font-black text-center border-2 border-pollo-amarillo focus:border-pollo-amarillo"
                  placeholder="-"
                />
              </div>

              <div className="text-2xl font-black text-gray-300">-</div>

              {/* Goles Visitante */}
              <div className="text-center">
                <label className="text-xs text-gray-500 mb-2 block">
                  {partido.equipoVisitante.codigo}
                </label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={golesVisitante}
                  onChange={(e) => setGolesVisitante(e.target.value)}
                  className="w-20 h-16 text-3xl font-black text-center border-2 border-pollo-amarillo focus:border-pollo-amarillo"
                  placeholder="-"
                />
              </div>
            </div>

            {/* Banner de Participación Automática */}
            <div className="bg-green-500 rounded-xl p-3 mb-4 text-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">
                  ¡Al confirmar, participás automáticamente del sorteo!
                </p>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || golesLocal === '' || golesVisitante === ''}
              className="w-full bg-pollo-amarillo hover:bg-pollo-amarillo text-pollo-marron font-bold py-3 text-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  Guardando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Predecir y Participar
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info Triple Chance */}
        <div className="bg-pollo-fondo-claro rounded-xl p-4 border-2 border-pollo-marron/20">
          <div className="flex items-start gap-3">
            <div className="bg-pollo-marron p-2 rounded-xl shrink-0 shadow-lg">
              <TrendingUp className="w-5 h-5 text-pollo-amarillo" />
            </div>
            <div>
              <h4 className="font-bold text-pollo-marron text-sm">¿Cómo funciona?</h4>
              <ul className="text-xs text-pollo-marron/80 mt-2 space-y-1">
                <li className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> Predecís el resultado
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> Participás automáticamente del sorteo
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-pollo-amarillo">★</span> Si acertás: <strong>TRIPLE CHANCE</strong> (x3)
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-gray-400">•</span> Si no acertás: participás con 1 chance
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Premios del Sorteo */}
        {sorteo && (
          <Card>
            <CardContent className="p-4">
              <h4 className="font-bold text-pollo-marron text-sm mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-pollo-marron" />
                Premios del Sorteo
              </h4>
              <div className="space-y-2">
                {sorteo.premios.slice(0, 3).map((premio, index) => (
                  <div key={premio.id} className="flex items-center gap-2 text-sm">
                    <Badge className={`${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                    } text-white text-xs`}>
                      {premio.puesto}°
                    </Badge>
                    <span className="text-gray-700 truncate">{premio.nombre}</span>
                    <span className="text-pollo-marron font-bold ml-auto">{premio.valor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nota */}
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            Una vez realizada la predicción, no podrás modificarla. 
            Asegúrate de verificar el resultado antes de confirmar.
          </p>
        </div>
      </div>
    </div>
  );
}
