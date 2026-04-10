import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show in iframes (Lovable preview)
    try {
      if (window.self !== window.top) return;
    } catch {
      return;
    }

    // Check if already dismissed this session
    if (sessionStorage.getItem('pwa-install-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS Safari (no beforeinstallprompt), show a tip
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isIOS && !isStandalone) {
      setTimeout(() => {
        if (!sessionStorage.getItem('pwa-install-dismissed')) {
          setShowBanner(true);
        }
      }, 3000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showBanner || dismissed) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-xl border border-pollo-amarillo/30 p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-pollo-amarillo flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-pollo-marron" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-pollo-marron text-sm">Instalar Hiper del Pollo</p>
            {isIOS && !deferredPrompt ? (
              <p className="text-xs text-gray-500 mt-1">
                Tocá <span className="font-semibold">Compartir</span> y luego <span className="font-semibold">"Agregar a pantalla de inicio"</span>
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Agregá la app a tu celular para acceder más rápido
              </p>
            )}
          </div>
          <button onClick={handleDismiss} className="shrink-0 p-1">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        {deferredPrompt && (
          <button
            onClick={handleInstall}
            className="w-full mt-3 py-2.5 bg-pollo-amarillo text-pollo-marron font-bold text-sm rounded-xl hover:bg-pollo-amarillo/90 transition-colors shadow-md"
          >
            Instalar App
          </button>
        )}
      </div>
    </div>
  );
}
