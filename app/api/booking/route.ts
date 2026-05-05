import { NextRequest, NextResponse } from "next/server";
import { readBookings, writeBookings } from "@/lib/bookings";
import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, eventDate, eventType, guestCount, address, items, notes } = body;

    if (!name || !email || !phone || !eventDate || !eventType || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      eventDate,
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

    // Customer confirmation email
    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#ffffff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#e81ccd,#b5109e);padding:30px 40px;text-align:center;">
          <h1 style="margin:0;font-size:28px;color:#fff;">Booking Request Received! 🎉</h1>
          <p style="margin:8px 0 0;color:#ffd6f8;font-size:14px;">San Antonio's Premier Party Rental</p>
        </div>
        <div style="padding:32px 40px;">
          <p style="color:#e0e0e0;line-height:1.6;">Hi <strong style="color:#fff;">${name}</strong>,</p>
          <p style="color:#e0e0e0;line-height:1.6;">Thank you for choosing <strong style="color:#e81ccd;">Frozen Bexar</strong>! We've received your booking request and will contact you within a few hours to confirm availability and provide a quote.</p>

          <div style="background:#1a1a1a;border:1px solid #e81ccd33;border-radius:10px;padding:20px;margin:24px 0;">
            <h3 style="margin:0 0 14px;color:#00e64d;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Your Booking Summary</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="color:#888;padding:5px 0;width:130px;">Event Type</td><td style="color:#fff;">${eventType}</td></tr>
              <tr><td style="color:#888;padding:5px 0;">Event Date</td><td style="color:#fff;">${eventDate}</td></tr>
              ${address ? `<tr><td style="color:#888;padding:5px 0;">Location</td><td style="color:#fff;">${address}</td></tr>` : ""}
              ${guestCount ? `<tr><td style="color:#888;padding:5px 0;">Est. Guests</td><td style="color:#fff;">${guestCount}</td></tr>` : ""}
              <tr><td style="color:#888;padding:5px 0;vertical-align:top;">Rental Items</td><td style="color:#fff;">${items.join(", ")}</td></tr>
              ${notes ? `<tr><td style="color:#888;padding:5px 0;vertical-align:top;">Notes</td><td style="color:#fff;font-style:italic;">${notes}</td></tr>` : ""}
            </table>
          </div>

          <p style="color:#e0e0e0;line-height:1.6;">We'll reach out to you at <strong style="color:#e81ccd;">${email}</strong> or <strong style="color:#e81ccd;">${phone}</strong> shortly.</p>
          <p style="color:#e0e0e0;line-height:1.6;">Questions? Call or text us anytime!</p>
        </div>
        <div style="background:#111;padding:20px 40px;text-align:center;border-top:1px solid #222;">
          <p style="margin:0;color:#555;font-size:12px;">Frozen Bexar · San Antonio, Texas · <a href="mailto:info@frozenbexar.com" style="color:#e81ccd;">info@frozenbexar.com</a></p>
        </div>
      </div>`;

    // Admin notification email
    const adminNotifyEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#ffffff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#00e64d,#00b33c);padding:24px 40px;text-align:center;">
          <h1 style="margin:0;font-size:22px;color:#fff;">🔔 New Booking Request!</h1>
        </div>
        <div style="padding:28px 40px;">
          <div style="background:#1a1a1a;border:1px solid #00e64d33;border-radius:10px;padding:20px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="color:#888;padding:5px 0;width:130px;">Name</td><td style="color:#fff;font-weight:bold;">${name}</td></tr>
              <tr><td style="color:#888;padding:5px 0;">Email</td><td style="color:#00e64d;">${email}</td></tr>
              <tr><td style="color:#888;padding:5px 0;">Phone</td><td style="color:#fff;">${phone}</td></tr>
              <tr><td style="color:#888;padding:5px 0;">Event Type</td><td style="color:#fff;">${eventType}</td></tr>
              <tr><td style="color:#888;padding:5px 0;">Event Date</td><td style="color:#fff;font-weight:bold;">${eventDate}</td></tr>
              ${address ? `<tr><td style="color:#888;padding:5px 0;">Location</td><td style="color:#fff;">${address}</td></tr>` : ""}
              ${guestCount ? `<tr><td style="color:#888;padding:5px 0;">Guests</td><td style="color:#fff;">${guestCount}</td></tr>` : ""}
              <tr><td style="color:#888;padding:5px 0;vertical-align:top;">Items</td><td style="color:#fff;">${items.join(", ")}</td></tr>
              ${notes ? `<tr><td style="color:#888;padding:5px 0;vertical-align:top;">Notes</td><td style="color:#fff;font-style:italic;">${notes}</td></tr>` : ""}
            </table>
          </div>
          <p style="color:#aaa;font-size:13px;margin-top:16px;">Log in to <a href="/admin" style="color:#e81ccd;">the admin dashboard</a> to confirm or manage this booking.</p>
        </div>
      </div>`;

    // Fire emails non-blocking (don't fail the booking if SMTP isn't configured)
    Promise.allSettled([
      sendMail({ to: email, subject: `Your Frozen Bexar Booking Request – ${eventDate}`, html: customerHtml }),
      ...(adminNotifyEmail ? [sendMail({ to: adminNotifyEmail, subject: `🔔 New Booking: ${name} – ${eventDate}`, html: adminHtml })] : []),
    ]).catch(console.error);

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
