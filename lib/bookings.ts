import fs from "fs/promises";
import path from "path";

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  guestCount: string;
  address: string;
  items: string[];
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const BOOKINGS_KEY   = "fb:bookings";
const MESSAGES_KEY   = "fb:messages";
const TMP_BOOKINGS   = "/tmp/fb-bookings.json";
const TMP_MESSAGES   = "/tmp/fb-messages.json";
const LOCAL_BOOKINGS = path.join(process.cwd(), "data", "bookings.json");
const LOCAL_MESSAGES = path.join(process.cwd(), "data", "messages.json");

async function redisGet<T>(key: string): Promise<T | null> {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const { result } = await res.json() as { result: string | null };
    return result ? JSON.parse(result) as T : null;
  } catch { return null; }
}

async function redisSet<T>(key: string, value: T): Promise<boolean> {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  try {
    const body = JSON.stringify(["SET", key, JSON.stringify(value)]);
    const res  = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body,
    });
    const json = await res.json() as { result: string };
    return json.result === "OK";
  } catch { return false; }
}

async function readJson<T>(tmpFile: string, localFile: string, fallback: T): Promise<T> {
  try { return JSON.parse(await fs.readFile(tmpFile, "utf-8")) as T; } catch {}
  try { return JSON.parse(await fs.readFile(localFile, "utf-8")) as T; } catch {}
  return fallback;
}

async function writeJson<T>(tmpFile: string, localFile: string, redisOk: boolean, value: T): Promise<void> {
  const json = JSON.stringify(value, null, 2);
  try { await fs.writeFile(tmpFile, json); } catch {}
  if (!redisOk) {
    try {
      await fs.mkdir(path.dirname(localFile), { recursive: true });
      await fs.writeFile(localFile, json);
    } catch {}
  }
}

export async function readBookings(): Promise<Booking[]> {
  const redis = await redisGet<Booking[]>(BOOKINGS_KEY);
  if (redis) return redis;
  return readJson<Booking[]>(TMP_BOOKINGS, LOCAL_BOOKINGS, []);
}

export async function writeBookings(bookings: Booking[]): Promise<void> {
  const ok = await redisSet(BOOKINGS_KEY, bookings);
  await writeJson(TMP_BOOKINGS, LOCAL_BOOKINGS, ok, bookings);
}

export async function readMessages(): Promise<Message[]> {
  const redis = await redisGet<Message[]>(MESSAGES_KEY);
  if (redis) return redis;
  return readJson<Message[]>(TMP_MESSAGES, LOCAL_MESSAGES, []);
}

export async function writeMessages(messages: Message[]): Promise<void> {
  const ok = await redisSet(MESSAGES_KEY, messages);
  await writeJson(TMP_MESSAGES, LOCAL_MESSAGES, ok, messages);
}
