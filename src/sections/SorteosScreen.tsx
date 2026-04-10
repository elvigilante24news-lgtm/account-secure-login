import { useState } from 'react';
import { ArrowLeft, Gift, Calendar, Users, Search, Sparkles } from 'lucide-react';
import { useStore } from '@/store';
import type { Sorteo } from '@/types';

interface SorteosScreenProps {
  onBack: () => void;
  onSelectSorteo: (sorteo: Sorteo) => void;
}

export function SorteosScreen({ onBack, onSelectSorteo }: SorteosScreenProps) {
  const { sorteos, verificarParticipacion, user } = useStore();
  const [filter, setFilter] = useState<'todos' | 'activos' | 'proximos' | 'finalizados'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSorteos = sorteos.filter(sorteo => {
    const matchesFilter = filter === 'todos' || 
      (filter === 'activos' && sorteo.estado === 'activo') ||
      (filter === 'proximos' && sorteo.estado === 'proximo') ||
      (filter === 'finalizados' && sorteo.estado === 'finalizado');
    
    const matchesSearch = sorteo.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sorteo.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen w-full pb-24">
      {/* Header */}
      <div className="bg-pollo-marron px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-pollo-lg relative overflow-hidden">
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full" />
        
        <div className="relative z-10">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-pollo-fondo-claro/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <h1 className="text-2xl font-black text-white mb-2">Sorteos</h1>
          <p className="text-white/80 text-sm">Participá y ganá increíbles premios</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Search */}
        <div className="input-with-icon mb-4">
          <Search className="input-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar sorteos..."
            className="input-pollo"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {(['todos', 'activos', 'proximos', 'finalizados'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-pollo-marron text-white shadow-md'
                  : 'bg-pollo-fondo-claro/80 text-pollo-marron border border-pollo-marron/30 hover:bg-pollo-fondo-claro/80'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Sorteos List */}
        <div className="space-y-4">
          {filteredSorteos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-pollo-marron/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-pollo-marron/40" />
              </div>
              <p className="text-pollo-marron/60">No se encontraron sorteos</p>
            </div>
          ) : (
            filteredSorteos.map((sorteo) => (
              <SorteoCard 
                key={sorteo.id} 
                sorteo={sorteo} 
                yaParticipa={user ? verificarParticipacion(sorteo.id) : false}
                onClick={() => onSelectSorteo(sorteo)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SorteoCard({ 
  sorteo, 
  yaParticipa,
  onClick 
}: { 
  sorteo: Sorteo; 
  yaParticipa: boolean;
  onClick: () => void;
}) {
  const getStatusColor = () => {
    switch (sorteo.estado) {
      case 'activo': return 'bg-green-500';
      case 'proximo': return 'bg-blue-500';
      case 'finalizado': return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (sorteo.estado) {
      case 'activo': return 'Activo';
      case 'proximo': return 'Próximo';
      case 'finalizado': return 'Finalizado';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="card-premium cursor-pointer hover:shadow-floating transition-all duration-300 hover:-translate-y-1 animate-slide-up"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {yaParticipa && (
          <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
            <Sparkles className="w-3 h-3" /> Participando
          </span>
        )}
      </div>

      <div className="flex gap-4">
        <div className="w-24 h-24 bg-pollo-marron rounded-xl flex items-center justify-center flex-shrink-0">
          <Gift className="w-10 h-10 text-pollo-amarillo" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-pollo-marron text-lg">{sorteo.titulo}</h3>
          <p className="text-sm text-pollo-marron/60 line-clamp-2 mt-1">{sorteo.descripcion}</p>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-xs text-pollo-marron/50">
              <Users className="w-4 h-4" />
              <span>{sorteo.participantes.toLocaleString()} participantes</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-pollo-marron/50">
              <Calendar className="w-4 h-4" />
              <span>Sorteo: {new Date(sorteo.fechaSorteo).toLocaleDateString('es-AR')}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
