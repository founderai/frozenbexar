"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus, Minus, ShoppingCart, Trash2, Send, CheckCircle2, Snowflake,
  Wind, Umbrella, Tent, Armchair, UtensilsCrossed, Lightbulb, Trophy,
  PanelLeft, Lock, ChevronDown, ChevronUp, Sparkles, Table2,
} from "lucide-react";

type PriceEntry = { price: string; unit: string; discountNote?: string };
type CartItem = { id: string; name: string; qty: number; priceKey?: string };
type FormData = {
  name: string; email: string; phone: string;
  eventDate: string; eventType: string; guestCount: string;
  address: string; zipCode: string; notes: string;
};

const MAIN_ITEMS = [
  { id: "margarita",       name: "Margarita Machine",    sub: "Single or dual flavor",      icon: <Snowflake size={22} className="text-[#00e64d]" />,  image: "/margarita-machine.jpg", color: "#00e64d" },
  { id: "coolers",         name: "Evaporative Cooler Fan",sub: "5,300 CFM cooling",          icon: <Wind size={22} className="text-[#e81ccd]" />,        image: "/cooler-unit.jpg",       color: "#e81ccd" },
  { id: "canopy-10x20",    name: "10×20 Canopy Tent",    sub: "Fits 20–30 guests",           icon: <Umbrella size={22} className="text-[#00e64d]" />,    image: "/canopy-10x20.jpg",      color: "#00e64d" },
  { id: "canopy-13x26",    name: "13×26 Canopy Tent",    sub: "Fits up to 48 guests",        icon: <Tent size={22} className="text-[#e81ccd]" />,        image: "/canopy-13x26.png",      color: "#e81ccd" },
  { id: "tables",          name: "Tables",               sub: "6ft folding tables",    icon: <Table2 size={22} className="text-[#00e64d]" />,      color: "#00e64d" },
  { id: "chairs",          name: "Chairs",               sub: "Premium white resin chairs",  icon: <Armchair size={22} className="text-[#00e64d]" />,    color: "#00e64d" },
  { id: "table-chair-set", name: "Table & Chair Set",    sub: "Tables + chairs bundled",     icon: <Armchair size={22} className="text-[#e81ccd]" />,    color: "#e81ccd" },
];

const YARD_GAME_OPTIONS = [
  { id: "yard-game-connect4",    name: "Giant Connect 4" },
  { id: "yard-game-cornhole",    name: "Cornhole Set" },
  { id: "yard-game-beer-pong",   name: "Beer Pong Table" },
];

const SPRING_SPECIAL = {
  id: "spring-special",
  name: "Spring Special",
  price: 160,
  items: "10×20 Canopy · 24 Premium White Resin Chairs · 4 Six-Foot Tables",
  note: "Delivery & setup included (in most cases)",
};

const MARGARITA_SPECIAL = {
  id: "margarita-special",
  name: "Margarita Special",
  price: 225,
  items: "Margarita Machine · Evaporative Cooler Fan",
  note: "Keep guests cool & drinks flowing all event",
};

const emptyForm: FormData = {
  name: "", email: "", phone: "", eventDate: "", eventType: "",
  guestCount: "", address: "", zipCode: "", notes: "",
};

function calcLineTotal(id: string, qty: number, prices: Record<string, PriceEntry>, priceKey?: string): number | null {
  if (id === "spring-special") return SPRING_SPECIAL.price * qty;
  if (id === "margarita-special") return MARGARITA_SPECIAL.price * qty;
  const key = priceKey ?? id;
  const base = parseFloat(prices[key]?.price || "");
  if (isNaN(base) || base === 0) return null;
  if (id === "coolers" && qty >= 2) return 115 + Math.max(0, qty - 2) * base;
  return base * qty;
}

