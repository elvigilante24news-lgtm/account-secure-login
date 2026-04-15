-- Fix notificaciones -> partidos FK to CASCADE
ALTER TABLE public.notificaciones DROP CONSTRAINT IF EXISTS notificaciones_partido_id_fkey;
ALTER TABLE public.notificaciones ADD CONSTRAINT notificaciones_partido_id_fkey 
  FOREIGN KEY (partido_id) REFERENCES public.partidos(id) ON DELETE CASCADE;

-- Fix notificaciones -> sorteos FK to CASCADE
ALTER TABLE public.notificaciones DROP CONSTRAINT IF EXISTS notificaciones_sorteo_id_fkey;
ALTER TABLE public.notificaciones ADD CONSTRAINT notificaciones_sorteo_id_fkey 
  FOREIGN KEY (sorteo_id) REFERENCES public.sorteos(id) ON DELETE CASCADE;

-- Fix partidos -> sorteos FK to CASCADE  
ALTER TABLE public.partidos DROP CONSTRAINT IF EXISTS partidos_sorteo_id_fkey;
ALTER TABLE public.partidos ADD CONSTRAINT partidos_sorteo_id_fkey 
  FOREIGN KEY (sorteo_id) REFERENCES public.sorteos(id) ON DELETE SET NULL;

-- Fix ganadores -> premios FK to CASCADE
ALTER TABLE public.ganadores DROP CONSTRAINT IF EXISTS ganadores_premio_id_fkey;
ALTER TABLE public.ganadores ADD CONSTRAINT ganadores_premio_id_fkey 
  FOREIGN KEY (premio_id) REFERENCES public.premios(id) ON DELETE CASCADE;