import type { Metadata } from "next";
import { Snowflake, CheckCircle2, Users, Star } from "lucide-react";
import SeoLandingPage, { type FAQ, type RelatedLink } from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
  title: "Margarita Machine Rentals in San Antonio, TX | Frozen Bexar",
  description:
    "Rent a frozen margarita machine in San Antonio from Frozen Bexar. Commercial-grade machines with mix, cups, salt rimmer, and bar table included. Perfect for any outdoor event.",
  alternates: { canonical: "https://frozenbexar.com/margarita-machine-rentals-san-antonio" },
  openGraph: {
    title: "Margarita Machine Rentals San Antonio | Frozen Bexar",
    description:
      "Commercial frozen margarita machines delivered to your San Antonio event. Mix, cups, salt rimmer, and full bar setup included. Dual flavor available.",
    url: "https://frozenbexar.com/margarita-machine-rentals-san-antonio",
    images: [{ url: "https://frozenbexar.com/margarita-machine.jpg", alt: "Margarita Machine Rental San Antonio" }],
  },
};

const faqs: FAQ[] = [
  {
    q: "How many servings does the margarita machine make?",
    a: "Each tank of our commercial machine produces approximately 110 servings of classic lime margarita. The rental includes one full tank of mix. For larger events or longer parties (4+ hours), we recommend booking an additional tank of mix, which is available as an add-on.",
  },
  {
    q: "What's included in the margarita machine rental?",
    a: "The rental includes the machine itself, one tank of classic lime margarita mix (110 servings), 50 cups, straws, a salt rimmer, and a 6ft folding bar setup table. Delivery, setup, and operational walkthrough are also included.",
  },
  {
    q: "What flavors are available?",
    a: "Classic lime is our standard flavor and what most San Antonio events request. We also offer a dual-flavor setup where the machine runs two tanks simultaneously — typically lime and a fruit flavor like strawberry or mango. Ask about current flavor availability when you request your quote.",
  },
  {
    q: "Can the machine be used outdoors?",
    a: "Yes — our machines are designed for outdoor event use and are routinely deployed under canopy tents across San Antonio. We recommend placing the machine in a shaded area (under a canopy is ideal) and ensuring a standard 110V grounded outlet is within 25 feet of the setup location.",
  },
  {
    q: "Do I need to provide alcohol, or is it included?",
    a: "The mix included in the rental does not contain alcohol — it's a pre-mix concentrate that you add your own tequila to. This keeps us compliant with TABC regulations and gives you full control over the alcohol content. We'll provide recommended ratios during setup.",
  },
  {
    q: "How early does the machine need to arrive before guests?",
    a: "We recommend scheduling delivery 60–90 minutes before your first guests arrive. The machine needs about 45–60 minutes to reach optimal slush consistency. We'll walk you through operation and confirm everything is working before we leave.",
  },
];

