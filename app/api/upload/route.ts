import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Storage not configured — SUPABASE_URL or SUPABASE_SERVICE_KEY missing." },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const ext  = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const name = `product-${Date.now()}.${ext}`;

    const buffer = await file.arrayBuffer();

    const res = await fetch(`${supabaseUrl}/storage/v1/object/product-images/${name}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": file.type || "image/jpeg",
        "x-upsert": "true",
      },
      body: buffer,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Supabase upload error:", text);
      return NextResponse.json({ error: text }, { status: 500 });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${name}`;
    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
