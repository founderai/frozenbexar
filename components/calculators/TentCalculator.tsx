"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Tent, Users, CheckCircle2, AlertCircle, ShoppingCart } from "lucide-react";

const TOGGLE = "flex items-center justify-between p-4 card-dark rounded-xl border border-white/8 cursor-pointer select-none hover:border-white/20 transition-colors";
const ACTIVE_TOGGLE = "flex items-center justify-between p-4 rounded-xl border cursor-pointer select-none transition-colors";

export default function TentCalculator() {
  const [guests, setGuests] = useState(50);
  const [seating, setSeating] = useState<"seated" | "standing">("seated");
  const [danceFloor, setDanceFloor] = useState(false);
  const [buffet, setBuffet] = useState(false);
  const [bar, setBar] = useState(false);
  const [dj, setDj] = useState(false);
  const [stage, setStage] = useState(false);

  const result = useMemo(() => {
    const perPerson = seating === "seated" ? 10 : 5;
    const baseArea = guests * perPerson;
    const extras =
      (danceFloor ? 120 : 0) +
      (buffet ? 60 : 0) +
      (bar ? 50 : 0) +
      (dj ? 50 : 0) +
      (stage ? 100 : 0);
    const totalWithBuffer = Math.ceil((baseArea + extras) * 1.15);

    let tent: "10x20" | "13x26" | "multiple" = "multiple";
    let tentLabel = "";
    let tentSqFt = 0;
    let setupArea = "";
    let available = true;

    if (totalWithBuffer <= 200) {
      tent = "10x20";
      tentLabel = "10×20 Canopy Tent";
      tentSqFt = 200;
      setupArea = "~12×22 ft of clear ground";
    } else if (totalWithBuffer <= 338) {
      tent = "13x26";
      tentLabel = "13×26 Canopy Tent";
      tentSqFt = 338;
      setupArea = "~15×28 ft of clear ground";
    } else {
      available = false;
      tentLabel = "Multiple Tents Needed";
      setupArea = "Contact us for multi-tent layout";
    }

    const suggestedTables = seating === "seated" ? Math.ceil(guests / 7) + (buffet ? 2 : 0) : 0;
    const suggestedChairs = seating === "seated" ? guests + Math.ceil(guests * 0.05) : 0;
    const coverage = tentSqFt > 0 ? Math.round((totalWithBuffer / tentSqFt) * 100) : 100;

    return {
      tent,
      tentLabel,
      tentSqFt,
      setupArea,
      available,
      totalWithBuffer,
      suggestedTables,
      suggestedChairs,
      coverage,
    };
  }, [guests, seating, danceFloor, buffet, bar, dj, stage]);

  const quoteLink = `/quote?tent=${result.tent}&guests=${guests}`;

  const Option = ({
    label, checked, onChange, color = "#e81ccd",
  }: { label: string; checked: boolean; onChange: () => void; color?: string }) => (
    <button
      type="button"
      onClick={onChange}
      className={checked ? ACTIVE_TOGGLE : TOGGLE}
      style={checked ? { background: `${color}15`, borderColor: `${color}50` } : {}}
    >
      <span className="text-sm font-semibold text-white">{label}</span>
      <span
        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
        style={checked ? { background: color, borderColor: color } : { borderColor: "#444" }}
      >
        {checked && <CheckCircle2 size={11} className="text-white" />}
      </span>
    </button>
  );

  return (
    <div className="card-dark rounded-3xl border border-white/10 overflow-hidden">
      <div className="px-6 py-5 border-b border-white/8 flex items-center gap-3"
        style={{ background: "linear-gradient(135deg,#00e64d12,#00e64d05)" }}>
        <Tent size={20} className="text-[#00e64d]" />
        <h3 className="font-black text-white text-base">Tent Size Calculator</h3>
        <span className="ml-auto text-xs text-gray-500">Adjust inputs to get your recommendation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/8">
        {/* Inputs */}
        <div className="p-6 space-y-5">
          {/* Guest Count */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
              <Users size={14} className="text-[#00e64d]" />
              Guest Count: <span className="text-[#00e64d]">{guests}</span>
            </label>
            <input
              type="range" min={10} max={200} step={5} value={guests}
              onChange={e => setGuests(Number(e.target.value))}
              className="w-full accent-[#00e64d]"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>10</span><span>50</span><span>100</span><span>150</span><span>200</span>
            </div>
          </div>

          {/* Seating Style */}
          <div>
            <p className="text-sm font-bold text-white mb-2">Seating Style</p>
            <div className="grid grid-cols-2 gap-2">
              {(["seated", "standing"] as const).map(s => (
                <button key={s} type="button" onClick={() => setSeating(s)}
                  className="py-2.5 px-4 rounded-xl text-sm font-bold border transition-all capitalize"
                  style={seating === s
                    ? { background: "#00e64d20", borderColor: "#00e64d60", color: "#00e64d" }
                    : { borderColor: "#333", color: "#666" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <p className="text-sm font-bold text-white mb-2">Additional Space Needs</p>
            <div className="space-y-2">
              <Option label="Dance Floor (+120 sq ft)" checked={danceFloor} onChange={() => setDanceFloor(p => !p)} color="#00e64d" />
              <Option label="Buffet Table Area (+60 sq ft)" checked={buffet} onChange={() => setBuffet(p => !p)} color="#00e64d" />
              <Option label="Bar Station (+50 sq ft)" checked={bar} onChange={() => setBar(p => !p)} color="#e81ccd" />
              <Option label="DJ Booth (+50 sq ft)" checked={dj} onChange={() => setDj(p => !p)} color="#e81ccd" />
              <Option label="Stage (+100 sq ft)" checked={stage} onChange={() => setStage(p => !p)} color="#e81ccd" />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 flex flex-col gap-4">
          <div
            className="rounded-2xl p-5 border"
            style={result.available
              ? { background: "#00e64d10", borderColor: "#00e64d40" }
              : { background: "#e81ccd10", borderColor: "#e81ccd40" }}
          >
            <p className="text-xs uppercase tracking-widest mb-2"
              style={{ color: result.available ? "#00e64d" : "#e81ccd" }}>
              Recommendation
            </p>
            <p className="text-xl font-black text-white mb-1">{result.tentLabel}</p>
            {result.available ? (
              <p className="text-sm text-gray-400">
                Your {result.totalWithBuffer} sq ft requirement fits within {result.tentSqFt} sq ft
                ({result.coverage}% utilization)
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                {result.totalWithBuffer} sq ft needed — contact us for a multi-tent layout
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="card-dark rounded-xl p-4 border border-white/8 text-center">
              <p className="text-lg font-black text-white">{result.totalWithBuffer}</p>
              <p className="text-xs text-gray-500">sq ft needed</p>
            </div>
            <div className="card-dark rounded-xl p-4 border border-white/8 text-center">
              <p className="text-xs text-gray-500 mb-1">Setup area</p>
              <p className="text-sm font-bold text-gray-300">{result.setupArea}</p>
            </div>
          </div>

          {result.available && seating === "seated" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/8 card-dark">
                <span className="text-sm text-gray-300">Suggested Tables</span>
                <span className="font-black text-white">{result.suggestedTables}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/8 card-dark">
                <span className="text-sm text-gray-300">Suggested Chairs</span>
                <span className="font-black text-white">{result.suggestedChairs}</span>
              </div>
            </div>
          )}

          {!result.available && (
            <div className="flex items-start gap-2 p-3 rounded-xl border border-[#e81ccd30] bg-[#e81ccd08] text-sm text-gray-400">
              <AlertCircle size={14} className="text-[#e81ccd] shrink-0 mt-0.5" />
              Two 13×26 tents side-by-side (676 sq ft combined) cover most large events. Contact us to plan a multi-tent layout.
            </div>
          )}

          <Link href={quoteLink}
            className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-white text-sm transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}>
            <ShoppingCart size={14} />
            Request a Quote with This Setup
          </Link>
        </div>
      </div>
    </div>
  );
}