const relatedLinks: RelatedLink[] = [
  { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
  { label: "Tent Rentals", href: "/tent-rentals-san-antonio" },
  { label: "Evaporative Cooler Rentals", href: "/evaporative-cooler-rentals-san-antonio" },
  { label: "Backyard Party Rentals", href: "/backyard-party-rentals-san-antonio" },
  { label: "View Margarita Machine", href: "/products/margarita" },
];

const whatsIncluded = [
  { item: "Commercial frozen margarita machine", note: "Double-barrel dual-flavor capable" },
  { item: "110 servings of classic lime mix", note: "One full tank included" },
  { item: "50 cups + straws", note: "Standard margarita cups" },
  { item: "Salt rimmer", note: "Kosher salt included" },
  { item: "6ft bar setup table", note: "Dedicated bar station" },
  { item: "Delivery, setup & walkthrough", note: "Full operational instruction" },
];

export default function MargaritaMachineRentalsSanAntonioPage() {
  return (
    <SeoLandingPage
      h1="Margarita Machine Rentals in San Antonio, TX"
      badge="Most Popular Rental"
      badgeColor="#00e64d"
      subtitle="Commercial-grade frozen margarita machines delivered and set up at your San Antonio event. 110 servings of lime mix, 50 cups, salt rimmer, and a bar table — all included."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
        { label: "Margarita Machine Rentals San Antonio", href: "/margarita-machine-rentals-san-antonio" },
      ]}
      faqs={faqs}
      relatedLinks={relatedLinks}
    >
      {/* Intro */}
      <section>
        <h2 className="text-2xl font-black text-white mb-4">
          San Antonio and Frozen Margaritas — A Perfect Match
        </h2>
        <div className="space-y-4 text-gray-300 text-base leading-relaxed">
          <p>
            If there's one rental that defines a San Antonio outdoor event, it's the margarita
            machine. From quinceañeras in Alamo Ranch to birthday parties in Stone Oak, a
            commercial frozen margarita machine transforms any backyard into a proper fiesta.
            It's also one of the most practical rentals during summer months, when guests need
            something cold in their hands within minutes of arriving.
          </p>
          <p>
            Our machine is a commercial double-barrel unit rated for continuous all-day operation.
            It's not the residential countertop blender you might have seen at big-box stores —
            this is the same class of equipment used at events and catered venues, capable of
            holding multiple gallons per tank and keeping drinks at the ideal slush consistency
            for hours without manual attention.
          </p>
          <p>
            The mix we include is a concentrate — you add your own tequila (and we'll walk you
            through the ratios). This keeps everything TABC-compliant on our end and gives you
            full control over the strength of each pour.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section>
        <h2 className="text-2xl font-black text-white mb-6">Everything That Comes With the Rental</h2>
        <div className="card-dark rounded-2xl border border-white/8 overflow-hidden">
          <div className="divide-y divide-white/5">
            {whatsIncluded.map((w) => (
              <div key={w.item} className="flex items-center gap-4 px-5 py-4">
                <CheckCircle2 size={16} className="text-[#00e64d] shrink-0" />
                <div className="flex-1">
                  <span className="text-white text-sm font-semibold">{w.item}</span>
                </div>
                <span className="text-xs text-gray-500 text-right">{w.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serving Guide */}
      <section>
        <h2 className="text-2xl font-black text-white mb-5">How Much Mix Do You Need?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { guests: "Up to 40", tanks: "1 tank", note: "Included with rental", color: "#00e64d" },
            { guests: "40–80", tanks: "2 tanks", note: "1 add-on tank recommended", color: "#e81ccd" },
            { guests: "80–120+", tanks: "3 tanks", note: "2 add-on tanks recommended", color: "#00e64d" },
          ].map((row) => (
            <div
              key={row.guests}
              className="card-dark rounded-2xl p-5 border text-center"
              style={{ borderColor: `${row.color}25` }}
            >
              <Users size={20} style={{ color: row.color }} className="mx-auto mb-2" />
              <p className="text-white font-black text-lg mb-0.5">{row.guests}</p>
              <p className="text-xs text-gray-500 mb-2">guests</p>
              <p className="font-bold text-sm mb-1" style={{ color: row.color }}>{row.tanks}</p>
              <p className="text-xs text-gray-500">{row.note}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Estimates based on 2–3 drinks per guest over a 3-hour event. Adjust for event length and guest preferences.
        </p>
      </section>

      {/* Pairing Tip */}
      <section
        className="rounded-2xl p-6 border"
        style={{ background: "#00e64d08", borderColor: "#00e64d30" }}
      >
        <div className="flex items-start gap-3">
          <Star size={18} className="text-[#00e64d] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-black text-white text-sm mb-1">Pro Tip: Pair With a Canopy & Cooler Fans</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The most popular setup in San Antonio is a margarita machine under a{" "}
              <a href="/tent-rentals-san-antonio" className="text-[#00e64d] hover:underline">canopy tent</a>{" "}
              with one or two{" "}
              <a href="/evaporative-cooler-rentals-san-antonio" className="text-[#00e64d] hover:underline">evaporative cooler fans</a>{" "}
              positioned nearby. The shade keeps the machine from overheating, and the fans keep
              guests comfortable enough to actually linger and enjoy the bar.
            </p>
          </div>
        </div>
      </section>
    </SeoLandingPage>
  );
}
