import type { Metadata } from "next";
import { CheckCircle2, Truck, MapPin, Star } from "lucide-react";
import SeoLandingPage, { type FAQ, type RelatedLink } from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
  title: "Party Rentals in San Antonio, TX | Tables, Chairs, Tents & More",
  description:
    "Frozen Bexar provides full-service party rentals across San Antonio. Tables, chairs, canopy tents, margarita machines, evaporative cooler fans, and yard games — delivered and set up at your event.",
  alternates: { canonical: "https://frozenbexar.com/party-rentals-san-antonio" },
  openGraph: {
    title: "Party Rentals in San Antonio, TX | Frozen Bexar",
    description:
      "Full-service party rentals delivered and set up across San Antonio. Tables, chairs, canopy tents, margarita machines, cooler fans, and more.",
    url: "https://frozenbexar.com/party-rentals-san-antonio",
    images: [{ url: "https://frozenbexar.com/logo.png", alt: "Frozen Bexar Party Rentals" }],
  },
};

const faqs: FAQ[] = [
  {
    q: "What areas in San Antonio do you serve?",
    a: "We serve all of San Antonio and the greater Bexar County area, including Stone Oak, Alamo Ranch, Medical Center, Downtown, Helotes, Leon Valley, Converse, Universal City, Schertz, Boerne, and more. Delivery fees may vary by distance.",
  },
  {
    q: "Do you deliver and set up the equipment?",
    a: "Yes — delivery and setup are included with most rentals. We coordinate a drop-off window before your event and handle all the heavy lifting so you can focus on the party. Pickup is scheduled after the event.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking 2–3 weeks ahead for most events. For peak graduation season (May–June) or holiday weekends, book 4–6 weeks out. We occasionally have last-minute availability, so it never hurts to call.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Zelle, Venmo, cash, and major credit/debit cards. A deposit is required to hold your date. We'll confirm all payment details when we finalize your quote.",
  },
  {
    q: "Do you offer package deals?",
    a: "Yes — we have pre-built bundles like the 10×20 Canopy Bundle (canopy + 4 table & chair sets for $170) and the 13×26 Canopy Bundle (canopy + 8 sets for $320). We're also happy to build a fully custom quote.",
  },
  {
    q: "What's your most popular rental combination?",
    a: "For San Antonio summer events, the most popular combination is a 10×20 or 13×26 canopy tent paired with two evaporative cooler fans, tables, chairs, and a margarita machine. The fans make a huge difference in heat-heavy months like July and August.",
  },
];

const relatedLinks: RelatedLink[] = [
  { label: "Tent Rentals", href: "/tent-rentals-san-antonio" },
  { label: "Table & Chair Rentals", href: "/table-chair-rentals-san-antonio" },
  { label: "Margarita Machine Rentals", href: "/margarita-machine-rentals-san-antonio" },
  { label: "Evaporative Cooler Rentals", href: "/evaporative-cooler-rentals-san-antonio" },
  { label: "Graduation Party Rentals", href: "/graduation-party-rentals-san-antonio" },
  { label: "Backyard Party Rentals", href: "/backyard-party-rentals-san-antonio" },
  { label: "Browse All Equipment", href: "/products" },
];

const services = [
  {
    icon: <CheckCircle2 size={20} className="text-[#00e64d]" />,
    title: "Full Catalog",
    desc: "Canopy tents, tables, chairs, margarita machines, cooler fans, string lights, linens, and yard games — all from one vendor.",
  },
  {
    icon: <Truck size={20} className="text-[#e81ccd]" />,
    title: "Delivery & Setup Included",
    desc: "We bring everything to your venue, set it up, and return for pickup. You don't move a single folding table.",
  },
  {
    icon: <MapPin size={20} className="text-[#00e64d]" />,
    title: "All of Bexar County",
    desc: "From Alamo Ranch to Stone Oak to Converse, we deliver across San Antonio and the surrounding communities.",
  },
  {
    icon: <Star size={20} className="text-[#e81ccd]" />,
    title: "Events of Any Size",
    desc: "Backyard birthdays to 200-person outdoor receptions — we scale our rentals to fit your headcount and budget.",
  },
];

