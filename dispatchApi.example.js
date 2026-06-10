/**
 * Frozen Bexar — Dispatch Backend (example)
 * ------------------------------------------------------------------
 * Wires the pure engine to your database and exposes the numbers your
 * admin already-built UI fetches. Shown with Supabase + Express; the
 * shape maps 1:1 to Next.js API routes, serverless functions, etc.
 *
 * DB schema + Row Level Security are in INTEGRATION.md (the `inventory`,
 * `rentals`, and `route_orders` tables).
 *
 * Run `npm i @supabase/supabase-js express`.
 */
import express from "express";
import { createClient } from "@supabase/supabase-js";
import * as engine from "./dispatchEngine.js";

// Server-side only: the SERVICE key is safe here (never ship it to the browser).
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

/* ---------- load everything the engine needs ---------- */
async function fetchState() {
  const [inv, rent, ord] = await Promise.all([
    supabase.from("inventory").select("*"),
    supabase.from("rentals").select("*"),
    supabase.from("route_orders").select("*"),
  ]);
  return { inventory: inv.data || [], rentals: rent.data || [], orders: ord.data || [] };
}

/* ---------- one call returns the whole day plan ---------- */
export async function getDayPlan(date) {
  const { inventory, rentals, orders } = await fetchState();

  // Build stop order: saved drag-order if present, else pick-ups-first default.
  let stops = engine.defaultStops(rentals, date);
  const saved = orders.find((o) => o.day === date);
  if (saved && Array.isArray(saved.stop_ids)) {
    const withId = stops.map((s) => ({ ...s, id: `${s.rentalId}:${s.type}` }));
    const byId = Object.fromEntries(withId.map((s) => [s.id, s]));
    const ordered = saved.stop_ids.map((id) => byId[id]).filter(Boolean);
    withId.forEach((s) => { if (!saved.stop_ids.includes(s.id)) ordered.push(s); });
    stops = ordered;
  }

  return {
    date,
    dropoffs: engine.dropoffsOn(rentals, date),                  // who gets gear
    pickups: engine.pickupsOn(rentals, date),                    // what comes back
    dropManifest: engine.manifest(engine.dropoffsOn(rentals, date)),
    pickupManifest: engine.manifest(engine.pickupsOn(rentals, date)),
    netToPull: engine.netToPull(rentals, date),                  // best-case load
    routeLoad: engine.routeLoad(stops, rentals),                 // load for actual route order
    availability: engine.availabilityOn(inventory, rentals, date),
  };
}

/* ---------- example routes your admin fetches ---------- */
const app = express();
app.use(express.json());

// GET /api/dispatch/2026-05-30  -> full day plan as JSON
app.get("/api/dispatch/:date", async (req, res) => {
  try { res.json(await getDayPlan(req.params.date)); }
  catch (e) { res.status(500).json({ error: String(e) }); }
});

// GET /api/availability/2026-05-30/10  -> 10-day availability grid
app.get("/api/availability/:date/:days", async (req, res) => {
  const { inventory, rentals } = await fetchState();
  res.json(engine.availabilityRange(inventory, rentals, req.params.date, Number(req.params.days)));
});

// PUT /api/dispatch/2026-05-30/route  body: { stopIds: ["id:pick","id:drop", ...] }
app.put("/api/dispatch/:date/route", async (req, res) => {
  await supabase.from("route_orders").upsert({ day: req.params.date, stop_ids: req.body.stopIds });
  res.json({ ok: true });
});

app.listen(3001, () => console.log("dispatch API on :3001"));

/* ------------------------------------------------------------------
 * LIVE UPDATES — two options, pick one:
 *
 * 1) Realtime (recommended): in your admin front-end, subscribe to the
 *    rentals table directly with the Supabase browser client. Any new
 *    website booking fires the callback; re-fetch /api/dispatch/:date.
 *
 *      supabase.channel('rentals')
 *        .on('postgres_changes',
 *            { event: '*', schema: 'public', table: 'rentals' },
 *            () => refetchCurrentDay())
 *        .subscribe();
 *
 * 2) Polling: have the admin hit GET /api/dispatch/:date every 20–30s.
 *    Simpler, no realtime setup, slight delay.
 *
 * Website booking -> inserts a row into `rentals` (status: 'pending') ->
 * realtime fires -> admin re-fetches -> the booking is on the board and
 * folded into that day's netting and route-load automatically.
 * ------------------------------------------------------------------ */
