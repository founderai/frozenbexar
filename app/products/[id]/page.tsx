import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Snowflake, Umbrella, Tent, Armchair, UtensilsCrossed,
  Lightbulb, PackageOpen, Wind, Trophy, CheckCircle2, ArrowLeft, CalendarCheck, GlassWater, Sparkles, ChevronRight,
} from "lucide-react";
import { products } from "@/lib/products";

function ProductIcon({ name, color, size = 56 }: { name: string; color: string; size?: number }) {
  const props = { size, style: { color } };
  const map: Record<string, React.ReactNode> = {
    Snowflake: <Snowflake {...props} />,
    Wind: <Wind {...props} />,
    Umbrella: <Umbrella {...props} />,
    Tent: <Tent {...props} />,
    Armchair: <Armchair {...props} />,
    UtensilsCrossed: <UtensilsCrossed {...props} />,
    Lightbulb: <Lightbulb {...props} />,
    PackageOpen: <PackageOpen {...props} />,
    Trophy: <Trophy {...props} />,
  };
  return <>{map[name] ?? <PackageOpen {...props} />}</>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return {};
  return {
    title: `${product.name} | Frozen Bexar Party Rentals`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const related = products.filter((p) => p.id !== product.id && p.color === product.color).slice(0, 3);

  return (
    <>
      {/* Back + Hero */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: product.color }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold mb-10 transition-colors hover:opacity-80"
            style={{ color: product.color }}
          >
            <ArrowLeft size={16} /> Back to All Rentals
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Image / Icon */}
            <div
              className="w-full lg:w-80 shrink-0 rounded-3xl flex items-center justify-center p-10"
              style={{ background: `linear-gradient(135deg, ${product.color}25, ${product.color}08)`, border: `2px solid ${product.color}30` }}
            >
              {product.image ? (
                <div className="relative w-56 h-64">
                  <Image src={product.image} alt={product.name} fill className="object-contain drop-shadow-2xl" />
                </div>
              ) : (
                <ProductIcon name={product.iconName} color={product.color} size={80} />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: product.color }}>
                Frozen Bexar Rentals
              </p>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">{product.name}</h1>
              <p className="text-xl font-semibold mb-6" style={{ color: product.color }}>{product.tagline}</p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">{product.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold uppercase tracking-wide text-white transition-all hover:scale-105 reserve-glow"
                  style={{ background: `linear-gradient(135deg, ${product.color}, ${product.color}bb)` }}
                >
                  <CalendarCheck size={18} /> Reserve This Item
                </Link>
                {product.id === "margarita" && (
                  <Link
                    href="/products/margarita/flavors"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold uppercase tracking-wide text-white transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
                  >
                    <GlassWater size={18} /> Browse Flavors
                  </Link>
                )}
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold uppercase tracking-wide border-2 transition-all hover:opacity-80"
                  style={{ borderColor: product.color, color: product.color }}
                >
                  Ask a Question
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-white mb-8">
            What&apos;s{" "}
            <span style={{ color: product.color }}>Included</span>
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.features.map((f) => (
              <li key={f} className="card-dark rounded-2xl px-5 py-4 flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0" style={{ color: product.color }} />
                <span className="text-gray-200 font-medium">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Canopy Lights Add-On — shown on canopy product pages */}
      {(product.id === "canopy-10x20" || product.id === "canopy-13x26") && (
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/products/lights"
              className="group block rounded-3xl overflow-hidden relative cursor-pointer transition-all hover:scale-[1.01]"
              style={{
                background: "linear-gradient(135deg, #0a0a14, #111122, #0a0a0e)",
                border: "1.5px solid rgba(255,255,255,0.15)",
                boxShadow: "0 0 40px rgba(255,255,255,0.06), inset 0 0 60px rgba(255,255,255,0.02)",
              }}
            >
              <div className="absolute top-6 left-0 right-0 flex justify-around px-8 pointer-events-none">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{
                    background: i % 3 === 0 ? "#fffbe0" : i % 3 === 1 ? "#ffd580" : "#fff",
                    boxShadow: `0 0 6px 2px ${i % 3 === 0 ? "#fffbe088" : i % 3 === 1 ? "#ffd58088" : "#ffffff88"}`,
                    opacity: 0.85,
                  }} />
                ))}
              </div>
              <div className="flex flex-col lg:flex-row items-center gap-10 px-10 pt-14 pb-10">
                <div className="shrink-0 flex flex-col items-center gap-3">
                  <div style={{ filter: "drop-shadow(0 0 18px #fffbe0) drop-shadow(0 0 36px #fff6)" }}>
                    <Lightbulb size={64} color="#fffbe0" />
                  </div>
                  <Sparkles size={20} color="#ffd580" style={{ filter: "drop-shadow(0 0 8px #ffd580)" }} />
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#ffd580", textShadow: "0 0 8px #ffd58088" }}>Add-On Rental</p>
                  <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: "#ffffff", textShadow: "0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.3)" }}>
                    Magical Canopy Lights
                  </h2>
                  <p className="text-gray-300 text-lg mb-6 max-w-2xl">
                    Add magical canopy lights to <span style={{ color: "#fffbe0", textShadow: "0 0 8px #fffbe088" }}>brighten up your party at night</span>. Transform any canopy into a warm, glowing atmosphere that your guests will never forget.
                  </p>
                  <ul className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
                    {["Warm white string lights", "LED multicolor options", "Fits any canopy frame", "Creates a magical night vibe"].map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 rounded-full px-4 py-1.5 border border-white/10">
                        <CheckCircle2 size={14} color="#fffbe0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <span
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold uppercase tracking-wide text-black text-sm transition-all group-hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #fffbe0, #ffd580)", boxShadow: "0 0 20px rgba(255,251,224,0.4)" }}
                  >
                    View Details <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-20" style={{ background: "linear-gradient(135deg,#1a0015,#001a0a)" }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to book the{" "}
            <span style={{ color: product.color }}>{product.name}?</span>
          </h2>
          <p className="text-gray-300 mb-8">No payment required online — we&apos;ll contact you to confirm and provide a quote.</p>
          <Link
            href="/booking"
            className="inline-block px-10 py-4 rounded-full font-bold uppercase tracking-wide text-white transition-all hover:scale-105 reserve-glow"
            style={{ background: `linear-gradient(135deg, #e81ccd, #b5109e)` }}
          >
            Book Now — It&apos;s Free to Inquire
          </Link>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-white mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/products/${r.id}`}
                  className="card-dark rounded-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-all"
                >
                  {r.image ? (
                    <div className="relative w-24 h-28 mb-4">
                      <Image src={r.image} alt={r.name} fill className="object-contain" />
                    </div>
                  ) : (
                    <div className="mb-4">
                      <ProductIcon name={r.iconName} color={r.color} size={36} />
                    </div>
                  )}
                  <h3 className="text-white font-bold text-sm mb-1">{r.name}</h3>
                  <p className="text-xs font-semibold" style={{ color: r.color }}>{r.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
