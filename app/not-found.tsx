import Link from "next/link";
import { Home, Phone, ShoppingCart } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        <div
          className="text-8xl font-black mb-4 leading-none"
          style={{
            background: "linear-gradient(135deg,#e81ccd,#00e64d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </div>

        <h1 className="text-2xl font-black text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Looks like this page took off without us! Let&apos;s get you back to
          the party.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white text-sm transition-all hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
          >
            <Home size={15} />
            Back to Home
          </Link>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white text-sm transition-all hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg,#00e64d,#00b33c)" }}
          >
            <ShoppingCart size={15} />
            Get a Quote
          </Link>
          <a
            href="tel:2103132474"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-all"
          >
            <Phone size={15} />
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
}
