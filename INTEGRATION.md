# Frozen Bexar — Dispatch Board: Live Website Integration

Hand this file plus `RentalDispatch.jsx` to Windsurf as context. It explains exactly what to build so a booking on **frozenbexar.com** shows up live on the internal dispatch board.

---

## What you have vs. what you need

`RentalDispatch.jsx` is the **admin dispatch board** — routes, equipment netting, daily load-outs. It is fully working, but it currently saves to `window.storage`, a feature that **only exists inside Claude's preview**. On a real site that call does nothing, so the board loads blank.

To get "show live what's getting rented," three pieces have to exist:

1. **A shared database** — one source of truth both the public site and the board read/write.
2. **The public booking form** on frozenbexar.com writes a new rental row when a customer books.
3. **The board subscribes** to that table, so new bookings appear without a refresh.

The board code is built so only **one block** changes: the `DATA LAYER` section near the top. Everything else stays as-is.

---

## Two deployment paths — pick based on your site's stack

**A. frozenbexar.com is a custom React / Next.js codebase.**
Mount `<RentalDispatch />` behind an admin-only route (e.g. `/admin/dispatch`) protected by login. Public visitors never see it.

**B. frozenbexar.com is a hosted builder (Wix, Squarespace, GoDaddy, Shopify, etc.).**
You can't drop React into those. Instead deploy the board as a tiny standalone app on Vercel/Netlify at a subdomain like `dispatch.frozenbexar.com`, password-protected. The public booking form on your builder still writes to the same database (via a small serverless function or the builder's webhook/automation feature).

Either way, the database and the data layer below are identical.

> **Security, do not skip:** the dispatch board exposes customer **addresses, routes, and inventory levels**. That is internal-only. Keep it behind authentication. The public site only needs availability + a booking form — never the board itself.

---

## Recommended stack: Supabase

For a solo builder who wants "live" with the least backend work, Supabase gives you a hosted Postgres database, an auto-generated API, realtime subscriptions, and auth in one place — and it drops cleanly into Windsurf.

(Firebase works too; the structure below maps over directly. If your site already has a backend/DB, use that and keep the same tables.)

---

## Database schema

Run this in the Supabase SQL editor.

```sql
-- Equipment you own
create table inventory (
  id    text primary key,
  name  text not null,
  total integer not null default 0
);

-- Every rental / booking (website bookings land here too)
create table rentals (
  id         text primary key,
  customer   text,
  address    text,
  dropoff    date not null,
  pickup     date not null,
  items      jsonb not null default '[]',   -- [{ "name": "Chairs", "qty": 24 }]
  status     text not null default 'confirmed', -- 'pending' for new website bookings
  created_at timestamptz default now()
);

-- Per-day route ordering set by dragging stops on the board
create table route_orders (
  day      text primary key,                -- 'YYYY-MM-DD'
  stop_ids jsonb not null default '[]'
);

-- Single-row settings (business name, home base address)
create table settings (
  id   integer primary key default 1,
  data jsonb not null default '{}'
);
insert into settings (id, data) values (1, '{"businessName":"Frozen Bexar","homeBase":""}');
```

### Row Level Security (so the public form can book but not read your routes)

```sql
alter table rentals enable row level security;
alter table inventory enable row level security;
alter table route_orders enable row level security;
alter table settings enable row level security;

-- Public site may CREATE a booking only
create policy "public can insert bookings" on rentals
  for insert to anon with check (true);

-- Logged-in admin (you) can do everything
create policy "admin full rentals"      on rentals      for all to authenticated using (true) with check (true);
create policy "admin full inventory"    on inventory    for all to authenticated using (true) with check (true);
create policy "admin full route_orders" on route_orders for all to authenticated using (true) with check (true);
create policy "admin full settings"     on settings     for all to authenticated using (true) with check (true);
```

---

## The data-layer swap

In `RentalDispatch.jsx`, replace the entire `DATA LAYER` block (the `const storage = {...}` object) with this. The board's components are untouched.

