import { useState, useRef } from 'react';
import { ArrowLeft, Plus, X, Upload, Calendar, Users, AlertCircle, Check, Trash2, Trophy, Gift } from 'lucide-react';
import { useStore } from '@/store';
import type { Sorteo, Premio, RequisitoPersonalizado, TipoSorteo } from '@/types';

interface CrearSorteoScreenProps {
  onBack: () => void;
  sorteoEditar?: Sorteo | null;
}

export function CrearSorteoScreen({ onBack, sorteoEditar }: CrearSorteoScreenProps) {
  const { crearSorteo, actualizarSorteo } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const premioFileInputRef = useRef<HTMLInputElement>(null);
  const [premioEditando, setPremioEditando] = useState<number | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: sorteoEditar?.titulo || '',
    descripcion: sorteoEditar?.descripcion || '',
    imagen: sorteoEditar?.imagen || '',
    fechaInicio: sorteoEditar?.fechaInicio || '',
    fechaFin: sorteoEditar?.fechaFin || '',
    fechaSorteo: sorteoEditar?.fechaSorteo || '',
    edadMinima: sorteoEditar?.edadMinima || 18,
    edadMaxima: sorteoEditar?.edadMaxima || '',
    maxParticipantes: sorteoEditar?.maxParticipantes || '',
    terminosCondiciones: sorteoEditar?.terminosCondiciones || '',
    estado: sorteoEditar?.estado || 'activo' as const,
    requisitos: sorteoEditar?.requisitos || ['Ser mayor de 18 años', 'Residir en Posadas'],
    requisitosPersonalizados: sorteoEditar?.requisitosPersonalizados || [],
    tipoSorteo: sorteoEditar?.tipoSorteo || 'posiciones' as TipoSorteo,
    cantidadGanadores: sorteoEditar?.cantidadGanadores || 3,
    premios: sorteoEditar?.premios || [
      { id: 'premio-1', puesto: 1, nombre: '', descripcion: '', imagen: '', valor: '' },
      { id: 'premio-2', puesto: 2, nombre: '', descripcion: '', imagen: '', valor: '' },
      { id: 'premio-3', puesto: 3, nombre: '', descripcion: '', imagen: '', valor: '' }
    ] as Premio[]
  });

  const [nuevoRequisito, setNuevoRequisito] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAgregarRequisito = () => {
    if (nuevoRequisito.trim()) {
      setFormData(prev => ({
        ...prev,
        requisitos: [...prev.requisitos, nuevoRequisito.trim()]
      }));
      setNuevoRequisito('');
    }
  };

  const handleEliminarRequisito = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requisitos: prev.requisitos.filter((_, i) => i !== index)
    }));
  };

  const handleAgregarRequisitoPersonalizado = () => {
    const nuevoReq: RequisitoPersonalizado = {
      id: `req-${Date.now()}`,
      tipo: 'texto',
      label: '',
      descripcion: '',
      requerido: true
    };
    setFormData(prev => ({
      ...prev,
      requisitosPersonalizados: [...prev.requisitosPersonalizados, nuevoReq]
    }));
  };

  const handleActualizarRequisitoPersonalizado = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      requisitosPersonalizados: prev.requisitosPersonalizados.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      )
    }));
  };

  const handleEliminarRequisitoPersonalizado = (id: string) => {
    setFormData(prev => ({
      ...prev,
      requisitosPersonalizados: prev.requisitosPersonalizados.filter(r => r.id !== id)
    }));
  };

  const handleImagenSorteoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagen: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagenPremioChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          premios: prev.premios.map((p, i) =>
            i === index ? { ...p, imagen: reader.result as string } : p
          )
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActualizarPremio = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      premios: prev.premios.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  const validarFormulario = (): boolean => {
    const errores: string[] = [];
    
    if (!formData.titulo.trim()) errores.push('El título es obligatorio');
    if (!formData.descripcion.trim()) errores.push('La descripción es obligatoria');
    if (!formData.fechaInicio) errores.push('La fecha de inicio es obligatoria');
    if (!formData.fechaFin) errores.push('La fecha de cierre es obligatoria');
    if (!formData.fechaSorteo) errores.push('La fecha del sorteo es obligatoria');
    
    // Validar que la fecha de sorteo sea posterior a la fecha de cierre
    if (formData.fechaSorteo && formData.fechaFin) {
      if (new Date(formData.fechaSorteo) <= new Date(formData.fechaFin)) {
        errores.push('La fecha del sorteo debe ser posterior a la fecha de cierre');
      }
    }
    
    // Validar premios
    formData.premios.forEach((premio, index) => {
      if (!premio.nombre.trim()) errores.push(`El premio ${index + 1} necesita un nombre`);
    });
    
    setErrors(errores);
    return errores.length === 0;
  };

  const handleGuardar = () => {
    if (!validarFormulario()) return;

    const sorteoData = {
      ...formData,
      edadMaxima: formData.edadMaxima ? Number(formData.edadMaxima) : undefined,
      maxParticipantes: formData.maxParticipantes ? Number(formData.maxParticipantes) : undefined,
      tipoSorteo: formData.tipoSorteo,
      cantidadGanadores: formData.tipoSorteo === 'cantidad' ? formData.cantidadGanadores : undefined
    };

    if (sorteoEditar) {
      actualizarSorteo(sorteoEditar.id, sorteoData);
    } else {
      crearSorteo(sorteoData);
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onBack();
    }, 2500);
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
          
          <h1 className="text-2xl font-black text-white mb-1">
            {sorteoEditar ? 'Editar Sorteo' : 'Crear Nuevo Sorteo'}
          </h1>
          <p className="text-white/80 text-sm">
            {sorteoEditar ? 'Modifica los datos del sorteo' : 'Configura un nuevo sorteo'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Mensaje de éxito animado */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-8 mx-6 text-center shadow-2xl animate-scale-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-xl font-black text-pollo-marron mb-1">
                {sorteoEditar ? '¡Sorteo actualizado!' : '¡Sorteo creado exitosamente!'}
              </p>
              <p className="text-sm text-gray-500">
                {sorteoEditar ? 'Los cambios se guardaron correctamente' : 'El sorteo fue registrado con éxito'}
              </p>
            </div>
          </div>
        )}

        {/* Errores */}
        {errors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="font-bold text-red-700">Corregir errores:</p>
            </div>
            <ul className="list-disc list-inside text-sm text-red-600">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Información básica */}
        <div className="card-premium">
          <h2 className="text-lg font-bold text-pollo-marron mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-pollo-marron" />
            Información del Sorteo
          </h2>
          
          <div className="space-y-4">
            {/* Imagen del sorteo */}
            <div>
              <label className="block text-sm font-medium text-pollo-marron mb-2">
                Imagen del Sorteo
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 bg-pollo-fondo-claro rounded-2xl border-2 border-dashed border-pollo-marron/30 flex flex-col items-center justify-center cursor-pointer hover:bg-pollo-fondo transition-colors"
              >
                {formData.imagen ? (
                  <img src={formData.imagen} alt="Sorteo" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-pollo-marron mb-2" />
                    <p className="text-sm text-pollo-marron/60">Click para subir imagen</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImagenSorteoChange}
                className="hidden"
              />
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-pollo-marron mb-1">
                Título del Sorteo *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                placeholder="Ej: Sorteo Aniversario 2025"
                className="w-full px-4 py-3 rounded-xl border border-pollo-marron/30 focus:border-pollo-amarillo focus:ring-2 focus:ring-pollo-amarillo/20 outline-none"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-pollo-marron mb-1">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Describe el sorteo..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-pollo-marron/30 focus:border-pollo-amarillo focus:ring-2 focus:ring-pollo-amarillo/20 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Fechas */}
        <div className="card-premium">
          <h2 className="text-lg font-bold text-pollo-marron mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-pollo-marron" />
            Fechas Importantes
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-pollo-marron mb-1">
                  Inicio de Inscripción *
                </label>
                <input
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pollo-marron/30 focus:border-pollo-amarillo focus:ring-2 focus:ring-pollo-amarillo/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pollo-marron mb-1">
                  Cierre de Inscripción *
                </label>
                <input
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pollo-marron/30 focus:border-pollo-amarillo focus:ring-2 focus:ring-pollo-amarillo/20 outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-pollo-marron mb-1">
                Fecha del Sorteo *
              </label>
              <input
                type="date"
                value={formData.fechaSorteo}
                onChange={(e) => handleInputChange('fechaSorteo', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-pollo-marron/30 focus:border-pollo-amarillo focus:ring-2 focus:ring-pollo-amarillo/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Estado del Sorteo */}
        <div className="card-premium">
          <h2 className="text-lg font-bold text-pollo-marron mb-4 flex items-center gap-2">
            Estado del Sorteo
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleInputChange('estado', 'activo')}
              className={`p-3 rounded-xl border-2 transition-all ${
                formData.estado === 'activo'
                  ? 'border-green-500 bg-green-50'
                  : 'border-pollo-marron/30 hover:border-green-300'
              }`}
            >
              <p className="font-bold text-sm text-pollo-marron">Activo</p>
              <p className="text-xs text-pollo-marron/60">Visible y abierto</p>
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('estado', 'proximo')}
              className={`p-3 rounded-xl border-2 transition-all ${
                formData.estado === 'proximo'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-pollo-marron/30 hover:border-blue-300'
              }`}
            >
              <p className="font-bold text-sm text-pollo-marron">Programado</p>
              <p className="text-xs text-pollo-marron/60">Próximamente</p>
            </button>
          </div>
        </div>

        {/* Restricciones de edad */}
        <div className="card-premium">
          <h2 className="text-lg font-bold text-pollo-marron mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-pollo-marron" />
            Restricciones de Edad
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-pollo-marron mb-1">
                Edad Mínima
              </label>
              <input
                type="number"
                min="0"
                value={formData.edadMinima}
                onChange={(e) => handleInputChange('edadMinima', Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-pollo-marron/30 focus:border-pollo-amarillo focus:ring-2 focus:ring-pollo-amarillo/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pollo-marron mb-1">
                Edad Máxima (opcional)
              </label>
              <input
                type="number"
                min="0"
                value={formData.edadMaxima}
                onChange={(e) => handleInputChange('edadMaxima', e.target.value)}
                placeholder="Sin límite"
                className="w-full px-4 py-3 rounded-xl border border-pollo-marron/30 focus:border-pollo-amarillo focus:ring-2 focus:ring-pollo-amarillo/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Requisitos */}
        <div className="card-premium">
          <h2 className="text-lg font-bold text-pollo-marron mb-4">Requisitos para Participar</h2>
          
          <div className="space-y-3">
            {formData.requisitos.map((requisito, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-pollo-amarillo/10 rounded-xl">
                <span className="flex-1 text-sm text-pollo-marron">{requisito}</span>
                <button
                  onClick={() => handleEliminarRequisito(index)}
                  className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
            
            <div className="flex gap-2">
              <input
                type="text"
                value={nuevoRequisito}
                onChange={(e) => setNuevoRequisito(e.target.value)}
                placeholder="Agregar nuevo requisito..."
                onKeyPress={(e) => e.key === 'Enter' && handleAgregarRequisito()}
                className="flex-1 px-4 py-3 rounded-xl border border-pollo-marron/30 focus:border-pollo-amarillo focus:ring-2 focus:ring-pollo-amarillo/20 outline-none"
              />
              <button
                onClick={handleAgregarRequisito}
                className="px-4 py-3 bg-pollo-amarillo text-white rounded-xl font-semibold hover:bg-pollo-amarillo/90 transition-colors"
              >
                <Plus className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Requisitos Personalizados */}
        <div className="card-premium">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-pollo-marron">Requisitos Personalizados</h2>
            <button
              onClick={handleAgregarRequisitoPersonalizado}
              className="px-3 py-2 bg-pollo-amarillo text-pollo-marron rounded-lg text-sm font-semibold hover:bg-pollo-amarillo/90 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.requisitosPersonalizados.map((req) => (
              <div key={req.id} className="p-4 bg-pollo-amarillo/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <select
                    value={req.tipo}
                    onChange={(e) => handleActualizarRequisitoPersonalizado(req.id, 'tipo', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-pollo-marron/30 text-sm"
                  >
                    <option value="texto">Texto</option>
                    <option value="numero">Número</option>
                    <option value="fecha">Fecha</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="select">Selección</option>
                  </select>
                  <button
                    onClick={() => handleEliminarRequisitoPersonalizado(req.id)}
                    className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                
                <input
                  type="text"
                  value={req.label}
                  onChange={(e) => handleActualizarRequisitoPersonalizado(req.id, 'label', e.target.value)}
                  placeholder="Etiqueta del campo"
                  className="w-full px-3 py-2 rounded-lg border border-pollo-marron/30 text-sm"
                />
                
                <input
                  type="text"
                  value={req.descripcion || ''}
                  onChange={(e) => handleActualizarRequisitoPersonalizado(req.id, 'descripcion', e.target.value)}
                  placeholder="Descripción (opcional)"
                  className="w-full px-3 py-2 rounded-lg border border-pollo-marron/30 text-sm"
                />
                
                {req.tipo === 'select' && (
                  <input
                    type="text"
                    value={req.opciones?.join(', ') || ''}
                    onChange={(e) => handleActualizarRequisitoPersonalizado(req.id, 'opciones', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="Opciones separadas por coma"
                    className="w-full px-3 py-2 rounded-lg border border-pollo-marron/30 text-sm"
                  />
                )}
                
                <label className="flex items-center gap-2 text-sm text-pollo-marron">
                  <input
                    type="checkbox"
                    checked={req.requerido}
                    onChange={(e) => handleActualizarRequisitoPersonalizado(req.id, 'requerido', e.target.checked)}
                    className="w-4 h-4"
                  />
                  Campo requerido
                </label>
              </div>
            ))}
            
            {formData.requisitosPersonalizados.length === 0 && (
              <p className="text-sm text-pollo-marron/50 text-center py-4">
                No hay requisitos personalizados. Agrega uno si es necesario.
              </p>
            )}
          </div>
        </div>

        {/* Tipo de Sorteo y Premios */}
        <div className="card-premium">
          <h2 className="text-lg font-bold text-pollo-marron mb-4">Configuración de Premios</h2>
          
          {/* Selector de tipo de sorteo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-pollo-marron mb-2">
              Tipo de Sorteo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange('tipoSorteo', 'posiciones')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.tipoSorteo === 'posiciones'
                    ? 'border-pollo-amarillo bg-pollo-amarillo/10'
                    : 'border-pollo-marron/30 hover:border-pollo-amarillo/50'
                }`}
              >
                <div className="text-center">
                  <Trophy className={`w-6 h-6 mx-auto mb-1 ${formData.tipoSorteo === 'posiciones' ? 'text-pollo-marron' : 'text-pollo-marron/50'}`} />
                  <p className="font-bold text-pollo-marron text-sm">Por Posiciones</p>
                  <p className="text-xs text-pollo-marron/60 mt-1">1°, 2°, 3° lugar</p>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => handleInputChange('tipoSorteo', 'cantidad')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.tipoSorteo === 'cantidad'
                    ? 'border-pollo-amarillo bg-pollo-amarillo/10'
                    : 'border-pollo-marron/30 hover:border-pollo-amarillo/50'
                }`}
              >
                <div className="text-center">
                  <Users className={`w-6 h-6 mx-auto mb-1 ${formData.tipoSorteo === 'cantidad' ? 'text-pollo-marron' : 'text-pollo-marron/50'}`} />
                  <p className="font-bold text-pollo-marron text-sm">Por Cantidad</p>
                  <p className="text-xs text-pollo-marron/60 mt-1">N ganadores iguales</p>
                </div>
              </button>
            </div>
          </div>
          
          {/* Cantidad de ganadores/puestos */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-pollo-marron mb-2">
              {formData.tipoSorteo === 'cantidad' ? 'Cantidad de Ganadores' : 'Cantidad de Puestos'}
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const newValue = Math.max(1, (formData.tipoSorteo === 'cantidad' ? formData.cantidadGanadores : formData.premios.length) - 1);
                  if (formData.tipoSorteo === 'cantidad') {
                    handleInputChange('cantidadGanadores', newValue);
                  } else {
                    // Remover el último premio
                    setFormData(prev => ({
                      ...prev,
                      premios: prev.premios.slice(0, -1)
                    }));
                  }
                }}
                disabled={formData.tipoSorteo === 'cantidad' ? formData.cantidadGanadores <= 1 : formData.premios.length <= 1}
                className="w-10 h-10 bg-pollo-amarillo/20 rounded-xl flex items-center justify-center hover:bg-pollo-amarillo/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="text-xl font-bold text-pollo-marron">−</span>
              </button>
              
              <input
                type="number"
                min="1"
                value={formData.tipoSorteo === 'cantidad' ? formData.cantidadGanadores : formData.premios.length}
                onChange={(e) => {
                  const value = Math.max(1, parseInt(e.target.value) || 1);
                  if (formData.tipoSorteo === 'cantidad') {
                    handleInputChange('cantidadGanadores', value);
                  } else {
                    // Ajustar la cantidad de premios
                    const currentLength = formData.premios.length;
                    if (value > currentLength) {
                      // Agregar premios
                      const newPremios = [...formData.premios];
                      for (let i = currentLength + 1; i <= value; i++) {
                        newPremios.push({
                          id: `premio-${Date.now()}-${i}`,
                          puesto: i,
                          nombre: '',
                          descripcion: '',
                          imagen: ''
                        });
                      }
                      setFormData(prev => ({ ...prev, premios: newPremios }));
                    } else if (value < currentLength) {
                      // Remover premios
                      setFormData(prev => ({ ...prev, premios: prev.premios.slice(0, value) }));
                    }
                  }
                }}
                className="w-20 px-3 py-3 text-center rounded-xl border border-pollo-marron/30 focus:border-pollo-amarillo focus:ring-2 focus:ring-pollo-amarillo/20 outline-none font-bold text-lg"
              />
              
              <button
                type="button"
                onClick={() => {
                  if (formData.tipoSorteo === 'cantidad') {
                    handleInputChange('cantidadGanadores', formData.cantidadGanadores + 1);
                  } else {
                    // Agregar un nuevo premio
                    const newPuesto = formData.premios.length + 1;
                    setFormData(prev => ({
                      ...prev,
                      premios: [...prev.premios, {
                        id: `premio-${Date.now()}-${newPuesto}`,
                        puesto: newPuesto,
                        nombre: '',
                        descripcion: '',
                        imagen: '',
                        valor: ''
                      }]
                    }));
                  }
                }}
                className="w-10 h-10 bg-pollo-amarillo/20 rounded-xl flex items-center justify-center hover:bg-pollo-amarillo/30 transition-colors"
              >
                <span className="text-xl font-bold text-pollo-marron">+</span>
              </button>
            </div>
            <p className="text-xs text-pollo-marron/60 mt-2">
              {formData.tipoSorteo === 'cantidad' 
                ? 'Todos los ganadores recibirán el mismo premio' 
                : 'Definí un premio para cada puesto'}
            </p>
          </div>
          
          {/* Premios */}
          <h3 className="font-bold text-pollo-marron mb-3">
            {formData.tipoSorteo === 'cantidad' ? 'Premio' : 'Premios por Puesto'}
          </h3>
          
          <div className="space-y-4">
            {formData.premios.map((premio, index) => (
              <div key={premio.id} className="p-4 bg-pollo-amarillo/10 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-pollo-amarillo rounded-lg flex items-center justify-center">
                    {formData.tipoSorteo === 'cantidad' ? (
                      <Gift className="w-4 h-4 text-pollo-marron" />
                    ) : (
                      <span className="text-pollo-marron font-bold text-sm">{premio.puesto}°</span>
                    )}
                  </div>
                  <span className="font-bold text-pollo-marron">
                    {formData.tipoSorteo === 'cantidad' ? 'Premio para todos' : `Puesto ${premio.puesto}`}
                  </span>
                </div>
                
                
                
                
                <input
                  type="text"
                  value={premio.nombre}
                  onChange={(e) => handleActualizarPremio(index, 'nombre', e.target.value)}
                  placeholder={formData.tipoSorteo === 'cantidad' ? 'Nombre del premio' : `Nombre del ${premio.puesto}° premio`}
                  className="w-full px-3 py-2 rounded-lg border border-pollo-marron/30 mb-2 text-sm"
                />
                
                <input
                  type="text"
                  value={premio.descripcion}
                  onChange={(e) => handleActualizarPremio(index, 'descripcion', e.target.value)}
                  placeholder="Descripción del premio"
                  className="w-full px-3 py-2 rounded-lg border border-pollo-marron/30 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Términos y condiciones */}
        <div className="card-premium">
          <h2 className="text-lg font-bold text-pollo-marron mb-4">Términos y Condiciones</h2>
          <textarea
            value={formData.terminosCondiciones}
            onChange={(e) => handleInputChange('terminosCondiciones', e.target.value)}
            placeholder="Ingresa los términos y condiciones del sorteo..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-pollo-marron/30 focus:border-pollo-amarillo focus:ring-2 focus:ring-pollo-amarillo/20 outline-none resize-none text-sm"
          />
        </div>

        {/* Botón guardar */}
        <button
          onClick={handleGuardar}
          className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          {sorteoEditar ? 'Guardar Cambios' : 'Crear Sorteo'}
        </button>
      </div>
    </div>
  );
}
