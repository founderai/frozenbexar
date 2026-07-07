import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Frozen Bexar | San Antonio Party Rentals",
    short_name: "Frozen Bexar",
    description:
      "San Antonio's premier party rental company. Margarita machines, canopies, tables, chairs & more.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d0d",
    theme_color: "#e81ccd",
    icons: [
      { src: "/favicon.ico", sizes: "48x48",   type: "image/x-icon" },
      { src: "/logo.png",    sizes: "192x192", type: "image/png" },
      { src: "/logo.png",    sizes: "512x512", type: "image/png" },
    ],
  };
}
