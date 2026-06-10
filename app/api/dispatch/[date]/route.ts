import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import * as engine from "@/dispatchEngine.js";

async function fetchState() {
  const [inv, rent, ord] = await Promise.all([
    supabaseAdmin.from("inventory").select("*"),
    supabaseAdmin.from("rentals").select("*"),
    supabaseAdmin.from("route_orders").select("*"),
  ]);
  return {
    inventory: inv.data ?? [],
    rentals: rent.data ?? [],
    orders: ord.data ?? [],
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;
    const { inventory, rentals, orders } = await fetchState();

    let stops = engine.defaultStops(rentals, date);
    const saved = orders.find((o: { day: string; stop_ids: string[] }) => o.day === date);
    if (saved && Array.isArray(saved.stop_ids)) {
      const withId = stops.map((s) => ({ ...s, stopKey: `${s.rentalId}:${s.type}` }));
      const byKey = Object.fromEntries(withId.map((s) => [s.stopKey, s]));
      const ordered = (saved.stop_ids as string[])
        .map((k) => byKey[k])
        .filter(Boolean);
      withId.forEach((s) => {
        if (!(saved.stop_ids as string[]).includes(s.stopKey)) ordered.push(s);
      });
      stops = ordered;
    }

    return NextResponse.json({
      date,
      dropoffs: engine.dropoffsOn(rentals, date),
      pickups: engine.pickupsOn(rentals, date),
      netToPull: engine.netToPull(rentals, date),
      routeLoad: engine.routeLoad(stops, rentals),
      availability: engine.availabilityOn(inventory, rentals, date),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
