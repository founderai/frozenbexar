-- ============================================================
-- Frozen Bexar — Dispatch Schema
-- Run this entire file in the Supabase SQL editor once.
-- ============================================================

-- Equipment you own
create table if not exists inventory (
  id    text primary key,
  name  text not null,
  total integer not null default 0
);

-- Every rental / booking (website bookings land here with status 'pending')
create table if not exists rentals (
  id         text primary key,
  customer   text,
  address    text,
  dropoff    date not null,
  pickup     date not null,
  items      jsonb not null default '[]',   -- [{ "name": "Folding Chairs", "qty": 24 }]
  status     text not null default 'confirmed',
  created_at timestamptz default now()
);

-- Per-day route ordering saved by the admin drag interface
create table if not exists route_orders (
  day      text primary key,           -- 'YYYY-MM-DD'
  stop_ids jsonb not null default '[]'
);

-- Single-row settings
create table if not exists settings (
  id   integer primary key default 1,
  data jsonb not null default '{}'
);
insert into settings (id, data)
  values (1, '{"businessName":"Frozen Bexar","homeBase":""}')
  on conflict (id) do nothing;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table rentals     enable row level security;
alter table inventory   enable row level security;
alter table route_orders enable row level security;
alter table settings    enable row level security;

-- Public site may only INSERT a new booking (status pending)
create policy "public can insert bookings"
  on rentals for insert to anon with check (true);

-- Authenticated admin (you) has full access to everything
create policy "admin full rentals"
  on rentals for all to authenticated using (true) with check (true);

create policy "admin full inventory"
  on inventory for all to authenticated using (true) with check (true);

create policy "admin full route_orders"
  on route_orders for all to authenticated using (true) with check (true);

create policy "admin full settings"
  on settings for all to authenticated using (true) with check (true);

-- ============================================================
-- Seed inventory — update `total` to match what you actually own
-- ============================================================

insert into inventory (id, name, total) values
  ('margarita-single',  'Margarita Machine (Single Flavor)',  1),
  ('margarita-dual',    'Margarita Machine (Dual Flavor)',    1),
  ('cooler',            'Evaporative Cooler',                 2),
  ('canopy-10x20',      '10×20 Canopy',                      2),
  ('canopy-13x26',      '13×26 Canopy',                      1),
  ('tables-6ft',        '6ft Rectangular Tables',           10),
  ('tables-round',      'Round Tables (48in)',                5),
  ('chairs-folding',    'Folding Chairs',                   50),
  ('chairs-padded',     'Padded Chairs',                    20),
  ('tablecloths',       'Tablecloths',                      20),
  ('canopy-lights',     'Canopy String Lights',              2),
  ('yard-games',        'Yard Games',                        1),
  ('full-package',      'Full Event Package',                1)
on conflict (id) do nothing;
