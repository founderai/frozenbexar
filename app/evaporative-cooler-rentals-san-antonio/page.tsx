import type { Metadata } from "next";
import { Wind, Zap, Droplets, CheckCircle2 } from "lucide-react";
import SeoLandingPage, { type FAQ, type RelatedLink } from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
  title: "Evaporative Cooler Fan Rentals in San Antonio, TX | Frozen Bexar",
  description:
    "Rent evaporative cooler fans in San Antonio from Frozen Bexar. 5,300 CFM portable coolers with 21-gallon tanks — the most effective outdoor cooling for Texas summer events.",
  alternates: { canonical: "https://frozenbexar.com/evaporative-cooler-rentals-san-antonio" },
  openGraph: {
    title: "Evaporative Cooler Rentals San Antonio | Frozen Bexar",
    description:
      "5,300 CFM evaporative cooler fans for rent in San Antonio. Powerful outdoor cooling for canopy events, backyard parties, and summer gatherings in the Texas heat.",
    url: "https://frozenbexar.com/evaporative-cooler-rentals-san-antonio",
    images: [{ url: "https://frozenbexar.com/cooler.png", alt: "Evaporative Cooler Rental San Antonio" }],
  },
};

const faqs: FAQ[] = [
  {
    q: "How effective are evaporative coolers in San Antonio's climate?",
    a: "Evaporative cooling works by pushing air across water-saturated pads, dropping the air temperature by 10–20°F. In San Antonio, where summer humidity is moderate (typically 40–60%), this is noticeably effective — especially under a shaded canopy where the cooled air has less space to dissipate. They're most effective in the 90–105°F range that San Antonio sees from May through September.",
  },
  {
    q: "How many cooler fans do I need for my event?",
    a: "For events under a 10×20 canopy, one cooler fan positioned at the open end provides good coverage for 20–30 guests. For a 13×26 canopy with 40–50 guests, two fans placed on opposing ends dramatically improves comfort. Our cooler recommendation tool (coming soon) will calculate this based on your tent size and guest count.",
  },
  {
    q: "Do the coolers require electricity?",
    a: "Yes — each unit requires a standard 110V grounded outlet and draws approximately 6–8 amps. Most homes in San Antonio can run two units on separate circuits without issue. If you're in an outdoor location without power access, a generator is required. We can point you toward generator rental options if needed.",
  },
  {
    q: "How much water does each cooler use?",
    a: "Each unit has a 21-gallon water tank that typically lasts 4–6 hours at medium fan speed. For longer events, you'll need to refill using a standard garden hose — the tank has a water inlet at the side. We'll walk you through the refill process during setup.",
  },
  {
    q: "Is there a discount for renting two cooler fans?",
    a: "Yes — renting two fans together is priced at a bundled rate of $140, compared to $80 per unit individually. For events where guests will be stationary under a canopy for 2+ hours in summer, two fans is almost always the better choice.",
  },
  {
    q: "Can the coolers be used with the tent walls closed?",
    a: "If you add side walls to your canopy, position one cooler at the open end (or a wall vent) and ensure at least one opening for air exhaust on the opposite side. Fully sealing the tent without an exhaust point reduces effectiveness. Semi-open setups with one or two walls work well.",
  },
];

