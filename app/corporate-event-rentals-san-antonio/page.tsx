import type { Metadata } from "next";
import { Building2, CheckCircle2, FileText, Users } from "lucide-react";
import SeoLandingPage, { type FAQ, type RelatedLink } from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
  title: "Corporate Event Rentals in San Antonio, TX | Frozen Bexar",
  description:
    "Corporate event rental equipment in San Antonio — canopy tents, tables, chairs, cooler fans, and margarita machines for company picnics, team events, and outdoor corporate gatherings.",
  alternates: { canonical: "https://frozenbexar.com/corporate-event-rentals-san-antonio" },
  openGraph: {
    title: "Corporate Event Rentals San Antonio | Frozen Bexar",
    description:
      "Professional event rental equipment for corporate picnics, team-building events, and outdoor company gatherings across San Antonio. Invoices available. Delivery and setup included.",
    url: "https://frozenbexar.com/corporate-event-rentals-san-antonio",
    images: [{ url: "https://frozenbexar.com/logo.png", alt: "Corporate Event Rentals San Antonio" }],
  },
};

const faqs: FAQ[] = [
  {
    q: "Do you provide invoices for corporate billing?",
    a: "Yes — we provide itemized invoices suitable for corporate expense reporting and accounts payable. If your company requires a W-9, specific billing information, or net payment terms, let us know when requesting a quote and we'll accommodate your accounting process.",
  },
  {
    q: "Can you handle large corporate events with 150+ attendees?",
    a: "Yes. For large events, we typically recommend multiple 13×26 canopy tents positioned side-by-side to create a larger covered area, combined with multiple cooler fan units. We can scale the seating configuration to fit your headcount and preferred layout — banquet rows, round tables, or a mixed networking setup.",
  },
  {
    q: "What's the most popular setup for a company picnic in San Antonio?",
    a: "The most common corporate picnic configuration we see is one or two 13×26 canopy tents, rectangular tables in banquet rows, folding chairs, two evaporative cooler fans, and a margarita or signature drink station. For team-building events, clients often add yard games like cornhole and giant Connect Four.",
  },
  {
    q: "Do you offer recurring account pricing for companies that host multiple events?",
    a: "Yes — if your company hosts events on a recurring basis (quarterly team events, annual picnics, etc.), reach out to discuss an ongoing relationship. We're happy to work with event planners and HR teams who need reliable, professional rental service throughout the year.",
  },
  {
    q: "How do corporate event layouts differ from private parties?",
    a: "Corporate events often require more flexible configurations — networking zones with cocktail tables, presentation or demo areas with extra clearance, and separate breakout areas for different departments. We can accommodate these layouts as long as the square footage is accounted for in the equipment selection.",
  },
  {
    q: "Can you coordinate with our venue or facilities team?",
    a: "Absolutely. We work with facility managers, event coordinators, and HR contacts regularly. Share your venue's access requirements, load-in windows, and any parking or surface constraints when you book, and we'll coordinate delivery timing and setup approach accordingly.",
  },
];

