import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  calculateEstimatedTotal,
  calculateLineTotal,
  calculateSubtotal,
  formatMoney,
  isValidEmail,
  ReservationCreateInput,
} from "@/lib/reservations";
import { sendMail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

type ReservationRow = {
  id: string;
  reservation_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_date: string;
  dropoff_datetime: string;
  pickup_datetime: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  notes: string | null;
  subtotal: number;
  delivery_fee: number;
  estimated_total: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
};

async function nextReservationNumber(eventDate: string): Promise<string> {
  const year = new Date(eventDate).getFullYear();
  const prefix = `FB-${year}-`;

  const { data, error } = await supabaseAdmin
    .from("reservations")
    .select("reservation_number")
    .like("reservation_number", `${prefix}%`)
    .order("reservation_number", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Failed to generate reservation number: ${error.message}`);
  }

  const last = data?.[0]?.reservation_number;
  const lastSeq = last ? Number(last.split("-").pop()) : 0;
  const nextSeq = Number.isFinite(lastSeq) ? lastSeq + 1 : 1;

  return `${prefix}${String(nextSeq).padStart(4, "0")}`;
}

function buildItemsHtml(items: { itemName: string; unitPrice: number; quantity: number; lineTotal: number }[]): string {
  const rows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;color:#fff;">${item.itemName}</td>
          <td style="padding:8px 0;color:#aaa;text-align:right;">${item.quantity}</td>
          <td style="padding:8px 0;color:#aaa;text-align:right;">${formatMoney(item.unitPrice)}</td>
          <td style="padding:8px 0;color:#00e64d;text-align:right;font-weight:700;">${formatMoney(item.lineTotal)}</td>
        </tr>`
    )
    .join("");

  return `<table style="width:100%;border-collapse:collapse;font-size:14px;">
    <thead>
      <tr>
        <th style="text-align:left;padding-bottom:8px;color:#888;border-bottom:1px solid #333;">Item</th>
        <th style="text-align:right;padding-bottom:8px;color:#888;border-bottom:1px solid #333;">Qty</th>
        <th style="text-align:right;padding-bottom:8px;color:#888;border-bottom:1px solid #333;">Unit</th>
        <th style="text-align:right;padding-bottom:8px;color:#888;border-bottom:1px solid #333;">Line</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json((data ?? []) as ReservationRow[]);
  } catch (err) {
    console.error("Reservations GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReservationCreateInput;

    const requiredTextFields: Array<keyof ReservationCreateInput> = [
      "customerName",
      "customerEmail",
      "customerPhone",
      "eventDate",
      "dropoffDateTime",
      "pickupDateTime",
      "address",
      "city",
      "state",
      "zip",
    ];

    for (const field of requiredTextFields) {
      const value = body[field];
      if (typeof value !== "string" || !value.trim()) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    if (!isValidEmail(body.customerEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "At least one cart item is required" }, { status: 400 });
    }

    const normalizedItems = body.items.map((item) => ({
      itemName: item.itemName?.trim(),
      unitPrice: Number(item.unitPrice),
      quantity: Number(item.quantity),
    }));

    if (
      normalizedItems.some(
        (item) =>
          !item.itemName ||
          !Number.isFinite(item.unitPrice) ||
          item.unitPrice < 0 ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1
      )
    ) {
      return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
    }

    const deliveryFee = Number(body.deliveryFee || 0);
    if (!Number.isFinite(deliveryFee) || deliveryFee < 0) {
      return NextResponse.json({ error: "Invalid delivery fee" }, { status: 400 });
    }

    const subtotal = calculateSubtotal(normalizedItems);
    const estimatedTotal = calculateEstimatedTotal(subtotal, deliveryFee);

    const parsedDropoff = new Date(body.dropoffDateTime);
    const parsedPickup = new Date(body.pickupDateTime);
    if (Number.isNaN(parsedDropoff.getTime()) || Number.isNaN(parsedPickup.getTime())) {
      return NextResponse.json({ error: "Invalid drop-off or pickup date/time" }, { status: 400 });
    }
    if (parsedPickup.getTime() <= parsedDropoff.getTime()) {
      return NextResponse.json({ error: "Pickup date/time must be after drop-off date/time" }, { status: 400 });
    }

    const reservationNumber = await nextReservationNumber(body.eventDate);

    const { data: insertedReservation, error: reservationError } = await supabaseAdmin
      .from("reservations")
      .insert({
        reservation_number: reservationNumber,
        customer_name: body.customerName.trim(),
        customer_email: body.customerEmail.trim().toLowerCase(),
        customer_phone: body.customerPhone.trim(),
        event_date: body.eventDate,
        dropoff_datetime: parsedDropoff.toISOString(),
        pickup_datetime: parsedPickup.toISOString(),
        address: body.address.trim(),
        city: body.city.trim(),
        state: body.state.trim(),
        zip: body.zip.trim(),
        notes: body.notes?.trim() || null,
        subtotal,
        delivery_fee: deliveryFee,
        estimated_total: estimatedTotal,
        status: "pending",
      })
      .select("*")
      .single();

    if (reservationError || !insertedReservation) {
      return NextResponse.json({ error: reservationError?.message || "Failed to create reservation" }, { status: 500 });
    }

    const itemRows = normalizedItems.map((item) => ({
      reservation_id: insertedReservation.id,
      item_name: item.itemName,
      unit_price: Number(item.unitPrice.toFixed(2)),
      quantity: item.quantity,
      line_total: calculateLineTotal(item.unitPrice, item.quantity),
    }));

    const { error: itemsError } = await supabaseAdmin.from("reservation_items").insert(itemRows);

    if (itemsError) {
      await supabaseAdmin.from("reservations").delete().eq("id", insertedReservation.id);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    const itemRowsForEmail = itemRows.map((item) => ({
      itemName: item.item_name,
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
      lineTotal: Number(item.line_total),
    }));

    const itemizedHtml = buildItemsHtml(itemRowsForEmail);
    const fullAddress = `${body.address}, ${body.city}, ${body.state} ${body.zip}`;

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#0d0d0d;color:#fff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#e81ccd,#b5109e);padding:24px 32px;text-align:center;">
          <h1 style="margin:0;font-size:24px;">Reservation Request Received</h1>
          <p style="margin:8px 0 0;color:#ffd6f8;">Reservation #${reservationNumber}</p>
        </div>
        <div style="padding:24px 32px;">
          <p>Hi <strong>${body.customerName}</strong>,</p>
          <p>Thanks for your reservation request. We will confirm availability shortly.</p>
          <div style="background:#1a1a1a;border:1px solid #333;border-radius:10px;padding:16px;margin:16px 0;">
            <p style="margin:0 0 8px;"><strong>Event Date:</strong> ${body.eventDate}</p>
            <p style="margin:0 0 8px;"><strong>Drop-off:</strong> ${parsedDropoff.toLocaleString()}</p>
            <p style="margin:0 0 8px;"><strong>Pickup:</strong> ${parsedPickup.toLocaleString()}</p>
            <p style="margin:0;"><strong>Address:</strong> ${fullAddress}</p>
          </div>
          <h3 style="margin:18px 0 10px;color:#00e64d;">Itemized Reservation</h3>
          ${itemizedHtml}
          <div style="margin-top:14px;font-size:14px;">
            <p style="margin:4px 0;"><strong>Subtotal:</strong> ${formatMoney(subtotal)}</p>
            <p style="margin:4px 0;"><strong>Delivery/Setup:</strong> ${formatMoney(deliveryFee)}</p>
            <p style="margin:4px 0;color:#00e64d;"><strong>Estimated Total:</strong> ${formatMoney(estimatedTotal)}</p>
          </div>
          <p style="margin-top:18px;color:#bbb;">This is a reservation request for rentals. Frozen Bexar will confirm availability before final confirmation.</p>
        </div>
      </div>
    `;

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#0d0d0d;color:#fff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#00e64d,#00b33c);padding:24px 32px;text-align:center;">
          <h1 style="margin:0;font-size:22px;">New Reservation Alert</h1>
          <p style="margin:8px 0 0;color:#d8ffe6;">${reservationNumber}</p>
        </div>
        <div style="padding:24px 32px;">
          <p style="margin:0 0 8px;"><strong>Customer:</strong> ${body.customerName}</p>
          <p style="margin:0 0 8px;"><strong>Phone:</strong> ${body.customerPhone}</p>
          <p style="margin:0 0 8px;"><strong>Email:</strong> ${body.customerEmail}</p>
          <p style="margin:0 0 8px;"><strong>Event Date:</strong> ${body.eventDate}</p>
          <p style="margin:0 0 8px;"><strong>Drop-off:</strong> ${parsedDropoff.toLocaleString()}</p>
          <p style="margin:0 0 8px;"><strong>Pickup:</strong> ${parsedPickup.toLocaleString()}</p>
          <p style="margin:0 0 14px;"><strong>Address:</strong> ${fullAddress}</p>
          <h3 style="margin:0 0 10px;color:#00e64d;">Itemized Cart</h3>
          ${itemizedHtml}
          <div style="margin-top:14px;font-size:14px;">
            <p style="margin:4px 0;"><strong>Subtotal:</strong> ${formatMoney(subtotal)}</p>
            <p style="margin:4px 0;"><strong>Delivery/Setup:</strong> ${formatMoney(deliveryFee)}</p>
            <p style="margin:4px 0;color:#00e64d;"><strong>Estimated Total:</strong> ${formatMoney(estimatedTotal)}</p>
          </div>
          ${body.notes?.trim() ? `<p style="margin-top:14px;"><strong>Notes:</strong> ${body.notes.trim()}</p>` : ""}
        </div>
      </div>
    `;

    const adminEmail = process.env.ADMIN_EMAIL || "thefrozenbexar@gmail.com";
    Promise.allSettled([
      sendMail({
        to: body.customerEmail.trim().toLowerCase(),
        subject: `Frozen Bexar Reservation Request ${reservationNumber}`,
        html: customerHtml,
        replyTo: "thefrozenbexar@gmail.com",
      }),
      sendMail({
        to: adminEmail,
        subject: `New Reservation ${reservationNumber} — ${body.customerName}`,
        html: adminHtml,
        replyTo: body.customerEmail.trim().toLowerCase(),
      }),
    ]).catch(console.error);

    return NextResponse.json({
      success: true,
      reservationNumber,
      reservationId: insertedReservation.id,
      estimatedTotal,
    });
  } catch (err) {
    console.error("Reservations POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
