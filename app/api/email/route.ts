import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY not set — add it in Netlify → Site configuration → Environment variables" },
        { status: 503 }
      );
    }

    await sendMail({
      to,
      subject,
      html: body.replace(/\n/g, "<br>"),
      text: body,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Email error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
