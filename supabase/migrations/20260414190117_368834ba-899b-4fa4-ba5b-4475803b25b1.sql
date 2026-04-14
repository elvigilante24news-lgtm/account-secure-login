
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ==================== PROFILES ====================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL DEFAULT '',
  apellido TEXT NOT NULL DEFAULT '',
  telefono TEXT DEFAULT '',
  dni TEXT DEFAULT '',
  fecha_nacimiento DATE,
  ciudad TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, apellido, telefono, dni, fecha_nacimiento, ciudad)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    COALESCE(NEW.raw_user_meta_data->>'telefono', ''),
    COALESCE(NEW.raw_user_meta_data->>'dni', ''),
    CASE WHEN NEW.raw_user_meta_data->>'fecha_nacimiento' IS NOT NULL AND NEW.raw_user_meta_data->>'fecha_nacimiento' != ''
         THEN (NEW.raw_user_meta_data->>'fecha_nacimiento')::date 
         ELSE NULL END,
    COALESCE(NEW.raw_user_meta_data->>'ciudad', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================== USER ROLES ====================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ==================== EQUIPOS ====================
CREATE TABLE public.equipos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  codigo TEXT NOT NULL,
  bandera TEXT NOT NULL,
  grupo TEXT NOT NULL
);

ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view equipos" ON public.equipos FOR SELECT USING (true);
CREATE POLICY "Admins can manage equipos" ON public.equipos FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ==================== SORTEOS ====================
CREATE TABLE public.sorteos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  imagen TEXT DEFAULT '',
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ NOT NULL,
  fecha_sorteo TIMESTAMPTZ NOT NULL,
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'finalizado', 'proximo')),
  participantes INTEGER NOT NULL DEFAULT 0,
  max_participantes INTEGER,
  requisitos TEXT[] DEFAULT '{}',
  edad_minima INTEGER NOT NULL DEFAULT 18,
  edad_maxima INTEGER,
  terminos_condiciones TEXT DEFAULT '',
  tipo_sorteo TEXT NOT NULL DEFAULT 'posiciones' CHECK (tipo_sorteo IN ('posiciones', 'cantidad')),
  cantidad_ganadores INTEGER,
  creado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sorteos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view sorteos" ON public.sorteos FOR SELECT USING (true);
CREATE POLICY "Admins can manage sorteos" ON public.sorteos FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_sorteos_updated_at BEFORE UPDATE ON public.sorteos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== PREMIOS ====================
CREATE TABLE public.premios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sorteo_id UUID NOT NULL REFERENCES public.sorteos(id) ON DELETE CASCADE,
  puesto INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  imagen TEXT DEFAULT '',
  valor TEXT DEFAULT ''
);

ALTER TABLE public.premios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view premios" ON public.premios FOR SELECT USING (true);
CREATE POLICY "Admins can manage premios" ON public.premios FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ==================== PARTICIPACIONES ====================
CREATE TABLE public.participaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sorteo_id UUID NOT NULL REFERENCES public.sorteos(id) ON DELETE CASCADE,
  fecha_participacion TIMESTAMPTZ NOT NULL DEFAULT now(),
  numero_ticket TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'ganador', 'descalificado')),
  puesto INTEGER,
  chances INTEGER DEFAULT 1,
  es_acertador BOOLEAN DEFAULT false,
  UNIQUE(user_id, sorteo_id)
);

