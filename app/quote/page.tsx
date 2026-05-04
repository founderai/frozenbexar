"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus, Minus, ShoppingCart, Trash2, Send, CheckCircle2, Snowflake,
  Wind, Umbrella, Tent, Armchair, UtensilsCrossed, Lightbulb, PackageOpen, Trophy, PanelLeft, Lock,
} from "lucide-react";

const catalogItems = [
  { id: "margarita", name: "Margarita Machine", sub: "Single or dual flavor", icon: <Snowflake size={24} className="text-[#00e64d]" />, image: "/margarita-machine.jpg", color: "#00e64d" },
  { id: "coolers", name: "Evaporative Cooler Fan", sub: "5,300 CFM cooling", icon: <Wind size={24} className="text-[#e81ccd]" />, image: "/cooler-unit.jpg", color: "#e81ccd" },
  { id: "canopy-10x20", name: "10×20 Canopy Tent", sub: "Fits 20–30 guests", icon: <Umbrella size={24} className="text-[#00e64d]" />, image: "/canopy-10x20.jpg", color: "#00e64d" },
  { id: "canopy-13x26", name: "13×26 Canopy Tent", sub: "Fits up to 48 guests", icon: <Tent size={24} className="text-[#e81ccd]" />, image: "/canopy-13x26.png", color: "#e81ccd" },
  { id: "canopy-lights", name: "Canopy Lights", sub: "String & LED options", icon: <Lightbulb size={24} color="#fffbe0" />, color: "#fffbe0" },
  { id: "canopy-wall", name: "Canopy Wall", sub: "Add-on for canopy tents", icon: <PanelLeft size={24} className="text-[#00e64d]" />, color: "#00e64d" },
  { id: "tables", name: "Tables & Chairs", sub: "6ft, 8ft tables + chairs", icon: <Armchair size={24} className="text-[#00e64d]" />, color: "#00e64d" },
  { id: "tablecloths", name: "Tablecloths", sub: "All colors available", icon: <UtensilsCrossed size={24} className="text-[#e81ccd]" />, color: "#e81ccd" },
  { id: "yard-games", name: "Yard Games", sub: "Connect 4, Cornhole, Beer Pong", icon: <Trophy size={24} className="text-[#e81ccd]" />, color: "#e81ccd" },
  { id: "packages", name: "Full Event Package", sub: "Custom bundle — ask us!", icon: <PackageOpen size={24} className="text-[#00e64d]" />, color: "#00e64d" },
];

type CartItem = { id: string; name: string; qty: number };
type FormData = {
  name: string; email: string; phone: string;
  eventDate: string; eventType: string; guestCount: string;
  address: string; zipCode: string; notes: string;
};

const emptyForm: FormData = {
  name: "", email: "", phone: "", eventDate: "", eventType: "",
  guestCount: "", address: "", zipCode: "", notes: "",
};

export default function QuotePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [prices, setPrices] = useState<Record<string, { price: string; unit: string }>>({});

  useEffect(() => {
    fetch("/api/prices").then(r => r.json()).then(d => { if (d && typeof d === "object") setPrices(d); }).catch(() => {});
  }, []);

  const getQty = (id: string) => cart.find(c => c.id === id)?.qty ?? 0;

  const adjust = (item: typeof catalogItems[0], delta: number) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (!existing) {
        if (delta < 1) return prev;
        return [...prev, { id: item.id, name: item.name, qty: delta }];
      }
      const newQty = existing.qty + delta;
      if (newQty <= 0) return prev.filter(c => c.id !== item.id);
      return prev.map(c => c.id === item.id ? { ...c, qty: newQty } : c);
    });
  };

  const remove = (id: string) => setCart(prev => prev.filter(c => c.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) { setError("Please add at least one item to your package."); return; }
    setError("");
    setLoading(true);
    const items = cart.map(c => c.qty > 1 ? `${c.name} (×${c.qty})` : c.name);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      if (res.ok) { setSubmitted(true); setCart([]); setForm(emptyForm); }
      else { setError("Something went wrong. Please try again or call us directly."); }
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

            {/* LEFT: Product Grid */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-black" style={{ background: "#e81ccd" }}>1</span>
                Select Your Rentals
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {catalogItems.map(item => {
                  const qty = getQty(item.id);
                  const active = qty > 0;
                  return (
                    <div
                      key={item.id}
                      className="card-dark rounded-2xl p-4 flex items-center gap-4 transition-all"
                      style={active ? { border: `1.5px solid ${item.color}66`, boxShadow: `0 0 12px ${item.color}22` } : {}}
                    >
                      {/* Image or icon */}
                      <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: `${item.color}15` }}>
                        {"image" in item && item.image ? (
                          <Image src={item.image as string} alt={item.name} width={56} height={56} className="object-cover w-full h-full" />
                        ) : (
                          item.icon
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                        {prices[item.id]?.price && (
                          <p className="text-xs font-bold mt-1" style={{ color: item.color }}>
                            ${prices[item.id].price} <span className="font-normal text-gray-500">{prices[item.id].unit}</span>
                          </p>
                        )}
                      </div>
                      {/* Qty controls */}
                      <div className="shrink-0 flex items-center gap-2">
                        {qty > 0 && (
                          <button onClick={() => adjust(item, -1)} className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: `${item.color}22`, border: `1px solid ${item.color}44`, color: item.color }}>
                            <Minus size={12} />
                          </button>
                        )}
                        {qty > 0 && <span className="text-white font-black text-sm w-4 text-center">{qty}</span>}
                        <button onClick={() => adjust(item, 1)} className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: qty > 0 ? `${item.color}33` : `${item.color}15`, border: `1px solid ${item.color}44`, color: item.color }}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Cart + Form */}
            <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-24">
              {/* Cart Summary */}
              <div className="card-dark rounded-2xl p-5 mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShoppingCart size={14} className="text-[#e81ccd]" /> Your Package
                  {cart.length > 0 && <span className="ml-auto text-xs bg-[#e81ccd] text-white rounded-full w-5 h-5 flex items-center justify-center font-black">{cart.reduce((s, c) => s + c.qty, 0)}</span>}
                </h3>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No items selected yet — add from the list!</p>
                ) : (
                  <ul className="space-y-2">
                    {cart.map(c => (
                      <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                        <span className="text-gray-200 flex-1">{c.name}</span>
                        <span className="text-[#00e64d] font-bold shrink-0">×{c.qty}</span>
                        <button onClick={() => remove(c.id)} className="text-gray-500 hover:text-red-400 transition-colors shrink-0"><Trash2 size={13} /></button>
                      </li>
                    ))}
                  </ul>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold uppercase tracking-wide text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 reserve-glow"
                  style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
                >
                  <Send size={15} />
                  {loading ? "Sending…" : "Send My Package Request"}
                </button>
                <p className="text-xs text-gray-500 text-center">No payment required — we&apos;ll contact you with a quote!</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Faint admin lock */}
      <div className="pb-8 flex justify-center">
        <Link href="/admin" className="text-gray-800 hover:text-gray-600 transition-colors inline-flex items-center gap-1 opacity-30 hover:opacity-50">
          <Lock size={11} />
          <span className="text-xs">Admin</span>
        </Link>
      </div>
    </>
  );
}