function GlowingLightbulb() {
  return (
    <Lightbulb
      size={22}
      style={{
        color: "#ffe066",
        filter: "drop-shadow(0 0 5px #ffe06690) drop-shadow(0 0 10px #ffe06650)",
      }}
    />
  );
}

export default function QuotePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [prices, setPrices] = useState<Record<string, PriceEntry>>({});
  const [yardGamesOpen, setYardGamesOpen] = useState(false);

  useEffect(() => {
    fetch("/api/prices").then(r => r.json()).then(d => { if (d && typeof d === "object") setPrices(d); }).catch(() => {});
  }, []);

  const getQty = (id: string) => cart.find(c => c.id === id)?.qty ?? 0;

  const adjustItem = (id: string, name: string, delta: number, priceKey?: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (!existing) {
        if (delta < 1) return prev;
        return [...prev, { id, name, qty: delta, priceKey }];
      }
      const newQty = existing.qty + delta;
      if (newQty <= 0) return prev.filter(c => c.id !== id);
      return prev.map(c => c.id === id ? { ...c, qty: newQty } : c);
    });
  };

  const remove = (id: string) => setCart(prev => prev.filter(c => c.id !== id));

  const totalYardGameQty = YARD_GAME_OPTIONS.reduce((s, g) => s + getQty(g.id), 0);

  const totalQty = cart.reduce((s, c) => s + c.qty, 0);

  const pricedTotal = cart.reduce((sum, c) => {
    const lt = calcLineTotal(c.id, c.qty, prices, c.priceKey);
    return sum + (lt ?? 0);
  }, 0);

  const hasUnpriced = cart.some(c => calcLineTotal(c.id, c.qty, prices, c.priceKey) === null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) { setError("Please add at least one item to your package."); return; }
    setError("");
    setLoading(true);
    const items = cart.map(c => c.qty > 1 ? `${c.name} ×${c.qty}` : c.name);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      if (res.ok) { setSubmitted(true); setCart([]); setForm(emptyForm); }
      else {
        const body = await res.json().catch(() => null);
        const detail = body?.detail ?? body?.error ?? "Unknown error";
        setError(`Error: ${detail}`);
      }
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <CheckCircle2 size={64} className="text-[#00e64d] mx-auto mb-6" />
          <h1 className="text-3xl font-black text-white mb-4">Package Request Sent!</h1>
          <p className="text-gray-300 mb-8">We received your package request and will contact you within a few hours to confirm availability and provide your quote.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setSubmitted(false)} className="px-8 py-3 rounded-full font-bold uppercase text-sm border-2 border-[#00e64d] text-[#00e64d] hover:bg-[#00e64d]/10 transition-all">
              Build Another Package
            </button>
            <Link href="/" className="px-8 py-3 rounded-full font-bold uppercase text-sm text-white transition-all hover:scale-105" style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function RentalCard({ id, name, sub, icon, image, color, priceKey }: {
    id: string; name: string; sub: string; icon?: React.ReactNode;
    image?: string; color: string; priceKey?: string;
  }) {
    const qty = getQty(id);
    const active = qty > 0;
    const p = prices[priceKey ?? id];
    const lt = calcLineTotal(id, qty, prices, priceKey);
    return (
      <div
        className="card-dark rounded-2xl p-4 flex items-center gap-3 transition-all"
        style={active ? { border: `1.5px solid ${color}66`, boxShadow: `0 0 12px ${color}20` } : {}}
      >
        <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: `${color}15` }}>
          {image ? <Image src={image} alt={name} width={48} height={48} className="object-cover w-full h-full" /> : icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm leading-tight">{name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
          {p?.price && p.price !== "0" && (
            <>
              <p className="text-xs font-bold mt-0.5" style={{ color }}>
                ${p.price} <span className="font-normal text-gray-500">{p.unit}</span>
              </p>
              {active && lt !== null && id === "coolers" && qty >= 2 && (
                <p className="text-xs text-[#f5e642] font-semibold">2 fans = $115 ✓</p>
              )}
              {p.discountNote && qty < 2 && (
                <p className="text-xs text-[#f5e642]/70">{p.discountNote}</p>
              )}
            </>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-1.5">
          {qty > 0 && (
            <button onClick={() => adjustItem(id, name, -1, priceKey)} className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}>
              <Minus size={11} />
            </button>
          )}
          {qty > 0 && <span className="text-white font-black text-sm w-5 text-center">{qty}</span>}
          <button onClick={() => adjustItem(id, name, 1, priceKey)} className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: qty > 0 ? `${color}33` : `${color}15`, border: `1px solid ${color}44`, color }}>
            <Plus size={11} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="relative pt-16 pb-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e81ccd]/8 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#00e64d]/6 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#e81ccd]/10 border border-[#e81ccd]/30 rounded-full px-4 py-1.5 mb-4">
            <ShoppingCart size={14} className="text-[#e81ccd]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#e81ccd]">No payment required</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Build Your{" "}
            <span style={{ background: "linear-gradient(135deg,#e81ccd,#ff6ef7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Package
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Pick your rentals, fill in your event details, and we&apos;ll send you a custom quote — free to inquire!
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* LEFT: Catalog */}
            <div className="flex-1 min-w-0 space-y-8">

              {/* ── MAIN RENTALS ── */}
              <div>
                <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-black" style={{ background: "#e81ccd" }}>1</span>
                  Main Rentals
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MAIN_ITEMS.map(item => (
                    <RentalCard key={item.id} {...item} />
                  ))}
                </div>
              </div>

              {/* ── ADD-ONS ── */}
              <div>
                <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-black bg-white/10 text-gray-300">+</span>
                  Add-Ons
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Canopy Lights — glowing icon */}
                  <RentalCard
                    id="canopy-lights"
                    name="Canopy Lights"
                    sub="String & LED options"
                    icon={<GlowingLightbulb />}
                    color="#ffe066"
                  />
                  {/* Canopy Wall */}
                  <RentalCard
                    id="canopy-wall"
                    name="Canopy Wall"
                    sub="Add-on for canopy tents"
                    icon={<PanelLeft size={22} className="text-[#00e64d]" />}
                    color="#00e64d"
                  />
                  {/* Tablecloths — black only */}
                  <RentalCard
                    id="tablecloths"
                    name="Tablecloths"
                    sub="Black only"
                    icon={<UtensilsCrossed size={22} className="text-[#e81ccd]" />}
                    color="#e81ccd"
                  />

                  {/* ── YARD GAMES ── expandable selector */}
                  <div
                    className="card-dark rounded-2xl p-4 transition-all sm:col-span-1"
                    style={totalYardGameQty > 0 ? { border: "1.5px solid #e81ccd66", boxShadow: "0 0 12px #e81ccd20" } : {}}
                  >
                    <button
                      className="w-full flex items-center gap-3"
                      onClick={() => setYardGamesOpen(o => !o)}
                    >
                      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#e81ccd15" }}>
                        <Trophy size={22} className="text-[#e81ccd]" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-bold text-white text-sm leading-tight">Yard Games</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {totalYardGameQty > 0 ? `${totalYardGameQty} game${totalYardGameQty > 1 ? "s" : ""} selected` : "Connect 4, Cornhole, Beer Pong"}
                        </p>
                        {prices["yard-games"]?.price && (
                          <p className="text-xs font-bold mt-0.5 text-[#e81ccd]">
                            ${prices["yard-games"].price} <span className="font-normal text-gray-500">{prices["yard-games"].unit}</span>
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-gray-400">
                        {yardGamesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {yardGamesOpen && (
                      <div className="mt-3 pt-3 border-t border-white/8 space-y-2">
                        {YARD_GAME_OPTIONS.map(g => {
                          const qty = getQty(g.id);
                          return (
                            <div key={g.id} className="flex items-center justify-between gap-2">
                              <span className="text-sm text-gray-200 flex-1">{g.name}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {qty > 0 && (
                                  <button onClick={() => adjustItem(g.id, g.name, -1, "yard-games")} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#e81ccd22", border: "1px solid #e81ccd44", color: "#e81ccd" }}>
                                    <Minus size={10} />
                                  </button>
                                )}
                                {qty > 0 && <span className="text-white font-black text-sm w-4 text-center">{qty}</span>}
                                <button onClick={() => adjustItem(g.id, g.name, 1, "yard-games")} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: qty > 0 ? "#e81ccd33" : "#e81ccd15", border: "1px solid #e81ccd44", color: "#e81ccd" }}>
                                  <Plus size={10} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── SPECIAL BUNDLES ── */}
              <div>
                <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
                  <Sparkles size={15} className="text-[#f5e642]" />
                  Special Bundles
                </h2>
                <div
                  className="card-dark rounded-2xl p-5 border transition-all"
                  style={getQty("spring-special") > 0
                    ? { borderColor: "#f5e64266", boxShadow: "0 0 16px #f5e64220" }
                    : { borderColor: "#f5e64230" }}
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#f5e64220,#f5e64205)" }}>
                      <Sparkles size={22} style={{ color: "#f5e642" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-black text-white text-sm">Spring Special</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-black" style={{ background: "linear-gradient(135deg,#f5e642,#ffb700)", color: "#000" }}>$160</span>
                      </div>
                      <p className="text-xs text-gray-300 mb-1">{SPRING_SPECIAL.items}</p>
                      <p className="text-xs font-semibold" style={{ color: "#f5e642" }}>{SPRING_SPECIAL.note}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      {getQty("spring-special") > 0 && (
                        <button onClick={() => adjustItem("spring-special", "Spring Special", -1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#f5e64222", border: "1px solid #f5e64244", color: "#f5e642" }}>
                          <Minus size={11} />
                        </button>
                      )}
                      {getQty("spring-special") > 0 && <span className="text-white font-black text-sm w-5 text-center">{getQty("spring-special")}</span>}
                      <button onClick={() => adjustItem("spring-special", "Spring Special", 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: getQty("spring-special") > 0 ? "#f5e64233" : "#f5e64215", border: "1px solid #f5e64244", color: "#f5e642" }}>
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Margarita Special */}
                <div
                  className="card-dark rounded-2xl p-5 border transition-all"
                  style={getQty("margarita-special") > 0
                    ? { borderColor: "#00e64d66", boxShadow: "0 0 16px #00e64d20" }
                    : { borderColor: "#00e64d30" }}
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#00e64d20,#00e64d05)" }}>
                      <Snowflake size={22} style={{ color: "#00e64d" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-black text-white text-sm">Margarita Special</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-black" style={{ background: "linear-gradient(135deg,#00e64d,#00b33c)", color: "#000" }}>$225</span>
                      </div>
                      <p className="text-xs text-gray-300 mb-1">{MARGARITA_SPECIAL.items}</p>
                      <p className="text-xs font-semibold text-[#00e64d]">{MARGARITA_SPECIAL.note}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      {getQty("margarita-special") > 0 && (
                        <button onClick={() => adjustItem("margarita-special", "Margarita Special", -1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#00e64d22", border: "1px solid #00e64d44", color: "#00e64d" }}>
                          <Minus size={11} />
                        </button>
                      )}
                      {getQty("margarita-special") > 0 && <span className="text-white font-black text-sm w-5 text-center">{getQty("margarita-special")}</span>}
                      <button onClick={() => adjustItem("margarita-special", "Margarita Special", 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: getQty("margarita-special") > 0 ? "#00e64d33" : "#00e64d15", border: "1px solid #00e64d44", color: "#00e64d" }}>
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>{/* end LEFT */}

            {/* RIGHT: Cart + Form */}
            <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-24">
              {/* Cart Summary */}
              <div className="card-dark rounded-2xl p-5 mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShoppingCart size={14} className="text-[#e81ccd]" /> Your Package
                  {totalQty > 0 && <span className="ml-auto text-xs bg-[#e81ccd] text-white rounded-full w-5 h-5 flex items-center justify-center font-black">{totalQty}</span>}
                </h3>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No items selected yet — add from the list!</p>
                ) : (
                  <>
                    <ul className="space-y-2 mb-4">
                      {cart.map(c => {
                        const lt = calcLineTotal(c.id, c.qty, prices, c.priceKey);
                        return (
                          <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                            <span className="text-gray-200 flex-1 leading-tight">
                              {c.name}
                              {c.qty > 1 && <span className="text-gray-500 text-xs ml-1">×{c.qty}</span>}
                            </span>
                            {lt !== null ? (
                              <span className="text-[#00e64d] font-bold shrink-0 text-xs">${lt.toFixed(0)}</span>
                            ) : (
                              <span className="text-gray-500 text-xs shrink-0">quote</span>
                            )}
                            <button onClick={() => remove(c.id)} className="text-gray-500 hover:text-red-400 transition-colors shrink-0"><Trash2 size={13} /></button>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="border-t border-white/8 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Est. Total</span>
                        <span className="font-black text-lg" style={{ color: "#00e64d" }}>
                          {pricedTotal > 0 ? `$${pricedTotal.toFixed(0)}` : "—"}
                          {hasUnpriced && pricedTotal > 0 && <span className="text-xs text-gray-500 font-normal ml-1">+</span>}
                        </span>
                      </div>
                      {hasUnpriced && <p className="text-xs text-gray-600 mt-1">Some items are custom — final quote sent after review.</p>}
                    </div>
                  </>
                )}
              </div>

              {/* Event Details Form */}
              <form onSubmit={handleSubmit} className="card-dark rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-black" style={{ background: "#00e64d", color: "#000" }}>2</span>
                  Your Event Details
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Full Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" className="input-dark w-full px-3 py-2 rounded-xl text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" className="input-dark w-full px-3 py-2 rounded-xl text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Phone *</label>
                    <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(210) 555-0000" className="input-dark w-full px-3 py-2 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Event Date *</label>
                    <input required type="date" value={form.eventDate} onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} className="input-dark w-full px-3 py-2 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Guest Count</label>
                    <input value={form.guestCount} onChange={e => setForm(f => ({ ...f, guestCount: e.target.value }))} placeholder="~50" className="input-dark w-full px-3 py-2 rounded-xl text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Event Type *</label>
                    <input required value={form.eventType} onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))} placeholder="Birthday, Quinceañera, Wedding…" className="input-dark w-full px-3 py-2 rounded-xl text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Event Address *</label>
                    <input required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="123 Main St, San Antonio" className="input-dark w-full px-3 py-2 rounded-xl text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">ZIP Code *</label>
                    <input required value={form.zipCode} onChange={e => setForm(f => ({ ...f, zipCode: e.target.value }))} placeholder="78201" maxLength={10} className="input-dark w-full px-3 py-2 rounded-xl text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Notes / Questions</label>
                    <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Any special requests or questions?" className="input-dark w-full px-3 py-2 rounded-xl text-sm resize-none" />
                  </div>
                </div>
                {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-bold uppercase tracking-wide text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 reserve-glow"
                  style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}>
                  <Send size={15} />
                  {loading ? "Sending…" : "Send My Package Request"}
                </button>
                <p className="text-xs text-gray-500 text-center">No payment required — we&apos;ll contact you with a quote!</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-8 flex justify-center">
        <Link href="/admin" className="text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center gap-1 opacity-40 hover:opacity-70">
          <Lock size={11} />
          <span className="text-xs">Admin</span>
        </Link>
      </div>
    </>
  );
}
