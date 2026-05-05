import Image from "next/image";
import Link from "next/link";
import { Star, Snowflake, PartyPopper, Tent, Table, Sparkles, UtensilsCrossed, CheckCircle2, Wind, Quote, Layers2 } from "lucide-react";

const rentals = [
  { icon: <Snowflake size={32} className="text-[#00e64d]" />, name: "Margarita Machines", desc: "Double barrel frozen margarita machine with bar." },
  { icon: <Wind size={32} className="text-[#e81ccd]" />, name: "Outdoor AC", desc: "Multiple sizes available — 5,300 CFM & our heavy duty 11,000 CFM Evaporative Cooler Fans." },
  { icon: <Tent size={32} className="text-[#00e64d]" />, name: "10×20 Canopy Tent", desc: "Heavy duty, commercial grade tent." },
  { icon: <Tent size={32} className="text-[#e81ccd]" />, name: "Large 13×26 Canopy Tent", desc: "Our biggest tent! Fits up to 48 guests — perfect for large outdoor events." },
  { icon: <Table size={32} className="text-[#00e64d]" />, name: "Tables & Chairs", desc: "6-foot tables paired with premium seating — White padded resin chairs." },
  { icon: <UtensilsCrossed size={32} className="text-[#e81ccd]" />, name: "Tablecloths", desc: "Black tablecloths available in all sizes." },
  { icon: <Sparkles size={32} className="text-[#00e64d]" />, name: "Canopy Lights", desc: "String lights to keep the party going. Choose between white or colored string lights." },
  { icon: <Layers2 size={32} className="text-[#e81ccd]" />, name: "Canopy Drapes", desc: "Add on our beautiful canopy drapes to elevate your event. Popular for gender reveals and baby showers." },
  { icon: <PartyPopper size={32} className="text-[#00e64d]" />, name: "Full Event Packages", desc: "Bundle everything together and save — ask us about packages!" },
];

const GOOGLE_URL = "https://www.google.com/search?q=frozen+bexar+reviews";

const reviews = [
  { name: "Andrew Rodriguez", rating: 5, source: "google", text: "Great service fast set up. Definitely renting again" },
  { name: "Chelsea Michelle",  rating: 5, source: "google", text: "Working with Isaac and his team was great. We had a backyard birthday celebration for our son and needed a 10x20 canopy, 2 tables, and 12 chairs. They have competitive pricing, friendly staff, and prompt response time. They arrived within the scheduled timeframe, set everything up quickly and efficiently and came back the next day to break it all down. The white canopy, tables, and chairs were in a like new condition without scuffs or tears! Would definitely use them again and highly recommend them for your events!!" },
  { name: "Joseluis Jimenez",  rating: 5, source: "google", text: "Very fast to respond and easy to book. Would definitely recommend." },
  { name: "Marcie",   rating: 5, source: "facebook", text: "5 STARS FOR SURE! Chris was a pleasure to work with! He TRULY came through for us at the last minute! We thank him and the service and the products were superior!" },
  { name: "Roseanne", rating: 5, source: "facebook", text: "We had a great experience! We rented the canopy and they set everything up for us. We will definitely use them again for our next party." },
  { name: "Nestor",   rating: 5, source: "facebook", text: "Chris was very friendly and helpful, will be in touch with him for future services!! 10/10 recommend" },
  { name: "Valerie",  rating: 5, source: "facebook", text: "Chris was super nice! Showed up at the exact time we had scheduled. And the fan was Heaven sent bc this San Antonio heat is no joke! I will definitely be doing more business with Chris! Thank You once again!!" },
  { name: "Veronica", rating: 5, source: "facebook", text: "Great communication and pricing. Showed up when he said he would, delivered and set up easily. Highly recommended" },
  { name: "Serina",   rating: 5, source: "facebook", text: "10/10 service! Quick to reply and fairly priced! We'll definitely be booking again for other events!" },
  { name: "Tiffany",  rating: 5, source: "facebook", text: "Amazing service! Great communication - dropped off early & explained everything to make sure we were good to go for our daughter's birthday party, and then picked up the next day making the rental convenient and easy. It was great having the fan to keep our guest cool at our party in hot weather. Highly recommend!" },
  { name: "Desiree",  rating: 5, source: "facebook", text: "Extremely easy use of the margarita machine! Chris was very professional on explaining step by step, which made the machine a hit at our event!! :)" },
  { name: "Sabrina",  rating: 5, source: "facebook", text: "Margaritas were a big hit didn't expect to run out so fast. I contacted the seller and he saved the party by bringing more. Would highly recommend him and definitely use him again for future events." },
];

