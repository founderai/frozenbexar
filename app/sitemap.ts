import { MetadataRoute } from "next";
import { products } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://frozenbexar.com";
  const now = new Date();

  const productPages: MetadataRoute.Sitemap = products.map(p => ({
    url: `${base}/products/${p.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const seoPages: MetadataRoute.Sitemap = [
    "party-rentals-san-antonio",
    "tent-rentals-san-antonio",
    "table-chair-rentals-san-antonio",
    "margarita-machine-rentals-san-antonio",
    "evaporative-cooler-rentals-san-antonio",
    "graduation-party-rentals-san-antonio",
    "backyard-party-rentals-san-antonio",
    "wedding-rentals-san-antonio",
    "corporate-event-rentals-san-antonio",
  ].map(slug => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [
    { url: base,                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/about`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/products`,      lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/specials`,      lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/quote`,         lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/contact`,       lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
    ...seoPages,
    ...productPages,
  ];
}
