"use client";

import { useState, useEffect } from "react";
import { CalendarDays, CheckCircle2, Clock, Loader2 } from "lucide-react";

const FALLBACK_ITEMS = [
  "Margarita Machine (Single Flavor)",
  "Margarita Machine (Dual Flavor)",
  "Evaporative Cooler / Swamp Cooler (Hessaire MC37V)",
  "10×20 Canopy",
  "6ft Rectangular Tables",
  "Round Tables (48in)",
  "Folding Chairs",
  "Padded Chairs",
  "Tablecloths",
  "Canopy String Lights",
  "Full Event Package",
];

const eventTypes = [
  "Quinceañera",
  "Birthday Party",
  "Wedding / Reception",
  "Corporate Event",
  "Graduation Party",
  "Baby Shower / Gender Reveal",
  "Block Party / Neighborhood Event",
  "Other",
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  pickupDate: string;
  eventType: string;
  guestCount: string;
  address: string;
  zipCode: string;
  items: string[];
  notes: string;
}

export default function BookingPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    pickupDate: "",
    eventType: "",
    guestCount: "",
    address: "",
    zipCode: "",
    items: [],
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inventoryItems, setInventoryItems] = useState<{ id: string; name: string; total: number }[]>([]);
  const [qtys, setQtys] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/inventory")
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setInventoryItems(data as { id: string; name: string; total: number }[]);
      })
      .catch(() => {
        setInventoryItems(FALLBACK_ITEMS.map((name, i) => ({ id: String(i), name, total: 99 })));
      });
  }, []);

  useEffect(() => {
    if (!form.eventDate) return;
    const [y, m, d] = form.eventDate.split("-").map(Number);
    const next = new Date(y, m - 1, d + 1);
    const nextYMD = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`;
    setForm((prev) => {
      if (!prev.pickupDate || prev.pickupDate < prev.eventDate) {
        return { ...prev, pickupDate: nextYMD };
      }
      return prev;
    });
  }, [form.eventDate]);

  const toggleItem = (item: string) => {
    const wasSelected = form.items.includes(item);
    setForm((prev) => ({
      ...prev,
      items: wasSelected
        ? prev.items.filter((i) => i !== item)
        : [...prev.items, item],
    }));
    if (wasSelected) {
      setQtys((prev) => { const next = { ...prev }; delete next[item]; return next; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.items.length === 0) {
      setError("Please select at least one rental item.");
      return;
    }
    if (!form.pickupDate) {
      setError("Please enter a pickup / return date.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          itemsWithQty: form.items.map((name) => ({ name, qty: qtys[name] || 1 })),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again or call us directly.");
      }
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#00e64d]/10 border-2 border-[#00e64d] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-[#00e64d]" />
          </div>
          <h2 className="text-4xl font-black mb-4">
            <span
              style={{
                background: "linear-gradient(135deg,#00e64d,#a8ff78)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Booking Received!
            </span>
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Thanks, <strong className="text-white">{form.name}</strong>! We&apos;ve received your booking request and will reach out to you at{" "}
            <strong className="text-[#e81ccd]">{form.email}</strong> or{" "}
            <strong className="text-[#e81ccd]">{form.phone}</strong> within a few hours to confirm details.
          </p>
          <div className="card-dark rounded-2xl p-4 text-left text-sm mb-6">
            <div className="flex items-center gap-2 text-[#00e64d] font-semibold mb-2">
              <CalendarDays size={16} />
              Event Details Summary
            </div>
            <p className="text-gray-400">
              <span className="text-gray-200">Drop-off:</span> {form.eventDate}
            </p>
            <p className="text-gray-400">
              <span className="text-gray-200">Pickup:</span> {form.pickupDate}
            </p>
            <p className="text-gray-400">
              <span className="text-gray-200">Type:</span> {form.eventType}
            </p>
            <p className="text-gray-400">
              <span className="text-gray-200">Items:</span> {form.items.join(", ")}
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({
                name: "", email: "", phone: "", eventDate: "", pickupDate: "", eventType: "",
                guestCount: "", address: "", zipCode: "", items: [], notes: "",
              });
              setQtys({});
            }}
            className="px-6 py-3 rounded-full text-sm font-bold uppercase border-2 border-[#e81ccd] text-[#e81ccd] hover:bg-[#e81ccd]/10 transition-all"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="relative pt-20 pb-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#e81ccd]/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-5xl sm:text-6xl font-black mb-4">
            Book Your{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#e81ccd,#ff6ef7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Event
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Fill out the form below and we&apos;ll contact you to confirm your rental and provide a quote. <strong className="text-[#00e64d]">No payment required online.</strong>
          </p>
          <div className="flex justify-center gap-6 mt-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#e81ccd]" />
              Same-day response
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#00e64d]" />
              Free to inquire
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="card-dark rounded-3xl p-8 sm:p-10 space-y-8">

            {/* Contact Info */}
            <div>
              <h2 className="text-lg font-bold text-[#e81ccd] mb-4 uppercase tracking-wider border-b border-[#e81ccd]/20 pb-2">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Full Name <span className="text-[#e81ccd]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e81ccd]/60 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Phone Number <span className="text-[#e81ccd]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(210) 555-0000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e81ccd]/60 transition-colors text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Email Address <span className="text-[#e81ccd]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e81ccd]/60 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div>
              <h2 className="text-lg font-bold text-[#00e64d] mb-4 uppercase tracking-wider border-b border-[#00e64d]/20 pb-2">
                Event Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Event Date <span className="text-[#e81ccd]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00e64d]/60 transition-colors text-sm [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Pickup / Return Date <span className="text-[#e81ccd]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.pickupDate}
                    onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                    min={form.eventDate || new Date().toISOString().split("T")[0]}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00e64d]/60 transition-colors text-sm [color-scheme:dark]"
                  />
                  <p className="text-xs text-gray-500 mt-1">When we pick up your equipment</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Event Type <span className="text-[#e81ccd]">*</span>
                  </label>
                  <select
                    required
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e64d]/60 transition-colors text-sm"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Estimated Guest Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.guestCount}
                    onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                    placeholder="e.g. 50"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00e64d]/60 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Event Address / City
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="San Antonio, TX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00e64d]/60 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    ZIP Code <span className="text-[#e81ccd]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={form.zipCode}
                    onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                    placeholder="e.g. 78201"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00e64d]/60 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Rental Items */}
            <div>
              <h2 className="text-lg font-bold text-[#e81ccd] mb-2 uppercase tracking-wider border-b border-[#e81ccd]/20 pb-2">
                Rental Items Needed <span className="text-[#e81ccd]">*</span>
              </h2>
              <p className="text-gray-500 text-xs mb-4">Select all that apply</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(inventoryItems.length > 0
                  ? inventoryItems
                  : FALLBACK_ITEMS.map((name, i) => ({ id: String(i), name, total: 99 }))
                ).map((inv) => {
                  const selected = form.items.includes(inv.name);
                  return (
                    <div
                      key={inv.id}
                      className={`rounded-xl border transition-all ${
                        selected
                          ? "border-[#e81ccd] bg-[#e81ccd]/10"
                          : "border-white/10 bg-white/3 hover:border-white/20"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(inv.name)}
                        className={`flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-left ${
                          selected ? "text-[#e81ccd]" : "text-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                            selected ? "border-[#e81ccd] bg-[#e81ccd]" : "border-gray-500"
                          }`}
                        >
                          {selected && (
                            <svg viewBox="0 0 12 12" className="w-3 h-3 fill-white">
                              <path d="M10 3L5 8.5L2 5.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                        {inv.name}
                      </button>
                      {selected && (
                        <div className="px-4 pb-3 flex items-center gap-2">
                          <label className="text-xs text-[#e81ccd]/70 font-semibold shrink-0">Quantity:</label>
                          <input
                            type="number"
                            min="1"
                            max="999"
                            value={qtys[inv.name] ?? 1}
                            onChange={(e) =>
                              setQtys((prev) => ({
                                ...prev,
                                [inv.name]: Math.max(1, Number(e.target.value)),
                              }))
                            }
                            className="w-20 bg-white/5 border border-[#e81ccd]/30 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-[#e81ccd]/60"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h2 className="text-lg font-bold text-[#00e64d] mb-4 uppercase tracking-wider border-b border-[#00e64d]/20 pb-2">
                Additional Notes
              </h2>
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any special requests, questions about quantities, timing preferences, or other details..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00e64d]/60 transition-colors text-sm resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-white text-lg transition-all hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Booking Request"
              )}
            </button>

            <p className="text-center text-xs text-gray-600">
              By submitting, you agree to be contacted by Frozen Bexar regarding your event. No payment is collected online.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
