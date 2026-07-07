import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get a Free Quote | Party Rentals San Antonio",
  description:
    "Build your custom party rental package online. Select the items you need, get an instant price estimate, and submit your request. Serving San Antonio, TX and all surrounding areas.",
  alternates: { canonical: "https://frozenbexar.com/quote" },
  openGraph: {
    title: "Get a Free Party Rental Quote | Frozen Bexar San Antonio",
    description:
      "Build your à la carte rental package — chairs, tables, canopies, margarita machines, fans & more. No payment required to request a quote.",
    url: "https://frozenbexar.com/quote",
    images: [{ url: "https://frozenbexar.com/logo.png", alt: "Frozen Bexar Party Rentals" }],
  },
};

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
