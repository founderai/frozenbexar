import type { Metadata } from "next";
import { Home, Ruler, CheckCircle2, Wind } from "lucide-react";
import SeoLandingPage, { type FAQ, type RelatedLink } from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
  title: "Backyard Party Rentals in San Antonio, TX | Frozen Bexar",
  description:
    "Transform your San Antonio backyard into the perfect event space. Canopy tents, tables, chairs, margarita machines, and cooling fans — delivered and set up at your home.",
  alternates: { canonical: "https://frozenbexar.com/backyard-party-rentals-san-antonio" },
  openGraph: {
    title: "Backyard Party Rentals San Antonio | Frozen Bexar",
    description:
      "Backyard event rentals delivered across San Antonio. Canopy tents, tables, chairs, margarita machines, and cooler fans — we set everything up and clean everything up.",
    url: "https://frozenbexar.com/backyard-party-rentals-san-antonio",
    images: [{ url: "https://frozenbexar.com/canopy-10x20.jpg", alt: "Backyard Party Rentals San Antonio" }],
  },
};

const faqs: FAQ[] = [
  {
    q: "What do I absolutely need for a backyard party in San Antonio summer?",
    a: "In summer, shade and airflow are non-negotiable. A canopy tent provides the shade; evaporative cooler fans provide the airflow. Without both, guests will start heading inside within 30–45 minutes once the afternoon heat sets in. Tables, chairs, and a margarita machine round out the full experience.",
  },
  {
    q: "How do I know if my backyard is big enough for a canopy tent?",
    a: "For a 10×20 tent, you need approximately 12×22 feet of clear, flat ground — slightly larger than a standard two-car garage. For a 13×26 tent, plan for 15×28 feet. If your yard has a patio, a side yard, or a lawn area in that range, it likely works. Send us photos or a rough measurement and we'll confirm before booking.",
  },
  {
    q: "Can you set up on a concrete patio or artificial turf?",
    a: "Yes — for hard surfaces like concrete, pavers, or artificial turf, we use weight bags instead of stakes. The setup process is the same; the anchoring method changes. Let us know the surface type when you request a quote so we can bring the right equipment.",
  },
  {
    q: "Do I need to move existing patio furniture before you arrive?",
    a: "We recommend clearing the setup area before our team arrives. This includes patio furniture, potted plants, kids' toys, and anything within the tent footprint. The setup typically takes 45–90 minutes, and having a clear area speeds things up significantly.",
  },
  {
    q: "What's the noise ordinance situation in San Antonio for backyard events?",
    a: "San Antonio's noise ordinance generally prohibits amplified sound at levels above 85 dB after 10 PM in residential areas. For most backyard parties, this mainly applies to music and speakers rather than rental equipment. City code enforcement is complaint-driven, so good neighbor communication goes a long way.",
  },
  {
    q: "How do you handle pickup after the party?",
    a: "We schedule a pickup window with you at the time of booking — usually the next morning or the evening of the event, depending on your preference. Our team breaks down and loads everything. You don't need to disassemble, fold, or store anything.",
  },
];

