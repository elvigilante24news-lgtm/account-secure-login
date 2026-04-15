import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { AppState, User, Sorteo, Participacion, Notificacion, Ganador, RegisterData, Partido, Equipo, Prediccion, Acertador, Premio } from '@/types';

// Helper: map DB profile row + auth user to our User type
const mapProfile = (profile: any, email: string): User => ({
  id: profile.id,
  nombre: profile.nombre || '',
  apellido: profile.apellido || '',
  email,
  telefono: profile.telefono || '',
  dni: profile.dni || '',
  fechaNacimiento: profile.fecha_nacimiento || '',
  ciudad: profile.ciudad || '',
  createdAt: profile.created_at,
});

// Helper: map DB sorteo row + premios to our Sorteo type
const mapSorteo = (row: any, premios: Premio[]): Sorteo => ({
  id: row.id,
  titulo: row.titulo,
  descripcion: row.descripcion || '',
  imagen: row.imagen || '',
  fechaInicio: row.fecha_inicio,
  fechaFin: row.fecha_fin,
  fechaSorteo: row.fecha_sorteo,
  estado: row.estado,
  participantes: row.participantes || 0,
  maxParticipantes: row.max_participantes,
  requisitos: row.requisitos || [],
  edadMinima: row.edad_minima || 18,
  edadMaxima: row.edad_maxima,
  requisitosPersonalizados: [],
  terminosCondiciones: row.terminos_condiciones || '',
  creadoPor: row.creado_por || '',
  fechaCreacion: row.created_at,
  tipoSorteo: row.tipo_sorteo || 'posiciones',
  cantidadGanadores: row.cantidad_ganadores,
  premios,
});

const mapPremio = (row: any): Premio => ({
  id: row.id,
  puesto: row.puesto,
  nombre: row.nombre,
  descripcion: row.descripcion || '',
  imagen: row.imagen || '',
  valor: row.valor || '',
});

const mapEquipo = (row: any): Equipo => ({
  id: row.id,
  nombre: row.nombre,
  codigo: row.codigo,
  bandera: row.bandera,
  grupo: row.grupo,
});

const mapPartido = (row: any, equipoLocal: Equipo, equipoVisitante: Equipo): Partido => ({
  id: row.id,
  equipoLocal,
  equipoVisitante,
  fecha: row.fecha,
  hora: row.hora,
  estadio: row.estadio,
  ciudad: row.ciudad,
  fase: row.fase,
  grupo: row.grupo,
  jornada: row.jornada,
  estado: row.estado,
  golesLocal: row.goles_local,
  golesVisitante: row.goles_visitante,
  imagen: row.imagen || '',
  video: row.video || '',
  descripcion: row.descripcion || '',
  creadoPor: row.creado_por || '',
  fechaCreacion: row.created_at,
  sorteoId: row.sorteo_id,
});

const mapParticipacion = (row: any): Participacion => ({
  id: row.id,
  userId: row.user_id,
  sorteoId: row.sorteo_id,
  fechaParticipacion: row.fecha_participacion,
  numeroTicket: row.numero_ticket,
  estado: row.estado,
  puesto: row.puesto,
  chances: row.chances || 1,
  esAcertador: row.es_acertador || false,
});

const mapPrediccion = (row: any): Prediccion => ({
  id: row.id,
  userId: row.user_id,
  partidoId: row.partido_id,
  sorteoId: row.sorteo_id,
  golesLocal: row.goles_local,
  golesVisitante: row.goles_visitante,
  fechaPrediccion: row.fecha_prediccion,
  estado: row.estado,
  tripleChanceAplicado: row.triple_chance_aplicado || false,
});

const mapNotificacion = (row: any): Notificacion => ({
  id: row.id,
  userId: row.user_id,
  tipo: row.tipo,
  titulo: row.titulo,
  mensaje: row.mensaje,
  fecha: row.fecha,
  leida: row.leida,
  sorteoId: row.sorteo_id,
  partidoId: row.partido_id,
});

