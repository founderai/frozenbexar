import type { Metadata } from "next";
import { Table2, Armchair, CheckCircle2 } from "lucide-react";
import SeoLandingPage, { type FAQ, type RelatedLink } from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
  title: "Table & Chair Rentals in San Antonio, TX | Frozen Bexar",
  description:
    "Rent tables and chairs in San Antonio from Frozen Bexar. 6ft rectangular tables, round tables, cocktail tables, folding chairs, and linens — delivered and set up at your event.",
  alternates: { canonical: "https://frozenbexar.com/table-chair-rentals-san-antonio" },
  openGraph: {
    title: "Table & Chair Rentals San Antonio | Frozen Bexar",
    description:
      "Tables, chairs, and linens delivered and set up across San Antonio. Rectangular, round, and cocktail tables available with black linen options.",
    url: "https://frozenbexar.com/table-chair-rentals-san-antonio",
    images: [{ url: "https://frozenbexar.com/table.jpg", alt: "Table and Chair Rentals San Antonio" }],
  },
};

const faqs: FAQ[] = [
  {
    q: "How many tables do I need for 50 guests?",
    a: "For 50 guests using standard 6ft rectangular tables (seats 6–8 per table), plan for 7–8 tables. If you're using 60-inch round tables (seats 8–10), you'll need 6–7. Add 1–2 extra tables for a buffet line or gift/cake station. Our table & chair calculator (coming soon) will automate this math for any guest count.",
  },
  {
    q: "What's the difference between rectangular and round tables?",
    a: "6ft rectangular tables (30×72 inches) work well for banquet-style seating and buffet lines. They're easier to line up in rows and tend to maximize space efficiency. Round tables (60-inch diameter) encourage conversation and are commonly used for wedding receptions and formal events. Cocktail tables are high-top bar-height tables, ideal for standing mingling areas or smaller appetizer stations.",
  },
  {
    q: "Do linens come with the tables?",
    a: "Linens are available as an add-on rental — they don't come automatically with the tables. We offer black linens that fit rectangular, round, and cocktail tables. If you have a specific color scheme, we recommend sourcing specialty linens from a linen rental company, as we currently only stock black.",
  },
  {
    q: "What chair styles do you offer?",
    a: "We currently offer standard folding chairs in two styles. Our white resin chairs have a clean, formal look suitable for most event types. Our wood folding chairs offer a more rustic or elegant aesthetic. Both are priced per chair.",
  },
  {
    q: "Can I rent just chairs without tables?",
    a: "Yes — tables and chairs can be rented individually or together. Many customers rent chairs from us to supplement their own tables, or vice versa. Just specify what you need when requesting a quote.",
  },
  {
    q: "How are tables and chairs delivered?",
    a: "Tables arrive folded and chairs are stacked. Our team will set everything up in the configuration you prefer — rows, rounds, mixed — and confirm the layout with you before leaving. We return after the event for pickup.",
  },
];

