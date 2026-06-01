-- ============================================================
-- Pickmysong — Migration 002: Backlog Tables
-- Issues: #3,#6,#7,#10,#11,#12-#27
-- ============================================================

-- ---- credits_log ----------------------------------------
create table if not exists public.credits_log (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  amount      integer not null,                        -- positive = add, negative = spend
  type        text not null check (type in (
    'purchase','promo_code','welcome_bonus','bid','refund'
  )),
  reference   text,                                    -- order_id, code, song_id, etc.
  created_at  timestamptz not null default now()
);
alter table public.credits_log enable row level security;
create policy "Users read own credits" on public.credits_log
  for select using (auth.uid() = user_id);
create policy "Service insert credits" on public.credits_log
  for insert with check (true);

-- credit balance view
create or replace view public.credit_balances as
  select user_id, coalesce(sum(amount), 0)::integer as balance
  from public.credits_log
  group by user_id;

-- ---- promo_codes ----------------------------------------
create table if not exists public.promo_codes (
  id             uuid primary key default gen_random_uuid(),
  code           text unique not null,
  credits        integer not null default 0,
  max_uses       integer not null default 1,
  uses           integer not null default 0,
  active         boolean not null default true,
  created_by     uuid references auth.users(id),       -- admin or sponsor
  sponsor_id     uuid,                                 -- FK to sponsors (added below)
  expires_at     timestamptz,
  created_at     timestamptz not null default now()
);
alter table public.promo_codes enable row level security;
create policy "Public read active codes" on public.promo_codes
  for select using (active = true);
create policy "Admins manage codes" on public.promo_codes
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- ---- promo_redemptions ----------------------------------
create table if not exists public.promo_redemptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  code_id     uuid not null references public.promo_codes(id),
  redeemed_at timestamptz not null default now(),
  unique (user_id, code_id)
);
alter table public.promo_redemptions enable row level security;
create policy "Users read own redemptions" on public.promo_redemptions
  for select using (auth.uid() = user_id);
create policy "Service insert redemptions" on public.promo_redemptions
  for insert with check (true);

-- ---- checkins -------------------------------------------
create table if not exists public.checkins (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  venue_id    uuid not null references public.venues(id) on delete cascade,
  checked_in_at  timestamptz not null default now(),
  checked_out_at timestamptz,
  active      boolean not null default true
);
alter table public.checkins enable row level security;
create policy "Users read own checkins" on public.checkins
  for select using (auth.uid() = user_id);
create policy "Users insert own checkins" on public.checkins
  for insert with check (auth.uid() = user_id);
create policy "Users update own checkins" on public.checkins
  for update using (auth.uid() = user_id);

