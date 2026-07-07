import type { Metadata } from "next";
import { Tent, Wind, Users, CheckCircle2 } from "lucide-react";
import SeoLandingPage, { type FAQ, type RelatedLink } from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
  title: "Canopy Tent Rentals in San Antonio, TX | 10x20 & 13x26",
  description:
    "Rent canopy tents in San Antonio from Frozen Bexar. 10×20 and 13×26 pop-up canopy tents delivered and staked at your outdoor event. Beat the Texas heat with professional shade.",
  alternates: { canonical: "https://frozenbexar.com/tent-rentals-san-antonio" },
  openGraph: {
    title: "Canopy Tent Rentals San Antonio | 10x20 & 13x26 | Frozen Bexar",
    description:
      "10×20 and 13×26 canopy tent rentals delivered and set up across San Antonio. Professional shade solutions for outdoor events in the Texas heat.",
    url: "https://frozenbexar.com/tent-rentals-san-antonio",
    images: [{ url: "https://frozenbexar.com/canopy-10x20.jpg", alt: "Canopy Tent Rental San Antonio" }],
  },
};

const faqs: FAQ[] = [
  {
    q: "What size canopy tent do I need for my guest count?",
    a: "As a general rule, plan for 8–10 square feet per seated guest. Our 10×20 tent (200 sq ft) comfortably fits 20–25 seated guests with tables. Our 13×26 tent (338 sq ft) handles 40–50 seated guests. If you also need a buffet table or dance floor under the tent, go up a size.",
  },
  {
    q: "Do I need a permit for a canopy tent in San Antonio?",
    a: "For private residential events, a permit is typically not required for temporary canopy tents under 400 square feet. For events on public property, parks, or commercial spaces, permit requirements vary by location. We recommend confirming with your venue in advance. Our team can advise based on your setup.",
  },
  {
    q: "How well do these tents hold up to San Antonio wind?",
    a: "Our tents are staked and secured into the ground as part of the setup process. They're rated for typical event weather conditions. We do not recommend leaving tents up overnight in forecast conditions above 25–30 mph sustained winds. If a strong storm is in the forecast for your event, we'll discuss options with you ahead of time.",
  },
  {
    q: "Can I add walls and lights to the canopy tent?",
    a: "Yes — canopy side walls and string/LED lights are available as add-ons. Walls are great for privacy, wind blocking, or extending the usable evening hours into cooler temperatures. Lights add atmosphere and allow you to use the tent after sunset.",
  },
  {
    q: "Is delivery and staking included in the tent rental price?",
    a: "Delivery and ground staking are included in the rental. Our team will also level the tent if the ground has a slight slope. If your venue requires weight bags instead of stakes (e.g., concrete patios), please mention that when you request a quote.",
  },
  {
    q: "How much clearance do I need for a 10×20 tent?",
    a: "Plan for roughly 12×22 feet of clear ground space for a 10×20 tent, accounting for stake lines. The peak height is approximately 8–9 feet at center. Make sure there are no low-hanging tree branches, power lines, or fences in the setup area.",
  },
];

