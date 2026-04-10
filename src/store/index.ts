import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, User, Sorteo, Participacion, Notificacion, Ganador, RegisterData, Partido, Equipo, Prediccion, Acertador, FaseMundial } from '@/types';

// ==================== DATOS DE EQUIPOS DEL MUNDIAL 2026 ====================
const equiposMundial: Equipo[] = [
  // Grupo A
  { id: 'arg', nombre: 'Argentina', codigo: 'ARG', bandera: 'https://flagcdn.com/w160/ar.png', grupo: 'A' },
  { id: 'per', nombre: 'Perú', codigo: 'PER', bandera: 'https://flagcdn.com/w160/pe.png', grupo: 'A' },
  { id: 'chi', nombre: 'Chile', codigo: 'CHI', bandera: 'https://flagcdn.com/w160/cl.png', grupo: 'A' },
  { id: 'can', nombre: 'Canadá', codigo: 'CAN', bandera: 'https://flagcdn.com/w160/ca.png', grupo: 'A' },
  // Grupo B
  { id: 'mex', nombre: 'México', codigo: 'MEX', bandera: 'https://flagcdn.com/w160/mx.png', grupo: 'B' },
  { id: 'ecu', nombre: 'Ecuador', codigo: 'ECU', bandera: 'https://flagcdn.com/w160/ec.png', grupo: 'B' },
  { id: 'ven', nombre: 'Venezuela', codigo: 'VEN', bandera: 'https://flagcdn.com/w160/ve.png', grupo: 'B' },
  { id: 'jam', nombre: 'Jamaica', codigo: 'JAM', bandera: 'https://flagcdn.com/w160/jm.png', grupo: 'B' },
  // Grupo C
  { id: 'usa', nombre: 'Estados Unidos', codigo: 'USA', bandera: 'https://flagcdn.com/w160/us.png', grupo: 'C' },
  { id: 'uru', nombre: 'Uruguay', codigo: 'URU', bandera: 'https://flagcdn.com/w160/uy.png', grupo: 'C' },
  { id: 'pan', nombre: 'Panamá', codigo: 'PAN', bandera: 'https://flagcdn.com/w160/pa.png', grupo: 'C' },
  { id: 'bol', nombre: 'Bolivia', codigo: 'BOL', bandera: 'https://flagcdn.com/w160/bo.png', grupo: 'C' },
  // Grupo D
  { id: 'bra', nombre: 'Brasil', codigo: 'BRA', bandera: 'https://flagcdn.com/w160/br.png', grupo: 'D' },
  { id: 'col', nombre: 'Colombia', codigo: 'COL', bandera: 'https://flagcdn.com/w160/co.png', grupo: 'D' },
  { id: 'par', nombre: 'Paraguay', codigo: 'PAR', bandera: 'https://flagcdn.com/w160/py.png', grupo: 'D' },
  { id: 'hon', nombre: 'Honduras', codigo: 'HON', bandera: 'https://flagcdn.com/w160/hn.png', grupo: 'D' },
  // Grupo E
  { id: 'esp', nombre: 'España', codigo: 'ESP', bandera: 'https://flagcdn.com/w160/es.png', grupo: 'E' },
  { id: 'ale', nombre: 'Alemania', codigo: 'GER', bandera: 'https://flagcdn.com/w160/de.png', grupo: 'E' },
  { id: 'jpn', nombre: 'Japón', codigo: 'JPN', bandera: 'https://flagcdn.com/w160/jp.png', grupo: 'E' },
  { id: 'australia', nombre: 'Australia', codigo: 'AUS', bandera: 'https://flagcdn.com/w160/au.png', grupo: 'E' },
  // Grupo F
  { id: 'fra', nombre: 'Francia', codigo: 'FRA', bandera: 'https://flagcdn.com/w160/fr.png', grupo: 'F' },
  { id: 'ing', nombre: 'Inglaterra', codigo: 'ENG', bandera: 'https://flagcdn.com/w160/gb-eng.png', grupo: 'F' },
  { id: 'cro', nombre: 'Croacia', codigo: 'CRO', bandera: 'https://flagcdn.com/w160/hr.png', grupo: 'F' },
  { id: 'mar', nombre: 'Marruecos', codigo: 'MAR', bandera: 'https://flagcdn.com/w160/ma.png', grupo: 'F' },
  // Grupo G
  { id: 'por', nombre: 'Portugal', codigo: 'POR', bandera: 'https://flagcdn.com/w160/pt.png', grupo: 'G' },
  { id: 'ned', nombre: 'Países Bajos', codigo: 'NED', bandera: 'https://flagcdn.com/w160/nl.png', grupo: 'G' },
  { id: 'sui', nombre: 'Suiza', codigo: 'SUI', bandera: 'https://flagcdn.com/w160/ch.png', grupo: 'G' },
  { id: 'usa2', nombre: 'Estados Unidos 2', codigo: 'USA2', bandera: 'https://flagcdn.com/w160/us.png', grupo: 'G' },
  // Grupo H
  { id: 'ita', nombre: 'Italia', codigo: 'ITA', bandera: 'https://flagcdn.com/w160/it.png', grupo: 'H' },
  { id: 'bel', nombre: 'Bélgica', codigo: 'BEL', bandera: 'https://flagcdn.com/w160/be.png', grupo: 'H' },
  { id: 'den', nombre: 'Dinamarca', codigo: 'DEN', bandera: 'https://flagcdn.com/w160/dk.png', grupo: 'H' },
  { id: 'sen', nombre: 'Senegal', codigo: 'SEN', bandera: 'https://flagcdn.com/w160/sn.png', grupo: 'H' },
];

