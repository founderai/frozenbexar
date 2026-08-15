import { NextRequest, NextResponse } from "next/server";
import { readSubscribers, deleteSubscriber } from "@/lib/marketing-subscribers";

export const dynamic = "force-dynamic";

const ADMIN_PASS = "Addy2024!";

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password");
  if (password !== ADMIN_PASS) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const subs = await readSubscribers();
  return NextResponse.json(subs, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
  });
}

export async function DELETE(req: NextRequest) {
  try {
    const { password, id } = await req.json() as { password: string; id: string };
    if (password !== ADMIN_PASS) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await deleteSubscriber(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error", detail: String(err) }, { status: 500 });
  }
}
