import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useStore } from '@/store';

interface RecuperarPasswordScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function RecuperarPasswordScreen({ onBack, onSuccess }: RecuperarPasswordScreenProps) {
  const [step, setStep] = useState<'email' | 'code' | 'newPassword' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  
  const { solicitarRecuperacion, verificarCodigo, cambiarPassword } = useStore();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await solicitarRecuperacion(email);
      if (result.success) {
        setGeneratedCode(result.codigo || '');
        setStep('code');
      } else {
        setError(result.mensaje || 'No se encontró una cuenta con ese email');
      }
    } catch (err) {
      setError('Error al procesar la solicitud. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }
    
    const isValid = await verificarCodigo(email, code);
    if (isValid) {
      setStep('newPassword');
    } else {
      setError('Código incorrecto. Intenta de nuevo.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }
    
    try {
      const success = await cambiarPassword(email, newPassword);
      if (success) {
        setStep('success');
      } else {
        setError('Error al cambiar la contraseña. Intenta de nuevo.');
      }
    } catch (err) {
      setError('Error al cambiar la contraseña. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pollo-amarillo/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-56 h-56 bg-pollo-marron/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md border border-pollo-marron/20 hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-pollo-marron" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-8 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto relative mb-4">
            <div className="absolute inset-0 bg-pollo-amarillo rounded-2xl rotate-6 opacity-30" />
            <div className="absolute inset-0 bg-pollo-amarillo rounded-2xl flex items-center justify-center shadow-pollo">
              <Sparkles className="w-8 h-8 text-pollo-marron" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-pollo-marron">
            {step === 'email' && 'Recuperar Contraseña'}
            {step === 'code' && 'Verificar Código'}
            {step === 'newPassword' && 'Nueva Contraseña'}
            {step === 'success' && '¡Listo!'}
          </h1>
          <p className="text-pollo-marron/60 mt-1 text-sm">
            {step === 'email' && 'Ingresá tu email para recuperar tu cuenta'}
            {step === 'code' && 'Te enviamos un código de 6 dígitos'}
            {step === 'newPassword' && 'Creá una nueva contraseña segura'}
            {step === 'success' && 'Tu contraseña fue cambiada exitosamente'}
          </p>
        </div>

        {/* Forms */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4 flex-1">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center flex items-center justify-center gap-2">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-pollo-marron mb-2">
                Email
              </label>
              <div className="input-with-icon">
                <Mail className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="input-pollo"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-lg py-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Enviar Código'
              )}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-4 flex-1">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center flex items-center justify-center gap-2">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            )}

            {/* Código de demostración (solo para pruebas) */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-700 text-center font-medium">
                Código de recuperación:
              </p>
              <p className="text-2xl font-black text-green-600 text-center tracking-widest mt-1">
                {generatedCode}
              </p>
              <p className="text-xs text-green-600/70 text-center mt-1">
                (En producción se enviaría por email)
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-pollo-marron mb-2">
                Código de 6 dígitos
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="input-pollo text-center text-2xl tracking-widest w-full"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2"
            >
              Verificar Código
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-sm text-pollo-marron font-semibold hover:text-pollo-marron transition-colors py-2"
            >
              Volver a enviar código
            </button>
          </form>
        )}

        {step === 'newPassword' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 flex-1">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center flex items-center justify-center gap-2">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-pollo-marron mb-2">
                Nueva Contraseña
              </label>
              <div className="input-with-icon">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-pollo has-right-icon"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="right-icon"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-pollo-marron/50 mt-1 ml-1">
                Mínimo 6 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-pollo-marron mb-2">
                Confirmar Contraseña
              </label>
              <div className="input-with-icon">
                <Lock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-pollo has-right-icon"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="right-icon"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-lg py-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Cambiar Contraseña'
              )}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <div className="text-center">
              <p className="text-pollo-marron/70 mb-6">
                Tu contraseña fue actualizada correctamente. Ya podés iniciar sesión con tu nueva contraseña.
              </p>
            </div>

            <button
              onClick={onSuccess}
              className="w-full btn-primary text-lg py-4"
            >
              Iniciar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
