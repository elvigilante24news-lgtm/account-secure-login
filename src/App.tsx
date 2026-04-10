import { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/sections/WelcomeScreen';
import { LoginScreen } from '@/sections/LoginScreen';
import { RegisterScreen } from '@/sections/RegisterScreen';
import { HomeScreen } from '@/sections/HomeScreen';
import { SorteosScreen } from '@/sections/SorteosScreen';
import { SorteoDetailScreen } from '@/sections/SorteoDetailScreen';
import { MisParticipacionesScreen } from '@/sections/MisParticipacionesScreen';
import { NotificacionesScreen } from '@/sections/NotificacionesScreen';
import { PerfilScreen } from '@/sections/PerfilScreen';
import { AdminScreen } from '@/sections/AdminScreen';
import { AdminSorteoScreen } from '@/sections/AdminSorteoScreen';
import { CrearSorteoScreen } from '@/sections/CrearSorteoScreen';
import { GanadoresScreen } from '@/sections/GanadoresScreen';
import { EstadisticasScreen } from '@/sections/EstadisticasScreen';
// Nuevas pantallas para Mundial 2026
import { PartidosMundialScreen } from '@/sections/PartidosMundialScreen';
import { PrediccionPartidoScreen } from '@/sections/PrediccionPartidoScreen';
import { AdminPartidosScreen } from '@/sections/AdminPartidosScreen';
import { CrearPartidoScreen } from '@/sections/CrearPartidoScreen';
import { AdminAcertadoresScreen } from '@/sections/AdminAcertadoresScreen';
import { RecuperarPasswordScreen } from '@/sections/RecuperarPasswordScreen';
import { PrediccionConfirmadaScreen } from '@/sections/PrediccionConfirmadaScreen';

import { BottomNav } from '@/components/BottomNav';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { useStore } from '@/store';
import type { Sorteo, Partido, Prediccion } from '@/types';
import './App.css';

type Screen = 
  | 'welcome' 
  | 'login' 
  | 'register' 
  | 'recuperar-password'
  | 'home' 
  | 'sorteos' 
  | 'sorteo-detail' 
  | 'mis-participaciones' 
  | 'notificaciones' 
  | 'perfil'
  | 'admin'
  | 'admin-sorteo'
  | 'crear-sorteo'
  | 'ganadores'
  | 'estadisticas'
  // Nuevas pantallas para Mundial 2026
  | 'partidos-mundial'
  | 'prediccion-partido'
  | 'prediccion-confirmada'
  | 'admin-partidos'
  | 'admin-crear-partido'
  | 'admin-acertadores';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedSorteo, setSelectedSorteo] = useState<Sorteo | null>(null);
  const [selectedPartido, setSelectedPartido] = useState<Partido | null>(null);
  const [prediccionConfirmada, setPrediccionConfirmada] = useState<Prediccion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, esAdmin, logout } = useStore();

  // Simular tiempo de carga de la aplicacion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Verificar si hay sesión iniciada al cargar
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentScreen('home');
    }
  }, [isAuthenticated]);

  const navigateTo = (screen: string, params?: any) => {
    const targetScreen = screen as Screen;
    if (targetScreen === 'sorteo-detail' && params) {
      setSelectedSorteo(params);
    }
    if (targetScreen === 'admin-sorteo' && params) {
      setSelectedSorteo(params);
    }
    // Navegación para Mundial 2026
    if (targetScreen === 'prediccion-partido' && params) {
      setSelectedPartido(params);
    }
    if (targetScreen === 'admin-acertadores' && params) {
      setSelectedPartido(params);
    }
    if (targetScreen === 'admin-crear-partido' && params) {
      setSelectedPartido(params);
    }
    setCurrentScreen(targetScreen);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    logout();
    setCurrentScreen('welcome');
  };

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-pollo-fondo">
        <div className="text-center">
          <div className="w-40 h-40 mx-auto mb-8 animate-bounce">
            <img 
              src="/logo-app.png" 
              alt="Hiper del Pollo Logo" 
              className="w-full h-full object-contain drop-shadow-lg rounded-3xl"
            />
          </div>
          <h1 className="text-3xl font-black text-pollo-marron mb-2">Hiper del Pollo</h1>
          <p className="text-pollo-marron/70 text-lg font-medium mb-8">Cargando...</p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-pollo-amarillo rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-3 h-3 bg-pollo-amarillo rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-3 h-3 bg-pollo-marron rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    );
  }

  // Renderizar la pantalla actual
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onLogin={() => navigateTo('login')}
            onRegister={() => navigateTo('register')}
          />
        );

      case 'login':
        return (
          <LoginScreen
            onBack={() => navigateTo('welcome')}
            onSuccess={() => navigateTo('home')}
            onRegister={() => navigateTo('register')}
            onRecuperarPassword={() => navigateTo('recuperar-password')}
          />
        );

      case 'register':
        return (
          <RegisterScreen
            onBack={() => navigateTo('welcome')}
            onSuccess={() => navigateTo('home')}
            onLogin={() => navigateTo('login')}
          />
        );

      case 'recuperar-password':
        return (
          <RecuperarPasswordScreen
            onBack={() => navigateTo('login')}
            onSuccess={() => navigateTo('login')}
          />
        );

      case 'home':
        return (
          <HomeScreen
            onNavigate={navigateTo}
          />
        );

      case 'sorteos':
        return (
          <SorteosScreen
            onBack={() => navigateTo('home')}
            onSelectSorteo={(sorteo) => navigateTo('sorteo-detail', sorteo)}
          />
        );

      case 'sorteo-detail':
        if (!selectedSorteo) return null;
        return (
          <SorteoDetailScreen
            sorteo={selectedSorteo}
            onBack={() => navigateTo('sorteos')}
            onIrAPartido={(partidoId) => {
              const partido = useStore.getState().partidos.find(p => p.id === partidoId);
              if (partido) {
                navigateTo('prediccion-partido', partido);
              }
            }}
          />
        );

      case 'mis-participaciones':
        return (
          <MisParticipacionesScreen
            onBack={() => navigateTo('home')}
            onSelectSorteo={(sorteo) => navigateTo('sorteo-detail', sorteo)}
          />
        );

      case 'notificaciones':
        return (
          <NotificacionesScreen
            onBack={() => navigateTo('home')}
            onSelectSorteo={(sorteo) => navigateTo('sorteo-detail', sorteo)}
          />
        );

      case 'perfil':
        return (
          <PerfilScreen
            onBack={() => navigateTo('home')}
            onLogout={handleLogout}
          />
        );

      case 'admin':
        return (
          <AdminScreen
            onBack={() => navigateTo('home')}
            onSelectSorteo={(sorteo) => navigateTo('admin-sorteo', sorteo)}
            onCrearSorteo={() => {
              setSelectedSorteo(null);
              navigateTo('crear-sorteo');
            }}
            onVerGanadores={() => navigateTo('ganadores')}
            onVerEstadisticas={() => navigateTo('estadisticas')}
            onVerPartidos={() => navigateTo('admin-partidos')}
          />
        );

      case 'admin-sorteo':
        if (!selectedSorteo) return null;
        return (
          <AdminSorteoScreen
            sorteo={selectedSorteo}
            onBack={() => navigateTo('admin')}
            onEditarSorteo={() => navigateTo('crear-sorteo')}
          />
        );

      case 'crear-sorteo':
        return (
          <CrearSorteoScreen
            onBack={() => navigateTo('admin')}
            sorteoEditar={selectedSorteo}
          />
        );

      case 'ganadores':
        return (
          <GanadoresScreen
            onBack={() => navigateTo('admin')}
          />
        );

      case 'estadisticas':
        return (
          <EstadisticasScreen
            onBack={() => navigateTo('admin')}
          />
        );

      // ==================== PANTALLAS MUNDIAL 2026 ====================

      case 'partidos-mundial':
        return (
          <PartidosMundialScreen
            onBack={() => navigateTo('home')}
            onSelectPartido={(partido) => navigateTo('prediccion-partido', partido)}
          />
        );

      case 'prediccion-partido':
        if (!selectedPartido) return null;
        return (
          <PrediccionPartidoScreen
            partido={selectedPartido}
            onBack={() => navigateTo('partidos-mundial')}
            onPrediccionConfirmada={(prediccion) => {
              setPrediccionConfirmada(prediccion);
              navigateTo('prediccion-confirmada');
            }}
          />
        );

      case 'prediccion-confirmada':
        if (!selectedPartido || !prediccionConfirmada) return null;
        return (
          <PrediccionConfirmadaScreen
            partido={selectedPartido}
            prediccion={prediccionConfirmada}
            onBack={() => navigateTo('partidos-mundial')}
            onVerSorteo={(sorteoId) => {
              const sorteo = useStore.getState().sorteos.find(s => s.id === sorteoId);
              if (sorteo) {
                setSelectedSorteo(sorteo);
                navigateTo('sorteo-detail');
              }
            }}
            onIrAInicio={() => navigateTo('home')}
          />
        );

      case 'admin-partidos':
        return (
          <AdminPartidosScreen
            onBack={() => navigateTo('admin')}
            onCrearPartido={() => {
              setSelectedPartido(null);
              navigateTo('admin-crear-partido');
            }}
            onEditarPartido={(partido) => navigateTo('admin-crear-partido', partido)}
            onVerAcertadores={(partido) => navigateTo('admin-acertadores', partido)}
          />
        );

      case 'admin-crear-partido':
        return (
          <CrearPartidoScreen
            onBack={() => navigateTo('admin-partidos')}
            partido={selectedPartido}
          />
        );

      case 'admin-acertadores':
        if (!selectedPartido) return null;
        return (
          <AdminAcertadoresScreen
            partido={selectedPartido}
            onBack={() => navigateTo('admin-partidos')}
          />
        );

      default:
        return <WelcomeScreen onLogin={() => navigateTo('login')} onRegister={() => navigateTo('register')} />;
    }
  };

  // Determinar si mostrar la navegación inferior
  const showBottomNav = [
    'home', 
    'sorteos', 
    'mis-participaciones', 
    'notificaciones', 
    'perfil', 
    'admin',
    'partidos-mundial'
  ].includes(currentScreen) && ![
    'crear-sorteo',
    'ganadores',
    'estadisticas',
    'admin-sorteo',
    'prediccion-partido',
    'admin-partidos',
    'admin-crear-partido',
    'admin-acertadores'
  ].includes(currentScreen);

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-pollo-fondo relative">
      {/* Main content */}
      <main className={`transition-all duration-300 ${showBottomNav ? 'pb-20' : ''}`}>
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          isAdmin={esAdmin}
          prediccionesHabilitadas={useStore.getState().prediccionesHabilitadas}
        />
      )}
      <PWAInstallPrompt />
    </div>
  );
}

export default App;
