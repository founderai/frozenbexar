import type { Metadata } from "next";
import { Heart, CheckCircle2, Star, Clock } from "lucide-react";
import SeoLandingPage, { type FAQ, type RelatedLink } from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
  title: "Wedding Rentals in San Antonio, TX | Tables, Chairs, Tents | Frozen Bexar",
  description:
    "Wedding rental equipment in San Antonio — round tables, folding chairs, canopy tents, linens, string lights, and margarita machines. Delivered and set up for your ceremony or reception.",
  alternates: { canonical: "https://frozenbexar.com/wedding-rentals-san-antonio" },
  openGraph: {
    title: "Wedding Rentals San Antonio | Frozen Bexar",
    description:
      "Tables, chairs, canopy tents, linens, and margarita machines for San Antonio weddings. Full delivery and setup included. Serving outdoor ceremonies and receptions across Bexar County.",
    url: "https://frozenbexar.com/wedding-rentals-san-antonio",
    images: [{ url: "https://frozenbexar.com/logo.png", alt: "Wedding Rentals San Antonio" }],
  },
};

const faqs: FAQ[] = [
  {
    q: "When is San Antonio's best weather for an outdoor wedding?",
    a: "San Antonio's most pleasant outdoor wedding weather falls in March–April and October–November. Spring offers mild temperatures in the 70s–80s, while fall brings cooler evenings after the summer heat breaks. Summer weddings (May–August) are absolutely doable with proper tent shade and evaporative cooler fans — many couples prefer the longer evening daylight. December–February can be unpredictable with cold fronts.",
  },
  {
    q: "How many round tables do I need for a 100-person wedding reception?",
    a: "For a seated reception at 60-inch round tables (which seat 8–10 guests comfortably), plan for 11–13 tables. We recommend adding 2 extras for a head or sweetheart table, gift/card table, and cake display. A full seating plan for 100 guests typically uses 13–15 tables total.",
  },
  {
    q: "Do you provide linens for wedding tables?",
    a: "We carry black linens that fit rectangular, round, and cocktail tables. For weddings requiring specialty colors — ivory, champagne, white, blush — we recommend a dedicated linen rental company that offers a broader color palette. We're happy to coordinate delivery timing with another vendor.",
  },
  {
    q: "Can you work with our wedding venue or event coordinator?",
    a: "Yes — we work with event coordinators and venue managers regularly. If your venue has a specific delivery window, load-in access, or setup requirements, share those details when you request a quote and we'll coordinate accordingly. We've set up at properties across Bexar County and adapt to each venue's constraints.",
  },
  {
    q: "What's the difference between a cocktail hour setup and a reception setup?",
    a: "A cocktail hour setup is typically lighter — cocktail tables, a bar station, and some seating around the perimeter for guests who need it. A reception setup is the full layout: round or rectangular tables with full seating, a head or sweetheart table, a dance floor clearance, buffet tables, and a dedicated cake/gift station. Many weddings rent from us for both phases simultaneously.",
  },
  {
    q: "How far in advance should I book for a wedding?",
    a: "For weddings, we recommend booking 6–8 weeks in advance, and even earlier for popular spring and fall wedding weekends. Saturday bookings in April, October, and November tend to fill up quickly. A deposit is required to hold your date. We'll confirm equipment availability and coordinate a day-of timeline with you as the date approaches.",
  },
];

