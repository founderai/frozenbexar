import type { Metadata } from "next";
import { GraduationCap, Calendar, CheckCircle2, Star } from "lucide-react";
import SeoLandingPage, { type FAQ, type RelatedLink } from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
  title: "Graduation Party Rentals in San Antonio, TX | Frozen Bexar",
  description:
    "Celebrate graduation day right with party rentals from Frozen Bexar. Canopy tents, tables, chairs, margarita machines, and cooler fans — serving San Antonio ISD families since day one.",
  alternates: { canonical: "https://frozenbexar.com/graduation-party-rentals-san-antonio" },
  openGraph: {
    title: "Graduation Party Rentals San Antonio | Frozen Bexar",
    description:
      "Graduation season party rentals in San Antonio. Tents, tables, chairs, margarita machines, and cooler fans for class of 2025 celebrations across NEISD, NISD, SAISD, and more.",
    url: "https://frozenbexar.com/graduation-party-rentals-san-antonio",
    images: [{ url: "https://frozenbexar.com/logo.png", alt: "Graduation Party Rentals San Antonio" }],
  },
};

const faqs: FAQ[] = [
  {
    q: "When should I book graduation party rentals in San Antonio?",
    a: "Graduation season (May–June) is our busiest time of year. We recommend booking 4–6 weeks in advance — ideally as soon as you have a confirmed graduation date. Weekends in late May and early June fill up fast across all San Antonio ISDs. Don't wait until two weeks before.",
  },
  {
    q: "What's a typical graduation party rental setup for 50–75 guests?",
    a: "A popular setup for a mid-size graduation party includes: one 13×26 canopy tent, 8–10 rectangular tables, 60–80 chairs, two evaporative cooler fans, a margarita machine, and black linens. This covers the full outdoor party area with shade, seating, drinks, and climate control. Total cost typically ranges from $450–$650 depending on add-ons.",
  },
  {
    q: "Which San Antonio school districts do you serve?",
    a: "We serve graduation parties across all San Antonio ISD boundaries, including NEISD (North East ISD), NISD (Northside ISD), SAISD (San Antonio ISD), EISD (Edgewood ISD), SWISD (Southwest ISD), TISD (Taft ISD), Judson ISD, and more. We deliver throughout Bexar County.",
  },
  {
    q: "Can I book a margarita machine for a graduation party?",
    a: "Absolutely. Margarita machines are one of our most popular add-ons for graduation parties — for the adults in attendance. The mix we provide is alcohol-free concentrate; you supply the tequila. This keeps everything TABC-compliant and lets you control the bar setup on your end.",
  },
  {
    q: "What if graduation gets rescheduled due to weather?",
    a: "We understand that outdoor graduation ceremonies sometimes shift dates. If your event date changes due to school schedule changes, contact us as soon as possible and we'll do our best to accommodate a reschedule based on availability. Deposits may be transferable to a new date.",
  },
  {
    q: "Can you handle multiple graduation setups on the same weekend?",
    a: "Yes — we regularly service multiple graduation events on the same weekend. Book early to ensure your preferred delivery window is available. We schedule deliveries throughout the day and coordinate timing carefully during peak season.",
  },
];

