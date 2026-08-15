import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export type Bundle = {
  id: string;
  name: string;
  items: string;
  note: string;
  priceKey: string;
  color: string;
  icon: string;
  badge: string;
  visible: boolean;
};

const REDIS_KEY = "fb:bundles";
const ADMIN_PASS = "Addy2024!";

export const DEFAULT_BUNDLES: Bundle[] = [
  { id: "spring-special",      name: "10×20 Canopy Bundle", items: "10×20 Canopy Tent · 4 Table & Chair Sets",   note: "We deliver & set up", priceKey: "spring-special",      color: "#f5e642", icon: "Umbrella",  badge: "",           visible: true },
  { id: "canopy-13x26-bundle", name: "13×26 Canopy Bundle", items: "13×26 Canopy Tent · 8 Table & Chair Sets",   note: "We deliver & set up", priceKey: "canopy-13x26-bundle", color: "#e81ccd", icon: "Tent",      badge: "Best Value", visible: true },
  { id: "margarita-special",   name: "Margarita Special",   items: "Margarita Machine · Evaporative Cooler Fan", note: "Drinks flowing & guests staying cool",      priceKey: "margarita-special",   color: "#00e64d", icon: "Snowflake", badge: "",           visible: true },
];

async function redisGet(): Promise<Bundle[] | null> {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/${REDIS_KEY}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const { result } = await res.json() as { result: string | null };
    return result ? JSON.parse(result) as Bundle[] : null;
  } catch { return null; }
}

async function redisSet(data: Bundle[]): Promise<void> {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
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
    return NextResponse.json(stored ?? DEFAULT_BUNDLES, { headers: h });
  } catch {
    return NextResponse.json(DEFAULT_BUNDLES, { headers: { "Cache-Control": "no-store" } });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { password, bundles } = await req.json() as { password: string; bundles: Bundle[] };
    if (password !== ADMIN_PASS) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!Array.isArray(bundles)) return NextResponse.json({ error: "Invalid bundles" }, { status: 400 });
    await redisSet(bundles);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Bundles POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
