import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://frozenbexar.com",
    siteName: "Frozen Bexar",
    title: "Frozen Bexar | San Antonio Party Rentals",
    description:
      "San Antonio's premier party rental company. Margarita machines, canopies, tables, chairs, coolers, and more — delivered to your event.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frozen Bexar | San Antonio Party Rentals",
    description:
      "San Antonio's premier party rental company. Margarita machines, canopies, tables, chairs, coolers, and more — delivered to your event.",
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
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