const relatedLinks: RelatedLink[] = [
  { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
  { label: "Tent Rentals", href: "/tent-rentals-san-antonio" },
  { label: "Backyard Party Rentals", href: "/backyard-party-rentals-san-antonio" },
  { label: "Margarita Machine Rentals", href: "/margarita-machine-rentals-san-antonio" },
  { label: "View Cooler Fan Product", href: "/products/coolers" },
];

const specs = [
  { icon: <Wind size={18} className="text-[#00b3ff]" />, label: "Airflow", value: "5,300 CFM" },
  { icon: <Droplets size={18} className="text-[#00b3ff]" />, label: "Water Tank", value: "21 gallons" },
  { icon: <Zap size={18} className="text-[#00b3ff]" />, label: "Power", value: "110V / 6–8 amps" },
  { icon: <Wind size={18} className="text-[#00b3ff]" />, label: "Fan Speeds", value: "3-speed control" },
];

export default function EvaporativeCoolerRentalsSanAntonioPage() {
  return (
    <SeoLandingPage
      h1="Evaporative Cooler Fan Rentals in San Antonio, TX"
      badge="Beat the Texas Heat"
      badgeColor="#00b3ff"
      subtitle="Our 5,300 CFM evaporative cooler fans drop the ambient temperature under your canopy by 10–20°F — the most practical outdoor cooling solution for San Antonio summer events."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
        { label: "Evaporative Cooler Rentals San Antonio", href: "/evaporative-cooler-rentals-san-antonio" },
      ]}
      faqs={faqs}
      relatedLinks={relatedLinks}
      calculator="cooler"
    >
      {/* Intro */}
      <section>
        <h2 className="text-2xl font-black text-white mb-4">
          Why Evaporative Cooling Works for San Antonio Outdoor Events
        </h2>
        <div className="space-y-4 text-gray-300 text-base leading-relaxed">
          <p>
            San Antonio summers are relentless. From May through September, daytime temperatures
            regularly exceed 95°F, and outdoor events without shade or airflow can become
            uncomfortable within minutes for guests. Air conditioning isn't practical for most
            outdoor spaces, and standard box fans don't move enough air to make a real difference.
          </p>
          <p>
            Evaporative cooling — also called swamp cooling — works by drawing warm ambient air
            through water-saturated pads, which lowers the air temperature through evaporation.
            The result is a steady stream of air that feels 10–20°F cooler than the surrounding
            environment. In San Antonio's moderate humidity range (40–60%), this is genuinely
            effective, especially under a canopy tent where the cooled air has a contained space
            to fill.
          </p>
          <p>
            Our units push 5,300 CFM of airflow — enough to noticeably cool the area under a
            10×20 canopy with a single unit, or a 13×26 canopy with two units running on opposing
            ends. Guests near the fans will feel a meaningful temperature drop, and even those
            further away benefit from the improved airflow.
          </p>
        </div>
      </section>

      {/* Specs */}
      <section>
        <h2 className="text-2xl font-black text-white mb-5">Unit Specifications</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {specs.map((s) => (
            <div key={s.label} className="card-dark rounded-2xl p-5 border border-white/8 text-center">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p className="text-white font-black text-base mb-0.5">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Oscillating louvers for wide directional coverage",
            "Roll-away casters for repositioning during the event",
            "Standard garden hose water inlet for easy refills",
            "Portable — no permanent installation required",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#00e64d] shrink-0" />
              <span className="text-sm text-gray-300">{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 1 vs 2 fans */}
      <section>
        <h2 className="text-2xl font-black text-white mb-5">1 Fan or 2 Fans?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="card-dark rounded-2xl p-6 border" style={{ borderColor: "#00b3ff30" }}>
            <p className="font-black text-white text-lg mb-1">1 Fan — $80</p>
            <p className="text-xs text-gray-500 mb-4">Best for smaller setups</p>
            <ul className="space-y-2 text-sm text-gray-300">
              {["10×20 canopy (200 sq ft)", "20–30 guests", "Shorter 2–3 hour events", "Placement at open end of tent"].map(i => (
                <li key={i} className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#00b3ff] shrink-0" />{i}</li>
              ))}
            </ul>
          </div>
          <div
            className="card-dark rounded-2xl p-6 border relative overflow-hidden"
            style={{ borderColor: "#00b3ff60" }}
          >
            <span className="absolute top-3 right-3 text-xs font-black px-2 py-0.5 rounded-full" style={{ background: "#00b3ff20", color: "#00b3ff" }}>Best Value</span>
            <p className="font-black text-white text-lg mb-1">2 Fans — $140</p>
            <p className="text-xs text-gray-500 mb-4">Save $20 vs. renting individually</p>
            <ul className="space-y-2 text-sm text-gray-300">
              {["13×26 canopy (338 sq ft)", "40–60+ guests", "Full-day events (4+ hours)", "Opposing-end placement for full coverage"].map(i => (
                <li key={i} className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#00b3ff] shrink-0" />{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SeoLandingPage>
  );
}
