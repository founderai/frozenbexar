"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2, Snowflake, Wind, Umbrella, Tent, Armchair,
  UtensilsCrossed, Lightbulb, Trophy, PanelLeft, Sparkles,
  Table2, X, ShoppingCart, ArrowRight,
} from "lucide-react";
import type { Recommendation } from "@/lib/upsell";

type PriceEntry = { price: string; unit: string; discountNote?: string };

interface UpsellModalProps {
  open:            boolean;
  recommendations: Recommendation[];
  prices:          Record<string, PriceEntry>;
  pricedTotal:     number;
  hasUnpriced:     boolean;
  getQty:          (id: string) => number;
  adjustItem:      (id: string, name: string, delta: number, priceKey?: string) => void;
  onContinue:      () => void;   // "Continue With My Quote" — proceeds to booking
  onDismiss:       () => void;   // "No Thanks, Continue"    — also proceeds to booking
}

function fmtPrice(n: number): string {
  return n % 1 === 0 ? n.toString() : n.toFixed(2);
}

function RecIcon({ icon, color }: { icon: string; color: string }) {
  const s = { color };
  switch (icon) {
    case "Lightbulb":      return <Lightbulb size={20} style={{ color: "#ffe066", filter: "drop-shadow(0 0 4px #ffe06660)" }} />;
    case "PanelLeft":      return <PanelLeft size={20} style={s} />;
    case "Trophy":         return <Trophy size={20} style={s} />;
    case "Snowflake":      return <Snowflake size={20} style={s} />;
    case "Umbrella":       return <Umbrella size={20} style={s} />;
    case "Tent":           return <Tent size={20} style={s} />;
    case "Armchair":       return <Armchair size={20} style={s} />;
    case "Table2":         return <Table2 size={20} style={s} />;
    case "Wind":           return <Wind size={20} style={s} />;
    case "UtensilsCrossed":return <UtensilsCrossed size={20} style={s} />;
    default:               return <Sparkles size={20} style={s} />;
  }
}

export default function UpsellModal({
  open,
  recommendations,
  prices,
  pricedTotal,
  hasUnpriced,
  getQty,
  adjustItem,
  onContinue,
  onDismiss,
}: UpsellModalProps) {
  const overlayRef   = useRef<HTMLDivElement>(null);
  const [prevTotal, setPrevTotal] = useState(pricedTotal);
  const [totalFlash, setTotalFlash] = useState(false);

  // Flash the total whenever pricedTotal increases
  useEffect(() => {
    if (pricedTotal !== prevTotal) {
      setPrevTotal(pricedTotal);
      setTotalFlash(true);
      const t = setTimeout(() => setTotalFlash(false), 600);
      return () => clearTimeout(t);
    }
  }, [pricedTotal, prevTotal]);

  // Trap focus / close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onDismiss(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === overlayRef.current) onDismiss(); }}
    >
      <div
        className="relative w-full sm:max-w-lg bg-[#111] border border-[#e81ccd]/25 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[88vh]"
        style={{ boxShadow: "0 0 60px #e81ccd18, 0 25px 50px rgba(0,0,0,0.6)" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upsell-title"
      >
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-white/8 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#e81ccd]/10 border border-[#e81ccd]/30 rounded-full px-3 py-1 mb-3">
                <Sparkles size={11} className="text-[#e81ccd]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#e81ccd]">One last thing</span>
              </div>
              <h2 id="upsell-title" className="text-xl font-black text-white leading-tight">
                Complete Your Rental
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                A few extras that could make the party even better.
              </p>
            </div>
            <button
              onClick={onDismiss}
              className="shrink-0 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors mt-0.5"
              aria-label="Close"
            >
              <X size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* ── Recommendations ── */}
        <div className="overflow-y-auto px-5 py-4 space-y-3 flex-1">
          {recommendations.map(rec => {
            const inCart  = getQty(rec.id) > 0;
            const priceE  = prices[rec.priceKey ?? rec.id];
            const priceNum = priceE?.price ? parseFloat(priceE.price) : null;

            return (
              <div
                key={rec.id}
                className="rounded-2xl p-4 border transition-all"
                style={inCart
                  ? { background: `${rec.color}08`, borderColor: `${rec.color}50`, boxShadow: `0 0 14px ${rec.color}18` }
                  : { background: "#1a1a1a", borderColor: "#2a2a2a" }}
              >
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div
                    className="shrink-0 w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center"
                    style={{ background: `${rec.color}15` }}
                  >
                    {rec.image ? (
                      <Image src={rec.image} alt={rec.name} width={56} height={56} className="object-cover w-full h-full" />
                    ) : (
                      <RecIcon icon={rec.icon} color={rec.color} />
                    )}
                  </div>

                  {/* Copy */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase tracking-wider mb-0.5" style={{ color: rec.color }}>
                      {rec.headline}
                    </p>
                    <p className="font-bold text-white text-sm leading-snug">{rec.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{rec.copy}</p>
                    {priceNum !== null && (
                      <p className="text-xs font-bold mt-1" style={{ color: rec.color }}>
                        ${fmtPrice(priceNum)}{" "}
                        <span className="font-normal text-gray-500">{priceE?.unit}</span>
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {inCart ? (
                      <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full"
                        style={{ background: `${rec.color}20`, color: rec.color }}>
                        <CheckCircle2 size={12} /> Added
                      </span>
                    ) : (
                      <button
                        onClick={() => adjustItem(rec.id, rec.name, 1, rec.priceKey)}
                        className="text-xs font-bold px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95"
                        style={{ borderColor: `${rec.color}60`, color: rec.color, background: `${rec.color}10` }}
                      >
                        Add +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer: total + actions ── */}
        <div className="px-5 pb-5 pt-3 border-t border-white/8 shrink-0 space-y-3">
          {/* Running total */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <ShoppingCart size={12} /> Current Quote
            </div>
            <span
              className="font-black text-lg transition-all duration-300"
              style={{
                color: totalFlash ? "#ffe066" : "#00e64d",
                transform: totalFlash ? "scale(1.08)" : "scale(1)",
              }}
            >
              {pricedTotal > 0 ? `$${fmtPrice(pricedTotal)}` : "—"}
              {hasUnpriced && pricedTotal > 0 && <span className="text-xs text-gray-500 font-normal ml-1">+</span>}
            </span>
          </div>

          {/* Continue */}
          <button
            onClick={onContinue}
            className="w-full py-3 rounded-xl font-bold uppercase tracking-wide text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
          >
            Continue With My Quote <ArrowRight size={15} />
          </button>

          <button
            onClick={onDismiss}
            className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors"
          >
            No Thanks, Continue Without Add-Ons
          </button>
        </div>
      </div>
    </div>
  );
}
