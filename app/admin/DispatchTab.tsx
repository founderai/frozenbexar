"use client";

import { useState, useEffect, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

interface DispatchItem { name: string; qty: number }
interface DispatchRental {
  id: string; customer: string; address: string;
  dropoff: string; pickup: string; items: DispatchItem[]; status: string;
}
interface DayPlan {
  date: string;
  dropoffs: DispatchRental[];
  pickups: DispatchRental[];
  netToPull: { name: string; drops: number; picks: number; net: number }[];
  routeLoad: { name: string; load: number; best: number; back: number; extra: number }[];
  availability: { name: string; total: number; committed: number; free: number; over: boolean }[];
}

function offsetDate(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

export default function DispatchTab() {
  const todayYMD = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayYMD);
  const [plan, setPlan] = useState<DayPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchPlan = useCallback(async (d: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dispatch/${d}`);
      const data: DayPlan & { error?: string } = await res.json();
      if (data.error) throw new Error(data.error);
      setPlan(data);
      setLastUpdated(new Date());
      setFetchError(null);
    } catch (e) {
      setFetchError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlan(date);
    const interval = setInterval(() => fetchPlan(date), 25000);
    return () => clearInterval(interval);
  }, [date, fetchPlan]);

  const oversoldCount = plan?.availability.filter((a) => a.over).length ?? 0;

  return (
    <div className="space-y-6">

      {/* Date nav + refresh */}
      <div className="card-dark rounded-3xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setDate((d) => offsetDate(d, -1))}
              className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="text-center min-w-[160px]">
              <p className="text-xl font-black text-white">{format(parseISO(date), "EEEE")}</p>
              <p className="text-sm text-gray-400">{format(parseISO(date), "MMMM d, yyyy")}</p>
            </div>
            <button onClick={() => setDate((d) => offsetDate(d, 1))}
              className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            {date !== todayYMD && (
              <button onClick={() => setDate(todayYMD)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 border border-white/10 hover:text-white transition-colors">
                Today
              </button>
            )}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full ${loading ? "bg-yellow-400 animate-pulse" : "bg-[#00e64d]"}`} />
              {loading ? "Refreshing…" : lastUpdated ? `Updated ${format(lastUpdated, "h:mm a")}` : ""}
            </div>
            <button onClick={() => fetchPlan(date)} disabled={loading}
              className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white disabled:opacity-40 transition-colors">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3 text-center">Auto-refreshes every 25 s — new bookings appear automatically.</p>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="card-dark rounded-2xl p-4 border border-red-500/30 text-red-400 text-sm">
          {fetchError.toLowerCase().includes("supabase") || fetchError.toLowerCase().includes("fetch")
            ? "Supabase not configured — add SUPABASE_URL and SUPABASE_SERVICE_KEY to .env.local and restart."
            : fetchError}
        </div>
      )}

      {/* Stats */}
      {plan && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Drop-offs", value: plan.dropoffs.length, color: "#e81ccd" },
              { label: "Pick-ups", value: plan.pickups.length, color: "#00e64d" },
              { label: "Item types moving", value: plan.netToPull.length, color: "#f5e642" },
              { label: "Oversold", value: oversoldCount, color: oversoldCount > 0 ? "#e82020" : "#00e64d" },
            ].map((s) => (
              <div key={s.label} className="card-dark rounded-2xl p-4">
                <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Drop-offs / Pick-ups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-[#e81ccd] mb-3">
                Drop-offs ({plan.dropoffs.length})
              </h2>
              {plan.dropoffs.length === 0
                ? <div className="card-dark rounded-2xl p-6 text-center text-gray-600 text-sm">No drop-offs this day.</div>
                : <div className="space-y-3">
                    {plan.dropoffs.map((r) => (
                      <div key={r.id} className="card-dark rounded-2xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-white text-sm">{r.customer || "—"}</p>
                            {r.address && <p className="text-gray-400 text-xs mt-0.5">{r.address}</p>}
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            r.status === "confirmed"
                              ? "border-[#00e64d]/30 bg-[#00e64d]/10 text-[#00e64d]"
                              : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                          }`}>{r.status}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {r.items.map((it) => (
                            <span key={it.name}
                              className="text-xs bg-[#e81ccd]/10 border border-[#e81ccd]/20 rounded-full px-2.5 py-0.5 text-[#e81ccd]">
                              {it.name} ×{it.qty}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-[#00e64d] mb-3">
                Pick-ups ({plan.pickups.length})
              </h2>
              {plan.pickups.length === 0
                ? <div className="card-dark rounded-2xl p-6 text-center text-gray-600 text-sm">No pick-ups this day.</div>
                : <div className="space-y-3">
                    {plan.pickups.map((r) => (
                      <div key={r.id} className="card-dark rounded-2xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-white text-sm">{r.customer || "—"}</p>
                            {r.address && <p className="text-gray-400 text-xs mt-0.5">{r.address}</p>}
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-[#00e64d]/30 bg-[#00e64d]/10 text-[#00e64d] shrink-0">
                            {r.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {r.items.map((it) => (
                            <span key={it.name}
                              className="text-xs bg-[#00e64d]/10 border border-[#00e64d]/20 rounded-full px-2.5 py-0.5 text-[#00e64d]">
                              {it.name} ×{it.qty}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>

          {/* Net to Pull / Route Load */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-dark rounded-2xl p-5">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#f5e642] mb-4">Net to Pull from Shop</h2>
              {plan.netToPull.length === 0
                ? <p className="text-gray-600 text-sm text-center py-4">Nothing to move today.</p>
                : <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                          <th className="text-left pb-2 font-semibold">Item</th>
                          <th className="text-right pb-2 font-semibold">Drops</th>
                          <th className="text-right pb-2 font-semibold">Picks</th>
                          <th className="text-right pb-2 font-semibold">Net</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {plan.netToPull.map((row) => (
                          <tr key={row.name}>
                            <td className="py-2 text-gray-300">{row.name}</td>
                            <td className="py-2 text-right text-[#e81ccd]">{row.drops}</td>
                            <td className="py-2 text-right text-[#00e64d]">{row.picks}</td>
                            <td className={`py-2 text-right font-black ${row.net > 0 ? "text-white" : "text-[#00e64d]"}`}>
                              {row.net > 0 ? `+${row.net}` : row.net}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-xs text-gray-600 mt-3">
                      Net &gt; 0 = pull from shop · Net &lt; 0 = surplus returns to shop
                    </p>
                  </div>
              }
            </div>

            <div className="card-dark rounded-2xl p-5">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#e81ccd] mb-4">Route Load (Truck)</h2>
              {plan.routeLoad.length === 0
                ? <p className="text-gray-600 text-sm text-center py-4">Nothing to load today.</p>
                : <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                          <th className="text-left pb-2 font-semibold">Item</th>
                          <th className="text-right pb-2 font-semibold">Load</th>
                          <th className="text-right pb-2 font-semibold">Best</th>
                          <th className="text-right pb-2 font-semibold">Back</th>
                          <th className="text-right pb-2 font-semibold">Extra</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {plan.routeLoad.map((row) => (
                          <tr key={row.name}>
                            <td className="py-2 text-gray-300">{row.name}</td>
                            <td className="py-2 text-right text-white font-black">{row.load}</td>
                            <td className="py-2 text-right text-gray-400">{row.best}</td>
                            <td className="py-2 text-right text-[#00e64d]">{row.back}</td>
                            <td className={`py-2 text-right font-bold ${row.extra > 0 ? "text-yellow-400" : "text-gray-600"}`}>
                              {row.extra > 0 ? `+${row.extra}` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-xs text-gray-600 mt-3">
                      Load = units from shop · Extra = overhead vs. best-case pick-up-first order
                    </p>
                  </div>
              }
            </div>
          </div>

          {/* Availability snapshot */}
          <div className="card-dark rounded-2xl p-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#00e64d] mb-4">
              Inventory Snapshot — {format(parseISO(date), "MMMM d")}
            </h2>
            {plan.availability.length === 0
              ? <p className="text-gray-600 text-sm text-center py-4">No inventory configured. Add items in the Supabase inventory table.</p>
              : <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                        <th className="text-left pb-2 font-semibold">Item</th>
                        <th className="text-right pb-2 font-semibold">Total</th>
                        <th className="text-right pb-2 font-semibold">Out</th>
                        <th className="text-right pb-2 font-semibold">Free</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {plan.availability.map((row) => (
                        <tr key={row.name} className={row.over ? "bg-red-500/5" : ""}>
                          <td className="py-2">
                            <span className="text-gray-300">{row.name}</span>
                            {row.over && (
                              <span className="ml-2 text-xs text-red-400 font-black">OVERSOLD</span>
                            )}
                          </td>
                          <td className="py-2 text-right text-gray-400">{row.total}</td>
                          <td className="py-2 text-right text-[#e81ccd]">{row.committed}</td>
                          <td className={`py-2 text-right font-black ${
                            row.free <= 0 ? "text-red-400" : row.free === 1 ? "text-yellow-400" : "text-[#00e64d]"
                          }`}>
                            {row.free}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            }
          </div>
        </>
      )}

      {!plan && !loading && !fetchError && (
        <div className="card-dark rounded-2xl p-10 text-center text-gray-600 text-sm">
          Loading dispatch plan…
        </div>
      )}
    </div>
  );
}
