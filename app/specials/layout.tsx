import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deals & Specials | Party Rental Packages San Antonio",
  description:
    "Check out Frozen Bexar's current deals and special package pricing for party rentals in San Antonio. Bundle and save on canopy tents, tables, chairs, margarita machines, and more.",
  alternates: { canonical: "https://frozenbexar.com/specials" },
  openGraph: {
    title: "Party Rental Deals & Specials | Frozen Bexar San Antonio",
    description:
      "Current promotions and bundle deals on party rentals in San Antonio. Canopy packages, margarita machine specials, and more — limited time offers.",
    url: "https://frozenbexar.com/specials",
    images: [{ url: "https://frozenbexar.com/logo.png", alt: "Frozen Bexar Party Rentals" }],
  },
};

export default function SpecialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