const relatedLinks: RelatedLink[] = [
  { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
  { label: "Tent Rentals", href: "/tent-rentals-san-antonio" },
  { label: "Table & Chair Rentals", href: "/table-chair-rentals-san-antonio" },
  { label: "Evaporative Cooler Rentals", href: "/evaporative-cooler-rentals-san-antonio" },
  { label: "Wedding Rentals", href: "/wedding-rentals-san-antonio" },
];

const layouts = [
  {
    name: "Banquet / Seated Dining",
    desc: "Rectangular tables in rows with chairs. Efficient use of space for 50–150 guests. Common for company picnics and employee appreciation events.",
    best: "Company picnics, holiday parties, employee lunches",
  },
  {
    name: "Networking / Cocktail Style",
    desc: "Cocktail tables scattered throughout the covered area, minimal formal seating. Encourages movement and conversation. Works well for 50–100 attendees.",
    best: "Client receptions, product launches, mixers",
  },
  {
    name: "Hybrid Layout",
    desc: "Combination of seated tables around the perimeter with a cocktail/networking zone in the center. Allows both structured meals and casual mingling.",
    best: "Team-building events, all-hands gatherings, award ceremonies",
  },
];

export default function CorporateEventRentalsSanAntonioPage() {
  return (
    <SeoLandingPage
      h1="Corporate Event Rentals in San Antonio, TX"
      badge="Corporate & Business"
      badgeColor="#00e64d"
      subtitle="Professional outdoor event equipment for company picnics, team-building events, and corporate gatherings across San Antonio. Invoices available. Delivery and setup included."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
        { label: "Corporate Event Rentals San Antonio", href: "/corporate-event-rentals-san-antonio" },
      ]}
      faqs={faqs}
      relatedLinks={relatedLinks}
      calculator="table-chair"
    >
      <section>
        <h2 className="text-2xl font-black text-white mb-4">
          Outdoor Corporate Events in San Antonio Require the Right Infrastructure
        </h2>
        <div className="space-y-4 text-gray-300 text-base leading-relaxed">
          <p>
            San Antonio is home to a large base of corporate employers — USAA, H-E-B, Valero,
            Rackspace, SAWS, and hundreds of mid-size companies — many of which host annual
            picnics, team-building days, client appreciation events, and seasonal gatherings.
            Outdoor events for 50–200 employees require the same fundamentals as any large
            party: shade, seating, airflow, and a drink station.
          </p>
          <p>
            Corporate clients typically have two things that private party clients don't:
            a tighter timeline and a requirement for documentation. We provide itemized invoices
            for all rentals, can work within corporate procurement processes, and are experienced
            at coordinating with HR teams, event planners, and facilities managers who have
            specific load-in windows or venue restrictions.
          </p>
          <p>
            For events scheduled during San Antonio's summer months — which covers most Q2 and Q3
            employee events — shade and cooling are not optional. We strongly recommend combining
            canopy tents with at least two evaporative cooler fans for any event over 50 people
            scheduled between May and September.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-white mb-6">Corporate Event Layout Options</h2>
        <div className="space-y-4">
          {layouts.map((l, i) => (
            <div key={l.name} className="card-dark rounded-2xl p-5 border border-white/8 flex items-start gap-4">
              <span
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
                style={{ background: i % 2 === 0 ? "linear-gradient(135deg,#00e64d,#00b33c)" : "linear-gradient(135deg,#e81ccd,#b5109e)" }}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-black text-white text-sm mb-1">{l.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">{l.desc}</p>
                <p className="text-xs text-gray-600">
                  <span className="text-gray-500 font-semibold">Best for:</span> {l.best}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-white mb-5">What Corporate Clients Typically Need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: <Building2 size={18} className="text-[#00e64d]" />, title: "Canopy Tents", desc: "One or two 13×26 tents side-by-side for larger groups. Full shade coverage for the entire event footprint." },
            { icon: <Users size={18} className="text-[#e81ccd]" />, title: "Scalable Seating", desc: "Rectangular or round tables with full chair sets. We scale to any guest count from 30 to 200+." },
            { icon: <FileText size={18} className="text-[#00e64d]" />, title: "Itemized Invoices", desc: "Line-item billing for corporate accounts payable. W-9 available on request. Net terms discussable for recurring accounts." },
            { icon: <CheckCircle2 size={18} className="text-[#e81ccd]" />, title: "Coordinator-Friendly", desc: "We work with your event planner or HR contact directly. Just share the timeline and access details." },
          ].map((item) => (
            <div key={item.title} className="card-dark rounded-2xl p-5 border border-white/8">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl p-6 border" style={{ background: "#00e64d08", borderColor: "#00e64d30" }}>
        <h3 className="font-black text-white text-sm mb-2">Recurring Corporate Accounts</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          If your company hosts multiple events per year — quarterly team events, annual picnics,
          or client appreciation gatherings — contact us to discuss ongoing pricing and scheduling.
          We work with several San Antonio businesses on a recurring basis and offer priority
          booking and streamlined invoicing for established accounts.
        </p>
      </section>
    </SeoLandingPage>
  );
}
