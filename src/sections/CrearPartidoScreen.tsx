import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ArrowLeft, Trophy, Calendar, MapPin, Clock, Save, Image as ImageIcon, Video, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Partido, Equipo, FaseMundial, EstadoPartido } from '@/types';

interface CrearPartidoScreenProps {
  onBack: () => void;
  partido?: Partido | null; // Si se pasa, es para editar
}

const fasesMundial: { value: FaseMundial; label: string }[] = [
  { value: 'fase-grupos', label: 'Fase de Grupos' },
  { value: 'dieciseisavos', label: 'Dieciseisavos de Final' },
  { value: 'octavos', label: 'Octavos de Final' },
  { value: 'cuartos', label: 'Cuartos de Final' },
  { value: 'semifinales', label: 'Semifinales' },
  { value: 'tercer-puesto', label: 'Tercer Puesto' },
  { value: 'final', label: 'Gran Final' }
];

const estadosPartido: { value: EstadoPartido; label: string }[] = [
  { value: 'programado', label: 'Programado' },
  { value: 'en-vivo', label: 'En Vivo' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cancelado', label: 'Cancelado' }
];

const grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

// Equipos predefinidos para el Mundial 2026
const equiposPredefinidos: Equipo[] = [
  // Grupo A
  { id: 'mex', nombre: 'México', codigo: 'MEX', bandera: 'https://flagcdn.com/w160/mx.png', grupo: 'A' },
  { id: 'rsa', nombre: 'Sudáfrica', codigo: 'RSA', bandera: 'https://flagcdn.com/w160/za.png', grupo: 'A' },
  { id: 'kor', nombre: 'República de Corea', codigo: 'KOR', bandera: 'https://flagcdn.com/w160/kr.png', grupo: 'A' },
  { id: 'cze', nombre: 'República Checa', codigo: 'CZE', bandera: 'https://flagcdn.com/w160/cz.png', grupo: 'A' },
  // Grupo B
  { id: 'can', nombre: 'Canadá', codigo: 'CAN', bandera: 'https://flagcdn.com/w160/ca.png', grupo: 'B' },
  { id: 'bih', nombre: 'Bosnia y Herzegovina', codigo: 'BIH', bandera: 'https://flagcdn.com/w160/ba.png', grupo: 'B' },
  { id: 'qat', nombre: 'Catar', codigo: 'QAT', bandera: 'https://flagcdn.com/w160/qa.png', grupo: 'B' },
  { id: 'sui', nombre: 'Suiza', codigo: 'SUI', bandera: 'https://flagcdn.com/w160/ch.png', grupo: 'B' },
  // Grupo C
  { id: 'bra', nombre: 'Brasil', codigo: 'BRA', bandera: 'https://flagcdn.com/w160/br.png', grupo: 'C' },
  { id: 'mar', nombre: 'Marruecos', codigo: 'MAR', bandera: 'https://flagcdn.com/w160/ma.png', grupo: 'C' },
  { id: 'hai', nombre: 'Haití', codigo: 'HAI', bandera: 'https://flagcdn.com/w160/ht.png', grupo: 'C' },
  { id: 'sco', nombre: 'Escocia', codigo: 'SCO', bandera: 'https://flagcdn.com/w160/gb-sct.png', grupo: 'C' },
  // Grupo D
  { id: 'usa', nombre: 'Estados Unidos', codigo: 'USA', bandera: 'https://flagcdn.com/w160/us.png', grupo: 'D' },
  { id: 'par', nombre: 'Paraguay', codigo: 'PAR', bandera: 'https://flagcdn.com/w160/py.png', grupo: 'D' },
  { id: 'aus', nombre: 'Australia', codigo: 'AUS', bandera: 'https://flagcdn.com/w160/au.png', grupo: 'D' },
  { id: 'tur', nombre: 'Turquía', codigo: 'TUR', bandera: 'https://flagcdn.com/w160/tr.png', grupo: 'D' },
  // Grupo E
  { id: 'ger', nombre: 'Alemania', codigo: 'GER', bandera: 'https://flagcdn.com/w160/de.png', grupo: 'E' },
  { id: 'cuw', nombre: 'Curazao', codigo: 'CUW', bandera: 'https://flagcdn.com/w160/cw.png', grupo: 'E' },
  { id: 'civ', nombre: 'Costa de Marfil', codigo: 'CIV', bandera: 'https://flagcdn.com/w160/ci.png', grupo: 'E' },
  { id: 'ecu', nombre: 'Ecuador', codigo: 'ECU', bandera: 'https://flagcdn.com/w160/ec.png', grupo: 'E' },
  // Grupo F
  { id: 'ned', nombre: 'Países Bajos', codigo: 'NED', bandera: 'https://flagcdn.com/w160/nl.png', grupo: 'F' },
  { id: 'jpn', nombre: 'Japón', codigo: 'JPN', bandera: 'https://flagcdn.com/w160/jp.png', grupo: 'F' },
  { id: 'swe', nombre: 'Suecia', codigo: 'SWE', bandera: 'https://flagcdn.com/w160/se.png', grupo: 'F' },
  { id: 'tun', nombre: 'Túnez', codigo: 'TUN', bandera: 'https://flagcdn.com/w160/tn.png', grupo: 'F' },
  // Grupo G
  { id: 'bel', nombre: 'Bélgica', codigo: 'BEL', bandera: 'https://flagcdn.com/w160/be.png', grupo: 'G' },
  { id: 'egy', nombre: 'Egipto', codigo: 'EGY', bandera: 'https://flagcdn.com/w160/eg.png', grupo: 'G' },
  { id: 'irn', nombre: 'RI de Irán', codigo: 'IRN', bandera: 'https://flagcdn.com/w160/ir.png', grupo: 'G' },
  { id: 'nzl', nombre: 'Nueva Zelanda', codigo: 'NZL', bandera: 'https://flagcdn.com/w160/nz.png', grupo: 'G' },
  // Grupo H
  { id: 'esp', nombre: 'España', codigo: 'ESP', bandera: 'https://flagcdn.com/w160/es.png', grupo: 'H' },
  { id: 'cpv', nombre: 'Cabo Verde', codigo: 'CPV', bandera: 'https://flagcdn.com/w160/cv.png', grupo: 'H' },
  { id: 'ksa', nombre: 'Arabia Saudí', codigo: 'KSA', bandera: 'https://flagcdn.com/w160/sa.png', grupo: 'H' },
  { id: 'uru', nombre: 'Uruguay', codigo: 'URU', bandera: 'https://flagcdn.com/w160/uy.png', grupo: 'H' },
  // Grupo I
  { id: 'fra', nombre: 'Francia', codigo: 'FRA', bandera: 'https://flagcdn.com/w160/fr.png', grupo: 'I' },
  { id: 'sen', nombre: 'Senegal', codigo: 'SEN', bandera: 'https://flagcdn.com/w160/sn.png', grupo: 'I' },
  { id: 'irq', nombre: 'Irak', codigo: 'IRQ', bandera: 'https://flagcdn.com/w160/iq.png', grupo: 'I' },
  { id: 'nor', nombre: 'Noruega', codigo: 'NOR', bandera: 'https://flagcdn.com/w160/no.png', grupo: 'I' },
  // Grupo J
  { id: 'arg', nombre: 'Argentina', codigo: 'ARG', bandera: 'https://flagcdn.com/w160/ar.png', grupo: 'J' },
  { id: 'alg', nombre: 'Argelia', codigo: 'ALG', bandera: 'https://flagcdn.com/w160/dz.png', grupo: 'J' },
  { id: 'aut', nombre: 'Austria', codigo: 'AUT', bandera: 'https://flagcdn.com/w160/at.png', grupo: 'J' },
  { id: 'jor', nombre: 'Jordania', codigo: 'JOR', bandera: 'https://flagcdn.com/w160/jo.png', grupo: 'J' },
  // Grupo K
  { id: 'por', nombre: 'Portugal', codigo: 'POR', bandera: 'https://flagcdn.com/w160/pt.png', grupo: 'K' },
  { id: 'cod', nombre: 'RD de Congo', codigo: 'COD', bandera: 'https://flagcdn.com/w160/cd.png', grupo: 'K' },
  { id: 'uzb', nombre: 'Uzbekistán', codigo: 'UZB', bandera: 'https://flagcdn.com/w160/uz.png', grupo: 'K' },
  { id: 'col', nombre: 'Colombia', codigo: 'COL', bandera: 'https://flagcdn.com/w160/co.png', grupo: 'K' },
  // Grupo L
  { id: 'eng', nombre: 'Inglaterra', codigo: 'ENG', bandera: 'https://flagcdn.com/w160/gb-eng.png', grupo: 'L' },
  { id: 'cro', nombre: 'Croacia', codigo: 'CRO', bandera: 'https://flagcdn.com/w160/hr.png', grupo: 'L' },
  { id: 'gha', nombre: 'Ghana', codigo: 'GHA', bandera: 'https://flagcdn.com/w160/gh.png', grupo: 'L' },
  { id: 'pan', nombre: 'Panamá', codigo: 'PAN', bandera: 'https://flagcdn.com/w160/pa.png', grupo: 'L' },
];

const estadios = [
  'Estadio Azteca - Ciudad de México',
  'Estadio BBVA - Monterrey',
  'Estadio Akron - Guadalajara',
  'AT&T Stadium - Dallas',
  'NRG Stadium - Houston',
  'SoFi Stadium - Los Ángeles',
  'MetLife Stadium - New York',
  'Hard Rock Stadium - Miami',
  'Levi\'s Stadium - San Francisco',
  'Lumen Field - Seattle',
  'Mercedes-Benz Stadium - Atlanta',
  'Gillette Stadium - Boston',
  'BMO Field - Toronto',
  'BC Place - Vancouver',
  'Lincoln Financial Field - Filadelfia',
  'Arrowhead Stadium - Kansas City'
];

// Componente de Select compatible con móviles
interface MobileFriendlySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
}

