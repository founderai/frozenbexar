import Link from "next/link";
import { Calculator, Tent, Armchair, Wind, ArrowRight } from "lucide-react";

type CalcType = "tent" | "table-chair" | "cooler";

const CONFIG: Record<
  CalcType,
  {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    inputs: string[];
    color: string;
    href: string;
  }
> = {
  tent: {
    icon: <Tent size={22} />,
    title: "Tent Size Calculator",
    subtitle:
      "Answer a few questions and find the right canopy for your guest count.",
    inputs: ["How many guests?", "Do you need space for tables + a dance floor?", "Outdoor or covered venue?"],
    color: "#00e64d",
    href: "/tools#tent-calculator",
  },
  "table-chair": {
    icon: <Armchair size={22} />,
    title: "Table & Chair Calculator",
    subtitle:
      "We'll calculate how many tables and chairs you need based on your headcount.",
    inputs: ["Number of guests", "Banquet, round, or cocktail seating?", "Standing room or full seated?"],
    color: "#e81ccd",
    href: "/tools#table-chair-calculator",
  },
  cooler: {
    icon: <Wind size={22} />,
    title: "Cooler Recommendation Tool",
    subtitle:
      "Find out how many evaporative cooler fans you need to keep guests comfortable.",
    inputs: ["Approx. square footage under canopy", "Fully enclosed or open-air?", "Event month"],
    color: "#00b3ff",
    href: "/tools#cooler-calculator",
  },
};

export default function CalculatorPlaceholder({ type }: { type: CalcType }) {
  const c = CONFIG[type];
  return (
    <section
      className="rounded-3xl p-8 sm:p-10 text-center"
      style={{
        border: `2px dashed ${c.color}40`,
        background: `${c.color}06`,
      }}
      aria-label={c.title}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{
          background: `${c.color}18`,
          border: `1.5px solid ${c.color}40`,
          color: c.color,
        }}
      >
        {c.icon}
      </div>
      <h3 className="text-lg font-black text-white mb-2">{c.title}</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">{c.subtitle}</p>

      <div className="max-w-xs mx-auto space-y-2 mb-7">
        {c.inputs.map((label) => (
          <div
            key={label}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-600 text-left"
          >
            {label}
          </div>
        ))}
      </div>

      <Link
        href={c.href}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all hover:scale-[1.03]"
        style={{ borderColor: `${c.color}50`, color: c.color, background: `${c.color}12` }}
      >
        <Calculator size={13} />
        Open Interactive Calculator
        <ArrowRight size={12} />
      </Link>
    </section>
  );
}
