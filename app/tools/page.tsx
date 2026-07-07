import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Tent, Armchair, Wind, PartyPopper, BookOpen, MapPin, ClipboardList } from "lucide-react";
import TentCalculator from "@/components/calculators/TentCalculator";
import TableChairCalculator from "@/components/calculators/TableChairCalculator";
import CoolerCalculator from "@/components/calculators/CoolerCalculator";
import PlanMyEvent from "@/components/PlanMyEvent";

export const metadata: Metadata = {
  title: "Party Planning Tools & Resources | Frozen Bexar San Antonio",
  description:
    "Free interactive party planning tools for San Antonio events. Tent size calculator, table & chair calculator, evaporative cooler guide, and a Plan My Event wizard that builds your rental package.",
  alternates: { canonical: "https://frozenbexar.com/tools" },
  openGraph: {
    title: "Free Party Planning Tools | Frozen Bexar San Antonio",
    description:
      "Tent size calculator, table & chair calculator, cooler recommendation tool, and a Plan My Event wizard. Free tools for planning San Antonio outdoor events.",
    url: "https://frozenbexar.com/tools",
    images: [{ url: "https://frozenbexar.com/logo.png", alt: "Frozen Bexar Party Planning Tools" }],
  },
};

const RESOURCES = [
  { icon: <BookOpen size={16} className="text-[#e81ccd]" />, label: "Tent Rentals Guide", href: "/tent-rentals-san-antonio" },
  { icon: <BookOpen size={16} className="text-[#00e64d]" />, label: "Table & Chair Guide", href: "/table-chair-rentals-san-antonio" },
  { icon: <BookOpen size={16} className="text-[#00b3ff]" />, label: "Cooler Fan Guide", href: "/evaporative-cooler-rentals-san-antonio" },
  { icon: <BookOpen size={16} className="text-[#e81ccd]" />, label: "Graduation Party Guide", href: "/graduation-party-rentals-san-antonio" },
  { icon: <BookOpen size={16} className="text-[#00e64d]" />, label: "Backyard Party Guide", href: "/backyard-party-rentals-san-antonio" },
  { icon: <BookOpen size={16} className="text-[#e81ccd]" />, label: "Wedding Rentals Guide", href: "/wedding-rentals-san-antonio" },
  { icon: <BookOpen size={16} className="text-[#00e64d]" />, label: "Corporate Event Guide", href: "/corporate-event-rentals-san-antonio" },
  { icon: <MapPin size={16} className="text-[#00b3ff]" />, label: "All Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
  { icon: <ClipboardList size={16} className="text-[#e81ccd]" />, label: "Browse All Equipment", href: "/products" },
];

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 border"
          style={{ background: "#e81ccd15", borderColor: "#e81ccd40", color: "#e81ccd" }}>
          <Calculator size={13} />
          <span className="text-xs font-bold uppercase tracking-widest">Free Tools</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
          Party Planning Resources
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          Interactive tools to plan your San Antonio event — figure out exactly what you need
          before you request a quote.
        </p>
      </section>

      {/* Plan My Event — featured at top */}
      <section id="plan-my-event">
        <div className="flex items-center gap-3 mb-5">
          <PartyPopper size={20} className="text-[#e81ccd]" />
          <h2 className="text-2xl font-black text-white">Plan My Event</h2>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#e81ccd20] text-[#e81ccd] border border-[#e81ccd40]">New</span>
        </div>
        <p className="text-gray-400 text-sm mb-6 max-w-xl">
          Answer a few questions about your event and we'll build a recommended rental package —
          then send it straight to the quote form.
        </p>
        <PlanMyEvent />
      </section>

      {/* Tent Calculator */}
      <section id="tent-calculator">
        <div className="flex items-center gap-3 mb-5">
          <Tent size={20} className="text-[#00e64d]" />
          <h2 className="text-2xl font-black text-white">Tent Size Calculator</h2>
        </div>
        <p className="text-gray-400 text-sm mb-6 max-w-xl">
          Input your guest count and extra space needs — we'll recommend the right canopy and
          estimate your setup area requirements.
        </p>
        <TentCalculator />
      </section>

      {/* Table & Chair Calculator */}
      <section id="table-chair-calculator">
        <div className="flex items-center gap-3 mb-5">
          <Armchair size={20} className="text-[#e81ccd]" />
          <h2 className="text-2xl font-black text-white">Table & Chair Calculator</h2>
        </div>
        <p className="text-gray-400 text-sm mb-6 max-w-xl">
          Tell us your headcount and seating preferences — get an instant count of exactly how
          many tables and chairs you need.
        </p>
        <TableChairCalculator />
      </section>

      {/* Cooler Calculator */}
      <section id="cooler-calculator">
        <div className="flex items-center gap-3 mb-5">
          <Wind size={20} style={{ color: "#00b3ff" }} />
          <h2 className="text-2xl font-black text-white">Evaporative Cooler Recommendation</h2>
        </div>
        <p className="text-gray-400 text-sm mb-6 max-w-xl">
          Based on your tent size, event month, and outdoor conditions, we'll tell you how many
          cooler fans you need and where to position them.
        </p>
        <CoolerCalculator />
      </section>

      {/* Resources Grid */}
      <section>
        <h2 className="text-2xl font-black text-white mb-6">Rental Guides & Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RESOURCES.map(r => (
            <Link key={r.href} href={r.href}
              className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 card-dark hover:border-white/25 transition-all group">
              {r.icon}
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{r.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="rounded-3xl px-8 py-12 text-center"
        style={{ background: "linear-gradient(135deg,#1a001a,#000d00)", border: "1.5px solid #e81ccd30" }}>
        <h2 className="text-2xl font-black text-white mb-3">Ready to Book?</h2>
        <p className="text-gray-400 text-sm mb-7 max-w-md mx-auto">
          Use the calculators above to build your list, then head to the quote form.
          No payment required — just tell us what you need.
        </p>
        <Link href="/quote"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-sm transition-all hover:scale-[1.03]"
          style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}>
          Build My Quote
        </Link>
      </section>
    </div>
  );
}
