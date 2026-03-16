import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star, Users, Truck, Shield } from "lucide-react";

const values = [
  {
    icon: <Heart size={28} className="text-[#e81ccd]" />,
    title: "Community First",
    desc: "We're proud to be a local San Antonio business. Every event we serve strengthens our community.",
  },
  {
    icon: <Shield size={28} className="text-[#00e64d]" />,
    title: "Quality You Can Trust",
    desc: "All our equipment is cleaned, inspected, and maintained before every rental.",
  },
  {
    icon: <Truck size={28} className="text-[#e81ccd]" />,
    title: "Delivery & Setup",
    desc: "We deliver, set up, and break down — so you can focus on having a great time.",
  },
  {
    icon: <Users size={28} className="text-[#00e64d]" />,
    title: "Events for Everyone",
    desc: "Quinceañeras, birthdays, weddings, graduations, corporate events — we do it all.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#e81ccd]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00e64d]/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#00e64d]/10 border border-[#00e64d]/30 rounded-full px-4 py-1.5 mb-6">
            <MapPin size={12} className="text-[#00e64d]" />
            <span className="text-[#00e64d] text-xs font-bold tracking-widest uppercase">
              San Antonio, Texas
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black mb-6">
            About{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#e81ccd,#ff6ef7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Frozen Bexar
            </span>
          </h1>
          <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto">
            We started with a simple idea: every San Antonio family deserves a stress-free, unforgettable party without breaking the bank.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#e81ccd]/20 to-[#00e64d]/20 blur-xl" />
              <Image
                src="/logo.png"
                alt="Frozen Bexar"
                width={400}
                height={400}
                className="relative object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-6">
              Our{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#00e64d,#a8ff78)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Story
              </span>
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Frozen Bexar was born right here in San Antonio — named after the great Bexar County that we&apos;re proud to call home. We saw a need for a reliable, affordable, and fun party rental company that truly understands what it means to celebrate in South Texas style.
              </p>
              <p>
                Whether it&apos;s a quinceañera, a backyard birthday bash, a corporate cookout, or a neighborhood block party, we show up with everything you need: slushy margarita machines, spacious 10×20 canopies, tables, chairs, tablecloths, and dazzling canopy lights.
              </p>
              <p>
                We believe every event deserves the royal treatment — and that starts with equipment that&apos;s clean, stylish, and delivered on time by people who actually care.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} className="text-[#f5e642] fill-[#f5e642]" />
                ))}
              </div>
              <span className="text-gray-400 text-sm">Loved by hundreds of San Antonio families</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">
              What We{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#e81ccd,#ff6ef7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Stand For
              </span>
            </h2>
            <p className="text-gray-400">Our core values guide every event we serve.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="card-dark rounded-2xl p-6 text-center hover:border-[#e81ccd]/50 transition-all hover:scale-[1.02]"
              >
                <div className="flex justify-center mb-4">{v.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-4">
            <span
              style={{
                background: "linear-gradient(135deg,#00e64d,#a8ff78)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Where We Serve
            </span>
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
            We primarily serve San Antonio and all of Bexar County, including surrounding cities. Not sure if we deliver to your area? Just reach out — we love a road trip for a good party!
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              "San Antonio",
              "Leon Valley",
              "Converse",
              "Universal City",
              "Schertz",
              "Helotes",
              "Kirby",
              "Selma",
              "Live Oak",
              "Windcrest",
            ].map((city) => (
              <span
                key={city}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-[#e81ccd]/30 text-[#e81ccd] bg-[#e81ccd]/5"
              >
                {city}
              </span>
            ))}
          </div>
          <Link
            href="/booking"
            className="inline-block px-8 py-4 rounded-full font-bold uppercase tracking-wide text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
          >
            Check Availability
          </Link>
        </div>
      </section>
    </>
  );
}
