"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus, Minus, ShoppingCart, Trash2, Send, CheckCircle2, Snowflake,
  Wind, Umbrella, Tent, Armchair, UtensilsCrossed, Lightbulb, Trophy,
  PanelLeft, Lock, ChevronDown, ChevronUp, Sparkles, Table2, Star, GlassWater,
} from "lucide-react";

type PriceEntry = { price: string; unit: string; discountNote?: string };
type CartItem = { id: string; name: string; qty: number; priceKey?: string };
type CatalogItem = { id: string; name: string; sub: string; priceKey?: string; color: string; icon: string; image?: string; visible: boolean };
type Bundle = { id: string; name: string; items: string; note: string; priceKey: string; color: string; icon: string; badge: string; visible: boolean };
type FormData = {
  name: string; email: string; phone: string;
  eventDate: string; eventType: string; guestCount: string;
  address: string; zipCode: string; notes: string;
};

const DEFAULT_CATALOG: CatalogItem[] = [
  { id: "chair",                  name: "Standard White Chair",            sub: "Classic white folding chair",          color: "#00e64d", icon: "Armchair",        image: "/white-chair.jpg",                visible: true },
  { id: "chair-padded",           name: "White Premium Padded Chair",      sub: "White padded resin garden chair",      color: "#e81ccd", icon: "Armchair",        image: "/premium-white-padded-chair.jpg",  visible: true },
  { id: "table",                  name: "Table",                           sub: "6ft rectangular table",               color: "#00e64d", icon: "Table2",          image: "/table.jpg",                      visible: true },
  { id: "standalone-table-chair", name: "Standalone Table & Chair",        sub: "Single standalone set",               color: "#00e64d", icon: "Armchair",        visible: true },
  { id: "canopy-10x20",           name: "10×20 Canopy Tent",               sub: "Fits 20–30 guests",                   color: "#00e64d", icon: "Umbrella",        image: "/canopy-10x20.jpg",               visible: true },
  { id: "canopy-13x26",           name: "13×26 Canopy Tent",               sub: "Fits up to 60 guests",                color: "#e81ccd", icon: "Tent",            image: "/canopy-13x26.png",               visible: true },
  { id: "margarita-machine",      name: "Margarita Machine",               sub: "Single or dual flavor",               color: "#00e64d", icon: "Snowflake",       image: "/margarita-machine.jpg",          visible: true },
  { id: "upgraded-bar",           name: "Upgraded Margarita Bar",          sub: "Premium bar cabinet · lights included",color: "#e81ccd", icon: "UtensilsCrossed", image: "/upgraded-bar.jpg",              visible: true },
  { id: "fan-1",                  name: "1 Fan",                           sub: "Single evaporative cooler fan",        color: "#00e64d", icon: "Wind",            image: "/Fan.jpg", visible: true },
  { id: "fan-2",                  name: "2 Fans",                          sub: "Two fans — best value",                color: "#e81ccd", icon: "Wind",            image: "/Fan.jpg", visible: true },
  { id: "round-table",            name: "Round Table",                     sub: "Individual round table",              color: "#00e64d", icon: "Table2",          image: "/6ft-round-table.jpg",            visible: true },
  { id: "round-table-8-chairs",   name: "Round Tables (8 Chairs)",         sub: "Full round table setup",              color: "#e81ccd", icon: "Table2",          visible: true },
  { id: "cocktail-tables",        name: "Cocktail Tables",                 sub: "High-top — perfect for mingling",     color: "#e81ccd", icon: "Table2",          image: "/cocktail-table.jpg",             visible: true },
];

function getIcon(iconName: string, color: string): React.ReactNode {
  const s = { color };
  switch (iconName) {
    case "Armchair":        return <Armchair size={22} style={s} />;
    case "Table2":          return <Table2 size={22} style={s} />;
    case "Umbrella":        return <Umbrella size={22} style={s} />;
    case "Tent":            return <Tent size={22} style={s} />;
    case "Snowflake":       return <Snowflake size={22} style={s} />;
    case "Wind":            return <Wind size={22} style={s} />;
    case "Trophy":          return <Trophy size={22} style={s} />;
    case "UtensilsCrossed": return <UtensilsCrossed size={22} style={s} />;
    case "PanelLeft":       return <PanelLeft size={22} style={s} />;
    default:                return <Sparkles size={22} style={s} />;
  }
}

const YARD_GAME_OPTIONS = [
  { id: "cornhole",         name: "Cornhole",         priceKey: "cornhole" },
  { id: "giant-connect-four", name: "Giant Connect Four", priceKey: "giant-connect-four" },
];

