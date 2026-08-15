import { NextRequest, NextResponse } from "next/server";
import { readBookings, writeBookings } from "@/lib/bookings";
import { sendMail } from "@/lib/mailer";
import { supabaseAdmin } from "@/lib/supabase";
import { addSubscriber } from "@/lib/marketing-subscribers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, eventDate, pickupDate, eventType, guestCount, address, zipCode, items, itemsWithQty, itemsBreakdown, notes, estimatedTotal, marketingOptIn } = body;

    const fmtDate = (d: string) => {
      if (!d) return d;
      const [y, m, day] = d.split("-");
      return m && day ? `${m}/${day}/${y}` : d;
    };

    if (!name || !email || !phone || !eventDate || !eventType || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const resolvedPickupDate: string = pickupDate || eventDate;
    if (resolvedPickupDate < eventDate) {
      return NextResponse.json({ error: "Pickup date must be on or after the event date" }, { status: 400 });
    }

    const bookingId = Date.now().toString();
    const booking = {
      id: bookingId,
      name,
      email,
      phone,
      eventDate,
      pickupDate: resolvedPickupDate,
      eventType,
      guestCount: guestCount || "",
      address: address || "",
      items,
      notes: notes || "",
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };

    const bookings = await readBookings();
    bookings.push(booking);
    await writeBookings(bookings);

    // Save marketing opt-in subscriber
    if (marketingOptIn) {
      await addSubscriber({ name, email, phone }).catch(err =>
        console.error("[booking] marketing subscriber save failed:", err)
      );
    }

    // Also write a structured rental row to Supabase for the dispatch board
    const structuredItems: { name: string; qty: number }[] =
      Array.isArray(itemsWithQty) && itemsWithQty.length > 0
        ? itemsWithQty
        : (items as string[]).map((n: string) => ({ name: n, qty: 1 }));
    void (async () => {
      try {
        const { error } = await supabaseAdmin.from("rentals").insert({
          id: bookingId,
          customer: name,
          address: address || "",
          dropoff: eventDate,
          pickup: resolvedPickupDate,
          items: structuredItems,
          status: "pending",
        });
        if (error) console.error("[supabase] rental insert:", error.message);
      } catch (e) {
        console.error("[supabase] rental insert:", e);
      }
    })();

    const fullLocation = [address, zipCode].filter(Boolean).join(", ");

    type LineItem = { name: string; qty: number; unitPrice: number | null; lineTotal: number | null };
    const breakdown: LineItem[] = Array.isArray(itemsBreakdown) && itemsBreakdown.length > 0
      ? itemsBreakdown
      : (items as string[]).map(n => ({ name: n, qty: 1, unitPrice: null, lineTotal: null }));

    const itemsTableHtml = `
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px;">
        <thead>
          <tr>
            <th style="text-align:left;color:#888;padding:5px 4px;border-bottom:1px solid #333;font-weight:600;">Item</th>
            <th style="text-align:center;color:#888;padding:5px 4px;border-bottom:1px solid #333;font-weight:600;width:40px;">Qty</th>
            <th style="text-align:right;color:#888;padding:5px 4px;border-bottom:1px solid #333;font-weight:600;width:70px;">Unit</th>
            <th style="text-align:right;color:#888;padding:5px 4px;border-bottom:1px solid #333;font-weight:600;width:70px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${breakdown.map(r => `
          <tr>
            <td style="color:#fff;padding:6px 4px;border-bottom:1px solid #222;">${r.name}</td>
            <td style="color:#ccc;padding:6px 4px;border-bottom:1px solid #222;text-align:center;">${r.qty}</td>
            <td style="color:#ccc;padding:6px 4px;border-bottom:1px solid #222;text-align:right;">${r.unitPrice != null ? `$${Number(r.unitPrice).toFixed(2)}` : "—"}</td>
            <td style="color:#fff;padding:6px 4px;border-bottom:1px solid #222;text-align:right;">${r.lineTotal != null ? `$${Number(r.lineTotal).toFixed(2)}` : "—"}</td>
          </tr>`).join("")}
        </tbody>
        ${estimatedTotal ? `
        <tfoot>
          <tr>
            <td colspan="3" style="padding:8px 4px;text-align:right;font-weight:700;color:#00e64d;font-size:14px;">Estimated Total</td>
            <td style="padding:8px 4px;text-align:right;font-weight:700;color:#00e64d;font-size:14px;">$${Number(estimatedTotal).toFixed(2)}</td>
          </tr>
        </tfoot>` : ""}
      </table>`;

    // Customer confirmation email
    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#ffffff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#e81ccd,#b5109e);padding:30px 40px;text-align:center;">
          <img src="https://www.frozenbexar.com/logo.png" alt="Frozen Bexar" style="height:120px;width:auto;margin-bottom:14px;display:block;margin-left:auto;margin-right:auto;" />
          <h1 style="margin:0;font-size:28px;color:#fff;">Booking Request Received!</h1>
          <p style="margin:8px 0 0;color:#ffd6f8;font-size:14px;">San Antonio's Premier Party Rental</p>
        </div>
        <div style="padding:32px 40px;">
          <p style="color:#e0e0e0;line-height:1.6;">Hi <strong style="color:#fff;">${name}</strong>,</p>
          <p style="color:#e0e0e0;line-height:1.6;">Thank you for choosing <strong style="color:#e81ccd;">Frozen Bexar</strong>! We've received your booking request and will contact you within a few hours to confirm availability and finalize your quote.</p>

          <div style="background:#1a1a1a;border:1px solid #e81ccd33;border-radius:10px;padding:20px;margin:24px 0;">
            <h3 style="margin:0 0 14px;color:#00e64d;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Your Booking Summary</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="color:#888;padding:5px 0;width:130px;">Event Type</td><td style="color:#fff;">${eventType}</td></tr>
              <tr><td style="color:#888;padding:5px 0;">Event Date</td><td style="color:#fff;">${fmtDate(eventDate)}</td></tr>
              ${fullLocation ? `<tr><td style="color:#888;padding:5px 0;">Location</td><td style="color:#fff;">${fullLocation}</td></tr>` : ""}
              ${guestCount ? `<tr><td style="color:#888;padding:5px 0;">Est. Guests</td><td style="color:#fff;">${guestCount}</td></tr>` : ""}
            </table>
            <p style="color:#888;font-size:13px;margin:14px 0 6px;text-transform:uppercase;letter-spacing:1px;">Rental Items &amp; Pricing</p>
            ${itemsTableHtml}
            ${estimatedTotal ? `<p style="margin:4px 0 0;color:#666;font-size:11px;">* Final quote confirmed before booking</p>` : ""}
            ${notes ? `<p style="margin:14px 0 0;color:#aaa;font-style:italic;font-size:13px;">"${notes}"</p>` : ""}
          </div>

          <p style="color:#e0e0e0;line-height:1.6;">We'll reach out to you at <strong style="color:#e81ccd;">${email}</strong> or <strong style="color:#e81ccd;">${phone}</strong> shortly.</p>
          <p style="color:#e0e0e0;line-height:1.6;">Questions? Call or text us anytime!</p>
        </div>
        <div style="background:#111;padding:20px 40px;text-align:center;border-top:1px solid #222;">
          <p style="margin:0;color:#555;font-size:12px;">Frozen Bexar · San Antonio, Texas · <a href="mailto:thefrozenbexar@gmail.com" style="color:#e81ccd;">thefrozenbexar@gmail.com</a></p>
        </div>
      </div>`;

    // Admin notification email
    const adminNotifyEmail = process.env.ADMIN_EMAIL;
    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#ffffff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#00e64d,#00b33c);padding:24px 40px;text-align:center;">
          <img src="https://www.frozenbexar.com/logo.png" alt="Frozen Bexar" style="height:120px;width:auto;margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;" />
          <h1 style="margin:0;font-size:22px;color:#fff;">New Booking Request!</h1>
        </div>
        <div style="padding:28px 40px;">
          <div style="background:#1a1a1a;border:1px solid #00e64d33;border-radius:10px;padding:20px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="color:#888;padding:5px 0;width:130px;">Name</td><td style="color:#fff;font-weight:bold;">${name}</td></tr>
              <tr><td style="color:#888;padding:5px 0;">Email</td><td style="color:#00e64d;">${email}</td></tr>
              <tr><td style="color:#888;padding:5px 0;">Phone</td><td style="color:#fff;">${phone}</td></tr>
              <tr><td style="color:#888;padding:5px 0;">Event Type</td><td style="color:#fff;">${eventType}</td></tr>
              <tr><td style="color:#888;padding:5px 0;">Event Date</td><td style="color:#fff;font-weight:bold;">${fmtDate(eventDate)}</td></tr>
              ${fullLocation ? `<tr><td style="color:#888;padding:5px 0;">Location</td><td style="color:#fff;">${fullLocation}</td></tr>` : ""}
              ${guestCount ? `<tr><td style="color:#888;padding:5px 0;">Guests</td><td style="color:#fff;">${guestCount}</td></tr>` : ""}
            </table>
            <p style="color:#888;font-size:13px;margin:14px 0 6px;text-transform:uppercase;letter-spacing:1px;">Rental Items &amp; Pricing</p>
            ${itemsTableHtml}
            ${notes ? `<p style="margin:14px 0 0;color:#aaa;font-style:italic;font-size:13px;">"${notes}"</p>` : ""}
          </div>
          <p style="color:#aaa;font-size:13px;margin-top:16px;">Log in to <a href="https://www.frozenbexar.com/admin" style="color:#e81ccd;">the admin dashboard</a> to confirm or manage this booking.</p>
        </div>
      </div>`;

    // Await emails before responding — Vercel freezes the Lambda after the response
    // is sent, so fire-and-forget promises never complete on serverless.
    const emailResults = await Promise.allSettled([
      sendMail({
        to: email,
        subject: `Your Frozen Bexar Booking Request – ${fmtDate(eventDate)}`,
        html: customerHtml,
        ...(adminNotifyEmail ? { replyTo: adminNotifyEmail } : {}),
      }),
      ...(adminNotifyEmail
        ? [sendMail({ to: adminNotifyEmail, subject: `🔔 New Booking: ${name} – ${eventDate}`, html: adminHtml, replyTo: email })]
        : []),
    ]);
    const labels = ["customer confirmation", "admin notification"];
    emailResults.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(`[booking] ${labels[i] ?? `email ${i}`} failed:`, r.reason);
      } else {
        console.log(`[booking] ${labels[i] ?? `email ${i}`} sent OK`);
      }
    });
    if (!adminNotifyEmail) {
      console.warn("[booking] ADMIN_EMAIL not set — no admin notification sent for booking", bookingId);
    }

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: "Internal server error", detail: String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await readBookings();
    return NextResponse.json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
