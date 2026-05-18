-- ============================================================================
-- Calabar FuelFinder — Supabase schema + seed data
-- Run this once in your Supabase project: SQL Editor → New query → paste → Run
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT).
-- ============================================================================

-- ---- TABLES ----------------------------------------------------------------

create table if not exists stations (
  id            text primary key,
  name          text       not null,
  address       text       not null,
  petrol_price  integer    not null,
  diesel_price  integer    not null,
  is_open       boolean    not null default true,
  distance      text       not null default '',
  rating        numeric    not null default 0,
  lat           numeric    not null,
  lng           numeric    not null,
  image         text       not null default '',
  last_updated  text       not null default '',
  phone         text,
  logo_url      text,
  status        text       not null default 'approved'
                           check (status in ('pending', 'approved', 'rejected')),
  created_at    timestamptz not null default now()
);

-- Add status column to existing tables (safe if already present)
do $$ begin
  alter table stations add column if not exists status text not null default 'approved'
    check (status in ('pending', 'approved', 'rejected'));
exception when others then null;
end $$;

create table if not exists news_alerts (
  id          text primary key,
  title       text not null,
  content     text not null,
  date        text not null,
  type        text not null default 'info',
  created_at  timestamptz not null default now()
);

create table if not exists feedback (
  id          uuid primary key default gen_random_uuid(),
  station_id  text references stations(id) on delete set null,
  subject     text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

create table if not exists price_reports (
  id            uuid primary key default gen_random_uuid(),
  station_id    text references stations(id) on delete cascade not null,
  petrol_price  integer,
  diesel_price  integer,
  created_at    timestamptz not null default now()
);

-- ---- TABLE-LEVEL GRANTS ----------------------------------------------------

grant usage on schema public to anon, authenticated, service_role;

grant select, insert on public.stations      to anon, authenticated;
grant select         on public.news_alerts   to anon, authenticated;
grant insert         on public.feedback      to anon, authenticated;
grant insert         on public.price_reports to anon, authenticated;

grant all on public.stations, public.news_alerts,
            public.feedback,  public.price_reports
  to service_role;

-- ---- ROW LEVEL SECURITY ----------------------------------------------------
-- Anon users can only READ approved stations.
-- Anon users can INSERT new stations (they land as 'pending').
-- You approve them by updating status = 'approved' directly in Supabase.

alter table stations      enable row level security;
alter table news_alerts   enable row level security;
alter table feedback      enable row level security;
alter table price_reports enable row level security;

drop policy if exists "stations_select_public"       on stations;
drop policy if exists "stations_insert_public"       on stations;
drop policy if exists "news_alerts_select_public"    on news_alerts;
drop policy if exists "feedback_insert_public"       on feedback;
drop policy if exists "price_reports_insert_public"  on price_reports;

-- Only approved stations are visible to the public
create policy "stations_select_public"
  on stations for select using (status = 'approved');

-- Anyone can submit a station (it starts as pending)
create policy "stations_insert_public"
  on stations for insert with check (status = 'pending');

create policy "news_alerts_select_public"
  on news_alerts for select using (true);

create policy "feedback_insert_public"
  on feedback for insert with check (true);

create policy "price_reports_insert_public"
  on price_reports for insert with check (true);

-- ---- STORAGE BUCKET --------------------------------------------------------
-- Run this separately in Supabase → SQL Editor to create the photo bucket:
--
--   insert into storage.buckets (id, name, public)
--   values ('station-photos', 'station-photos', true)
--   on conflict (id) do nothing;
--
--   drop policy if exists "station_photos_insert" on storage.objects;
--   create policy "station_photos_insert" on storage.objects
--     for insert with check (bucket_id = 'station-photos');
--
--   drop policy if exists "station_photos_select" on storage.objects;
--   create policy "station_photos_select" on storage.objects
--     for select using (bucket_id = 'station-photos');

-- ---- SEED DATA -------------------------------------------------------------

insert into stations
  (id, name, address, petrol_price, diesel_price, is_open, distance, rating, lat, lng, image, last_updated, status)
values
  ('mobil-marian',            'Mobile (Mobile) Marian',     'Marian Road, Calabar',                  650, 1100, true, '0.5km', 4.8, 4.965, 8.335, 'https://picsum.photos/seed/mobil-marian/600/400', now()::text, 'approved'),
  ('uddy-king-parliamentary', 'Uddy King Parliamentary',    'Parliamentary Extension, Calabar',      640, 1080, true, '1.5km', 4.4, 4.982, 8.342, 'https://picsum.photos/seed/uddy-parl/600/400',    now()::text, 'approved'),
  ('shafa',                   'Shafa Energy',               'Murtala Mohammed Highway, Calabar',     630, 1050, true, '2.1km', 4.2, 4.995, 8.338, 'https://picsum.photos/seed/shafa/600/400',        now()::text, 'approved'),
  ('uddy-king-effio-ette',    'Uddy King Effio-Ette',       'Effio-Ette Junction, Calabar',          645, 1090, true, '1.8km', 4.5, 4.972, 8.348, 'https://picsum.photos/seed/uddy-effio/600/400',   now()::text, 'approved'),
  ('nnpc-highway',            'NNPC Mega Station',          'Murtala Mohammed Highway, Calabar',     610, 1020, true, '3.0km', 4.1, 5.012, 8.331, 'https://picsum.photos/seed/nnpc-cal/600/400',     now()::text, 'approved')
on conflict (id) do update set
  name         = excluded.name,
  address      = excluded.address,
  petrol_price = excluded.petrol_price,
  diesel_price = excluded.diesel_price,
  is_open      = excluded.is_open,
  distance     = excluded.distance,
  rating       = excluded.rating,
  lat          = excluded.lat,
  lng          = excluded.lng,
  image        = excluded.image,
  last_updated = excluded.last_updated,
  status       = excluded.status;

insert into news_alerts (id, title, content, date, type) values
  ('n1', 'Upcoming Price Adjustment',
   'Petroleum Marketers association hints at a potential 5% increase in petrol prices starting Monday.',
   '2 hours ago', 'warning')
on conflict (id) do update set
  title   = excluded.title,
  content = excluded.content,
  date    = excluded.date,
  type    = excluded.type;
