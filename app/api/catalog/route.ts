import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export type CatalogItem = {
  id: string;
  name: string;
  sub: string;
  priceKey?: string;
  color: string;
  icon: string;
  image?: string;
  visible: boolean;
};

const REDIS_KEY = "fb:catalog";
const ADMIN_PASS = "Addy2024!";

export const DEFAULT_CATALOG: CatalogItem[] = [
  { id: "chair",                  name: "Standard White Chair",            sub: "Classic white folding chair",     color: "#00e64d", icon: "Armchair",        image: "/white-chair.jpg",                  visible: true },
  { id: "chair-padded",           name: "White Premium Padded Chair",      sub: "White padded resin garden chair", color: "#e81ccd", icon: "Armchair",        image: "/premium-white-padded-chair.jpg",   visible: true },
  { id: "table",                  name: "Table",                           sub: "6ft rectangular table",          color: "#00e64d", icon: "Table2",          image: "/table.jpg",                        visible: true },
  { id: "standalone-table-chair", name: "Standalone Table & Chair",        sub: "Single standalone set",          color: "#00e64d", icon: "Armchair",        visible: true },
  { id: "canopy-10x20",           name: "10×20 Canopy Tent",               sub: "Fits 20–30 guests",              color: "#00e64d", icon: "Umbrella",        image: "/canopy-10x20.jpg",                 visible: true },
  { id: "canopy-13x26",           name: "13×26 Canopy Tent",               sub: "Fits up to 60 guests",           color: "#e81ccd", icon: "Tent",            image: "/canopy-13x26.png",                 visible: true },
  { id: "margarita-machine",      name: "Margarita Machine",               sub: "Single or dual flavor",          color: "#00e64d", icon: "Snowflake",       image: "/margarita-machine.jpg",            visible: true },
  { id: "upgraded-bar",           name: "Upgraded Margarita Bar",          sub: "Premium bar cabinet · lights included", color: "#e81ccd", icon: "UtensilsCrossed", image: "/upgraded-bar.jpg",        visible: true },
  { id: "fan-1",                  name: "1 Fan",                           sub: "Single evaporative cooler fan",  color: "#00e64d", icon: "Wind",            visible: true },
  { id: "fan-2",                  name: "2 Fans",                          sub: "Two fans — best value",          color: "#e81ccd", icon: "Wind",            visible: true },
  { id: "round-table",            name: "Round Table",                     sub: "Individual round table",         color: "#00e64d", icon: "Table2",          image: "/6ft-round-table.jpg",              visible: true },
  { id: "round-table-8-chairs",   name: "Round Tables (8 Chairs)",         sub: "Full round table setup",         color: "#e81ccd", icon: "Table2",          visible: true },
  { id: "cocktail-tables",        name: "Cocktail Tables",                 sub: "High-top — perfect for mingling",color: "#e81ccd", icon: "Table2",          image: "/cocktail-table.jpg",               visible: true },
];

async function redisGet(): Promise<CatalogItem[] | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/${REDIS_KEY}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const { result } = await res.json() as { result: string | null };
    return result ? JSON.parse(result) as CatalogItem[] : null;
  } catch { return null; }
}

async function redisSet(data: CatalogItem[]): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return;
  await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["SET", REDIS_KEY, JSON.stringify(data)]),
  });
}

export async function GET() {
  try {
    const stored = await redisGet();
    const h = { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" };
    return NextResponse.json(stored ?? DEFAULT_CATALOG, { headers: h });
  } catch {
    return NextResponse.json(DEFAULT_CATALOG, { headers: { "Cache-Control": "no-store" } });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { password, catalog } = await req.json() as { password: string; catalog: CatalogItem[] };
    if (password !== ADMIN_PASS) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!Array.isArray(catalog)) return NextResponse.json({ error: "Invalid catalog" }, { status: 400 });
    await redisSet(catalog);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Catalog POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
