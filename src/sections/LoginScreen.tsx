import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Sparkles } from 'lucide-react';
import { useStore } from '@/store';

interface LoginScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  onRegister: () => void;
  onRecuperarPassword?: () => void;
}

export function LoginScreen({ onBack, onSuccess, onRegister, onRecuperarPassword }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const login = useStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        onSuccess();
      } else {
        setError('Email o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pollo-marron/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-56 h-56 bg-pollo-marron/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md border border-pollo-marron/20"
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
            Bienvenido de vuelta
          </h1>
          <p className="text-pollo-marron/60 mt-1">
            Iniciá sesión para participar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-pollo-marron">
              Email
            </label>
            <div className="input-with-icon">
              <Mail className="input-icon w-5 h-5" strokeWidth={2} />
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

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-pollo-marron">
              Contraseña
            </label>
            <div className="input-with-icon">
              <Lock className="input-icon w-5 h-5" strokeWidth={2} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-pollo has-right-icon"
                required
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

          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={onRecuperarPassword}
              className="text-sm text-pollo-marron font-semibold hover:text-pollo-marron transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary text-lg py-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Iniciar Sesión'
            )}
          </button>


        </form>

        {/* Footer */}
        <div className="text-center pt-6">
          <p className="text-pollo-marron/60">
            ¿No tenés cuenta?{' '}
            <button
              onClick={onRegister}
              className="text-pollo-marron font-bold hover:text-pollo-marron transition-colors"
            >
              Registrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
