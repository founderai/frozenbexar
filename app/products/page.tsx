import Link from "next/link";
import Image from "next/image";
import { Snowflake, Umbrella, Tent, Armchair, UtensilsCrossed, Lightbulb, PackageOpen, CheckCircle2, Wind, Trophy, ChevronRight } from "lucide-react";
import { products } from "@/lib/products";

function ProductIcon({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
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

export default function ProductsPage() {
  return (
    <>
      {/* Header */}
      <section className="relative pt-20 pb-14 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#e81ccd]/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-black mb-4">
            Our{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#e81ccd,#ff6ef7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Rentals
            </span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Everything you need to throw the perfect San Antonio party — rented, delivered, and set up by us.
          </p>
          <p className="text-[#00e64d] font-semibold mt-3 text-sm tracking-wide">
            No payment required online — contact us for pricing!
          </p>
        </div>
      </section>

      {/* Products List */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {products.map((product, idx) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className={`card-dark rounded-3xl overflow-hidden flex flex-col group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] ${
                idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
              style={{ ["--hover-color" as string]: product.color }}
            >
              {/* Color panel */}
              <div
                className="lg:w-72 flex flex-col items-center justify-center p-10 shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${product.color}22, ${product.color}05)`,
                  borderRight: idx % 2 === 0 ? `2px solid ${product.color}30` : "none",
                  borderLeft: idx % 2 !== 0 ? `2px solid ${product.color}30` : "none",
                }}
              >
                {product.image ? (
                  <div className="mb-4 w-40 h-48 relative">
                    <Image src={product.image} alt={product.name} fill className="object-contain drop-shadow-lg" />
                  </div>
                ) : (
                  <div className="mb-4">
                    <ProductIcon name={product.iconName} color={product.color} size={40} />
                  </div>
                )}
                <h2 className="text-white font-black text-xl text-center mb-1">{product.name}</h2>
                <p className="text-sm font-semibold text-center" style={{ color: product.color }}>
                  {product.tagline}
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 lg:p-10">
                <p className="text-gray-300 leading-relaxed mb-6">{product.description}</p>
                <ul className="space-y-2 mb-8">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0" style={{ color: product.color }} />
                      <span className="text-gray-200 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide text-white transition-all group-hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${product.color}, ${product.color}aa)` }}
                  >
                    View Details <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg,#1a0015,#001a0a)" }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-4 text-white">
            Need a Custom Package?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            We build custom rental packages for events of all sizes. Tell us your vision and we&apos;ll make it happen!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/booking"
              className="px-8 py-4 rounded-full font-bold uppercase tracking-wide text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
            >
              Book Now
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full font-bold uppercase tracking-wide border-2 border-[#00e64d] text-[#00e64d] hover:bg-[#00e64d]/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
