import Link from "next/link";
import { ChevronRight, ShoppingCart, ArrowRight, Phone } from "lucide-react";
import CalculatorPlaceholder from "./CalculatorPlaceholder";

export type FAQ = { q: string; a: string };
export type Crumb = { label: string; href: string };
export type RelatedLink = { label: string; href: string };

interface Props {
  h1: string;
  badge?: string;
  badgeColor?: string;
  subtitle: string;
  breadcrumbs: Crumb[];
  faqs: FAQ[];
  relatedLinks: RelatedLink[];
  calculator?: "tent" | "table-chair" | "cooler";
  children: React.ReactNode;
}

export default function SeoLandingPage({
  h1,
  badge,
  badgeColor = "#e81ccd",
  subtitle,
  breadcrumbs,
  faqs,
  relatedLinks,
  calculator,
  children,
}: Props) {
  const base = "https://frozenbexar.com";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${base}${c.href}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb Nav */}
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center flex-wrap gap-1 text-xs text-gray-500">
          {breadcrumbs.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={10} className="text-gray-600" />}
              {i < breadcrumbs.length - 1 ? (
                <Link href={c.href} className="hover:text-gray-300 transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className="text-gray-400">{c.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative pt-10 pb-14 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: `${badgeColor}07` }}
          />
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#00e64d]/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {badge && (
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 border"
              style={{
                background: `${badgeColor}15`,
                borderColor: `${badgeColor}40`,
                color: badgeColor,
              }}
            >
              <span className="text-xs font-bold uppercase tracking-widest">{badge}</span>
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 max-w-3xl">
            {h1}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed mb-8">{subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white text-sm transition-all hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
            >
              <ShoppingCart size={15} />
              Get a Free Quote
            </Link>
            <a
              href="tel:2103132474"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm border border-white/20 text-gray-200 hover:border-white/40 hover:text-white transition-all"
            >
              <Phone size={14} />
              (210) 313-2474
            </a>
          </div>
        </div>
      </section>

      {/* Page Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">
        {children}

        {calculator && <CalculatorPlaceholder type={calculator} />}

        {/* FAQ Section */}
        <section id="faq" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-black text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group card-dark rounded-2xl border border-white/8 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer font-bold text-white text-sm list-none hover:text-[#e81ccd] transition-colors select-none">
                  {f.q}
                  <ChevronRight
                    size={14}
                    className="shrink-0 text-gray-500 group-open:rotate-90 transition-transform duration-200"
                  />
                </summary>
                <p className="px-5 pb-5 pt-3 text-sm text-gray-300 leading-relaxed border-t border-white/5">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Pages */}
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-lg font-black text-white mb-4">
            Explore More Rentals
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition-all"
              >
                {l.label}
                <ArrowRight size={11} />
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section
          className="rounded-3xl overflow-hidden px-8 py-12 text-center"
          style={{
            background: "linear-gradient(135deg,#1a001a,#000d00)",
            border: "1.5px solid #e81ccd30",
          }}
        >
          <h2 className="text-2xl font-black text-white mb-3">
            Ready to Book Your San Antonio Event?
          </h2>
          <p className="text-gray-400 text-sm mb-7 max-w-md mx-auto">
            No payment required — pick your items, submit your request, and we&apos;ll
            follow up with your final quote.
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-sm transition-all hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
          >
            <ShoppingCart size={15} />
            Build My Package
          </Link>
        </section>
      </div>
    </>
  );
}
