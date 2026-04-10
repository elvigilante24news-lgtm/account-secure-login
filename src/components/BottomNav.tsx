import { Home, Gift, Ticket, User, Settings, Globe } from 'lucide-react';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  isAdmin: boolean;
  prediccionesHabilitadas?: boolean;
}

export function BottomNav({ currentScreen, onNavigate, isAdmin, prediccionesHabilitadas = true }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    ...(prediccionesHabilitadas ? [{ id: 'partidos-mundial', icon: Globe, label: 'Mundial' }] : []),
    { id: 'sorteos', icon: Gift, label: 'Sorteos' },
    { id: 'mis-participaciones', icon: Ticket, label: 'Participaciones' },
    { id: 'perfil', icon: User, label: 'Perfil' },
    ...(isAdmin ? [{ id: 'admin', icon: Settings, label: 'Admin' }] : [])
  ];

  const isActive = (screen: string) => {
    if (screen === 'home' && currentScreen === 'home') return true;
    if (screen === 'partidos-mundial' && (currentScreen === 'partidos-mundial' || currentScreen === 'prediccion-partido')) return true;
    if (screen === 'sorteos' && (currentScreen === 'sorteos' || currentScreen === 'sorteo-detail')) return true;
    if (screen === 'mis-participaciones' && currentScreen === 'mis-participaciones') return true;
    if (screen === 'perfil' && currentScreen === 'perfil') return true;
    if (screen === 'admin' && (currentScreen === 'admin' || currentScreen === 'admin-sorteo' || currentScreen === 'admin-partidos' || currentScreen === 'admin-crear-partido' || currentScreen === 'admin-acertadores')) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-pollo-marron/20 safe-area-bottom z-40">
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-300 ${
                active 
                  ? 'text-pollo-amarillo' 
                  : 'text-pollo-marron/50 hover:text-pollo-marron'
              }`}
            >
              <div className={`relative ${active ? 'transform -translate-y-1' : ''}`}>
                <Icon className={`w-5 h-5 transition-all duration-300 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-pollo-amarillo rounded-full" />
                )}
              </div>
              <span className={`text-[9px] mt-1 font-medium transition-all duration-300 ${active ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
