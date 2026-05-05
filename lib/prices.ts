import fs from "fs";
import path from "path";

export type PriceEntry = { label: string; price: string; unit: string; discountNote?: string };
export type PricesData = Record<string, PriceEntry>;

const LOCAL_FILE = path.join(process.cwd(), "data", "prices.json");
const TMP_FILE   = "/tmp/fb-prices.json";
const REDIS_KEY  = "fb:prices";

export const defaults: PricesData = {
  "margarita":        { label: "Margarita Machine",      price: "", unit: "per event" },
  "coolers":          { label: "Evaporative Cooler Fan",  price: "", unit: "per day",  discountNote: "2 fans = $115" },
  "canopy-10x20":     { label: "10×20 Canopy Tent",       price: "", unit: "per event" },
  "canopy-13x26":     { label: "13×26 Canopy Tent",       price: "", unit: "per event" },
  "canopy-lights":    { label: "Canopy Lights",           price: "", unit: "per canopy"},
  "canopy-wall":      { label: "Canopy Wall",             price: "", unit: "per panel" },
  "tables":           { label: "Tables",                  price: "", unit: "per table" },
  "chairs":           { label: "Chairs",                  price: "", unit: "per chair" },
  "table-chair-set":  { label: "Table & Chair Set",       price: "", unit: "per set"   },
  "tablecloths":      { label: "Tablecloths (Black)",     price: "", unit: "per cloth" },
  "yard-games":       { label: "Yard Games",              price: "", unit: "per game"  },
  "spring-special":   { label: "Spring Special Bundle",   price: "160", unit: "per event" },
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
  // 1. Upstash Redis (works on any platform — requires env vars)
  const redis = await redisGet();
  if (redis) return redis;

  // 2. /tmp cache (same-instance fast-path)
  try {
    const raw = await fs.promises.readFile(TMP_FILE, "utf-8");
    return JSON.parse(raw) as PricesData;
  } catch { /* not present */ }

  // 3. Committed source file (default empty values)
  try {
    const raw = await fs.promises.readFile(LOCAL_FILE, "utf-8");
    return JSON.parse(raw) as PricesData;
  } catch {
    return { ...defaults };
  }
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