const DEFAULT_BUNDLES: Bundle[] = [
  { id: "spring-special",      name: "10×20 Canopy Bundle", items: "10×20 Canopy Tent · 4 Table & Chair Sets",   note: "We deliver & set up", priceKey: "spring-special",      color: "#f5e642", icon: "Umbrella",  badge: "",           visible: true },
  { id: "canopy-13x26-bundle", name: "13×26 Canopy Bundle", items: "13×26 Canopy Tent · 8 Table & Chair Sets",   note: "We deliver & set up", priceKey: "canopy-13x26-bundle", color: "#e81ccd", icon: "Tent",      badge: "Best Value", visible: true },
  { id: "margarita-special",   name: "Margarita Special",   items: "Margarita Machine · Evaporative Cooler Fan", note: "Drinks flowing & guests staying cool",      priceKey: "margarita-special",   color: "#00e64d", icon: "Snowflake", badge: "",           visible: true },
];

function getBundleIcon(iconName: string, color: string): React.ReactNode {
  const s = { color };
  switch (iconName) {
    case "Umbrella":  return <Umbrella size={22} style={s} />;
    case "Tent":      return <Tent size={22} style={s} />;
    case "Snowflake": return <Snowflake size={22} style={s} />;
    case "Armchair":  return <Armchair size={22} style={s} />;
    default:          return <Sparkles size={22} style={s} />;
  }
}

const emptyForm: FormData = {
  name: "", email: "", phone: "", eventDate: "", eventType: "",
  guestCount: "", address: "", zipCode: "", notes: "",
};

function calcLineTotal(id: string, qty: number, prices: Record<string, PriceEntry>, priceKey?: string): number | null {
  const key = priceKey ?? id;
  const base = parseFloat(prices[key]?.price || "");
  if (isNaN(base) || base === 0) return null;
  return base * qty;
}

