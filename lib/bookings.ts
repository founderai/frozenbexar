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

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // already exists
  }
}

export async function readBookings(): Promise<Booking[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(BOOKINGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writeBookings(bookings: Booking[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

export async function readMessages(): Promise<Message[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(MESSAGES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writeMessages(messages: Message[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}