export default function PartyRentalsSanAntonioPage() {
  return (
    <SeoLandingPage
      h1="San Antonio Party Rentals — Everything You Need for One Great Event"
      badge="San Antonio, TX"
      badgeColor="#e81ccd"
      subtitle="Canopy tents, tables, chairs, margarita machines, evaporative coolers, and more — delivered and set up at your San Antonio event by a local team that knows the city."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
      ]}
      faqs={faqs}
      relatedLinks={relatedLinks}
      calculator="table-chair"
    >
      {/* Intro */}
      <section className="prose-reset">
        <h2 className="text-2xl font-black text-white mb-4">
          San Antonio's Local Party Rental Company
        </h2>
        <div className="space-y-4 text-gray-300 text-base leading-relaxed">
          <p>
            Planning a party in San Antonio comes with a few unique considerations — triple-digit
            summer heat, unpredictable spring winds, and a culture that takes celebrations seriously.
            Frozen Bexar was built for exactly that. We're a locally owned and operated rental
            company serving Bexar County and surrounding communities, and we've set up everything
            from intimate backyard quinceañeras to 200-person outdoor receptions.
          </p>
          <p>
            Our rental catalog covers everything you typically need for a single event: shade
            structure, seating, a drink station, and climate control. Renting from multiple vendors
            means multiple delivery windows and multiple points of failure. With Frozen Bexar, one
            call handles all of it.
          </p>
          <p>
            We don't just drop equipment and drive off. Our team sets up every item, confirms the
            layout with you, and returns for a clean pickup after the event. That includes canopy
            tent staking, table placement, and cooler positioning for maximum airflow.
          </p>
        </div>
      </section>

      {/* Service Grid */}
      <section>
        <h2 className="text-2xl font-black text-white mb-6">What's Included with Every Rental</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s.title} className="card-dark rounded-2xl p-5 border border-white/8">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{s.icon}</div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-2xl font-black text-white mb-6">How Booking Works</h2>
        <ol className="space-y-5">
          {[
            { step: "1", title: "Build your package online", desc: "Use our quote page to select items and quantities. No account required — takes about two minutes." },
            { step: "2", title: "We confirm availability & send a quote", desc: "We'll review your request and follow up within a few hours with a final price and available dates." },
            { step: "3", title: "Secure your date with a deposit", desc: "A deposit holds your reservation. We'll coordinate delivery timing as the event date approaches." },
            { step: "4", title: "We show up, set up, and clean up", desc: "Our team handles the full setup and returns for pickup. You focus on your guests." },
          ].map((item) => (
            <li key={item.step} className="flex items-start gap-4">
              <span
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
                style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
              >
                {item.step}
              </span>
              <div>
                <h3 className="font-bold text-white text-sm mb-0.5">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Service Area */}
      <section className="card-dark rounded-2xl p-6 border border-white/8">
        <h2 className="text-xl font-black text-white mb-3 flex items-center gap-2">
          <MapPin size={18} className="text-[#e81ccd]" />
          San Antonio Service Area
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          We deliver across Bexar County and into several surrounding communities. Current service
          areas include:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "North San Antonio", "South San Antonio", "East San Antonio", "West San Antonio",
            "Stone Oak", "Alamo Ranch", "Medical Center", "Downtown", "Helotes", "Leon Valley",
            "Converse", "Universal City", "Schertz", "Live Oak", "Boerne", "Castroville",
            "Fair Oaks Ranch", "Shavano Park", "Alamo Heights", "Hollywood Park",
          ].map((area) => (
            <span
              key={area}
              className="px-3 py-1 rounded-full text-xs border border-white/10 text-gray-400"
            >
              {area}
            </span>
          ))}
        </div>
      </section>
    </SeoLandingPage>
  );
}
