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
-- No seed stations. All stations are added via the app's "Add Station" form.

insert into news_alerts (id, title, content, date, type) values
  ('n1', 'Upcoming Price Adjustment',
   'Petroleum Marketers association hints at a potential 5% increase in petrol prices starting Monday.',
   '2 hours ago', 'warning')
on conflict (id) do update set
  title   = excluded.title,
  content = excluded.content,
  date    = excluded.date,
  type    = excluded.type;
