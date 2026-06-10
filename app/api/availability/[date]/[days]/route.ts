import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import * as engine from "@/dispatchEngine.js";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ date: string; days: string }> }
) {
  try {
    const { date, days } = await params;
    const [inv, rent] = await Promise.all([
      supabaseAdmin.from("inventory").select("*"),
      supabaseAdmin.from("rentals").select("*"),
    ]);
    return NextResponse.json(
      engine.availabilityRange(inv.data ?? [], rent.data ?? [], date, Number(days))
    );
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
