"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sun, Moon, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Rentals" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <nav className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#e81ccd]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo.png"
              alt="Frozen Bexar Logo"
              width={70}
              height={70}
              className="object-contain"
            />
            <div className="hidden sm:block">
              <p className="text-xs text-[#00e64d] font-semibold tracking-widest uppercase">
                San Antonio&apos;s Premier Party Rental
              </p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link text-sm font-semibold tracking-wide uppercase transition-colors ${
                  pathname === l.href
                    ? "text-[#e81ccd]"
                    : "text-white hover:text-[#e81ccd]"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/quote"
              className={`flex items-center gap-1.5 nav-link text-sm font-semibold tracking-wide uppercase transition-colors ${
                pathname === "/quote" ? "text-[#00e64d]" : "text-white hover:text-[#00e64d]"
              }`}
            >
              <ShoppingCart size={15} /> Build Package
            </Link>
            <Link
              href="/booking"
              className="ml-2 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide bg-gradient-to-r from-[#e81ccd] to-[#b5109e] text-white pulse-glow hover:from-[#ff3de8] hover:to-[#e81ccd] transition-all reserve-glow"
            >
              Reserve Now
            </Link>
            {mounted && (
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="ml-1 p-2 rounded-full border border-[#e81ccd]/30 text-[#e81ccd] hover:bg-[#e81ccd]/10 transition-all"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white hover:text-[#e81ccd] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#111] border-t border-[#e81ccd]/20 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                pathname === l.href ? "text-[#e81ccd]" : "text-white hover:text-[#e81ccd]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/quote"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#00e64d] hover:opacity-80 transition-all"
          >
            <ShoppingCart size={15} /> Build Package
          </Link>
          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="w-full text-center px-5 py-2 rounded-full text-sm font-bold uppercase bg-gradient-to-r from-[#e81ccd] to-[#b5109e] text-white"
          >
            Reserve Now
          </Link>
          {mounted && (
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm font-semibold text-[#e81ccd] hover:opacity-80 transition-all"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