const relatedLinks: RelatedLink[] = [
  { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
  { label: "Tent Rentals", href: "/tent-rentals-san-antonio" },
  { label: "Table & Chair Rentals", href: "/table-chair-rentals-san-antonio" },
  { label: "Margarita Machine Rentals", href: "/margarita-machine-rentals-san-antonio" },
  { label: "Corporate Event Rentals", href: "/corporate-event-rentals-san-antonio" },
];

const weddingLayouts = [
  {
    name: "Intimate Ceremony (30–50 guests)",
    items: ["10×20 Canopy Tent", "5–6 Round Tables", "40–50 Chairs", "2 Cocktail Tables", "1 Cooler Fan", "Black Linens"],
    price: "From ~$320",
    color: "#e81ccd",
  },
  {
    name: "Full Reception (75–120 guests)",
    items: ["13×26 Canopy Tent", "12–14 Round Tables", "90–120 Chairs", "4 Cocktail Tables", "2 Cooler Fans", "Margarita Machine", "String Lights", "Black Linens"],
    price: "From ~$700",
    color: "#00e64d",
  },
];

export default function WeddingRentalsSanAntonioPage() {
  return (
    <SeoLandingPage
      h1="Wedding Rentals in San Antonio, TX"
      badge="Weddings & Receptions"
      badgeColor="#e81ccd"
      subtitle="Round tables, folding chairs, canopy tents, cocktail tables, string lights, linens, and margarita machines for San Antonio weddings — delivered, set up, and picked up by our team."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
        { label: "Wedding Rentals San Antonio", href: "/wedding-rentals-san-antonio" },
      ]}
      faqs={faqs}
      relatedLinks={relatedLinks}
      calculator="table-chair"
    >
      <section>
        <h2 className="text-2xl font-black text-white mb-4">
          Outdoor Weddings in San Antonio — What the Setup Actually Involves
        </h2>
        <div className="space-y-4 text-gray-300 text-base leading-relaxed">
          <p>
            San Antonio has a strong outdoor wedding culture. From Hill Country-edge properties
            in Helotes to historic neighborhoods in Alamo Heights, couples regularly choose
            private venues, ranches, backyards, and family-owned properties for ceremonies and
            receptions. That flexibility often means building the event infrastructure from scratch —
            which is where rental equipment becomes essential.
          </p>
          <p>
            The most common request we see for outdoor weddings is a canopy tent with round tables
            and folding chairs — the classic reception layout. Round tables encourage conversation,
            look elegant under tent lighting, and make seating charts easier to visualize. We pair
            those with black linens for a clean, polished finish that works with most wedding color
            palettes.
          </p>
          <p>
            For San Antonio summer or early fall weddings, evaporative cooler fans are almost
            always part of the setup. Two fans positioned on opposing ends of a 13×26 canopy make
            a meaningful difference in comfort, especially for guests in formal attire. String
            lights complete the atmosphere as the evening light fades.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-white mb-6">Common Wedding Rental Configurations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {weddingLayouts.map((pkg) => (
            <div key={pkg.name} className="card-dark rounded-2xl p-6 border" style={{ borderColor: `${pkg.color}30` }}>
              <div className="flex items-start justify-between gap-2 mb-4">
                <h3 className="font-black text-white text-sm leading-snug">{pkg.name}</h3>
                <span className="text-xs font-bold shrink-0" style={{ color: pkg.color }}>{pkg.price}</span>
              </div>
              <ul className="space-y-2">
                {pkg.items.map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={13} style={{ color: pkg.color }} className="shrink-0" />
                    <span className="text-sm text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Estimates only. Final quotes depend on delivery distance, add-ons, and current availability.
          <a href="/quote" className="text-[#e81ccd] hover:underline ml-1">Build your exact package →</a>
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-black text-white mb-5">Wedding Rental Checklist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { cat: "Ceremony", items: ["Chairs for all guests", "Aisle runner if needed", "Arch or backdrop (external vendor)", "Shade tent if outdoor ceremony"] },
            { cat: "Cocktail Hour", items: ["Cocktail tables (4–6 for 100 guests)", "Perimeter chairs for elderly guests", "Bar setup table", "Margarita or signature drink station"] },
            { cat: "Reception", items: ["Round tables (full seating)", "Chairs for all guests", "Head/sweetheart table", "Buffet tables + linens", "Cake/gift table", "Dance floor clearance zone"] },
            { cat: "Comfort", items: ["Canopy tent (ceremony + reception)", "Evaporative cooler fans", "String or LED lighting", "Side walls if evening gets cool"] },
          ].map((section) => (
            <div key={section.cat} className="card-dark rounded-2xl p-5 border border-white/8">
              <div className="flex items-center gap-2 mb-3">
                <Heart size={14} className="text-[#e81ccd]" />
                <h3 className="font-bold text-white text-sm">{section.cat}</h3>
              </div>
              <ul className="space-y-1.5">
                {section.items.map(i => (
                  <li key={i} className="flex items-start gap-2">
                    <Star size={10} className="text-gray-600 shrink-0 mt-1" />
                    <span className="text-xs text-gray-400">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl p-6 border" style={{ background: "#e81ccd08", borderColor: "#e81ccd30" }}>
        <div className="flex items-start gap-3">
          <Clock size={18} className="text-[#e81ccd] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-black text-white text-sm mb-1">Wedding Booking Timeline</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Book 6–8 weeks in advance for spring/fall Saturdays. We work directly with your
              coordinator and can accommodate most venue load-in windows.
              Popular months fill quickly — especially April, October, and November in San Antonio.
            </p>
          </div>
        </div>
      </section>
    </SeoLandingPage>
  );
}
