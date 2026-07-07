"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Wind, ThermometerSun, CheckCircle2, ShoppingCart } from "lucide-react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function CoolerCalculator() {
  const [tentSize, setTentSize] = useState<"10x20" | "13x26" | "none">("13x26");
  const [isOutdoor, setIsOutdoor] = useState(true);
  const [shade, setShade] = useState<"full-shade" | "partial" | "full-sun">("full-shade");
  const [month, setMonth] = useState(new Date().getMonth());
  const [guests, setGuests] = useState(50);

  const result = useMemo(() => {
    let score = 0;

    // Base: tent size
    if (tentSize === "none") score += 0.5;
    else if (tentSize === "10x20") score += 1;
    else score += 2; // 13x26

    // Outdoor vs indoor
    if (isOutdoor) score += 0.5;

    // Shade
    if (shade === "full-sun") score += 1.5;
    else if (shade === "partial") score += 0.75;

    // Month heat factor
    const heatByMonth = [0, 0, 0.25, 0.5, 1, 1.5, 2, 2, 1.5, 0.75, 0.25, 0];
    score += heatByMonth[month];

    // Guest density
    if (guests > 75) score += 0.5;
    if (guests > 150) score += 0.5;

    const fanCount = score <= 1.5 ? 0 : score <= 3 ? 1 : 2;

    const avgTempByMonth = [56, 60, 68, 76, 83, 90, 94, 95, 88, 79, 68, 58];
    const monthTemp = avgTempByMonth[month];

    const effectiveness =
      monthTemp < 70 ? "Very Effective — cooling fans add comfort but heat is mild"
      : monthTemp < 85 ? "Highly Effective — evaporative cooling works well at this temperature"
      : monthTemp < 95 ? "Effective — fans will make a noticeable difference under shade"
      : "Recommended — shade + fans together are essential at this temperature";

    const placement =
      tentSize === "10x20"
        ? "Position 1 fan at the open end of the 10×20 tent, pointed inward toward guests."
        : tentSize === "13x26"
        ? "Place fans on opposing short ends of the 13×26 tent — one pointing inward from each end — to create cross-airflow."
        : "For open-air setups, position fans upwind of the seating area and angle slightly downward toward guests.";

    return { fanCount, monthTemp, effectiveness, placement, score };
  }, [tentSize, isOutdoor, shade, month, guests]);

  return (
    <div className="card-dark rounded-3xl border border-white/10 overflow-hidden">
      <div className="px-6 py-5 border-b border-white/8 flex items-center gap-3"
        style={{ background: "linear-gradient(135deg,#00b3ff12,#00b3ff05)" }}>
        <Wind size={20} style={{ color: "#00b3ff" }} />
        <h3 className="font-black text-white text-base">Evaporative Cooler Calculator</h3>
        <span className="ml-auto text-xs text-gray-500">How many fans do you need?</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/8">
        {/* Inputs */}
        <div className="p-6 space-y-5">
          {/* Tent Size */}
          <div>
            <p className="text-sm font-bold text-white mb-2">Tent / Coverage Type</p>
            <div className="space-y-2">
              {([
                { val: "10x20" as const, label: "10×20 Canopy (~200 sq ft)" },
                { val: "13x26" as const, label: "13×26 Canopy (~338 sq ft)" },
                { val: "none" as const, label: "Open Air (no tent)" },
              ]).map(opt => (
                <button key={opt.val} type="button" onClick={() => setTentSize(opt.val)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all"
                  style={tentSize === opt.val
                    ? { background: "#00b3ff18", borderColor: "#00b3ff55", color: "#00b3ff" }
                    : { borderColor: "#2a2a2a", color: "#666", background: "#ffffff05" }}>
                  {opt.label}
                  {tentSize === opt.val && <CheckCircle2 size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Month */}
          <div>
            <p className="text-sm font-bold text-white mb-2">
              Event Month <span style={{ color: "#00b3ff" }}>— {MONTHS[month]} (~{[56,60,68,76,83,90,94,95,88,79,68,58][month]}°F avg)</span>
            </p>
            <div className="grid grid-cols-6 gap-1.5">
              {MONTHS.map((m, i) => (
                <button key={m} type="button" onClick={() => setMonth(i)}
                  className="py-1.5 rounded-lg text-xs font-bold border transition-all"
                  style={month === i
                    ? { background: "#00b3ff25", borderColor: "#00b3ff60", color: "#00b3ff" }
                    : { borderColor: "#333", color: "#555" }}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Shade */}
          <div>
            <p className="text-sm font-bold text-white mb-2">Shade Conditions</p>
            <div className="space-y-2">
              {([
                { val: "full-shade" as const, label: "Full shade (under tent)" },
                { val: "partial" as const, label: "Partial shade (tree cover / awning)" },
                { val: "full-sun" as const, label: "Full sun (no overhead shade)" },
              ]).map(opt => (
                <button key={opt.val} type="button" onClick={() => setShade(opt.val)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all"
                  style={shade === opt.val
                    ? { background: "#00b3ff18", borderColor: "#00b3ff55", color: "#00b3ff" }
                    : { borderColor: "#2a2a2a", color: "#666", background: "#ffffff05" }}>
                  {opt.label}
                  {shade === opt.val && <CheckCircle2 size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Guest count */}
          <div>
            <label className="text-sm font-bold text-white mb-2 block">
              Guest Count: <span style={{ color: "#00b3ff" }}>{guests}</span>
            </label>
            <input type="range" min={10} max={200} step={5} value={guests}
              onChange={e => setGuests(Number(e.target.value))}
              className="w-full accent-[#00b3ff]" />
          </div>
        </div>

        {/* Results */}
        <div className="p-6 flex flex-col gap-4">
          {/* Fan Recommendation */}
          <div className="rounded-2xl p-5 border text-center"
            style={{ background: "#00b3ff10", borderColor: "#00b3ff40" }}>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#00b3ff" }}>Recommendation</p>
            <div className="flex items-center justify-center gap-3 mb-2">
              {result.fanCount === 0 ? (
                <p className="text-2xl font-black text-white">No Fan Needed</p>
              ) : (
                <>
                  {Array.from({ length: result.fanCount }).map((_, i) => (
                    <Wind key={i} size={32} style={{ color: "#00b3ff" }} />
                  ))}
                  <p className="text-2xl font-black text-white">
                    {result.fanCount} Fan{result.fanCount > 1 ? "s" : ""}
                  </p>
                </>
              )}
            </div>
            <p className="text-sm font-bold" style={{ color: "#00b3ff" }}>
              {result.fanCount === 0 ? "Weather should be comfortable without cooling"
                : result.fanCount === 1 ? "$80 add-on" : "$140 bundle (save $20)"}
            </p>
          </div>

          {/* Temp + Effectiveness */}
          <div className="card-dark rounded-xl p-4 border border-white/8">
            <div className="flex items-center gap-2 mb-2">
              <ThermometerSun size={15} style={{ color: "#00b3ff" }} />
              <span className="text-xs font-semibold text-gray-400">{MONTHS[month]} avg: {result.monthTemp}°F in San Antonio</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{result.effectiveness}</p>
          </div>

          {/* Placement */}
          {result.fanCount > 0 && (
            <div className="card-dark rounded-xl p-4 border border-white/8">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Placement Tip</p>
              <p className="text-sm text-gray-300 leading-relaxed">{result.placement}</p>
            </div>
          )}

          <Link href="/quote"
            className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-white text-sm transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}>
            <ShoppingCart size={14} />
            Add Cooler Fan{result.fanCount > 1 ? "s" : ""} to My Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
