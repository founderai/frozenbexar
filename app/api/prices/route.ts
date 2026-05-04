import { NextRequest, NextResponse } from "next/server";
import { readPrices, writePrices, PricesData } from "@/lib/prices";

const ADMIN_PASS = "Addy2024!";

export async function GET() {
  try {
    const prices = await readPrices();
    return NextResponse.json(prices);
  } catch (err) {
    console.error("Prices GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { password, prices } = await req.json() as { password: string; prices: PricesData };
    if (password !== ADMIN_PASS) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await writePrices(prices);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Prices POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
