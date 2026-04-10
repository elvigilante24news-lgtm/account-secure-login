// Tipos de usuario
export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
  ciudad: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Tipos de sorteos
export type TipoSorteo = 'posiciones' | 'cantidad';

export interface Sorteo {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  fechaInicio: string;
  fechaFin: string;
  fechaSorteo: string;
  premios: Premio[];
  estado: 'activo' | 'finalizado' | 'proximo';
  participantes: number;
  maxParticipantes?: number;
  requisitos: string[];
  // Nuevos campos para administración
  edadMinima: number;
  edadMaxima?: number;
  requisitosPersonalizados: RequisitoPersonalizado[];
  terminosCondiciones: string;
  creadoPor: string;
  fechaCreacion: string;
  // Tipo de sorteo: 'posiciones' (1er, 2do, 3er) o 'cantidad' (N ganadores sin importar orden)
  tipoSorteo: TipoSorteo;
  cantidadGanadores?: number; // Solo aplica cuando tipoSorteo es 'cantidad'
}

export interface RequisitoPersonalizado {
  id: string;
  tipo: 'texto' | 'numero' | 'fecha' | 'checkbox' | 'select';
  label: string;
  descripcion?: string;
  requerido: boolean;
  opciones?: string[];
}

export interface Premio {
  id: string;
  puesto: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  valor?: string;
}

// Tipos de participación
export interface Participacion {
  id: string;
  userId: string;
  sorteoId: string;
  fechaParticipacion: string;
  numeroTicket: string;
  estado: 'activo' | 'ganador' | 'descalificado';
  puesto?: number;
  // Campos para Triple Chance
  chances?: number; // Número de chances (1 = normal, 3 = triple chance)
  esAcertador?: boolean; // Si acertó la predicción
}

// Tipos de notificación
export interface Notificacion {
  id: string;
  userId: string;
  tipo: 'confirmacion' | 'ganador' | 'recordatorio' | 'sistema' | 'prediccion' | 'triple-chance';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  sorteoId?: string;
  partidoId?: string;
}

// Tipos de ganador
export interface Ganador {
  id: string;
  userId: string;
  sorteoId: string;
  puesto: number;
  premio: Premio;
  fechaGanado: string;
  notificado: boolean;
  usuario: User;
}

// ==================== TIPOS PARA MUNDIAL 2026 ====================

// Tipos de fase del mundial
export type FaseMundial = 'fase-grupos' | 'dieciseisavos' | 'octavos' | 'cuartos' | 'semifinales' | 'tercer-puesto' | 'final';

// Tipos de estado del partido
export type EstadoPartido = 'programado' | 'en-vivo' | 'finalizado' | 'cancelado';

// Interfaz de Equipo
export interface Equipo {
  id: string;
  nombre: string;
  codigo: string; // Código FIFA (ARG, BRA, etc.)
  bandera: string; // URL de la bandera
  grupo: string;
}

// Interfaz de Partido del Mundial
export interface Partido {
  id: string;
  equipoLocal: Equipo;
  equipoVisitante: Equipo;
  fecha: string; // Fecha del partido
  hora: string; // Hora del partido
  estadio: string;
  ciudad: string;
  fase: FaseMundial;
  grupo?: string; // Solo para fase de grupos
  jornada?: number; // Número de jornada
  estado: EstadoPartido;
  golesLocal?: number; // Resultado final
  golesVisitante?: number; // Resultado final
  imagen?: string; // Imagen del partido
  video?: string; // URL del video
  descripcion?: string;
  creadoPor: string;
  fechaCreacion: string;
  // Campos para el sorteo asociado
  sorteoId?: string; // ID del sorteo asociado a este partido
}

// Interfaz de Predicción de un usuario
export interface Prediccion {
  id: string;
  userId: string;
  partidoId: string;
  sorteoId: string; // Sorteo asociado
  golesLocal: number;
  golesVisitante: number;
  fechaPrediccion: string;
  estado: 'pendiente' | 'acertado' | 'fallado';
  tripleChanceAplicado?: boolean; // Si ya se aplicó el triple chance
}

// Interfaz para Acertadores (admin)
export interface Acertador {
  userId: string;
  prediccionId: string;
  partidoId: string;
  usuario: User;
  prediccion: Prediccion;
  resultadoReal: {
    golesLocal: number;
    golesVisitante: number;
  };
  fechaAcerto: string;
}

