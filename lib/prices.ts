import fs from "fs";
import path from "path";

export type PriceEntry = { label: string; price: string; unit: string };
export type PricesData = Record<string, PriceEntry>;

const DATA_FILE = path.join(process.cwd(), "data", "prices.json");
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

async function tryBlob<T>(fn: () => Promise<T>): Promise<T | null> {
  try { return await fn(); } catch { return null; }
}

export async function readPrices(): Promise<PricesData> {
  // 1. Try Netlify Blobs (works on Netlify + local with netlify dev)
  const blobResult = await tryBlob(async () => {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore(BLOB_STORE);
    return await store.get(BLOB_KEY, { type: "json" }) as PricesData | null;
  });
  if (blobResult) return blobResult;

  // 2. Fall back to local JSON file (plain `next dev`)
  try {
    const raw = await fs.promises.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as PricesData;
  } catch {
    return { ...defaults };
  }
}

export async function writePrices(data: PricesData): Promise<void> {
  // 1. Try Netlify Blobs
  const blobOk = await tryBlob(async () => {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore(BLOB_STORE);
    await store.setJSON(BLOB_KEY, data);
    return true;
  });
  if (blobOk) return;

  // 2. Fall back to local JSON file
  await fs.promises.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}
