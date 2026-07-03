import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://frozenbexar.com";
  return [
    { url: base,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 1 },
    { url: `${base}/quote`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/products`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`,      lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
  ];
}