```js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const storage = {
  async load() {
    const [{ data: inventory }, { data: rentals }, { data: orders }, { data: s }] =
      await Promise.all([
        supabase.from("inventory").select("*"),
        supabase.from("rentals").select("*").order("dropoff"),
        supabase.from("route_orders").select("*"),
        supabase.from("settings").select("data").eq("id", 1).single(),
      ]);
    const routeOrders = {};
    (orders || []).forEach((o) => { routeOrders[o.day] = o.stop_ids; });
    return {
      settings: (s && s.data) || { businessName: "Frozen Bexar", homeBase: "" },
      inventory: inventory || [],
      rentals: rentals || [],
      routeOrders,
    };
  },

  async save(d) {
    // Upserts the whole state. Fine at this scale; Windsurf can make this
    // granular later (write only the rental/inventory row that changed).
    await Promise.all([
      supabase.from("inventory").upsert(d.inventory),
      supabase.from("rentals").upsert(d.rentals),
      supabase.from("settings").upsert({ id: 1, data: d.settings }),
      ...Object.entries(d.routeOrders).map(([day, stop_ids]) =>
        supabase.from("route_orders").upsert({ day, stop_ids })
      ),
    ]);
  },

  // LIVE: when any booking is inserted/changed, reload and push fresh state.
  subscribe(onChange) {
    const ch = supabase
      .channel("dispatch")
      .on("postgres_changes", { event: "*", schema: "public", table: "rentals" },
          async () => onChange(await storage.load()))
      .on("postgres_changes", { event: "*", schema: "public", table: "inventory" },
          async () => onChange(await storage.load()))
      .subscribe();
    return () => supabase.removeChannel(ch);
  },
};
```

Also remove the `seed()` call paths if you don't want demo data in production — load real inventory once via the Inventory tab instead.

---

## The website booking writes a rental

On frozenbexar.com, when a customer confirms, insert one row. Path **A** (React site) does it directly; path **B** (builder) does it from a serverless function or automation using the same anon key.

```js
await supabase.from("rentals").insert({
  id: crypto.randomUUID(),
  customer: form.name,
  address: form.address,
  dropoff: form.eventDate,         // 'YYYY-MM-DD'
  pickup: form.pickupDate,         // 'YYYY-MM-DD'
  items: cart,                      // [{ name: "Margarita machine", qty: 1 }, ...]
  status: "pending",               // shows up on the board immediately for you to confirm
});
```

That insert fires the realtime event → the board reloads → the new booking is on your dispatch list and folded into the day's netting and load math automatically. No refresh.

> Match item names exactly to your `inventory.name` values (e.g. "Margarita machine"), or the availability/netting won't tie out. Easiest: build the booking form's product list from the `inventory` table.

---

## Optional but worth it: live availability on the public site

Because the board already knows what's committed per day, you can reuse that logic to stop customers double-booking a sold-out date. Query `rentals` for the requested dates, sum committed quantities per item, compare to `inventory.total`, and gray out unavailable items. Ask Windsurf to extract the `isOut` / committed-per-day logic from the board into a shared helper both the site and board import.

---

## Environment variables

```
VITE_SUPABASE_URL=...        # Supabase project URL
VITE_SUPABASE_ANON_KEY=...   # anon/public key (safe in client WITH the RLS above)
```

Never put the service-role key in front-end code.

---

## Suggested Windsurf prompts

1. "Create a Supabase project and run the schema + RLS in INTEGRATION.md."
2. "In RentalDispatch.jsx, replace the DATA LAYER block with the Supabase adapter from INTEGRATION.md and add @supabase/supabase-js."
3. "Add admin auth (Supabase email login) and put the dispatch board behind it." (Path A: an `/admin` route. Path B: a protected standalone deploy.)
4. "On the booking form, insert a rental row with status 'pending' on checkout, building the product list from the inventory table."
5. "Extract the committed-per-day availability logic into a shared helper and use it to show live availability on the public site."

---

## What stays a manual / future step

- **Auto route optimization** (reordering stops by shortest drive) still needs the Google Maps Directions API with a key + a small server call. The board's drag-order + "open in Google Maps" works without it.
- **Payments / deposits** on booking — wire Stripe in the booking form, separate from this board.