// Tipos para el store
export interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  
  // Sorteos
  sorteos: Sorteo[];
  sorteoActivo: Sorteo | null;
  cargarSorteos: () => void;
  seleccionarSorteo: (sorteo: Sorteo | null) => void;
  
  // Participaciones
  participaciones: Participacion[];
  participarEnSorteo: (sorteoId: string) => Promise<boolean>;
  verificarParticipacion: (sorteoId: string) => boolean;
  
  // Notificaciones
  notificaciones: Notificacion[];
  marcarNotificacionLeida: (id: string) => void;
  
  // Admin
  esAdmin: boolean;
  realizarSorteo: (sorteoId: string) => Ganador[];
  ganadores: Ganador[];
  
  // Nuevas acciones de administrador
  crearSorteo: (sorteoData: Omit<Sorteo, 'id' | 'creadoPor' | 'fechaCreacion' | 'participantes'>) => Sorteo;
  actualizarSorteo: (sorteoId: string, sorteoData: Partial<Sorteo>) => boolean;
  eliminarSorteo: (sorteoId: string) => boolean;
  obtenerGanadoresPorSorteo: (sorteoId: string) => Ganador[];
  obtenerEstadisticasSorteo: (sorteoId: string) => EstadisticasSorteo;
  obtenerEstadisticasGenerales: () => EstadisticasGenerales;
  enviarNotificacionGanador: (ganadorId: string) => void;
  
  // ==================== ACCIONES MUNDIAL 2026 ====================
  
  // Partidos
  partidos: Partido[];
  partidoActivo: Partido | null;
  cargarPartidos: () => void;
  seleccionarPartido: (partido: Partido | null) => void;
  crearPartido: (partidoData: Omit<Partido, 'id' | 'creadoPor' | 'fechaCreacion'>) => Partido;
  actualizarPartido: (partidoId: string, partidoData: Partial<Partido>) => boolean;
  eliminarPartido: (partidoId: string) => boolean;
  
  // Predicciones
  predicciones: Prediccion[];
  realizarPrediccion: (partidoId: string, sorteoId: string, golesLocal: number, golesVisitante: number) => Promise<Prediccion | null>;
  verificarPrediccion: (partidoId: string) => Prediccion | undefined;
  obtenerPrediccionesPorPartido: (partidoId: string) => Prediccion[];
  
  // Triple Chance - Admin
  seleccionarAcertadores: (partidoId: string, userIds: string[]) => void;
  aplicarTripleChance: (partidoId: string) => void;
  obtenerAcertadoresPorPartido: (partidoId: string) => Acertador[];
  
  // Estadísticas de predicciones
  obtenerEstadisticasPredicciones: (sorteoId?: string) => EstadisticasPredicciones;
  
  // Recuperación de contraseña
  solicitarRecuperacion: (email: string) => Promise<{ success: boolean; mensaje?: string; codigo?: string }>;
  verificarCodigo: (email: string, codigo: string) => Promise<boolean>;
  cambiarPassword: (email: string, newPassword: string) => Promise<boolean>;
  
  // Perfil de usuario
  actualizarPerfil: (data: Partial<User>) => Promise<boolean>;
  
  // Configuración de la app
  prediccionesHabilitadas: boolean;
  togglePredicciones: () => void;
}

export interface EstadisticasSorteo {
  totalParticipantes: number;
  participantesUnicos: number;
  tasaConversion: number;
  participacionesPorDia: { fecha: string; cantidad: number }[];
  comparacionSorteosAnteriores: number;
}

export interface EstadisticasGenerales {
  totalSorteos: number;
  sorteosActivos: number;
  sorteosFinalizados: number;
  totalParticipaciones: number;
  totalParticipantesUnicos: number;
  promedioParticipacionesPorSorteo: number;
  sorteosConMayorParticipacion: { sorteoId: string; titulo: string; participaciones: number }[];
}

// Estadísticas de predicciones
export interface EstadisticasPredicciones {
  totalPredicciones: number;
  totalAcertadores: number;
  porcentajeAcierto: number;
  prediccionesPorPartido: { partidoId: string; titulo: string; predicciones: number; acertadores: number }[];
  usuariosConTripleChance: number;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
  ciudad: string;
}

// Tipos de navegación
export type Screen = 
  | 'welcome' 
  | 'login' 
  | 'register' 
  | 'home' 
  | 'sorteos' 
  | 'sorteo-detail' 
  | 'mis-participaciones' 
  | 'notificaciones' 
  | 'perfil'
  | 'admin'
  | 'admin-sorteo'
  // Nuevas pantallas para Mundial 2026
  | 'partidos-mundial'
  | 'prediccion-partido'
  | 'admin-partidos'
  | 'admin-crear-partido'
  | 'admin-acertadores';
