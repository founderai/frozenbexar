"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tag, CalendarDays, ChevronRight, Sparkles, Snowflake } from "lucide-react";

type Special = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  badge?: string;
  expires?: string;
};

export default function SpecialsPage() {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/specials")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setSpecials(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Header */}
      <section className="relative pt-20 pb-14 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f5e642]/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#e81ccd]/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#f5e642]/10 border border-[#f5e642]/30 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={12} className="text-[#f5e642]" />
            <span className="text-[#f5e642] text-xs font-bold tracking-widest uppercase">Limited Time Deals</span>
            <Sparkles size={12} className="text-[#f5e642]" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black mb-4">
            <span style={{ background: "linear-gradient(135deg,#f5e642,#ffb700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Specials
            </span>
            {" & "}
            <span style={{ background: "linear-gradient(135deg,#e81ccd,#ff6ef7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Promotions
            </span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Seasonal deals, bundle discounts, and limited-time offers from Frozen Bexar.
          </p>
        </div>
      </section>

      {/* Permanent Bundle Cards */}
      <section className="pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-[#f5e642] mb-5 flex items-center gap-2">
            <Sparkles size={14} /> Special Bundles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Spring Special */}
            <div className="card-dark rounded-3xl p-6 border border-[#f5e642]/30 hover:border-[#f5e642]/60 hover:scale-[1.01] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#f5e64220,#f5e64205)" }}>
                  <Sparkles size={24} style={{ color: "#f5e642" }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-black text-lg">Spring Special</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black" style={{ background: "linear-gradient(135deg,#f5e642,#ffb700)", color: "#000" }}>$160</span>
                  </div>
                  <p className="text-xs text-[#f5e642] font-semibold">Limited Time Offer</p>
                </div>
              </div>
              <ul className="space-y-1.5 mb-4">
                {["10×20 Canopy Tent", "24 Premium White Resin Chairs", "4 Six-Foot Tables"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f5e642] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mb-4">Delivery &amp; setup included in most cases</p>
              <Link href="/quote" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide text-black transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#f5e642,#ffb700)" }}>
                Reserve Now <ChevronRight size={14} />
              </Link>
            </div>

            {/* Margarita Special */}
            <div className="card-dark rounded-3xl p-6 border border-[#00e64d]/30 hover:border-[#00e64d]/60 hover:scale-[1.01] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#00e64d20,#00e64d05)" }}>
                  <Snowflake size={24} style={{ color: "#00e64d" }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-black text-lg">Margarita Special</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black" style={{ background: "linear-gradient(135deg,#00e64d,#00b33c)", color: "#000" }}>$225</span>
                  </div>
                  <p className="text-xs text-[#00e64d] font-semibold">Bundle &amp; Save</p>
                </div>
              </div>
              <ul className="space-y-1.5 mb-4">
                {["Margarita Machine (single or dual flavor)", "Evaporative Cooler Fan"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e64d] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mb-4">Keep guests cool &amp; drinks flowing all event long</p>
              <Link href="/quote" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide text-black transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#00e64d,#00b33c)" }}>
                Reserve Now <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specials Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-10 h-10 rounded-full border-2 border-[#e81ccd]/30 border-t-[#e81ccd] animate-spin" />
            </div>
          ) : specials.length === 0 ? (
            <div className="text-center py-24">
              <Sparkles size={48} className="text-[#f5e642]/30 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-2">No Specials Right Now</h2>
              <p className="text-gray-500 mb-8">Check back soon — seasonal deals are added regularly!</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold uppercase tracking-wide text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
              >
                View All Rentals <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {specials.map(s => (
                <div key={s.id} className="card-dark rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all hover:shadow-lg">
                  {/* Image */}
                  <div className="relative w-full h-56 bg-[#111]">
                    {s.imageUrl ? (
                      <Image src={s.imageUrl} alt={s.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles size={40} className="text-[#f5e642]/30" />
                      </div>
                    )}
                    {s.badge && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide"
                        style={{ background: "linear-gradient(135deg,#f5e642,#ffb700)", color: "#000" }}>
                        {s.badge}
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-white font-black text-lg mb-2">{s.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.description}</p>
                    {s.expires && (
                      <div className="flex items-center gap-1.5 text-xs text-[#f5e642] font-semibold mb-4">
                        <CalendarDays size={13} />
                        Expires: {s.expires}
                      </div>
                    )}
                    <Link
                      href="/quote"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide text-white transition-all group-hover:scale-105"
                      style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
                    >
                      Reserve Now <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Tag size={32} className="text-[#f5e642] mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-3">Want a Custom Deal?</h2>
          <p className="text-gray-400 mb-6">Contact us directly — we love working with our customers to find the best pricing for your event.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold uppercase tracking-wide transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#f5e642,#ffb700)", color: "#000" }}
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
}