export const useStore = create<AppState>()((set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  esAdmin: false,

  // Sorteos
  sorteos: [],
  sorteoActivo: null,

  // Participaciones
  participaciones: [],

  // Notificaciones
  notificaciones: [],

  // Ganadores
  ganadores: [],

  // Mundial 2026
  partidos: [],
  partidoActivo: null,
  predicciones: [],

  // Config
  prediccionesHabilitadas: true,

  // ==================== AUTH ====================
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
    if (!profile) return false;

    const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id);
    const isAdmin = roles?.some(r => r.role === 'admin') || false;

    set({
      user: mapProfile(profile, data.user.email || email),
      isAuthenticated: true,
      esAdmin: isAdmin,
    });

    // Load data after login
    get().cargarSorteos();
    get().cargarPartidos();
    get().cargarNotificaciones();
    get().cargarParticipaciones();
    get().cargarPredicciones();

    return true;
  },

  register: async (userData: RegisterData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          nombre: userData.nombre,
          apellido: userData.apellido,
          telefono: userData.telefono,
          dni: userData.dni,
          fecha_nacimiento: userData.fechaNacimiento,
          ciudad: userData.ciudad,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('El email ya está registrado');
      }
      throw new Error(error.message);
    }

    return true;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      isAuthenticated: false,
      esAdmin: false,
      sorteos: [],
      participaciones: [],
      notificaciones: [],
      ganadores: [],
      partidos: [],
      predicciones: [],
    });
  },

  // ==================== LOAD DATA ====================
  cargarSorteos: async () => {
    const { data: sorteosRows } = await supabase.from('sorteos').select('*').order('created_at', { ascending: false });
    if (!sorteosRows) return;

    const { data: premiosRows } = await supabase.from('premios').select('*');
    const premiosBySorteo: Record<string, Premio[]> = {};
    premiosRows?.forEach(p => {
      if (!premiosBySorteo[p.sorteo_id]) premiosBySorteo[p.sorteo_id] = [];
      premiosBySorteo[p.sorteo_id].push(mapPremio(p));
    });

    // Sort premios by puesto
    Object.values(premiosBySorteo).forEach(arr => arr.sort((a, b) => a.puesto - b.puesto));

    const sorteos = sorteosRows.map(s => mapSorteo(s, premiosBySorteo[s.id] || []));
    set({ sorteos });
  },

  cargarPartidos: async () => {
    const { data: partidosRows } = await supabase.from('partidos').select('*').order('fecha', { ascending: true });
    if (!partidosRows) return;

    const { data: equiposRows } = await supabase.from('equipos').select('*');
    const equiposMap: Record<string, Equipo> = {};
    equiposRows?.forEach(e => { equiposMap[e.id] = mapEquipo(e); });

    const partidos = partidosRows.map(p => 
      mapPartido(p, equiposMap[p.equipo_local_id] || { id: p.equipo_local_id, nombre: '?', codigo: '?', bandera: '', grupo: '' },
                   equiposMap[p.equipo_visitante_id] || { id: p.equipo_visitante_id, nombre: '?', codigo: '?', bandera: '', grupo: '' })
    );
    set({ partidos });
  },

  cargarNotificaciones: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const { data } = await supabase.from('notificaciones').select('*').eq('user_id', user.user.id).order('fecha', { ascending: false });
    if (data) set({ notificaciones: data.map(mapNotificacion) });
  },

  cargarParticipaciones: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    
    // Admin loads ALL participaciones, users load only their own
    const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', user.user.id);
    const isAdmin = roles?.some(r => r.role === 'admin') || false;
    
    let data;
    if (isAdmin) {
      const res = await supabase.from('participaciones').select('*');
      data = res.data;
    } else {
      const res = await supabase.from('participaciones').select('*').eq('user_id', user.user.id);
      data = res.data;
    }
    if (data) set({ participaciones: data.map(mapParticipacion) });
  },

  cargarPredicciones: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const { data } = await supabase.from('predicciones').select('*').eq('user_id', user.user.id);
    if (data) set({ predicciones: data.map(mapPrediccion) });
  },

  cargarGanadores: async () => {
    const { data } = await supabase.from('ganadores').select('*, premios(*)');
    if (!data) return;
    
    const ganadores: Ganador[] = [];
    for (const g of data) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', g.user_id).single();
      const premio = g.premios ? mapPremio(g.premios) : { id: g.premio_id, puesto: g.puesto, nombre: '', descripcion: '', imagen: '', valor: '' };
      ganadores.push({
        id: g.id,
        userId: g.user_id,
        sorteoId: g.sorteo_id,
        puesto: g.puesto,
        tipo: g.tipo,
        premio,
        fechaGanado: g.fecha_ganado,
        notificado: g.notificado,
        usuario: profile ? mapProfile(profile, '') : {
          id: g.user_id, nombre: 'Usuario', apellido: 'Desconocido',
          email: '', telefono: '', dni: '', fechaNacimiento: '', ciudad: '', createdAt: '',
        },
      });
    }
    set({ ganadores });
  },

  seleccionarSorteo: (sorteo) => set({ sorteoActivo: sorteo }),

  participarEnSorteo: async (sorteoId: string) => {
    const { user } = get();
    if (!user) return false;

    const yaParticipa = get().participaciones.some(p => p.sorteoId === sorteoId && p.userId === user.id);
    if (yaParticipa) return false;

    const ticket = `T${Date.now().toString(36).toUpperCase()}`;
    const { error } = await supabase.from('participaciones').insert({
      user_id: user.id,
      sorteo_id: sorteoId,
      numero_ticket: ticket,
      estado: 'activo',
      chances: 1,
      es_acertador: false,
    });
    if (error) return false;

    // Increment participantes
    await supabase.rpc('increment_participantes', { sorteo_uuid: sorteoId });

    // Create notification
    const sorteo = get().sorteos.find(s => s.id === sorteoId);
    await supabase.from('notificaciones').insert({
      user_id: user.id,
      tipo: 'confirmacion',
      titulo: '¡Participación confirmada!',
      mensaje: `Ya estás participando en el sorteo "${sorteo?.titulo}". ¡Mucha suerte!`,
      sorteo_id: sorteoId,
    });

    // Reload
    get().cargarParticipaciones();
    get().cargarNotificaciones();
    get().cargarSorteos();
    return true;
  },

  verificarParticipacion: (sorteoId: string) => {
    const { user, participaciones } = get();
    if (!user) return false;
    return participaciones.some(p => p.sorteoId === sorteoId && p.userId === user.id);
  },

  marcarNotificacionLeida: async (id: string) => {
    await supabase.from('notificaciones').update({ leida: true }).eq('id', id);
    set({ notificaciones: get().notificaciones.map(n => n.id === id ? { ...n, leida: true } : n) });
  },

  // ==================== ADMIN: SORTEO ====================
  realizarSorteo: async (sorteoId: string) => {
    const { participaciones, sorteos } = get();
    const participantesSorteo = participaciones.filter(p => p.sorteoId === sorteoId);
    const sorteo = sorteos.find(s => s.id === sorteoId);

    if (!sorteo || participantesSorteo.length < 1) return [];

    let participacionesPonderadas: Participacion[] = [];
    participantesSorteo.forEach(p => {
      const chances = p.chances || 1;
      for (let i = 0; i < chances; i++) participacionesPonderadas.push(p);
    });

    const mezclados = [...participacionesPonderadas].sort(() => Math.random() - 0.5);
    const cantidadGanadores = sorteo.tipoSorteo === 'cantidad' && sorteo.cantidadGanadores
      ? sorteo.cantidadGanadores : sorteo.premios.length;

    const ganadoresSeleccionados: Participacion[] = [];
    const userIdsSeleccionados = new Set<string>();

    for (const p of mezclados) {
      if (!userIdsSeleccionados.has(p.userId)) {
        ganadoresSeleccionados.push(p);
        userIdsSeleccionados.add(p.userId);
        if (ganadoresSeleccionados.length >= cantidadGanadores) break;
      }
    }

    const nuevosGanadores: Ganador[] = [];

    for (let i = 0; i < ganadoresSeleccionados.length; i++) {
      const p = ganadoresSeleccionados[i];
      const premio = sorteo.tipoSorteo === 'cantidad'
        ? sorteo.premios[0]
        : (sorteo.premios[i] || sorteo.premios[sorteo.premios.length - 1]);

      // Get user profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', p.userId).single();

      // Get user email from auth - use profiles table email if available, otherwise leave empty
      let userEmail = '';

      const { data: ganadorRow } = await supabase.from('ganadores').insert({
        user_id: p.userId,
        sorteo_id: sorteoId,
        puesto: i + 1,
        premio_id: premio.id,
        tipo: 'titular',
        notificado: false,
      }).select().single();

      if (ganadorRow) {
        nuevosGanadores.push({
          id: ganadorRow.id,
          userId: p.userId,
          sorteoId: sorteoId,
          puesto: i + 1,
          tipo: 'titular',
          premio,
          fechaGanado: ganadorRow.fecha_ganado,
          notificado: false,
          usuario: profile ? mapProfile(profile, userEmail) : {
            id: p.userId, nombre: 'Usuario', apellido: 'Desconocido',
            email: '', telefono: '', dni: '', fechaNacimiento: '', ciudad: '', createdAt: '',
          },
        });

        // Notify titular only
        await supabase.from('notificaciones').insert({
          user_id: p.userId,
          tipo: 'ganador',
          titulo: '¡FELICITACIONES! ¡GANASTE! 🎉',
          mensaje: `¡Sos el ${sorteo.tipoSorteo === 'cantidad' ? 'GANADOR' : `${i + 1}° PUESTO`} del sorteo "${sorteo.titulo}"! Ganaste: ${premio.nombre} (${premio.valor}). ¡Te contactaremos pronto!`,
          sorteo_id: sorteoId,
        });
      }

      // Update participacion
      await supabase.from('participaciones').update({ estado: 'ganador', puesto: i + 1 }).eq('id', p.id);
    }

    // Select suplentes
    const cantidadSuplentes = Math.min(cantidadGanadores, participantesSorteo.length - ganadoresSeleccionados.length);
    const suplentesSeleccionados: Participacion[] = [];
    for (const p of mezclados) {
      if (!userIdsSeleccionados.has(p.userId)) {
        suplentesSeleccionados.push(p);
        userIdsSeleccionados.add(p.userId);
        if (suplentesSeleccionados.length >= cantidadSuplentes) break;
      }
    }

    for (let i = 0; i < suplentesSeleccionados.length; i++) {
      const p = suplentesSeleccionados[i];
      const premio = sorteo.tipoSorteo === 'cantidad'
        ? sorteo.premios[0]
        : (sorteo.premios[i] || sorteo.premios[sorteo.premios.length - 1]);

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', p.userId).single();

      const { data: ganadorRow } = await supabase.from('ganadores').insert({
        user_id: p.userId,
        sorteo_id: sorteoId,
        puesto: i + 1,
        premio_id: premio.id,
        tipo: 'suplente',
        notificado: false,
      }).select().single();

      if (ganadorRow) {
        nuevosGanadores.push({
          id: ganadorRow.id,
          userId: p.userId,
          sorteoId: sorteoId,
          puesto: i + 1,
          tipo: 'suplente',
          premio,
          fechaGanado: ganadorRow.fecha_ganado,
          notificado: false,
          usuario: profile ? mapProfile(profile, '') : {
            id: p.userId, nombre: 'Usuario', apellido: 'Desconocido',
            email: '', telefono: '', dni: '', fechaNacimiento: '', ciudad: '', createdAt: '',
          },
        });
      }
    }

    // Mark sorteo as finalizado
    await supabase.from('sorteos').update({ estado: 'finalizado' }).eq('id', sorteoId);

    set({ ganadores: [...get().ganadores, ...nuevosGanadores] });
    await get().cargarSorteos();
    await get().cargarParticipaciones();
    await get().cargarNotificaciones();

    return nuevosGanadores;
  },

  crearSorteo: (sorteoData) => {
    const { user } = get();
    const nuevoSorteo: Sorteo = {
      ...sorteoData,
      id: '',
      creadoPor: user?.email || '',
      fechaCreacion: new Date().toISOString(),
      participantes: 0,
    };

    // Save async
    const save = async () => {
      const { data: sorteoRow } = await supabase.from('sorteos').insert({
        titulo: sorteoData.titulo,
        descripcion: sorteoData.descripcion,
        imagen: sorteoData.imagen,
        fecha_inicio: sorteoData.fechaInicio,
        fecha_fin: sorteoData.fechaFin,
        fecha_sorteo: sorteoData.fechaSorteo,
        estado: sorteoData.estado,
        max_participantes: sorteoData.maxParticipantes,
        requisitos: sorteoData.requisitos,
        edad_minima: sorteoData.edadMinima,
        edad_maxima: sorteoData.edadMaxima,
        terminos_condiciones: sorteoData.terminosCondiciones,
        tipo_sorteo: sorteoData.tipoSorteo,
        cantidad_ganadores: sorteoData.cantidadGanadores,
        creado_por: user?.id,
      }).select().single();

      if (sorteoRow) {
        // Save premios
        for (const premio of sorteoData.premios) {
          await supabase.from('premios').insert({
            sorteo_id: sorteoRow.id,
            puesto: premio.puesto,
            nombre: premio.nombre,
            descripcion: premio.descripcion,
            imagen: premio.imagen,
            valor: premio.valor,
          });
        }
        get().cargarSorteos();
      }
    };
    save();
    return nuevoSorteo;
  },

  actualizarSorteo: (sorteoId, sorteoData) => {
    const save = async () => {
      const updateData: any = {};
      if (sorteoData.titulo !== undefined) updateData.titulo = sorteoData.titulo;
      if (sorteoData.descripcion !== undefined) updateData.descripcion = sorteoData.descripcion;
      if (sorteoData.imagen !== undefined) updateData.imagen = sorteoData.imagen;
      if (sorteoData.fechaInicio !== undefined) updateData.fecha_inicio = sorteoData.fechaInicio;
      if (sorteoData.fechaFin !== undefined) updateData.fecha_fin = sorteoData.fechaFin;
      if (sorteoData.fechaSorteo !== undefined) updateData.fecha_sorteo = sorteoData.fechaSorteo;
      if (sorteoData.estado !== undefined) updateData.estado = sorteoData.estado;
      if (sorteoData.maxParticipantes !== undefined) updateData.max_participantes = sorteoData.maxParticipantes;
      if (sorteoData.requisitos !== undefined) updateData.requisitos = sorteoData.requisitos;
      if (sorteoData.edadMinima !== undefined) updateData.edad_minima = sorteoData.edadMinima;
      if (sorteoData.terminosCondiciones !== undefined) updateData.terminos_condiciones = sorteoData.terminosCondiciones;
      if (sorteoData.tipoSorteo !== undefined) updateData.tipo_sorteo = sorteoData.tipoSorteo;
      if (sorteoData.cantidadGanadores !== undefined) updateData.cantidad_ganadores = sorteoData.cantidadGanadores;
      
      await supabase.from('sorteos').update(updateData).eq('id', sorteoId);
      get().cargarSorteos();
    };
    save();
    return true;
  },

  eliminarSorteo: (sorteoId) => {
    const del = async () => {
      await supabase.from('sorteos').delete().eq('id', sorteoId);
      get().cargarSorteos();
    };
    del();
    return true;
  },

  obtenerGanadoresPorSorteo: (sorteoId) => {
    return get().ganadores.filter(g => g.sorteoId === sorteoId);
  },

  obtenerEstadisticasSorteo: (sorteoId) => {
    const { participaciones, sorteos } = get();
    const participacionesSorteo = participaciones.filter(p => p.sorteoId === sorteoId);
    const participacionesPorDia: { fecha: string; cantidad: number }[] = [];
    const participacionesPorFecha = new Map<string, number>();
    participacionesSorteo.forEach(p => {
      const fecha = new Date(p.fechaParticipacion).toISOString().split('T')[0];
      participacionesPorFecha.set(fecha, (participacionesPorFecha.get(fecha) || 0) + 1);
    });
    participacionesPorFecha.forEach((cantidad, fecha) => participacionesPorDia.push({ fecha, cantidad }));
    participacionesPorDia.sort((a, b) => a.fecha.localeCompare(b.fecha));
    const participantesUnicos = new Set(participacionesSorteo.map(p => p.userId)).size;
    const tasaConversion = participantesUnicos > 0 ? participacionesSorteo.length / participantesUnicos : 0;
    const sorteosFinalizados = sorteos.filter(s => s.estado === 'finalizado' && s.id !== sorteoId);
    const promedioAnterior = sorteosFinalizados.length > 0
      ? sorteosFinalizados.reduce((sum, s) => sum + s.participantes, 0) / sorteosFinalizados.length : 0;
    const comparacion = promedioAnterior > 0 ? ((participacionesSorteo.length - promedioAnterior) / promedioAnterior) * 100 : 0;
    return {
      totalParticipantes: participacionesSorteo.length,
      participantesUnicos,
      tasaConversion: Math.round(tasaConversion * 100) / 100,
      participacionesPorDia,
      comparacionSorteosAnteriores: Math.round(comparacion * 100) / 100,
    };
  },

  obtenerEstadisticasGenerales: () => {
    const { sorteos, participaciones } = get();
    const totalSorteos = sorteos.length;
    const sorteosActivos = sorteos.filter(s => s.estado === 'activo').length;
    const sorteosFinalizados = sorteos.filter(s => s.estado === 'finalizado').length;
    const totalParticipaciones = participaciones.length;
    const totalParticipantesUnicos = new Set(participaciones.map(p => p.userId)).size;
    const promedioParticipacionesPorSorteo = totalSorteos > 0 ? Math.round(totalParticipaciones / totalSorteos) : 0;
    const sorteosConMayorParticipacion = sorteos
      .map(s => ({ sorteoId: s.id, titulo: s.titulo, participaciones: participaciones.filter(p => p.sorteoId === s.id).length }))
      .sort((a, b) => b.participaciones - a.participaciones)
      .slice(0, 5);
    return { totalSorteos, sorteosActivos, sorteosFinalizados, totalParticipaciones, totalParticipantesUnicos, promedioParticipacionesPorSorteo, sorteosConMayorParticipacion };
  },

  enviarNotificacionGanador: async (ganadorId: string) => {
    await supabase.from('ganadores').update({ notificado: true }).eq('id', ganadorId);
    set({ ganadores: get().ganadores.map(g => g.id === ganadorId ? { ...g, notificado: true } : g) });
  },

  // ==================== MUNDIAL 2026 ====================

  seleccionarPartido: (partido) => set({ partidoActivo: partido }),

  crearPartido: (partidoData) => {
    const { user } = get();
    const nuevoPartido: Partido = { ...partidoData, id: '', creadoPor: user?.email || '', fechaCreacion: new Date().toISOString() };

    const save = async () => {
      await supabase.from('partidos').insert({
        equipo_local_id: partidoData.equipoLocal.id,
        equipo_visitante_id: partidoData.equipoVisitante.id,
        fecha: partidoData.fecha,
        hora: partidoData.hora,
        estadio: partidoData.estadio,
        ciudad: partidoData.ciudad,
        fase: partidoData.fase,
        grupo: partidoData.grupo,
        jornada: partidoData.jornada,
        estado: partidoData.estado,
        goles_local: partidoData.golesLocal,
        goles_visitante: partidoData.golesVisitante,
        imagen: partidoData.imagen,
        video: partidoData.video,
        descripcion: partidoData.descripcion,
        sorteo_id: partidoData.sorteoId,
        creado_por: user?.id,
      });
      get().cargarPartidos();
    };
    save();
    return nuevoPartido;
  },

  actualizarPartido: (partidoId, partidoData) => {
    const save = async () => {
      const updateData: any = {};
      if (partidoData.fecha !== undefined) updateData.fecha = partidoData.fecha;
      if (partidoData.hora !== undefined) updateData.hora = partidoData.hora;
      if (partidoData.estadio !== undefined) updateData.estadio = partidoData.estadio;
      if (partidoData.ciudad !== undefined) updateData.ciudad = partidoData.ciudad;
      if (partidoData.fase !== undefined) updateData.fase = partidoData.fase;
      if (partidoData.grupo !== undefined) updateData.grupo = partidoData.grupo;
      if (partidoData.jornada !== undefined) updateData.jornada = partidoData.jornada;
      if (partidoData.estado !== undefined) updateData.estado = partidoData.estado;
      if (partidoData.golesLocal !== undefined) updateData.goles_local = partidoData.golesLocal;
      if (partidoData.golesVisitante !== undefined) updateData.goles_visitante = partidoData.golesVisitante;
      if (partidoData.imagen !== undefined) updateData.imagen = partidoData.imagen;
      if (partidoData.video !== undefined) updateData.video = partidoData.video;
      if (partidoData.descripcion !== undefined) updateData.descripcion = partidoData.descripcion;
      if (partidoData.sorteoId !== undefined) updateData.sorteo_id = partidoData.sorteoId;
      if (partidoData.equipoLocal) updateData.equipo_local_id = partidoData.equipoLocal.id;
      if (partidoData.equipoVisitante) updateData.equipo_visitante_id = partidoData.equipoVisitante.id;
      
      await supabase.from('partidos').update(updateData).eq('id', partidoId);
      get().cargarPartidos();
    };
    save();
    return true;
  },

  eliminarPartido: (partidoId) => {
    const del = async () => {
      await supabase.from('partidos').delete().eq('id', partidoId);
      get().cargarPartidos();
    };
    del();
    return true;
  },

  realizarPrediccion: async (partidoId, sorteoId, golesLocal, golesVisitante) => {
    const { user } = get();
    if (!user) return null;

    // Check if already predicted
    const yaP = get().predicciones.some(p => p.partidoId === partidoId && p.userId === user.id);
    if (yaP) return null;

    const { data: pred, error } = await supabase.from('predicciones').insert({
      user_id: user.id,
      partido_id: partidoId,
      sorteo_id: sorteoId,
      goles_local: golesLocal,
      goles_visitante: golesVisitante,
      estado: 'pendiente',
    }).select().single();

    if (error || !pred) return null;

    // Auto-participate in sorteo
    const yaParticipaEnSorteo = get().participaciones.some(p => p.sorteoId === sorteoId && p.userId === user.id);
    if (!yaParticipaEnSorteo) {
      const ticket = `T${Date.now().toString(36).toUpperCase()}`;
      await supabase.from('participaciones').insert({
        user_id: user.id,
        sorteo_id: sorteoId,
        numero_ticket: ticket,
        estado: 'activo',
        chances: 1,
        es_acertador: false,
      });
      await supabase.rpc('increment_participantes', { sorteo_uuid: sorteoId });
    }

    // Notification
    const sorteo = get().sorteos.find(s => s.id === sorteoId);
    await supabase.from('notificaciones').insert({
      user_id: user.id,
      tipo: 'prediccion',
      titulo: '¡Predicción registrada!',
      mensaje: `Tu predicción ha sido guardada. ${!yaParticipaEnSorteo ? `¡Ya estás participando en el sorteo "${sorteo?.titulo}"! ` : ''}Acertá el resultado para obtener TRIPLE CHANCE.`,
      sorteo_id: sorteoId,
      partido_id: partidoId,
    });

    get().cargarPredicciones();
    get().cargarParticipaciones();
    get().cargarNotificaciones();
    get().cargarSorteos();

    return mapPrediccion(pred);
  },

  verificarPrediccion: (partidoId) => {
    const { user, predicciones } = get();
    if (!user) return undefined;
    return predicciones.find(p => p.partidoId === partidoId && p.userId === user.id);
  },

  obtenerPrediccionesPorPartido: (partidoId) => {
    return get().predicciones.filter(p => p.partidoId === partidoId);
  },

  seleccionarAcertadores: async (partidoId, userIds) => {
    for (const userId of userIds) {
      await supabase.from('predicciones').update({ estado: 'acertado' }).eq('partido_id', partidoId).eq('user_id', userId);
    }
    get().cargarPredicciones();
  },

  aplicarTripleChance: async (partidoId) => {
    const { predicciones } = get();
    const acertadores = predicciones.filter(p => p.partidoId === partidoId && p.estado === 'acertado' && !p.tripleChanceAplicado);
    if (acertadores.length === 0) return;

    for (const a of acertadores) {
      await supabase.from('participaciones').update({ chances: 3, es_acertador: true }).eq('user_id', a.userId).eq('sorteo_id', a.sorteoId);
      await supabase.from('predicciones').update({ triple_chance_aplicado: true }).eq('id', a.id);
      await supabase.from('notificaciones').insert({
        user_id: a.userId,
        tipo: 'triple-chance',
        titulo: '¡TRIPLE CHANCE ACTIVADO! 🎉',
        mensaje: '¡Felicitaciones! Acertaste el resultado del partido. Ahora tenés TRIPLE CHANCE de ganar el sorteo. ¡Tus chances se multiplicaron x3!',
        partido_id: partidoId,
      });
    }

    get().cargarPredicciones();
    get().cargarParticipaciones();
    get().cargarNotificaciones();
  },

  obtenerAcertadoresPorPartido: (partidoId) => {
    const { predicciones, partidos } = get();
    const partido = partidos.find(p => p.id === partidoId);
    if (!partido) return [];
    // For admin, we'd need all predicciones - this returns from local state
    return predicciones
      .filter(p => p.partidoId === partidoId && p.estado === 'acertado')
      .map(p => ({
        userId: p.userId,
        prediccionId: p.id,
        partidoId: p.partidoId,
        usuario: { id: p.userId, nombre: '', apellido: '', email: '', telefono: '', dni: '', fechaNacimiento: '', ciudad: '', createdAt: '' },
        prediccion: p,
        resultadoReal: { golesLocal: partido.golesLocal || 0, golesVisitante: partido.golesVisitante || 0 },
        fechaAcerto: p.fechaPrediccion,
      }));
  },

  obtenerEstadisticasPredicciones: (sorteoId) => {
    const { predicciones, partidos, participaciones } = get();
    const prediccionesFiltradas = sorteoId ? predicciones.filter(p => p.sorteoId === sorteoId) : predicciones;
    const totalPredicciones = prediccionesFiltradas.length;
    const totalAcertadores = prediccionesFiltradas.filter(p => p.estado === 'acertado').length;
    const porcentajeAcierto = totalPredicciones > 0 ? Math.round((totalAcertadores / totalPredicciones) * 100) : 0;
    const prediccionesPorPartido = partidos.map(partido => {
      const preds = predicciones.filter(p => p.partidoId === partido.id);
      return { partidoId: partido.id, titulo: `${partido.equipoLocal.nombre} vs ${partido.equipoVisitante.nombre}`, predicciones: preds.length, acertadores: preds.filter(p => p.estado === 'acertado').length };
    });
    const usuariosConTripleChance = new Set(participaciones.filter(p => p.chances === 3).map(p => p.userId)).size;
    return { totalPredicciones, totalAcertadores, porcentajeAcierto, prediccionesPorPartido, usuariosConTripleChance };
  },

  // ==================== RECUPERACIÓN DE CONTRASEÑA ====================
  solicitarRecuperacion: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, mensaje: 'Error al enviar el email de recuperación' };
    return { success: true };
  },

  verificarCodigo: async (_email, _codigo) => {
    // With Supabase, password reset is handled via email link, not OTP
    return true;
  },

  cambiarPassword: async (_email, newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return !error;
  },

  // ==================== PERFIL DE USUARIO ====================
  actualizarPerfil: async (data) => {
    const { user } = get();
    if (!user) return false;

    const updateData: any = {};
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.apellido !== undefined) updateData.apellido = data.apellido;
    if (data.telefono !== undefined) updateData.telefono = data.telefono;
    if (data.dni !== undefined) updateData.dni = data.dni;
    if (data.fechaNacimiento !== undefined) updateData.fecha_nacimiento = data.fechaNacimiento;
    if (data.ciudad !== undefined) updateData.ciudad = data.ciudad;

    const { error } = await supabase.from('profiles').update(updateData).eq('id', user.id);
    if (error) return false;

    set({ user: { ...user, ...data } });
    return true;
  },

  togglePredicciones: () => {
    set({ prediccionesHabilitadas: !get().prediccionesHabilitadas });
  },
}));
