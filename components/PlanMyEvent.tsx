"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  PartyPopper, MapPin, Calendar, Users, Tent, Armchair,
  Wind, Snowflake, ChevronRight, ChevronLeft, ShoppingCart, CheckCircle2,
} from "lucide-react";

type EventType = "birthday" | "quinceañera" | "graduation" | "wedding" | "corporate" | "other";
type YesNo = "yes" | "no";

interface WizardState {
  eventType: EventType | "";
  date: string;
  zip: string;
  guests: number;
  outdoor: YesNo;
  food: YesNo;
  alcohol: YesNo;
  shade: YesNo;
  cooling: YesNo;
  delivery: YesNo;
}

interface PackageItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number | null;
  lineTotal: number | null;
}

const EVENT_TYPES: { val: EventType; label: string; icon: string }[] = [
  { val: "birthday", label: "Birthday Party", icon: "🎂" },
  { val: "quinceañera", label: "Quinceañera", icon: "👑" },
  { val: "graduation", label: "Graduation Party", icon: "🎓" },
  { val: "wedding", label: "Wedding / Reception", icon: "💍" },
  { val: "corporate", label: "Corporate Event", icon: "🏢" },
  { val: "other", label: "Other Event", icon: "🎉" },
];

function buildPackage(s: WizardState): PackageItem[] {
  const items: PackageItem[] = [];
  const g = s.guests;

  // Tent
  if (s.outdoor === "yes" && s.shade === "yes") {
    if (g <= 30) {
      items.push({ id: "canopy-10x20", name: "10×20 Canopy Tent", qty: 1, unitPrice: 115, lineTotal: 115 });
    } else {
      items.push({ id: "canopy-13x26", name: "13×26 Canopy Tent", qty: 1, unitPrice: 190, lineTotal: 190 });
    }
  }

  // Tables
  const diningTables = Math.ceil(g / 7);
  const extraTables = s.food === "yes" ? 2 : 0;
  const totalTables = diningTables + extraTables;
  if (totalTables > 0) {
    items.push({ id: "table", name: "6ft Rectangular Table", qty: totalTables, unitPrice: 6, lineTotal: totalTables * 6 });
  }

  // Chairs
  const chairs = g + Math.ceil(g * 0.05);
  items.push({ id: "chair", name: "Chair", qty: chairs, unitPrice: 3, lineTotal: chairs * 3 });

  // Cocktail tables (for wedding/corporate/quince)
  if (["wedding", "corporate", "quinceañera"].includes(s.eventType)) {
    const cocktail = Math.max(2, Math.ceil(g / 20));
    items.push({ id: "cocktail-tables", name: "Cocktail Tables", qty: cocktail, unitPrice: 15, lineTotal: cocktail * 15 });
  }

  // Margarita machine
  if (s.alcohol === "yes" && g >= 20) {
    items.push({ id: "margarita-machine", name: "Margarita Machine", qty: 1, unitPrice: 180, lineTotal: 180 });
  }

  // Cooling fans
  if (s.outdoor === "yes" && s.cooling === "yes") {
    const tentItem = items.find(i => i.id === "canopy-13x26");
    if (tentItem || g > 50) {
      items.push({ id: "fan-2", name: "2 Fans", qty: 1, unitPrice: 140, lineTotal: 140 });
    } else {
      items.push({ id: "fan-1", name: "1 Fan", qty: 1, unitPrice: 80, lineTotal: 80 });
    }
  }

  // Linens
  if (totalTables > 0) {
    items.push({ id: "linens", name: "Black Linens", qty: diningTables + extraTables, unitPrice: 5, lineTotal: (diningTables + extraTables) * 5 });
  }

  return items;
}

const EMPTY: WizardState = {
  eventType: "", date: "", zip: "", guests: 50,
  outdoor: "yes", food: "yes", alcohol: "no",
  shade: "yes", cooling: "yes", delivery: "yes",
};

const TOTAL_STEPS = 4;

