import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Party Rentals San Antonio",
  description:
    "Get in touch with Frozen Bexar. Call, text, or send us a message to book your party rental equipment in San Antonio, TX. We respond quickly!",
  alternates: { canonical: "https://frozenbexar.com/contact" },
  openGraph: {
    title: "Contact Frozen Bexar | San Antonio Party Rentals",
    description:
      "Reach out to Frozen Bexar to book party rentals in San Antonio. Call or text (210) 313-2474, or send us a message online.",
    url: "https://frozenbexar.com/contact",
    images: [{ url: "https://frozenbexar.com/logo.png", alt: "Frozen Bexar Party Rentals" }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