const relatedLinks: RelatedLink[] = [
  { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
  { label: "Tent Rentals", href: "/tent-rentals-san-antonio" },
  { label: "Backyard Party Rentals", href: "/backyard-party-rentals-san-antonio" },
  { label: "Graduation Party Rentals", href: "/graduation-party-rentals-san-antonio" },
  { label: "View Tables & Chairs", href: "/products/tables" },
];

const tableTypes = [
  { name: "6ft Rectangular Table", seats: "6–8 guests", best: "Banquet rows, buffets, craft tables", price: "$6", color: "#00e64d" },
  { name: "Round Table", seats: "8–10 guests", best: "Formal seating, receptions, centerpiece setups", price: "$16", color: "#e81ccd" },
  { name: "Cocktail Table", seats: "Standing / 3–4 stools", best: "Mingling areas, bars, appetizer stations", price: "$15", color: "#00e64d" },
];

export default function TableChairRentalsSanAntonioPage() {
  return (
    <SeoLandingPage
      h1="Table & Chair Rentals in San Antonio, TX"
      badge="Seating & Furniture"
      badgeColor="#e81ccd"
      subtitle="Rectangular tables, round tables, cocktail tables, folding chairs, and black linens — delivered and set up at your San Antonio event. Rent exactly what you need, by the piece."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
        { label: "Table & Chair Rentals San Antonio", href: "/table-chair-rentals-san-antonio" },
      ]}
      faqs={faqs}
      relatedLinks={relatedLinks}
      calculator="table-chair"
    >
      {/* Intro */}
      <section>
        <h2 className="text-2xl font-black text-white mb-4">
          The Right Tables Make or Break an Event Layout
        </h2>
        <div className="space-y-4 text-gray-300 text-base leading-relaxed">
          <p>
            Seating is one of the most important logistical decisions for any event — and one of the
            most commonly underestimated. Too few tables and guests spend the night standing. Too
            many tables and your yard feels like a warehouse. Getting it right means knowing your
            headcount, your layout preferences, and whether you need extra surface area for a buffet
            or bar setup.
          </p>
          <p>
            At Frozen Bexar, we rent tables individually so you can mix and match styles. A common
            setup for a 60-person backyard party in San Antonio might be four 6ft rectangular tables
            for seating, one rectangular table for the buffet line, one round table near the entry
            for the gift display, and two cocktail tables in the mingling area near the margarita
            machine.
          </p>
          <p>
            Our black linens fit all three table styles and add a clean, finished look to any
            outdoor setup — especially under candlelight or string lights at night.
          </p>
        </div>
      </section>

      {/* Table Types */}
      <section>
        <h2 className="text-2xl font-black text-white mb-6">Table Styles We Carry</h2>
        <div className="space-y-4">
          {tableTypes.map((t) => (
            <div
              key={t.name}
              className="card-dark rounded-2xl p-5 border flex items-start gap-4"
              style={{ borderColor: `${t.color}25` }}
            >
              <Table2 size={22} style={{ color: t.color }} className="shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-white text-sm">{t.name}</h3>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${t.color}20`, color: t.color }}
                  >
                    {t.price}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">Seats: {t.seats}</p>
                <p className="text-sm text-gray-400">{t.best}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seating Tips */}
      <section>
        <h2 className="text-2xl font-black text-white mb-5">Quick Seating Reference</h2>
        <div className="card-dark rounded-2xl border border-white/8 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wide">Guests</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wide">Rect. Tables</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wide">Round Tables</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wide">Chairs</th>
              </tr>
            </thead>
            <tbody>
              {[
                { guests: "25", rect: "4", round: "3", chairs: "25–30" },
                { guests: "50", rect: "7–8", round: "6", chairs: "50–55" },
                { guests: "75", rect: "10–11", round: "8–9", chairs: "75–80" },
                { guests: "100", rect: "13–14", round: "11", chairs: "100–110" },
              ].map((row, i) => (
                <tr key={row.guests} className={i < 3 ? "border-b border-white/5" : ""}>
                  <td className="px-5 py-3 text-white font-bold">{row.guests}</td>
                  <td className="px-5 py-3 text-gray-300">{row.rect}</td>
                  <td className="px-5 py-3 text-gray-300">{row.round}</td>
                  <td className="px-5 py-3 text-gray-300">{row.chairs}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-5 py-3 text-xs text-gray-600 border-t border-white/5">
            Add 1–2 extra tables for buffet, cake, or gift stations. Counts assume seated-only setup.
          </p>
        </div>
      </section>

      {/* Chair Options */}
      <section>
        <h2 className="text-2xl font-black text-white mb-5">Chair Options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "Folding Chair", desc: "Lightweight, stackable, and easy to arrange. Works for any outdoor or semi-formal event.", price: "$3 each", color: "#00e64d" },
            { name: "Wood Folding Chair", desc: "A more elegant option with natural wood aesthetics. Popular for weddings and upscale outdoor events.", price: "$3 each", color: "#e81ccd" },
          ].map((c) => (
            <div key={c.name} className="card-dark rounded-2xl p-5 border border-white/8">
              <Armchair size={20} style={{ color: c.color }} className="mb-2" />
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-sm">{c.name}</h3>
                <span className="text-xs font-bold" style={{ color: c.color }}>{c.price}</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{c.desc}</p>
              <div className="mt-3">
                <CheckCircle2 size={13} className="text-[#00e64d] inline mr-1.5" />
                <span className="text-xs text-gray-500">Delivery & setup included</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SeoLandingPage>
  );
}