// ==================== DATOS DE PARTIDOS DE EJEMPLO ====================
// Solo UN partido de prueba para testear el sorteo
const partidosEjemplo: Partido[] = [
  {
    id: 'partido-test-1',
    equipoLocal: equiposMundial[0], // Argentina
    equipoVisitante: equiposMundial[3], // Canadá
    fecha: '2026-06-11',
    hora: '16:00',
    estadio: 'Estadio Azteca',
    ciudad: 'Ciudad de México',
    fase: 'fase-grupos',
    grupo: 'A',
    jornada: 1,
    estado: 'programado',
    imagen: '/partido-test-argentina-canada.jpg',
    descripcion: 'Partido de prueba - Mundial 2026',
    creadoPor: 'admin@hiperdelpollo.com',
    fechaCreacion: '2025-01-01',
    sorteoId: 'sorteo-prueba-1'
  }
];

// Sorteo de prueba - UNICO sorteo activo para testear
const sorteoPrueba: Sorteo = {
  id: 'sorteo-prueba-1',
  titulo: 'Sorteo Mundial 2026 - Argentina vs Canadá',
  descripcion: '¡Sorteo de prueba! Predecí el resultado del partido Argentina vs Canadá del Mundial 2026 y participá por increíbles premios. Si acertás el resultado, tenés TRIPLE CHANCE de ganar.',
  imagen: '/sorteo-test.jpg',
  fechaInicio: '2025-01-01',
  fechaFin: '2026-06-11',
  fechaSorteo: '2026-06-12',
  estado: 'activo',
  participantes: 3,
  maxParticipantes: 1000,
  requisitos: ['Ser mayor de 18 años', 'Predecir el resultado del partido'],
  premios: [
    { id: 'pr1', puesto: 1, nombre: 'Voucher $100.000', descripcion: 'Voucher de compra en Hiper del Pollo', imagen: '', valor: '$100.000' },
    { id: 'pr2', puesto: 2, nombre: 'Voucher $75.000', descripcion: 'Voucher de compra', imagen: '', valor: '$75.000' },
    { id: 'pr3', puesto: 3, nombre: 'Voucher $50.000', descripcion: 'Voucher de compra', imagen: '', valor: '$50.000' }
  ],
  edadMinima: 18,
  requisitosPersonalizados: [],
  terminosCondiciones: 'Sorteo de prueba para el Mundial 2026. Solo válido para mayores de 18 años.',
  creadoPor: 'admin@hiperdelpollo.com',
  fechaCreacion: '2025-01-01',
  tipoSorteo: 'posiciones'
};

// Datos de ejemplo - Solo UN sorteo activo
const sorteosEjemplo: Sorteo[] = [sorteoPrueba];

// Usuario admin de ejemplo
const adminUser: User = {
  id: 'admin-1',
  nombre: 'Administrador',
  apellido: 'Hiper del Pollo',
  email: 'admin@hiperdelpollo.com',
  telefono: '1234567890',
  dni: '00000000',
  fechaNacimiento: '1990-01-01',
  ciudad: 'Ciudad',
  createdAt: '2024-01-01'
};