-- ---- queue (cola musical) --------------------------------
create table if not exists public.queue (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid not null references public.venues(id) on delete cascade,
  song_id     uuid not null references public.songs(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  bids        integer not null default 1,              -- credits wagered
  position    integer not null default 0,
  played      boolean not null default false,
  played_at   timestamptz,
  blocked_until timestamptz,                           -- 4h repeat block
  created_at  timestamptz not null default now()
);
alter table public.queue enable row level security;
create policy "Public read queue" on public.queue
  for select using (true);
create policy "Users insert queue" on public.queue
  for insert with check (auth.uid() = user_id);
create policy "Service update queue" on public.queue
  for update using (true);

-- Enable Realtime for queue
alter publication supabase_realtime add table public.queue;

-- ---- sponsors -------------------------------------------
create table if not exists public.sponsors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  logo        text,
  website     text,
  contact_email text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table public.sponsors enable row level security;
create policy "Public read sponsors" on public.sponsors
  for select using (active = true);
create policy "Admins manage sponsors" on public.sponsors
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- Add FK promo_codes -> sponsors
alter table public.promo_codes
  add constraint promo_codes_sponsor_fk
  foreign key (sponsor_id) references public.sponsors(id) on delete set null;

-- ---- brand_profiles (M4) --------------------------------
create table if not exists public.brand_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  slug        text unique not null,
  logo        text,
  website     text,
  industry    text,
  contact_email text not null,
  approved    boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table public.brand_profiles enable row level security;
create policy "Brand reads own profile" on public.brand_profiles
  for select using (auth.uid() = id);
create policy "Brand updates own profile" on public.brand_profiles
  for update using (auth.uid() = id);
create policy "Admins read all brands" on public.brand_profiles
  for select using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- ---- brand_campaigns (M4) --------------------------------
create table if not exists public.brand_campaigns (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid not null references public.brand_profiles(id) on delete cascade,
  name        text not null,
  description text,
  budget      numeric(10,2) not null default 0,
  credits_pool integer not null default 0,
  start_date  date not null,
  end_date    date not null,
  active      boolean not null default false,
  venue_ids   uuid[],                                  -- targeted venues
  impressions integer not null default 0,
  clicks      integer not null default 0,
  redemptions integer not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.brand_campaigns enable row level security;
create policy "Brand reads own campaigns" on public.brand_campaigns
  for select using (
    auth.uid() = brand_id
  );
create policy "Brand manages own campaigns" on public.brand_campaigns
  for all using (auth.uid() = brand_id);

-- ---- venue_plans ----------------------------------------
create table if not exists public.venue_plans (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid unique not null references public.venues(id) on delete cascade,
  plan        text not null default 'freemium' check (plan in ('freemium','premium')),
  stripe_subscription_id text,
  trial_ends_at  timestamptz,
  renews_at      timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.venue_plans enable row level security;
create policy "Owner reads own plan" on public.venue_plans
  for select using (
    exists (
      select 1 from public.venues
      where id = venue_id and owner_id = auth.uid()
    )
  );

-- ---- spotify_tokens (M6) --------------------------------
create table if not exists public.spotify_tokens (
  venue_id    uuid primary key references public.venues(id) on delete cascade,
  access_token  text not null,
  refresh_token text not null,
  expires_at    timestamptz not null,
  scope         text,
  updated_at    timestamptz not null default now()
);
alter table public.spotify_tokens enable row level security;
create policy "Owner reads own spotify token" on public.spotify_tokens
  for select using (
    exists (
      select 1 from public.venues
      where id = venue_id and owner_id = auth.uid()
    )
  );
create policy "Service upserts spotify tokens" on public.spotify_tokens
  for all using (true);

-- ---- venue_music_rules (M2) -----------------------------
create table if not exists public.venue_music_rules (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid unique not null references public.venues(id) on delete cascade,
  banned_genres text[] not null default '{}',
  banned_songs  text[] not null default '{}',        -- spotify track IDs
  updated_at  timestamptz not null default now()
);
alter table public.venue_music_rules enable row level security;
create policy "Public read music rules" on public.venue_music_rules
  for select using (true);
create policy "Owner manages music rules" on public.venue_music_rules
  for all using (
    exists (
      select 1 from public.venues
      where id = venue_id and owner_id = auth.uid()
    )
  );

-- ---- password_reset_tokens (issue #3) -------------------
create table if not exists public.password_reset_tokens (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  token       text unique not null,
  expires_at  timestamptz not null,
  used        boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table public.password_reset_tokens enable row level security;
create policy "Service manages reset tokens" on public.password_reset_tokens
  for all using (true);

-- ---- add credits column to profiles --------------------
alter table public.profiles
  add column if not exists credits integer not null default 0,
  add column if not exists location_lat double precision,
  add column if not exists location_lng double precision,
  add column if not exists location_city text;

-- ---- add spotify_playlist_id to venues ------------------
alter table public.venues
  add column if not exists spotify_playlist_id text,
  add column if not exists qr_code text;

-- ---- indexes for performance ----------------------------
create index if not exists idx_queue_venue_active on public.queue (venue_id, played, position);
create index if not exists idx_checkins_venue_active on public.checkins (venue_id, active);
create index if not exists idx_credits_log_user on public.credits_log (user_id);
create index if not exists idx_promo_codes_code on public.promo_codes (code);
