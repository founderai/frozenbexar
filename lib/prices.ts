import fs from "fs";
import path from "path";

export type PriceEntry = { label: string; price: string; unit: string; discountNote?: string };
export type PricesData = Record<string, PriceEntry>;

const LOCAL_FILE = path.join(process.cwd(), "data", "prices.json");
const TMP_FILE   = "/tmp/fb-prices.json";
const REDIS_KEY  = "fb:prices";

export const defaults: PricesData = {
  "margarita":           { label: "Margarita Machine",          price: "180", unit: "per event" },
  "coolers":             { label: "Evaporative Cooler Fan",      price: "75",  unit: "per day",  discountNote: "2 fans = $135" },
  "canopy-10x20":        { label: "10×20 Canopy Tent",            price: "115", unit: "per event" },
  "canopy-13x26":        { label: "13×26 Canopy Tent",            price: "165", unit: "per event" },
  "canopy-lights":       { label: "Canopy Lights",               price: "15",  unit: "per canopy" },
  "canopy-wall":         { label: "Canopy Wall",                 price: "10",  unit: "per panel" },
  "tables":              { label: "Tables (6ft Rect.)",          price: "6",   unit: "per table" },
  "round-tables":        { label: "Round Tables (6ft)",          price: "16",  unit: "per table" },
  "cocktail-tables":     { label: "Cocktail Tables",             price: "15",  unit: "per table" },
  "chairs":              { label: "Chairs (White Resin)",        price: "3",   unit: "per chair" },
  "chairs-wood":         { label: "Chairs (Wood Folding)",       price: "3",   unit: "per chair" },
  "table-chair-set":     { label: "Table & Chair Set",           price: "16",  unit: "per set"   },
  "tablecloths":         { label: "Tablecloths & Linens (Black)",price: "5",   unit: "per cloth" },
  "yard-games":          { label: "Yard Games",                  price: "25",  unit: "per game"  },
  "spring-special":      { label: "10×20 Canopy + 4 T&C Sets",   price: "170", unit: "per event" },
  "canopy-13x26-bundle": { label: "13×26 Canopy + 8 T&C Sets",   price: "320", unit: "per event" },
  "margarita-special":   { label: "Margarita Special Bundle",    price: "225", unit: "per event" },
};

async function redisGet(): Promise<PricesData | null> {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/${REDIS_KEY}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    const { result } = await res.json() as { result: string | null };
    return result ? JSON.parse(result) as PricesData : null;
  } catch (err) { console.error("[prices] Redis GET error:", err); return null; }
}

async function redisSet(data: PricesData): Promise<boolean> {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  try {
    const body = JSON.stringify(["SET", REDIS_KEY, JSON.stringify(data)]);
    const res  = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body });
    const json = await res.json() as { result: string };
    return json.result === "OK";
  } catch (err) { console.error("[prices] Redis SET error:", err); return false; }
}

export async function readPrices(): Promise<PricesData> {
  let stored: PricesData | null = null;

  // 1. Upstash Redis
  stored = await redisGet();

  // 2. /tmp cache
  if (!stored) {
    try {
      const raw = await fs.promises.readFile(TMP_FILE, "utf-8");
      stored = JSON.parse(raw) as PricesData;
    } catch { /* not present */ }
  }

  // 3. Local file (dev fallback)
  if (!stored) {
    try {
      const raw = await fs.promises.readFile(LOCAL_FILE, "utf-8");
      stored = JSON.parse(raw) as PricesData;
    } catch { /* not present */ }
  }

  // Merge: keep stored values, fill missing keys from defaults, drop obsolete keys
  const merged: PricesData = {};
  for (const [id, def] of Object.entries(defaults)) {
    merged[id] = stored?.[id] ?? { ...def };
  }
  return merged;
}

export async function writePrices(data: PricesData): Promise<void> {
  const json = JSON.stringify(data, null, 2);

  // 1. Upstash Redis — primary persistent store
  const ok = await redisSet(data);
  if (ok) console.log("[prices] Saved to Redis");

  // 2. /tmp cache (always attempt, non-throwing)
  try { await fs.promises.writeFile(TMP_FILE, json); } catch { /* ignore */ }

  // 3. Local file (dev only — never throws on read-only FS)
  if (!ok) {
    try {
      await fs.promises.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
      await fs.promises.writeFile(LOCAL_FILE, json);
      console.log("[prices] Saved to local file (dev mode)");
    } catch { /* read-only FS on serverless — expected */ }
  }
}