const relatedLinks: RelatedLink[] = [
  { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
  { label: "Table & Chair Rentals", href: "/table-chair-rentals-san-antonio" },
  { label: "Evaporative Cooler Rentals", href: "/evaporative-cooler-rentals-san-antonio" },
  { label: "Backyard Party Rentals", href: "/backyard-party-rentals-san-antonio" },
  { label: "View Canopy Products", href: "/products/canopy-10x20" },
];

const sizes = [
  {
    size: "10×20",
    sqft: "200 sq ft",
    guests: "20–25 seated",
    best: "Backyard birthdays, small family gatherings, baby showers",
    price: "$115",
    color: "#00e64d",
  },
  {
    size: "13×26",
    sqft: "338 sq ft",
    guests: "40–50 seated",
    best: "Quinceañeras, graduation parties, receptions, corporate events",
    price: "$190",
    color: "#e81ccd",
  },
];

export default function TentRentalsSanAntonioPage() {
  return (
    <SeoLandingPage
      h1="Canopy Tent Rentals in San Antonio, TX"
      badge="Shade Solutions"
      badgeColor="#00e64d"
      subtitle="Beat the Texas heat with a professionally staked canopy tent. We offer 10×20 and 13×26 pop-up canopies delivered, set up, and secured at your San Antonio event."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
        { label: "Tent Rentals San Antonio", href: "/tent-rentals-san-antonio" },
      ]}
      faqs={faqs}
      relatedLinks={relatedLinks}
      calculator="tent"
    >
      {/* Intro */}
      <section>
        <h2 className="text-2xl font-black text-white mb-4">
          Why Outdoor Events in San Antonio Need a Tent
        </h2>
        <div className="space-y-4 text-gray-300 text-base leading-relaxed">
          <p>
            San Antonio averages over 220 sunny days a year — which sounds great until you're
            planning an outdoor party in July and the heat index hits 105°F. A quality canopy tent
            doesn't just provide shade; it creates a defined event space that keeps guests
            comfortable, protects your buffet table from direct sun, and gives the whole setup a
            professional, intentional feel.
          </p>
          <p>
            Frozen Bexar stocks two canopy sizes to cover most event needs. The 10×20 is ideal for
            intimate gatherings of 20–30 people, while the 13×26 handles larger events up to 60
            guests when paired with the right table and chair configuration. Both are delivered,
            staked, and squared on your property — no assembly required on your end.
          </p>
          <p>
            If you're pairing a tent with evaporative cooler fans, the enclosed space under the
            canopy actually helps the fans work more effectively by concentrating the cooled air
            rather than letting it dissipate into open space.
          </p>
        </div>
      </section>

      {/* Size Comparison */}
      <section>
        <h2 className="text-2xl font-black text-white mb-6">Compare Tent Sizes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sizes.map((s) => (
            <div
              key={s.size}
              className="card-dark rounded-2xl p-6 border"
              style={{ borderColor: `${s.color}30` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Tent size={24} style={{ color: s.color }} />
                <div>
                  <h3 className="font-black text-white text-lg leading-tight">{s.size} Canopy</h3>
                  <p className="text-xs" style={{ color: s.color }}>{s.sqft}</p>
                </div>
                <span
                  className="ml-auto text-sm font-black px-3 py-1 rounded-full"
                  style={{ background: `${s.color}20`, color: s.color }}
                >
                  {s.price}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users size={13} className="text-gray-500 shrink-0" />
                  <span className="text-sm text-gray-300">{s.guests}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-gray-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400 leading-relaxed">{s.best}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          * Prices reflect standard rentals. Bundle pricing available — see{" "}
          <a href="/specials" className="text-[#e81ccd] hover:underline">current specials</a>.
        </p>
      </section>

      {/* Setup Details */}
      <section>
        <h2 className="text-2xl font-black text-white mb-6">What the Setup Process Looks Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Tent size={18} className="text-[#00e64d]" />, title: "Site Assessment", desc: "We confirm the ground is clear and level before staking. Let us know about patio furniture, sprinkler heads, or slopes ahead of time." },
            { icon: <Wind size={18} className="text-[#e81ccd]" />, title: "Staking & Securing", desc: "All four corners are ground-staked. For concrete or pavers, we use weight bags or alternative anchoring — just mention it when booking." },
            { icon: <CheckCircle2 size={18} className="text-[#00e64d]" />, title: "Final Walkthrough", desc: "We check tension, squareness, and clearance before leaving. We'll also walk you through any add-ons like walls or lights." },
          ].map((item) => (
            <div key={item.title} className="card-dark rounded-2xl p-5 border border-white/8">
              <div className="mb-2">{item.icon}</div>
              <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </SeoLandingPage>
  );
}