export default function PlanMyEvent() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(EMPTY);
  const [done, setDone] = useState(false);

  const set = <K extends keyof WizardState>(key: K, val: WizardState[K]) =>
    setState(p => ({ ...p, [key]: val }));

  const pkg = useMemo(() => (done ? buildPackage(state) : []), [done, state]);
  const total = pkg.reduce((s, i) => s + (i.lineTotal ?? 0), 0);

  const cartParam = encodeURIComponent(JSON.stringify(
    pkg.map(i => ({ id: i.id, name: i.name, qty: i.qty, unitPrice: i.unitPrice }))
  ));
  const quoteLink = `/quote?wizard=${cartParam}`;

  const YesNoBtn = ({ field }: { field: keyof WizardState }) => (
    <div className="grid grid-cols-2 gap-2">
      {(["yes", "no"] as const).map(v => (
        <button key={v} type="button" onClick={() => set(field, v)}
          className="py-3 rounded-xl text-sm font-bold border capitalize transition-all"
          style={(state[field] as string) === v
            ? { background: "#e81ccd20", borderColor: "#e81ccd60", color: "#e81ccd" }
            : { borderColor: "#2a2a2a", color: "#555", background: "#ffffff05" }}>
          {v}
        </button>
      ))}
    </div>
  );

  const stepValid = () => {
    if (step === 1) return state.eventType !== "" && state.guests >= 10;
    if (step === 2) return true;
    if (step === 3) return true;
    return true;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1);
    else { setDone(true); }
  };

  if (done) {
    return (
      <div className="card-dark rounded-3xl border border-white/10 overflow-hidden">
        <div className="px-6 py-5 border-b border-white/8" style={{ background: "linear-gradient(135deg,#e81ccd12,#00e64d08)" }}>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#00e64d]" />
            <h3 className="font-black text-white text-base">Your Recommended Package</h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Based on your event details — review and request a quote</p>
        </div>
        <div className="p-6 space-y-3">
          {pkg.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl border border-white/8 card-dark">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#00e64d] shrink-0" />
                <span className="text-sm text-gray-300">{item.name}</span>
                {item.qty > 1 && <span className="text-xs text-gray-600">×{item.qty}</span>}
              </div>
              {item.lineTotal != null && (
                <span className="text-sm font-bold text-white">${item.lineTotal}</span>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between p-4 rounded-xl mt-2"
            style={{ background: "#00e64d12", border: "1.5px solid #00e64d40" }}>
            <span className="font-bold text-white">Estimated Total</span>
            <span className="text-xl font-black text-[#00e64d]">${total}</span>
          </div>

          <p className="text-xs text-gray-600 text-center">
            Final pricing confirmed after we review your request. No payment due now.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href={quoteLink}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-white text-sm transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}>
              <ShoppingCart size={14} />
              Add All to Cart & Quote
            </Link>
            <button onClick={() => { setDone(false); setStep(1); setState(EMPTY); }}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-all">
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-dark rounded-3xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/8" style={{ background: "linear-gradient(135deg,#e81ccd12,#e81ccd05)" }}>
        <div className="flex items-center gap-2 mb-3">
          <PartyPopper size={18} className="text-[#e81ccd]" />
          <h3 className="font-black text-white text-base">Plan My Event</h3>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full transition-all"
              style={{ background: i < step ? "#e81ccd" : "#2a2a2a" }} />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Step {step} of {TOTAL_STEPS}</p>
      </div>

      <div className="p-6 space-y-5 min-h-[320px]">
        {/* Step 1: Event basics */}
        {step === 1 && (
          <>
            <div>
              <p className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <PartyPopper size={14} className="text-[#e81ccd]" /> What type of event?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EVENT_TYPES.map(et => (
                  <button key={et.val} type="button" onClick={() => set("eventType", et.val)}
                    className="py-3 px-3 rounded-xl text-sm font-bold border transition-all text-center"
                    style={state.eventType === et.val
                      ? { background: "#e81ccd20", borderColor: "#e81ccd60", color: "#e81ccd" }
                      : { borderColor: "#2a2a2a", color: "#666", background: "#ffffff05" }}>
                    <span className="block text-lg mb-0.5">{et.icon}</span>
                    {et.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-2 flex items-center gap-2 block">
                <Users size={14} className="text-[#e81ccd]" /> Guest Count: <span className="text-[#e81ccd]">{state.guests}</span>
              </label>
              <input type="range" min={10} max={250} step={5} value={state.guests}
                onChange={e => set("guests", Number(e.target.value))}
                className="w-full accent-[#e81ccd]" />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>10</span><span>50</span><span>100</span><span>150</span><span>200+</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 flex items-center gap-1 block">
                  <Calendar size={11} /> Event Date
                </label>
                <input type="date" value={state.date} onChange={e => set("date", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#e81ccd]/60" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 flex items-center gap-1 block">
                  <MapPin size={11} /> ZIP Code
                </label>
                <input type="text" placeholder="78201" maxLength={5} value={state.zip}
                  onChange={e => set("zip", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#e81ccd]/60" />
              </div>
            </div>
          </>
        )}

        {/* Step 2: Venue */}
        {step === 2 && (
          <>
            <div>
              <p className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Tent size={14} className="text-[#00e64d]" /> Outdoor or indoor event?
              </p>
              <YesNoBtn field="outdoor" />
            </div>
            {state.outdoor === "yes" && (
              <>
                <div>
                  <p className="text-sm font-bold text-white mb-2">Do you need a canopy tent for shade?</p>
                  <YesNoBtn field="shade" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-2">
                    <span className="flex items-center gap-2"><Wind size={14} className="text-[#00b3ff]" /> Add evaporative cooling fans?</span>
                  </p>
                  <YesNoBtn field="cooling" />
                </div>
              </>
            )}
          </>
        )}

        {/* Step 3: Food & Drinks */}
        {step === 3 && (
          <>
            <div>
              <p className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <PartyPopper size={14} className="text-[#e81ccd]" /> Will you be serving food?
              </p>
              <p className="text-xs text-gray-500 mb-2">We'll add buffet table space to your layout</p>
              <YesNoBtn field="food" />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Snowflake size={14} className="text-[#00e64d]" /> Want a margarita machine?
              </p>
              <p className="text-xs text-gray-500 mb-2">110 servings of lime mix + cups + bar setup included</p>
              <YesNoBtn field="alcohol" />
            </div>
          </>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <>
            <p className="text-sm font-bold text-white mb-3">Confirm your event details</p>
            <div className="space-y-2 text-sm">
              {[
                { label: "Event Type", value: EVENT_TYPES.find(e => e.val === state.eventType)?.label ?? state.eventType },
                { label: "Guest Count", value: `${state.guests} guests` },
                { label: "Date", value: state.date || "Not set" },
                { label: "ZIP Code", value: state.zip || "Not set" },
                { label: "Outdoor", value: state.outdoor === "yes" ? "Yes" : "No" },
                { label: "Shade / Tent", value: state.outdoor === "yes" ? (state.shade === "yes" ? "Yes" : "No") : "Indoor" },
                { label: "Cooling Fans", value: state.outdoor === "yes" ? (state.cooling === "yes" ? "Yes" : "No") : "N/A" },
                { label: "Food Service", value: state.food === "yes" ? "Yes" : "No" },
                { label: "Margarita Machine", value: state.alcohol === "yes" ? "Yes" : "No" },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="text-white font-semibold capitalize">{row.value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-6 flex gap-3">
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-1.5 px-5 py-3 rounded-2xl font-bold text-sm border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition-all">
            <ChevronLeft size={14} /> Back
          </button>
        )}
        <button onClick={handleNext} disabled={!stepValid()}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-white text-sm transition-all hover:scale-[1.02] disabled:opacity-40 disabled:scale-100"
          style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}>
          {step === TOTAL_STEPS ? "Build My Package" : "Next"}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
