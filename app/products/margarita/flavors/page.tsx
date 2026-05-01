import Link from "next/link";
import { ArrowLeft, GlassWater, AlertCircle } from "lucide-react";

const flavors = [
  { name: "Lime (Classic)", note: "Comes with machine rental", alcohol: "2-3 Liters of Tequila, ½ Liter of Triple Sec", classic: true },
  { name: "Strawberry", alcohol: "2-3 Liters of Tequila" },
  { name: "Mango", alcohol: "2 Liters of Choice" },
  { name: "Pina", alcohol: "2 Liters of Rum" },
  { name: "Cola", alcohol: "2 Liters of Bourbon or Whiskey" },
  { name: "Cherry", alcohol: "2 Liters of Choice" },
  { name: "Blue Raspberry", alcohol: "2 Liters of Choice" },
  { name: "Dreamsicle", alcohol: "2 Liters of Vodka" },
  { name: "TKO", alcohol: "2 Liters of Rum" },
  { name: "Watermelon", alcohol: "2 Liters of Choice" },
  { name: "Blue Hawaiian", alcohol: "2 Liters of Rum (suggest coconut)" },
  { name: "Frose", alcohol: "2 Liters of Vodka or 5 Bot Rosé Wine" },
  { name: "Hurricane", alcohol: "2 Liters of Rum" },
  { name: "Mai Tai", alcohol: "2 Liters of Rum" },
  { name: "Feelin' No Pain", alcohol: "2 Liters of Rum" },
  { name: "Peach Bellini", alcohol: "2 L of Rum — Or — 1 L Rum, 5 Bot Cham, ½ Peach Schnapps" },
  { name: "Sangria", alcohol: "5 Bot Red Wine, ½ Liter of Brandy" },
  { name: "SLemonade", alcohol: "2 Liters of Tequila" },
  { name: "Green Apple", alcohol: "2 Liters of Vodka or Rum" },
  { name: "Strawberry Banana", alcohol: "2 Liters of Vodka or Rum" },
  { name: "Mojito", alcohol: "2 Liters of Rum" },
];

export const metadata = {
  title: "Margarita Flavors | Frozen Bexar",
  description: "Browse all available frozen margarita flavors from Frozen Bexar — including alcohol amounts for each flavor.",
};

export default function FlavorsPage() {
  return (
    <>
      {/* Header */}
      <section className="relative pt-14 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e81ccd]/10 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#00e64d]/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/products/margarita"
            className="inline-flex items-center gap-2 text-sm font-semibold mb-10 text-[#00e64d] hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={16} /> Back to Margarita Machines
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <GlassWater size={36} className="text-[#e81ccd]" />
            <h1 className="text-4xl sm:text-5xl font-black text-white">
              Available{" "}
              <span style={{ background: "linear-gradient(135deg,#e81ccd,#ff6ef7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Flavors
              </span>
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl">
            Choose from our full lineup of frozen drink flavors. Each listing shows the amount of liquor needed — <span className="text-[#00e64d] font-semibold">water is not included</span> in these amounts.
          </p>
        </div>
      </section>

      {/* Lead time notice */}
      <section className="pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl px-5 py-4 border border-[#f5e642]/30 bg-[#f5e642]/5">
            <AlertCircle size={18} className="text-[#f5e642] shrink-0 mt-0.5" />
            <p className="text-sm text-[#f5e642] font-medium">
              Please note: We usually require a <span className="font-bold">2 week lead time</span> on getting specialty margarita flavors.
            </p>
          </div>
        </div>
      </section>

      {/* Flavors Table */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-dark rounded-3xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_1fr] gap-px bg-[#e81ccd]/20">
              <div className="bg-[#0d0d0d] px-6 py-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#e81ccd]">Flavor</span>
              </div>
              <div className="bg-[#0d0d0d] px-6 py-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00e64d]">Amount of Liquor</span>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
              {flavors.map((flavor, i) => (
                <div
                  key={flavor.name}
                  className={`grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-0 transition-colors hover:bg-white/[0.03] ${
                    flavor.classic ? "bg-[#00e64d]/5" : ""
                  }`}
                >
                  <div className="px-6 py-4 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-white/5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-sm ${flavor.classic ? "text-[#00e64d]" : "text-white"}`}>
                        {flavor.name}
                      </span>
                      {flavor.classic && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#00e64d]/15 text-[#00e64d] border border-[#00e64d]/30">
                          Included
                        </span>
                      )}
                    </div>
                    {flavor.note && (
                      <p className="text-xs text-gray-500 mt-0.5">{flavor.note}</p>
                    )}
                  </div>
                  <div className="px-6 py-4 flex items-center">
                    <span className="text-sm text-gray-300">{flavor.alcohol}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <p className="text-gray-400 mb-5 text-sm">Ready to book? Pick your flavor and we'll handle the rest.</p>
            <Link
              href="/booking"
              className="inline-block px-10 py-4 rounded-full font-bold uppercase tracking-wide text-white reserve-glow transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
            >
              Reserve a Margarita Machine
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