function MobileFriendlySelect({ value, onValueChange, options, placeholder, label }: MobileFriendlySelectProps) {
  const isMobile = useIsMobile();
  
  // En móviles, usar select nativo de HTML para mejor compatibilidad
  if (isMobile) {
    return (
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full h-10 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pollo-amarillo focus:border-pollo-amarillo appearance-none"
          style={{ 
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1rem'
          }}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  // En desktop, usar el Select de shadcn/ui
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder || label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CrearPartidoScreen({ onBack, partido }: CrearPartidoScreenProps) {
  const { crearPartido, actualizarPartido, sorteos } = useStore();
  const isEditando = !!partido;

  // Estados del formulario
  const [fase, setFase] = useState<FaseMundial>(partido?.fase || 'fase-grupos');
  const [grupo, setGrupo] = useState<string>(partido?.grupo || 'A');
  const [equipoLocal, setEquipoLocal] = useState<string>(partido?.equipoLocal.id || '');
  const [equipoVisitante, setEquipoVisitante] = useState<string>(partido?.equipoVisitante.id || '');
  const [fecha, setFecha] = useState<string>(partido?.fecha || '');
  const [hora, setHora] = useState<string>(partido?.hora || '');
  const [estadio, setEstadio] = useState<string>(partido?.estadio || '');
  const [ciudad, setCiudad] = useState<string>(partido?.ciudad || '');
  const [estado, setEstado] = useState<EstadoPartido>(partido?.estado || 'programado');
  const [golesLocal, setGolesLocal] = useState<string>(partido?.golesLocal?.toString() || '');
  const [golesVisitante, setGolesVisitante] = useState<string>(partido?.golesVisitante?.toString() || '');
  const [imagen, setImagen] = useState<string>(partido?.imagen || '');
  const [video, setVideo] = useState<string>(partido?.video || '');
  const [descripcion, setDescripcion] = useState<string>(partido?.descripcion || '');
  const [sorteoId, setSorteoId] = useState<string>(partido?.sorteoId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Filtrar equipos por grupo si es fase de grupos
  const equiposFiltrados = fase === 'fase-grupos' 
    ? equiposPredefinidos.filter(e => e.grupo === grupo)
    : equiposPredefinidos;

  const handleSubmit = async () => {
    // Validaciones
    const errores: string[] = [];
    
    if (!equipoLocal || !equipoVisitante) {
      errores.push('Debes seleccionar ambos equipos');
    }
    if (equipoLocal && equipoVisitante && equipoLocal === equipoVisitante) {
      errores.push('Los equipos no pueden ser iguales');
    }
    if (!fecha) errores.push('La fecha del partido es obligatoria');
    if (!hora) errores.push('La hora del partido es obligatoria');
    if (!estadio) errores.push('El estadio es obligatorio');
    if (!ciudad) errores.push('La ciudad es obligatoria');
    if (estado === 'finalizado' && (golesLocal === '' || golesVisitante === '')) {
      errores.push('Debes ingresar el resultado final del partido');
    }

    if (errores.length > 0) {
      setValidationErrors(errores);
      return;
    }
    
    setValidationErrors([]);
    setIsSubmitting(true);

    try {
      const equipoLocalObj = equiposPredefinidos.find(e => e.id === equipoLocal)!;
      const equipoVisitanteObj = equiposPredefinidos.find(e => e.id === equipoVisitante)!;

      const partidoData = {
        equipoLocal: equipoLocalObj,
        equipoVisitante: equipoVisitanteObj,
        fecha,
        hora,
        estadio,
        ciudad,
        fase,
        grupo: fase === 'fase-grupos' ? grupo : undefined,
        estado,
        golesLocal: estado === 'finalizado' ? parseInt(golesLocal) : undefined,
        golesVisitante: estado === 'finalizado' ? parseInt(golesVisitante) : undefined,
        imagen: imagen || undefined,
        video: video || undefined,
        descripcion: descripcion || undefined,
        sorteoId: sorteoId || undefined
      };

      if (isEditando && partido) {
        const success = actualizarPartido(partido.id, partidoData);
        if (success) {
          setShowSuccessDialog(true);
          setTimeout(() => {
            setShowSuccessDialog(false);
            onBack();
          }, 2000);
        } else {
          toast.error('No se pudo actualizar el partido');
        }
      } else {
        crearPartido(partidoData);
        setShowSuccessDialog(true);
        setTimeout(() => {
          setShowSuccessDialog(false);
          onBack();
        }, 2000);
      }
    } catch (error) {
      toast.error('Error al guardar el partido');
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="text-lg font-black text-pollo-marron">
              {isEditando ? 'Editar Partido' : 'Crear Partido'}
            </h1>
            <p className="text-xs text-gray-500">Mundial 2026</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Errores de validación */}
        {validationErrors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="font-bold text-red-700">Corregir errores:</p>
            </div>
            <ul className="list-disc list-inside text-sm text-red-600">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Fase y Grupo */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-bold text-pollo-marron flex items-center gap-2">
              <Trophy className="w-4 h-4 text-pollo-marron" />
              Fase del Torneo
            </h3>

            <div className="space-y-2">
              <Label>Fase</Label>
              <Select value={fase} onValueChange={(v) => setFase(v as FaseMundial)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar fase" />
                </SelectTrigger>
                <SelectContent>
                  {fasesMundial.map(f => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {fase === 'fase-grupos' && (
              <div className="space-y-2">
                <Label>Grupo</Label>
                <div className="grid grid-cols-6 gap-1">
                  {grupos.map(g => (
                    <button
                      key={g}
                      onClick={() => {
                        setGrupo(g);
                        setEquipoLocal('');
                        setEquipoVisitante('');
                      }}
                      className={`h-10 rounded-lg font-bold text-sm transition-all ${
                        grupo === g
                          ? 'bg-pollo-amarillo text-pollo-marron'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Equipos */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-bold text-pollo-marron">Equipos</h3>

            <div className="space-y-2">
              <Label>Equipo Local</Label>
              <Select value={equipoLocal} onValueChange={setEquipoLocal}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo local" />
                </SelectTrigger>
                <SelectContent>
                  {equiposFiltrados.map(equipo => (
                    <SelectItem key={equipo.id} value={equipo.id}>
                      <div className="flex items-center gap-2">
                        <img src={equipo.bandera} alt={equipo.nombre} className="w-5 h-3 object-cover rounded" />
                        <span>{equipo.nombre}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Equipo Visitante</Label>
              <Select value={equipoVisitante} onValueChange={setEquipoVisitante}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo visitante" />
                </SelectTrigger>
                <SelectContent>
                  {equiposFiltrados.map(equipo => (
                    <SelectItem key={equipo.id} value={equipo.id}>
                      <div className="flex items-center gap-2">
                        <img src={equipo.bandera} alt={equipo.nombre} className="w-5 h-3 object-cover rounded" />
                        <span>{equipo.nombre}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Fecha y Lugar */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-bold text-pollo-marron flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pollo-marron" />
              Fecha y Lugar
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Hora</Label>
                <Input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estadio</Label>
              <Select value={estadio} onValueChange={(v) => {
                setEstadio(v);
                const ciudadEstadio = v.split(' - ')[1];
                if (ciudadEstadio) setCiudad(ciudadEstadio);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estadio" />
                </SelectTrigger>
                <SelectContent>
                  {estadios.map(est => (
                    <SelectItem key={est} value={est}>{est}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ciudad</Label>
              <Input
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Ciudad donde se juega el partido"
              />
            </div>
          </CardContent>
        </Card>

        {/* Estado y Resultado */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-bold text-pollo-marron">Estado del Partido</h3>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={estado} onValueChange={(v) => setEstado(v as EstadoPartido)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {estadosPartido.map(e => (
                    <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {estado === 'finalizado' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Goles Local</Label>
                  <Input
                    type="number"
                    min="0"
                    value={golesLocal}
                    onChange={(e) => setGolesLocal(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Goles Visitante</Label>
                  <Input
                    type="number"
                    min="0"
                    value={golesVisitante}
                    onChange={(e) => setGolesVisitante(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>


        {/* Sorteo Asociado */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-bold text-pollo-marron">Sorteo Asociado</h3>
            
            <div className="space-y-2">
              <Label>Sorteo</Label>
              <MobileFriendlySelect
                value={sorteoId}
                onValueChange={setSorteoId}
                placeholder="Seleccionar sorteo"
              options={[
                { value: '', label: 'Sin sorteo asociado' },
                ...sorteos.map(sorteo => ({
                  value: sorteo.id,
                  label: `${sorteo.titulo} (${sorteo.estado})`
                }))
              ]}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de éxito */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="text-center py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-xl font-black text-pollo-marron">
              {isEditando ? '¡Partido actualizado!' : '¡Partido creado exitosamente!'}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditando ? 'Los cambios se guardaron correctamente' : 'El partido fue registrado con éxito'}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Botón Guardar (Sticky) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 max-w-md mx-auto">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-pollo-amarillo hover:bg-pollo-amarillo text-pollo-marron font-bold py-3"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 animate-spin" />
              Guardando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {isEditando ? 'Guardar Cambios' : 'Crear Partido'}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
