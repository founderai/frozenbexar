/**
 * Frozen Bexar — Dispatch Engine
 * ------------------------------------------------------------------
 * Pure, dependency-free logistics math. No React, no DB, no framework.
 * Feed it plain arrays (rentals, inventory) and it returns the numbers
 * your admin UI displays: daily manifests, inventory availability,
 * net-to-pull, and route-order-aware truck load.
 *
 * Data shapes:
 *   Item       = { name: string, qty: number }
 *   Rental     = { id, customer, address, dropoff: 'YYYY-MM-DD',
 *                  pickup: 'YYYY-MM-DD', items: Item[], status? }
 *   Inventory  = { id, name, total: number }
 *   Stop       = { rentalId: string, type: 'drop' | 'pick' }
 *
 * All dates are 'YYYY-MM-DD' strings, compared as strings (no timezones).
 */

/* ---------- date helpers ---------- */
const pad = (n) => String(n).padStart(2, "0");
export const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseYMD = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
export const addDays = (s, n) => { const d = parseYMD(s); d.setDate(d.getDate() + n); return toYMD(d); };

/* ---------- core rules ---------- */

/**
 * Is a rental's gear "out" (committed) on a given date?
 * Committed from drop-off up to the day BEFORE pickup. Pickup day frees
 * the gear so it can be re-deployed the same morning. Same-day rentals
 * (pickup === dropoff) are committed that single day.
 */
export function isOut(rental, ymd) {
  if (rental.pickup === rental.dropoff) return ymd === rental.dropoff;
  return ymd >= rental.dropoff && ymd < rental.pickup;
}

export const dropoffsOn = (rentals, ymd) => rentals.filter((r) => r.dropoff === ymd);
export const pickupsOn = (rentals, ymd) =>
  rentals.filter((r) => r.pickup === ymd && r.pickup !== r.dropoff);

/** Sum item quantities across a list of rentals -> { itemName: qty }. */
export function manifest(rentals) {
  const m = {};
  rentals.forEach((r) => r.items.forEach((it) => {
    m[it.name] = (m[it.name] || 0) + Number(it.qty || 0);
  }));
  return m;
}

/** How much of each item is out (committed) on a date -> { itemName: qty }. */
export function committedOn(rentals, ymd) {
  const m = {};
  rentals.forEach((r) => { if (isOut(r, ymd)) r.items.forEach((it) => {
    m[it.name] = (m[it.name] || 0) + Number(it.qty || 0);
  }); });
  return m;
}

/**
 * Inventory position on a date.
 * -> [{ name, total, committed, free, over }]   over === true means oversold.
 */
export function availabilityOn(inventory, rentals, ymd) {
  const c = committedOn(rentals, ymd);
  return inventory.map((inv) => {
    const committed = c[inv.name] || 0;
    return { name: inv.name, total: inv.total, committed, free: inv.total - committed, over: committed > inv.total };
  });
}

/** Availability across a window -> [{ date, items: [...] }, ...]. Good for a grid. */
export function availabilityRange(inventory, rentals, startYmd, days) {
  const out = [];
  for (let i = 0; i < days; i++) {
    const ymd = addDays(startYmd, i);
    out.push({ date: ymd, items: availabilityOn(inventory, rentals, ymd) });
  }
  return out;
}

/**
 * Best-case net to pull from the shop for a date (assumes all pick-ups are
 * collected before any drop). -> [{ name, drops, picks, net }]
 * net > 0  : pull that many from the shop
 * net < 0  : that many surplus return to the shop
 */
export function netToPull(rentals, ymd) {
  const drops = manifest(dropoffsOn(rentals, ymd));
  const picks = manifest(pickupsOn(rentals, ymd));
  const names = new Set([...Object.keys(drops), ...Object.keys(picks)]);
  return [...names].map((name) => {
    const d = drops[name] || 0, p = picks[name] || 0;
    return { name, drops: d, picks: p, net: d - p };
  }).sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
}

/**
 * Route-ORDER-aware load. Walks the stops in the given order, tracking what's
 * on the truck per item. The deepest the truck dips below zero is what you
 * must load from the shop up front so you never run short mid-route.
 *
 * @param orderedStops Stop[]  in the order you'll actually drive them
 * @param rentals      Rental[] (used to look up each stop's items by id)
 * -> [{ name, load, best, back, extra }]
 *    load  : units to carry from the shop for THIS order
 *    best  : best-case load if all pick-ups came first
 *    back  : units on the truck at the end (returning to the shop)
 *    extra : load - best  (how much this order costs you over best-case)
 */
export function routeLoad(orderedStops, rentals) {
  const byId = {};
  rentals.forEach((r) => { byId[r.id] = r; });
  const stats = {};
  orderedStops.forEach((s) => {
    const r = byId[s.rentalId];
    if (!r) return;
    r.items.forEach((it) => {
      const q = Number(it.qty || 0);
      const st = stats[it.name] || (stats[it.name] = { drops: 0, picks: 0, balance: 0, minPrefix: 0 });
      if (s.type === "pick") { st.picks += q; st.balance += q; }
      else { st.drops += q; st.balance -= q; }
      st.minPrefix = Math.min(st.minPrefix, st.balance);
    });
  });
  return Object.entries(stats).map(([name, st]) => {
    const load = Math.max(0, -st.minPrefix);
    const best = Math.max(0, st.drops - st.picks);
    return { name, load, best, back: load + st.balance, extra: load - best };
  }).sort((a, b) => b.load - a.load);
}

/**
 * Default stop order for a day: pick-ups first, then drop-offs.
 * Returns Stop[] you can pass to routeLoad (or reorder first).
 */
export function defaultStops(rentals, ymd) {
  return [
    ...pickupsOn(rentals, ymd).map((r) => ({ rentalId: r.id, type: "pick" })),
    ...dropoffsOn(rentals, ymd).map((r) => ({ rentalId: r.id, type: "drop" })),
  ];
}

/* CommonJS users: replace the `export` keywords above with a single
   module.exports = { isOut, dropoffsOn, pickupsOn, manifest, committedOn,
   availabilityOn, availabilityRange, netToPull, routeLoad, defaultStops,
   toYMD, parseYMD, addDays }; */