const relatedLinks: RelatedLink[] = [
  { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
  { label: "Tent Rentals", href: "/tent-rentals-san-antonio" },
  { label: "Table & Chair Rentals", href: "/table-chair-rentals-san-antonio" },
  { label: "Margarita Machine Rentals", href: "/margarita-machine-rentals-san-antonio" },
  { label: "Evaporative Cooler Rentals", href: "/evaporative-cooler-rentals-san-antonio" },
  { label: "Backyard Party Rentals", href: "/backyard-party-rentals-san-antonio" },
];

const timeline = [
  { when: "6 weeks out", action: "Confirm graduation date and ceremony time with the school", tip: "ISD dates are usually announced by March" },
  { when: "4–5 weeks out", action: "Book your rental equipment and lock in your date", tip: "Peak demand: late May & early June weekends" },
  { when: "2 weeks out", action: "Confirm guest count and finalize table/chair quantities", tip: "Add a 10% buffer for last-minute RSVPs" },
  { when: "1 week out", action: "Confirm delivery window and venue access details with us", tip: "Let us know about gate codes, parking, or tight driveways" },
  { when: "Day before", action: "Clear the setup area and mark where you want tables positioned", tip: "Takes 15 minutes — saves confusion during setup" },
  { when: "Day of", action: "Greet our team, confirm the layout, and get ready to celebrate", tip: "Setup typically takes 45–90 minutes" },
];

export default function GraduationPartyRentalsSanAntonioPage() {
  return (
    <SeoLandingPage
      h1="Graduation Party Rentals in San Antonio, TX"
      badge="Graduation Season"
      badgeColor="#e81ccd"
      subtitle="Celebrate your graduate in style. Canopy tents, tables, chairs, margarita machines, and evaporative cooler fans for graduation parties across all San Antonio school districts."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Party Rentals San Antonio", href: "/party-rentals-san-antonio" },
        { label: "Graduation Party Rentals San Antonio", href: "/graduation-party-rentals-san-antonio" },
      ]}
      faqs={faqs}
      relatedLinks={relatedLinks}
      calculator="table-chair"
    >
      {/* Intro */}
      <section>
        <h2 className="text-2xl font-black text-white mb-4">
          Graduation Season Is San Antonio's Biggest Party Weekend — Plan Ahead
        </h2>
        <div className="space-y-4 text-gray-300 text-base leading-relaxed">
          <p>
            San Antonio is home to some of the largest school districts in Texas. NEISD,
            Northside ISD, SAISD, Judson, and a dozen other districts all hold ceremonies
            in May and June — which means tens of thousands of families are planning graduation
            parties simultaneously. Rental equipment books up fast, especially for late May
            and early June weekends.
          </p>
          <p>
            A graduation party in San Antonio in May or June presents a specific challenge:
            the heat. Afternoon temperatures regularly hit 95–100°F, which means shade and
            airflow aren't optional — they're the difference between a memorable celebration
            and guests leaving after 20 minutes. The most successful graduation setups we
            see pair a canopy tent with at least one evaporative cooler fan.
          </p>
          <p>
            We've handled graduation parties ranging from intimate 20-person family gatherings
            to 150-person block events. Whether you're set up in a backyard in Helotes or a
            community space in Converse, we can build a rental package that fits the space
            and the guest count.
          </p>
        </div>
      </section>

      {/* Popular Setup */}
      <section
        className="rounded-2xl p-6 border"
        style={{ background: "#e81ccd08", borderColor: "#e81ccd30" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Star size={16} className="text-[#e81ccd]" />
          <h2 className="text-lg font-black text-white">Most Popular Graduation Setup (50–75 Guests)</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "13×26 Canopy Tent — shade for the whole party",
            "8–10 Rectangular Tables — banquet and buffet seating",
            "60–75 Folding Chairs — full seating for every guest",
            "2 Evaporative Cooler Fans — essential for May/June heat",
            "Margarita Machine — for the adults celebrating too",
            "Black Linens — polished look on all tables",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-[#e81ccd] shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-2xl font-black text-white mb-6">Graduation Party Planning Timeline</h2>
        <ol className="space-y-4">
          {timeline.map((t) => (
            <li key={t.when} className="flex items-start gap-4">
              <span
                className="shrink-0 px-3 py-1 rounded-full text-xs font-black text-white whitespace-nowrap"
                style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
              >
                {t.when}
              </span>
              <div>
                <p className="font-bold text-white text-sm">{t.action}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.tip}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ISDs */}
      <section className="card-dark rounded-2xl p-6 border border-white/8">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap size={18} className="text-[#e81ccd]" />
          <h2 className="text-lg font-black text-white">San Antonio School Districts We Serve</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "NEISD — North East ISD",
            "NISD — Northside ISD",
            "SAISD — San Antonio ISD",
            "EISD — Edgewood ISD",
            "SWISD — Southwest ISD",
            "Judson ISD",
            "Harlandale ISD",
            "South San ISD",
            "East Central ISD",
            "Somerset ISD",
            "Southside ISD",
          ].map((d) => (
            <span key={d} className="px-3 py-1 rounded-full text-xs border border-white/10 text-gray-400">
              {d}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3 flex items-center gap-1.5">
          <Calendar size={11} />
          Most graduations occur late May through mid-June. Book early!
        </p>
      </section>
    </SeoLandingPage>
  );
}
