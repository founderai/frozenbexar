import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#e81ccd]/20 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black mb-2" style={{ background: "linear-gradient(135deg,#e81ccd,#00e64d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Frozen Bexar
            </h3>
            <p className="text-[#00e64d] text-xs font-semibold tracking-widest uppercase mb-4">
              San Antonio&apos;s Premier Party Rental Business
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Making your events unforgettable in San Antonio and surrounding areas. From margarita machines to full canopy setups — we&apos;ve got you covered.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4 border-b border-[#e81ccd]/30 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/products", label: "Our Rentals" },
                { href: "/booking", label: "Book an Event" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-gray-400 hover:text-[#e81ccd] text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4 border-b border-[#e81ccd]/30 pb-2">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-[#e81ccd] mt-0.5 shrink-0" />
                San Antonio, Texas
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-[#00e64d] shrink-0" />
                <a href="tel:+12103132474" className="hover:text-[#00e64d] transition-colors">
                  (210) 313-2474
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-[#e81ccd] shrink-0" />
                <a href="mailto:info@frozenbexar.com" className="hover:text-[#e81ccd] transition-colors">
                  info@frozenbexar.com
                </a>
              </li>
            </ul>
            <div className="flex gap-4 mt-5">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#e81ccd]/10 border border-[#e81ccd]/30 flex items-center justify-center hover:bg-[#e81ccd]/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} className="text-[#e81ccd]" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#00e64d]/10 border border-[#00e64d]/30 flex items-center justify-center hover:bg-[#00e64d]/30 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} className="text-[#00e64d]" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Frozen Bexar. All rights reserved.</p>
          <p>Serving San Antonio & Surrounding Areas</p>
        </div>
      </div>
    </footer>
  );
}