// Ganadores de ejemplo para el sorteo de prueba
const ganadoresEjemplo: Ganador[] = [
  {
    id: 'ganador-1',
    userId: 'user-1',
    sorteoId: 'sorteo-prueba-1',
    puesto: 1,
    premio: { id: 'pr1', puesto: 1, nombre: 'Voucher $100.000', descripcion: 'Voucher de compra en Hiper del Pollo', imagen: '', valor: '$100.000' },
    fechaGanado: '2025-01-15T10:30:00Z',
    notificado: true,
    usuario: {
      id: 'user-1',
      nombre: 'María',
      apellido: 'González',
      email: 'maria.gonzalez@email.com',
      telefono: '+54 9 11 2345-6789',
      dni: '28.456.789',
      fechaNacimiento: '1985-03-15',
      ciudad: 'Buenos Aires',
      createdAt: '2025-01-10'
    }
  },
  {
    id: 'ganador-2',
    userId: 'user-2',
    sorteoId: 'sorteo-prueba-1',
    puesto: 2,
    premio: { id: 'pr2', puesto: 2, nombre: 'Voucher $75.000', descripcion: 'Voucher de compra', imagen: '', valor: '$75.000' },
    fechaGanado: '2025-01-15T10:30:00Z',
    notificado: true,
    usuario: {
      id: 'user-2',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      email: 'carlos.rodriguez@email.com',
      telefono: '+54 9 11 3456-7890',
      dni: '31.234.567',
      fechaNacimiento: '1990-07-22',
      ciudad: 'Córdoba',
      createdAt: '2025-01-12'
    }
  },
  {
    id: 'ganador-3',
    userId: 'user-3',
    sorteoId: 'sorteo-prueba-1',
    puesto: 3,
    premio: { id: 'pr3', puesto: 3, nombre: 'Voucher $50.000', descripcion: 'Voucher de compra', imagen: '', valor: '$50.000' },
    fechaGanado: '2025-01-15T10:30:00Z',
    notificado: true,
    usuario: {
      id: 'user-3',
      nombre: 'Lucía',
      apellido: 'Martínez',
      email: 'lucia.martinez@email.com',
      telefono: '+54 9 11 4567-8901',
      dni: '35.678.901',
      fechaNacimiento: '1992-11-08',
      ciudad: 'Rosario',
      createdAt: '2025-01-14'
    }
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      isAuthenticated: false,
      esAdmin: false,

      // Sorteos
      sorteos: sorteosEjemplo,
      sorteoActivo: null,

      // Participaciones de ejemplo
      participaciones: [
        {
          id: 'part-1',
          userId: 'user-1',
          sorteoId: 'sorteo-prueba-1',
          fechaParticipacion: '2025-01-10T14:20:00Z',
          numeroTicket: 'TABC123',
          estado: 'ganador',
          chances: 1,
          esAcertador: false,
          puesto: 1
        },
        {
          id: 'part-2',
          userId: 'user-2',
          sorteoId: 'sorteo-prueba-1',
          fechaParticipacion: '2025-01-12T09:15:00Z',
          numeroTicket: 'TDEF456',
          estado: 'ganador',
          chances: 1,
          esAcertador: false,
          puesto: 2
        },
        {
          id: 'part-3',
          userId: 'user-3',
          sorteoId: 'sorteo-prueba-1',
          fechaParticipacion: '2025-01-14T16:45:00Z',
          numeroTicket: 'TGHI789',
          estado: 'ganador',
          chances: 1,
          esAcertador: false,
          puesto: 3
        }
      ],

      // Notificaciones de ejemplo
      notificaciones: [
        {
          id: 'notif-1',
          userId: 'user-1',
          tipo: 'confirmacion',
          titulo: '¡Participación confirmada!',
          mensaje: 'Ya estás participando en el sorteo "Sorteo Mundial 2026 - Argentina vs Canadá". ¡Mucha suerte!',
          fecha: '2025-01-10T14:20:00Z',
          leida: true,
          sorteoId: 'sorteo-prueba-1'
        },
        {
          id: 'notif-2',
          userId: 'user-2',
          tipo: 'confirmacion',
          titulo: '¡Participación confirmada!',
          mensaje: 'Ya estás participando en el sorteo "Sorteo Mundial 2026 - Argentina vs Canadá". ¡Mucha suerte!',
          fecha: '2025-01-12T09:15:00Z',
          leida: true,
          sorteoId: 'sorteo-prueba-1'
        },
        {
          id: 'notif-3',
          userId: 'user-3',
          tipo: 'confirmacion',
          titulo: '¡Participación confirmada!',
          mensaje: 'Ya estás participando en el sorteo "Sorteo Mundial 2026 - Argentina vs Canadá". ¡Mucha suerte!',
          fecha: '2025-01-14T16:45:00Z',
          leida: false,
          sorteoId: 'sorteo-prueba-1'
        }
      ],

      // Ganadores
      ganadores: ganadoresEjemplo,

      // ==================== MUNDIAL 2026 ====================
      // Partidos
      partidos: partidosEjemplo,
      partidoActivo: null,

      // Predicciones de ejemplo
      predicciones: [
        {
          id: 'pred-1',
          userId: 'user-1',
          partidoId: 'partido-test-1',
          sorteoId: 'sorteo-prueba-1',
          golesLocal: 2,
          golesVisitante: 0,
          fechaPrediccion: '2025-01-10T14:20:00Z',
          estado: 'pendiente',
          tripleChanceAplicado: false
        },
        {
          id: 'pred-2',
          userId: 'user-2',
          partidoId: 'partido-test-1',
          sorteoId: 'sorteo-prueba-1',
          golesLocal: 3,
          golesVisitante: 1,
          fechaPrediccion: '2025-01-12T09:15:00Z',
          estado: 'pendiente',
          tripleChanceAplicado: false
        },
        {
          id: 'pred-3',
          userId: 'user-3',
          partidoId: 'partido-test-1',
          sorteoId: 'sorteo-prueba-1',
          golesLocal: 1,
          golesVisitante: 0,
          fechaPrediccion: '2025-01-14T16:45:00Z',
          estado: 'pendiente',
          tripleChanceAplicado: false
        }
      ],

      // Actions
      login: async (email: string, password: string) => {
        // Inicializar usuarios de ejemplo en localStorage si no existen
        const usuariosExistentes = localStorage.getItem('hiperdelpollo-users');
        if (!usuariosExistentes) {
          const usuariosIniciales = [
            { ...adminUser, password: 'admin123' },
            { 
              id: 'user-1', nombre: 'María', apellido: 'González', 
              email: 'maria.gonzalez@email.com', password: 'test123',
              telefono: '+54 9 11 2345-6789', dni: '28.456.789',
              fechaNacimiento: '1985-03-15', ciudad: 'Buenos Aires', createdAt: '2025-01-10'
            },
            { 
              id: 'user-2', nombre: 'Carlos', apellido: 'Rodríguez', 
              email: 'carlos.rodriguez@email.com', password: 'test123',
              telefono: '+54 9 11 3456-7890', dni: '31.234.567',
              fechaNacimiento: '1990-07-22', ciudad: 'Córdoba', createdAt: '2025-01-12'
            },
            { 
              id: 'user-3', nombre: 'Lucía', apellido: 'Martínez', 
              email: 'lucia.martinez@email.com', password: 'test123',
              telefono: '+54 9 11 4567-8901', dni: '35.678.901',
              fechaNacimiento: '1992-11-08', ciudad: 'Rosario', createdAt: '2025-01-14'
            }
          ];
          localStorage.setItem('hiperdelpollo-users', JSON.stringify(usuariosIniciales));
        }

        // Simulación de login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email === 'admin@hiperdelpollo.com' && password === 'admin123') {
          set({ 
            user: adminUser, 
            isAuthenticated: true, 
            esAdmin: true 
          });
          return true;
        }
        
        // Usuario normal de ejemplo
        const usuariosGuardados = JSON.parse(localStorage.getItem('hiperdelpollo-users') || '[]');
        const usuario = usuariosGuardados.find((u: any) => u.email === email && u.password === password);
        
        if (usuario) {
          const { password, ...userWithoutPassword } = usuario;
          set({ 
            user: userWithoutPassword, 
            isAuthenticated: true, 
            esAdmin: false 
          });
          return true;
        }
        
        return false;
      },

      register: async (userData: RegisterData) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          id: `user-${Date.now()}`,
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.email,
          telefono: userData.telefono,
          dni: userData.dni,
          fechaNacimiento: userData.fechaNacimiento,
          ciudad: userData.ciudad,
          createdAt: new Date().toISOString()
        };
        
        // Guardar en localStorage
        const usuarios = JSON.parse(localStorage.getItem('hiperdelpollo-users') || '[]');
        
        if (usuarios.some((u: any) => u.email === userData.email)) {
          throw new Error('El email ya está registrado');
        }
        
        if (usuarios.some((u: any) => u.dni === userData.dni)) {
          throw new Error('El D.N.I. ya está registrado');
        }
        
        if (usuarios.some((u: any) => u.telefono === userData.telefono)) {
          throw new Error('El número de teléfono ya está registrado');
        }
        
        usuarios.push({ ...newUser, password: userData.password });
        localStorage.setItem('hiperdelpollo-users', JSON.stringify(usuarios));
        
        set({ 
          user: newUser, 
          isAuthenticated: true, 
          esAdmin: false 
        });
        
        return true;
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          esAdmin: false 
        });
      },

      cargarSorteos: () => {
        // Los sorteos ya están cargados en el estado inicial
      },

      seleccionarSorteo: (sorteo: Sorteo | null) => {
        set({ sorteoActivo: sorteo });
      },

      participarEnSorteo: async (sorteoId: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const { user, participaciones, sorteos } = get();
        if (!user) return false;
        
        const yaParticipa = participaciones.some(
          p => p.sorteoId === sorteoId && p.userId === user.id
        );
        
        if (yaParticipa) return false;
        
        const nuevaParticipacion: Participacion = {
          id: `part-${Date.now()}`,
          userId: user.id,
          sorteoId: sorteoId,
          fechaParticipacion: new Date().toISOString(),
          numeroTicket: `T${Date.now().toString(36).toUpperCase()}`,
          estado: 'activo',
          chances: 1, // Chance normal por defecto
          esAcertador: false
        };
        
        // Actualizar contador de participantes
        const nuevosSorteos = sorteos.map(s => 
          s.id === sorteoId 
            ? { ...s, participantes: s.participantes + 1 }
            : s
        );
        
        // Crear notificación de confirmación
        const sorteo = sorteos.find(s => s.id === sorteoId);
        const nuevaNotificacion: Notificacion = {
          id: `notif-${Date.now()}`,
          userId: user.id,
          tipo: 'confirmacion',
          titulo: '¡Participación confirmada!',
          mensaje: `Ya estás participando en el sorteo "${sorteo?.titulo}". ¡Mucha suerte!`,
          fecha: new Date().toISOString(),
          leida: false,
          sorteoId: sorteoId
        };
        
        set({ 
          participaciones: [...participaciones, nuevaParticipacion],
          sorteos: nuevosSorteos,
          notificaciones: [nuevaNotificacion, ...get().notificaciones]
        });
        
        return true;
      },

      verificarParticipacion: (sorteoId: string) => {
        const { user, participaciones } = get();
        if (!user) return false;
        
        return participaciones.some(
          p => p.sorteoId === sorteoId && p.userId === user.id
        );
      },

      marcarNotificacionLeida: (id: string) => {
        const { notificaciones } = get();
        set({
          notificaciones: notificaciones.map(n =>
            n.id === id ? { ...n, leida: true } : n
          )
        });
      },

      realizarSorteo: (sorteoId: string) => {
        const { participaciones, sorteos } = get();
        
        const participantesSorteo = participaciones.filter(p => p.sorteoId === sorteoId);
        const sorteo = sorteos.find(s => s.id === sorteoId);
        
        if (!sorteo || participantesSorteo.length < 3) {
          return [];
        }
        
        // Crear array de participaciones ponderadas por chances
        let participacionesPonderadas: Participacion[] = [];
        participantesSorteo.forEach(p => {
          const chances = p.chances || 1;
          for (let i = 0; i < chances; i++) {
            participacionesPonderadas.push(p);
          }
        });
        
        // Mezclar participantes aleatoriamente
        const mezclados = [...participacionesPonderadas].sort(() => Math.random() - 0.5);
        
        // Determinar cantidad de ganadores según el tipo de sorteo
        const cantidadGanadores = sorteo.tipoSorteo === 'cantidad' && sorteo.cantidadGanadores
          ? sorteo.cantidadGanadores
          : sorteo.premios.length;
        
        // Seleccionar ganadores únicos (evitar que una persona gane dos veces)
        const ganadoresSeleccionados: Participacion[] = [];
        const userIdsSeleccionados = new Set<string>();
        
        for (const p of mezclados) {
          if (!userIdsSeleccionados.has(p.userId)) {
            ganadoresSeleccionados.push(p);
            userIdsSeleccionados.add(p.userId);
            if (ganadoresSeleccionados.length >= cantidadGanadores) break;
          }
        }
        
        // Obtener datos de usuarios
        const usuarios = JSON.parse(localStorage.getItem('hiperdelpollo-users') || '[]');
        
        const nuevosGanadores: Ganador[] = ganadoresSeleccionados.map((p, index) => {
          const usuarioData = usuarios.find((u: any) => u.id === p.userId);
          const { password, ...usuario } = usuarioData || {};
          
          // Para tipo 'cantidad', todos reciben el mismo premio (el primero)
          // Para tipo 'posiciones', cada uno recibe el premio según su puesto
          const premio = sorteo.tipoSorteo === 'cantidad'
            ? sorteo.premios[0]
            : (sorteo.premios[index] || sorteo.premios[sorteo.premios.length - 1]);
          
          return {
            id: `ganador-${Date.now()}-${index}`,
            userId: p.userId,
            sorteoId: sorteoId,
            puesto: index + 1,
            premio: premio,
            fechaGanado: new Date().toISOString(),
            notificado: true,
            usuario: usuario || {
              id: p.userId,
              nombre: 'Usuario',
              apellido: 'Desconocido',
              email: 'unknown@email.com',
              telefono: '',
              dni: '',
              fechaNacimiento: '',
              ciudad: '',
              createdAt: ''
            }
          };
        });
        
        // Crear notificaciones automáticas para los ganadores
        const notificacionesGanadores: Notificacion[] = nuevosGanadores.map((ganador) => {
          const puestoTexto = sorteo.tipoSorteo === 'cantidad' 
            ? 'GANADOR' 
            : `${ganador.puesto}° PUESTO`;
          
          return {
            id: `notif-ganador-${Date.now()}-${ganador.userId}`,
            userId: ganador.userId,
            tipo: 'ganador',
            titulo: `¡FELICITACIONES! ¡GANASTE! 🎉`,
            mensaje: `¡Sos el ${puestoTexto} del sorteo "${sorteo.titulo}"! Ganaste: ${ganador.premio.nombre} (${ganador.premio.valor}). ¡Te contactaremos pronto para coordinar la entrega de tu premio!`,
            fecha: new Date().toISOString(),
            leida: false,
            sorteoId: sorteoId
          };
        });
        
        // Actualizar estado de participaciones
        const nuevasParticipaciones = participaciones.map(p => {
          const ganador = nuevosGanadores.find(g => g.userId === p.userId && g.sorteoId === p.sorteoId);
          if (ganador) {
            return { ...p, estado: 'ganador' as const, puesto: ganador.puesto };
          }
          return p;
        });
        
        // Actualizar estado del sorteo
        const sorteosActualizados = sorteos.map(s => 
          s.id === sorteoId ? { ...s, estado: 'finalizado' as const } : s
        );
        
        set({
          ganadores: [...get().ganadores, ...nuevosGanadores],
          participaciones: nuevasParticipaciones,
          sorteos: sorteosActualizados,
          notificaciones: [...notificacionesGanadores, ...get().notificaciones]
        });
        
        return nuevosGanadores;
      },

      // Nuevas acciones de administrador
      crearSorteo: (sorteoData: Omit<Sorteo, 'id' | 'creadoPor' | 'fechaCreacion' | 'participantes'>) => {
        const { user, sorteos } = get();
        const nuevoSorteo: Sorteo = {
          ...sorteoData,
          id: `sorteo-${Date.now()}`,
          creadoPor: user?.email || 'admin@hiperdelpollo.com',
          fechaCreacion: new Date().toISOString(),
          participantes: 0
        };
        
        set({ sorteos: [...sorteos, nuevoSorteo] });
        return nuevoSorteo;
      },

      actualizarSorteo: (sorteoId, sorteoData) => {
        const { sorteos } = get();
        const sorteoIndex = sorteos.findIndex(s => s.id === sorteoId);
        
        if (sorteoIndex === -1) return false;
        
        const sorteosActualizados = [...sorteos];
        sorteosActualizados[sorteoIndex] = {
          ...sorteosActualizados[sorteoIndex],
          ...sorteoData
        };
        
        set({ sorteos: sorteosActualizados });
        return true;
      },

      eliminarSorteo: (sorteoId: string) => {
        const { sorteos } = get();
        const sorteosFiltrados = sorteos.filter(s => s.id !== sorteoId);
        
        if (sorteosFiltrados.length === sorteos.length) return false;
        
        set({ sorteos: sorteosFiltrados });
        return true;
      },

      obtenerGanadoresPorSorteo: (sorteoId: string) => {
        const { ganadores } = get();
        return ganadores.filter(g => g.sorteoId === sorteoId);
      },

      obtenerEstadisticasSorteo: (sorteoId: string) => {
        const { participaciones, sorteos } = get();
        const participacionesSorteo = participaciones.filter(p => p.sorteoId === sorteoId);
        
        // Calcular participaciones por día
        const participacionesPorDia: { fecha: string; cantidad: number }[] = [];
        const participacionesPorFecha = new Map<string, number>();
        
        participacionesSorteo.forEach(p => {
          const fecha = new Date(p.fechaParticipacion).toISOString().split('T')[0];
          participacionesPorFecha.set(fecha, (participacionesPorFecha.get(fecha) || 0) + 1);
        });
        
        participacionesPorFecha.forEach((cantidad, fecha) => {
          participacionesPorDia.push({ fecha, cantidad });
        });
        
        participacionesPorDia.sort((a: { fecha: string; cantidad: number }, b: { fecha: string; cantidad: number }) => a.fecha.localeCompare(b.fecha));
        
        // Calcular participantes únicos
        const participantesUnicos = new Set(participacionesSorteo.map(p => p.userId)).size;
        
        // Calcular tasa de conversión (participaciones / participantes únicos)
        const tasaConversion = participantesUnicos > 0 
          ? participacionesSorteo.length / participantesUnicos 
          : 0;
        
        // Comparación con sorteos anteriores (simulado)
        const sorteosFinalizados = sorteos.filter(s => s.estado === 'finalizado' && s.id !== sorteoId);
        const promedioAnterior = sorteosFinalizados.length > 0
          ? sorteosFinalizados.reduce((sum: number, s: Sorteo) => sum + s.participantes, 0) / sorteosFinalizados.length
          : 0;
        const comparacion = promedioAnterior > 0 
          ? ((participacionesSorteo.length - promedioAnterior) / promedioAnterior) * 100 
          : 0;
        
        return {
          totalParticipantes: participacionesSorteo.length,
          participantesUnicos,
          tasaConversion: Math.round(tasaConversion * 100) / 100,
          participacionesPorDia,
          comparacionSorteosAnteriores: Math.round(comparacion * 100) / 100
        };
      },

      obtenerEstadisticasGenerales: () => {
        const { sorteos, participaciones } = get();
        
        const totalSorteos = sorteos.length;
        const sorteosActivos = sorteos.filter(s => s.estado === 'activo').length;
        const sorteosFinalizados = sorteos.filter(s => s.estado === 'finalizado').length;
        const totalParticipaciones = participaciones.length;
        const totalParticipantesUnicos = new Set(participaciones.map(p => p.userId)).size;
        
        const promedioParticipacionesPorSorteo = totalSorteos > 0 
          ? Math.round(totalParticipaciones / totalSorteos) 
          : 0;
        
        // Sorteos con mayor participación
        const sorteosConMayorParticipacion = sorteos
          .map(s => ({
            sorteoId: s.id,
            titulo: s.titulo,
            participaciones: participaciones.filter(p => p.sorteoId === s.id).length
          }))
          .sort((a, b) => b.participaciones - a.participaciones)
          .slice(0, 5);
        
        return {
          totalSorteos,
          sorteosActivos,
          sorteosFinalizados,
          totalParticipaciones,
          totalParticipantesUnicos,
          promedioParticipacionesPorSorteo,
          sorteosConMayorParticipacion
        };
      },

      enviarNotificacionGanador: (ganadorId: string) => {
        const { ganadores } = get();
        
        const ganadoresActualizados = ganadores.map(g =>
          g.id === ganadorId ? { ...g, notificado: true } : g
        );
        
        set({ ganadores: ganadoresActualizados });
      },

      // ==================== ACCIONES MUNDIAL 2026 ====================
      
      cargarPartidos: () => {
        // Los partidos ya están cargados en el estado inicial
      },

      seleccionarPartido: (partido: Partido | null) => {
        set({ partidoActivo: partido });
      },

      crearPartido: (partidoData: Omit<Partido, 'id' | 'creadoPor' | 'fechaCreacion'>) => {
        const { user, partidos } = get();
        const nuevoPartido: Partido = {
          ...partidoData,
          id: `partido-${Date.now()}`,
          creadoPor: user?.email || 'admin@hiperdelpollo.com',
          fechaCreacion: new Date().toISOString()
        };
        
        set({ partidos: [...partidos, nuevoPartido] });
        return nuevoPartido;
      },

      actualizarPartido: (partidoId: string, partidoData: Partial<Partido>) => {
        const { partidos } = get();
        const partidoIndex = partidos.findIndex(p => p.id === partidoId);
        
        if (partidoIndex === -1) return false;
        
        const partidosActualizados = [...partidos];
        partidosActualizados[partidoIndex] = {
          ...partidosActualizados[partidoIndex],
          ...partidoData
        };
        
        set({ partidos: partidosActualizados });
        return true;
      },

      eliminarPartido: (partidoId: string) => {
        const { partidos } = get();
        const partidosFiltrados = partidos.filter(p => p.id !== partidoId);
        
        if (partidosFiltrados.length === partidos.length) return false;
        
        set({ partidos: partidosFiltrados });
        return true;
      },

      realizarPrediccion: async (partidoId: string, sorteoId: string, golesLocal: number, golesVisitante: number): Promise<Prediccion | null> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const { user, predicciones, participaciones, sorteos } = get();
        if (!user) return null;
        
        // Verificar si ya hizo una predicción para este partido
        const yaPredijo = predicciones.some(
          p => p.partidoId === partidoId && p.userId === user.id
        );
        
        if (yaPredijo) return null;
        
        const nuevaPrediccion: Prediccion = {
          id: `pred-${Date.now()}`,
          userId: user.id,
          partidoId: partidoId,
          sorteoId: sorteoId,
          golesLocal,
          golesVisitante,
          fechaPrediccion: new Date().toISOString(),
          estado: 'pendiente',
          tripleChanceAplicado: false
        };
        
        // Verificar si el usuario ya participa en el sorteo
        const yaParticipaEnSorteo = participaciones.some(
          p => p.sorteoId === sorteoId && p.userId === user.id
        );
        
        // Si no participa, agregarlo automáticamente
        if (!yaParticipaEnSorteo) {
          const nuevaParticipacion: Participacion = {
            id: `part-${Date.now()}`,
            userId: user.id,
            sorteoId: sorteoId,
            fechaParticipacion: new Date().toISOString(),
            numeroTicket: `T${Date.now().toString(36).toUpperCase()}`,
            estado: 'activo',
            chances: 1,
            esAcertador: false
          };
          
          // Actualizar contador de participantes del sorteo
          const nuevosSorteos = sorteos.map(s => 
            s.id === sorteoId 
              ? { ...s, participantes: s.participantes + 1 }
              : s
          );
          
          const sorteo = sorteos.find(s => s.id === sorteoId);
          const nuevaNotificacion: Notificacion = {
            id: `notif-${Date.now()}`,
            userId: user.id,
            tipo: 'prediccion',
            titulo: '¡Predicción registrada!',
            mensaje: `Tu predicción ha sido guardada. ¡Ya estás participando en el sorteo "${sorteo?.titulo}"! Acertá el resultado para obtener TRIPLE CHANCE.`,
            fecha: new Date().toISOString(),
            leida: false,
            sorteoId: sorteoId,
            partidoId: partidoId
          };
          
          set({ 
            predicciones: [...predicciones, nuevaPrediccion],
            participaciones: [...participaciones, nuevaParticipacion],
            sorteos: nuevosSorteos,
            notificaciones: [nuevaNotificacion, ...get().notificaciones]
          });
        } else {
          // Solo agregar la predicción
          const sorteo = sorteos.find(s => s.id === sorteoId);
          const nuevaNotificacion: Notificacion = {
            id: `notif-${Date.now()}`,
            userId: user.id,
            tipo: 'prediccion',
            titulo: '¡Predicción registrada!',
            mensaje: `Tu predicción ha sido guardada. Acertá el resultado para obtener TRIPLE CHANCE en el sorteo "${sorteo?.titulo}".`,
            fecha: new Date().toISOString(),
            leida: false,
            sorteoId: sorteoId,
            partidoId: partidoId
          };
          
          set({ 
            predicciones: [...predicciones, nuevaPrediccion],
            notificaciones: [nuevaNotificacion, ...get().notificaciones]
          });
        }
        
        return nuevaPrediccion;
      },

      verificarPrediccion: (partidoId: string) => {
        const { user, predicciones } = get();
        if (!user) return undefined;
        
        return predicciones.find(
          p => p.partidoId === partidoId && p.userId === user.id
        );
      },

      obtenerPrediccionesPorPartido: (partidoId: string) => {
        const { predicciones } = get();
        return predicciones.filter(p => p.partidoId === partidoId);
      },

      seleccionarAcertadores: (partidoId: string, userIds: string[]) => {
        const { predicciones, partidos } = get();
        const partido = partidos.find(p => p.id === partidoId);
        
        if (!partido || partido.golesLocal === undefined || partido.golesVisitante === undefined) {
          return;
        }
        
        // Actualizar estado de las predicciones acertadas
        const prediccionesActualizadas = predicciones.map(p => {
          if (p.partidoId === partidoId && userIds.includes(p.userId)) {
            return { 
              ...p, 
              estado: 'acertado' as const
            };
          }
          return p;
        });
        
        set({ predicciones: prediccionesActualizadas });
      },

      aplicarTripleChance: (partidoId: string) => {
        const { predicciones, participaciones, user } = get();
        
        // Obtener los acertadores de este partido
        const acertadores = predicciones.filter(
          p => p.partidoId === partidoId && p.estado === 'acertado' && !p.tripleChanceAplicado
        );
        
        if (acertadores.length === 0) return;
        
        // Actualizar participaciones para aplicar triple chance
        const participacionesActualizadas = participaciones.map(p => {
          const esAcertador = acertadores.some(a => a.userId === p.userId && a.sorteoId === p.sorteoId);
          if (esAcertador) {
            return {
              ...p,
              chances: 3, // Triple chance
              esAcertador: true
            };
          }
          return p;
        });
        
        // Marcar predicciones como triple chance aplicado
        const prediccionesActualizadas = predicciones.map(p => {
          if (p.partidoId === partidoId && p.estado === 'acertado') {
            return { ...p, tripleChanceAplicado: true };
          }
          return p;
        });
        
        // Crear notificaciones para los acertadores
        const notificacionesTripleChance: Notificacion[] = acertadores.map(a => ({
          id: `notif-tc-${Date.now()}-${a.userId}`,
          userId: a.userId,
          tipo: 'triple-chance',
          titulo: '¡TRIPLE CHANCE ACTIVADO! 🎉',
          mensaje: '¡Felicitaciones! Acertaste el resultado del partido. Ahora tenés TRIPLE CHANCE de ganar el sorteo. ¡Tus chances se multiplicaron x3!',
          fecha: new Date().toISOString(),
          leida: false,
          partidoId: partidoId
        }));
        
        set({ 
          participaciones: participacionesActualizadas,
          predicciones: prediccionesActualizadas,
          notificaciones: [...notificacionesTripleChance, ...get().notificaciones]
        });
      },

      obtenerAcertadoresPorPartido: (partidoId: string) => {
        const { predicciones, partidos } = get();
        const partido = partidos.find(p => p.id === partidoId);
        
        if (!partido) return [];
        
        const usuarios = JSON.parse(localStorage.getItem('hiperdelpollo-users') || '[]');
        
        return predicciones
          .filter(p => p.partidoId === partidoId && p.estado === 'acertado')
          .map(p => {
            const usuarioData = usuarios.find((u: any) => u.id === p.userId);
            const { password, ...usuario } = usuarioData || {};
            return {
              userId: p.userId,
              prediccionId: p.id,
              partidoId: p.partidoId,
              usuario: usuario || {
                id: p.userId,
                nombre: 'Usuario',
                apellido: 'Desconocido',
                email: 'unknown@email.com',
                telefono: '',
                dni: '',
                fechaNacimiento: '',
                ciudad: '',
                createdAt: ''
              },
              prediccion: p,
              resultadoReal: {
                golesLocal: partido.golesLocal || 0,
                golesVisitante: partido.golesVisitante || 0
              },
              fechaAcerto: p.fechaPrediccion
            };
          });
      },

      obtenerEstadisticasPredicciones: (sorteoId?: string) => {
        const { predicciones, partidos, participaciones } = get();
        
        const prediccionesFiltradas = sorteoId 
          ? predicciones.filter(p => p.sorteoId === sorteoId)
          : predicciones;
        
        const totalPredicciones = prediccionesFiltradas.length;
        const totalAcertadores = prediccionesFiltradas.filter(p => p.estado === 'acertado').length;
        const porcentajeAcierto = totalPredicciones > 0 
          ? Math.round((totalAcertadores / totalPredicciones) * 100) 
          : 0;
        
        // Predicciones por partido
        const prediccionesPorPartido = partidos.map(partido => {
          const preds = predicciones.filter(p => p.partidoId === partido.id);
          const acertadores = preds.filter(p => p.estado === 'acertado');
          return {
            partidoId: partido.id,
            titulo: `${partido.equipoLocal.nombre} vs ${partido.equipoVisitante.nombre}`,
            predicciones: preds.length,
            acertadores: acertadores.length
          };
        });
        
        // Usuarios con triple chance
        const usuariosConTripleChance = new Set(
          participaciones.filter(p => p.chances === 3).map(p => p.userId)
        ).size;
        
        return {
          totalPredicciones,
          totalAcertadores,
          porcentajeAcierto,
          prediccionesPorPartido,
          usuariosConTripleChance
        };
      },

      // ==================== RECUPERACIÓN DE CONTRASEÑA ====================
      
      solicitarRecuperacion: async (email: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar si existe el usuario
        const usuarios = JSON.parse(localStorage.getItem('hiperdelpollo-users') || '[]');
        const usuario = usuarios.find((u: any) => u.email === email);
        
        if (!usuario) {
          return { success: false, mensaje: 'No se encontró una cuenta con ese email' };
        }
        
        // Generar código de 6 dígitos
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Guardar código en localStorage (en producción se enviaría por email)
        const codigosRecuperacion = JSON.parse(localStorage.getItem('hiperdelpollo-codigos') || '{}');
        codigosRecuperacion[email] = {
          codigo,
          expira: Date.now() + 30 * 60 * 1000 // 30 minutos
        };
        localStorage.setItem('hiperdelpollo-codigos', JSON.stringify(codigosRecuperacion));
        
        return { success: true, codigo };
      },
      
      verificarCodigo: async (email: string, codigo: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const codigosRecuperacion = JSON.parse(localStorage.getItem('hiperdelpollo-codigos') || '{}');
        const datosCodigo = codigosRecuperacion[email];
        
        if (!datosCodigo) {
          return false;
        }
        
        // Verificar expiración
        if (Date.now() > datosCodigo.expira) {
          delete codigosRecuperacion[email];
          localStorage.setItem('hiperdelpollo-codigos', JSON.stringify(codigosRecuperacion));
          return false;
        }
        
        // Verificar código
        if (datosCodigo.codigo !== codigo) {
          return false;
        }
        
        // Marcar código como verificado
        codigosRecuperacion[email].verificado = true;
        localStorage.setItem('hiperdelpollo-codigos', JSON.stringify(codigosRecuperacion));
        
        return true;
      },
      
      cambiarPassword: async (email: string, newPassword: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Verificar que el código fue verificado
        const codigosRecuperacion = JSON.parse(localStorage.getItem('hiperdelpollo-codigos') || '{}');
        const datosCodigo = codigosRecuperacion[email];
        
        if (!datosCodigo || !datosCodigo.verificado) {
          return false;
        }
        
        // Actualizar contraseña del usuario
        const usuarios = JSON.parse(localStorage.getItem('hiperdelpollo-users') || '[]');
        const usuarioIndex = usuarios.findIndex((u: any) => u.email === email);
        
        if (usuarioIndex === -1) {
          return false;
        }
        
        usuarios[usuarioIndex].password = newPassword;
        localStorage.setItem('hiperdelpollo-users', JSON.stringify(usuarios));
        
        // Limpiar código usado
        delete codigosRecuperacion[email];
        localStorage.setItem('hiperdelpollo-codigos', JSON.stringify(codigosRecuperacion));
        
        return true;
      },

      // ==================== PERFIL DE USUARIO ====================
      
      actualizarPerfil: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { user } = get();
        if (!user) return false;
        
        // Actualizar en localStorage
        const usuarios = JSON.parse(localStorage.getItem('hiperdelpollo-users') || '[]');
        const usuarioIndex = usuarios.findIndex((u: any) => u.id === user.id);
        
        if (usuarioIndex === -1) return false;
        
        const usuarioActualizado = { ...usuarios[usuarioIndex], ...data };
        usuarios[usuarioIndex] = usuarioActualizado;
        localStorage.setItem('hiperdelpollo-users', JSON.stringify(usuarios));
        
        // Actualizar en el store
        set({ user: { ...user, ...data } });
        
        return true;
      },

      // ==================== CONFIGURACIÓN DE LA APP ====================
      
      prediccionesHabilitadas: true,
      
      togglePredicciones: () => {
        const { prediccionesHabilitadas } = get();
        set({ prediccionesHabilitadas: !prediccionesHabilitadas });
      }
    }),
    {
      name: 'hiperdelpollo-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        esAdmin: state.esAdmin,
        participaciones: state.participaciones,
        notificaciones: state.notificaciones,
        ganadores: state.ganadores,
        sorteos: state.sorteos,
        partidos: state.partidos,
        predicciones: state.predicciones,
        prediccionesHabilitadas: state.prediccionesHabilitadas
      })
    }
  )
);
