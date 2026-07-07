import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { ReservationStatus } from "@/lib/reservations";

const VALID_STATUSES: ReservationStatus[] = ["pending", "confirmed", "completed", "cancelled"];

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { data: reservation, error: reservationError } = await supabaseAdmin
      .from("reservations")
      .select("*")
      .eq("id", id)
      .single();

    if (reservationError || !reservation) {
      return NextResponse.json({ error: reservationError?.message || "Reservation not found" }, { status: 404 });
    }

    const { data: items, error: itemsError } = await supabaseAdmin
      .from("reservation_items")
      .select("*")
      .eq("reservation_id", id)
      .order("created_at", { ascending: true });

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ reservation, items: items ?? [] });
  } catch (err) {
    console.error("Reservation detail GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await req.json()) as { status?: ReservationStatus };

    if (!body.status || !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("reservations")
      .update({ status: body.status })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Reservation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, reservation: data });
  } catch (err) {
    console.error("Reservation status PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