ALTER TABLE public.participaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own participaciones" ON public.participaciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own participacion" ON public.participaciones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all participaciones" ON public.participaciones FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage participaciones" ON public.participaciones FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ==================== PARTIDOS ====================
CREATE TABLE public.partidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipo_local_id TEXT NOT NULL REFERENCES public.equipos(id),
  equipo_visitante_id TEXT NOT NULL REFERENCES public.equipos(id),
  fecha TIMESTAMPTZ NOT NULL,
  hora TEXT NOT NULL,
  estadio TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  fase TEXT NOT NULL CHECK (fase IN ('fase-grupos', 'dieciseisavos', 'octavos', 'cuartos', 'semifinales', 'tercer-puesto', 'final')),
  grupo TEXT,
  jornada INTEGER,
  estado TEXT NOT NULL DEFAULT 'programado' CHECK (estado IN ('programado', 'en-vivo', 'finalizado', 'cancelado')),
  goles_local INTEGER,
  goles_visitante INTEGER,
  imagen TEXT DEFAULT '',
  video TEXT DEFAULT '',
  descripcion TEXT DEFAULT '',
  sorteo_id UUID REFERENCES public.sorteos(id),
  creado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view partidos" ON public.partidos FOR SELECT USING (true);
CREATE POLICY "Admins can manage partidos" ON public.partidos FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_partidos_updated_at BEFORE UPDATE ON public.partidos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== PREDICCIONES ====================
CREATE TABLE public.predicciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partido_id UUID NOT NULL REFERENCES public.partidos(id) ON DELETE CASCADE,
  sorteo_id UUID NOT NULL REFERENCES public.sorteos(id) ON DELETE CASCADE,
  goles_local INTEGER NOT NULL,
  goles_visitante INTEGER NOT NULL,
  fecha_prediccion TIMESTAMPTZ NOT NULL DEFAULT now(),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'acertado', 'fallado')),
  triple_chance_aplicado BOOLEAN DEFAULT false,
  UNIQUE(user_id, partido_id)
);

ALTER TABLE public.predicciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own predicciones" ON public.predicciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own prediccion" ON public.predicciones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all predicciones" ON public.predicciones FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage predicciones" ON public.predicciones FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ==================== NOTIFICACIONES ====================
CREATE TABLE public.notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('confirmacion', 'ganador', 'recordatorio', 'sistema', 'prediccion', 'triple-chance')),
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  fecha TIMESTAMPTZ NOT NULL DEFAULT now(),
  leida BOOLEAN NOT NULL DEFAULT false,
  sorteo_id UUID REFERENCES public.sorteos(id),
  partido_id UUID REFERENCES public.partidos(id)
);

ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notificaciones" ON public.notificaciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notificaciones" ON public.notificaciones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can insert notificaciones" ON public.notificaciones FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

-- ==================== GANADORES ====================
CREATE TABLE public.ganadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sorteo_id UUID NOT NULL REFERENCES public.sorteos(id) ON DELETE CASCADE,
  puesto INTEGER NOT NULL,
  premio_id UUID NOT NULL REFERENCES public.premios(id),
  tipo TEXT NOT NULL DEFAULT 'titular' CHECK (tipo IN ('titular', 'suplente')),
  fecha_ganado TIMESTAMPTZ NOT NULL DEFAULT now(),
  notificado BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.ganadores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view ganadores" ON public.ganadores FOR SELECT USING (true);
CREATE POLICY "Admins can manage ganadores" ON public.ganadores FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ==================== INDEXES ====================
CREATE INDEX idx_participaciones_user ON public.participaciones(user_id);
CREATE INDEX idx_participaciones_sorteo ON public.participaciones(sorteo_id);
CREATE INDEX idx_predicciones_user ON public.predicciones(user_id);
CREATE INDEX idx_predicciones_partido ON public.predicciones(partido_id);
CREATE INDEX idx_notificaciones_user ON public.notificaciones(user_id);
CREATE INDEX idx_ganadores_sorteo ON public.ganadores(sorteo_id);
CREATE INDEX idx_partidos_sorteo ON public.partidos(sorteo_id);
CREATE INDEX idx_premios_sorteo ON public.premios(sorteo_id);

-- ==================== ADMIN CAN VIEW ALL PROFILES ====================
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ==================== RPC: increment participantes count ====================
CREATE OR REPLACE FUNCTION public.increment_participantes(sorteo_uuid UUID)
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  UPDATE public.sorteos SET participantes = participantes + 1 WHERE id = sorteo_uuid;
$$;
