import fs from "fs";
import path from "path";

export type PriceEntry = { label: string; price: string; unit: string };
export type PricesData = Record<string, PriceEntry>;

const DATA_FILE = path.join(process.cwd(), "data", "prices.json");

const defaults: PricesData = {
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
  try {
    const raw = await fs.promises.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { ...defaults };
  }
}

export async function writePrices(data: PricesData): Promise<void> {
  await fs.promises.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}
