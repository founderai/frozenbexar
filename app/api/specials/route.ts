import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const LOCAL_FILE = path.join(process.cwd(), "data", "specials.json");
const TMP_FILE   = "/tmp/fb-specials.json";
const REDIS_KEY  = "fb:specials";
const ADMIN_PASS = "Addy2024!";

type Special = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  badge?: string;
  expires?: string;
};

async function redisGet(): Promise<Special[] | null> {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/${REDIS_KEY}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    const { result } = await res.json() as { result: string | null };
    return result ? JSON.parse(result) as Special[] : null;
  } catch { return null; }
}

async function redisSet(data: Special[]): Promise<boolean> {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  try {
    const body = JSON.stringify(["SET", REDIS_KEY, JSON.stringify(data)]);
    const res  = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body });
    const json = await res.json() as { result: string };
    return json.result === "OK";
  } catch { return false; }
}

async function readSpecials(): Promise<Special[]> {
  const redis = await redisGet();
  if (redis) return redis;
  try { const raw = await fs.promises.readFile(TMP_FILE, "utf-8"); return JSON.parse(raw); } catch { /* */ }
  try { const raw = await fs.promises.readFile(LOCAL_FILE, "utf-8"); return JSON.parse(raw); } catch { return []; }
}

async function writeSpecials(data: Special[]): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  const ok   = await redisSet(data);
  try { await fs.promises.writeFile(TMP_FILE, json); } catch { /* */ }
  if (!ok) { try { await fs.promises.writeFile(LOCAL_FILE, json); } catch { /* read-only on serverless */ } }
}

export async function GET() {
  try {
    return NextResponse.json(await readSpecials());
  } catch (err) {
    console.error("Specials GET error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { password, specials } = await req.json() as { password: string; specials: Special[] };
    if (password !== ADMIN_PASS) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await writeSpecials(specials);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Specials POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
