import { NextRequest, NextResponse } from "next/server";
import { readMessages, writeMessages } from "@/lib/bookings";
import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const msg = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || "",
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    const messages = await readMessages();
    messages.push(msg);
    await writeMessages(messages);

    // Admin notification email
    const adminNotifyEmail = process.env.ADMIN_EMAIL;
    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#ffffff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#e81ccd,#b5109e);padding:24px 40px;text-align:center;">
          <h1 style="margin:0;font-size:22px;color:#fff;">📩 New Contact Form Message!</h1>
        </div>
        <div style="padding:28px 40px;">
          <div style="background:#1a1a1a;border:1px solid #e81ccd33;border-radius:10px;padding:20px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="color:#888;padding:5px 0;width:100px;">Name</td><td style="color:#fff;font-weight:bold;">${name}</td></tr>
              <tr><td style="color:#888;padding:5px 0;">Email</td><td style="color:#e81ccd;">${email}</td></tr>
              ${phone ? `<tr><td style="color:#888;padding:5px 0;">Phone</td><td style="color:#fff;">${phone}</td></tr>` : ""}
              <tr><td style="color:#888;padding:5px 0;vertical-align:top;">Message</td><td style="color:#fff;white-space:pre-wrap;">${message}</td></tr>
            </table>
          </div>
          <p style="color:#aaa;font-size:13px;margin-top:16px;">Log in to <a href="/admin" style="color:#e81ccd;">the admin dashboard</a> to view all messages.</p>
        </div>
      </div>`;

    // Await email before responding — Vercel freezes the Lambda after the response
    // is sent, so fire-and-forget promises never complete on serverless.
    if (adminNotifyEmail) {
      const [result] = await Promise.allSettled([
        sendMail({ to: adminNotifyEmail, subject: `📩 New Contact Message from ${name}`, html: adminHtml, replyTo: email }),
      ]);
      if (result.status === "rejected") {
        console.error("[contact] admin notification failed:", result.reason);
      } else {
        console.log("[contact] admin notification sent OK to", adminNotifyEmail);
      }
    } else {
      console.warn("[contact] ADMIN_EMAIL not set — no admin notification sent for contact from", name);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await readMessages();
    return NextResponse.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json() as { id: string };
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const messages = await readMessages();
    const filtered = messages.filter((m: { id: string }) => m.id !== id);
    await writeMessages(filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete message error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
