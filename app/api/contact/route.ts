import { NextRequest, NextResponse } from "next/server";
import { readMessages, writeMessages } from "@/lib/bookings";

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