const whyUs = [
  "Local San Antonio business serving Bexar County",
  "Affordable pricing with no hidden fees",
  "Delivery, setup & breakdown available",
  "Clean, well-maintained equipment every time",
  "Responsive same-day communication",
  "Serving quinceañeras, birthdays, corporate events & more",
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e81ccd]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00e64d]/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#e81ccd]/10 border border-[#e81ccd]/30 rounded-full px-4 py-1.5 mb-6">
              <Star size={12} className="text-[#e81ccd] fill-[#e81ccd]" />
              <span className="text-[#e81ccd] text-xs font-bold tracking-widest uppercase">
                San Antonio&apos;s Premier Party Rental
              </span>
              <Star size={12} className="text-[#e81ccd] fill-[#e81ccd]" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
              <span style={{ background: "linear-gradient(135deg,#00e64d,#a8ff78)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Keeping You Cool</span><span style={{ background: "linear-gradient(135deg,#e81ccd,#ff6ef7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> All </span><span style={{ background: "linear-gradient(135deg,#e81ccd,#ff6ef7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Summer</span><span className="text-white"> Long.</span>
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
              Frozen Bexar brings the fiesta to you! We rent margarita machines, canopies, tables, chairs, tablecloths, and lights — everything you need to throw the ultimate San Antonio party.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/booking"
                className="px-8 py-4 rounded-full font-bold uppercase tracking-wide text-white text-center glow-pink transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
              >
                Book Your Event
              </Link>
              <Link
                href="/products"
                className="px-8 py-4 rounded-full font-bold uppercase tracking-wide text-center border-2 border-[#00e64d] text-[#00e64d] hover:bg-[#00e64d]/10 transition-all"
              >
                View Rentals
              </Link>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <div className="float-anim">
              <Image
                src="/logo.png"
                alt="Frozen Bexar"
                width={500}
                height={500}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Rentals Overview */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">
              <span style={{ background: "linear-gradient(135deg,#e81ccd,#ff6ef7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                What We Offer
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From frozen margarita machines to full canopy setups — we have everything to make your event legendary.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((item) => (
              <div
                key={item.name}
                className="card-dark rounded-2xl p-6 hover:border-[#e81ccd]/50 transition-all hover:scale-[1.02] group"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#e81ccd] transition-colors">
                  {item.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-block px-8 py-3 rounded-full border-2 border-[#e81ccd] text-[#e81ccd] font-bold uppercase tracking-wide hover:bg-[#e81ccd]/10 transition-all"
            >
              See All Rentals →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-4xl font-black mb-4">
              Why{" "}
              <span style={{ background: "linear-gradient(135deg,#00e64d,#a8ff78)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Frozen Bexar?
              </span>
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              We&apos;re your neighbors — a local San Antonio business that cares about making your event perfect. Here&apos;s what sets us apart:
            </p>
            <ul className="space-y-3">
              {whyUs.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#00e64d] mt-0.5 shrink-0" />
                  <span className="text-gray-200 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="inline-block mt-8 px-7 py-3 rounded-full font-bold uppercase tracking-wide text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#00e64d,#00b33c)" }}
            >
              Our Story
            </Link>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-[#e81ccd]/20 bg-[#111] p-8 flex flex-col gap-6">
              {[
                { label: "Events Served", value: "500+" },
                { label: "Happy Clients", value: "98%" },
                { label: "Years in San Antonio", value: "5+" },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <span className="text-gray-400 text-sm">{stat.label}</span>
                  <span
                    className="text-3xl font-black"
                    style={{ background: "linear-gradient(135deg,#e81ccd,#00e64d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Statement */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0d0d0d, #110a10)",
              border: "1.5px solid rgba(232,28,205,0.25)",
              boxShadow: "0 0 60px rgba(232,28,205,0.06), inset 0 0 80px rgba(0,230,77,0.02)",
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#e81ccd]/6 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-black mb-6 relative">
              Why{" "}
              <span style={{ background: "linear-gradient(135deg,#e81ccd,#ff6ef7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Choose Us?
              </span>
            </h2>
            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed relative max-w-3xl mx-auto">
              Because we believe quality matters. We intentionally invest in{" "}
              <span className="text-white font-semibold">high-end, commercial-grade rental equipment</span>{" "}
              to ensure our customers receive products that are durable, dependable, and event-ready. Our goal is to provide a{" "}
              <span className="text-white font-semibold">professional, stress-free rental experience</span>{" "}
              with premium products, competitive pricing, and customer service that truly stands out. We are proud to be{" "}
              <span className="font-black" style={{ color: "#f5e642" }}>5-star rated</span>{" "}
              and committed to making every event a success.
            </p>
            <div className="flex justify-center gap-1 mt-8">
              {[1,2,3,4,5].map((s) => <Star key={s} size={22} className="text-[#f5e642] fill-[#f5e642]" />)}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-5xl sm:text-6xl font-black mb-4">
              <span style={{ background: "linear-gradient(135deg,#00e64d,#a8ff78)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                What Our Clients Say
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-6">Don&apos;t just take our word for it — here&apos;s what San Antonio families are saying about Frozen Bexar.</p>
            {/* Platform badges */}
            <div className="flex justify-center gap-4 flex-wrap">
              {/* Google badge */}
              <a href={GOOGLE_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:scale-105 group">
                <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div className="text-left">
                  <p className="text-white font-black text-sm leading-none">Google Reviews</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={11} className="text-[#f5e642] fill-[#f5e642]" />)}
                    <span className="text-gray-400 text-xs ml-1">5.0</span>
                  </div>
                </div>
              </a>
              {/* Facebook badge */}
              <a href="https://www.facebook.com/thefrozenbexar" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:scale-105">
                <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                  <path d="M16.671 15.543l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.513V4.996s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.643H7.078v3.47h3.047v8.385a12.09 12.09 0 003.75 0v-8.385h2.796z" fill="#fff"/>
                </svg>
                <div className="text-left">
                  <p className="text-white font-black text-sm leading-none">Facebook Reviews</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={11} className="text-[#f5e642] fill-[#f5e642]" />)}
                    <span className="text-gray-400 text-xs ml-1">5.0</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.name} className="card-dark rounded-2xl p-6 flex flex-col gap-4 hover:border-[#00e64d]/40 transition-all hover:scale-[1.01]">
                <Quote size={22} className="text-[#e81ccd]/40" />
                <p className="text-gray-300 text-sm leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>
                <div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-[#f5e642] fill-[#f5e642]" />
                    ))}
                  </div>
                  <p className="text-white font-bold text-sm">{r.name}</p>
                  {r.source === "google" ? (
                    <p className="text-xs font-semibold" style={{ color: "#4285F4" }}>Google Review</p>
                  ) : (
                    <p className="text-xs font-semibold" style={{ color: "#1877F2" }}>Facebook Review</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20" style={{ background: "linear-gradient(135deg,#1a0015,#001a0a)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-white">
            Ready to Party?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Fill out our quick booking form and we&apos;ll get back to you same day. No payment required online — just let us know what you need!
          </p>
          <Link
            href="/booking"
            className="inline-block px-10 py-4 rounded-full font-black uppercase tracking-widest text-white text-lg pulse-glow transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
          >
            Book Now — It&apos;s Free to Inquire!
          </Link>
        </div>
      </section>
    </>
  );
}
