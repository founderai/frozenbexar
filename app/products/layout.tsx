import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Party Rental Equipment | Tables, Chairs, Canopies & More",
  description:
    "Browse Frozen Bexar's full party rental catalog. Margarita machines, canopy tents, tables, chairs, evaporative cooler fans, string lights, and yard games — all delivered to your event in San Antonio, TX.",
  alternates: { canonical: "https://frozenbexar.com/products" },
  openGraph: {
    title: "Party Rental Equipment San Antonio | Frozen Bexar",
    description:
      "Browse our full catalog: margarita machines, canopy tents, tables, chairs, cooler fans, lights, and yard games. Delivered to your event in San Antonio and surrounding areas.",
    url: "https://frozenbexar.com/products",
    images: [{ url: "https://frozenbexar.com/logo.png", alt: "Frozen Bexar Party Rentals" }],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