const relatedLinks: RelatedLink[] = [
  { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
  { label: "Tent Rentals", href: "/tent-rentals-san-antonio" },
  { label: "Table & Chair Rentals", href: "/table-chair-rentals-san-antonio" },
  { label: "Evaporative Cooler Rentals", href: "/evaporative-cooler-rentals-san-antonio" },
  { label: "Graduation Party Rentals", href: "/graduation-party-rentals-san-antonio" },
];

export default function BackyardPartyRentalsSanAntonioPage() {
  return (
    <SeoLandingPage
      h1="Backyard Party Rentals in San Antonio, TX"
      badge="Home Events"
      badgeColor="#00e64d"
      subtitle="Your backyard is the venue — we bring the equipment. Canopy tents, tables, chairs, margarita machines, and cooler fans delivered and set up at your San Antonio home."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
        { label: "Backyard Party Rentals San Antonio", href: "/backyard-party-rentals-san-antonio" },
      ]}
      faqs={faqs}
      relatedLinks={relatedLinks}
      calculator="tent"
    >
      {/* Intro */}
      <section>
        <h2 className="text-2xl font-black text-white mb-4">
          San Antonio Backyards Can Host Great Events — With the Right Setup
        </h2>
        <div className="space-y-4 text-gray-300 text-base leading-relaxed">
          <p>
            Hosting at home is the most personal way to celebrate. No venue fees, no catering
            minimums, no cutoff time. But a San Antonio backyard in May or August without proper
            shade and airflow is a recipe for a short party. The rental equipment you choose
            determines whether guests stay for three hours or thirty minutes.
          </p>
          <p>
            We've set up events in backyards all across San Antonio — from narrow urban lots in
            Alamo Heights to sprawling properties in Helotes. The most common question we get is
            whether a yard is "big enough." The answer is usually yes — a 10×20 canopy needs about
            the same footprint as a two-car parking space. If you have that, you have a party.
          </p>
          <p>
            One practical tip we always share: identify where your outdoor outlet is before we
            arrive. If you're adding a margarita machine and cooler fans, you'll need access to
            a standard 110V outlet — most San Antonio homes have one near the back patio or
            garage side. Extension cords are fine; just let us know if the run is over 25 feet
            so we can bring the right gauge.
          </p>
        </div>
      </section>

      {/* Package Suggestions */}
      <section>
        <h2 className="text-2xl font-black text-white mb-6">Common Backyard Party Configurations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              title: "The Essentials",
              guests: "20–30 guests",
              items: ["10×20 Canopy Tent", "4 Rectangular Tables", "25–30 Chairs", "1 Cooler Fan"],
              price: "From ~$260",
              color: "#00e64d",
            },
            {
              title: "The Full Setup",
              guests: "50–75 guests",
              items: ["13×26 Canopy Tent", "8 Rectangular Tables", "60–75 Chairs", "2 Cooler Fans", "Margarita Machine", "Black Linens"],
              price: "From ~$540",
              color: "#e81ccd",
            },
          ].map((pkg) => (
            <div
              key={pkg.title}
              className="card-dark rounded-2xl p-6 border"
              style={{ borderColor: `${pkg.color}30` }}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-black text-white text-base">{pkg.title}</h3>
                <span className="text-xs font-bold" style={{ color: pkg.color }}>{pkg.price}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">{pkg.guests}</p>
              <ul className="space-y-2">
                {pkg.items.map((item) => (
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
          Prices are estimates. Final quotes depend on delivery distance and any add-ons. Build your exact package on our{" "}
          <a href="/quote" className="text-[#e81ccd] hover:underline">quote page</a>.
        </p>
      </section>

      {/* Setup Checklist */}
      <section>
        <h2 className="text-2xl font-black text-white mb-5">Before We Arrive — Quick Checklist</h2>
        <div className="space-y-3">
          {[
            { icon: <Ruler size={15} className="text-[#00e64d]" />, text: "Measure your backyard — confirm you have 12×22 ft clear for a 10×20 tent, or 15×28 ft for a 13×26 tent" },
            { icon: <Home size={15} className="text-[#e81ccd]" />, text: "Clear the setup area of furniture, toys, grills, and anything within the tent footprint" },
            { icon: <Wind size={15} className="text-[#00e64d]" />, text: "Locate your outdoor electrical outlet — note if it's on a GFCI circuit (they sometimes trip under load)" },
            { icon: <CheckCircle2 size={15} className="text-[#e81ccd]" />, text: "Let us know about any tight gate widths, low overhangs, or surfaces that aren't grass" },
            { icon: <CheckCircle2 size={15} className="text-[#00e64d]" />, text: "Have a point of contact available during our delivery window to confirm the layout" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 card-dark rounded-xl p-4 border border-white/8">
              <div className="mt-0.5 shrink-0">{item.icon}</div>
              <p className="text-sm text-gray-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </SeoLandingPage>
  );
}
