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

-- A la carte reservation requests submitted from /quote
create table if not exists reservations (
  id                 uuid primary key default gen_random_uuid(),
  reservation_number text not null unique,
  customer_name      text not null,
  customer_email     text not null,
  customer_phone     text not null,
  event_date         date not null,
  dropoff_datetime   timestamptz not null,
  pickup_datetime    timestamptz not null,
  address            text not null,
  city               text not null,
  state              text not null,
  zip                text not null,
  notes              text,
  subtotal           numeric(10,2) not null default 0,
  delivery_fee       numeric(10,2) not null default 0,
  estimated_total    numeric(10,2) not null default 0,
  status             text not null default 'pending'
                     check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at         timestamptz not null default now()
);

create table if not exists reservation_items (
  id             uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references reservations(id) on delete cascade,
  item_name      text not null,
  unit_price     numeric(10,2) not null,
  quantity       integer not null check (quantity > 0),
  line_total     numeric(10,2) not null,
  created_at     timestamptz not null default now()
);

create index if not exists idx_reservations_created_at on reservations(created_at desc);
create index if not exists idx_reservation_items_reservation_id on reservation_items(reservation_id);

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
alter table reservations enable row level security;
alter table reservation_items enable row level security;

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

create policy "admin full reservations"
  on reservations for all to authenticated using (true) with check (true);

create policy "admin full reservation_items"
  on reservation_items for all to authenticated using (true) with check (true);

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
