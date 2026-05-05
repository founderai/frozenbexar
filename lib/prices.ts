import fs from "fs";
import path from "path";
import { getStore } from "@netlify/blobs";

export type PriceEntry = { label: string; price: string; unit: string };
export type PricesData = Record<string, PriceEntry>;

const LOCAL_FILE = path.join(process.cwd(), "data", "prices.json");
const TMP_FILE   = "/tmp/prices.json";
const BLOB_STORE = "site-data";
const BLOB_KEY   = "prices";

export const defaults: PricesData = {
  "margarita":     { label: "Margarita Machine",      price: "", unit: "per event" },
  "coolers":       { label: "Evaporative Cooler Fan",  price: "", unit: "per day"   },
  "canopy-10x20":  { label: "10×20 Canopy Tent",       price: "", unit: "per event" },
  "canopy-13x26":  { label: "13×26 Canopy Tent",       price: "", unit: "per event" },
  "canopy-lights": { label: "Canopy Lights",           price: "", unit: "per canopy"},
  "canopy-wall":   { label: "Canopy Wall",             price: "", unit: "per panel" },
  "tables":        { label: "Tables & Chairs",         price: "", unit: "per set"   },
  "tablecloths":   { label: "Tablecloths",             price: "", unit: "per cloth" },
  "yard-games":    { label: "Yard Games",              price: "", unit: "per set"   },
  "packages":      { label: "Full Event Package",      price: "", unit: "custom"    },
};

export async function readPrices(): Promise<PricesData> {
  // 1. Netlify Blobs (static import, works in Netlify Functions)
  try {
    const store = getStore(BLOB_STORE);
    const raw = await store.get(BLOB_KEY, { type: "text" });
    if (raw) return JSON.parse(raw) as PricesData;
  } catch (err) {
    console.error("[prices] Blobs read error:", err);
  }

  // 2. /tmp file (writable on serverless, survives within same instance)
  try {
    const raw = await fs.promises.readFile(TMP_FILE, "utf-8");
    return JSON.parse(raw) as PricesData;
  } catch { /* not there yet */ }

  // 3. Committed local file (initial default values)
  try {
    const raw = await fs.promises.readFile(LOCAL_FILE, "utf-8");
    return JSON.parse(raw) as PricesData;
  } catch {
    return { ...defaults };
  }
}

export async function writePrices(data: PricesData): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  let blobsOk = false;

  // 1. Netlify Blobs
  try {
    const store = getStore(BLOB_STORE);
    await store.set(BLOB_KEY, json);
    blobsOk = true;
    console.log("[prices] Saved to Netlify Blobs");
  } catch (err) {
    console.error("[prices] Blobs write error:", err);
  }

  // 2. Also write to /tmp as a fast-path cache (always attempt)
  try {
    await fs.promises.writeFile(TMP_FILE, json);
  } catch { /* /tmp might not be available */ }

  // 3. Fallback: local data/prices.json (only works when FS is writable i.e. local dev)
  if (!blobsOk) {
    await fs.promises.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.promises.writeFile(LOCAL_FILE, json);
    console.log("[prices] Saved to local file (dev mode)");
  }
}
