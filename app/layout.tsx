import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import FallingBackground from "@/components/FallingBackground";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://frozenbexar.com/#business",
  name: "Frozen Bexar",
  description:
    "San Antonio's premier party rental company. Margarita machines, canopy tents, tables, chairs, cooler fans and more — delivered and set up at your event.",
  url: "https://frozenbexar.com",
  telephone: "+12103132474",
  email: "thefrozenbexar@gmail.com",
  logo: "https://frozenbexar.com/logo.png",
  image: "https://frozenbexar.com/logo.png",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Antonio",
    addressRegion: "TX",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 29.4241,
    longitude: -98.4936,
  },
  areaServed: { "@type": "City", name: "San Antonio", addressRegion: "TX" },
  sameAs: ["https://www.instagram.com/thefrozenbexar"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "08:00",
      closes: "20:00",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Party Rental Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Margarita Machine Rental San Antonio" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Canopy Tent Rental San Antonio" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Table and Chair Rental San Antonio" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Evaporative Cooler Fan Rental San Antonio" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Yard Game Rental San Antonio" } },
    ],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://frozenbexar.com/#organization",
  name: "Frozen Bexar",
  url: "https://frozenbexar.com",
  logo: "https://frozenbexar.com/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+12103132474",
    contactType: "customer service",
    areaServed: "US-TX",
    availableLanguage: "English",
  },
  sameAs: ["https://www.instagram.com/thefrozenbexar"],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://frozenbexar.com"),
  title: {
    default: "Frozen Bexar | San Antonio Party Rentals",
    template: "%s | Frozen Bexar",
  },
  description:
    "San Antonio's premier party rental company. Margarita machines, canopies, tables, chairs, coolers, and more — delivered to your event. Book online today.",
  keywords: [
    "party rentals San Antonio",
    "margarita machine rental San Antonio",
    "canopy rental San Antonio",
    "table chair rental San Antonio TX",
    "event rentals San Antonio",
    "frozen margarita machine rental",
  ],
  alternates: {
    canonical: "https://frozenbexar.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  twitter: {
    card: "summary_large_image",
    title: "Frozen Bexar | San Antonio Party Rentals",
    description:
      "San Antonio's premier party rental company. Margarita machines, canopies, tables, chairs, coolers, and more — delivered to your event.",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://frozenbexar.com",
    siteName: "Frozen Bexar",
    title: "Frozen Bexar | San Antonio Party Rentals",
    description:
      "San Antonio's premier party rental company. Margarita machines, canopies, tables, chairs, coolers, and more — delivered to your event.",
    images: [{ url: "https://frozenbexar.com/logo.png", width: 1200, height: 630, alt: "Frozen Bexar — San Antonio Party Rentals" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <ThemeProvider>
          <FallingBackground />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