function fmtPrice(n: number): string {
  return n % 1 === 0 ? n.toString() : n.toFixed(2);
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
  const [catalog, setCatalog] = useState<CatalogItem[]>(DEFAULT_CATALOG);
  const [bundles, setBundles] = useState<Bundle[]>(DEFAULT_BUNDLES);
  const [prices, setPrices] = useState<Record<string, PriceEntry>>({});
  const [yardGamesOpen, setYardGamesOpen] = useState(false);
  const [wizardLoaded, setWizardLoaded] = useState(false);
  const [wizardBanner, setWizardBanner] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    fetch("/api/prices",  { cache: "no-store" }).then(r => r.json()).then(d => { if (d && typeof d === "object" && !d.error) setPrices(d); }).catch(() => {});
    fetch("/api/catalog", { cache: "no-store" }).then(r => r.json()).then(d => { if (Array.isArray(d) && d.length > 0) setCatalog(d); }).catch(() => {});
    fetch("/api/bundles", { cache: "no-store" }).then(r => r.json()).then(d => { if (Array.isArray(d) && d.length > 0) setBundles(d); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (wizardLoaded) return;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("wizard");
    if (!raw) return;
    try {
      const items: { id: string; name: string; qty: number; priceKey?: string }[] = JSON.parse(raw);
      if (Array.isArray(items) && items.length > 0) {
        setCart(items.map(i => ({ id: i.id, name: i.name, qty: i.qty, priceKey: i.priceKey })));
        setWizardLoaded(true);
        setWizardBanner(true);
      }
    } catch { /* ignore malformed params */ }
  }, [wizardLoaded]);

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
    if (!termsAccepted) { setError("Please read and accept the Terms & Conditions to continue."); return; }
    setError("");
    setLoading(true);
    const items = cart.map(c => c.qty > 1 ? `${c.name} ×${c.qty}` : c.name);
    const estimatedTotal = pricedTotal > 0 ? pricedTotal : null;
    const itemsBreakdown = cart.map(c => {
      const lt = calcLineTotal(c.id, c.qty, prices, c.priceKey);
      return { name: c.name, qty: c.qty, unitPrice: lt !== null ? lt / c.qty : null, lineTotal: lt };
    });
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, estimatedTotal, itemsBreakdown }),
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
        {image && (
          <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: `${color}15` }}>
            <Image src={image} alt={name} width={80} height={80} className="object-cover w-full h-full" />
          </div>
        )}
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
      {wizardBanner && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border"
            style={{ background: "#00e64d10", borderColor: "#00e64d40" }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#00e64d] shrink-0" />
              <span className="text-sm text-gray-300">
                <span className="font-bold text-white">Package loaded from planner.</span>{" "}
                Review your items below, then fill in your event details to submit.
              </span>
            </div>
            <button onClick={() => setWizardBanner(false)} className="text-gray-500 hover:text-gray-300 text-xs shrink-0">✕</button>
          </div>
        </div>
      )}

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

              {/* ── SPECIAL BUNDLES ── */}
              {bundles.filter(b => b.visible).length > 0 && (
                <div>
                  <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
                    <Sparkles size={15} className="text-[#f5e642]" />
                    Special Bundles
                  </h2>
                  <div className="space-y-3">
                    {bundles.filter(b => b.visible).map(b => {
                      const c = b.color;
                      const isInCart = getQty(b.id) > 0;
                      const priceVal = prices[b.priceKey]?.price;
                      return (
                        <div key={b.id}
                          className="card-dark rounded-2xl p-5 border transition-all"
                          style={isInCart ? { borderColor: `${c}66`, boxShadow: `0 0 16px ${c}20` } : { borderColor: `${c}30` }}>
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <p className="font-black text-white text-sm">{b.name}</p>
                                {priceVal && <span className="px-2 py-0.5 rounded-full text-xs font-black" style={{ background: c === "#f5e642" ? "linear-gradient(135deg,#f5e642,#ffb700)" : `linear-gradient(135deg,${c},${c}bb)`, color: c === "#f5e642" || c === "#00e64d" ? "#000" : "#fff" }}>${priceVal}</span>}
                                {b.badge && <span className="px-2 py-0.5 rounded-full text-xs font-bold border" style={{ borderColor: `${c}66`, color: c }}>{b.badge}</span>}
                              </div>
                              <p className="text-xs text-gray-300 mb-1">{b.items}</p>
                              <p className="text-xs font-semibold" style={{ color: c }}>{b.note}</p>
                            </div>
                            <div className="shrink-0 flex items-center gap-1.5">
                              {isInCart && (
                                <button onClick={() => adjustItem(b.id, b.name, -1, b.priceKey)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${c}22`, border: `1px solid ${c}44`, color: c }}>
                                  <Minus size={11} />
                                </button>
                              )}
                              {isInCart && <span className="text-white font-black text-sm w-5 text-center">{getQty(b.id)}</span>}
                              <button onClick={() => adjustItem(b.id, b.name, 1, b.priceKey)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: isInCart ? `${c}33` : `${c}15`, border: `1px solid ${c}44`, color: c }}>
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── MAIN RENTALS ── */}
              <div>
                <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-black" style={{ background: "#e81ccd" }}>1</span>
                  Main Rentals
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {catalog.filter(item => item.visible).map(item => (
                    <RentalCard key={item.id} id={item.id} name={item.name} sub={item.sub} color={item.color}
                      icon={getIcon(item.icon, item.color)} image={item.image} priceKey={item.priceKey} />
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
                  <RentalCard
                    id="lights"
                    name="Lights"
                    sub="Event string/LED lighting"
                    icon={<GlowingLightbulb />}
                    color="#ffe066"
                  />
                  <RentalCard
                    id="walls"
                    name="Walls"
                    sub="Canopy side wall panel"
                    icon={<PanelLeft size={22} className="text-[#00e64d]" />}
                    color="#00e64d"
                  />
                  <RentalCard
                    id="linens"
                    name="Linens"
                    sub="Black — rect, round & cocktail"
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
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-bold text-white text-sm leading-tight">Yard Games</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {totalYardGameQty > 0 ? `${totalYardGameQty} game${totalYardGameQty > 1 ? "s" : ""} selected` : "Cornhole · Giant Connect Four"}
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
                                  <button onClick={() => adjustItem(g.id, g.name, -1, g.priceKey)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#e81ccd22", border: "1px solid #e81ccd44", color: "#e81ccd" }}>
                                    <Minus size={10} />
                                  </button>
                                )}
                                {qty > 0 && <span className="text-white font-black text-sm w-4 text-center">{qty}</span>}
                                <button onClick={() => adjustItem(g.id, g.name, 1, g.priceKey)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: qty > 0 ? "#e81ccd33" : "#e81ccd15", border: "1px solid #e81ccd44", color: "#e81ccd" }}>
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
                              <span className="text-[#00e64d] font-bold shrink-0 text-xs">${fmtPrice(lt)}</span>
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
                          {pricedTotal > 0 ? `$${fmtPrice(pricedTotal)}` : "—"}
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
                {/* Terms & Conditions checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={e => setTermsAccepted(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                      style={termsAccepted
                        ? { background: "#e81ccd", borderColor: "#e81ccd" }
                        : { background: "transparent", borderColor: "#555" }}
                    >
                      {termsAccepted && (
                        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                          <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    I have read and agree to Frozen Bexar&apos;s{" "}
                    <Link href="/terms" target="_blank" className="text-[#e81ccd] underline hover:text-[#ff6ef7] font-semibold">
                      Rental Terms &amp; Conditions
                    </Link>
                    . I understand I am responsible for the rental equipment while it is in my possession.{" "}
                    <span className="text-red-400 font-semibold">*</span>
                  </span>
                </label>

                {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}
                <button type="submit" disabled={loading || !termsAccepted}
                  className="w-full py-3 rounded-xl font-bold uppercase tracking-wide text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed reserve-glow"
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
