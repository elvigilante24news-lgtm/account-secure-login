import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, Calendar, MapPin, CreditCard, Check, Sparkles, MailCheck } from 'lucide-react';
import { DateWheelPicker } from '@/components/DateWheelPicker';
import { useStore } from '@/store';

interface RegisterScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  onLogin: () => void;
}

export function RegisterScreen({ onBack, onSuccess, onLogin }: RegisterScreenProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationScreen, setShowVerificationScreen] = useState(false);
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    dni: '',
    fechaNacimiento: '',
    ciudad: ''
  });
  
  const register = useStore(state => state.register);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password || !confirmPassword) {
      setError('Completá todos los campos');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.telefono || !formData.dni || !formData.fechaNacimiento || !formData.ciudad) {
      setError('Completá todos los campos');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await register(formData);
      if (success) {
        setShowVerificationScreen(true);
      }
    } catch (err: any) {
      const msg = err?.message || 'Error al registrar. Intenta de nuevo.';
      setError(msg);
      if (msg.includes('email')) {
        setStep(1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerificationScreen) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-pollo-marron/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -left-20 w-56 h-56 bg-pollo-marron/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <MailCheck className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-pollo-marron mb-3">
            ¡Verificá tu correo!
          </h1>
          <p className="text-pollo-marron/70 mb-2">
            Te enviamos un email de verificación a:
          </p>
          <p className="font-bold text-pollo-marron mb-6">
            {formData.email}
          </p>
          <p className="text-sm text-pollo-marron/60 mb-8">
            Revisá tu bandeja de entrada (y spam) y hacé clic en el enlace para activar tu cuenta.
          </p>
          <button
            onClick={onSuccess}
            className="w-full btn-primary text-lg py-4"
          >
            Entendido, ir al inicio
          </button>
          <button
            onClick={onLogin}
            className="mt-4 text-pollo-marron/60 hover:text-pollo-marron font-semibold text-sm"
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pollo-marron/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-56 h-56 bg-pollo-marron/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-4">
        <button
          onClick={step === 1 ? onBack : () => setStep(1)}
          className="w-10 h-10 bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md border border-pollo-marron/20"
        >
          <ArrowLeft className="w-5 h-5 text-pollo-marron" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-8 relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto relative mb-3">
            <div className="absolute inset-0 bg-pollo-amarillo rounded-xl rotate-6 opacity-30" />
            <div className="absolute inset-0 bg-pollo-amarillo rounded-xl flex items-center justify-center shadow-pollo">
              <Sparkles className="w-7 h-7 text-pollo-marron" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-pollo-marron">
            Crear Cuenta
          </h1>
          <p className="text-pollo-marron/60 mt-1 text-sm">
            Paso {step} de 2
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-pollo-amarillo' : 'bg-pollo-marron/30'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-pollo-amarillo' : 'bg-pollo-marron/30'}`} />
        </div>

        {/* Form */}
        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="space-y-4 flex-1">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {step === 1 ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-pollo-marron">
                    Nombre
                  </label>
                  <div className="input-with-icon">
                    <User className="input-icon w-4 h-4" strokeWidth={2} />
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => updateField('nombre', e.target.value)}
                      placeholder="Tu nombre"
                      className="input-pollo"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-pollo-marron">
                    Apellido
                  </label>
                  <div className="input-with-icon">
                    <User className="input-icon w-4 h-4" strokeWidth={2} />
                    <input
                      type="text"
                      value={formData.apellido}
                      onChange={(e) => updateField('apellido', e.target.value)}
                      placeholder="Tu apellido"
                      className="input-pollo"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-pollo-marron">
                  Email
                </label>
                <div className="input-with-icon">
                  <Mail className="input-icon w-5 h-5" strokeWidth={2} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="tu@email.com"
                    className="input-pollo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-pollo-marron">
                  Contraseña
                </label>
                <div className="input-with-icon">
                  <Lock className="input-icon w-5 h-5" strokeWidth={2} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="input-pollo has-right-icon"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="right-icon w-5 h-5"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={2} /> : <Eye className="w-5 h-5" strokeWidth={2} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-pollo-marron">
                  Confirmar Contraseña
                </label>
                <div className="input-with-icon">
                  <Lock className="input-icon w-5 h-5" strokeWidth={2} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    placeholder="Repetí tu contraseña"
                    className="input-pollo has-right-icon"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="right-icon w-5 h-5"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" strokeWidth={2} /> : <Eye className="w-5 h-5" strokeWidth={2} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary mt-4"
              >
                Continuar
              </button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-pollo-marron">
                  Teléfono
                </label>
                <div className="input-with-icon">
                  <Phone className="input-icon w-5 h-5" strokeWidth={2} />
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.telefono}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      updateField('telefono', val);
                    }}
                    placeholder="Tu número de teléfono"
                    className="input-pollo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-pollo-marron">
                  DNI
                </label>
                <div className="input-with-icon">
                  <CreditCard className="input-icon w-5 h-5" strokeWidth={2} />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.dni}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      updateField('dni', val);
                    }}
                    placeholder="Tu D.N.I."
                    className="input-pollo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-pollo-marron">
                  Fecha de Nacimiento
                </label>
                <div className="input-with-icon">
                  <Calendar className="input-icon w-5 h-5" strokeWidth={2} />
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(true)}
                    className="input-pollo text-left w-full"
                  >
                    {formData.fechaNacimiento
                      ? new Date(formData.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
                      : <span className="text-pollo-marron/40">Seleccionar fecha</span>}
                  </button>
                </div>
                {showDatePicker && (
                  <DateWheelPicker
                    value={formData.fechaNacimiento}
                    onCancel={() => setShowDatePicker(false)}
                    onConfirm={(date) => {
                      updateField('fechaNacimiento', date);
                      setShowDatePicker(false);
                    }}
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-pollo-marron">
                  Ciudad
                </label>
                <div className="input-with-icon">
                  <MapPin className="input-icon w-5 h-5" strokeWidth={2} />
                  <input
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => updateField('ciudad', e.target.value)}
                    placeholder="Tu ciudad"
                    className="input-pollo"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-pollo-amarillo/10 rounded-xl">
                <Check className="w-5 h-5 text-pollo-amarillo flex-shrink-0 mt-0.5" />
                <p className="text-xs text-pollo-marron/70">
                  Al registrarte, aceptás los <button type="button" onClick={() => window.open('/terminos-y-condiciones', '_blank')} className="underline font-semibold text-pollo-marron hover:text-pollo-amarillo">términos y condiciones</button> y la <button type="button" onClick={() => window.open('/politica-de-privacidad', '_blank')} className="underline font-semibold text-pollo-marron hover:text-pollo-amarillo">política de privacidad</button> de Hiper del Pollo.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary text-lg py-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="text-center pt-6">
          <p className="text-pollo-marron/60">
            ¿Ya tenés cuenta?{' '}
            <button
              onClick={onLogin}
              className="text-pollo-marron font-bold hover:text-pollo-marron transition-colors"
            >
              Iniciá sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
