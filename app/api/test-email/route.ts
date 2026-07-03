import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function GET() {
  const env = {
    RESEND_API_KEY: process.env.RESEND_API_KEY ? "set" : null,
    RESEND_FROM: process.env.RESEND_FROM || null,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || null,
  };

  const to = process.env.ADMIN_EMAIL;

  if (!to) {
    return NextResponse.json({ ok: false, env, error: "No ADMIN_EMAIL or SMTP_USER configured" });
  }

  try {
    await sendMail({
      to,
      subject: "Test Email — Frozen Bexar Diagnostics",
      html: "<p>This is a diagnostic test email sent directly (awaited) from /api/test-email.</p>",
    });
    return NextResponse.json({ ok: true, env, sentTo: to });
  } catch (err) {
    return NextResponse.json({ ok: false, env, error: String(err) }, { status: 500 });
  }
}
