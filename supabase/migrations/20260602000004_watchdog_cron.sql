-- ============================================================
--  Cron del watchdog del motor de reproducción.
--  Equivale a la reprogramación periódica de PlaySpotifySongsJob en 5Beats:
--  cada minuto invoca la Edge Function venue-watchdog, que detecta cualquier
--  venue cuya canción se quedó colgada (pestaña reproductora caída) y avanza la cola.
-- ============================================================

-- Requiere las extensiones pg_cron y pg_net (disponibles en Supabase).
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- NOTA DE CONFIGURACIÓN:
-- El service key NO se hardcodea aquí. Antes de habilitar el cron, define el GUC una vez:
--   alter database postgres set app.service_key = '<SUPABASE_SERVICE_ROLE_KEY>';
--   alter database postgres set app.watchdog_url = 'https://<PROJECT_REF>.functions.supabase.co/venue-watchdog';
-- (se leen con current_setting más abajo).

-- Programa la llamada cada minuto a la Edge Function venue-watchdog.
select cron.schedule(
  'venue-watchdog-every-minute',
  '* * * * *',
  $$
  select net.http_post(
    url     := current_setting('app.watchdog_url', true),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_key', true)
    ),
    body    := '{}'::jsonb
  );
  $$
);

-- Para desactivarlo: select cron.unschedule('venue-watchdog-every-minute');
