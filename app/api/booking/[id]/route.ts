import { NextRequest, NextResponse } from "next/server";
import { readBookings, writeBookings } from "@/lib/bookings";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const bookings = await readBookings();
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    bookings[idx].status = status;
    await writeBookings(bookings);
    return NextResponse.json({ success: true, booking: bookings[idx] });
  } catch (err) {
    console.error("Patch booking error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const bookings = await readBookings();
    const filtered = bookings.filter((b) => b.id !== id);
    await writeBookings(filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete booking error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
