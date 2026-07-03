import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function GET() {
  const env = {
    SMTP_HOST: process.env.SMTP_HOST || null,
    SMTP_PORT: process.env.SMTP_PORT || null,
    SMTP_SECURE: process.env.SMTP_SECURE || null,
    SMTP_USER: process.env.SMTP_USER ? "set" : null,
    SMTP_PASS: process.env.SMTP_PASS ? "set" : null,
    SMTP_FROM: process.env.SMTP_FROM || null,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || null,
  };

  const to = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

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
