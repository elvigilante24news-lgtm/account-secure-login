import { useEffect, useState } from 'react';
import { Gift, Sparkles, Trophy, Users } from 'lucide-react';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function WelcomeScreen({ onLogin, onRegister }: WelcomeScreenProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pollo-marron/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-48 h-48 bg-pollo-marron/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-pollo-marron/10 rounded-full blur-3xl" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float" style={{ animationDelay: '0s' }}>
          <Gift className="w-8 h-8 text-pollo-marron/40" />
        </div>
        <div className="absolute top-40 right-16 animate-float" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="w-6 h-6 text-pollo-marron/30" />
        </div>
        <div className="absolute bottom-40 left-16 animate-float" style={{ animationDelay: '1s' }}>
          <Trophy className="w-7 h-7 text-pollo-marron/40" />
        </div>
        <div className="absolute top-1/2 right-8 animate-float" style={{ animationDelay: '1.5s' }}>
          <Users className="w-5 h-5 text-pollo-marron/40" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Logo area */}
        <div 
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative inline-block mb-6">
            <div className="w-40 h-40 mx-auto relative">
              <img 
                src="/logo-app.png" 
                alt="Hiper del Pollo Logo" 
                className="w-full h-full object-contain drop-shadow-lg rounded-3xl"
              />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-pollo-amarillo/20 rounded-3xl blur-xl -z-10 scale-110" />
          </div>
          
          <h1 className="text-4xl font-black text-pollo-marron mb-2">
            Hiper del Pollo
          </h1>
          <p className="text-pollo-marron/70 text-lg font-medium">
            Sorteos y Premios
          </p>
        </div>

        {/* Features */}
        <div 
          className={`w-full max-w-sm space-y-4 mb-12 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center gap-4 p-4 bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-2xl border border-pollo-marron/20">
            <div className="w-12 h-12 bg-pollo-marron rounded-xl flex items-center justify-center shadow-md">
              <Gift className="w-6 h-6 text-pollo-amarillo" />
            </div>
            <div>
              <h3 className="font-bold text-pollo-marron">Grandes Premios</h3>
              <p className="text-sm text-pollo-marron/60">Sorteos con premios increíbles</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-2xl border border-pollo-marron/20">
            <div className="w-12 h-12 bg-pollo-marron rounded-xl flex items-center justify-center shadow-md gap-0 mx-0 px-[11px]">
              <Trophy className="w-6 h-6 text-pollo-amarillo" />
            </div>
            <div>
              <h3 className="font-bold text-pollo-marron">Fácil de Participar</h3>
              <p className="text-sm text-pollo-marron/60">Registrate, predecí el resultado y listo, ¡ya estás participando!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-2xl border border-pollo-marron/20">
            <div className="w-12 h-12 bg-pollo-marron rounded-xl flex items-center justify-center shadow-md px-[11px]">
              <Sparkles className="w-6 h-6 text-pollo-amarillo" />
            </div>
            <div>
              <h3 className="font-bold text-pollo-marron">Triple Chance</h3>
              <p className="text-sm text-pollo-marron/60">Si acertás el resultado tenés triple chance de ganar!</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div 
          className={`w-full max-w-sm space-y-3 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <button
            onClick={onRegister}
            className="w-full btn-primary text-lg py-4"
          >
            Crear Cuenta
          </button>
          
          <button
            onClick={onLogin}
            className="w-full btn-secondary text-lg py-4"
          >
            Iniciar Sesión
          </button>
        </div>

        {/* Footer */}
        <p 
          className={`mt-8 text-sm text-pollo-marron/50 text-center transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Al registrarte, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
}
