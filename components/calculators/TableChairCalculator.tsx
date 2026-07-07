"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Table2, Armchair, CheckCircle2, ShoppingCart } from "lucide-react";

export default function TableChairCalculator() {
  const [guests, setGuests] = useState(50);
  const [tableStyle, setTableStyle] = useState<"rectangular" | "round">("rectangular");
  const [kidsTable, setKidsTable] = useState(false);
  const [kidsCount, setKidsCount] = useState(10);
  const [cocktailTables, setCocktailTables] = useState(false);
  const [buffetTable, setBuffetTable] = useState(true);
  const [cakeTable, setCakeTable] = useState(false);

  const result = useMemo(() => {
    const seatedGuests = kidsTable ? Math.max(0, guests - kidsCount) : guests;
    const seatsPerTable = tableStyle === "rectangular" ? 7 : 9;
    const diningTables = Math.ceil(seatedGuests / seatsPerTable);
    const kidsTables = kidsTable ? Math.ceil(kidsCount / 6) : 0;
    const extraTables = (buffetTable ? 2 : 0) + (cakeTable ? 1 : 0);
    const cocktailCount = cocktailTables ? Math.ceil(guests / 15) : 0;
    const totalTables = diningTables + kidsTables + extraTables + cocktailCount;
    const chairsNeeded = guests + Math.ceil(guests * 0.05);
    const linensNeeded = diningTables + kidsTables + extraTables;

    return { diningTables, kidsTables, extraTables, cocktailCount, totalTables, chairsNeeded, linensNeeded };
  }, [guests, tableStyle, kidsTable, kidsCount, cocktailTables, buffetTable, cakeTable]);

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <button type="button" onClick={onChange}
      className="flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none"
      style={checked ? { background: "#e81ccd15", borderColor: "#e81ccd50" } : { borderColor: "#2a2a2a", background: "#ffffff05" }}>
      <span className="text-sm text-white">{label}</span>
      <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
        style={checked ? { background: "#e81ccd", borderColor: "#e81ccd" } : { borderColor: "#444" }}>
        {checked && <CheckCircle2 size={11} className="text-white" />}
      </span>
    </button>
  );

  return (
    <div className="card-dark rounded-3xl border border-white/10 overflow-hidden">
      <div className="px-6 py-5 border-b border-white/8 flex items-center gap-3"
        style={{ background: "linear-gradient(135deg,#e81ccd12,#e81ccd05)" }}>
        <Armchair size={20} className="text-[#e81ccd]" />
        <h3 className="font-black text-white text-base">Table & Chair Calculator</h3>
        <span className="ml-auto text-xs text-gray-500">Instant seating math</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/8">
        {/* Inputs */}
        <div className="p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
              Guest Count: <span className="text-[#e81ccd]">{guests}</span>
            </label>
            <input type="range" min={10} max={250} step={5} value={guests}
              onChange={e => setGuests(Number(e.target.value))}
              className="w-full accent-[#e81ccd]" />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>10</span><span>50</span><span>100</span><span>150</span><span>200+</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-white mb-2">Table Style</p>
            <div className="grid grid-cols-2 gap-2">
              {(["rectangular", "round"] as const).map(s => (
                <button key={s} type="button" onClick={() => setTableStyle(s)}
                  className="py-2.5 px-4 rounded-xl text-sm font-bold border transition-all capitalize"
                  style={tableStyle === s
                    ? { background: "#e81ccd20", borderColor: "#e81ccd60", color: "#e81ccd" }
                    : { borderColor: "#333", color: "#666" }}>
                  {s === "rectangular" ? "6ft Rectangular" : "60\" Round"}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-1.5">
              {tableStyle === "rectangular" ? "Seats ~7 per table (banquet style)" : "Seats ~9 per table (formal style)"}
            </p>
          </div>

          <div className="space-y-2">
            <Toggle label="Include buffet tables" checked={buffetTable} onChange={() => setBuffetTable(p => !p)} />
            <Toggle label="Cake / gift table" checked={cakeTable} onChange={() => setCakeTable(p => !p)} />
            <Toggle label="Cocktail tables for mingling" checked={cocktailTables} onChange={() => setCocktailTables(p => !p)} />
            <Toggle label="Kids table (separate seating)" checked={kidsTable} onChange={() => setKidsTable(p => !p)} />
            {kidsTable && (
              <div className="pl-2">
                <label className="text-xs text-gray-400 mb-1.5 block">
                  Number of kids: <span className="text-[#e81ccd] font-bold">{kidsCount}</span>
                </label>
                <input type="range" min={5} max={40} step={1} value={kidsCount}
                  onChange={e => setKidsCount(Number(e.target.value))}
                  className="w-full accent-[#e81ccd]" />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="p-6 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-[#e81ccd] mb-1">Your Shopping List</p>

          {[
            { label: tableStyle === "rectangular" ? "6ft Rectangular Tables (dining)" : "60\" Round Tables (dining)", value: result.diningTables, icon: <Table2 size={14} className="text-[#e81ccd]" /> },
            ...(result.cocktailCount > 0 ? [{ label: "Cocktail Tables", value: result.cocktailCount, icon: <Table2 size={14} className="text-gray-400" /> }] : []),
            ...(result.kidsTables > 0 ? [{ label: "Kids Tables (6ft rect.)", value: result.kidsTables, icon: <Table2 size={14} className="text-gray-400" /> }] : []),
            ...(result.extraTables > 0 ? [{ label: "Buffet / Gift Tables", value: result.extraTables, icon: <Table2 size={14} className="text-gray-400" /> }] : []),
            { label: "Folding Chairs", value: result.chairsNeeded, icon: <Armchair size={14} className="text-[#e81ccd]" /> },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between p-3.5 rounded-xl border border-white/8 card-dark">
              <div className="flex items-center gap-2">
                {row.icon}
                <span className="text-sm text-gray-300">{row.label}</span>
              </div>
              <span className="font-black text-white text-lg">{row.value}</span>
            </div>
          ))}

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/8 card-dark">
            <span className="text-sm text-gray-500">Linens (optional add-on)</span>
            <span className="font-black text-gray-400">{result.linensNeeded}</span>
          </div>

          <div className="rounded-xl p-3 border border-white/8 bg-white/3 mt-1">
            <p className="text-xs text-gray-500 leading-relaxed">
              +5% chair buffer included for last-minute guests. Buffet configuration uses 2 rectangular tables end-to-end.
            </p>
          </div>

          <Link href={`/quote?guests=${guests}&tables=${tableStyle}`}
            className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-white text-sm transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}>
            <ShoppingCart size={14} />
            Request a Quote with This Seating
          </Link>
        </div>
      </div>
    </div>
  );
}
