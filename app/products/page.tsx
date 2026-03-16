import Link from "next/link";
import Image from "next/image";
import { Snowflake, Umbrella, Armchair, UtensilsCrossed, Lightbulb, PackageOpen, CheckCircle2, Wind } from "lucide-react";

const products = [
  {
    id: "margarita",
    icon: <Snowflake size={40} className="text-[#00e64d]" />,
    name: "Margarita Machines",
    tagline: "The life of the party!",
    description:
      "Our commercial-grade frozen margarita machines keep the drinks flowing all night long. Perfect for any size event — from intimate backyard gatherings to large outdoor celebrations.",
    features: [
      "Commercial-grade frozen drink machines",
      "Holds multiple gallons per tank",
      "Easy to operate — we show you how",
      "Great for margaritas, daiquiris, slushies & more",
      "Available in single or dual-flavor options",
    ],
    color: "#00e64d",
  },
  {
    id: "coolers",
    icon: <Wind size={40} className="text-[#e81ccd]" />,
    name: "Evaporative Cooler Fans",
    tagline: "Stay cool under the Texas sun!",
    description:
      "Our most popular rental! These powerful evaporative cooler fans push 5,300 CFM of cool air with 3 speeds, a 21 gallon tank, and oscillating directions — perfect for keeping guests comfortable under canopies or in open-air spaces without the cost of AC.",
    features: [
      "5,300 CFM cooling power",
      "3-speed settings for flexible comfort control",
      "21 gallon water tank",
      "Oscillating louvers for wide coverage",
      "Portable with easy-roll casters",
      "Pairs perfectly with our 10×20 canopy tents",
    ],
    image: "/cooler-unit.jpg",
    color: "#e81ccd",
  },
  {
    id: "canopies",
    icon: <Umbrella size={40} className="text-[#00e64d]" />,
    name: "10×20 Canopy Tent",
    tagline: "Beat the San Antonio heat!",
    description:
      "Our heavy duty, commercial grade 10×20 canopy tents provide generous shade and coverage for your outdoor events. Essential for San Antonio summers — keep your guests comfortable no matter the weather.",
    features: [
      "Sturdy 10×20 ft frame with durable canopy top",
      "Heavy-duty construction for wind resistance",
      "Professional setup and breakdown included",
      "Perfect for 20–30 guests underneath",
      "Available in white and assorted colors",
    ],
    color: "#00e64d",
  },
  {
    id: "tables",
    icon: <Armchair size={40} className="text-[#00e64d]" />,
    name: "Tables & Chairs",
    tagline: "Seating for every celebration",
    description:
      "Complete your event setup with our clean, well-maintained tables and chairs. Available in multiple styles to match your event's vibe.",
    features: [
      "6ft and 8ft rectangular folding tables",
      "48in round tables for banquet-style seating",
      "Padded and standard folding chairs",
      "Quantity packages available",
      "Delivery and pickup included",
    ],
    color: "#00e64d",
  },
  {
    id: "tablecloths",
    icon: <UtensilsCrossed size={40} className="text-[#e81ccd]" />,
    name: "Tablecloths",
    tagline: "The finishing touch",
    description:
      "Elevate your table presentation with our premium tablecloths. Available in a wide range of colors to match any party theme or color scheme.",
    features: [
      "Fits 6ft and 8ft rectangular tables",
      "Round tablecloth options available",
      "Wide variety of solid colors",
      "Pressed and clean for every event",
      "Polyester blend — wrinkle-resistant",
    ],
    color: "#e81ccd",
  },
  {
    id: "lights",
    icon: <Lightbulb size={40} className="text-[#00e64d]" />,
    name: "Canopy Lights",
    tagline: "Set the perfect mood",
    description:
      "Transform your canopy into a magical space with our string lights and LED lighting options. Perfect for evening events, weddings, quinceañeras, and more.",
    features: [
      "Warm white and multicolor string lights",
      "LED options for energy efficiency",
      "Designed to hang inside canopy frames",
      "Extension cords and connectors included",
      "Creates a magical ambiance at night",
    ],
    color: "#00e64d",
  },
  {
    id: "packages",
    icon: <PackageOpen size={40} className="text-[#e81ccd]" />,
    name: "Event Packages",
    tagline: "Bundle & save big!",
    description:
      "Get everything you need in one convenient package. Our bundles combine canopies, tables, chairs, tablecloths, and lights at a discounted rate. Contact us to build a custom package.",
    features: [
      "Mix and match any rental items",
      "Custom quotes for any event size",
      "Discounts for multi-item bundles",
      "Delivery, setup & breakdown included",
      "Same-day quotes available",
    ],
    color: "#e81ccd",
  },
];

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
            <div
              key={product.id}
              className={`card-dark rounded-3xl overflow-hidden flex flex-col ${
                idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
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
                {"image" in product && product.image ? (
                  <div className="mb-4 w-40 h-48 relative">
                    <Image src={product.image as string} alt={product.name} fill className="object-contain drop-shadow-lg" />
                  </div>
                ) : (
                  <div className="mb-4">{product.icon}</div>
                )}
                <h2 className="text-white font-black text-xl text-center mb-1">{product.name}</h2>
                <p
                  className="text-sm font-semibold text-center"
                  style={{ color: product.color }}
                >
                  {product.tagline}
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 lg:p-10">
                <p className="text-gray-300 leading-relaxed mb-6">{product.description}</p>
                <ul className="space-y-2 mb-8">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0"
                        style={{ color: product.color }}
                      />
                      <span className="text-gray-200 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/booking"
                  className="inline-block px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide text-white transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${product.color}, ${product.color}aa)` }}
                >
                  Reserve This Item
                </Link>
              </div>
            </div>
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
